import { expect, test } from "vitest";

import { computeMinZoomForLocations } from "@/lib/utils/location";

test("returns default zoom 8 for empty locations array", () => {
  expect(computeMinZoomForLocations([])).toBe(8);
});

test("returns max zoom 18 for a single location (zero spread)", () => {
  expect(computeMinZoomForLocations([{ lat: 59.91, long: 10.75 }])).toBe(18);
});

test("returns zoom 18 for very tight cluster (< 100m spread)", () => {
  // Two points ~50m apart in Oslo
  const locations = [
    { lat: 59.91, long: 10.75 },
    { lat: 59.9104, long: 10.75 },
  ];
  expect(computeMinZoomForLocations(locations)).toBe(18);
});

test("returns zoom 17 for cluster with ~200m spread", () => {
  // Two points ~200m apart
  const locations = [
    { lat: 59.91, long: 10.75 },
    { lat: 59.9118, long: 10.75 },
  ];
  expect(computeMinZoomForLocations(locations)).toBe(17);
});

test("returns zoom 16 for cluster with ~400m spread", () => {
  // Two points ~800m apart → centroid maxDistance ~400m
  const locations = [
    { lat: 59.91, long: 10.75 },
    { lat: 59.9172, long: 10.75 },
  ];
  expect(computeMinZoomForLocations(locations)).toBe(16);
});

test("returns zoom 14 for cluster with ~700m spread", () => {
  // Two points ~1400m apart → centroid maxDistance ~700m
  const locations = [
    { lat: 59.91, long: 10.75 },
    { lat: 59.9226, long: 10.75 },
  ];
  expect(computeMinZoomForLocations(locations)).toBe(14);
});

test("returns zoom 12 for widely spread locations (> 1km)", () => {
  // Oslo and a point ~5km away
  const locations = [
    { lat: 59.91, long: 10.75 },
    { lat: 59.95, long: 10.75 },
  ];
  expect(computeMinZoomForLocations(locations)).toBe(12);
});

test("handles locations on opposite sides of the globe", () => {
  const locations = [
    { lat: 59.91, long: 10.75 },
    { lat: -33.87, long: 151.21 },
  ];
  expect(computeMinZoomForLocations(locations)).toBe(12);
});

test("handles identical locations as tight cluster", () => {
  const point = { lat: 52.37, long: 4.89 };
  expect(computeMinZoomForLocations([point, point, point])).toBe(18);
});
