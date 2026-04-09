import { createFileRoute } from "@tanstack/react-router";

import { ActivityHeatmapCard } from "@/components/analytics/ActivityHeatmapCard";
import { AirPollutionCard } from "@/components/analytics/AirPollutionCard";
import { AirQualityIndicesCard } from "@/components/analytics/AirQualityIndicesCard";
import { EnvironmentalConditionsCard } from "@/components/analytics/EnvironmentalConditionsCard";
import { TaxaTreemap } from "@/components/analytics/TaxaTreemap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";

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
      <Card className="self-start p-4 lg:w-1/2">
        <CardHeader>
          <CardTitle className="text-lg capitalize">Taxa treemap</CardTitle>
          <CardDescription>Detection count by selected taxonomy level</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <TaxaTreemap deploymentId={deploymentId} />
        </CardContent>
      </Card>
    </div>
  );
}
