import { createFileRoute } from "@tanstack/react-router";

import { SpeciesRichnessCard } from "@/components/analysis/SpeciesRichnessCard";
import { TotalInsectCountCard } from "@/components/analysis/TotalInsectCountCard";
import { DetectionsOverTime } from "@/components/charts/DetectionsOverTime";
import { TopTaxa } from "@/components/charts/TopTaxa";
import { GoogleMaps } from "@/components/map/GoogleMaps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useDeployment } from "@/lib/hooks/useDeployment";

export const Route = createFileRoute("/deployment/$deploymentId/_filterLayout/overview")({
  head: () => ({
    meta: [{ title: "Overview | Sensing Garden Dashboard" }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { deploymentId } = Route.useParams();
  const { data: deploymentData } = useDeployment({ deployment_id: deploymentId });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-5">
        <TotalInsectCountCard deploymentId={deploymentId} />
        <SpeciesRichnessCard deploymentId={deploymentId} />
      </div>
      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader className="flex flex-col">
            <CardTitle className="text-lg">Insect detections over time</CardTitle>
            <p className="text-sm text-muted-foreground">
              Daily detection count over the selected period
            </p>
          </CardHeader>
          <CardContent>
            <DetectionsOverTime deploymentId={deploymentId} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-col">
            <CardTitle className="text-lg">Top families</CardTitle>
            <p className="text-sm text-muted-foreground">
              Most detected families over the selected period
            </p>
          </CardHeader>
          <CardContent>
            <TopTaxa deploymentId={deploymentId} />
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader className="flex flex-col">
            <CardTitle className="text-lg">Deployment location</CardTitle>
            <p className="text-sm text-muted-foreground">
              Location of deployment and its contained hubs
            </p>
          </CardHeader>
          <CardContent>
            <GoogleMaps
              initialLocations={deploymentData?.devices
                .map((device) => device.location)
                .filter((location) => !!location)}
              center={deploymentData?.deployment.location}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
