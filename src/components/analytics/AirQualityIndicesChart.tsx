import { addDays, addHours, format } from "date-fns";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TimeSeries, Metric, TimeSeriesDataKey } from "@/components/analytics/types";
import { getTickFormat } from "@/lib/utils/timeSeries";

interface AirQualityIndicesChartProps<T extends TimeSeriesDataKey> {
  timeSeries: TimeSeries;
  metrics: Metric<T>[];
}

function AirQualityIndicesChart<T extends TimeSeriesDataKey>({
  timeSeries,
  metrics,
}: AirQualityIndicesChartProps<T>) {
  const { data, isError, isLoading, error } = timeSeries;
  const activeMetrics = metrics.filter((metric) => metric.enabled);

  if (isLoading) {
    return (
      <div className="flex h-75 items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading indices...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-75 items-center justify-center">
        <span className="text-sm text-muted-foreground">Error: {error.message}</span>
      </div>
    );
  }

  if (!data || metrics.every((metric) => data[metric.key].length === 0)) {
    return (
      <div className="flex h-75 items-center justify-center">
        <span className="text-sm text-muted-foreground">No data for selected filters</span>
      </div>
    );
  }

  if (activeMetrics.length === 0) {
    return (
      <div className="flex h-75 items-center justify-center">
        <span className="text-sm text-muted-foreground">No indices selected</span>
      </div>
    );
  }

  const addInterval = data.interval_unit === "h" ? addHours : addDays;
  const tickFormat = getTickFormat(
    data.start_time,
    data.interval_unit,
    data.interval_length,
    data.voc.length,
  );
  const formatTick = (value: number) =>
    tickFormat ? format(new Date(value), tickFormat) : new Date(value).toLocaleString();

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart
        data={data.voc.map((voc, i) => ({
          time: addInterval(data.start_time, i * data.interval_length).getTime(),
          voc,
          nox: data.nox[i],
        }))}
      >
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
          domain={[0, "auto"]}
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          label={{
            value: "Index Value",
            angle: -90,
            position: "insideLeft",
            style: { fontSize: 12, fill: "var(--color-muted-foreground)" },
          }}
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
        <Legend wrapperStyle={{ fontSize: "13px" }} iconType="line" />
        {activeMetrics.map((metric) => (
          <Line
            key={metric.key}
            type="monotone"
            dataKey={metric.key}
            stroke={metric.color}
            strokeWidth={2}
            name={metric.label}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export { AirQualityIndicesChart };
