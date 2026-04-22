import { startOfDay, startOfMonth, startOfWeek, startOfYear } from "date-fns";
import { expect, test } from "vitest";

import { getRowBuckets } from "@/lib/utils/heatmap";

test("returns daily buckets for ranges up to 7 days", () => {
  const start = new Date("2025-06-02T00:00:00.000Z");
  const end = new Date("2025-06-05T00:00:00.000Z");

  const buckets = getRowBuckets(start, end);

  expect(buckets).toHaveLength(4);
  expect(buckets[0].label).toBe("Mon");
  expect(buckets[0].heatmapStart).toEqual(startOfDay(start));
  expect(buckets[3].label).toBe("Thu");
});

test("returns weekly buckets for ranges between 8 and 60 days", () => {
  const start = new Date("2025-06-01T00:00:00.000Z");
  const end = new Date("2025-07-15T00:00:00.000Z");

  const buckets = getRowBuckets(start, end);

  expect(buckets.length).toBeGreaterThan(1);
  expect(buckets[0].label).toMatch(/^Week \d+$/);
  expect(buckets[0].heatmapStart).toEqual(startOfWeek(new Date("2025-06-01")));
});

test("returns monthly buckets for ranges between 61 and 365 days", () => {
  const start = new Date("2025-01-01T00:00:00.000Z");
  const end = new Date("2025-06-30T00:00:00.000Z");

  const buckets = getRowBuckets(start, end);

  expect(buckets).toHaveLength(6);
  expect(buckets[0].label).toBe("Jan");
  expect(buckets[0].heatmapStart).toEqual(startOfMonth(start));
  expect(buckets[5].label).toBe("Jun");
});

test("returns yearly buckets for ranges exceeding 365 days", () => {
  const start = new Date("2023-01-01T00:00:00.000Z");
  const end = new Date("2025-12-31T00:00:00.000Z");

  const buckets = getRowBuckets(start, end);

  expect(buckets).toHaveLength(3);
  expect(buckets[0].label).toBe("2023");
  expect(buckets[0].heatmapStart).toEqual(startOfYear(start));
  expect(buckets[2].label).toBe("2025");
});

test("returns a single bucket when start equals end", () => {
  const date = new Date("2025-06-01T00:00:00.000Z");
  const buckets = getRowBuckets(date, date);

  expect(buckets).toHaveLength(1);
  expect(buckets[0].heatmapStart).toEqual(startOfDay(date));
});

test("weekly buckets start on Sunday by default (date-fns default)", () => {
  const start = new Date("2025-06-02T00:00:00.000Z"); // Monday
  const end = new Date("2025-06-20T00:00:00.000Z");

  const buckets = getRowBuckets(start, end);
  const firstStart = buckets[0].heatmapStart;

  // date-fns eachWeekOfInterval/startOfWeek defaults to weekStartsOn: 0 (Sunday).
  // If Monday-based weeks are needed, pass { weekStartsOn: 1 } to both calls.
  expect(firstStart.getDay()).toBe(0);
});
