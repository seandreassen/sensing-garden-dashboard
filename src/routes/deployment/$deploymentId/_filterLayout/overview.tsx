import { createFileRoute } from "@tanstack/react-router";

import { GoogleMaps } from "@/components/map/GoogleMaps";
import { ObservationsCard } from "@/components/overview/ObservationsCard";
import { SpeciesRichnessCard } from "@/components/overview/SpeciesRichnessCard";
import { TopTaxaCard } from "@/components/overview/TopTaxaCard";
import { TotalInsectCountCard } from "@/components/overview/TotalInsectCountCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const Route = createFileRoute("/deployment/$deploymentId/_filterLayout/overview")({
  head: () => ({
    meta: [{ title: "Overview | Sensing Garden Dashboard" }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { deploymentId } = Route.useParams();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-5">
        <TotalInsectCountCard deploymentId={deploymentId} />
        <SpeciesRichnessCard deploymentId={deploymentId} />
      </div>
      <div className="grid grid-cols-3 gap-6">
        <ObservationsCard deploymentId={deploymentId} className="col-span-2" />
        <TopTaxaCard deploymentId={deploymentId} />
        <Card className="col-span-2">
          <CardHeader className="flex flex-col">
            <CardTitle className="text-lg">Deployment location</CardTitle>
            <p className="text-sm text-muted-foreground">
              Location of deployment and its contained hubs
            </p>
          </CardHeader>
          <CardContent>
            <GoogleMaps deploymentId={deploymentId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
