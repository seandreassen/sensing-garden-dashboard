import { useQuery } from "@tanstack/react-query";

import { env } from "@/env";
import type { DevicesResponse } from "@/lib/types/api";
import { getHeaders } from "@/lib/utils/headers";

function useDevices() {
  return useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      const res = await fetch(`${env.VITE_API_BASE_URL}/devices?limit=100`, {
        headers: getHeaders(),
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch devices: ${res.status}`);
      }
      const data = (await res.json()) as DevicesResponse;
      return data.items.map((device) => ({
        ...device,
        created: new Date(device.created as unknown as string),
      }));
    },
  });
}

export { useDevices };
