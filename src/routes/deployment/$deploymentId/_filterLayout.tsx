import { createFileRoute, Outlet, stripSearchParams } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

import { Header } from "@/components/deploymentLayout/DeploymentHeader";
import { FiltersRow } from "@/components/deploymentLayout/FiltersRow";
import { TabSelector } from "@/components/deploymentLayout/TabSelector";
import { Separator } from "@/components/ui/Separator";
import { filtersDefault, filtersSchema } from "@/lib/utils/filters";

export const Route = createFileRoute("/deployment/$deploymentId/_filterLayout")({
  validateSearch: zodValidator(filtersSchema),
  search: {
    middlewares: [stripSearchParams(filtersDefault)],
  },
  component: LayoutComponent,
});

function LayoutComponent() {
  const { deploymentId } = Route.useParams();

  return (
    <>
      <Header />
      <div className="sticky top-14 z-50 flex flex-col bg-card backdrop-blur-lg">
        <Separator />
        <FiltersRow deploymentId={deploymentId} />
        <Separator />
        <TabSelector deploymentId={deploymentId} />
        <Separator />
      </div>

      <div className="flex w-full grow flex-col p-6">
        <Outlet />
      </div>
    </>
  );
}
