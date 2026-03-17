import { useCallback, useEffect, useRef, useState } from "react";

import { Spinner } from "@/components/ui/Spinner";
import type { HeatmapCell, HeatmapGrid } from "@/lib/heatmapAggregation";

import { cellColor, findDefaultCell, getModeCopy } from "./activityHeatmapColors";
import { CellTooltip, HeatmapHeader } from "./activityHeatmapParts";

interface ActivityHeatmapProps {
  grid: HeatmapGrid;
  taxonomyLabel: string;
  isLoading?: boolean;
}

function ActivityHeatmap({ grid, taxonomyLabel, isLoading }: ActivityHeatmapProps) {
  const [activeCell, setActiveCell] = useState<HeatmapCell | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, flipped: false });
  const [isPointerInside, setIsPointerInside] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const setTooltipForCell = useCallback((cell: HeatmapCell, target?: HTMLElement | null) => {
    if (!gridRef.current) {
      return;
    }

    const element =
      target ??
      gridRef.current.querySelector<HTMLElement>(`[data-heatmap-cell="${cell.row}-${cell.col}"]`);

    if (!element) {
      return;
    }

    const gridRect = gridRef.current.getBoundingClientRect();
    const cellRect = element.getBoundingClientRect();
    const centerX = cellRect.left + cellRect.width / 2 - gridRect.left;
    const cellTop = cellRect.top - gridRect.top;
    const flipped = cellTop < 160;
    const y = flipped ? cellRect.bottom - gridRect.top + 8 : cellTop - 8;

    setTooltipPos({ x: centerX, y, flipped });
  }, []);

  const activateCell = useCallback(
    (cell: HeatmapCell, target?: HTMLElement | null) => {
      setActiveCell(cell);
      setTooltipForCell(cell, target);
    },
    [setTooltipForCell],
  );

  useEffect(() => {
    if (grid.cells.length === 0) {
      setActiveCell(null);
      return;
    }

    const nextCell = findDefaultCell(grid.cells);
    if (!nextCell) {
      setActiveCell(null);
      return;
    }

    setActiveCell(nextCell);

    const frame = window.requestAnimationFrame(() => {
      setTooltipForCell(nextCell);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [grid.cells, setTooltipForCell]);

  useEffect(() => {
    if (!activeCell) {
      return;
    }

    const handleResize = () => {
      setTooltipForCell(activeCell);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeCell, setTooltipForCell]);

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
  const modeCopy = getModeCopy(grid.mode);
  const showEnvironmentalData = grid.mode === "date-hour";

  return (
    <div className="flex flex-col gap-4 rounded border border-border bg-card p-6">
      <HeatmapHeader mode={grid.mode} taxonomyLabel={taxonomyLabel} maxCount={grid.maxCount} />

      <div
        className="relative"
        ref={gridRef}
        onMouseEnter={() => setIsPointerInside(true)}
        onMouseLeave={() => {
          setIsPointerInside(false);
          setActiveCell(null);
        }}
      >
        <div className="mb-3 flex items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <span>{modeCopy.description}</span>
          <span>{modeCopy.structureHint}</span>
        </div>

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
                  <button
                    key={`${cell.row}-${cell.col}`}
                    type="button"
                    data-heatmap-cell={`${cell.row}-${cell.col}`}
                    className="h-7 appearance-none rounded-sm border border-white/[0.06] bg-transparent p-0 outline-none focus-visible:ring-0 focus-visible:outline-none"
                    style={{ backgroundColor: cellColor(cell.count, grid.maxCount) }}
                    aria-label={`${cell.label}: ${cell.count} detections`}
                    onMouseEnter={(e) => activateCell(cell, e.currentTarget)}
                    onFocus={(e) => activateCell(cell, e.currentTarget)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {activeCell && isPointerInside && (
          <CellTooltip
            cell={activeCell}
            showEnvironmentalData={showEnvironmentalData}
            x={tooltipPos.x}
            y={tooltipPos.y}
            flipped={tooltipPos.flipped}
          />
        )}
      </div>
    </div>
  );
}

export { ActivityHeatmap };
