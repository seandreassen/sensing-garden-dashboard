import { ResponsiveContainer, Tooltip, Treemap } from "recharts";

import { useFilters } from "@/lib/hooks/useFilters";
import { useTaxaCount } from "@/lib/hooks/useTaxaCount";

interface TaxaTreemapProps {
  deploymentId: string;
}

interface OtherTaxaItem {
  name: string;
  count: number;
}

interface TreemapDatum {
  [key: string]: string | number | OtherTaxaItem[] | undefined;
  name: string;
  size: number;
  count: number;
  items?: OtherTaxaItem[];
}

const TREEMAP_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];
const PRIMARY_TAXA_LIMIT = 8;
const OTHER_PREVIEW_LIMIT = 8;

function TaxaTreemap({ deploymentId }: TaxaTreemapProps) {
  const { startDate, endDate, hub, taxonomyLevel, selectedTaxa, minConfidence } = useFilters();
  const { data, isLoading } = useTaxaCount({
    start_time: startDate,
    end_time: endDate,
    device_id: hub ? [hub] : undefined,
    deployment_id: deploymentId,
    min_confidence: minConfidence,
    taxonomy_level: taxonomyLevel,
    selected_taxa: selectedTaxa,
    sort_desc: true,
  });

  if (isLoading) {
    return (
      <div className="flex h-75 items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading chart...</span>
      </div>
    );
  }

  if (!data || data.counts.length === 0) {
    return (
      <div className="flex h-75 items-center justify-center">
        <span className="text-sm text-muted-foreground">No taxonomy data for selected filters</span>
      </div>
    );
  }

  const primaryTaxa = data.counts.slice(0, PRIMARY_TAXA_LIMIT);
  const otherTaxa = data.counts.slice(PRIMARY_TAXA_LIMIT);

  const treemapData: TreemapDatum[] = primaryTaxa.map((item) => ({
    name: item.taxa,
    size: item.count,
    count: item.count,
  }));

  if (otherTaxa.length > 0) {
    treemapData.push({
      name: "Others",
      size: otherTaxa.reduce((sum, item) => sum + item.count, 0),
      count: otherTaxa.reduce((sum, item) => sum + item.count, 0),
      items: otherTaxa.map((item) => ({ name: item.taxa, count: item.count })),
    });
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <Treemap
        data={treemapData}
        dataKey="size"
        aspectRatio={4 / 3}
        stroke="rgba(255,255,255,0.08)"
        content={<TaxaTreemapCell />}
      >
        <Tooltip content={<TaxaTreemapTooltip />} />
      </Treemap>
    </ResponsiveContainer>
  );
}

function TaxaTreemapCell({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  index = 0,
  name,
  value,
}: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  name?: string;
  value?: number;
}) {
  if (width <= 0 || height <= 0) {
    return null;
  }

  const fill = TREEMAP_COLORS[index % TREEMAP_COLORS.length];
  const showLabel = width > 90 && height > 44;
  const safeName = name ?? "";

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={6}
        ry={6}
        fill={fill}
        fillOpacity={0.9}
        stroke="rgba(255,255,255,0.08)"
      />
      {showLabel && (
        <>
          <text x={x + 10} y={y + 18} fill="var(--color-background)" fontSize={12} fontWeight={600}>
            {safeName}
          </text>
          <text x={x + 10} y={y + 34} fill="rgba(11,15,12,0.7)" fontSize={11}>
            {value ?? 0} detections
          </text>
        </>
      )}
    </g>
  );
}

function TaxaTreemapTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: TreemapDatum }>;
}) {
  if (!active || !payload?.[0]?.payload) {
    return null;
  }

  const item = payload[0].payload;
  const otherItems = item.items ?? [];

  return (
    <div
      className="rounded-md border px-3 py-2 shadow-lg"
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: "var(--color-border)",
        color: "var(--color-foreground)",
      }}
    >
      <p className="text-sm font-semibold">{item.name}</p>
      <p className="text-xs text-muted-foreground">{item.count} detections</p>
      {item.name === "Others" && otherItems.length > 0 && (
        <div className="mt-2 border-t border-border pt-2">
          <p className="mb-1 text-xs font-medium text-muted-foreground">Includes</p>
          <div className="flex flex-col gap-1 text-xs">
            {otherItems.slice(0, OTHER_PREVIEW_LIMIT).map((otherItem) => (
              <div key={otherItem.name} className="flex items-center justify-between gap-4">
                <span className="truncate">{otherItem.name}</span>
                <span className="shrink-0 text-muted-foreground">{otherItem.count}</span>
              </div>
            ))}
            {otherItems.length > OTHER_PREVIEW_LIMIT && (
              <p className="pt-1 text-xs text-muted-foreground">
                +{otherItems.length - OTHER_PREVIEW_LIMIT} more taxa
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { TaxaTreemap };
