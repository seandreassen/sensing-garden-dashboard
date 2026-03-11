import { RadioIcon } from "lucide-react";

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
import { useFilters } from "@/lib/hooks/useFilters";
import { useHubs } from "@/lib/hooks/useHubs";

function HubFilter() {
  const { data: hubs } = useHubs();
  const { updateFilters, hub } = useFilters();

  return (
    <div className={filterFieldClass}>
      <Label htmlFor="filter-hub" className={filterLabelClass}>
        <RadioIcon className="h-3 w-3" />
        Active Hubs
      </Label>
      <Select
        value={hub ?? ""}
        onValueChange={(value) => updateFilters({ hub: value ?? undefined })}
      >
        <SelectTrigger id="filter-hub" className={filterSelectClass}>
          <SelectValue placeholder="All Hubs" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="" className="text-muted-foreground">
            All Hubs
          </SelectItem>
          {hubs?.map((hubId) => (
            <SelectItem key={hubId} value={hubId}>
              {hubId}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export { HubFilter };
