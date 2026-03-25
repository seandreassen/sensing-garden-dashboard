import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

// oxlint-disable eslint/no-console - Log errors with environment in console

const env = createEnv({
  clientPrefix: "VITE_",

  client: {
    VITE_API_BASE_URL: z.string(),
    VITE_API_KEY: z.string(),
    VITE_GOOGLE_MAPS_API_KEY: z.string().optional(),
  },

  onValidationError: (issues) => {
    console.error("Invalid environment variables:");
    for (const issue of issues) {
      console.error(`  ${issue.path?.join(".")}: ${issue.message}`);
    }
    throw new Error("Invalid environment variables");
  },

  runtimeEnv: import.meta.env,

  emptyStringAsUndefined: true,
});

export { env };
