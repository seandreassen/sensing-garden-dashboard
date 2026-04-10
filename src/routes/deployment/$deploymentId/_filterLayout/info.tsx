import { createFileRoute } from "@tanstack/react-router";

import { DeploymentInfoCard } from "@/components/deployments/DeploymentInfoCard";
import { GoogleMapsCard } from "@/components/map/GoogleMapsCard";

export const Route = createFileRoute("/deployment/$deploymentId/_filterLayout/info")({
  head: () => ({
    meta: [{ title: "Info | Sensing Garden Dashboard" }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-y-3">
      <DeploymentInfoCard />
      <GoogleMapsCard />
    </div>
  );
}
