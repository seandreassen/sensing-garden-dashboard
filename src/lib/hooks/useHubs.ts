import { useQuery } from "@tanstack/react-query";

import { env } from "@/env";
import { getHeaders } from "@/lib/headers";
import type { DevicesResponse } from "@/lib/types/api";

function useHubs() {
  return useQuery({
    queryKey: ["hubIds"],
    queryFn: async () => {
      const res = await fetch(`${env.VITE_API_BASE_URL}/devices?limit=100`, {
        headers: getHeaders(),
      });
      const data = (await res.json()) as DevicesResponse;
      return data.items;
    },
  });
}
export { useHubs };
