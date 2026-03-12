import { useQuery } from "@tanstack/react-query";

import type { DevicesResponse } from "@/lib/types/api";

const BASE_URL = "https://api.sensinggarden.com/v1";

function useHubs() {
  return useQuery({
    queryKey: ["hubIds"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/devices?limit=100`);
      const data = (await res.json()) as DevicesResponse;
      return data.items;
    },
  });
}
export { useHubs };
