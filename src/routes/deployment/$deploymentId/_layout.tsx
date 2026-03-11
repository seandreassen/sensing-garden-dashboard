import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ChevronLeftIcon } from "lucide-react";

import { DeploymentSelector } from "@/components/deploymentLayout/DeploymentSelector";
import { FiltersRow } from "@/components/deploymentLayout/FiltersRow";
import { TabSelector } from "@/components/deploymentLayout/TabSelector";
import { buttonVariants } from "@/components/ui/button-variants";
import { Separator } from "@/components/ui/Separator";
import { FilterProvider } from "@/lib/filters/FilterContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/deployment/$deploymentId/_layout")({
  component: LayoutComponent,
});

function LayoutComponent() {
  const { deploymentId } = Route.useParams();

  return (
    <FilterProvider>
      {/* top-16.25 is a hacky fix but I don't know how else to do it - needs to be updated if header changes size */}
      <div className="sticky top-16.25 z-10 flex flex-col bg-background/90 backdrop-blur-lg">
        {/* Not in figma, maybe remove remove? (header + filters take a lot of space) */}
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
