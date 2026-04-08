import { createFileRoute } from "@tanstack/react-router";

import { EditDateRangeCard } from "@/components/deploymentEditor/EditDateRangeCard";
import { EditDescriptionCard } from "@/components/deploymentEditor/EditDescriptionCard";
import { EditNameCard } from "@/components/deploymentEditor/EditNameCard";

export const Route = createFileRoute("/deployment/$deploymentId/_filterLayout/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="flex flex-col gap-5">
        <EditNameCard />
        <EditDateRangeCard />
        <EditDescriptionCard />
      </div>
      <div className="flex flex-col gap-5">
        <EditNameCard />
        <EditDescriptionCard />
        <EditDateRangeCard />
      </div>
      <div className="flex flex-col gap-5">
        <EditNameCard />
        <EditNameCard />
        <EditNameCard />
      </div>
    </div>
  );
}
