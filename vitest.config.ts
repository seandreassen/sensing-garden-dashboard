import path from "node:path";

import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: "chromium", viewport: { width: 1920, height: 1080 } }],
    },
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/env.ts", "src/main.tsx", "src/routeTree.gen.ts"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@tests": path.resolve(__dirname, "./tests"),
    },
  },
});
