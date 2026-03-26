import { useQuery } from "@tanstack/react-query";

import { env } from "@/env";
import { getHeaders } from "@/lib/headers";
import { addQueryParameters } from "@/lib/queryParameters";
import type { GetTaxaCountParameters, TaxaCountResponse } from "@/lib/types/api";

function useTaxaCount(queryParameters?: GetTaxaCountParameters) {
  return useQuery({
    queryKey: ["taxa-count", queryParameters],
    queryFn: async () => {
      const params = new URLSearchParams();

      addQueryParameters(params, queryParameters);

      const res = await fetch(
        `${env.VITE_API_BASE_URL}/classifications/taxa_count?${params.toString()}`,
        {
          headers: getHeaders(),
        },
      );

      return (await res.json()) as TaxaCountResponse;
    },
  });
}

export { useTaxaCount };
