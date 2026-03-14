import { Droplet, Thermometer, Wind } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";

import { Spinner } from "@/components/ui/Spinner";
import type { HeatmapCell, HeatmapGrid } from "@/lib/heatmapAggregation";

interface ActivityHeatmapProps {
  grid: HeatmapGrid;
  peakIntensity: number;
  rangeLabel: string;
  taxonomyLabel: string;
  isLoading?: boolean;
}

const INTENSITY_STEPS = [0, 0.15, 0.35, 0.6, 1] as const;

function cellColor(count: number, max: number): string {
  if (max === 0 || count === 0) {
    return "var(--color-card)";
  }
  const ratio = count / max;
  let step = 0;
  for (let i = 1; i < INTENSITY_STEPS.length; i++) {
    if (ratio > INTENSITY_STEPS[i - 1]) {
      step = i;
    }
  }
  const opacity = 0.15 + step * 0.2;
  return `color-mix(in oklch, var(--color-chart-2) ${Math.round(opacity * 100)}%, var(--color-card))`;
}

function ActivityHeatmap({
  grid,
  peakIntensity,
  rangeLabel,
  taxonomyLabel,
  isLoading,
}: ActivityHeatmapProps) {
  const [hovered, setHovered] = useState<HeatmapCell | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, flipped: false });
  const gridRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback((cell: HeatmapCell, e: React.MouseEvent) => {
    setHovered(cell);
    if (gridRef.current) {
      const gridRect = gridRef.current.getBoundingClientRect();
      const cellRect = e.currentTarget.getBoundingClientRect();
      const centerX = cellRect.left + cellRect.width / 2 - gridRect.left;
      const cellTop = cellRect.top - gridRect.top;
      const flipped = cellTop < 160;
      const y = flipped ? cellRect.bottom - gridRect.top + 8 : cellTop - 8;
      setTooltipPos({ x: centerX, y, flipped });
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded border border-border bg-card">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (grid.cells.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded border border-border bg-card">
        <span className="text-sm text-muted-foreground">No data for selected filters</span>
      </div>
    );
  }

  const cols = grid.colLabels.length;

  return (
    <div className="flex flex-col gap-4 rounded border border-border bg-card p-6">
      <HeatmapHeader
        peakIntensity={peakIntensity}
        rangeLabel={rangeLabel}
        taxonomyLabel={taxonomyLabel}
        maxCount={grid.maxCount}
      />

      <div className="relative" ref={gridRef}>
        <div className="flex gap-1">
          <div className="flex flex-col justify-end gap-1 pt-6 pr-2">
            {grid.rowLabels.map((label) => (
              <div
                key={label}
                className="flex h-7 items-center text-[11px] font-medium text-muted-foreground"
              >
                {label}
              </div>
            ))}
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {grid.colLabels.map((label) => (
                <div
                  key={label}
                  className="text-center text-[10px] font-medium text-muted-foreground"
                >
                  {label}
                </div>
              ))}
            </div>

            {grid.cells.map((row, rowIdx) => (
              <div
                key={rowIdx}
                className="grid gap-1"
                style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
              >
                {row.map((cell) => (
                  <div
                    key={`${cell.row}-${cell.col}`}
                    className="h-7 rounded-sm border border-white/[0.06] transition-[outline] duration-100 hover:outline hover:outline-2 hover:outline-foreground/40"
                    style={{ backgroundColor: cellColor(cell.count, grid.maxCount) }}
                    onMouseEnter={(e) => handleMouseEnter(cell, e)}
                    onMouseLeave={() => setHovered(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {hovered && (
          <CellTooltip
            ref={tooltipRef}
            cell={hovered}
            x={tooltipPos.x}
            y={tooltipPos.y}
            flipped={tooltipPos.flipped}
          />
        )}
      </div>
    </div>
  );
}

function HeatmapHeader({
  peakIntensity,
  rangeLabel,
  taxonomyLabel,
  maxCount,
}: {
  peakIntensity: number;
  rangeLabel: string;
  taxonomyLabel: string;
  maxCount: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-bold tracking-tight uppercase">Detection Activity Heatmap</h4>
          <p className="text-[11px] text-muted-foreground">
            Activity patterns by {rangeLabel === "day-hour" ? "day and hour" : "week and day"}{" "}
            (hover for details)
          </p>
        </div>
        <div className="text-right text-[11px] text-muted-foreground">
          <span>
            Temporal Resolution:{" "}
            <strong className="text-foreground">{rangeLabel.toUpperCase()}</strong>
          </span>
          <span className="ml-4">
            Level: <strong className="text-foreground">{taxonomyLabel.toUpperCase()}</strong>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Activity:</span>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <div
              key={ratio}
              className="h-4 w-6 rounded-sm"
              style={{
                backgroundColor:
                  ratio === 0
                    ? "var(--color-card)"
                    : `color-mix(in oklch, var(--color-chart-2) ${Math.round((0.15 + ratio * 0.8) * 100)}%, var(--color-card))`,
                outline: "1px solid rgba(255,255,255,0.06)",
              }}
            />
          ))}
          <span className="text-[10px] text-muted-foreground">Low</span>
          <span className="text-[10px] text-muted-foreground">High</span>
        </div>
        <span className="text-[11px] text-muted-foreground">
          Peak Intensity: <strong className="text-foreground">{peakIntensity}</strong> detections
          {maxCount > 0 ? "/cell" : ""}
        </span>
      </div>
    </div>
  );
}

const CellTooltip = React.forwardRef<
  HTMLDivElement,
  { cell: HeatmapCell; x: number; y: number; flipped: boolean }
>(function CellTooltipInner({ cell, x, y, flipped }, ref) {
  const arrowBase = "absolute left-1/2 -translate-x-1/2 border-[6px] border-transparent";

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute z-50 min-w-44 -translate-x-1/2 rounded-md border border-border bg-card px-3 py-2 shadow-lg"
      style={{
        left: x,
        ...(flipped ? { top: y } : { bottom: `calc(100% - ${y}px)` }),
      }}
    >
      <p className="text-[11px] font-medium text-muted-foreground uppercase">{cell.label}</p>
      <p className="mt-0.5 text-lg font-semibold">
        {cell.count} <span className="text-xs font-normal text-muted-foreground">detections</span>
      </p>
      <div className="mt-1.5 flex flex-col gap-1 border-t border-border pt-1.5">
        <div className="flex items-center justify-between gap-4 text-xs">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Thermometer className="h-3 w-3" /> Temp
          </span>
          <span className="font-medium">
            {cell.temp !== undefined ? `${cell.temp}\u00B0C` : "--"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 text-xs">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Droplet className="h-3 w-3" /> Humidity
          </span>
          <span className="font-medium">
            {cell.humidity !== undefined ? `${cell.humidity}%` : "--"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 text-xs">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Wind className="h-3 w-3" /> AQI
          </span>
          <span className="font-medium">{cell.aqi !== undefined ? cell.aqi : "--"}</span>
        </div>
      </div>
      {/* Arrow */}
      <span
        className={`${arrowBase} ${flipped ? "-top-3 border-b-border" : "-bottom-3 border-t-border"}`}
      />
      <span
        className={`${arrowBase} ${flipped ? "-top-[11px] border-b-card" : "-bottom-[11px] border-t-card"}`}
      />
    </div>
  );
});

export { ActivityHeatmap };
