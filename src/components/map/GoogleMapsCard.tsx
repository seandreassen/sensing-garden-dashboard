import { GoogleMaps } from "@/components/map/GoogleMaps";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { Route } from "@/routes/deployment/$deploymentId/_filterLayout";

function GoogleMapsCard() {
  const { deploymentId } = Route.useParams();

  return (
    <Card className="col-span-2 flex h-full flex-col p-4">
      <CardHeader>
        <CardTitle className="text-lg">Deployment location</CardTitle>
        <CardDescription>Location of deployment and its contained hubs</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex-1">
        <GoogleMaps deploymentId={deploymentId} />
      </CardContent>
    </Card>
  );
}
export { GoogleMapsCard };
