import { createFileRoute } from "@tanstack/react-router";

import { ActivityHeatmapCard } from "@/components/analytics/ActivityHeatmapCard";
import { AirPollutionCard } from "@/components/analytics/AirPollutionCard";
import { AirQualityIndicesCard } from "@/components/analytics/AirQualityIndicesCard";
import { EnvironmentalConditionsCard } from "@/components/analytics/EnvironmentalConditionsCard";

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
