import { ShieldCheckIcon } from "lucide-react";

import { filterFieldClass, filterLabelClass } from "@/components/filters/filterStyles";
import { useFilterContext } from "@/lib/filters/filterState";

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
        {PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => actions.setMinConfidence(p.value)}
            className={`h-9 rounded px-3 text-sm font-medium transition-colors ${
              filters.minConfidence === p.value
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {p.label}
          </button>
        ))}
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
