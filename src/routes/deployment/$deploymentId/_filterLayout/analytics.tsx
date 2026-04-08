import { createFileRoute } from "@tanstack/react-router";

import { ActivityHeatmapCard } from "@/components/charts/ActivityHeatmapCard";
import { AirPollutionCard } from "@/components/charts/AirPollutionCard";
import { AirQualityIndicesCard } from "@/components/charts/AirQualityIndicesCard";
import { EnvironmentalConditionsCard } from "@/components/charts/EnvironmentalConditionsCard";

export const Route = createFileRoute("/deployment/$deploymentId/_filterLayout/analytics")({
  head: () => ({
    meta: [{ title: "Analytics | Sensing Garden Dashboard" }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { deploymentId } = Route.useParams();

  return (
    <div className="flex flex-col gap-6">
      <ActivityHeatmapCard deploymentId={deploymentId} />
      <EnvironmentalConditionsCard deploymentId={deploymentId} />
      <AirPollutionCard deploymentId={deploymentId} />
      <AirQualityIndicesCard deploymentId={deploymentId} />
    </div>
  );
}
