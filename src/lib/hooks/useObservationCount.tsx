import { useQuery } from "@tanstack/react-query";

import { env } from "@/env";
import { getHeaders } from "@/lib/headers";
import { addQueryParameters } from "@/lib/queryParameters";
import type { GetObservationCountParameters, ObservationCountResponse } from "@/lib/types/api";

function useObservationCount(queryParams?: GetObservationCountParameters) {
  return useQuery({
    queryKey: ["observation-count", queryParams],
    queryFn: async () => {
      const params = new URLSearchParams();

      addQueryParameters(params, queryParams);

      const res = await fetch(
        `${env.VITE_API_BASE_URL}/classifications/count?${params.toString()}`,
        { headers: getHeaders() },
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch observation count: ${res.status} ${res.statusText}`);
      }

      return (await res.json()) as ObservationCountResponse;
    },
  });
}

export { useObservationCount };
