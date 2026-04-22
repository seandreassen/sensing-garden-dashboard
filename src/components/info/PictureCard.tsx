import { DeploymentPicture } from "@/components/info/DeploymentPicture";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useDeployment } from "@/lib/hooks/useDeployment";
import { Route } from "@/routes/deployment/$deploymentId/_filterLayout";

function PictureCard() {
  const { deploymentId } = Route.useParams();
  const { data, error, isLoading, isError } = useDeployment({
    deployment_id: deploymentId,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return (
      <div className="flex h-64 w-fit items-center justify-center">
        <span className="text-sm text-muted-foreground">Error: {error.message}</span>
      </div>
    );
  }

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle className="text-lg">Deployment Picture</CardTitle>
      </CardHeader>
      <CardContent>
        <DeploymentPicture image_url={data?.deployment.image_url} />
      </CardContent>
    </Card>
  );
}

export { PictureCard };
