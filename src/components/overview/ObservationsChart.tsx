import { addDays, addHours, format } from "date-fns";
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
import { getInterval, getTickFormat } from "@/lib/utils/timeSeries";

interface ObservationsChartProps {
  deploymentId: string;
}

function ObservationsChart({ deploymentId }: ObservationsChartProps) {
  const { startDate, endDate, hub, taxonomyLevel, selectedTaxa, minConfidence } = useFilters();
  const { intervalLength, intervalUnit } = getInterval(new Date(startDate), new Date(endDate));
  const { data, isLoading } = useObservationsTimeSeries({
    start_time: startDate,
    end_time: endDate,
    device_id: hub ? [hub] : undefined,
    deployment_id: deploymentId,
    min_confidence: minConfidence,
    taxonomy_level: taxonomyLevel,
    selected_taxa: selectedTaxa,
    interval_length: intervalLength,
    interval_unit: intervalUnit,
  });

  if (isLoading) {
    return (
      <div className="flex h-75 items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading chart...</span>
      </div>
    );
  }

  if (!data || data.counts.length === 0) {
    return (
      <div className="flex h-75 items-center justify-center">
        <span className="text-sm text-muted-foreground">No data for selected filters</span>
      </div>
    );
  }

  const addInterval = data.interval_unit === "h" ? addHours : addDays;
  const tickFormat = getTickFormat(
    data.start_time,
    data.interval_unit,
    data.interval_length,
    data.counts.length,
  );
  const formatTick = (value: number) =>
    tickFormat ? format(new Date(value), tickFormat) : new Date(value).toLocaleString();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data.counts.map((count, index) => ({
          count,
          time: addInterval(data.start_time, index * data.interval_length).getTime(),
        }))}
      >
        <defs>
          <linearGradient id="detectionsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="time"
          type="number"
          domain={["dataMin", "dataMax"]}
          scale="time"
          minTickGap={30}
          tickFormatter={formatTick}
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
        />
        <YAxis
          width={40}
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
          labelFormatter={(label) => new Date(label).toLocaleString()}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="var(--color-primary)"
          strokeWidth={2}
          fill="url(#detectionsFill)"
          name="Detections"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export { ObservationsChart };
