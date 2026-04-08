import type { LucideIcon } from "lucide-react";

import type { useEnvironmentTimeSeries } from "@/lib/hooks/useEnvironmentTimeSeries";
import type { EnvironmentTimeSeriesResponse } from "@/lib/types/api";

type TimeSeries = ReturnType<typeof useEnvironmentTimeSeries>;

type TimeSeriesDataKey = {
  [K in keyof EnvironmentTimeSeriesResponse]: EnvironmentTimeSeriesResponse[K] extends number[]
    ? K
    : never;
}[keyof EnvironmentTimeSeriesResponse];

interface Metric<T extends TimeSeriesDataKey = TimeSeriesDataKey> {
  key: T;
  label: string;
  Icon: LucideIcon;
  color: string;
  unit: string;
  enabled: boolean;
}

export type { TimeSeries, TimeSeriesDataKey, Metric };
