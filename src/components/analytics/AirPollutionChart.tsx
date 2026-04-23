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

interface AirPollutionChartProps<T extends TimeSeriesDataKey> {
  timeSeries: TimeSeries;
  metrics: Metric<T>[];
}

function AirPollutionChart<T extends TimeSeriesDataKey>({
  timeSeries,
  metrics,
}: AirPollutionChartProps<T>) {
  const { data, isError, isLoading, error } = timeSeries;
  const activeMetrics = metrics.filter((metric) => metric.enabled);

  if (isLoading) {
    return (
      <div className="flex h-75 items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading air quality data...</span>
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
    data.pm1p0.length,
  );
  const formatTick = (value: number) =>
    tickFormat ? format(new Date(value), tickFormat) : new Date(value).toLocaleString();

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart
        data={data.pm1p0.map((pm1p0, i) => {
          return {
            time: addInterval(data.start_time, i * data.interval_length).getTime(),
            pm1p0,
            pm2p5: data.pm2p5[i],
            pm4p0: data.pm4p0[i],
            pm10: data.pm10[i],
          };
        })}
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
          domain={[0, "auto"]}
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          label={{
            value: "μg/m³",
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
            name={`${metric.label} (${metric.unit})`}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export { AirPollutionChart };
