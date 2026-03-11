import { RadioIcon } from "lucide-react";

import {
  filterFieldClass,
  filterLabelClass,
  filterSelectClass,
} from "@/components/filters/filterStyles";
import { useFilterContext } from "@/lib/filters/filterState";
import { useHubs } from "@/lib/hooks/useHubs";

function HubFilter() {
  const { filters, actions } = useFilterContext();
  const { data: hubs = [] } = useHubs();

  return (
    <div className={filterFieldClass}>
      <label htmlFor="filter-hub" className={filterLabelClass}>
        <RadioIcon className="h-3 w-3" />
        Active Hubs
      </label>
      <select
        id="filter-hub"
        className={filterSelectClass}
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
