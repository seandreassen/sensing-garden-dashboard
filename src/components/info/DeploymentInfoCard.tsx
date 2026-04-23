import { Description } from "@/components/info/Description";
import { Badge } from "@/components/landingPage/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useDeployment } from "@/lib/hooks/useDeployment";
import { cn } from "@/lib/utils";
import { Route } from "@/routes/deployment/$deploymentId/_filterLayout";

const DESCRIPTION_MAX_HEIGHT = 220; // px — approx available space inside card (h-89 wrapper minus header/padding/button)

function DeploymentInfoCard() {
  const { deploymentId } = Route.useParams();
  const { data, error, isLoading, isError } = useDeployment({
    deployment_id: deploymentId,
  });

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

  const startTime = data?.deployment.start_time;
  const endTime = data?.deployment.end_time;
  const isActive = !endTime || endTime > new Date();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">
          Deployment Information for: {data?.deployment.name}
        </CardTitle>
        {startTime && (
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
              <span
                className={cn("size-1.5 rounded-full", isActive ? "bg-primary" : "bg-destructive")}
              />
              <p className="uppercase">{isActive ? "Active" : "Inactive"}</p>
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Description
          description={data?.deployment.description}
          maxHeight={DESCRIPTION_MAX_HEIGHT}
        />
      </CardContent>
    </Card>
  );
}

export { DeploymentInfoCard };
