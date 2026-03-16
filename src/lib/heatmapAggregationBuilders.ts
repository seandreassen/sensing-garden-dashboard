import type { EnvironmentData, Observation } from "@/lib/types/api";

import {
  DAY_LABELS,
  HOUR_LABELS,
  applyEnvData,
  buildEnvLookup,
  formatDateKey,
  formatMonthKey,
  getMaxCount,
  getStartOfDay,
  getWeekStart,
  jsDayToMondayIndex,
  monthDayFormatter,
  monthFormatter,
} from "./heatmapAggregationCore";
import type { HeatmapCell, HeatmapGrid } from "./heatmapAggregationCore";

function enumerateDates(startDate: string, endDate: string): Date[] {
  const dates: Date[] = [];
  const current = getStartOfDay(new Date(startDate));
  const end = getStartOfDay(new Date(endDate));

  while (current.getTime() <= end.getTime()) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

function aggregateHeatmapDateHour(
  observations: Observation[],
  envData: EnvironmentData[],
  startDate: string,
  endDate: string,
): HeatmapGrid {
  const dates = enumerateDates(startDate, endDate);
  const rowLabels = dates.map((date) => monthDayFormatter.format(date));
  const rowIndexes = new Map(dates.map((date, index) => [formatDateKey(date), index]));

  const cells: HeatmapCell[][] = Array.from({ length: dates.length }, (_unused, row) =>
    Array.from({ length: 24 }, (_unusedCol, col) => ({
      row,
      col,
      count: 0,
      label: `${rowLabels[row]} @ ${HOUR_LABELS[col]}:00`,
    })),
  );

  for (const obs of observations) {
    const date = new Date(obs.timestamp);
    const row = rowIndexes.get(formatDateKey(date));
    const col = date.getHours();

    if (row === undefined) {
      continue;
    }

    cells[row][col].count++;
  }

  const envLookup = buildEnvLookup(envData, (date) => {
    const row = rowIndexes.get(formatDateKey(date));
    if (row === undefined) {
      return null;
    }
    return `${row}-${date.getHours()}`;
  });

  applyEnvData(cells, envLookup);

  return {
    cells,
    rowLabels,
    colLabels: [...HOUR_LABELS],
    maxCount: getMaxCount(cells),
    mode: "date-hour",
  };
}

function enumerateWeeks(startDate: string, endDate: string): Date[] {
  const weeks: Date[] = [];
  const current = getWeekStart(new Date(startDate));
  const end = getWeekStart(new Date(endDate));

  while (current.getTime() <= end.getTime()) {
    weeks.push(new Date(current));
    current.setDate(current.getDate() + 7);
  }

  return weeks;
}

function aggregateHeatmapWeekDay(
  observations: Observation[],
  envData: EnvironmentData[],
  startDate: string,
  endDate: string,
): HeatmapGrid {
  const weeks = enumerateWeeks(startDate, endDate);
  const rowLabels = weeks.map((week) => `Week of ${monthDayFormatter.format(week)}`);
  const weekIndexes = new Map(weeks.map((week, index) => [week.getTime(), index]));

  const cells: HeatmapCell[][] = Array.from({ length: weeks.length }, (_unused, row) =>
    Array.from({ length: 7 }, (_unusedCol, col) => ({
      row,
      col,
      count: 0,
      label: `${rowLabels[row]}, ${DAY_LABELS[col]}`,
    })),
  );

  for (const obs of observations) {
    const date = new Date(obs.timestamp);
    const row = weekIndexes.get(getWeekStart(date).getTime());
    const col = jsDayToMondayIndex(date.getDay());

    if (row === undefined) {
      continue;
    }

    cells[row][col].count++;
  }

  const envLookup = buildEnvLookup(envData, (date) => {
    const row = weekIndexes.get(getWeekStart(date).getTime());
    if (row === undefined) {
      return null;
    }
    return `${row}-${jsDayToMondayIndex(date.getDay())}`;
  });

  applyEnvData(cells, envLookup);

  return {
    cells,
    rowLabels,
    colLabels: [...DAY_LABELS],
    maxCount: getMaxCount(cells),
    mode: "week-day",
  };
}

function enumerateMonths(startDate: string, endDate: string): Date[] {
  const months: Date[] = [];
  const current = new Date(startDate);
  current.setDate(1);
  current.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setDate(1);
  end.setHours(0, 0, 0, 0);

  while (current.getTime() <= end.getTime()) {
    months.push(new Date(current));
    current.setMonth(current.getMonth() + 1);
  }

  return months;
}

function aggregateHeatmapMonthWeekday(
  observations: Observation[],
  envData: EnvironmentData[],
  startDate: string,
  endDate: string,
): HeatmapGrid {
  const months = enumerateMonths(startDate, endDate);
  const rowLabels = months.map((month) => monthFormatter.format(month));
  const monthIndexes = new Map(months.map((month, index) => [formatMonthKey(month), index]));

  const cells: HeatmapCell[][] = Array.from({ length: months.length }, (_unused, row) =>
    Array.from({ length: 7 }, (_unusedCol, col) => ({
      row,
      col,
      count: 0,
      label: `${rowLabels[row]}, ${DAY_LABELS[col]}`,
    })),
  );

  for (const obs of observations) {
    const date = new Date(obs.timestamp);
    const row = monthIndexes.get(formatMonthKey(date));
    const col = jsDayToMondayIndex(date.getDay());

    if (row === undefined) {
      continue;
    }

    cells[row][col].count++;
  }

  const envLookup = buildEnvLookup(envData, (date) => {
    const row = monthIndexes.get(formatMonthKey(date));
    if (row === undefined) {
      return null;
    }
    return `${row}-${jsDayToMondayIndex(date.getDay())}`;
  });

  applyEnvData(cells, envLookup);

  return {
    cells,
    rowLabels,
    colLabels: [...DAY_LABELS],
    maxCount: getMaxCount(cells),
    mode: "month-weekday",
  };
}

export { aggregateHeatmapDateHour, aggregateHeatmapMonthWeekday, aggregateHeatmapWeekDay };
