import { useQuery } from "@tanstack/react-query";

import { env } from "@/env";
import { getHeaders } from "@/lib/headers";
import { addGlobalQueryParameters } from "@/lib/queryParameters";
import type { ObservationsResponse, QueryParameters } from "@/lib/types/api";

/*
Calls api to gather list of observations. 
The hook supports the parameters below.
Unsure whether time and device-filters function in tandem.
Sorting does seem to sort only after limit is put on api result. 
I think this limitation lies in backend. 
*/
interface SearchParams extends QueryParameters {
  nextToken?: string;
}

function useObservations(searchParams?: SearchParams) {
  return useQuery({
    queryKey: ["observations", searchParams],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (searchParams) {
        addGlobalQueryParameters(params, searchParams as QueryParameters);
      }

      // Token pagination not implemented.
      if (searchParams?.nextToken) {
        params.set("next_token", searchParams.nextToken);
      }

      const res = await fetch(`${env.VITE_API_BASE_URL}/classifications?${params.toString()}`, {
        headers: getHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch observations: ${res.status}`);
      }

      return (await res.json()) as ObservationsResponse;
    },
  });
}
export { useObservations };
