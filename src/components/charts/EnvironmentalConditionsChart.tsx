import { Thermometer, Droplet } from "lucide-react";
import { useState, useMemo } from "react";
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

interface EnvironmentalConditionsChartProps {
  filters: {
    dateRange: string;
    startDate?: string;
    endDate?: string;
  };
}

export function EnvironmentalConditionsChart({ filters }: EnvironmentalConditionsChartProps) {
  const [enabledMetrics, setEnabledMetrics] = useState({
    temperature: true,
    humidity: true,
  });

  const toggleMetric = (metric: keyof typeof enabledMetrics) => {
    setEnabledMetrics((prev) => ({ ...prev, [metric]: !prev[metric] }));
  };

  // Generate data based on date range
  const environmentalData = useMemo(() => {
    const data = [];
    const now = new Date();
    const points = filters.dateRange === "Last 24 Hours" ? 24 : 7;
    const interval = filters.dateRange === "Last 24 Hours" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

    const seed = (filters.dateRange + (filters.startDate || "") + (filters.endDate || "")).length;
    const rng = (offset: number) => {
      const x = Math.sin(seed + offset) * 10000;
      return x - Math.floor(x);
    };

    for (let i = points - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * interval);
      const dateStr =
        filters.dateRange === "Last 24 Hours"
          ? d.getHours() + ":00"
          : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      const hourOfDay = d.getHours();
      const dayOfYear = Math.floor(
        (d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / (24 * 60 * 60 * 1000),
      );

      const month = d.getMonth();
      const isWinter = month === 11 || month === 0 || month === 1;
      const isSummer = month === 5 || month === 6 || month === 7;

      const tempBase = isWinter ? -2 : isSummer ? 25 : 15;
      const seasonalVariation = Math.sin((dayOfYear / 365) * Math.PI * 2) * 10;
      const tempDailyVariation = Math.sin((hourOfDay / 24) * Math.PI * 2 - Math.PI / 2) * 6;
      const temperature = parseFloat(
        (tempBase + seasonalVariation + tempDailyVariation + (rng(i) - 0.5) * 5).toFixed(1),
      );

      const humidityBase = 60 - temperature * 0.8;
      const humidity = parseFloat(
        Math.max(30, Math.min(90, humidityBase + (rng(i + 100) - 0.5) * 15)).toFixed(1),
      );

      data.push({ date: dateStr, temperature, humidity });
    }

    return data;
  }, [filters.dateRange, filters.startDate, filters.endDate]);

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
                fontSize={10}
                tickLine={false}
                tick={{ fill: "#e0e0e0" }}
              />
              <YAxis
                yAxisId="left"
                stroke="#e0e0e0"
                fontSize={10}
                tickLine={false}
                tick={{ fill: "#e0e0e0" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#e0e0e0"
                fontSize={10}
                tickLine={false}
                tick={{ fill: "#e0e0e0" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--surface-primary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "6px",
                  fontSize: "11px",
                }}
                labelStyle={{ color: "var(--text-primary)", marginBottom: "4px" }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} iconType="line" />
              {activeMetrics.map((metric, index) => (
                <Line
                  key={metric.key}
                  yAxisId={index === 0 ? "left" : "right"}
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
