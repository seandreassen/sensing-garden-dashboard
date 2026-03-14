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

interface HeatmapGrid {
  cells: HeatmapCell[][];
  rowLabels: string[];
  colLabels: string[];
  maxCount: number;
}

type HeatmapMode = "day-hour" | "week-day";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));

function pickHeatmapMode(rangePreset: string, startDate: string, endDate: string): HeatmapMode {
  if (rangePreset === "24h" || rangePreset === "7d") {
    return "day-hour";
  }
  if (rangePreset === "custom" && startDate && endDate) {
    const diffMs = new Date(endDate).getTime() - new Date(startDate).getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays <= 7 ? "day-hour" : "week-day";
  }
  return "week-day";
}

function jsDayToMondayIndex(jsDay: number): number {
  return jsDay === 0 ? 6 : jsDay - 1;
}

function filterObservations(
  observations: Observation[],
  minConfidence: number,
  taxonomyLevel: TaxonomyLevel,
): Observation[] {
  const confKey = `${taxonomyLevel}_confidence` as keyof Observation;
  return observations.filter((obs) => {
    const conf = (obs[confKey] as number | undefined) ?? 0;
    return conf >= minConfidence;
  });
}

function buildEnvLookup(
  envData: EnvironmentData[],
): Map<string, { temps: number[]; humidities: number[]; aqis: number[] }> {
  const lookup = new Map<string, { temps: number[]; humidities: number[]; aqis: number[] }>();

  for (const e of envData) {
    const d = new Date(e.timestamp);
    const dayIdx = jsDayToMondayIndex(d.getDay());
    const hour = d.getHours();
    const key = `${dayIdx}-${hour}`;

    let bucket = lookup.get(key);
    if (!bucket) {
      bucket = { temps: [], humidities: [], aqis: [] };
      lookup.set(key, bucket);
    }
    if (e.ambient_temperature !== undefined) {
      bucket.temps.push(e.ambient_temperature);
    }
    if (e.ambient_humidity !== undefined) {
      bucket.humidities.push(e.ambient_humidity);
    }
    if (e.voc_index !== undefined) {
      bucket.aqis.push(e.voc_index);
    }
  }

  return lookup;
}

function avg(arr: number[]): number | undefined {
  if (arr.length === 0) {
    return undefined;
  }
  return Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10;
}

function buildWeekEnvLookup(
  envData: EnvironmentData[],
  weekStart: Date,
): Map<string, { temps: number[]; humidities: number[]; aqis: number[] }> {
  const lookup = new Map<string, { temps: number[]; humidities: number[]; aqis: number[] }>();
  const weekStartMs = weekStart.getTime();

  for (const e of envData) {
    const d = new Date(e.timestamp);
    const weekIdx = Math.floor((d.getTime() - weekStartMs) / (7 * 24 * 60 * 60 * 1000));
    const dayIdx = jsDayToMondayIndex(d.getDay());
    const key = `${weekIdx}-${dayIdx}`;

    let bucket = lookup.get(key);
    if (!bucket) {
      bucket = { temps: [], humidities: [], aqis: [] };
      lookup.set(key, bucket);
    }
    if (e.ambient_temperature !== undefined) {
      bucket.temps.push(e.ambient_temperature);
    }
    if (e.ambient_humidity !== undefined) {
      bucket.humidities.push(e.ambient_humidity);
    }
    if (e.voc_index !== undefined) {
      bucket.aqis.push(e.voc_index);
    }
  }

  return lookup;
}

function aggregateHeatmapDayHour(
  observations: Observation[],
  envData: EnvironmentData[],
): HeatmapGrid {
  const rows = 7;
  const cols = 24;

  const cells: HeatmapCell[][] = Array.from({ length: rows }, (_r, row) =>
    Array.from({ length: cols }, (_c, col) => ({
      row,
      col,
      count: 0,
      label: `${DAY_LABELS[row]} @ ${HOUR_LABELS[col]}:00`,
    })),
  );

  for (const obs of observations) {
    const d = new Date(obs.timestamp);
    const row = jsDayToMondayIndex(d.getDay());
    const col = d.getHours();
    cells[row][col].count++;
  }

  const envLookup = buildEnvLookup(envData);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const bucket = envLookup.get(`${row}-${col}`);
      if (bucket) {
        cells[row][col].temp = avg(bucket.temps);
        cells[row][col].humidity = avg(bucket.humidities);
        cells[row][col].aqi = avg(bucket.aqis);
      }
    }
  }

  let maxCount = 0;
  for (const row of cells) {
    for (const cell of row) {
      if (cell.count > maxCount) {
        maxCount = cell.count;
      }
    }
  }

  return { cells, rowLabels: [...DAY_LABELS], colLabels: [...HOUR_LABELS], maxCount };
}

function aggregateHeatmapWeekDay(
  observations: Observation[],
  envData: EnvironmentData[],
  startDate: string,
  endDate: string,
): HeatmapGrid {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  const totalWeeks = Math.max(1, Math.ceil(diffMs / (7 * 24 * 60 * 60 * 1000)));

  const rows = totalWeeks;
  const cols = 7;

  const mondayOfStart = new Date(start);
  const startDow = mondayOfStart.getDay();
  const mondayOffset = startDow === 0 ? -6 : 1 - startDow;
  mondayOfStart.setDate(mondayOfStart.getDate() + mondayOffset);
  mondayOfStart.setHours(0, 0, 0, 0);

  const rowLabels = Array.from({ length: rows }, (_, i) => `Week ${i + 1}`);

  const cells: HeatmapCell[][] = Array.from({ length: rows }, (_r, row) =>
    Array.from({ length: cols }, (_c, col) => ({
      row,
      col,
      count: 0,
      label: `${rowLabels[row]}, ${DAY_LABELS[col]}`,
    })),
  );

  const weekStartMs = mondayOfStart.getTime();

  for (const obs of observations) {
    const d = new Date(obs.timestamp);
    const weekIdx = Math.floor((d.getTime() - weekStartMs) / (7 * 24 * 60 * 60 * 1000));
    const dayIdx = jsDayToMondayIndex(d.getDay());
    if (weekIdx >= 0 && weekIdx < rows && dayIdx >= 0 && dayIdx < cols) {
      cells[weekIdx][dayIdx].count++;
    }
  }

  const envLookup = buildWeekEnvLookup(envData, mondayOfStart);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const bucket = envLookup.get(`${row}-${col}`);
      if (bucket) {
        cells[row][col].temp = avg(bucket.temps);
        cells[row][col].humidity = avg(bucket.humidities);
        cells[row][col].aqi = avg(bucket.aqis);
      }
    }
  }

  let maxCount = 0;
  for (const row of cells) {
    for (const cell of row) {
      if (cell.count > maxCount) {
        maxCount = cell.count;
      }
    }
  }

  return { cells, rowLabels, colLabels: [...DAY_LABELS], maxCount };
}

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

  if (mode === "day-hour") {
    return aggregateHeatmapDayHour(filtered, envData);
  }
  return aggregateHeatmapWeekDay(filtered, envData, startDate, endDate);
}

export { aggregateHeatmap, pickHeatmapMode };
export type { HeatmapCell, HeatmapGrid, HeatmapMode };
