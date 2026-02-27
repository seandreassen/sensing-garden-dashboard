"use client";

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

interface AirQualityIndicesChartProps {
  filters: {
    dateRange: string;
    startDate?: string;
    endDate?: string;
  };
}

export function AirQualityIndicesChart({ filters }: AirQualityIndicesChartProps) {
  const [enabledIndices, setEnabledIndices] = useState({
    voc: true,
    nox: true,
  });

  const toggleIndex = (index: keyof typeof enabledIndices) => {
    setEnabledIndices((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Generate dummy data
  const environmentalData = useMemo(() => {
    const data = [];
    const now = new Date();
    const points = filters.dateRange === "Last 24 Hours" ? 24 : 7;

    for (let i = points - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr =
        filters.dateRange === "Last 24 Hours"
          ? d.getHours() + ":00"
          : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      data.push({
        date: dateStr,
        voc: Math.floor(Math.random() * 200),
        nox: Math.floor(Math.random() * 150),
      });
    }
    return data;
  }, [filters.dateRange]);

  const indices = [
    { key: "voc" as const, label: "VOC Index", color: "#51cf66", enabled: enabledIndices.voc },
    { key: "nox" as const, label: "NOx Index", color: "#4dabf7", enabled: enabledIndices.nox },
  ];

  const activeIndices = indices.filter((i) => i.enabled);

  return (
    <div className="bg-surface-primary space-y-6 rounded border border-border p-6">
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
                ? "border-primary/30 bg-primary/10 text-primary"
                : "bg-surface-secondary border-border text-gray-300 hover:border-primary/20"
            } `}
          >
            <Activity className="h-4 w-4 text-gray-300" strokeWidth={1.5} />
            <span className="text-xs font-medium">{index.label}</span>
          </button>
        ))}
      </div>

      {/* Chart */}
      {activeIndices.length > 0 ? (
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
                  value: "Index",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 10, fill: "#e0e0e0" },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f1f1f",
                  border: "1px solid #444",
                  borderRadius: "6px",
                  fontSize: "11px",
                  color: "#e0e0e0",
                }}
                labelStyle={{ color: "#e0e0e0", marginBottom: "4px" }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#e0e0e0" }} iconType="line" />
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
