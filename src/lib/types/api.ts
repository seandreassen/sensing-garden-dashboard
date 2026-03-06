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

//Left device_id and timestamp required.
interface Classification {
  //Classification object always contains these.
  device_id: string;
  timestamp: string;
  model_id?: string;
  family?: string;
  genus?: string;
  species?: string;
  family_confidence?: number;
  genus_confidence?: number;
  species_confidence?: number;
  //Classifiation object may include these.
  classification_data?: ClassificationData;
  image_url?: string;
  image_key?: string;
  image_bucket?: string;
  location?: Location;
  environment?: EnvironmentData;
}
interface ClassificationResponse {
  items: Classification[];
  count?: number;
  nextToken?: string | null;
}
interface PaginatedResponse<T> {
  items: T[];
  count: number;
  next_token?: string;
}

interface Deployment {
  deploymentId: string;
  active: boolean;
}

interface DeviceIdProps {
  value?: string;
}

type TaxonomyLevel = "family" | "genus" | "species";

export type {
  Location,
  EnvironmentData,
  ClassificationCandidate,
  ClassificationData,
  Classification,
  ClassificationResponse,
  PaginatedResponse,
  Deployment,
  TaxonomyLevel,
  DeviceIdProps,
};
