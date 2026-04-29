import { useQuery } from "@tanstack/react-query";

import { env } from "@/env";
import type {
  GetObservationsTimeSeriesParameters,
  ObservationsTimeSeriesResponse,
} from "@/lib/types/api";
import { getHeaders } from "@/lib/utils/headers";
import { addQueryParameters } from "@/lib/utils/queryParameters";

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
