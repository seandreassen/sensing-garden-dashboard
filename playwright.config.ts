import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  use: {
    baseURL: "http://localhost:5173",
    viewport: { width: 1920, height: 1080 },
  },
  webServer: {
    command: "pnpm dev --mode test",
    url: "http://localhost:5173",
  },
});
