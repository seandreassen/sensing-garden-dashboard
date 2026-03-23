import { CalendarIcon } from "lucide-react";

import {
  filterFieldClass,
  filterLabelClass,
  filterSelectClass,
} from "@/components/filters/filterStyles";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import type { RangePreset } from "@/lib/filters";
import { useFilters } from "@/lib/hooks/useFilters";

const presets: { value: RangePreset; label: string }[] = [
  { value: "24h", label: "Last 24 Hours" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "3m", label: "Last 3 Months" },
  { value: "custom", label: "Custom Range" },
];

function toDateString(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const dateInputClass =
  "h-8 w-full rounded border border-border bg-card px-2 text-sm text-foreground outline-none transition-colors hover:border-muted-foreground focus:ring-1 focus:ring-ring [&::-webkit-calendar-picker-indicator]:invert";

function DateRangeFilter() {
  const { updateFilters, rangePreset, startDate, endDate } = useFilters();

  const handlePresetChange = (value: string) => {
    if (value === "custom") {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      updateFilters({
        rangePreset: "custom",
        startDate: toDateString(weekAgo),
        endDate: toDateString(now),
      });
    } else {
      updateFilters({ rangePreset: value as RangePreset, startDate: "", endDate: "" });
    }
  };

  return (
    <div className={filterFieldClass}>
      <Label htmlFor="filter-date-range" className={filterLabelClass}>
        <CalendarIcon className="h-3 w-3" />
        Date Range
      </Label>
      <Select value={rangePreset} onValueChange={(v) => v && handlePresetChange(v)}>
        <SelectTrigger id="filter-date-range" className={filterSelectClass}>
          <SelectValue>
            {presets.find((p) => p.value === rangePreset)?.label ?? "Custom Range"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {presets.map((preset) => (
            <SelectItem key={preset.value} value={preset.value}>
              {preset.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {rangePreset === "custom" && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            aria-label="Start date"
            className={dateInputClass}
            value={startDate ? startDate.slice(0, 10) : ""}
            onChange={(e) => updateFilters({ startDate: e.target.value })}
          />
          <span className="shrink-0 text-xs text-muted-foreground">to</span>
          <input
            type="date"
            aria-label="End date"
            className={dateInputClass}
            value={endDate ? endDate.slice(0, 10) : ""}
            onChange={(e) => updateFilters({ endDate: e.target.value })}
          />
        </div>
      )}
    </div>
  );
}

export { DateRangeFilter };
