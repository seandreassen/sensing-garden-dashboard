import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TaxonCount } from "@/lib/aggregation";
import type { TaxonomyLevel } from "@/lib/types/api";

interface TopTaxaProps {
  data: TaxonCount[];
  taxonomyLevel: TaxonomyLevel;
  isLoading?: boolean;
}

const BAR_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const LEVEL_LABELS: Record<TaxonomyLevel, string> = {
  family: "Top families",
  genus: "Top genera",
  species: "Top species",
};

function TopTaxa({ data, taxonomyLevel, isLoading }: TopTaxaProps) {
  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading chart...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <span className="text-sm text-muted-foreground">No taxonomy data for selected filters</span>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-muted-foreground">
        {LEVEL_LABELS[taxonomyLevel]}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "var(--color-foreground)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={120}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "6px",
              color: "var(--color-foreground)",
              fontSize: "13px",
            }}
          />
          <Bar dataKey="count" name="Detections" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((_, index) => (
              <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export { TopTaxa };
