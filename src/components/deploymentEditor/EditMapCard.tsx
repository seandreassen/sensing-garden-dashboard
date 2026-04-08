import { GoogleMaps } from "@/components/map/GoogleMaps";
import { Card, CardTitle } from "@/components/ui/Card";

function EditMapCard({ deploymentId }: { deploymentId: string }) {
  return (
    <Card>
      <CardTitle className="px-4 text-center">Location</CardTitle>
      <div className="px-4">
        <GoogleMaps deploymentId={deploymentId} allowDragAndDrop />
      </div>
    </Card>
  );
}

export { EditMapCard };
