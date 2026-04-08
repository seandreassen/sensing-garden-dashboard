import { createFileRoute } from "@tanstack/react-router";

import { EditDateRangeCard } from "@/components/deploymentEditor/EditDateRangeCard";
import { EditDescriptionCard } from "@/components/deploymentEditor/EditDescriptionCard";
import { EditDevicesCard } from "@/components/deploymentEditor/EditDevicesCard";
import { EditImageCard } from "@/components/deploymentEditor/EditImageCard";
import { EditMapCard } from "@/components/deploymentEditor/EditMapCard";
import { EditNameCard } from "@/components/deploymentEditor/EditNameCard";

export const Route = createFileRoute("/deployment/$deploymentId/_filterLayout/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="flex flex-col gap-5">
        <EditNameCard />
        <EditDescriptionCard />
      </div>
      <div className="flex flex-col gap-5">
        <EditImageCard />
        <EditDateRangeCard />
      </div>
      <div className="flex flex-col gap-5">
        <EditMapCard />
        <EditDevicesCard />
      </div>
    </div>
  );
}
