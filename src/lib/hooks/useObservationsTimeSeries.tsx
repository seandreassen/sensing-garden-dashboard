import { useQuery } from "@tanstack/react-query";

import { env } from "@/env";
import { getHeaders } from "@/lib/headers";
import { addQueryParameters } from "@/lib/queryParameters";
import type {
  GetObservationsTimeSeriesParameters,
  ObservationsTimeSeriesResponse,
} from "@/lib/types/api";

function useObservationsTimeSeries(queryParameters: GetObservationsTimeSeriesParameters) {
  return useQuery({
    queryKey: ["observations-time-series", queryParameters],
    queryFn: async () => {
      const params = new URLSearchParams();

      addQueryParameters(params, queryParameters);

      const res = await fetch(
        `${env.VITE_API_BASE_URL}/classifications/time_series?${params.toString()}`,
        { headers: getHeaders() },
      );

      if (!res.ok) {
        throw new Error(
          `Failed to fetch observations time series: ${res.status} ${res.statusText}`,
        );
      }

      const data = (await res.json()) as ObservationsTimeSeriesResponse;
      return {
        ...data,
        start_time: new Date(data.start_time),
      } as ObservationsTimeSeriesResponse;
    },
  });
}

export { useObservationsTimeSeries };
