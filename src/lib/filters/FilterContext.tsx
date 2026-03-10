import { useCallback, useMemo, useState } from "react";

import type { DatePreset, TaxonomyLevel, WorkspaceTab } from "@/lib/types/api";

import { DEFAULT_FILTERS, FilterContext, getDateRange } from "./filterState";
import type { FilterState } from "./filterState";

function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const setDatePreset = useCallback((preset: DatePreset) => {
    const range = getDateRange(preset);
    setFilters((prev) => ({ ...prev, datePreset: preset, ...range }));
  }, []);

  const setCustomDateRange = useCallback((startTime: string, endTime: string) => {
    setFilters((prev) => ({ ...prev, datePreset: "custom" as DatePreset, startTime, endTime }));
  }, []);

  const setDeviceId = useCallback((deviceId: string | undefined) => {
    setFilters((prev) => ({ ...prev, deviceId }));
  }, []);

  const setTaxonomyLevel = useCallback((taxonomyLevel: TaxonomyLevel) => {
    setFilters((prev) => ({ ...prev, taxonomyLevel, selectedTaxa: [] }));
  }, []);

  const setMinConfidence = useCallback((minConfidence: number) => {
    setFilters((prev) => ({ ...prev, minConfidence }));
  }, []);

  const setSelectedTaxa = useCallback((selectedTaxa: string[]) => {
    setFilters((prev) => ({ ...prev, selectedTaxa }));
  }, []);

  const toggleTaxon = useCallback((taxon: string) => {
    setFilters((prev) => {
      const exists = prev.selectedTaxa.includes(taxon);
      return {
        ...prev,
        selectedTaxa: exists
          ? prev.selectedTaxa.filter((t) => t !== taxon)
          : [...prev.selectedTaxa, taxon],
      };
    });
  }, []);

  const setActiveTab = useCallback((activeTab: WorkspaceTab) => {
    setFilters((prev) => ({ ...prev, activeTab }));
  }, []);

  const actions = useMemo(
    () => ({
      setDatePreset,
      setCustomDateRange,
      setDeviceId,
      setTaxonomyLevel,
      setMinConfidence,
      setSelectedTaxa,
      toggleTaxon,
      setActiveTab,
    }),
    [
      setDatePreset,
      setCustomDateRange,
      setDeviceId,
      setTaxonomyLevel,
      setMinConfidence,
      setSelectedTaxa,
      toggleTaxon,
      setActiveTab,
    ],
  );

  const value = useMemo(() => ({ filters, actions }), [filters, actions]);

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export { FilterProvider };
