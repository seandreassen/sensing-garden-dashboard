import { renderWithRootProviders } from "@tests/render";
import type { ReactNode } from "react";
import { beforeEach, expect, test, vi } from "vitest";

import { TaxaTreemapCard } from "@/components/analytics/TaxaTreemapCard";

const mocks = vi.hoisted(() => ({
  useFilters: vi.fn(),
  useTaxaCount: vi.fn(),
}));

vi.mock("@/lib/hooks/useFilters", () => ({
  useFilters: mocks.useFilters,
}));

vi.mock("@/lib/hooks/useTaxaCount", () => ({
  useTaxaCount: mocks.useTaxaCount,
}));

vi.mock("recharts", () => ({
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

  mocks.useTaxaCount.mockReturnValue({
    data: {
      counts: [
        { count: 20, taxa: "Vespa" },
        { count: 10, taxa: "Chrysis" },
      ],
    },
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

test("renders taxa treemap error state", async () => {
  mocks.useTaxaCount.mockReturnValue({
    data: undefined,
    isError: true,
    isLoading: false,
  });

  const { getByText } = await renderWithRootProviders(<TaxaTreemapCard deploymentId="dep-123" />);

  await expect.element(getByText("Error loading taxonomy data.")).toBeInTheDocument();
});
