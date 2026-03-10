interface Location {
  lat: number;
  long: number;
  alt?: number;
}

interface EnvironmentData {
  pm1p0?: number;
  pm2p5?: number;
  pm4p0?: number;
  pm10p0?: number;
  ambient_humidity?: number;
  ambient_temperature?: number;
  voc_index?: number;
  nox_index?: number;
  timestamp: string;
  device_id: string;
  location?: { lat?: number; long?: number; alt?: number };
}

interface ClassificationCandidate {
  name: string;
  confidence: number;
}

interface ClassificationData {
  family?: ClassificationCandidate[];
  genus?: ClassificationCandidate[];
  species?: ClassificationCandidate[];
}

interface Classification {
  device_id: string;
  timestamp: string;
  model_id: string;
  family: string;
  genus: string;
  species: string;
  family_confidence: number;
  genus_confidence: number;
  species_confidence: number;
  classification_data?: ClassificationData;
  image_url?: string;
  image_key?: string;
  image_bucket?: string;
  location?: Location;
  environment?: EnvironmentData;
}

interface PaginatedResponse<T> {
  items: T[];
  count: number;
  next_token?: string;
}

interface Deployment {
  id: string;
  active: boolean;
}

interface DeviceIdProps {
  value?: string;
}

// Left timestamp and device id required.
interface Observation {
  species?: string;
  genus?: string;
  family?: string;
  species_confidence?: number;
  genus_confidence?: number;
  family_confidence?: number;
  timestamp: string;
  device_id: string;
  model_id?: string;
  image_url?: string;
  image_bucket?: string;
  image_key?: string;
}

interface ObservationsResponse {
  items: Observation[];
  nextToken: string | null;
}

type TaxonomyLevel = "family" | "genus" | "species";

type DatePreset = "all" | "24h" | "7d" | "30d" | "custom";

type WorkspaceTab = "overview" | "analytics" | "observations";

export type {
  Location,
  EnvironmentData,
  ClassificationData,
  Classification,
  PaginatedResponse,
  Deployment,
  DeviceIdProps,
  Observation,
  ObservationsResponse,
  TaxonomyLevel,
  DatePreset,
  WorkspaceTab,
};
