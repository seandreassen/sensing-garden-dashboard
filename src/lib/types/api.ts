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
  deploymentId: string;
  active: boolean;
}

type TaxonomyLevel = "family" | "genus" | "species";

type DatePreset = "24h" | "7d" | "30d" | "custom";

type WorkspaceTab = "overview" | "analytics" | "observations";

export type {
  Location,
  EnvironmentData,
  ClassificationCandidate,
  ClassificationData,
  Classification,
  PaginatedResponse,
  Deployment,
  TaxonomyLevel,
  DatePreset,
  WorkspaceTab,
};
