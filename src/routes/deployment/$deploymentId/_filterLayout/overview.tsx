import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { SpeciesRichnessCard } from "@/components/analysis/SpeciesRichnessCard";
import { TotalInsectCountCard } from "@/components/analysis/TotalInsectCountCard";
import { DetectionsOverTime } from "@/components/charts/DetectionsOverTime";
import { TopTaxa } from "@/components/charts/TopTaxa";
import { GoogleMaps } from "@/components/map/GoogleMaps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { aggregateByTaxonomy, aggregateByTime, pickBucket } from "@/lib/aggregation";
import { useFilterContext } from "@/lib/filters/filterState";
import { useDeployment } from "@/lib/hooks/useDeployment";
import { useFilters } from "@/lib/hooks/useFilters";
import { useObservations } from "@/lib/hooks/useObservations";

export const Route = createFileRoute("/deployment/$deploymentId/_filterLayout/overview")({
  head: () => ({
    meta: [{ title: "Overview | Sensing Garden Dashboard" }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { deploymentId } = Route.useParams();
  const { data: deploymentData } = useDeployment({ deployment_id: deploymentId });
  const { filters } = useFilterContext();
  const { startDate, endDate, hub } = useFilters();

  const { data, isLoading } = useObservations({
    startTime: startDate,
    endTime: endDate,
    hubId: hub,
    limit: 500,
  });

  const items = data?.items;
  const bucket = pickBucket(filters.datePreset);

  const timeData = useMemo(
    () =>
      aggregateByTime(
        items ?? [],
        filters.startTime,
        filters.endTime,
        bucket,
        filters.minConfidence,
        filters.taxonomyLevel,
      ),
    [
      items,
      filters.startTime,
      filters.endTime,
      bucket,
      filters.minConfidence,
      filters.taxonomyLevel,
    ],
  );

  const taxaData = useMemo(
    () => aggregateByTaxonomy(items ?? [], filters.taxonomyLevel, filters.minConfidence),
    [items, filters.taxonomyLevel, filters.minConfidence],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-5">
        <TotalInsectCountCard />
        <SpeciesRichnessCard />
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
            <DetectionsOverTime data={timeData} isLoading={isLoading} />
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
            <TopTaxa data={taxaData} isLoading={isLoading} />
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
