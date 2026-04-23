import { Badge } from "@/components/landingPage/Badge";
import { cn } from "@/lib/utils";

interface DeploymentStatusProps {
  startTime: Date;
  endTime?: Date;
}

function DeploymentStatus({ startTime, endTime }: DeploymentStatusProps) {
  const isActive = !endTime || endTime > new Date();

  return (
    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <span>
        {startTime.toLocaleDateString()}
        {endTime ? ` – ${endTime.toLocaleDateString()}` : ""}
      </span>
      <Badge
        className={cn(
          "flex items-center gap-2",
          isActive
            ? "border-primary/30! bg-primary/15 text-primary"
            : "border-destructive/30! bg-destructive/15 text-destructive",
        )}
      >
        <span className={cn("size-1.5 rounded-full", isActive ? "bg-primary" : "bg-destructive")} />
        <p className="uppercase">{isActive ? "Active" : "Inactive"}</p>
      </Badge>
    </div>
  );
}

export { DeploymentStatus };
