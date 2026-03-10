import { createContext, useContext } from "react";

import type { DatePreset, TaxonomyLevel, WorkspaceTab } from "@/lib/types/api";

interface FilterState {
  datePreset: DatePreset;
  startTime: string;
  endTime: string;
  deviceId?: string;
  taxonomyLevel: TaxonomyLevel;
  minConfidence: number;
  selectedTaxa: string[];
  activeTab: WorkspaceTab;
}

interface FilterActions {
  setDatePreset: (preset: DatePreset) => void;
  setCustomDateRange: (startTime: string, endTime: string) => void;
  setDeviceId: (deviceId: string | undefined) => void;
  setTaxonomyLevel: (level: TaxonomyLevel) => void;
  setMinConfidence: (confidence: number) => void;
  setSelectedTaxa: (taxa: string[]) => void;
  toggleTaxon: (taxon: string) => void;
  setActiveTab: (tab: WorkspaceTab) => void;
}

function getDateRange(preset: DatePreset): { startTime: string; endTime: string } {
  const now = new Date();
  const endTime = now.toISOString();

  let start: Date;
  switch (preset) {
    case "24h":
      start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case "7d":
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
  }

  return { startTime: start.toISOString(), endTime };
}

const DEFAULT_FILTERS: FilterState = {
  datePreset: "7d",
  ...getDateRange("7d"),
  taxonomyLevel: "family",
  minConfidence: 0,
  selectedTaxa: [],
  activeTab: "overview",
};

const FilterContext = createContext<{
  filters: FilterState;
  actions: FilterActions;
} | null>(null);

function useFilterContext() {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error("useFilterContext must be used within FilterProvider");
  }
  return ctx;
}

export { FilterContext, useFilterContext, getDateRange, DEFAULT_FILTERS };
export type { FilterState, FilterActions };
