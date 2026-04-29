import { RadioIcon } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { CardHeader, CardTitle } from "@/components/ui/Card";
import type { DeploymentDevice } from "@/lib/types/api";
import { cn } from "@/lib/utils";

interface HubStatusCardHeaderProps {
  hub: DeploymentDevice;
  active: boolean;
}

function HubStatusCardHeader({ hub, active }: HubStatusCardHeaderProps) {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Badge
            className={cn(
              "h-fit p-2",
              active
                ? "border-primary/30! bg-primary/15 text-primary"
                : "border-destructive/30! bg-destructive/15 text-destructive",
            )}
          >
            <RadioIcon className="size-5" />
          </Badge>
          <div className="flex flex-col gap-2">
            <CardTitle className="text-sm">Hub: {hub.name ?? hub.device_id}</CardTitle>
            <Badge
              className={cn(
                "flex w-fit items-center gap-2 px-2 py-1",
                active
                  ? "border-primary/30! bg-primary/15 text-primary"
                  : "border-destructive/30! bg-destructive/15 text-destructive",
              )}
            >
              <span
                className={cn("size-1.5 rounded-full", active ? "bg-primary" : "bg-destructive")}
              />
              <p className="uppercase">{active ? "Active" : "Inactive"}</p>
            </Badge>
          </div>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-muted-foreground">ID</span>
          <span>{hub.device_id}</span>
        </div>
      </div>
    </CardHeader>
  );
}

export { HubStatusCardHeader };
