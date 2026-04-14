import { createFileRoute } from "@tanstack/react-router";

import { DeploymentInfoCard } from "@/components/info/DeploymentInfoCard";
import { PictureCard } from "@/components/info/PictureCard";
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
      <div className="grid grid-cols-2 gap-x-3">
        <DeploymentInfoCard />
        <PictureCard />
      </div>
      <GoogleMapsCard />
    </div>
  );
}
