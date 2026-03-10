import { useQuery } from "@tanstack/react-query";

import type { EnvironmentData } from "@/lib/types/api";

const API_URL = "https://api.sensinggarden.com/v1/environment";

function useEnvironmentData() {
  return useQuery<EnvironmentData[], Error>({
    queryKey: ["environmentData"],
    queryFn: async () => {
      const res = await fetch(API_URL, {
        headers: {
          "X-API-Key": import.meta.env.VITE_API_KEY,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch environment data");
      }

      const json = await res.json();
      return json.items ?? json;
    },
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60, // auto-refetch every minute if needed
  });
}

export { useEnvironmentData };
