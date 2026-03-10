import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeftIcon } from "lucide-react";

import { AnalyticsData } from "@/components/analytics/AnalyticsData";
import { FilterHeader } from "@/components/filters/FilterHeader";
import { Button } from "@/components/ui/Button";
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

  const renderTabContent = () => {
    switch (filters.activeTab) {
      case "overview":
        return <div>Overview content goes here</div>;
      case "analytics":
        return <AnalyticsData />;
      case "observations":
        return <div>Observations content goes here</div>;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <main className="flex min-h-screen flex-col pt-14">
      {/* Deployment header */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-3">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground"
          onClick={() => navigate({ to: "/" })}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Deployments
        </Button>
        <div className="h-4 w-px bg-border" />
        <h1 className="text-sm font-semibold">{deploymentId}</h1>
      </div>

      {/* Filter header */}
      <FilterHeader deploymentId={deploymentId} />

      {/* Tab content */}
      <div className="px-6 py-6">{renderTabContent()}</div>
    </main>
  );
}
