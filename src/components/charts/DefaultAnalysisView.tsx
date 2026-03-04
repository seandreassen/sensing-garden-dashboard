import { useMemo } from "react";

import { DetectionsOverTime } from "@/components/charts/DetectionsOverTime";
import { aggregateByTime } from "@/lib/aggregation";
import { useClassifications } from "@/lib/hooks/useClassifications";

interface DefaultAnalysisViewProps {
  deviceId?: string;
}

function getDefaultDateRange() {
  const now = new Date();
  const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return {
    startTime: start.toISOString(),
    endTime: now.toISOString(),
  };
}

function DefaultAnalysisView({ deviceId }: DefaultAnalysisViewProps) {
  const { startTime, endTime } = useMemo(getDefaultDateRange, []);

  const { data: classifications, isLoading } = useClassifications({
    deviceId,
    startTime,
    endTime,
  });

  const chartData = useMemo(
    () => aggregateByTime(classifications ?? [], startTime, endTime, "day"),
    [classifications, startTime, endTime],
  );

  const totalCount = classifications?.length ?? 0;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Detections — last 7 days</h3>
        {!isLoading && <span className="text-2xl font-semibold tabular-nums">{totalCount}</span>}
      </div>
      <DetectionsOverTime data={chartData} isLoading={isLoading} />
    </div>
  );
}

export { DefaultAnalysisView };
