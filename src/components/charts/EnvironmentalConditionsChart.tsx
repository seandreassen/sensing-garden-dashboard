import { Thermometer, Droplet } from "lucide-react";
import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useEnvironmentData } from "@/lib/hooks/useEnvironmentData";
import { useFilters } from "@/lib/hooks/useFilters";

function EnvironmentalConditionsChart() {
  const { startDate, endDate, hub } = useFilters();
  const {
    data: rawData = [],
    isError,
    isLoading,
    error,
  } = useEnvironmentData({
    startTime: startDate,
    endTime: endDate,
    hubId: hub,
  });

  const [enabledMetrics, setEnabledMetrics] = useState({
    temperature: true,
    humidity: true,
  });

  const toggleMetric = (metric: keyof typeof enabledMetrics) => {
    setEnabledMetrics((prev) => ({ ...prev, [metric]: !prev[metric] }));
  };

  const environmentalData = useMemo(() => {
    const seen = new Set<string>();
    return rawData
      .filter((item) => {
        const dateKey = new Date(item.timestamp).toLocaleString();
        if (seen.has(dateKey)) {
          return false;
        }
        seen.add(dateKey);
        return true;
      })
      .map((item) => ({
        date: new Date(item.timestamp).toLocaleString(),
        temperature: item.ambient_temperature,
        humidity: item.ambient_humidity,
      }));
  }, [rawData]);

  if (isLoading) {
    return <div>Loading environmental data...</div>;
  }
  if (isError && error) {
    return <div>Error: {error.message}</div>;
  }

  const metrics = [
    {
      key: "temperature" as const,
      label: "Temperature",
      icon: Thermometer,
      color: "#ff6b6b",
      unit: "°C",
      enabled: enabledMetrics.temperature,
    },
    {
      key: "humidity" as const,
      label: "Humidity",
      icon: Droplet,
      color: "#4dabf7",
      unit: "%",
      enabled: enabledMetrics.humidity,
    },
  ];

  const activeMetrics = metrics.filter((m) => m.enabled);

  return (
    <div
      className="bg-surface-primary space-y-6 rounded border border-border p-6"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="mb-1 font-bold tracking-tight uppercase">Environmental Conditions</h4>
          <p className="text-[11px] text-muted-foreground">
            Temperature and humidity measurements over selected period
          </p>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Toggle Controls */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <button
              key={metric.key}
              onClick={() => toggleMetric(metric.key)}
              className={`flex items-center gap-2 rounded border px-3 py-2.5 transition-all ${
                metric.enabled
                  ? "border-green-200/30 bg-green-300/35 text-green-100"
                  : "bg-surface-secondary border-border text-muted-foreground hover:border-primary/20"
              } `}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              <span className="text-xs font-medium">{metric.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chart */}
      {activeMetrics.length > 0 ? (
        <div className="rounded border border-border p-4" style={{ backgroundColor: "#1a1a1a" }}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={environmentalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" strokeOpacity={0.3} />
              <XAxis
                dataKey="date"
                stroke="#e0e0e0"
                fontSize={12}
                tickLine={false}
                tick={{ fill: "#e0e0e0" }}
              />
              <YAxis
                yAxisId="left"
                stroke="#e0e0e0"
                fontSize={12}
                tickLine={false}
                tick={{ fill: "#e0e0e0" }}
                label={{
                  value: "Temperature (°C)",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 12, fill: "#e0e0e0" },
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#e0e0e0"
                fontSize={12}
                tickLine={false}
                tick={{ fill: "#e0e0e0" }}
                label={{
                  value: "Humidity (%)",
                  angle: -270,
                  position: "insideRight",
                  style: { fontSize: 12, fill: "#e0e0e0" },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f1f1f",
                  border: "1px solid #444",
                  borderRadius: "6px",
                  fontSize: "13px",
                }}
                labelStyle={{ color: "var(--text-primary)", marginBottom: "4px" }}
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
                  dot={{ fill: metric.color, r: 2 }}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-surface-secondary rounded border border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">Select at least one metric to display</p>
        </div>
      )}
    </div>
  );
}

export { EnvironmentalConditionsChart };
