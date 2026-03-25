interface PaginatedResponse<T> {
  items: T[];
  count?: number;
  next_token?: string | null;
}

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

interface EnvironmentResponse extends PaginatedResponse<EnvironmentData> {}

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
  image_bucket: string;
  image_key: string;
}

interface ObservationsResponse extends PaginatedResponse<Observation> {}

interface ObservationCountResponse {
  count: number;
}

interface Hub {
  device_id: string;
  created: Date;
}

interface DevicesResponse extends PaginatedResponse<Hub> {}

interface QueryParameters {
  startTime?: string;
  endTime?: string;
  hubId?: string;
  limit?: number;
  sortBy?: string;
  sortDesc?: boolean;
}

// Should be removed - migrate to useFilters()
type TaxonomyLevel = "family" | "genus" | "species";

type DatePreset = "all" | "24h" | "7d" | "30d" | "custom";

type WorkspaceTab = "overview" | "analytics" | "observations";

export type {
  Location,
  EnvironmentData,
  EnvironmentResponse,
  Deployment,
  DeviceIdProps,
  Observation,
  ObservationsResponse,
  ObservationCountResponse,
  DevicesResponse,
  QueryParameters,
  TaxonomyLevel,
  DatePreset,
  WorkspaceTab,
};
