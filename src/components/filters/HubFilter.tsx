import { RadioIcon } from "lucide-react";

import { filterLabelClass, filterSelectClass } from "@/components/filters/filterStyles";
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
  const { updateFilters, hub: hubId } = useFilters();

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="filter-hub" className={filterLabelClass}>
        <RadioIcon className="size-4" />
        Active Hubs
      </Label>
      <Select
        value={hubId ?? ""}
        onValueChange={(value) => updateFilters({ hub: value ?? undefined })}
      >
        <SelectTrigger id="filter-hub" className={filterSelectClass}>
          <SelectValue placeholder="All Hubs" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="" className="text-muted-foreground">
            All Hubs
          </SelectItem>
          {hubs?.map((hub) => (
            <SelectItem key={hub.device_id} value={hub.device_id}>
              {hub.device_id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export { HubFilter };
