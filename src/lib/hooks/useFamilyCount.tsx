import { useQuery } from "@tanstack/react-query";

import { addGlobalQueryParameters } from "@/lib/queryParameters";
import type { QueryParameters } from "@/lib/types/api";

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

export function useFamilyCount(queryParams: QueryParameters) {
  return useQuery({
    queryKey: ["family-count", queryParams],
    queryFn: async () => {
      const params = new URLSearchParams();

      addGlobalQueryParameters(params, queryParams);

      const res = await fetch(
        `https://api.sensinggarden.com/v1/classifications?${params.toString()}`,
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch species richness: ${res.status}`);
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
    },
  });
}
