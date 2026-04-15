import { createFileRoute } from "@tanstack/react-router";

import { DeploymentInfoCard } from "@/components/info/DeploymentInfoCard";
import { DeviceCard } from "@/components/info/DeviceCard";
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
    <div className="flex grid-cols-2 flex-col gap-y-3 md:flex">
      <div className="flex items-start gap-x-3">
        <div className="h-89 flex-1 overflow-hidden">
          <DeploymentInfoCard />
        </div>
        <div className="h-89 flex-1 overflow-hidden">
          <DeviceCard />
        </div>
        <div className="h-89 shrink-0 overflow-hidden">
          <PictureCard />
        </div>
      </div>
      <div className="h-100">
        <GoogleMapsCard />
      </div>
    </div>
  );
}
