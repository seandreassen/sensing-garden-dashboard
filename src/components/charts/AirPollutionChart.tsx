import { addHours } from "date-fns";
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

import { useEnvironmentTimeSeries } from "@/lib/hooks/useEnvironmentTimeSeries";
import { useFilters } from "@/lib/hooks/useFilters";

interface AirPollutionChartProps {
  deploymentId: string;
}

function AirPollutionChart({ deploymentId }: AirPollutionChartProps) {
  const { startDate, endDate, hub } = useFilters();
  const intervalLength = Math.max(
    Math.round(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60) / 100,
    ),
    1,
  );
  const { data, isError, isLoading, error } = useEnvironmentTimeSeries({
    start_time: startDate,
    end_time: endDate,
    device_id: hub ? [hub] : undefined,
    deployment_id: deploymentId,
    interval_length: intervalLength,
    interval_unit: "h",
  });

  const [enabledPollutants, setEnabledPollutants] = useState({
    pm1p0: true,
    pm2p5: true,
    pm4p0: false,
    pm10: false,
  });

  const togglePollutant = (pollutant: keyof typeof enabledPollutants) => {
    setEnabledPollutants((prev) => ({ ...prev, [pollutant]: !prev[pollutant] }));
  };

  const environmentData = useMemo(() => {
    if (!data) {
      return [];
    }

    return data?.pm1p0.map((pm1p0, i) => {
      return {
        date: addHours(data.start_time, i * data.interval_length).toLocaleString(),
        pm1p0,
        pm2p5: data.pm2p5[i],
        pm4p0: data.pm4p0[i],
        pm10: data.pm10[i],
      };
    });
  }, [data]);

  if (isLoading) {
    return <div>Loading environmental data...</div>;
  }
  if (isError && error) {
    return <div>Error: {error.message}</div>;
  }

  const pollutants = [
    { key: "pm1p0" as const, label: "PM1.0", color: "#8becff", enabled: enabledPollutants.pm1p0 },
    { key: "pm2p5" as const, label: "PM2.5", color: "#44c1ff", enabled: enabledPollutants.pm2p5 },
    { key: "pm4p0" as const, label: "PM4.0", color: "#226fff", enabled: enabledPollutants.pm4p0 },
    { key: "pm10" as const, label: "PM10", color: "#000ea3", enabled: enabledPollutants.pm10 },
  ];

  const activePollutants = pollutants.filter((p) => p.enabled);

  return (
    <div
      className="space-y-6 rounded border border-border p-6"
      style={{ backgroundColor: "#1a1a1a" }}
    >
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
                ? "border-green-200/30 bg-green-300/35 text-green-100"
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
        <div className="rounded border border-border p-4" style={{ backgroundColor: "#1a1a1a" }}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={environmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" strokeOpacity={0.3} />
              <XAxis
                dataKey="date"
                stroke="#e0e0e0"
                fontSize={12}
                tickLine={false}
                tick={{ fill: "#e0e0e0" }}
              />
              <YAxis
                stroke="#e0e0e0"
                fontSize={12}
                tickLine={false}
                tick={{ fill: "#e0e0e0" }}
                label={{
                  value: "μg/m³",
                  angle: -90,
                  position: "insideLeft",
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
                labelStyle={{ color: "#e0e0e0", marginBottom: "4px" }}
              />
              <Legend wrapperStyle={{ fontSize: "13px" }} iconType="line" />
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

export { AirPollutionChart };
