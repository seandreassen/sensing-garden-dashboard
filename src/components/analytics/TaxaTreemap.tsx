import { ResponsiveContainer, Tooltip, Treemap } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { useFilters } from "@/lib/hooks/useFilters";
import { useTaxaCount } from "@/lib/hooks/useTaxaCount";

interface TaxaTreemapProps {
  deploymentId: string;
}

interface OtherTaxaItem {
  name: string;
  count: number;
}

interface TreemapItem {
  [key: string]: string | number | OtherTaxaItem[] | undefined;
  name: string;
  size: number;
  count: number;
  items?: OtherTaxaItem[];
}

const TREEMAP_COLORS = ["#8adf9f", "#62cd7b", "#3db85f", "#238f47", "#1b6c37"];
const PRIMARY_TAXA_LIMIT = 8;
const OTHER_PREVIEW_LIMIT = 8;
const MIN_LABEL_WIDTH = 40;
const MIN_LABEL_HEIGHT = 30;
const MIN_COUNT_WIDTH = 72;
const MIN_COUNT_HEIGHT = 44;
const CELL_PADDING_X = 10;
const PRIMARY_FONT_SIZE = 12;
const SECONDARY_FONT_SIZE = 10;

function getTreemapSize(count: number): number {
  return Math.log1p(count);
}

function getLabelFontSize(width: number, height: number): number {
  if (width >= 96 && height >= 52) {
    return PRIMARY_FONT_SIZE;
  }
  return SECONDARY_FONT_SIZE;
}

function truncateLabel(text: string, width: number, fontSize: number): string {
  const availableWidth = width - CELL_PADDING_X * 2;
  if (availableWidth <= 0) {
    return "";
  }

  const averageCharWidth = fontSize * 0.58;
  const maxChars = Math.floor(availableWidth / averageCharWidth);

  if (maxChars <= 1) {
    return "";
  }

  if (text.length <= maxChars) {
    return text;
  }

  if (maxChars <= 2) {
    return `${text.slice(0, 1)}\u2026`;
  }

  return `${text.slice(0, maxChars - 1)}\u2026`;
}

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

  let content: React.ReactNode;

  if (isLoading) {
    content = (
      <div className="flex h-75 items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading chart...</span>
      </div>
    );
  } else if (!data || data.counts.length === 0) {
    content = (
      <div className="flex h-75 items-center justify-center">
        <span className="text-sm text-muted-foreground">No taxonomy data for selected filters</span>
      </div>
    );
  } else {
    const primaryTaxa = data.counts.slice(0, PRIMARY_TAXA_LIMIT);
    const otherTaxa = data.counts.slice(PRIMARY_TAXA_LIMIT);

    const treemapData: TreemapItem[] = primaryTaxa.map((item) => ({
      name: item.taxa,
      size: getTreemapSize(item.count),
      count: item.count,
    }));

    if (otherTaxa.length > 0) {
      const otherCount = otherTaxa.reduce((sum, item) => sum + item.count, 0);
      treemapData.push({
        name: "Others",
        size: getTreemapSize(otherCount),
        count: otherCount,
        items: otherTaxa.map((item) => ({ name: item.taxa, count: item.count })),
      });
    }

    content = (
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

  return (
    <Card className="w-full self-start p-4 lg:w-1/2">
      <CardHeader>
        <CardTitle className="text-lg capitalize">Taxa treemap</CardTitle>
        <CardDescription>Detection count by selected taxonomy level</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>{content}</CardContent>
    </Card>
  );
}

function TaxaTreemapCell({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  index = 0,
  name,
  count,
  payload,
}: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  name?: string;
  count?: number;
  payload?: TreemapItem;
}) {
  if (width <= 0 || height <= 0) {
    return null;
  }

  const fill = TREEMAP_COLORS[index % TREEMAP_COLORS.length];
  const safeName =
    typeof name === "string" ? name : typeof payload?.name === "string" ? payload.name : "";
  const detectionCount = count ?? payload?.count ?? 0;
  const showName = width >= MIN_LABEL_WIDTH && height >= MIN_LABEL_HEIGHT;
  const showCount = width >= MIN_COUNT_WIDTH && height >= MIN_COUNT_HEIGHT;
  const fontSize = getLabelFontSize(width, height);
  const label = showName ? truncateLabel(safeName, width, fontSize) : "";

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        fillOpacity={0.9}
        stroke="rgba(255,255,255,0.08)"
      />
      {label && (
        <text
          x={x + CELL_PADDING_X}
          y={y + 18}
          fill="var(--color-background)"
          fontSize={fontSize}
          fontWeight={600}
        >
          {label}
        </text>
      )}
      {showCount && (
        <text
          x={x + CELL_PADDING_X}
          y={y + (label ? 34 : 20)}
          fill="rgba(11,15,12,0.7)"
          fontSize={10}
        >
          {detectionCount} detections
        </text>
      )}
    </g>
  );
}

function TaxaTreemapTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: TreemapItem }>;
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
