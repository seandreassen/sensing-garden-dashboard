import { Wind } from "lucide-react";
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

interface AirPollutionChartProps {
  filters: {
    dateRange: string;
    startDate?: string;
    endDate?: string;
  };
}

export function AirPollutionChart({ filters }: AirPollutionChartProps) {
  const [enabledPollutants, setEnabledPollutants] = useState({
    pm1: true,
    pm25: true,
    pm4: false,
    pm10: false,
  });

  const togglePollutant = (pollutant: keyof typeof enabledPollutants) => {
    setEnabledPollutants((prev) => ({ ...prev, [pollutant]: !prev[pollutant] }));
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
      const isRushHour = (hourOfDay >= 7 && hourOfDay <= 9) || (hourOfDay >= 17 && hourOfDay <= 19);
      const rushMultiplier = isRushHour ? 1.5 : 1.0;

      const pm1 = parseFloat((12 + rng(i + 200) * 20 * rushMultiplier).toFixed(1));
      const pm25 = parseFloat((25 + rng(i + 300) * 40 * rushMultiplier).toFixed(1));
      const pm4 = parseFloat((35 + rng(i + 400) * 60 * rushMultiplier).toFixed(1));
      const pm10 = parseFloat((50 + rng(i + 500) * 80 * rushMultiplier).toFixed(1));

      data.push({ date: dateStr, pm1, pm25, pm4, pm10 });
    }

    return data;
  }, [filters.dateRange, filters.startDate, filters.endDate]);

  const pollutants = [
    { key: "pm1" as const, label: "PM1.0", color: "#b4faff", enabled: enabledPollutants.pm1 },
    { key: "pm25" as const, label: "PM2.5", color: "#7ac7ff", enabled: enabledPollutants.pm25 },
    { key: "pm4" as const, label: "PM4.0", color: "#4f8af6", enabled: enabledPollutants.pm4 },
    { key: "pm10" as const, label: "PM10", color: "#2e3de0", enabled: enabledPollutants.pm10 },
  ];

  const activePollutants = pollutants.filter((p) => p.enabled);

  return (
    <div className="bg-surface-primary space-y-6 rounded border border-border p-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="mb-1 font-bold tracking-tight uppercase">Air Pollution</h4>
          <p className="text-[11px] text-muted-foreground">
            Particulate matter concentrations (μg/m³) over selected period
          </p>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Toggle Controls */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {pollutants.map((pollutant) => (
          <button
            key={pollutant.key}
            onClick={() => togglePollutant(pollutant.key)}
            className={`flex items-center gap-2 rounded border px-3 py-2.5 transition-all ${
              pollutant.enabled
                ? "border-primary/30 bg-primary/10 text-primary"
                : "bg-surface-secondary border-border text-muted-foreground hover:border-primary/20"
            } `}
          >
            <Wind className="h-4 w-4" strokeWidth={1.5} />
            <span className="text-xs font-medium">{pollutant.label}</span>
          </button>
        ))}
      </div>

      {/* Chart */}
      {activePollutants.length > 0 ? (
        <div className="rounded border border-border bg-gray-800 p-4">
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
                stroke="#e0e0e0"
                fontSize={10}
                tickLine={false}
                tick={{ fill: "#e0e0e0" }}
                label={{
                  value: "μg/m³",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 10, fill: "#e0e0e0" },
                }}
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
              {activePollutants.map((pollutant) => (
                <Line
                  key={pollutant.key}
                  type="monotone"
                  dataKey={pollutant.key}
                  stroke={pollutant.color}
                  strokeWidth={2}
                  name={`${pollutant.label} (μg/m³)`}
                  dot={{ fill: pollutant.color, r: 2 }}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-surface-secondary rounded border border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">Select at least one pollutant to display</p>
        </div>
      )}
    </div>
  );
}
