import { useQuery } from "@tanstack/react-query";

import type { ObservationsResponse } from "@/components/observationTable/columns";

/*Api call to observations which have been classified
Can be called with or without search params.
Call 
*/
const BASE_URL = "https://api.sensinggarden.com/v1";

interface SearchParams {
  deviceFilter?: string;
  startTime?: string;
  endTime?: string;
  sortBy?: string;
  sortDesc?: boolean;
  limit?: number;
  nextToken?: string;
}

export function useObservations(searchParams?: SearchParams) {
  return useQuery<ObservationsResponse, Error>({
    queryKey: ["observations", searchParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchParams?.deviceFilter) {
        params.set("device_id", searchParams.deviceFilter);
      }
      if (searchParams?.startTime) {
        params.set("start_time", searchParams?.startTime);
      }
      if (searchParams?.endTime) {
        params.set("end_time", searchParams?.endTime);
      }
      if (searchParams?.sortBy) {
        params.set("sort_by", searchParams?.sortBy);
      }
      if (searchParams?.sortDesc) {
        params.set("sort_desc", String(searchParams?.sortDesc));
      }
      params.set("limit", String(searchParams?.limit ?? 10));
      if (searchParams?.nextToken) {
        params.set("next_token", searchParams.nextToken);
      }

      const res = await fetch(`${BASE_URL}/classifications?${params.toString()}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch observations: ${res.status}`);
      }

      return res.json();
    },
  });
}
