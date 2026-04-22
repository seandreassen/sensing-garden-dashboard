interface TaxaTreemapCellPayload {
  name?: string;
  count?: number;
}

const TREEMAP_COLORS = ["#8adf9f", "#62cd7b", "#3db85f", "#238f47", "#1b6c37"];
const OTHER_TREEMAP_COLOR = "#5aa06f";
const MIN_LABEL_WIDTH = 40;
const MIN_LABEL_HEIGHT = 30;
const MIN_COUNT_WIDTH = 72;
const MIN_COUNT_HEIGHT = 44;
const CELL_PADDING_X = 10;
const PRIMARY_FONT_SIZE = 12;
const SECONDARY_FONT_SIZE = 10;

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

  return `${text.slice(0, maxChars - 1)}\u2026`;
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
  payload?: TaxaTreemapCellPayload;
}) {
  if (width <= 0 || height <= 0) {
    return null;
  }

  const safeName =
    typeof name === "string" ? name : typeof payload?.name === "string" ? payload.name : "";
  const fill =
    safeName === "Others" ? OTHER_TREEMAP_COLOR : TREEMAP_COLORS[index % TREEMAP_COLORS.length];
  const detectionCount = count ?? payload?.count ?? 0;
  const showName = width >= MIN_LABEL_WIDTH && height >= MIN_LABEL_HEIGHT;
  const showCount = width >= MIN_COUNT_WIDTH && height >= MIN_COUNT_HEIGHT;
  const fontSize = width >= 96 && height >= 52 ? PRIMARY_FONT_SIZE : SECONDARY_FONT_SIZE;
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

export { TaxaTreemapCell };
