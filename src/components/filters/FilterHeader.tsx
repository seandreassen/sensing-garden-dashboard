import { useNavigate } from "@tanstack/react-router";

import { useFilterContext } from "@/lib/filters/filterState";
import { useDeployments } from "@/lib/hooks/useDeployments";
import type { WorkspaceTab } from "@/lib/types/api";

import { ConfidenceFilter } from "./ConfidenceFilter";
import { DateRangeFilter } from "./DateRangeFilter";
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
            className={`border-b-2 px-4 py-2.5 text-xs font-semibold tracking-wide uppercase transition-colors ${
              d.deploymentId === deploymentId
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
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
            className={`relative rounded-t px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-colors ${
              filters.activeTab === tab.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export { FilterHeader };
