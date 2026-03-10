import { Activity } from "lucide-react";
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

import { useEnvironmentData } from "@/lib/hooks/useEnvironmentData";

interface AirQualityIndicesChartProps {
  rawData: ReturnType<typeof useEnvironmentData>["data"];
}

function AirQualityIndicesChart({ rawData }: AirQualityIndicesChartProps) {
  const [enabledIndices, setEnabledIndices] = useState({
    voc: true,
    nox: true,
  });

  const toggleIndex = (index: keyof typeof enabledIndices) => {
    setEnabledIndices((prev) => ({ ...prev, [index]: !prev[index] }));
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
        voc: item.voc_index,
        nox: item.nox_index,
      }));
  }, [rawData]);

  const indices = [
    { key: "voc" as const, label: "VOC Index", color: "#51cf66", enabled: enabledIndices.voc },
    { key: "nox" as const, label: "NOx Index", color: "#4dabf7", enabled: enabledIndices.nox },
  ];

  const activeIndices = indices.filter((i) => i.enabled);

  return (
    <div
      className="space-y-6 rounded border border-border p-6"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="mb-1 font-bold tracking-tight text-white uppercase">
            Air Quality Indices
          </h4>
          <p className="text-[11px] text-gray-300">
            VOC and NOx index measurements over selected period
          </p>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Toggle Controls */}
      <div className="grid grid-cols-2 gap-3">
        {indices.map((index) => (
          <button
            key={index.key}
            onClick={() => toggleIndex(index.key)}
            className={`flex items-center gap-2 rounded border px-3 py-2.5 transition-all ${
              index.enabled
                ? "border-green-200/30 bg-green-300/35 text-green-100"
                : "bg-surface-secondary border-border text-muted-foreground hover:border-primary/20"
            } `}
          >
            <Activity className="h-4 w-4 text-gray-300" strokeWidth={1.5} />
            <span className="text-xs font-medium">{index.label}</span>
          </button>
        ))}
      </div>

      {/* Chart */}
      {activeIndices.length > 0 ? (
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
                stroke="#e0e0e0"
                fontSize={12}
                tickLine={false}
                tick={{ fill: "#e0e0e0" }}
                label={{
                  value: "Index",
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
                  color: "#e0e0e0",
                }}
                labelStyle={{ color: "#e0e0e0", marginBottom: "4px" }}
              />
              <Legend wrapperStyle={{ fontSize: "13px", color: "#e0e0e0" }} iconType="line" />
              {activeIndices.map((index) => (
                <Line
                  key={index.key}
                  type="monotone"
                  dataKey={index.key}
                  stroke={index.color}
                  strokeWidth={2}
                  name={index.label}
                  dot={{ fill: index.color, r: 2 }}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-surface-secondary rounded border border-border p-12 text-center">
          <p className="text-sm text-gray-300">Select at least one index to display</p>
        </div>
      )}
    </div>
  );
}

export { AirQualityIndicesChart };
