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

import type { TimeSeries, Metric } from "@/components/analytics/types";
import { getTickFormat } from "@/lib/utils/timeSeries";

interface EnvironmentalConditionsChartProps {
  timeSeries: TimeSeries;
  metrics: Metric[];
}

function EnvironmentalConditionsChart({ timeSeries, metrics }: EnvironmentalConditionsChartProps) {
  const { data, isError, isLoading, error } = timeSeries;
  const activeMetrics = metrics.filter((metric) => metric.enabled);

  if (isLoading) {
    return (
      <div className="flex h-75 items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading environmental data...</span>
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
        <span className="text-sm text-muted-foreground">No metrics selected</span>
      </div>
    );
  }

  const addInterval = data.interval_unit === "h" ? addHours : addDays;
  const tickFormat = getTickFormat(
    data.start_time,
    data.interval_unit,
    data.interval_length,
    data.temperature.length,
  );
  const formatTick = (value: number) =>
    tickFormat ? format(new Date(value), tickFormat) : new Date(value).toLocaleString();

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart
        data={data.temperature.map((temperature, i) => ({
          time: addInterval(data.start_time, i * data.interval_length).getTime(),
          temperature,
          humidity: data.humidity[i],
        }))}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
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
          yAxisId="left"
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          label={{
            value: "Temperature (°C)",
            angle: -90,
            position: "insideLeft",
            style: { fontSize: 12, fill: "var(--color-muted-foreground)" },
          }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 100]}
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          label={{
            value: "Humidity (%)",
            angle: 90,
            position: "insideRight",
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
            yAxisId={metric.key === "temperature" ? "left" : "right"}
            type="monotone"
            dataKey={metric.key}
            stroke={metric.color}
            strokeWidth={2}
            name={`${metric.label} (${metric.unit})`}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export { EnvironmentalConditionsChart };
