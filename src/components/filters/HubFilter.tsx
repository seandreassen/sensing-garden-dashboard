import { RadioIcon } from "lucide-react";

import { useFilterContext } from "@/lib/filters/filterState";
import { useHubs } from "@/lib/hooks/useHubs";

function HubFilter() {
  const { filters, actions } = useFilterContext();
  const { data: hubs = [] } = useHubs();

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="filter-hub"
        className="flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-muted-foreground uppercase"
      >
        <RadioIcon className="h-3 w-3" />
        Active Sensors (Hubs)
      </label>
      <select
        id="filter-hub"
        className="h-9 w-full cursor-pointer appearance-none rounded border border-border bg-card px-3 text-sm text-foreground transition-colors outline-none hover:border-muted-foreground focus:ring-1 focus:ring-ring"
        value={filters.deviceId ?? ""}
        onChange={(e) => actions.setDeviceId(e.target.value || undefined)}
      >
        <option value="">All Hubs</option>
        {hubs.map((hub) => (
          <option key={hub} value={hub}>
            {hub}
          </option>
        ))}
      </select>
    </div>
  );
}

export { HubFilter };
