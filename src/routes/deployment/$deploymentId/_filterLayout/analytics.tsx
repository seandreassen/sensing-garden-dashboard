import { createFileRoute } from "@tanstack/react-router";

import { AirPollutionChart } from "@/components/charts/AirPollutionChart";
import { AirQualityIndicesChart } from "@/components/charts/AirQualityIndicesChart";
import { EnvironmentalConditionsChart } from "@/components/charts/EnvironmentalConditionsChart";
import { useEnvironmentData } from "@/lib/hooks/useEnvironmentData";
import { useFilters } from "@/lib/hooks/useFilters";

export const Route = createFileRoute("/deployment/$deploymentId/_filterLayout/analytics")({
  component: RouteComponent,
});

function RouteComponent() {
  const { startDate, endDate, hub } = useFilters();
  const { isLoading, isError, error } = useEnvironmentData({
    startTime: startDate,
    endTime: endDate,
    hubId: hub,
  });

  if (isLoading) {
    return <div>Loading environmental data...</div>;
  }
  if (isError && error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col border">
      <h2 className="p-2 text-xl font-semibold">Environmental Data</h2>

      <div className="rounded p-4">
        <EnvironmentalConditionsChart />
      </div>

      <div className="rounded p-4">
        <AirPollutionChart />
      </div>

      <div className="rounded p-4">
        <AirQualityIndicesChart />
      </div>
    </div>
  );
}
