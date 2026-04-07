import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { ActivityHeatmap } from "@/components/charts/ActivityHeatmap";
import { AirPollutionChart } from "@/components/charts/AirPollutionChart";
import { AirQualityIndicesChart } from "@/components/charts/AirQualityIndicesChart";
import { EnvironmentalConditionsChart } from "@/components/charts/EnvironmentalConditionsChart";
import { aggregateHeatmap } from "@/lib/heatmapAggregation";
import { useEnvironment } from "@/lib/hooks/useEnvironment";
import { useFilters } from "@/lib/hooks/useFilters";
import { useObservations } from "@/lib/hooks/useObservations";

export const Route = createFileRoute("/deployment/$deploymentId/_filterLayout/analytics")({
  head: () => ({
    meta: [{ title: "Analytics | Sensing Garden Dashboard" }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { deploymentId } = Route.useParams();
  const { startDate, endDate, hub, minConfidence, taxonomyLevel, selectedTaxa, rangePreset } =
    useFilters();

  const {
    data: envResult,
    isLoading: envLoading,
    isError,
    error,
  } = useEnvironment({
    start_time: startDate,
    end_time: endDate,
    device_id: hub ? [hub] : undefined,
    deployment_id: deploymentId,
  });

  const { data: obsResult, isLoading: obsLoading } = useObservations({
    start_time: startDate,
    end_time: endDate,
    device_id: hub ? [hub] : undefined,
    deployment_id: deploymentId,
    min_confidence: minConfidence,
    taxonomy_level: taxonomyLevel,
    selected_taxa: selectedTaxa,
  });

  const envItems = useMemo(() => {
    const startMs = new Date(startDate).getTime();
    const endMs = new Date(endDate).getTime();

    return (envResult?.items ?? []).filter((item) => {
      const timestampMs = new Date(item.timestamp).getTime();
      const matchesHub = !hub || item.device_id === hub;
      return matchesHub && timestampMs >= startMs && timestampMs <= endMs;
    });
  }, [envResult, hub, startDate, endDate]);
  const obsItems = useMemo(() => obsResult?.items ?? [], [obsResult?.items]);

  const heatmapGrid = useMemo(
    () =>
      aggregateHeatmap(
        obsItems,
        envItems,
        startDate,
        endDate,
        rangePreset,
        minConfidence,
        taxonomyLevel,
      ),
    [obsItems, envItems, startDate, endDate, minConfidence, taxonomyLevel, rangePreset],
  );
  if (envLoading && obsLoading) {
    return <div>Loading data...</div>;
  }
  if (isError && error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <ActivityHeatmap
        grid={heatmapGrid}
        taxonomyLabel={taxonomyLevel}
        isLoading={obsLoading || envLoading}
      />

      <div className="flex flex-col border border-border">
        <h2 className="p-4 text-xl font-semibold">Environmental Data</h2>

        <div className="rounded p-4">
          <EnvironmentalConditionsChart deploymentId={deploymentId} />
        </div>

        <div className="rounded p-4">
          <AirPollutionChart deploymentId={deploymentId} />
        </div>

        <div className="rounded p-4">
          <AirQualityIndicesChart deploymentId={deploymentId} />
        </div>
      </div>
    </div>
  );
}
