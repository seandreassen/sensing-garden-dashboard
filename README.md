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

Sensing Garden Dashboard is a web application designed to make the outputs of Flik, that visualizes insect detection data collected by AI cameras, accessible and actionable. Users can view statistics by deployment or hub, as well as add, edit, or delete deployments to manage the data being collected. The dashboard provides interactive charts and filters for a clearer understanding of insect activity patterns.

## Features

- View deployment statistics: select any active or inactive deployment to see data over time
  !!!! ADD SCREENSHOT
- Add/edit/delete deployment: manage deployments directly from the dashboard
  !!!! ADD SCREENSHOT
- Filter data: filter displayed data in the deployment accoding to date, hub, taxonomy level, selected family/genera/species, and minimum confidence
  !!!! ADD SCREENSHOT
- Download observations: export all filtered observations as CSV and/or JSON, and/or download a ZIP file containing the associated images.
- View data and statistics across 4 main pages:
  1. Overview: provides a high-level summary of insect activity and deployment data. Users can see key metrics such as total observations, number of unique species, detection trends over time, most common insect families, and the geographic location of the selected deployment.
     !!!! ADD SCREENSHOT
  2. Analytics: provides deeper insights into insect activity and environmental conditions. Users can explore detection patterns through a heatmap showing activity across months and weekdays, as well as view environmental data such as temperature, humidity, air pollution (PM levels), and air quality indices (VOC and NOx) over the selected period.
     !!!! ADD SCREENSHOT
  3. Observations: displays a list of all observations within the selected period, based on the applied filters. Users can open individual observations to view more detailed information, including browsing through images associated with each observation.
     !!!! ADD SCREENSHOT
  4. Info:

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

## Tech Stack

- Frontend: React, TypeScript
- State management/routing: TanStack Router
- Styling/UI: Shadcn, TailwindCSS
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

- Component/unit tests: Run `pnpm test:component` to run all Vitest tests
- E2E tests:
  - Run `pnpm exec playwright install` to install browsers for Playwright.
  - Run `test:e2e` to run all playwright tests in real browser environment
- All tests: Run `pnpm test` to run all tests

For more information, see [CONTRIBUTING.md](CONTRIBUTING.md)
