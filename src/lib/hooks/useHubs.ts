import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

interface Device {
  device_id: string;
  created: string;
}

interface DevicesResponse {
  items: Device[];
  next_token?: string;
}

function useHubs() {
  return useQuery({
    queryKey: ["hubIds"],
    queryFn: () => apiFetch<DevicesResponse>("/devices", { limit: 100 }),
    select: (data) => data.items.map((item) => item.device_id),
  });
}

export { useHubs };
