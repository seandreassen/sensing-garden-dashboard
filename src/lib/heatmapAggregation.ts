import type { TaxonomyLevel } from "@/lib/filters";
import type { EnvironmentData, Observation } from "@/lib/types/api";

import {
  aggregateHeatmapDateHour,
  aggregateHeatmapMonthWeekday,
  aggregateHeatmapWeekDay,
} from "./heatmapAggregationBuilders";
import { filterObservations, pickHeatmapMode } from "./heatmapAggregationCore";
import type { HeatmapCell, HeatmapGrid, HeatmapMode } from "./heatmapAggregationCore";

function aggregateHeatmap(
  observations: Observation[],
  envData: EnvironmentData[],
  startDate: string,
  endDate: string,
  rangePreset: string,
  minConfidence: number = 0,
  taxonomyLevel: TaxonomyLevel = "family",
): HeatmapGrid {
  const filtered = filterObservations(observations, minConfidence, taxonomyLevel);
  const mode = pickHeatmapMode(rangePreset, startDate, endDate);

  if (mode === "date-hour") {
    return aggregateHeatmapDateHour(filtered, envData, startDate, endDate);
  }

  if (mode === "week-day") {
    return aggregateHeatmapWeekDay(filtered, envData, startDate, endDate);
  }

  return aggregateHeatmapMonthWeekday(filtered, envData, startDate, endDate);
}

export { aggregateHeatmap, pickHeatmapMode };
export type { HeatmapCell, HeatmapGrid, HeatmapMode };
