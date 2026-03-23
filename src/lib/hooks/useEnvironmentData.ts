import { useQuery } from "@tanstack/react-query";

import { addGlobalQueryParameters } from "@/lib/queryParameters";
import type { EnvironmentResponse, QueryParameters } from "@/lib/types/api";

function useEnvironmentData(queryParams: QueryParameters) {
  return useQuery({
    queryKey: ["environment", queryParams],
    queryFn: async () => {
      const params = new URLSearchParams();

      addGlobalQueryParameters(params, queryParams);

      const res = await fetch(`https://api.sensinggarden.com/v1/environment?${params.toString()}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch observation count: ${res.status}`);
      }

      return ((await res.json()) as EnvironmentResponse).items;
    },
  });
}

export { useEnvironmentData };
