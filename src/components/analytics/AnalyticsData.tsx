import { useEffect, useState } from "react";

import { fetchEnvironmentData } from "@/api/environment";
import type { EnvironmentalItem } from "@/api/environment";
import { AirPollutionChart } from "@/components/charts/AirPollutionChart";
import { AirQualityIndicesChart } from "@/components/charts/AirQualityIndicesChart";
import { EnvironmentalConditionsChart } from "@/components/charts/EnvironmentalConditionsChart";

interface AnalyticsDataProps {
  deploymentId: string;
}

export function AnalyticsData({ deploymentId }: AnalyticsDataProps) {
  const [data, setData] = useState<EnvironmentalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const items = await fetchEnvironmentData();

        const seen = new Set<string>();
        const uniqueItems = items.filter((item) => {
          const key = item.timestamp;
          if (seen.has(key)) {
            return false;
          }
          seen.add(key);
          return true;
        });

        setData(uniqueItems);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [deploymentId]);

  if (loading) {
    return <div>Loading environmental data...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col border">
      <h2 className="p-2 text-xl font-semibold">Environmental Data</h2>

      <div className="rounded p-4">
        <EnvironmentalConditionsChart rawData={data} />
      </div>

      <div className="rounded p-4">
        <AirPollutionChart rawData={data} />
      </div>

      <div className="rounded p-4">
        <AirQualityIndicesChart rawData={data} />
      </div>
    </div>
  );
}
