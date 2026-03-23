import { createFileRoute, Outlet, stripSearchParams } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

import { Header } from "@/components/deploymentLayout/DeploymentHeader";
import { DeploymentSelector } from "@/components/deploymentLayout/DeploymentSelector";
import { FiltersRow } from "@/components/deploymentLayout/FiltersRow";
import { TabSelector } from "@/components/deploymentLayout/TabSelector";
import { Separator } from "@/components/ui/Separator";
import { filtersDefault, filtersSchema } from "@/lib/filters";
import { FilterProvider } from "@/lib/filters/FilterContext";
import { useScrollDirection } from "@/lib/hooks/useScrollDirection";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/deployment/$deploymentId/_filterLayout")({
  validateSearch: zodValidator(filtersSchema),
  search: {
    middlewares: [stripSearchParams(filtersDefault)],
  },
  component: LayoutComponent,
});

function CollapsibleNav({ deploymentId }: { deploymentId: string }) {
  return (
    <div className="overflow-hidden">
      <DeploymentSelector deploymentId={deploymentId} />
    </div>
  );
}

function LayoutComponent() {
  const { deploymentId } = Route.useParams();
  const { scrolled } = useScrollDirection();

  return (
    <FilterProvider>
      <Header />
      <div className="sticky top-14 z-50 flex flex-col bg-card backdrop-blur-lg">
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
            scrolled ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
          )}
        >
          <CollapsibleNav deploymentId={deploymentId} />
        </div>

        <Separator />
        <FiltersRow />
        <Separator />
        <TabSelector />
        <Separator />
      </div>

      <div className="flex w-full grow flex-col px-4 pt-12 pb-8">
        <Outlet />
      </div>
    </FilterProvider>
  );
}
