import { CalendarIcon } from "lucide-react";

import { useFilterContext } from "@/lib/filters/filterState";
import type { DatePreset } from "@/lib/types/api";

const PRESETS: { value: DatePreset; label: string }[] = [
  { value: "24h", label: "Last 24 Hours" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
];

function DateRangeFilter() {
  const { filters, actions } = useFilterContext();

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="filter-date-range"
        className="flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-muted-foreground uppercase"
      >
        <CalendarIcon className="h-3 w-3" />
        Date Range
      </label>
      <select
        id="filter-date-range"
        className="h-9 w-full cursor-pointer appearance-none rounded border border-border bg-card px-3 text-sm text-foreground transition-colors outline-none hover:border-muted-foreground focus:ring-1 focus:ring-ring"
        value={filters.datePreset}
        onChange={(e) => actions.setDatePreset(e.target.value as DatePreset)}
      >
        {PRESETS.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export { DateRangeFilter };
