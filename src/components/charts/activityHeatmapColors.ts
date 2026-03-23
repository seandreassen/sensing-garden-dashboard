import type { HeatmapCell, HeatmapMode } from "@/lib/heatmapAggregation";

const MODE_COPY: Record<HeatmapMode, { description: string; structureHint: string }> = {
  "date-hour": {
    description: "Activity patterns by date and hour",
    structureHint: "Rows show dates, columns show hours.",
  },
  "week-day": {
    description: "Activity patterns by week and weekday",
    structureHint: "Rows show weeks, columns show weekdays.",
  },
  "month-weekday": {
    description: "Activity patterns by month and weekday",
    structureHint: "Rows show months, columns show weekdays.",
  },
};

const HEATMAP_GREEN_RGB = "132, 169, 22";

function getModeCopy(mode: HeatmapMode) {
  return MODE_COPY[mode];
}

function cellColorFromRatio(ratio: number): string {
  if (ratio <= 0) {
    return "var(--color-card)";
  }

  const eased = Math.pow(ratio, 1.35);
  const alpha = 0.14 + eased * 0.72;
  return `rgba(${HEATMAP_GREEN_RGB}, ${alpha.toFixed(3)})`;
}

function cellColor(count: number, max: number): string {
  if (max === 0 || count === 0) {
    return "var(--color-card)";
  }

  return cellColorFromRatio(count / max);
}

function findDefaultCell(cells: HeatmapCell[][]): HeatmapCell | null {
  if (cells.length === 0) {
    return null;
  }

  let bestCell = cells[0]?.[0] ?? null;

  for (const row of cells) {
    for (const cell of row) {
      if (!bestCell || cell.count > bestCell.count) {
        bestCell = cell;
      }
    }
  }

  return bestCell;
}

export { cellColor, cellColorFromRatio, findDefaultCell, getModeCopy };
