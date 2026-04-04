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
import { useDeployment } from "@/lib/hooks/useDeployment";
import { useFilters } from "@/lib/hooks/useFilters";

interface HubFilterProps {
  deploymentId: string;
}

function HubFilter({ deploymentId }: HubFilterProps) {
  const { data } = useDeployment({ deployment_id: deploymentId });
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
          <SelectValue placeholder="All Hubs">
            {data?.devices.find((hub) => hub.device_id === hubId)?.name}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="" className="text-muted-foreground">
            All Hubs
          </SelectItem>
          {data?.devices.map((hub) => (
            <SelectItem key={hub.device_id} value={hub.device_id}>
              {hub.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export { HubFilter };
