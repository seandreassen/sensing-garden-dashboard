import { expect, test } from "vitest";

import { computeMinZoomForLocations } from "@/lib/utils/location";

test("returns default zoom 8 for empty locations array", () => {
  expect(computeMinZoomForLocations([])).toBe(8);
});

test("returns max zoom 18 for a single location (zero spread)", () => {
  expect(computeMinZoomForLocations([{ lat: 0, long: 0 }])).toBe(18);
});

test("returns zoom 18 for very tight cluster (< 100m spread)", () => {
  const locations = [
    { lat: 0, long: 0 },
    { lat: 0.0004, long: 0 },
  ];
  expect(computeMinZoomForLocations(locations)).toBe(18);
});

test("returns zoom 17 for cluster with ~200m spread", () => {
  const locations = [
    { lat: 0, long: 0 },
    { lat: 0.0018, long: 0 },
  ];
  expect(computeMinZoomForLocations(locations)).toBe(17);
});

test("returns zoom 16 for cluster with ~400m spread", () => {
  const locations = [
    { lat: 0, long: 0 },
    { lat: 0.0072, long: 0 },
  ];
  expect(computeMinZoomForLocations(locations)).toBe(16);
});

test("returns zoom 14 for cluster with ~700m spread", () => {
  const locations = [
    { lat: 0, long: 0 },
    { lat: 0.0126, long: 0 },
  ];
  expect(computeMinZoomForLocations(locations)).toBe(14);
});

test("returns zoom 12 for widely spread locations (> 1km)", () => {
  const locations = [
    { lat: 0, long: 0 },
    { lat: 0.05, long: 0 },
  ];
  expect(computeMinZoomForLocations(locations)).toBe(12);
});

test("handles locations far apart", () => {
  const locations = [
    { lat: 10, long: 10 },
    { lat: -10, long: -10 },
  ];
  expect(computeMinZoomForLocations(locations)).toBe(12);
});

test("handles identical locations as tight cluster", () => {
  const point = { lat: 0, long: 0 };
  expect(computeMinZoomForLocations([point, point, point])).toBe(18);
});
