export interface EnvironmentalItem {
  pm10p0: number;
  pm1p0: number;
  pm2p5: number;
  pm4p0: number;
  ambient_temperature: number;
  ambient_humidity: number;
  voc_index: number;
  nox_index: number;
  timestamp: string;
  device_id: string;
  location?: { lat?: number; long?: number; alt?: number };
}

export interface EnvironmentResponse {
  items: EnvironmentalItem[];
  count: number;
}

export async function fetchEnvironmentData(): Promise<EnvironmentalItem[]> {
  const res = await fetch("https://api.sensinggarden.com/v1/environment", {
    headers: {
      "X-API-Key": "your-api-key-here",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch environment data");
  }

  const json: EnvironmentResponse = await res.json();
  return json.items;
}
