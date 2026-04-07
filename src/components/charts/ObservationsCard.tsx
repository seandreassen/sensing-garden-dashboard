import { ObservationsChart } from "@/components/charts/ObservationsChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

interface ObservationsCardProps {
  deploymentId: string;
}

function ObservationsCard({ deploymentId }: ObservationsCardProps) {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-col">
        <CardTitle className="text-lg">Insect detections over time</CardTitle>
        <CardDescription>Daily detection count over the selected period</CardDescription>
      </CardHeader>
      <CardContent>
        <ObservationsChart deploymentId={deploymentId} />
      </CardContent>
    </Card>
  );
}

export { ObservationsCard };
