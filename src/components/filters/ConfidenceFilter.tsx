import { ShieldCheckIcon } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { useFilterContext } from "@/lib/filters/filterState";
import { cn } from "@/lib/utils";

import { filterFieldClass, filterLabelClass } from "./filterStyles";

const PRESETS = [
  { value: 0, label: "All" },
  { value: 0.7, label: "≥ 70" },
  { value: 0.8, label: "≥ 80" },
  { value: 0.9, label: "≥ 90" },
];

function ConfidenceFilter() {
  const { filters, actions } = useFilterContext();
  const displayValue = Math.round(filters.minConfidence * 100);

  return (
    <div className={filterFieldClass}>
      <label htmlFor="filter-confidence" className={filterLabelClass}>
        <ShieldCheckIcon className="h-3 w-3" />
        Minimum Confidence (0–100)
      </label>
      <div className="flex items-center gap-2">
        {PRESETS.map((p) => {
          const active = filters.minConfidence === p.value;
          return (
            <Button
              key={p.value}
              variant={active ? "default" : "outline"}
              size="lg"
              className={cn("rounded", !active && "bg-card")}
              onClick={() => actions.setMinConfidence(p.value)}
            >
              {p.label}
            </Button>
          );
        })}
        <input
          id="filter-confidence"
          type="range"
          min={0}
          max={100}
          value={displayValue}
          onChange={(e) => actions.setMinConfidence(Number(e.target.value) / 100)}
          className="mx-1 flex-1 cursor-pointer"
        />
        <span className="min-w-[2.5rem] text-right text-sm font-semibold tabular-nums">
          {displayValue}
        </span>
      </div>
    </div>
  );
}

export { ConfidenceFilter };
