// oxlint-disable eslint/max-lines -- All API types, hard to read yes but better than all separate files still maybe

interface Location {
  lat: number;
  long: number;
  alt?: number;
}

interface Environment {
  timestamp: string;
  device_id: string;
  pm1p0?: number;
  pm2p5?: number;
  pm4p0?: number;
  pm10p0?: number;
  ambient_humidity?: number;
  ambient_temperature?: number;
  voc_index?: number;
  nox_index?: number;
  location?: Location;
}

interface EnvironmentResponse {
  items: Environment[];
  count: number;
  next_token?: string;
}

interface GetEnvironmentParameters {
  start_time?: string;
  end_time?: string;
  device_id?: string[];
  deployment_id?: string;
  limit?: number;
  next_token?: string;
  sort_by?: keyof Environment;
  sort_desc?: boolean;
}

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
  image_key?: string;
  image_bucket?: string;
  hub_count?: number;
}

interface DeploymentDevice {
  device_id: string;
  name?: string;
  location?: Location;
}

type UpdateDeploymentDevice = Omit<DeploymentDevice, "device_id">;

interface Device {
  created: Date;
  device_id: string;
}

// Device refers to the devices returned by the /devices API endpoint while deploymentDevices refer to devices in the context of being connected to a hub
interface DevicesResponse {
  items: Device[];
}

interface CreateDeploymentBody {
  name?: string;
  description?: string;
  deployment_id?: string;
  start_time?: string;
  end_time?: string | null;
  model_id?: string;
  location_name?: string;
  location?: { lat: number; long: number };
  image?: string;
}

type UpdateDeploymentBody = Omit<CreateDeploymentBody, "deployment_id">;

interface SaveDeploymentArgs {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string | null;
  image?: string;
  devices: Array<{ device_id: string; name?: string; location?: { lat: number; long: number } }>;
  initialDevices: Array<{
    device_id: string;
    name?: string;
    location?: { lat: number; long: number };
  }>;
}

interface DeploymentsResponse {
  deployments: Deployment[];
  count: number;
  next_token: string;
}

interface SelectedDeploymentResponse {
  deployment: Deployment;
  devices: DeploymentDevice[];
}

interface GetDeploymentsParameters {
  limit?: number;
  next_token?: string;
  sort_by?: keyof Deployment;
  sort_desc?: boolean;
}

interface GetSelectedDeploymentParameters {
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

interface EnvironmentTimeSeriesResponse {
  temperature: number[];
  humidity: number[];
  pm1p0: number[];
  pm2p5: number[];
  pm4p0: number[];
  pm10: number[];
  voc: number[];
  nox: number[];
  start_time: Date;
  interval_length: number;
  interval_unit: IntervalUnit;
}

interface GetEnvironmentTimeSeriesParameters {
  start_time: string;
  end_time: string;
  device_id?: string[];
  deployment_id?: string;
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
  environment?: Environment;
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
  start_time?: string;
  end_time?: string;
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
  start_time?: string;
  end_time?: string;
  device_id?: string[];
  deployment_id?: string;
  model_id?: string;
  min_confidence?: number;
  taxonomy_level?: TaxonomyLevel;
  selected_taxa?: string[];
}

interface Heartbeat {
  uptime_seconds: number;
  storage_total_bytes: number;
  storage_free_bytes: number;
  cpu_temperature_celsius: number;
  device_id: string;
  dot_status: {
    last_modified: Date;
    dot_id: string;
  }[];
  timestamp: Date;
}

interface HeartbeatsResponse {
  items: Heartbeat[];
  count: number;
}

interface GetHeartbeatsParameters {
  start_time?: string;
  device_id?: string;
}

interface DetectableTaxaResponse {
  model_id: string;
  source?: string;
  labels?: {
    class_index: number;
    name: string;
  }[];
}

interface GetDetectableTaxaParameters {
  model_id?: string;
}

export type {
  Location,
  Environment,
  EnvironmentResponse,
  GetEnvironmentParameters,
  Deployment,
  DeploymentDevice,
  UpdateDeploymentDevice,
  Device,
  DevicesResponse,
  CreateDeploymentBody,
  UpdateDeploymentBody,
  SaveDeploymentArgs,
  DeploymentsResponse,
  SelectedDeploymentResponse,
  GetDeploymentsParameters,
  GetSelectedDeploymentParameters,
  TaxaCount,
  TaxaCountResponse,
  TaxonomyLevel,
  GetTaxaCountParameters,
  IntervalUnit,
  ObservationsTimeSeriesResponse,
  GetObservationsTimeSeriesParameters,
  EnvironmentTimeSeriesResponse,
  GetEnvironmentTimeSeriesParameters,
  DeviceIdProps,
  Observation,
  ObservationsResponse,
  ObservationCountResponse,
  GetObservationsParameters,
  GetObservationCountParameters,
  HeartbeatsResponse,
  GetHeartbeatsParameters,
  DetectableTaxaResponse,
  GetDetectableTaxaParameters,
};
