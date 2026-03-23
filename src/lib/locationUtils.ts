import type { Location } from "@/lib/types/api";

function toRadians(deg: number) {
  return (deg * Math.PI) / 180;
}

function haversineDistance(a: Location, b: Location): number {
  const R = 6371000;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.long - a.long);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat));
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

// Returns the zoom level at which to switch from the deployment pin to individual location pins,
// based on how spread out the locations are from their centroid.
// Tighter clusters require more zoom before switching.
function computeMinZoomForLocations(locations: Location[]): number {
  if (locations.length === 0) {
    return 8;
  }

  const centroid: Location = {
    lat: locations.reduce((sum, l) => sum + l.lat, 0) / locations.length,
    long: locations.reduce((sum, l) => sum + l.long, 0) / locations.length,
  };

  const maxDistance = Math.max(...locations.map((l) => haversineDistance(centroid, l)));

  if (maxDistance <= 100) {
    return 18;
  }
  if (maxDistance <= 250) {
    return 17;
  }
  if (maxDistance <= 500) {
    return 16;
  }
  if (maxDistance <= 1000) {
    return 14;
  }
  return 12;
}

export { computeMinZoomForLocations };
