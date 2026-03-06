import { useEffect, useState } from "react";

import type { EnvironmentData } from "@/lib/types/api";

interface UseEnvironment {
  data: EnvironmentData[];
  loading: boolean;
  error: Error | null;
}

export function useEnvironmentData(): UseEnvironment {
  const [data, setData] = useState<EnvironmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://api.sensinggarden.com/v1/environment", {
          headers: {
            "X-API-Key": import.meta.env.VITE_API_KEY,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch environment data");
        }

        const json = await res.json();

        setData(json.items ?? json);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}
