import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeftIcon } from "lucide-react";
import { useMemo } from "react";

import { AnalyticsData } from "@/components/analytics/AnalyticsData";
import { DetectionsOverTime } from "@/components/charts/DetectionsOverTime";
import { TopTaxa } from "@/components/charts/TopTaxa";
import { FilterHeader } from "@/components/filters/FilterHeader";
import { Button } from "@/components/ui/Button";
import { aggregateByTaxonomy, aggregateByTime, pickBucket } from "@/lib/aggregation";
import { FilterProvider } from "@/lib/filters/FilterContext";
import { useFilterContext } from "@/lib/filters/filterState";
import { useObservations } from "@/lib/hooks/useObservations";

export const Route = createFileRoute("/deployment/$deploymentId")({
  component: DeploymentPage,
});

function DeploymentPage() {
  const { deploymentId } = Route.useParams();

  return (
    <FilterProvider>
      <DeploymentContent deploymentId={deploymentId} />
    </FilterProvider>
  );
}

function DeploymentContent({ deploymentId }: { deploymentId: string }) {
  const navigate = useNavigate();
  const { filters } = useFilterContext();

  const renderTabContent = () => {
    switch (filters.activeTab) {
      case "overview":
        return <OverviewTab deviceId={filters.deviceId} />;
      case "analytics":
        return <AnalyticsData />;
      case "observations":
        return <div>Observations content goes here</div>;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <main className="flex min-h-screen flex-col pt-14">
      {/* Deployment header */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-3">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground"
          onClick={() => navigate({ to: "/" })}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Deployments
        </Button>
        <div className="h-4 w-px bg-border" />
        <h1 className="text-sm font-semibold">{deploymentId}</h1>
      </div>

      {/* Filter header */}
      <FilterHeader deploymentId={deploymentId} />

      {/* Tab content */}
      <div className="px-6 py-6">{renderTabContent()}</div>
    </main>
  );
}

function OverviewTab({ deviceId }: { deviceId?: string }) {
  const { filters } = useFilterContext();

  const { data, isLoading } = useObservations({
    deviceFilter: deviceId,
    startTime: filters.startTime,
    endTime: filters.endTime,
    limit: 500,
  });

  const items = data?.items;
  const bucket = pickBucket(filters.datePreset);

  const timeData = useMemo(
    () => aggregateByTime(items ?? [], filters.startTime, filters.endTime, bucket),
    [items, filters.startTime, filters.endTime, bucket],
  );

  const taxaData = useMemo(
    () => aggregateByTaxonomy(items ?? [], filters.taxonomyLevel),
    [items, filters.taxonomyLevel],
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Detections over time</h3>
        <DetectionsOverTime data={timeData} isLoading={isLoading} />
      </div>
      <div className="rounded-lg border border-border bg-card p-4">
        <TopTaxa data={taxaData} taxonomyLevel={filters.taxonomyLevel} isLoading={isLoading} />
      </div>
    </div>
  );
}
