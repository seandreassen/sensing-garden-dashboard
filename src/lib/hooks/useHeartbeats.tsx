import { useQuery } from "@tanstack/react-query";

import { env } from "@/env";
import type { GetHeartbeatsParameters, HeartbeatsResponse } from "@/lib/types/api";
import { getHeaders } from "@/lib/utils/headers";
import { addQueryParameters } from "@/lib/utils/queryParameters";

function useHeartbeats(queryParams: GetHeartbeatsParameters) {
  return useQuery({
    queryKey: ["heartbeats", queryParams],
    queryFn: async () => {
      const params = new URLSearchParams();

      addQueryParameters(params, queryParams);

      const res = await fetch(`${env.VITE_API_BASE_URL}/heartbeats?${params.toString()}`, {
        headers: getHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch heartbeats: ${res.status} ${res.statusText}`);
      }

      const data = (await res.json()) as HeartbeatsResponse;
      return {
        ...data,
        items: data.items.map((item) => ({
          ...item,
          dot_status: item.dot_status.map((dot_status) => ({
            ...dot_status,
            last_modified: new Date(dot_status.last_modified),
          })),
          timestamp: new Date(item.timestamp),
        })),
      } as HeartbeatsResponse;
    },
  });
}

export { useHeartbeats };
