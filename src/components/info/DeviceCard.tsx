import { useEffect, useRef, useState } from "react";

import { DeviceRow } from "@/components/info/DeviceRow";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useDeployment } from "@/lib/hooks/useDeployment";
import { cn } from "@/lib/utils";
import { Route } from "@/routes/deployment/$deploymentId/_filterLayout";

const DEVICES_COLLAPSED_MAX_HEIGHT = 250; // px

function DeviceCard() {
  const { deploymentId } = Route.useParams();
  const { data, error, isLoading, isError } = useDeployment({
    deployment_id: deploymentId,
  });

  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const devicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (devicesRef.current) {
      setIsTruncated(devicesRef.current.scrollHeight > DEVICES_COLLAPSED_MAX_HEIGHT);
    }
  }, [data?.devices]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="text-sm text-muted-foreground">Error: {error.message}</span>
      </div>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Connected hubs</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={devicesRef}
          className={cn(
            "grid grid-cols-2 gap-2 pt-px pb-2",
            !expanded && isTruncated && "overflow-hidden",
            expanded && "max-h-64 overflow-y-auto",
          )}
          style={!expanded && isTruncated ? { maxHeight: DEVICES_COLLAPSED_MAX_HEIGHT } : undefined}
        >
          {data?.devices.length ? (
            data.devices.map((device) => (
              <DeviceRow key={device.device_id} device_id={device.device_id} name={device.name} />
            ))
          ) : (
            <p className="col-span-2 text-sm text-muted-foreground">
              This deployment has no connected hubs
            </p>
          )}
        </div>
        {isTruncated && (
          <Button
            variant="nav"
            size="none"
            className="ml-1"
            onClick={() => {
              if (expanded && devicesRef.current) {
                devicesRef.current.scrollTop = 0;
              }
              setExpanded((prev) => !prev);
            }}
          >
            {expanded ? "Show less" : "...Show more"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export { DeviceCard };
