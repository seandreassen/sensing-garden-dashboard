import type { TimeSeriesDataKey, Metric } from "@/components/analytics/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ToggleMetricsRowProps<T extends TimeSeriesDataKey> {
  metrics: Metric<T>[];
  toggleMetric: (metric: T) => void;
}

function ToggleMetricsRow<T extends TimeSeriesDataKey>({
  metrics,
  toggleMetric,
}: ToggleMetricsRowProps<T>) {
  return (
    <div className="flex gap-3 *:flex-1 *:justify-start">
      {metrics.map((metric) => {
        return (
          <Button
            variant="none"
            key={metric.key}
            onClick={() => toggleMetric(metric.key)}
            className={cn(
              "border",
              metric.enabled
                ? "border-primary/30! bg-primary/15 text-primary"
                : "text-muted-foreground hover:border-primary/20",
            )}
          >
            <metric.Icon className="size-4" />
            {metric.label}
          </Button>
        );
      })}
    </div>
  );
}

export { ToggleMetricsRow };
