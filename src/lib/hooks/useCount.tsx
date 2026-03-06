import { useEffect, useState } from "react";

type UseCountResult = {
  count: number | null;
  loading: boolean;
};

export function useCount(): UseCountResult {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function fetchCount() {
      try {
        const res = await fetch("https://api.sensinggarden.com/v1/classifications/count");
        const data: unknown = await res.json();

        if (!alive) {
          return;
        }

        if (typeof data === "number") {
          setCount(data);
          return;
        }

        if (
          typeof data === "object" &&
          data !== null &&
          "count" in data &&
          typeof data.count === "number"
        ) {
          setCount(data.count);
          return;
        }

        setCount(0);
      } catch {
        if (alive) {
          setCount(0);
        }
      }

      if (alive) {
        setLoading(false);
      }
    }

    fetchCount();

    return () => {
      alive = false;
    };
  }, []);

  return { count, loading };
}
