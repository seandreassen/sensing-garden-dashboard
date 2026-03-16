import { useLocation, useNavigate, useSearch } from "@tanstack/react-router";
import { endOfDay, startOfDay, subDays, subHours, subMonths, subYears } from "date-fns";
import { useMemo } from "react";

import { filtersDefault, type Filters } from "@/lib/filters";

function useFilters() {
  const search = useSearch({ from: "/deployment/$deploymentId/_filterLayout" });
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const range = useMemo(() => {
    const now = new Date();

    switch (search.rangePreset) {
      case "24h":
        return {
          preset: "24h",
          start: subHours(now, 24).toISOString(),
          end: now.toISOString(),
        };
      case "7d":
        return {
          preset: "7d",
          start: subDays(now, 7).toISOString(),
          end: now.toISOString(),
        };
      case "3m":
        return {
          preset: "3m",
          start: subMonths(now, 3).toISOString(),
          end: now.toISOString(),
        };
      case "1y":
        return {
          preset: "1y",
          start: subYears(now, 1).toISOString(),
          end: now.toISOString(),
        };
      // @ts-ignore - Fallthrough case is on purpose
      case "custom":
        if (
          // If custom range is invalid, set default preset range
          search.startDate &&
          !isNaN(Date.parse(search.startDate)) &&
          search.endDate &&
          !isNaN(Date.parse(search.endDate))
        ) {
          return {
            preset: "custom",
            start: startOfDay(new Date(search.startDate)).toISOString(),
            end: endOfDay(new Date(search.endDate)).toISOString(),
          };
        }
      default:
      case "30d": // 30d is last because it's the default, needs to be after default and custom if incorrectly formatted
        return {
          preset: "30d",
          start: subDays(now, 30).toISOString(),
          end: now.toISOString(),
        };
    }
  }, [search.rangePreset, search.startDate, search.endDate]);

  const filters = useMemo(
    () => ({
      ...search,
      rangePreset: range.preset,
      startDate: range.start,
      endDate: range.end,
      taxonomyLevel: search.taxonomyLevel ?? filtersDefault.taxonomyLevel,
      minConfidence: search.minConfidence ?? filtersDefault.minConfidence,
      selectedTaxa: search.selectedTaxa ?? filtersDefault.selectedTaxa,
    }),
    [search, range],
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
