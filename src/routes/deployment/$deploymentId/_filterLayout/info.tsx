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
    <div className="grid grid-cols-2 gap-3 lg:flex lg:flex-wrap lg:gap-3">
      <div className="overflow-hidden lg:h-89 lg:min-w-64 lg:flex-1">
        <DeploymentInfoCard />
      </div>
      <div className="overflow-hidden lg:h-89 lg:shrink-0">
        <PictureCard />
      </div>
      <div className="col-span-2 overflow-hidden lg:col-span-1 lg:h-89 lg:min-w-64 lg:shrink-0">
        <DeviceCard />
      </div>
      <div className="col-span-2 lg:h-100 lg:basis-full">
        <GoogleMapsCard />
      </div>
    </div>
  );
}
