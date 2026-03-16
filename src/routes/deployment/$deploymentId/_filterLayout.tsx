import { createFileRoute, Link, Outlet, stripSearchParams } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { ChevronLeftIcon } from "lucide-react";

import { DeploymentSelector } from "@/components/deploymentLayout/DeploymentSelector";
import { FiltersRow } from "@/components/deploymentLayout/FiltersRow";
import { TabSelector } from "@/components/deploymentLayout/TabSelector";
import { buttonVariants } from "@/components/ui/button-variants";
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
      <div className="flex items-center gap-3 px-6 py-3">
        <Link
          to="/"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "gap-1 text-muted-foreground",
          )}
        >
          <ChevronLeftIcon />
          Deployments
        </Link>
        <Separator orientation="vertical" />
        <h1 className="font-semibold">{deploymentId}</h1>
      </div>
      <Separator />
      <DeploymentSelector deploymentId={deploymentId} />
    </div>
  );
}

function LayoutComponent() {
  const { deploymentId } = Route.useParams();
  const { scrolled } = useScrollDirection();

  return (
    <FilterProvider>
      <div className="sticky top-16.25 z-10 flex flex-col bg-background/90 backdrop-blur-lg">
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

      <div className="flex w-full grow flex-col px-4 py-8">
        <Outlet />
      </div>
    </FilterProvider>
  );
}
