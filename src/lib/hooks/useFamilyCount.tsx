import { useQuery } from "@tanstack/react-query";

type UseFamilyCountResult = {
  count: number | null;
  isLoading: boolean;
  error: string | null;
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

async function fetchFamilyCount(): Promise<number> {
  const res = await fetch("https://api.sensinggarden.com/v1/classifications");

  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }

  const json: unknown = await res.json();
  const arr = asArray(json);
  const set = new Set<string>();

  for (const item of arr) {
    const family = getFamily(item);

    if (family) {
      set.add(family);
    }
  }

  return set.size;
}

export function useFamilyCount(): UseFamilyCountResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ["family-count"],
    queryFn: fetchFamilyCount,
  });

  return {
    count: data ?? null,
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
