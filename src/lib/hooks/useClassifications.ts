import { useQuery } from "@tanstack/react-query";

import { MOCK_CLASSIFICATIONS } from "@/lib/mockData";
import type { Classification } from "@/lib/types/api";

// Switch to real API when backend is ready — replace mock filter with apiFetch call
interface UseClassificationsParams {
  deviceId?: string;
  startTime?: string;
  endTime?: string;
  limit?: number;
}

function filterMockData(params: UseClassificationsParams): Classification[] {
  let data = MOCK_CLASSIFICATIONS;

  if (params.deviceId) {
    data = data.filter((c) => c.device_id === params.deviceId);
  }
  if (params.startTime) {
    const start = params.startTime;
    data = data.filter((c) => c.timestamp >= start);
  }
  if (params.endTime) {
    const end = params.endTime;
    data = data.filter((c) => c.timestamp <= end);
  }
  if (params.limit) {
    data = data.slice(0, params.limit);
  }

  return data;
}

function useClassifications(params: UseClassificationsParams = {}) {
  return useQuery({
    queryKey: ["classifications", params],
    queryFn: async () => filterMockData(params),
  });
}

function useClassificationsCount(
  params: { deviceId?: string; startTime?: string; endTime?: string } = {},
) {
  return useQuery({
    queryKey: ["classifications-count", params],
    queryFn: async () => filterMockData(params).length,
  });
}

export { useClassifications, useClassificationsCount };
