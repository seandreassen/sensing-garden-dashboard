import { useQuery } from "@tanstack/react-query";

import type { ObservationsResponse } from "@/lib/types/api";

const BASE_URL = "https://api.sensinggarden.com/v1";

/*
Calls api to gather list of observations. 
The hook supports the parameters below.
Unsure whether time and device-filters function in tandem.
Sorting does seem to sort only after limit is put on api result. 
I think this limitation lies in backend. 
*/
interface SearchParams {
  deviceFilter?: string;
  startTime?: string;
  endTime?: string;
  sortBy?: string;
  sortDesc?: boolean;
  limit?: number;
  nextToken?: string;
}

function useObservations(searchParams?: SearchParams) {
  return useQuery<ObservationsResponse, Error>({
    queryKey: ["observations", searchParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchParams?.deviceFilter) {
        params.set("device_id", searchParams.deviceFilter);
      }
      if (searchParams?.startTime) {
        params.set("start_time", searchParams.startTime);
      }
      if (searchParams?.endTime) {
        params.set("end_time", searchParams.endTime);
      }
      if (searchParams?.sortBy) {
        params.set("sort_by", searchParams?.sortBy);
      }

      params.set("sort_desc", String(searchParams?.sortDesc ?? false));

      params.set("limit", String(searchParams?.limit));

      //Token pagination not implemented.
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
export { useObservations };
