import { renderWithRootProviders } from "@tests/render";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { beforeEach, expect, test, vi } from "vitest";

import { ActivityHeatmapCard } from "@/components/analytics/ActivityHeatmapCard";
import { AirPollutionCard } from "@/components/analytics/AirPollutionCard";
import { AirQualityIndicesCard } from "@/components/analytics/AirQualityIndicesCard";
import { EnvironmentalConditionsCard } from "@/components/analytics/EnvironmentalConditionsCard";
import { TaxaTreemapCard } from "@/components/analytics/TaxaTreemapCard";

const mocks = vi.hoisted(() => ({
  useEnvironmentTimeSeries: vi.fn(),
  useFilters: vi.fn(),
  useObservationsTimeSeries: vi.fn(),
  useTaxaCount: vi.fn(),
}));

vi.mock("@/lib/hooks/useEnvironmentTimeSeries", () => ({
  useEnvironmentTimeSeries: mocks.useEnvironmentTimeSeries,
}));

vi.mock("@/lib/hooks/useFilters", () => ({
  useFilters: mocks.useFilters,
}));

vi.mock("@/lib/hooks/useObservationsTimeSeries", () => ({
  useObservationsTimeSeries: mocks.useObservationsTimeSeries,
}));

vi.mock("@/lib/hooks/useTaxaCount", () => ({
  useTaxaCount: mocks.useTaxaCount,
}));

vi.mock("@/components/ui/Button", () => ({
  Button: ({
    children,
    className,
    size: _size,
    variant: _variant,
    ...props
  }: ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: ReactNode;
    size?: string;
    variant?: string;
  }) => (
    <button className={className} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/Separator", () => ({
  Separator: () => <div role="separator" />,
}));

vi.mock("@/components/ui/Tooltip", () => ({
  Tooltip: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  TooltipContent: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  TooltipProvider: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  TooltipTrigger: ({
    children,
    ...props
  }: {
    children?: ReactNode;
  } & ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
}));

vi.mock("recharts", () => ({
  CartesianGrid: () => null,
  Legend: () => null,
  Line: () => null,
  LineChart: ({ children }: { children?: ReactNode }) => <svg>{children}</svg>,
  ResponsiveContainer: ({ children }: { children?: ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  Tooltip: () => null,
  Treemap: ({ data }: { data?: Array<{ name: string; count: number }> }) => (
    <div data-testid="treemap">
      {data?.map((item) => (
        <span key={item.name}>
          {item.name} {item.count}
        </span>
      ))}
    </div>
  ),
  XAxis: () => null,
  YAxis: () => null,
}));

beforeEach(() => {
  vi.clearAllMocks();

  mocks.useFilters.mockReturnValue({
    endDate: "2025-06-01T23:59:59.000Z",
    hub: undefined,
    minConfidence: 0,
    rangePreset: "custom",
    selectedTaxa: [],
    startDate: "2025-06-01T00:00:00.000Z",
    taxonomyLevel: "family",
    updateFilters: vi.fn(),
  });

  mocks.useEnvironmentTimeSeries.mockReturnValue({
    data: {
      humidity: [54, 55],
      interval_length: 1,
      interval_unit: "h",
      nox: [2, 3],
      pm1p0: [1, 2],
      pm2p5: [3, 4],
      pm4p0: [5, 6],
      pm10: [7, 8],
      start_time: new Date("2025-06-01T00:00:00.000Z"),
      temperature: [18, 19],
      voc: [10, 11],
    },
    error: null,
    isError: false,
    isLoading: false,
  });

  mocks.useObservationsTimeSeries.mockReturnValue({
    data: {
      counts: [0, 0, 0, 0, 0, 3],
      interval_length: 1,
      interval_unit: "h",
      start_time: new Date("2025-06-01T00:00:00.000Z"),
    },
    error: null,
    isError: false,
    isLoading: false,
  });

  mocks.useTaxaCount.mockReturnValue({
    data: {
      counts: [
        { count: 20, taxa: "Vespa" },
        { count: 10, taxa: "Chrysis" },
      ],
    },
    error: null,
    isError: false,
    isLoading: false,
  });
});

test("renders taxa treemap card with taxa data", async () => {
  const { getByText } = await renderWithRootProviders(<TaxaTreemapCard deploymentId="dep-123" />);

  await expect.element(getByText("Taxa treemap")).toBeInTheDocument();
  await expect.element(getByText("Detection count by selected taxonomy level")).toBeInTheDocument();
  await expect.element(getByText(/Vespa 20/)).toBeInTheDocument();
});

test("renders activity heatmap card with empty state", async () => {
  mocks.useObservationsTimeSeries.mockReturnValue({
    data: {
      counts: [],
      interval_length: 1,
      interval_unit: "h",
      start_time: new Date("2025-06-01T00:00:00.000Z"),
    },
    error: null,
    isError: false,
    isLoading: false,
  });

  const { getByText } = await renderWithRootProviders(
    <ActivityHeatmapCard deploymentId="dep-123" />,
  );

  await expect.element(getByText("Activity heatmap")).toBeInTheDocument();
  await expect.element(getByText("No data for selected filters")).toBeInTheDocument();
});

test("renders environmental conditions card controls", async () => {
  const { getByRole, getByText } = await renderWithRootProviders(
    <EnvironmentalConditionsCard deploymentId="dep-123" />,
  );

  await expect.element(getByText("Environmental conditions")).toBeInTheDocument();
  await expect.element(getByRole("button", { name: /Temperature/ })).toBeInTheDocument();
  await expect.element(getByRole("button", { name: /Humidity/ })).toBeInTheDocument();
});

test("renders air pollution card controls", async () => {
  const { getByRole, getByText } = await renderWithRootProviders(
    <AirPollutionCard deploymentId="dep-123" />,
  );

  await expect.element(getByText("Air pollution")).toBeInTheDocument();
  await expect.element(getByRole("button", { name: /PM1.0/ })).toBeInTheDocument();
  await expect.element(getByRole("button", { name: /PM2.5/ })).toBeInTheDocument();
});

test("renders air quality indices card controls", async () => {
  const { getByRole, getByText } = await renderWithRootProviders(
    <AirQualityIndicesCard deploymentId="dep-123" />,
  );

  await expect.element(getByText("Air quality indices")).toBeInTheDocument();
  await expect.element(getByRole("button", { name: /VOC Index/ })).toBeInTheDocument();
  await expect.element(getByRole("button", { name: /NOx Index/ })).toBeInTheDocument();
});
