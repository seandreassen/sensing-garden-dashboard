import { useQuery } from "@tanstack/react-query";

import { env } from "@/env";
import { getHeaders } from "@/lib/headers";

export type TopFamilyRow = {
  rank: number;
  family: string;
  count: number;
  pct: number;
  barPct: number;
};

type UseTopFamiliesResult = {
  rows: TopFamilyRow[];
  isLoading: boolean;
  error: string | null;
  totalDetections: number;
};

function asArray(json: unknown): unknown[] {
  if (Array.isArray(json)) {
    return json;
  }

  if (typeof json === "object" && json !== null) {
    const obj = json as Record<string, unknown>;
    const maybe = obj.results ?? obj.items ?? obj.data ?? obj.classifications;

    if (Array.isArray(maybe)) {
      return maybe;
    }
  }

  return [];
}

function getNestedRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }

  return null;
}

function getString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getFamily(item: unknown): string | null {
  if (typeof item !== "object" || item === null) {
    return null;
  }

  const obj = item as Record<string, unknown>;
  const taxonomy = getNestedRecord(obj.taxonomy);
  const taxon = getNestedRecord(obj.taxon);
  const taxonTaxonomy = getNestedRecord(taxon?.taxonomy);

  return (
    getString(obj.family) ??
    getString(obj.familyName) ??
    getString(taxonomy?.family) ??
    getString(taxonomy?.familyName) ??
    getString(taxon?.family) ??
    getString(taxon?.familyName) ??
    getString(taxonTaxonomy?.family) ??
    null
  );
}

async function fetchTopFamilies(limit: number): Promise<{
  rows: TopFamilyRow[];
  totalDetections: number;
}> {
  const res = await fetch(`${env.VITE_API_BASE_URL}/classifications`, { headers: getHeaders() });

  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }

  const json: unknown = await res.json();
  const arr = asArray(json);
  const counts = new Map<string, number>();

  for (const item of arr) {
    const family = getFamily(item);

    if (!family) {
      continue;
    }

    counts.set(family, (counts.get(family) ?? 0) + 1);
  }

  const totalDetections = Array.from(counts.values()).reduce(
    (sum: number, value: number) => sum + value,
    0,
  );

  const sorted: [string, number][] = Array.from(counts.entries())
    .toSorted((a: [string, number], b: [string, number]) => b[1] - a[1])
    .slice(0, limit);

  const max = sorted[0]?.[1] ?? 0;

  const rows: TopFamilyRow[] = sorted.map(([family, count]: [string, number], index: number) => ({
    rank: index + 1,
    family,
    count,
    pct: totalDetections > 0 ? (count / totalDetections) * 100 : 0,
    barPct: max > 0 ? (count / max) * 100 : 0,
  }));

  return { rows, totalDetections };
}

export function useTopFamilies(limit = 5): UseTopFamiliesResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ["top-families", limit],
    queryFn: () => fetchTopFamilies(limit),
  });

  return {
    rows: data?.rows ?? [],
    totalDetections: data?.totalDetections ?? 0,
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
