import { Link } from "@tanstack/react-router";
import { MapPinIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import type { Deployment } from "@/lib/types/api";
import { cn } from "@/lib/utils";

import { Badge } from "./Badge";

interface DeploymentCardProps {
  deployment: Deployment;
}

function DeploymentCard({ deployment }: DeploymentCardProps) {
  const { name, deployment_id, start_time, end_time, location_name } = deployment;
  const active = !end_time || end_time > new Date();

  return (
    <Link
      to="/deployment/$deploymentId/overview"
      params={{ deploymentId: deployment_id }}
      className={buttonVariants({ variant: "none", size: "none" })}
    >
      <Card className="h-46 w-full">
        <CardHeader className="flex flex-col gap-1">
          <div className="flex w-full items-center justify-between">
            <CardTitle className="truncate text-lg text-card-foreground">{name}</CardTitle>
            <Badge
              className={cn(
                "flex items-center gap-2",
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

          <div className="ml-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPinIcon className="size-4" />
            <p className="truncate">{location_name ?? "-"}</p>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Separator />

          <div className="flex items-center justify-between">
            <Badge className="flex items-center gap-2 bg-accent">
              <span className="text-muted-foreground/50">ID</span>
              <p className="text-muted-foreground">{deployment_id}</p>
            </Badge>
            <p className="text-sm text-muted-foreground">X hubs</p>
          </div>

          <Separator />

          <p className="text-xs text-muted-foreground">
            {start_time.toLocaleDateString()} - {end_time?.toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export { DeploymentCard };
