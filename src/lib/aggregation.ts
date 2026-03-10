import type { Observation, TaxonomyLevel } from "@/lib/types/api";

// --- Time aggregation ---

type TimeBucket = "hour" | "day" | "week";

interface TimePoint {
  time: string;
  count: number;
}

function pickBucket(preset: string): TimeBucket {
  switch (preset) {
    case "24h":
      return "hour";
    case "7d":
      return "day";
    case "30d":
      return "day";
    case "all":
      return "week";
    default:
      return "day";
  }
}

function truncateToHour(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:00`;
}

function truncateToDay(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function truncateToWeek(date: Date): string {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date);
  monday.setDate(diff);
  return truncateToDay(monday);
}

function bucketKey(date: Date, bucket: TimeBucket): string {
  switch (bucket) {
    case "hour":
      return truncateToHour(date);
    case "day":
      return truncateToDay(date);
    case "week":
      return truncateToWeek(date);
  }
}

function generateEmptyBuckets(
  startTime: string,
  endTime: string,
  bucket: TimeBucket,
): Map<string, number> {
  const buckets = new Map<string, number>();
  const endMs = new Date(endTime).getTime();
  let currentMs = new Date(startTime).getTime();

  while (currentMs <= endMs) {
    const current = new Date(currentMs);
    buckets.set(bucketKey(current, bucket), 0);
    switch (bucket) {
      case "hour":
        currentMs += 60 * 60 * 1000;
        break;
      case "day":
        currentMs += 24 * 60 * 60 * 1000;
        break;
      case "week":
        currentMs += 7 * 24 * 60 * 60 * 1000;
        break;
    }
  }

  return buckets;
}

function deriveRange(observations: Observation[]): { startTime: string; endTime: string } {
  if (observations.length === 0) {
    const now = new Date();
    return { startTime: now.toISOString(), endTime: now.toISOString() };
  }
  let min = observations[0].timestamp;
  let max = observations[0].timestamp;
  for (const obs of observations) {
    if (obs.timestamp < min) {
      min = obs.timestamp;
    }
    if (obs.timestamp > max) {
      max = obs.timestamp;
    }
  }
  return { startTime: new Date(min).toISOString(), endTime: new Date(max).toISOString() };
}

function aggregateByTime(
  observations: Observation[],
  startTime: string,
  endTime: string,
  bucket: TimeBucket,
  minConfidence: number = 0,
  taxonomyLevel: TaxonomyLevel = "family",
): TimePoint[] {
  const effectiveStart = startTime || deriveRange(observations).startTime;
  const effectiveEnd = endTime || deriveRange(observations).endTime;
  const buckets = generateEmptyBuckets(effectiveStart, effectiveEnd, bucket);
  const confKey = `${taxonomyLevel}_confidence` as keyof Observation;

  for (const obs of observations) {
    const confidence = (obs[confKey] as number | undefined) ?? 0;
    if (confidence < minConfidence) {
      continue;
    }

    const date = new Date(obs.timestamp);
    const key = bucketKey(date, bucket);
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }

  return Array.from(buckets.entries())
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([time, count]) => ({ time, count }));
}

// --- Taxonomy aggregation ---

interface TaxonCount {
  name: string;
  count: number;
}

function aggregateByTaxonomy(
  observations: Observation[],
  taxonomyLevel: TaxonomyLevel,
  minConfidence: number = 0,
  topN: number = 10,
): TaxonCount[] {
  const confKey = `${taxonomyLevel}_confidence` as keyof Observation;
  const counts = new Map<string, number>();

  for (const obs of observations) {
    const confidence = (obs[confKey] as number | undefined) ?? 0;
    if (confidence < minConfidence) {
      continue;
    }

    const name = obs[taxonomyLevel];
    if (!name) {
      continue;
    }

    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .toSorted((a, b) => b.count - a.count)
    .slice(0, topN);
}

export { aggregateByTime, aggregateByTaxonomy, pickBucket };
export type { TimePoint, TaxonCount, TimeBucket };
