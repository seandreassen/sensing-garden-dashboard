import { useMemo } from "react";

import { DetectionsOverTime } from "@/components/charts/DetectionsOverTime";
import { aggregateByTime, pickBucket } from "@/lib/aggregation";
import { useFilterContext } from "@/lib/filters/filterState";
import { useObservations } from "@/lib/hooks/useObservations";

interface DefaultAnalysisViewProps {
  deviceId?: string;
}

const PRESET_LABELS: Record<string, string> = {
  all: "all time",
  "24h": "last 24 hours",
  "7d": "last 7 days",
  "30d": "last 30 days",
  "3m": "last 3 months",
};

function DefaultAnalysisView({ deviceId }: DefaultAnalysisViewProps) {
  const { filters } = useFilterContext();

  const { data: classifications, isLoading } = useObservations({
    hubId: deviceId,
    startTime: filters.startTime || undefined,
    endTime: filters.endTime || undefined,
  });

  const bucket = pickBucket(filters.datePreset);
  const chartData = useMemo(
    () => aggregateByTime(classifications?.items ?? [], filters.startTime, filters.endTime, bucket),
    [classifications?.items, filters.startTime, filters.endTime, bucket],
  );

  const totalCount = classifications?.items.length ?? 0;
  const label = PRESET_LABELS[filters.datePreset] ?? "selected period";

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Detections &mdash; {label}</h3>
        {!isLoading && <span className="text-2xl font-semibold tabular-nums">{totalCount}</span>}
      </div>
      <DetectionsOverTime data={chartData} isLoading={isLoading} />
    </div>
  );
}

export { DefaultAnalysisView };
