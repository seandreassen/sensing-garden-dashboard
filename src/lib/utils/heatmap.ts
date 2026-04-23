import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";

function getRowBuckets(start: Date, end: Date) {
  const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

  if (days <= 7) {
    return eachDayOfInterval({ start, end }).map((date) => ({
      label: format(date, "EEE"),
      heatmapStart: startOfDay(date),
    }));
  } else if (days <= 60) {
    return eachWeekOfInterval({ start, end }).map((date) => ({
      label: format(date, "'Week' w"),
      heatmapStart: startOfWeek(date),
    }));
  } else if (days <= 365) {
    return eachMonthOfInterval({ start, end }).map((date) => ({
      label: format(date, "MMM"),
      heatmapStart: startOfMonth(date),
    }));
  } else {
    return eachYearOfInterval({ start, end }).map((date) => ({
      label: format(date, "yyyy"),
      heatmapStart: startOfYear(date),
    }));
  }
}

function getCellColor(count: number, max: number): string {
  if (count === 0 || max === 0) {
    return "var(--color-muted)";
  }
  const opacity = 0.15 + (count / max) * 0.85;
  return `color-mix(in srgb, var(--color-primary) ${Math.round(opacity * 100)}%, transparent)`;
}

export { getRowBuckets, getCellColor };
