import { useQuery } from "@tanstack/react-query";

import { env } from "@/env";
import { getHeaders } from "@/lib/headers";
import { addQueryParameters } from "@/lib/queryParameters";
import type {
  EnvironmentTimeSeriesResponse,
  GetEnvironmentTimeSeriesParameters,
} from "@/lib/types/api";

function useEnvironmentTimeSeries(queryParams: GetEnvironmentTimeSeriesParameters) {
  return useQuery({
    queryKey: ["environment-time-series", queryParams],
    queryFn: async () => {
      const params = new URLSearchParams();

      addQueryParameters(params, queryParams);

      const res = await fetch(
        `${env.VITE_API_BASE_URL}/environment/time_series?${params.toString()}`,
        { headers: getHeaders() },
      );

      const data = (await res.json()) as EnvironmentTimeSeriesResponse;
      return {
        ...data,
        start_time: new Date(data.start_time),
      } as EnvironmentTimeSeriesResponse;
    },
  });
}

export { useEnvironmentTimeSeries };
