import type { TaxonomyLevel } from "@/lib/filters";
import type { Observation } from "@/lib/types/api";

function normalizeConfidenceValue(confidence: number | undefined): number {
  if (confidence === undefined || Number.isNaN(confidence)) {
    return 0;
  }

  return confidence <= 1 ? confidence * 100 : confidence;
}

function getObservationConfidence(observation: Observation, taxonomyLevel: TaxonomyLevel): number {
  const confidenceKey = `${taxonomyLevel}_confidence` as keyof Observation;
  const confidence = observation[confidenceKey] as number | undefined;
  return normalizeConfidenceValue(confidence);
}

export { getObservationConfidence, normalizeConfidenceValue };
