import { Description } from "@/components/info/Description";
import { DeviceRow } from "@/components/info/DeviceRow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { useDeployment } from "@/lib/hooks/useDeployment";
import { Route } from "@/routes/deployment/$deploymentId/_filterLayout";

function DeploymentInfoCard() {
  const { deploymentId } = Route.useParams();
  const { data, error, isLoading, isError } = useDeployment({
    deployment_id: deploymentId,
  });

  const description = data?.deployment.description;
  const name = data?.deployment.name;

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
    <Card className="h-full overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-lg">Deployment Information for: {name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Description description={description} />
      </CardContent>
      <Separator />
      <CardHeader>
        <CardTitle>Connected hubs</CardTitle>
      </CardHeader>
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
