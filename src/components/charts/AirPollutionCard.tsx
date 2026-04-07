import { WindIcon } from "lucide-react";
import { useState } from "react";

import { AirPollutionChart } from "@/components/charts/AirPollutionChart";
import { ToggleMetricsRow } from "@/components/charts/ToggleMetricsRow";
import type { Metric } from "@/components/charts/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { useEnvironmentTimeSeries } from "@/lib/hooks/useEnvironmentTimeSeries";
import { useFilters } from "@/lib/hooks/useFilters";
import { getInterval } from "@/lib/timeSeries";

interface AirPollutionCardProps {
  deploymentId: string;
}

function AirPollutionCard({ deploymentId }: AirPollutionCardProps) {
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

  const [enabledPollutants, setEnabledPollutants] = useState({
    pm1p0: true,
    pm2p5: true,
    pm4p0: false,
    pm10: false,
  });
  const togglePollutant = (key: keyof typeof enabledPollutants) =>
    setEnabledPollutants((prev) => ({ ...prev, [key]: !prev[key] }));
  const metrics: Metric<keyof typeof enabledPollutants>[] = [
    {
      key: "pm1p0",
      label: "PM1.0",
      Icon: WindIcon,
      color: "#8becff",
      unit: "μg/m³",
      enabled: enabledPollutants.pm1p0,
    },
    {
      key: "pm2p5",
      label: "PM2.5",
      Icon: WindIcon,
      color: "#44c1ff",
      unit: "μg/m³",
      enabled: enabledPollutants.pm2p5,
    },
    {
      key: "pm4p0",
      label: "PM4.0",
      Icon: WindIcon,
      color: "#226fff",
      unit: "μg/m³",
      enabled: enabledPollutants.pm4p0,
    },
    {
      key: "pm10",
      label: "PM10",
      Icon: WindIcon,
      color: "#000ea3",
      unit: "μg/m³",
      enabled: enabledPollutants.pm10,
    },
  ];

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-lg font-bold uppercase">Air Pollution</CardTitle>
        <CardDescription>
          Particulate matter concentrations (μg/m³) over selected period
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-4">
        <ToggleMetricsRow metrics={metrics} toggleMetric={togglePollutant} />
        <AirPollutionChart timeSeries={timeSeries} metrics={metrics} />
      </CardContent>
    </Card>
  );
}

export { AirPollutionCard };
