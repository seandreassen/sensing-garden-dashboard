import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { SpeciesRichnessCard } from "@/components/analysis/SpeciesRichnessCard";
import { TotalInsectCountCard } from "@/components/analysis/TotalInsectCountCard";
import { DetectionsOverTime } from "@/components/charts/DetectionsOverTime";
import { TopTaxa } from "@/components/charts/TopTaxa";
import { GoogleMaps } from "@/components/map/GoogleMaps";
import { aggregateByTaxonomy, aggregateByTime, pickBucket } from "@/lib/aggregation";
import { useFilterContext } from "@/lib/filters/filterState";
import { useDeploymentCoordinates, useDeploymentCenter } from "@/lib/hooks/useDeployments";
import { useFilters } from "@/lib/hooks/useFilters";
import { useObservations } from "@/lib/hooks/useObservations";

export const Route = createFileRoute("/deployment/$deploymentId/_filterLayout/overview")({
  component: RouteComponent,
});

function RouteComponent() {
  const { deploymentId } = Route.useParams();
  const coordinates = useDeploymentCoordinates(deploymentId);
  const center = useDeploymentCenter(deploymentId);
  const { filters } = useFilterContext();
  const { startDate, endDate, hub } = useFilters();

  const { data, isLoading } = useObservations({
    deviceFilter: hub,
    startTime: startDate,
    endTime: endDate,
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">Detections over time</h3>
          <DetectionsOverTime data={timeData} isLoading={isLoading} />
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <TopTaxa data={taxaData} taxonomyLevel={filters.taxonomyLevel} isLoading={isLoading} />
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <GoogleMaps key={deploymentId} initialLocations={coordinates} center={center} />
        </div>
      </div>
    </div>
  );
}
