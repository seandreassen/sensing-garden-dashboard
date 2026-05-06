import { renderWithRootProviders } from "@tests/render";
import type { ReactNode } from "react";
import { beforeEach, expect, test, vi } from "vitest";

import { ObservationsCard } from "@/components/overview/ObservationsCard";
import { SpeciesRichnessCard } from "@/components/overview/SpeciesRichnessCard";
import { TopTaxaCard } from "@/components/overview/TopTaxaCard";
import { TotalInsectCountCard } from "@/components/overview/TotalInsectCountCard";

const mocks = vi.hoisted(() => ({
  useFilters: vi.fn(),
  useObservationCount: vi.fn(),
  useObservationsTimeSeries: vi.fn(),
  useTaxaCount: vi.fn(),
}));

vi.mock("@/lib/hooks/useFilters", () => ({
  useFilters: mocks.useFilters,
}));

vi.mock("@/lib/hooks/useObservationCount", () => ({
  useObservationCount: mocks.useObservationCount,
}));

vi.mock("@/lib/hooks/useObservationsTimeSeries", () => ({
  useObservationsTimeSeries: mocks.useObservationsTimeSeries,
}));

vi.mock("@/lib/hooks/useTaxaCount", () => ({
  useTaxaCount: mocks.useTaxaCount,
}));

vi.mock("@/components/ui/Progress", () => ({
  Progress: ({ value }: { value?: number }) => (
    <div aria-valuenow={value ?? 0} role="progressbar" />
  ),
}));

vi.mock("@/components/ui/Separator", () => ({
  Separator: () => <div role="separator" />,
}));

vi.mock("recharts", () => ({
  Area: () => null,
  AreaChart: ({ children }: { children?: ReactNode }) => <svg>{children}</svg>,
  CartesianGrid: () => null,
  ResponsiveContainer: ({ children }: { children?: ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null,
}));

function mockDefaultFilters(taxonomyLevel: "family" | "genus" | "species" = "family") {
  mocks.useFilters.mockReturnValue({
    endDate: "2025-06-01T23:59:59.000Z",
    hub: undefined,
    minConfidence: 0,
    rangePreset: "custom",
    selectedTaxa: [],
    startDate: "2025-06-01T00:00:00.000Z",
    taxonomyLevel,
    updateFilters: vi.fn(),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mockDefaultFilters();

  mocks.useObservationCount.mockReturnValue({
    data: { count: 100 },
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

test("renders observations card with chart data", async () => {
  const { getByText } = await renderWithRootProviders(<ObservationsCard deploymentId="dep-123" />);

  await expect.element(getByText("Insect detections over time")).toBeInTheDocument();
  await expect
    .element(getByText("Daily detection count over the selected period"))
    .toBeInTheDocument();
});

test("renders top taxa card using selected taxonomy level", async () => {
  mockDefaultFilters("genus");

  const { getByText } = await renderWithRootProviders(<TopTaxaCard deploymentId="dep-123" />);

  await expect.element(getByText("Top genera")).toBeInTheDocument();
  await expect.element(getByText("Vespa")).toBeInTheDocument();
  await expect.element(getByText("(20.0%)")).toBeInTheDocument();
});

test("renders species richness card using selected taxonomy level", async () => {
  mockDefaultFilters("species");

  const { getByText } = await renderWithRootProviders(
    <SpeciesRichnessCard deploymentId="dep-123" />,
  );

  await expect.element(getByText("Unique species")).toBeInTheDocument();
  await expect.element(getByText("2")).toBeInTheDocument();
});

test("renders total observations card with observation count", async () => {
  const { getByText } = await renderWithRootProviders(
    <TotalInsectCountCard deploymentId="dep-123" />,
  );

  await expect.element(getByText("Total observations")).toBeInTheDocument();
  await expect.element(getByText("100")).toBeInTheDocument();
});
