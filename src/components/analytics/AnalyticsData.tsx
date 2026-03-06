import { AirPollutionChart } from "@/components/charts/AirPollutionChart";
import { AirQualityIndicesChart } from "@/components/charts/AirQualityIndicesChart";
import { EnvironmentalConditionsChart } from "@/components/charts/EnvironmentalConditionsChart";
import { useEnvironmentData } from "@/lib/hooks/useEnvironmentData";

export function AnalyticsData() {
  const { data, loading, error } = useEnvironmentData();

  if (loading) {
    return <div>Loading environmental data...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
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
