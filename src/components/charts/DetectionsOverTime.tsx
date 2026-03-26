import { addHours } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useFilters } from "@/lib/hooks/useFilters";
import { useObservationsTimeSeries } from "@/lib/hooks/useObservationsTimeSeries";

interface DetectionsOverTimeProps {
  deploymentId: string;
}

function formatXLabel(value: string): string {
  if (value.includes("T")) {
    const [, time] = value.split("T");
    return time ?? value;
  }
  const parts = value.split("-");
  if (parts.length === 3) {
    return `${parts[1]}/${parts[2]}`;
  }
  return value;
}

function DetectionsOverTime({ deploymentId }: DetectionsOverTimeProps) {
  const { startDate, endDate, hub, taxonomyLevel, selectedTaxa, minConfidence } = useFilters();
  const interval_unit = Math.max(
    Math.round(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60) / 100,
    ),
    1,
  );
  const { data, isLoading } = useObservationsTimeSeries({
    start_time: startDate,
    end_time: endDate,
    device_id: hub ? [hub] : undefined,
    deployment_id: deploymentId,
    min_confidence: minConfidence,
    taxonomy_level: selectedTaxa.length > 0 ? taxonomyLevel : undefined,
    selected_taxa: selectedTaxa,
    interval_length: interval_unit,
    interval_unit: "h",
  });

  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading chart...</span>
      </div>
    );
  }

  if (!data || data.counts.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <span className="text-sm text-muted-foreground">No data for selected filters</span>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data.counts.map((count, index) => ({
          count,
          time: addHours(data.start_time, index * interval_unit).toISOString(),
        }))}
        margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
      >
        <defs>
          <linearGradient id="detectionsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="time"
          tickFormatter={formatXLabel}
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "6px",
            color: "var(--color-foreground)",
            fontSize: "13px",
          }}
          labelFormatter={(label) => {
            const str = String(label);
            if (str.includes("T")) {
              return str.replace("T", " ");
            }
            return str;
          }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="var(--color-chart-2)"
          strokeWidth={2}
          fill="url(#detectionsFill)"
          name="Detections"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export { DetectionsOverTime };
