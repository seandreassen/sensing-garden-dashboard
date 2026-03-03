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

interface Deployment {
  deploymentId: string;
  name: string;
  active: boolean;
  date: Date;
  location: string;
}

export type { Location, EnvironmentData, ClassificationData, Deployment };
