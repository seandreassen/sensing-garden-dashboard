import { addDays, addHours } from "date-fns";

import type { IntervalUnit } from "@/lib/types/api";

function getHours(start: Date, end: Date) {
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

/**
 * Standardizes interval from the start to end date
 * @param start Start of the interval
 * @param end End of the interval
 * @param [maxIntervals=42] The most amount of intervals to return, interval length/unit is increased until below this threshold
 * * Default is 42 because it doesn't look like too much and fits ok with the the preset ranges
 * @returns The interval length and unit of the standardized interval
 */
function getInterval(start: Date, end: Date, maxIntervals = 42) {
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

/**
 * Standardizes tick format based on the interval length
 * * Accepts values based on the return value of time series endpoints
 * @param start Start of the interval
 * @param intervalUnit The unit of the interval
 * @param intervalLength The amount of the interval unit between each data point
 * @param intervals The number of intervals
 * @returns The standardized tick format string for date-fns format function
 */
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
