import { CalendarIcon } from "lucide-react";

import {
  filterFieldClass,
  filterLabelClass,
  filterSelectClass,
} from "@/components/filters/filterStyles";
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
    <div className={filterFieldClass}>
      <label htmlFor="filter-date-range" className={filterLabelClass}>
        <CalendarIcon className="h-3 w-3" />
        Date Range
      </label>
      <select
        id="filter-date-range"
        className={filterSelectClass}
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
