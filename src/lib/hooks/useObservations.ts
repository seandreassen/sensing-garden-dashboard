import { useQuery } from "@tanstack/react-query";

import { env } from "@/env";
import type { GetObservationsParameters, ObservationsResponse } from "@/lib/types/api";
import { getHeaders } from "@/lib/utils/headers";
import { addQueryParameters } from "@/lib/utils/queryParameters";

function useObservations(queryParams?: GetObservationsParameters) {
  return useQuery({
    queryKey: ["observations", queryParams],
    queryFn: async () => {
      const params = new URLSearchParams();

      addQueryParameters(params, queryParams);

      const res = await fetch(`${env.VITE_API_BASE_URL}/classifications?${params.toString()}`, {
        headers: getHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch observations: ${res.status} ${res.statusText}`);
      }

      const data = (await res.json()) as ObservationsResponse;
      return {
        ...data,
        items: data.items.map((observation) => ({
          ...observation,
          timestamp: new Date(observation.timestamp),
        })),
      };
    },
  });
}

export { useObservations };
