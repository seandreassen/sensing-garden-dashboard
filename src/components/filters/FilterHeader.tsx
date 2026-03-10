import { useNavigate } from "@tanstack/react-router";

import { useFilterContext } from "@/lib/filters/filterState";
import { useDeployments } from "@/lib/hooks/useDeployments";
import type { WorkspaceTab } from "@/lib/types/api";
import { cn } from "@/lib/utils";

import { ConfidenceFilter } from "./ConfidenceFilter";
import { DateRangeFilter } from "./DateRangeFilter";
import {
  filterDeploymentTabActiveClass,
  filterDeploymentTabClass,
  filterDeploymentTabInactiveClass,
  filterWorkspaceTabActiveClass,
  filterWorkspaceTabClass,
  filterWorkspaceTabInactiveClass,
} from "./filterStyles";
import { HubFilter } from "./HubFilter";
import { TaxonomyFilter } from "./TaxonomyFilter";

interface FilterHeaderProps {
  deploymentId: string;
}

const TABS: { value: WorkspaceTab; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "analytics", label: "Analytics" },
  { value: "observations", label: "Observations" },
];

function FilterHeader({ deploymentId }: FilterHeaderProps) {
  const { filters, actions } = useFilterContext();
  const navigate = useNavigate();
  const { data: deployments } = useDeployments();

  const activeDeployments = deployments?.filter((d) => d.active) ?? [];

  return (
    <div className="flex flex-col border-b border-border">
      {/* Deployment tabs */}
      <div className="flex gap-0 border-b border-border px-6">
        {activeDeployments.map((d) => (
          <button
            key={d.deploymentId}
            onClick={() =>
              navigate({
                to: "/deployment/$deploymentId",
                params: { deploymentId: d.deploymentId },
              })
            }
            className={cn(
              filterDeploymentTabClass,
              d.deploymentId === deploymentId
                ? filterDeploymentTabActiveClass
                : filterDeploymentTabInactiveClass,
            )}
          >
            {d.deploymentId}
          </button>
        ))}
      </div>

      {/* Filter row */}
      <div className="grid grid-cols-[1fr_1fr_1fr_2fr] items-end gap-6 px-6 py-4">
        <DateRangeFilter />
        <HubFilter />
        <TaxonomyFilter />
        <ConfidenceFilter />
      </div>

      {/* Page switcher */}
      <div className="flex gap-0 px-6">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => actions.setActiveTab(tab.value)}
            className={cn(
              filterWorkspaceTabClass,
              filters.activeTab === tab.value
                ? filterWorkspaceTabActiveClass
                : filterWorkspaceTabInactiveClass,
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export { FilterHeader };
