import { getObservationConfidence } from "@/lib/confidence";
import type { TaxonomyLevel } from "@/lib/filters";
import type { EnvironmentData, Observation } from "@/lib/types/api";

interface HeatmapCell {
  row: number;
  col: number;
  count: number;
  label: string;
  temp?: number;
  humidity?: number;
  aqi?: number;
}

type HeatmapMode = "date-hour" | "week-day" | "month-weekday";

interface HeatmapGrid {
  cells: HeatmapCell[][];
  rowLabels: string[];
  colLabels: string[];
  maxCount: number;
  mode: HeatmapMode;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const DAY_MS = 24 * 60 * 60 * 1000;

const monthDayFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});

function getStartOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function daysBetweenInclusive(startDate: string, endDate: string): number {
  const start = getStartOfDay(new Date(startDate)).getTime();
  const end = getStartOfDay(new Date(endDate)).getTime();
  return Math.max(1, Math.floor((end - start) / DAY_MS) + 1);
}

function pickHeatmapMode(rangePreset: string, startDate: string, endDate: string): HeatmapMode {
  if (rangePreset === "24h") {
    return "date-hour";
  }

  const totalDays = daysBetweenInclusive(startDate, endDate);

  if (totalDays <= 14) {
    return "date-hour";
  }
  if (totalDays <= 120) {
    return "week-day";
  }
  return "month-weekday";
}

function jsDayToMondayIndex(jsDay: number): number {
  return jsDay === 0 ? 6 : jsDay - 1;
}

function avg(values: number[]): number | undefined {
  if (values.length === 0) {
    return undefined;
  }

  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

function filterObservations(
  observations: Observation[],
  minConfidence: number,
  taxonomyLevel: TaxonomyLevel,
): Observation[] {
  return observations.filter((obs) => {
    const confidence = getObservationConfidence(obs, taxonomyLevel);
    return confidence >= minConfidence;
  });
}

function buildEnvLookup(
  envData: EnvironmentData[],
  bucketKeyForDate: (date: Date) => string | null,
): Map<string, { temps: number[]; humidities: number[]; aqis: number[] }> {
  const lookup = new Map<string, { temps: number[]; humidities: number[]; aqis: number[] }>();

  for (const item of envData) {
    const date = new Date(item.timestamp);
    const key = bucketKeyForDate(date);

    if (!key) {
      continue;
    }

    let bucket = lookup.get(key);
    if (!bucket) {
      bucket = { temps: [], humidities: [], aqis: [] };
      lookup.set(key, bucket);
    }

    if (item.ambient_temperature !== undefined) {
      bucket.temps.push(item.ambient_temperature);
    }
    if (item.ambient_humidity !== undefined) {
      bucket.humidities.push(item.ambient_humidity);
    }
    if (item.voc_index !== undefined) {
      bucket.aqis.push(item.voc_index);
    }
  }

  return lookup;
}

function applyEnvData(
  cells: HeatmapCell[][],
  lookup: Map<string, { temps: number[]; humidities: number[]; aqis: number[] }>,
) {
  for (const row of cells) {
    for (const cell of row) {
      const bucket = lookup.get(`${cell.row}-${cell.col}`);

      if (!bucket) {
        continue;
      }

      cell.temp = avg(bucket.temps);
      cell.humidity = avg(bucket.humidities);
      cell.aqi = avg(bucket.aqis);
    }
  }
}

function getMaxCount(cells: HeatmapCell[][]): number {
  let maxCount = 0;

  for (const row of cells) {
    for (const cell of row) {
      if (cell.count > maxCount) {
        maxCount = cell.count;
      }
    }
  }

  return maxCount;
}

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function getWeekStart(date: Date): Date {
  const weekStart = getStartOfDay(date);
  const day = weekStart.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  weekStart.setDate(weekStart.getDate() + offset);
  return weekStart;
}

function formatMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export {
  DAY_LABELS,
  HOUR_LABELS,
  applyEnvData,
  buildEnvLookup,
  filterObservations,
  formatMonthKey,
  formatDateKey,
  getMaxCount,
  getStartOfDay,
  getWeekStart,
  jsDayToMondayIndex,
  monthDayFormatter,
  monthFormatter,
  pickHeatmapMode,
};
export type { HeatmapCell, HeatmapGrid, HeatmapMode };
