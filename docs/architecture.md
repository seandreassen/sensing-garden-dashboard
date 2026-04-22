# Architecture Documentation — Sensing Garden Dashboard

The architecture is described using Kruchten's **4+1 View Model**. Each view answers a different question:

| View                  | Question                                       | Audience              |
| --------------------- | ---------------------------------------------- | --------------------- |
| Logical               | What does the system consist of, functionally? | End users, designers  |
| Process               | How does the system behave at runtime?         | Integrators           |
| Development           | How is the code organized?                     | Developers            |
| Physical (Deployment) | Where does it run?                             | Operations / sysadmin |
| Scenarios (+1)        | How does it work in practice?                  | Everyone              |

The dashboard is a React 19 SPA (Vite + TanStack Router/Query) that visualizes data from the Sensing Garden backend. All state lives either in the URL (filters via query params) or in the TanStack Query cache (server data). There is no separate backend in this repo — the app talks directly to the REST API on AWS API Gateway.

## Domain model

The system revolves around four core concepts:

- **Deployment** — a collection of one or more hubs grouped together at a physical location (e.g. a rooftop or park). Each deployment has a lifetime (start/end date), a location, and an optional flowerbed image. Deployments also carry pre-computed aggregate metrics (top taxa, counts) to avoid re-computing them on every dashboard load.
- **Hub** (also called _device_ in the API/code) — a Raspberry Pi 5 + Hailo AI HAT edge unit with attached camera and environmental sensors. A hub belongs to exactly one active deployment at a time and is the source of all observations and environmental readings for that site.
- **Observation** — a single insect detection produced by a hub, stored with a taxonomic classification, an AI confidence score, a timestamp, and a link to the original image in S3.
- **AI model** — each deployment is associated with the model version its hubs ran during that deployment window. The model's metadata ("Model Card") is exposed in the dashboard so users can judge the provenance of the predictions.

```mermaid
classDiagram
    class Deployment {
        id
        name
        location
        start_date
        end_date
        flowerbed_image
        aggregate_metrics
    }
    class Hub {
        id
        name
        hardware
    }
    class Observation {
        id
        timestamp
        taxon
        confidence
        image_url
    }
    class EnvironmentReading {
        timestamp
        temperature
        humidity
        air_quality
    }
    class AIModel {
        id
        version
        model_card
    }

    Deployment "1" o-- "1..*" Hub : contains
    Deployment "1" --> "1" AIModel : uses
    Hub "1" --> "*" Observation : records
    Hub "1" --> "*" EnvironmentReading : records
```

---

## 1. Logical View

Shows the main components, their responsibilities, and dependency directions. The layering mirrors the folder structure under `src/`.

```mermaid
graph TB
    subgraph UI["UI layer (React components)"]
        Routes["Routes<br/>(TanStack file-based)"]
        LandingPage["Landing page<br/>DeploymentGrid, HeroCarousel"]
        DeploymentLayout["Deployment layout<br/>Header, Tabs, FiltersRow"]
        Overview["Overview<br/>InsectCount, SpeciesRichness, TopTaxa"]
        Analytics["Analytics<br/>Heatmap, AirQuality, Treemap"]
        Observations["Observations<br/>DataTable + Dialog"]
        Info["Info<br/>DeploymentInfo, Devices, Map"]
        Editor["Deployment Editor<br/>Edit cards"]
        Filters["Filters<br/>Date, Hub, Taxonomy, Confidence"]
        UiKit["UI kit (ui/)<br/>Card, Button, Table, Dialog, ..."]
    end

    subgraph Domain["Domain and state layer (lib/)"]
        Hooks["Query hooks<br/>useDeployments, useObservations,<br/>useEnvironment, useTaxaCount, ..."]
        Mutations["Mutation hooks<br/>useDeploymentMutations,<br/>useDeviceMutations"]
        FilterHook["useFilters<br/>(URL ↔ state)"]
        Utils["Utils<br/>filters, queryParameters,<br/>heatmap, timeSeries, location"]
        Types["Types<br/>lib/types/api.ts"]
    end

    subgraph Infra["Infrastructure"]
        Env["env.ts<br/>(validated via zod/t3-env)"]
        QueryClient["TanStack QueryClient<br/>(cache)"]
        Router["TanStack Router<br/>(URL + search params)"]
    end

    subgraph External["External services"]
        API["Sensing Garden REST API<br/>(AWS API Gateway)"]
        Maps["Google Maps<br/>Platform"]
    end

    Routes --> LandingPage
    Routes --> DeploymentLayout
    DeploymentLayout --> Overview
    DeploymentLayout --> Analytics
    DeploymentLayout --> Observations
    DeploymentLayout --> Info
    DeploymentLayout --> Editor
    DeploymentLayout --> Filters

    Overview & Analytics & Observations & Info & Editor & Filters --> UiKit
    Overview & Analytics & Observations --> Hooks
    Editor --> Mutations
    Filters --> FilterHook
    Info --> Maps

    Hooks --> Utils
    Hooks --> Types
    Mutations --> Types
    FilterHook --> Router

    Hooks --> QueryClient
    Mutations --> QueryClient
    Hooks --> Env
    Mutations --> Env
    QueryClient --> API
    Hooks -.HTTP.-> API
    Mutations -.HTTP.-> API
```

### Key abstractions

- **Routes** — one file per URL under `src/routes/`. `_filterLayout` is a "pathless layout route" that shares Header/Tabs/FiltersRow across all sub-pages for a single deployment.
- **Query hooks** — thin wrappers around `fetch` + `useQuery`. One hook per endpoint. Response types are centrally defined in `lib/types/api.ts`.
- **`useFilters`** — reads/writes filter state to URL search parameters, validated with Zod (`filtersSchema`). Enables shareable links and browser "back" support.
- **UI kit** (`components/ui/`) — shadcn-inspired Base UI components. Reusable building blocks with no domain knowledge.

---

## 2. Process View

Shows runtime behavior: startup, data flow, and concurrent fetches. The app has only one process (a browser tab), but multiple async operations are coordinated by TanStack Query.

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant B as Browser / React
    participant R as TanStack Router
    participant Q as TanStack Query Cache
    participant API as Sensing Garden API
    participant GM as Google Maps

    U->>B: Loads / (root)
    B->>R: Matches route "/"
    R->>B: Render index.tsx
    B->>Q: useDeployments()
    Q->>API: GET /deployments?limit=100
    API-->>Q: JSON deployments
    Q-->>B: Cached data
    B-->>U: Renders DeploymentGrid

    U->>B: Clicks deployment
    B->>R: Navigate /deployment/:id/overview
    R->>B: Render _filterLayout + overview
    par Parallel fetching
        B->>Q: useObservationsTimeSeries
        Q->>API: GET /classifications/time_series
    and
        B->>Q: useTaxaCount
        Q->>API: GET /classifications/taxa_count
    and
        B->>Q: useObservationCount
        Q->>API: GET /classifications/count
    end
    API-->>Q: Responses
    Q-->>B: Data
    B-->>U: Renders cards + charts

    U->>B: Changes filter (e.g. date)
    B->>R: navigate({ search: ... }) (replace)
    R->>B: New query param → useFilters new value
    B->>Q: New queryKey → refetch
    Q->>API: GET /... (new params)
    API-->>Q: Updated data
    Q-->>B: Re-render

    Note over B,GM: On the Info tab, Google Maps<br/>JS SDK is loaded separately for map rendering
    B->>GM: load maps script
    GM-->>B: Map components
```

### Characteristics

- **No global state manager** — the cache is the source of truth for server data; the URL is the source of truth for filter state.
- **Cache invalidation** happens after mutations (`queryClient.invalidateQueries(["deployments"])`, etc.).
- **Preload on intent** — router has `defaultPreload: "intent"`, so hovering a link pre-fetches route data.
- **Parallel fetch** — independent hooks in the same render trigger parallel requests; React Query dedupes them.
- **Export** (`ExportData`) performs an ad-hoc fetch for ZIP/CSV/JSON and uses `JSZip` + `Blob` + object URLs for client-side download.

---

## 3. Development View

Source code organization as seen by the developer. The alias `@/` points to `src/`.

```mermaid
graph LR
    subgraph root["Repo root"]
        cfg["vite.config.ts<br/>tsconfig.*<br/>playwright.config.ts<br/>vitest.config.ts<br/>.oxlintrc.json<br/>.oxfmtrc.json"]
        pkg["package.json<br/>pnpm-lock.yaml"]
    end

    subgraph src["src/"]
        main["main.tsx<br/>(entry)"]
        env["env.ts"]
        tree["routeTree.gen.ts<br/>(auto-generated)"]
        routes["routes/"]
        comps["components/"]
        libdir["lib/"]
        assets["assets/"]
        css["index.css"]
    end

    subgraph routesDir["routes/"]
        rroot["__root.tsx"]
        rindex["index.tsx"]
        rdep["deployment/\$deploymentId/\$.tsx"]
        rlayout["deployment/\$deploymentId/_filterLayout.tsx"]
        rtabs["_filterLayout/<br/>overview.tsx · analytics.tsx ·<br/>observations.tsx · info.tsx ·<br/>edit.tsx · index.tsx"]
    end

    subgraph compsDir["components/"]
        uikit["ui/<br/>(Button, Card, Dialog, ...)"]
        feature["feature folders:<br/>landingPage/ · deploymentLayout/<br/>overview/ · analytics/<br/>observations/ · info/<br/>map/ · deploymentEditor/<br/>filters/ · deployments/"]
        shared["Shared:<br/>RootHeader.tsx · ExportData.tsx<br/>NotFound.tsx"]
    end

    subgraph libDir["lib/"]
        hooks["hooks/<br/>(useDeployments, useObservations,<br/>useFilters, useEnvironment, ...)"]
        types["types/api.ts"]
        utils["utils/<br/>(filters, queryParameters,<br/>heatmap, timeSeries, location,<br/>headers, index)"]
    end

    subgraph tests["tests/"]
        unit["unit/<br/>heatmap · location ·<br/>queryParameters · timeSeries"]
        component["component/<br/>NotFound.test.tsx"]
        e2e["e2e/<br/>info.test.ts (+ snapshots)"]
        render["render.tsx<br/>(test helper)"]
    end

    main --> tree
    main --> env
    tree --> routes
    routes --> comps
    routes --> libdir
    comps --> libdir
    libdir --> env
```

### Conventions (from `CONTRIBUTING.md`)

- React components use PascalCase and live in `src/components/<feature>/`.
- UI primitives from shadcn (Base UI variant) go in `components/ui/`.
- Data fetching uses TanStack Query hooks in `lib/hooks/`.
- No inline `export` — a single `export { ... }` at the bottom of the file (except `Route` in routes).
- Tailwind for styling, with custom theme tokens (`text-muted-foreground`, not `text-zinc-400`).
- Oxlint + Oxfmt run via `simple-git-hooks` as a pre-commit hook.

### Test pyramid

- Unit (`vitest`): pure utility functions.
- Component (`vitest` + `vitest-browser-react`): top-level components.
- E2E (`playwright`): route/page level, including visual snapshots.

---

## 4. Physical View (Deployment)

Where does the application run in production?

The dashboard is only one of three physical tiers in the overall Flik system: the **field sites** (edge devices), the **AWS cloud** (API + storage), and the **end-user dashboard** running in a browser. This repo owns the dashboard tier, but its design is shaped by what the other two tiers produce and accept.

```mermaid
graph TB
    subgraph Field["Field sites (per deployment)"]
        Hub["Hub — Raspberry Pi 5 + Hailo AI HAT<br/>runs insect detection/classification on-device"]
        Cam["Camera"]
        EnvSensors["Environmental sensors<br/>(temperature, humidity, air quality)"]
    end

    subgraph Client["Client (browser)"]
        SPA["Sensing Garden Dashboard<br/>React SPA bundle<br/>(HTML + JS + CSS, chunked by route)"]
    end

    subgraph CDN["Static hosting"]
        Host["Vite build output<br/>dist/ served as static files"]
    end

    subgraph AWS["AWS cloud"]
        APIGW["API Gateway<br/>nxdp0npcb2.execute-api.<br/>us-east-1.amazonaws.com"]
        Lambda["Backend<br/>(Python lambdas / sensing_garden_client)"]
        DB[("DynamoDB<br/>observations, environment,<br/>deployments, hubs/devices")]
        S3[("S3<br/>observation and<br/>deployment images")]
    end

    subgraph Google["Google"]
        MapsSDK["Maps JS SDK<br/>+ Tile API"]
    end

    subgraph Dev["Developer environment"]
        Node["Node.js"]
        Pnpm["pnpm"]
        Vite["vite dev server<br/>pnpm dev"]
        Playwright["Playwright browsers"]
    end

    Cam --> Hub
    EnvSensors --> Hub
    Hub -->|push observations<br/>+ sensor data| APIGW

    User((User)) -->|HTTPS| Host
    Host -->|HTTPS| SPA
    SPA -->|HTTPS + X-Api-Key| APIGW
    APIGW --> Lambda
    Lambda --> DB
    Lambda --> S3
    SPA -->|HTTPS| MapsSDK
    SPA -.image URL.-> S3

    Vite -->|build| Host
    Dev -.CI/hosting.-> Host
```

### Runtime assumptions

- The SPA bundle only needs static hosting (CDN / object storage) — no server-side rendering.
- `.env` must contain `VITE_API_BASE_URL`, `VITE_API_KEY`, and optionally `VITE_GOOGLE_MAPS_API_KEY`. These are baked into the bundle by `vite build` and are therefore public. The API key should consequently be restricted on the server side.
- Authentication: every call attaches the `X-Api-Key` header (see `lib/utils/headers.ts`).

---

## 5. Scenarios (+1)

The dashboard has two primary stakeholder groups whose use cases drive the scenarios below:

- **Biologist / Researcher** — inspects ecological patterns, compares trends across sites and time, and validates individual detections against the original images.
- **Technical stakeholder** — manages deployments and hubs, keeps an eye on data quality and hub status, and needs visibility into which AI model produced which data.

```mermaid
graph LR
    Biologist((Biologist /<br/>Researcher))
    Tech((Technical<br/>stakeholder))

    UC1[View top insect taxa<br/>per deployment or hub]
    UC2[Filter observations<br/>by time, species, site]
    UC3[Overlay environmental data<br/>on insect abundance]
    UC4[Inspect observation image<br/>with AI confidence]
    UC5[Download raw data<br/>CSV / JSON / ZIP + README]
    UC6[View deployment info<br/>and sensor locations on map]
    UC7[Browse past deployments]
    UC8[Create deployment<br/>and connect hubs]
    UC9[Access AI Model Card<br/>and technical metadata]
    UC10[Monitor hub status<br/>and data gaps]

    Biologist --> UC1
    Biologist --> UC2
    Biologist --> UC3
    Biologist --> UC4
    Biologist --> UC5
    Biologist --> UC6
    Biologist --> UC7
    Tech --> UC6
    Tech --> UC8
    Tech --> UC9
    Tech --> UC10
```

The four scenarios below tie the other views together and show how these use cases are realized end-to-end.

### Scenario A — View data for a deployment

```mermaid
flowchart LR
    A[User opens /] --> B[Sees active/inactive deployments]
    B --> C[Clicks a card]
    C --> D[Route /deployment/:id/overview loads]
    D --> E[_filterLayout renders Header + Tabs + FiltersRow]
    E --> F[Overview tab fetches in parallel:<br/>count, time series, top taxa]
    F --> G[Cards with numbers and charts shown]
```

### Scenario B — Filter observations and export

```mermaid
sequenceDiagram
    actor U as User
    participant UI as FiltersRow
    participant F as useFilters
    participant R as Router
    participant Q as Query cache
    participant API as API
    participant Exp as ExportData

    U->>UI: Sets date, hub, confidence
    UI->>F: updateFilters(...)
    F->>R: navigate(search=..., replace=true)
    R->>F: New search state
    F-->>Q: New queryKeys → refetch
    Q->>API: GET /classifications (new params)
    API-->>Q: Filtered observations
    Q-->>UI: Table re-renders

    U->>Exp: Selects CSV/JSON/Images
    Exp->>Q: Get observations (same filter)
    Exp->>API: Possibly GET image URLs
    Exp-->>U: Download zip/CSV/JSON (client-side)
```

### Scenario C — Biologist inspects an observation image

```mermaid
sequenceDiagram
    actor B as Biologist
    participant UI as Dashboard UI
    participant Obs as useObservations
    participant Img as useObservationImage
    participant API as sensing_garden_client API
    participant DB as DynamoDB
    participant S3 as S3

    B->>UI: Opens deployment detail
    UI->>Obs: useObservations(deploymentId, filters)
    Obs->>API: GET /observations?deploymentId=...
    API->>DB: SELECT observations
    DB-->>API: Observation list
    API-->>Obs: Observations (with imageUrl)
    Obs-->>UI: Render observation table

    B->>UI: Clicks a row
    UI->>Img: useObservationImage(observationId)
    Img->>API: GET /image/{observationId}
    API->>S3: Fetch image blob
    S3-->>API: Image data
    API-->>Img: Image URL / data
    Img-->>UI: Modal with photo, species label,<br/>confidence score
```

### Scenario D — Edit deployment (CRUD)

```mermaid
sequenceDiagram
    actor U as User
    participant Edit as edit.tsx
    participant H as useDeployment
    participant M as useDeploymentMutations
    participant API as API
    participant QC as QueryClient

    U->>Edit: Opens /deployment/:id/edit
    Edit->>H: Fetch deployment + devices
    H->>API: GET /deployments/:id
    API-->>H: Deployment + devices
    H-->>Edit: Pre-filled form

    U->>Edit: Edits fields, devices, image
    U->>Edit: Clicks "Save"
    Edit->>M: saveDeployment({name, dates, image, devices, initialDevices})
    par PATCH + device diff
        M->>API: PATCH /deployments/:id
    and
        M->>API: POST/PATCH/DELETE /deployments/:id/devices/...
    end
    API-->>M: 200
    M->>QC: invalidate ["deployments"], ["deployment", id]
    QC-->>Edit: Fresh data

    U->>Edit: Clicks "Delete"
    Edit->>API: DELETE /deployments/:id
    API-->>Edit: 200
    Edit->>QC: invalidate ["deployments"]
    Edit-->>U: Navigate to /
```

---

## Appendix — Key technologies

| Area             | Choice                                                                              |
| ---------------- | ----------------------------------------------------------------------------------- |
| Language/runtime | TypeScript, React 19, Node (dev), pnpm                                              |
| Bundler/dev      | Vite 8, `@vitejs/plugin-react`, `@tailwindcss/vite`                                 |
| Routing          | `@tanstack/react-router` (file-based) + `@tanstack/zod-adapter`                     |
| Data/cache       | `@tanstack/react-query`                                                             |
| Table            | `@tanstack/react-table`                                                             |
| UI               | Base UI (`@base-ui/react`), Tailwind v4, `class-variance-authority`, `lucide-react` |
| Maps             | `@vis.gl/react-google-maps`                                                         |
| Charts           | `recharts`                                                                          |
| Validation       | `zod`, `@t3-oss/env-core`                                                           |
| Testing          | Vitest, `vitest-browser-react`, Playwright                                          |
| Lint/fmt         | Oxlint, Oxfmt, `simple-git-hooks`, `lint-staged`                                    |
