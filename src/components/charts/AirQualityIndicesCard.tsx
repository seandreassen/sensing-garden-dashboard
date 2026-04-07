import { ActivityIcon } from "lucide-react";
import { useState } from "react";

import { AirQualityIndicesChart } from "@/components/charts/AirQualityIndicesChart";
import { ToggleMetricsRow } from "@/components/charts/ToggleMetricsRow";
import type { Metric } from "@/components/charts/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { useEnvironmentTimeSeries } from "@/lib/hooks/useEnvironmentTimeSeries";
import { useFilters } from "@/lib/hooks/useFilters";
import { getInterval } from "@/lib/timeSeries";

interface AirQualityIndicesCardProps {
  deploymentId: string;
}

function AirQualityIndicesCard({ deploymentId }: AirQualityIndicesCardProps) {
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

  const [enabledIndices, setEnabledIndices] = useState({
    voc: true,
    nox: true,
  });
  const toggleIndex = (key: keyof typeof enabledIndices) =>
    setEnabledIndices((prev) => ({ ...prev, [key]: !prev[key] }));
  const metrics: Metric<keyof typeof enabledIndices>[] = [
    {
      key: "voc",
      label: "VOC Index",
      Icon: ActivityIcon,
      color: "#51cf66",
      unit: "",
      enabled: enabledIndices.voc,
    },
    {
      key: "nox",
      label: "NOx Index",
      Icon: ActivityIcon,
      color: "#4dabf7",
      unit: "",
      enabled: enabledIndices.nox,
    },
  ];

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-lg font-bold uppercase">Air Quality Indices</CardTitle>
        <CardDescription>VOC and NOx index measurements over selected period</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-4">
        <ToggleMetricsRow metrics={metrics} toggleMetric={toggleIndex} />
        <AirQualityIndicesChart timeSeries={timeSeries} metrics={metrics} />
      </CardContent>
    </Card>
  );
}

export { AirQualityIndicesCard };
