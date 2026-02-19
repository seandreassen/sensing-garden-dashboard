# Sensing garden dashboard

Web app visualizing data from the Sensing Garden project.

## Project structure

- `public/`: Static assets
- `src/`: Source code
  - `routes/`: Tanstack router file-based route tree
  - `components/`: React components
    - `ui/`: Generic reusable components
  - `lib/`: Shared utility functions

## Setup

### Prerequisites

- Node.js (https://nodejs.org/en/download)
- pnpm (https://pnpm.io/installation)

## Development

- Clone the project
- Navigate to the root folder
- Run `pnpm i` to install dependencies
- Run `pnpm dev` to run development server

This project uses Git Hooks. Linting and formatting are automatically enforced on every commit.

### Recommended

#### VS Code

- Install the recommended extensions from `.vscode/extensions.json`, which along with project settings, `.vscode/settings.json`, will enable linting and formatting during development

### External components

- Find external components from shadcn (https://ui.shadcn.com/docs/components)
- Select `Base UI` instead of the default `Radix UI`
- Follow the page's guide for manual installation
- Modify component to match our other components
  - Use PascalCase for file name
  - Remove the `"use client"` directive
  - Fix incorrect import paths
  - Resolve any potential linting errors

### Icons

- Prefer lucide icons (https://lucide.dev/icons)
- Find name of component to use
- Import the React component with the same name
  - Imported icons use PascalCase
  - Import will autocomplete for all lucide icons
  - Prefer components ending in Icon
    - e.g. `<ChevronLeftIcon />` instead of `<ChevronLeft />`
