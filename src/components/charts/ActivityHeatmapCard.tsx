import { ActivityHeatmap } from "@/components/charts/ActivityHeatmap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

interface ActivityHeatmapCardProps {
  deploymentId: string;
}

function ActivityHeatmapCard({ deploymentId }: ActivityHeatmapCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Activity Heatmap</CardTitle>
        <CardDescription>Detections by hour of day over the selected period</CardDescription>
      </CardHeader>
      <CardContent>
        <ActivityHeatmap deploymentId={deploymentId} />
      </CardContent>
    </Card>
  );
}

export { ActivityHeatmapCard };
