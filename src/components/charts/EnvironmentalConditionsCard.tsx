import { DropletIcon, ThermometerIcon } from "lucide-react";
import { useState } from "react";

import { EnvironmentalConditionsChart } from "@/components/charts/EnvironmentalConditionsChart";
import { ToggleMetricsRow } from "@/components/charts/ToggleMetricsRow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { useEnvironmentTimeSeries } from "@/lib/hooks/useEnvironmentTimeSeries";
import { useFilters } from "@/lib/hooks/useFilters";
import { getInterval } from "@/lib/timeSeries";

interface EnvironmentalConditionsCardProps {
  deploymentId: string;
}

function EnvironmentalConditionsCard({ deploymentId }: EnvironmentalConditionsCardProps) {
  const { startDate, endDate, hub } = useFilters();
  const { intervalLength, intervalUnit } = getInterval(new Date(startDate), new Date(endDate));
  const timeSeries = useEnvironmentTimeSeries({
    start_time: startDate,
    end_time: endDate,
    device_id: hub ? [hub] : undefined,
    deployment_id: deploymentId,
    interval_length: intervalLength,
    interval_unit: intervalUnit,
  });

  const [enabledMetrics, setEnabledMetrics] = useState({ temperature: true, humidity: true });
  const toggleMetric = (metric: keyof typeof enabledMetrics) =>
    setEnabledMetrics((prev) => ({ ...prev, [metric]: !prev[metric] }));
  const metrics = [
    {
      key: "temperature" as const,
      label: "Temperature",
      Icon: ThermometerIcon,
      color: "#ff6b6b",
      unit: "°C",
      enabled: enabledMetrics.temperature,
    },
    {
      key: "humidity" as const,
      label: "Humidity",
      Icon: DropletIcon,
      color: "#4dabf7",
      unit: "%",
      enabled: enabledMetrics.humidity,
    },
  ];

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-lg font-bold uppercase">Environmental Conditions</CardTitle>
        <CardDescription>
          Temperature and humidity measurements over selected period
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-4">
        <ToggleMetricsRow metrics={metrics} toggleMetric={toggleMetric} />
        <EnvironmentalConditionsChart
          timeSeries={timeSeries}
          metrics={metrics.filter((metric) => metric.enabled)}
        />
      </CardContent>
    </Card>
  );
}

export { EnvironmentalConditionsCard };
