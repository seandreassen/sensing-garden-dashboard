import { Droplet, Thermometer, Wind } from "lucide-react";

import type { HeatmapCell, HeatmapMode } from "@/lib/heatmapAggregation";

import { cellColorFromRatio, getModeCopy } from "./activityHeatmapColors";

function HeatmapHeader({
  mode,
  taxonomyLabel,
  maxCount,
}: {
  mode: HeatmapMode;
  taxonomyLabel: string;
  maxCount: number;
}) {
  const modeCopy = getModeCopy(mode);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-bold tracking-tight uppercase">Detection Activity Heatmap</h4>
          <p className="text-[11px] text-muted-foreground">{modeCopy.structureHint}</p>
        </div>
        <div className="text-right text-[11px] text-muted-foreground">
          <span>
            Level: <strong className="text-foreground">{taxonomyLabel.toUpperCase()}</strong>
          </span>
          <span className="ml-4">
            Peak: <strong className="text-foreground">{maxCount}</strong> detections/cell
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Activity:</span>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <div
              key={ratio}
              className="h-4 w-6 rounded"
              style={{
                backgroundColor: cellColorFromRatio(ratio),
                outline: "1px solid rgba(255,255,255,0.06)",
              }}
            />
          ))}
          <span className="text-[10px] text-muted-foreground">Low</span>
          <span className="text-[10px] text-muted-foreground">High</span>
        </div>
      </div>
    </div>
  );
}

function CellTooltip({
  cell,
  showEnvironmentalData,
  x,
  y,
  flipped,
}: {
  cell: HeatmapCell;
  showEnvironmentalData: boolean;
  x: number;
  y: number;
  flipped: boolean;
}) {
  const arrowBase = "absolute left-1/2 -translate-x-1/2 border-[6px] border-transparent";

  return (
    <div
      className="pointer-events-none absolute z-50 min-w-52 -translate-x-1/2 rounded-md border border-border bg-card px-3 py-2 shadow-lg"
      style={{
        left: x,
        ...(flipped ? { top: y } : { bottom: `calc(100% - ${y}px)` }),
      }}
    >
      <p className="text-[11px] font-medium text-muted-foreground uppercase">{cell.label}</p>
      <p className="mt-0.5 text-lg font-semibold">
        {cell.count} <span className="text-xs font-normal text-muted-foreground">detections</span>
      </p>
      {showEnvironmentalData && (
        <div className="mt-1.5 flex flex-col gap-1 border-t border-border pt-1.5">
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Thermometer className="h-3 w-3" /> Temp
            </span>
            <span className="font-medium">{cell.temp !== undefined ? `${cell.temp}°C` : "--"}</span>
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
      )}
      <span
        className={`${arrowBase} ${flipped ? "-top-3 border-b-border" : "-bottom-3 border-t-border"}`}
      />
      <span
        className={`${arrowBase} ${flipped ? "-top-[11px] border-b-card" : "-bottom-[11px] border-t-card"}`}
      />
    </div>
  );
}

export { CellTooltip, HeatmapHeader };
