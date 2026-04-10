import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { useDeployment } from "@/lib/hooks/useDeployment";
import { useObservations } from "@/lib/hooks/useObservations";
import { Route } from "@/routes/deployment/$deploymentId/_filterLayout";

type DeviceRowProps = { device_id: string; name?: string };

function DeviceRow({ device_id, name }: DeviceRowProps) {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data } = useObservations({
    device_id: [device_id],
    start_time: oneWeekAgo,
    limit: 1,
  });

  const isActive = (data?.count ?? 0) > 0;

  return (
    <div className="flex items-center gap-2 rounded-md border px-3 py-2">
      <span className="truncate text-sm font-medium">{name ?? device_id}</span>
      <span className="flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs">
        <span
          className={`size-2 shrink-0 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`}
        />
        {isActive ? "Active" : "Inactive"}
      </span>
    </div>
  );
}

function DeploymentInfoCard() {
  const { deploymentId } = Route.useParams();
  const { data, isLoading } = useDeployment({ deployment_id: deploymentId });
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const desc = data?.deployment.description ?? "";
  const words = desc.split(/\s+/);
  const isTruncated = words.length > 500;
  const displayText = isTruncated && !expanded ? words.slice(0, 500).join(" ") + "…" : desc;

  return (
    <Card className="col-span-2 p-4">
      <CardHeader className="flex flex-col">
        <CardTitle className="text-lg">Deployment Information</CardTitle>
        <CardContent className={expanded ? "max-h-64 overflow-y-auto" : undefined}>
          {desc ? (
            <>
              {displayText}
              {isTruncated && (
                <button
                  onClick={() => setExpanded((prev) => !prev)}
                  className="ml-1 text-xs text-muted-foreground underline hover:text-foreground"
                >
                  {expanded ? "Show less" : "Show more"}
                </button>
              )}
            </>
          ) : (
            <p className="col-span-4 text-sm text-muted-foreground">
              This deployment has no description
            </p>
          )}
        </CardContent>
      </CardHeader>
      <Separator />
      <CardHeader>Connected hubs</CardHeader>
      <CardContent className="grid grid-cols-4 gap-2">
        {data?.devices.length ? (
          data.devices.map((device) => (
            <DeviceRow key={device.device_id} device_id={device.device_id} name={device.name} />
          ))
        ) : (
          <p className="col-span-4 text-sm text-muted-foreground">
            This deployment has no connected hubs
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export { DeploymentInfoCard };
