import { useLocation, useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";

import { filtersDefault, type Filters } from "@/lib/filters";

function useFilters() {
  const search = useSearch({ from: "/deployment/$deploymentId/_filterLayout" });
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const filters = useMemo(
    () => ({
      ...search,
      rangePreset: search.rangePreset ?? filtersDefault.rangePreset,
      taxonomyLevel: search.taxonomyLevel ?? filtersDefault.taxonomyLevel,
      minConfidence: search.minConfidence ?? filtersDefault.minConfidence,
      selectedTaxa: search.selectedTaxa ?? filtersDefault.selectedTaxa,
    }),
    [search],
  );

  const updateFilters = (newFilters: Partial<Filters>) => {
    navigate({
      to: pathname,
      search: (prev) => ({ ...prev, ...newFilters }),
      replace: true,
      resetScroll: true,
    });
  };

  return { ...filters, updateFilters };
}

export { useFilters };
