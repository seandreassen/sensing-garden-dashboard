import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeftIcon } from "lucide-react";

import { FilterHeader } from "@/components/filters/FilterHeader";
import { FilterProvider } from "@/lib/filters/FilterContext";
import { useFilterContext } from "@/lib/filters/filterState";

export const Route = createFileRoute("/deployment/$deploymentId")({
  component: DeploymentPage,
});

function DeploymentPage() {
  const { deploymentId } = Route.useParams();

  return (
    <FilterProvider>
      <DeploymentContent deploymentId={deploymentId} />
    </FilterProvider>
  );
}

function DeploymentContent({ deploymentId }: { deploymentId: string }) {
  const navigate = useNavigate();
  const { filters } = useFilterContext();

  return (
    <main className="flex min-h-screen flex-col pt-14">
      {/* Deployment header */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-3">
        <button
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          onClick={() => navigate({ to: "/" })}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Deployments
        </button>
        <div className="h-4 w-px bg-border" />
        <h1 className="text-sm font-semibold">{deploymentId}</h1>
      </div>

      {/* Filter header */}
      <FilterHeader deploymentId={deploymentId} />

      {/* Tab content placeholder */}
      <div className="px-6 py-6">
        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border">
          <span className="text-sm text-muted-foreground">
            {filters.activeTab.charAt(0).toUpperCase() + filters.activeTab.slice(1)} content goes
            here
          </span>
        </div>
      </div>
    </main>
  );
}
