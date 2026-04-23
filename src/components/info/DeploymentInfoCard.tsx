import { DeploymentStatus } from "@/components/info/DeploymentStatus";
import { Description } from "@/components/info/Description";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useDeployment } from "@/lib/hooks/useDeployment";
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

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">
          Deployment Information for: {data?.deployment.name}
        </CardTitle>
        {startTime && <DeploymentStatus startTime={startTime} endTime={endTime} />}
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
