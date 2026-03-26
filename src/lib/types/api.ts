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
  name: string;
  description: string;
  deployment_id: string;
  start_time: Date;
  end_time?: Date;
  model_id?: string;
  location_name?: string;
  location?: Location;
  image_url?: string;
}

interface DeploymentsResponse {
  deployments: Deployment[];
  count: number;
  next_token: string;
}

interface DeploymentDevice {
  device_id: string;
  deployment_id: string;
  name?: string;
  location?: Location;
}

interface DeploymentResponse {
  deployment: Deployment;
  devices: DeploymentDevice[];
}

interface GetDeploymentsParameters {
  limit?: number;
  next_token?: string;
  sort_by?: keyof Deployment;
  sort_desc?: boolean;
}

interface GetDeploymentParameters {
  deployment_id: string;
}

interface TaxaCount {
  taxa: string;
  count: number;
}

interface TaxaCountResponse {
  counts: TaxaCount[];
}

type TaxonomyLevel = "family" | "genus" | "species";

interface GetTaxaCountParameters {
  start_time?: string;
  end_time?: string;
  device_id?: string[];
  deployment_id?: string;
  model_id?: string;
  min_confidence?: number;
  taxonomy_level: TaxonomyLevel;
  selected_taxa?: string[];
  sort_desc?: boolean;
}

type IntervalUnit = "h" | "d";

interface ObservationsTimeSeriesResponse {
  counts: number[];
  start_time: Date;
  interval_length: number;
  interval_unit: IntervalUnit;
}

interface GetObservationsTimeSeriesParameters {
  start_time: string;
  end_time: string;
  device_id?: string[];
  deployment_id?: string;
  model_id?: string;
  min_confidence?: number;
  taxonomy_level?: TaxonomyLevel;
  selected_taxa?: string[];
  interval_length: number;
  interval_unit: IntervalUnit;
}

interface DeviceIdProps {
  value?: string;
}

interface Observation {
  timestamp: Date;
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

interface ObservationsResponse {
  items: Observation[];
  count: number;
  next_token: string;
}

interface ObservationCountResponse {
  count: number;
}

interface GetObservationsParameters {
  start_time: string;
  end_time: string;
  device_id?: string[];
  deployment_id?: string;
  model_id?: string;
  min_confidence?: number;
  taxonomy_level?: TaxonomyLevel;
  selected_taxa?: string[];
  limit?: number;
  next_token?: string;
  sort_by?: keyof Observation;
  sort_desc?: boolean;
}

interface GetObservationCountParameters {
  start_time: string;
  end_time: string;
  device_id?: string[];
  deployment_id?: string;
  model_id?: string;
  min_confidence?: number;
  taxonomy_level?: TaxonomyLevel;
  selected_taxa?: string[];
}

interface Hub {
  device_id: string;
  created: Date;
}

interface DevicesResponse extends PaginatedResponse<Hub> {}

// Should be removed - migrate to useFilters()

type DatePreset = "all" | "24h" | "7d" | "30d" | "custom";

type WorkspaceTab = "overview" | "analytics" | "observations";

export type {
  Location,
  EnvironmentData,
  EnvironmentResponse,
  Deployment,
  DeploymentsResponse,
  DeploymentResponse,
  GetDeploymentsParameters,
  GetDeploymentParameters,
  TaxaCountResponse,
  GetTaxaCountParameters,
  IntervalUnit,
  ObservationsTimeSeriesResponse,
  GetObservationsTimeSeriesParameters,
  DeviceIdProps,
  Observation,
  ObservationsResponse,
  ObservationCountResponse,
  GetObservationsParameters,
  GetObservationCountParameters,
  DevicesResponse,
  TaxonomyLevel,
  DatePreset,
  WorkspaceTab,
};
