# Development Guidelines

This document outlines the workflow and coding standards for contributing to the Sensing Garden dashboard.

## Setup

### Prerequisites

- Node.js (https://nodejs.org/en/download)
- pnpm (https://pnpm.io/installation)

### Getting Started

1. **Clone** the repository.
2. **Environment:** Add environment variables to `.env`.
3. **Install:** Run `pnpm i` in the root folder to install dependencies.
4. **Run:** Run `pnpm dev` to start the local development server.

### Tooling

- **VS Code:** Install the recommended extensions from `.vscode/extensions.json`. Project settings in `.vscode/settings.json` are meant to simplify and speed up development.
- **Git Hooks:** We use `sipmle-git-hooks` for pre-commit hooks. Linting and formatting are automatically enforced on every commit. If a commit fails, resolve the linting errors before retrying.

### Testing

We use different commands for different test types:

- `pnpm test:unit`: Runs pure unit tests in `tests/unit/`
- `pnpm test:component`: Runs component tests in `tests/component/`
- `pnpm test:e2e`: Runs end-to-end tests in `tests/e2e/`
- `pnpm test`: Runs component tests and e2e tests
- `pnpm coverage`: Generates and serves a coverage report

Pure unit tests should cover stable frontend-owned utility logic, such as formatting, query parameter serialization, and map/chart helper functions. Component tests should focus on top-level components rather than testing every child component separately. Route/page behavior should generally be tested with e2e tests.

The first time you run tests using `pnpm test`, `pnpm test:component`, `pnpm test:e2e`, or `pnpm coverage`, you might need to finish the Playwright browser installation. If so, instructions will be shown in the terminal.

Note: `test:unit` currently uses the shared Vitest browser config, so pure unit tests may still start Playwright/Chromium. We may want to add a separate non-browser Vitest config later to make pure unit tests faster.

The coverage report will be generated at `coverage/`, and a more detailed list of e2e test results will be generated at `test-results/`.

## Coding Standards

### Components

If files get too long or you're reusing parts of your code, move the code into its own component. Components are placed in a sensible folder under `src/components/`. E.g., the component for filtering by prediction confidence is at `src/components/filters/ConfidenceFilter.tsx`. Component names should use **PascalCase**

### External Components

Before creating a new component, it's recommended to check [shadcn/ui](https://ui.shadcn.com/docs/components) for the component you're looking for. When adding new components, follow our specific configuration to maintain consistency:

1.  **Source:** Get external components from [shadcn/ui](https://ui.shadcn.com/docs/components)
2.  **Select:** Make sure to select the **Base UI** version over Radix UI.
3.  **Install:** Follow the installation guide **manual** installation of the component.
4.  **Refactor:** After adding a component, update the file to match our codebase standards:
    - **Location:** All external compoennts are placed in `src/components/ui/`.
    - **Naming:** Ensure the file uses **PascalCase**.
    - **Directives:** Remove the `"use client"` directive.
    - **Imports:** Fix paths and resolve all linting errors.

### Icons

We exclusively use **Lucide icons**. All Lucide icons are already installed. Find the icon you want to use at https://lucide.dev/icons/, then add the corresponding component to your code. Always use components ending in **Icon** for better consistency across the project. (All icons have a version with and without Icon, e.g. `<ChevronLeftIcon />` vs `<ChevronLeft />`)

### Data Fetching

When fetching data, use [TanStack Query](https://tanstack.com/query/latest). Create a hook for your query, placed under `src/lib/hooks/`. Look at the documentation for detailed info, or check `src/lib/hooks/useObservations.ts` for a simple example. Types used to get data from the Sensing Garden backend API are placed in `src/lib/types/api.ts`.

### Other

- When exporting content from a file, use `export { ... }` at the end of the file instead of inline exports to make it clear what the file exports. (This does not apply to the `Route` component for all files under `src/routes/`)
- It's important to keep **type safety**. Do not use `any` or `unknown` unless necessary, and try to as specific as possible. E.g., create an `interface` for your function instead of `Record<string, string>`.
- Use TailwindCSS, `className`, over inline CSS, `style`.
- Prefer using our custom TailwindCSS classes where possible. Try not to use classes like `text-zinc-400`, instead using `text-muted-foreground`, to keep consistent styling across the dashboard.

## Project Structure

- `public/`: Static assets
- `src/`: Source code
  - `routes/`: Tanstack router file-based route tree
  - `components/`: React components
    - `ui/`: Generic reusable components
  - `lib/`: Shared utility functions
- `tests/`: Tests
  - `unit/`: Unit tests for pure utility logic
  - `component/`: Component tests
  - `e2e/`: End-to-end tests

## Contributing

- **Branching:** Use descriptive branch names (e.g., `feat/login`, `fix/broken-slider`).
- **Commit Messages:** Follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).
- **Pull Request:** Create a pull request with your changes. Target branch should be `dev` unless you have a good reason for not selecting it.
- **Testing:** Ensure all tests pass after making your changes.
- **Review:** All pull requests must be reviewed by at least 1 other team member.
