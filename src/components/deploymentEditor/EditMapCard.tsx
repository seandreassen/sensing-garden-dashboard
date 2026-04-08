import { GoogleMaps } from "@/components/map/GoogleMaps";
import { Card, CardTitle } from "@/components/ui/Card";
import type { Location } from "@/lib/types/api";

function EditMapCard({ initialLocations = [] }: { initialLocations?: Location[] }) {
  return (
    <Card>
      <CardTitle className="px-4 text-center">Location</CardTitle>
      <div className="px-4">
        <GoogleMaps initialLocations={initialLocations} allowDragAndDrop />
      </div>
    </Card>
  );
}

export { EditMapCard };
