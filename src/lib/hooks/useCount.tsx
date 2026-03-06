import { useQuery } from "@tanstack/react-query";

type CountResponse = number | { count: number };

type UseCountResult = {
  count: number | null;
  loading: boolean;
  error: string | null;
};

async function fetchCount(): Promise<number> {
  const res = await fetch("https://api.sensinggarden.com/v1/classifications/count");

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  const text = await res.text();
  const trimmed = text.trim();

  if (/^\d+$/.test(trimmed)) {
    return Number(trimmed);
  }

  const parsed = JSON.parse(trimmed) as CountResponse;

  if (typeof parsed === "number") {
    return parsed;
  }

  if (typeof parsed === "object" && parsed !== null && "count" in parsed) {
    return parsed.count;
  }

  throw new Error("Unknown count response format");
}

export function useCount(): UseCountResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ["classifications-count"],
    queryFn: fetchCount,
  });

  return {
    count: data ?? null,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
