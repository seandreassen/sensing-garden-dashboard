# Sensing Garden dashboard

- [Sensing Garden dashboard](#sensing-garden-dashboard)
  - [Overview](#overview)
  - [Features](#features)
  - [Project structure](#project-structure)
  - [Tech Stack](#tech-stack)
  - [Quick start](#quick-start)
    - [Prerequisites](#prerequisites)
    - [Development](#development)
  - [Testing](#testing)

## Overview

Sensing Garden Dashboard is a web application designed to make the outputs of Flik, that visualizes insect detection data collected by AI cameras, accessible and actionable. Users can view statistics by deployment or hub, as well as create, edit, or delete deployments to manage the data being collected. The dashboard provides interactive charts and filters for a clearer understanding of insect activity patterns.

## Features

- View deployment statistics: select any active or inactive deployment to see data over time
  ![Landingpage of deployments](/docs/images/Final_Landingpage2.png)
- Create/edit/delete deployment: manage deployments directly from the dashboard
  ![Create deployment/edit deployment/delete deployment](/docs/images/Final_Createpage.png)
- Filter data: filter displayed data in the deployment accoding to date, hub, taxonomy level, selected family/genus/species, and minimum confidence
  ![Filters](/docs/images/Final_Filtering.png)
- Download observations: export all filtered observations as CSV and/or JSON, and/or download a ZIP file containing the associated images.
  ![Export data](/docs/images/Final_Export.png)
- View data and statistics across 5 main pages/tabs:
  **1. Overview:** provides a high-level summary of insect activity and deployment data. Users can see key metrics such as total observations, number of unique families/genera/species, detection trends over time and most common insect families/genera/species.
  ![Overview page](/docs/images/Final_Overviewpage.png)
  **2. Analytics:** provides deeper insights into insect activity and environmental conditions. Users can explore detection patterns through a heatmap showing activity across months and weekdays, as well as view environmental data such as temperature, humidity, air pollution (PM levels), and air quality indices (VOC and NOx) over the selected period. In addition, a taxa treemap is included, showing detection count by the selected taxonomy level.
  ![Analytics page](/docs/images/Final_Analyticspage.png)
  **3. Observations:** displays a list of all observations within the selected period, based on the applied filters. Users can open individual observations to view more detailed information, including browsing through images associated with each observation.
  ![Observations page](/docs/images/Final_Observationspage.png)
  **4. Info:** provides detailed information about the selected deployment. Users can view the deployment description, associated image, connected hubs, and the geographic locations of both the deployment and its connected hubs.
  ![Info page](/docs/images/Final_Infopage.png)
  **5. Edit:** allows users to modify the selected deployment’s details, including name, date range, description, deployment image, connected hubs, and the location of the deployment and its associated hubs.
  ![Edit page](/docs/images/Final_Editpage.png)

## Project structure

- `public/`: Static assets
- `src/`: Source code
  - `assets`: Images, icons, and other media
  - `components/`: React components
    - `ui/`: Generic reusable components
  - `lib/`: Shared utility functions
  - `routes/`: Tanstack router file-based route tree
- `tests/`: Tests
  - `component/`: Component tests
  - `e2e/`: End-to-end tests
  - `unit/`: Unit tests

## Tech Stack

- Frontend: React, TypeScript
- State management/routing: TanStack Router
- Styling/UI: Shadcn, TailwindCSS, Recharts
- Backend/API: Sensing Garden client API
- Database: AWS-hosted
- Testing: Vitest, Playwright (E2E)

## Quick start

### Prerequisites

- Node.js (https://nodejs.org/en/download)
- pnpm (https://pnpm.io/installation)

### Development

1. **Clone** the repository.
2. **Environment:** Add environment variables to `.env`.
3. **Install:** Run `pnpm i` in the root folder to install dependencies.
4. **Run:** Run `pnpm dev` to start the local development server.

## Testing

The project includes both component and end-to-end tests

- **Component/unit tests:** Run `pnpm test:component`/`pnpm test:unit` to run Vitest tests
- **E2E tests:**
  - Run `pnpm exec playwright install` to install browsers for Playwright.
  - Run `test:e2e` to run all playwright tests in real browser environment
- **All tests:** Run `pnpm test` to run all tests

For more information, see [CONTRIBUTING.md](/docs/CONTRIBUTING.md)
