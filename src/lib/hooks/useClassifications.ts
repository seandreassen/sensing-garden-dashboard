import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { Classification, PaginatedResponse } from "@/lib/types/api";

interface UseClassificationsParams {
  deviceId?: string;
  startTime?: string;
  endTime?: string;
  limit?: number;
  sortDesc?: boolean;
}

function useClassifications(params: UseClassificationsParams = {}) {
  const { deviceId, startTime, endTime, limit = 500, sortDesc = true } = params;

  return useQuery({
    queryKey: ["classifications", { deviceId, startTime, endTime, limit, sortDesc }],
    queryFn: () =>
      apiFetch<PaginatedResponse<Classification>>("/classifications", {
        device_id: deviceId,
        start_time: startTime,
        end_time: endTime,
        limit,
        sort_desc: sortDesc,
      }),
    select: (data) => data.items,
  });
}

export { useClassifications };
