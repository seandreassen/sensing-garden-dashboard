export interface Location {
  lat: number;
  long: number;
  alt?: number;
}

export interface EnvironmentData {
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

export interface ClassificationCandidate {
  name: string;
  confidence: number;
}

export interface ClassificationData {
  family?: ClassificationCandidate[];
  genus?: ClassificationCandidate[];
  species?: ClassificationCandidate[];
}

export interface PostClassificationBody {
  device_id: string;
  model_id: string;
  image: string;
  family: string;
  genus?: string;
  species?: string;
  family_confidence?: number;
  genus_confidence?: number;
  species_confidence?: number;
  classification_data?: ClassificationData;
  location?: Location;
  environment?: EnvironmentData;
  track_id?: string;
  bounding_box?: [number, number, number, number];
}

export interface DeviceIdProps {
  value?: string;
}
