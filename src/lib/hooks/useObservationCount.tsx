import { useQuery } from "@tanstack/react-query";

import { env } from "@/env";
import { getHeaders } from "@/lib/headers";
import { addGlobalQueryParameters } from "@/lib/queryParameters";
import type { ObservationCountResponse, QueryParameters } from "@/lib/types/api";

function useObservationCount(queryParams: QueryParameters) {
  return useQuery({
    queryKey: ["observations-count", queryParams],
    queryFn: async () => {
      const params = new URLSearchParams();

      addGlobalQueryParameters(params, queryParams);

      const res = await fetch(
        `${env.VITE_API_BASE_URL}/classifications/count?${params.toString()}`,
        { headers: getHeaders() },
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch observation count: ${res.status}`);
      }

      const data = (await res.json()) as ObservationCountResponse;

      return data.count;
    },
  });
}

export { useObservationCount };
