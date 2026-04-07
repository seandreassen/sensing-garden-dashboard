import { addDays, addHours } from "date-fns";

import type { IntervalUnit } from "@/lib/types/api";

function getHours(start: Date, end: Date) {
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

function getInterval(start: Date, end: Date, maxIntervals = 100) {
  const hours = getHours(start, end);

  for (const hourIntervalLength of [1, 2, 3, 4, 6, 8, 12]) {
    if (hours <= hourIntervalLength * maxIntervals) {
      return {
        intervalLength: hourIntervalLength,
        intervalUnit: "h" as IntervalUnit,
      };
    }
  }

  return {
    intervalLength: Math.ceil(hours / 24 / maxIntervals),
    intervalUnit: "d" as IntervalUnit,
  };
}

function getTickFormat(
  start: Date,
  intervalUnit: IntervalUnit,
  intervalLength: number,
  intervals: number,
) {
  const end =
    intervalUnit === "h"
      ? addHours(start, intervalLength * intervals)
      : addDays(start, intervalLength * intervals);
  const hours = getHours(start, end);

  if (hours <= 24) {
    return "HH:mm";
  } else if (hours <= 168) {
    return "EEE HH:mm";
  } else if (hours <= 720) {
    return "MMM d";
  } else if (hours <= 2160) {
    return "MMM d";
  }
  return "MMM yyyy";
}

export { getInterval, getTickFormat };
