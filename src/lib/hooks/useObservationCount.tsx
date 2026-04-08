import { useQuery } from "@tanstack/react-query";

import { env } from "@/env";
import type { GetObservationCountParameters, ObservationCountResponse } from "@/lib/types/api";
import { getHeaders } from "@/lib/utils/headers";
import { addQueryParameters } from "@/lib/utils/queryParameters";

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
