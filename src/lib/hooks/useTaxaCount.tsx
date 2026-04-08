import { useQuery } from "@tanstack/react-query";

import { env } from "@/env";
import type { GetTaxaCountParameters, TaxaCountResponse } from "@/lib/types/api";
import { getHeaders } from "@/lib/utils/headers";
import { addQueryParameters } from "@/lib/utils/queryParameters";

function useTaxaCount(queryParameters?: GetTaxaCountParameters) {
  return useQuery({
    queryKey: ["taxa-count", queryParameters],
    queryFn: async () => {
      const params = new URLSearchParams();

      addQueryParameters(params, queryParameters);

      const res = await fetch(
        `${env.VITE_API_BASE_URL}/classifications/taxa_count?${params.toString()}`,
        { headers: getHeaders() },
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch taxa count: ${res.status} ${res.statusText}`);
      }

      return (await res.json()) as TaxaCountResponse;
    },
  });
}

export { useTaxaCount };
