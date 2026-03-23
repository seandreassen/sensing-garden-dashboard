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

interface Deployment {
  id: string;
  active: boolean;
  location?: { lat: number; lng: number };
  name?: string;
  place?: string;
  hub_count?: number;
  last_updated?: string;
}

interface DeviceIdProps {
  value?: string;
}

// Left timestamp and device id required.
interface Observation {
  timestamp: string;
  device_id: string;
  model_id: string;
  species: string;
  genus: string;
  family: string;
  species_confidence: number;
  genus_confidence: number;
  family_confidence: number;
  image_url?: string;
  image_bucket?: string;
  image_key?: string;
}

interface ObservationsResponse {
  items: Observation[];
  count: number;
  nextToken: string | null;
}

interface Hub {
  device_id: string;
  created: Date;
}

interface DevicesResponse {
  items: Hub[];
  next_token: { device_id: string };
}

// Should be removed - migrate to useFilters()
type TaxonomyLevel = "family" | "genus" | "species";

type DatePreset = "all" | "24h" | "7d" | "30d" | "custom";

type WorkspaceTab = "overview" | "analytics" | "observations";

export type {
  Location,
  EnvironmentData,
  Deployment,
  DeviceIdProps,
  Observation,
  ObservationsResponse,
  DevicesResponse,
  TaxonomyLevel,
  DatePreset,
  WorkspaceTab,
};
