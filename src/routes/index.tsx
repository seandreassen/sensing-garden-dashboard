import { createFileRoute } from "@tanstack/react-router";

import { AirPollutionChart } from "@/components/charts/AirPollutionChart";
import { AirQualityIndicesChart } from "@/components/charts/AirQualityIndicesChart";
import { EnvironmentalConditionsChart } from "@/components/charts/EnvironmentalConditionsChart";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex h-screen w-screen items-center justify-center bg-gray-50 p-8">
      <EnvironmentalConditionsChart filters={{ dateRange: "Last 7 Days" }} />
      <AirPollutionChart filters={{ dateRange: "Last 7 Days" }} />
      <AirQualityIndicesChart filters={{ dateRange: "Last 7 Days" }} />
    </main>
  );
}
