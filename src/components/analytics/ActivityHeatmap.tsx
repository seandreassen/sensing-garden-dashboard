import { addHours } from "date-fns";

import { buttonVariants } from "@/components/ui/button-variants";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";
import { useFilters } from "@/lib/hooks/useFilters";
import { useObservationsTimeSeries } from "@/lib/hooks/useObservationsTimeSeries";
import { cn } from "@/lib/utils";
import { getCellColor, getRowBuckets } from "@/lib/utils/heatmap";

interface ActivityHeatmapChartProps {
  deploymentId: string;
}

function ActivityHeatmap({ deploymentId }: ActivityHeatmapChartProps) {
  const { startDate, endDate, hub, taxonomyLevel, selectedTaxa, minConfidence } = useFilters();
  const { data, isError, isLoading, error } = useObservationsTimeSeries({
    start_time: startDate,
    end_time: endDate,
    device_id: hub ? [hub] : undefined,
    deployment_id: deploymentId,
    min_confidence: minConfidence,
    taxonomy_level: taxonomyLevel,
    selected_taxa: selectedTaxa,
    interval_length: 1,
    interval_unit: "h",
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading heatmap...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="text-sm text-muted-foreground">Error: {error.message}</span>
      </div>
    );
  }

  if (!data || data.counts.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="text-sm text-muted-foreground">No data for selected filters</span>
      </div>
    );
  }

  // ----- Very unreadable aggregation logic here -----
  // (AI-made because I don't want to waste time making temporary code readable)
  // Don't worry too much about it, seems to work fine
  // TODO: Request and use a new endpoint that handles this aggregation
  const buckets = getRowBuckets(new Date(startDate), new Date(endDate));
  const hours = Array.from({ length: 18 }, (_, i) => i + 5);
  const bucketHourMap = new Map<number, Map<number, number>>();
  let maxCount = 0;
  for (let i = 0; i < data.counts.length; i++) {
    const time = addHours(data.start_time, i);
    const hr = time.getHours();
    const bIdx = buckets.findLastIndex((b) => time >= b.heatmapStart);
    if (hours.includes(hr) && bIdx !== -1) {
      const hrMap = bucketHourMap.get(bIdx) ?? bucketHourMap.set(bIdx, new Map()).get(bIdx);
      const val = (hrMap?.get(hr) ?? 0) + data.counts[i];
      hrMap?.set(hr, val);
      if (val > maxCount) {
        maxCount = val;
      }
    }
  }
  const cells = buckets.map((b, i) =>
    hours.map((hr) => ({
      rowLabel: b.label,
      hour: hr,
      count: bucketHourMap.get(i)?.get(hr) ?? 0,
    })),
  );
  // ----- End of unreadable aggregation logic -----

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2">
        <div className="flex gap-1 pl-11">
          {hours.map((hour) => (
            <div key={hour} className="flex-1 text-center text-xs text-muted-foreground">
              {String(hour).padStart(2, "0")}
            </div>
          ))}
        </div>
        {cells.map((row, rowIdx) => (
          <div key={rowIdx} className="flex items-center gap-1">
            <div className="w-10 shrink-0 pr-2 text-right text-xs text-muted-foreground">
              {buckets[rowIdx].label}
            </div>
            {row.map((cell) => (
              <Tooltip key={cell.hour}>
                <TooltipTrigger
                  className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
                  style={{ backgroundColor: getCellColor(cell.count, maxCount) }}
                  aria-label={`${cell.rowLabel} ${String(cell.hour).padStart(2, "0")}:00 — ${cell.count} detections`}
                />
                <TooltipContent>
                  <p>
                    {cell.rowLabel}, {String(cell.hour).padStart(2, "0")}:00
                  </p>
                  <p className="text-muted-foreground">{cell.count} detections</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}

export { ActivityHeatmap };
