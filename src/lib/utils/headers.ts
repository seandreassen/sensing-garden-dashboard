import { env } from "@/env";

function getHeaders() {
  return {
    "X-Api-Key": env.VITE_API_KEY,
  };
}

export { getHeaders };
