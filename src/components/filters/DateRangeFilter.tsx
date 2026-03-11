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
];

function DateRangeFilter() {
  const { updateFilters, rangePreset } = useFilters();

  return (
    <div className={filterFieldClass}>
      <Label htmlFor="filter-date-range" className={filterLabelClass}>
        <CalendarIcon className="h-3 w-3" />
        Date Range
      </Label>
      <Select
        value={rangePreset}
        onValueChange={(value) => updateFilters({ rangePreset: value ?? undefined })}
      >
        <SelectTrigger id="filter-date-range" className={filterSelectClass}>
          <SelectValue>
            {presets.find((preset) => preset.value === rangePreset)?.label ?? "Custom"}
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
    </div>
  );
}

export { DateRangeFilter };
