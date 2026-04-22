import { createFileRoute } from "@tanstack/react-router";

import { ObservationsCard } from "@/components/overview/ObservationsCard";
import { SpeciesRichnessCard } from "@/components/overview/SpeciesRichnessCard";
import { TopTaxaCard } from "@/components/overview/TopTaxaCard";
import { TotalInsectCountCard } from "@/components/overview/TotalInsectCountCard";
export const Route = createFileRoute("/deployment/$deploymentId/_filterLayout/overview")({
  head: () => ({
    meta: [{ title: "Overview | Sensing Garden Dashboard" }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { deploymentId } = Route.useParams();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-5">
        <TotalInsectCountCard deploymentId={deploymentId} />
        <SpeciesRichnessCard deploymentId={deploymentId} />
      </div>
      <div className="grid grid-cols-3 gap-6">
        <ObservationsCard deploymentId={deploymentId} className="col-span-2" />
        <TopTaxaCard deploymentId={deploymentId} />
      </div>
    </div>
  );
}
