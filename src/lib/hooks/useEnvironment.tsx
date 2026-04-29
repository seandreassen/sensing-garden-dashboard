import { useQuery } from "@tanstack/react-query";

import { env } from "@/env";
import type { EnvironmentResponse, GetEnvironmentParameters } from "@/lib/types/api";
import { getHeaders } from "@/lib/utils/headers";
import { addQueryParameters } from "@/lib/utils/queryParameters";

function useEnvironment(queryParams?: GetEnvironmentParameters) {
  return useQuery({
    queryKey: ["environment", queryParams],
    queryFn: async () => {
      const params = new URLSearchParams();

      addQueryParameters(params, queryParams);

      const res = await fetch(`${env.VITE_API_BASE_URL}/environment?${params.toString()}`, {
        headers: getHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch environment data: ${res.status} ${res.statusText}`);
      }

      return (await res.json()) as EnvironmentResponse;
    },
  });
}

export { useEnvironment };
