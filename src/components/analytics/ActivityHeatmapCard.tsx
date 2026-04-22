import { ActivityHeatmap } from "@/components/analytics/ActivityHeatmap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";

interface ActivityHeatmapCardProps {
  deploymentId: string;
}

function ActivityHeatmapCard({ deploymentId }: ActivityHeatmapCardProps) {
  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-lg capitalize">Activity heatmap</CardTitle>
        <CardDescription>Detections by hour of day over the selected period</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <ActivityHeatmap deploymentId={deploymentId} />
      </CardContent>
    </Card>
  );
}

export { ActivityHeatmapCard };
