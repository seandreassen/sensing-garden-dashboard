import { useQuery } from "@tanstack/react-query";

import { env } from "@/env";
import { getHeaders } from "@/lib/headers";
import { addQueryParameters } from "@/lib/queryParameters";
import type { EnvironmentResponse, GetEnvironmentParameters } from "@/lib/types/api";

function useEnvironment(queryParams?: GetEnvironmentParameters) {
  return useQuery({
    queryKey: ["environment", queryParams],
    queryFn: async () => {
      const params = new URLSearchParams();

      addQueryParameters(params, queryParams);

      const res = await fetch(`${env.VITE_API_BASE_URL}/environment?${params.toString()}`, {
        headers: getHeaders(),
      });

      return (await res.json()) as EnvironmentResponse;
    },
  });
}

export { useEnvironment };
