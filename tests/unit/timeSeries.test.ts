import { expect, test } from "vitest";

import { getInterval, getTickFormat } from "@/lib/utils/timeSeries";

test("returns hourly intervals for short date ranges", () => {
  const start = new Date("2025-06-01T00:00:00.000Z");
  const end = new Date("2025-06-01T12:00:00.000Z");

  expect(getInterval(start, end)).toEqual({
    intervalLength: 1,
    intervalUnit: "h",
  });
});

test("increases hourly interval length for week-long date ranges", () => {
  const start = new Date("2025-06-01T00:00:00.000Z");
  const end = new Date("2025-06-08T00:00:00.000Z");

  expect(getInterval(start, end)).toEqual({
    intervalLength: 4,
    intervalUnit: "h",
  });
});

test("returns daily intervals for long date ranges", () => {
  const start = new Date("2025-06-01T00:00:00.000Z");
  const end = new Date("2025-08-30T00:00:00.000Z");

  expect(getInterval(start, end)).toEqual({
    intervalLength: 3,
    intervalUnit: "d",
  });
});

test("handles zero-length date range", () => {
  const date = new Date("2025-06-01T00:00:00.000Z");

  expect(getInterval(date, date)).toEqual({
    intervalLength: 1,
    intervalUnit: "h",
  });
});

test("returns expected tick formats based on time span", () => {
  const start = new Date("2025-06-01T00:00:00.000Z");

  expect(getTickFormat(start, "h", 1, 24)).toBe("HH:mm");
  expect(getTickFormat(start, "h", 4, 42)).toBe("EEE HH:mm");
  expect(getTickFormat(start, "d", 1, 60)).toBe("MMM d");
  expect(getTickFormat(start, "d", 1, 120)).toBe("MMM yyyy");
});
