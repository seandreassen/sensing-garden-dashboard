import { renderWithRootProviders } from "@tests/render";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { beforeEach, expect, test, vi } from "vitest";

import { DeploymentInfoCard } from "@/components/info/DeploymentInfoCard";

const mocks = vi.hoisted(() => ({
  useDeployment: vi.fn(),
  useObservations: vi.fn(),
  useParams: vi.fn(),
}));

vi.mock("@/routes/deployment/$deploymentId/_filterLayout", () => ({
  Route: {
    useParams: mocks.useParams,
  },
}));

vi.mock("@/lib/hooks/useDeployment", () => ({
  useDeployment: mocks.useDeployment,
}));

vi.mock("@/lib/hooks/useObservations", () => ({
  useObservations: mocks.useObservations,
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

beforeEach(() => {
  vi.clearAllMocks();

  mocks.useParams.mockReturnValue({ deploymentId: "dep-123" });
  mocks.useObservations.mockReturnValue({
    data: { count: 1, items: [] },
    error: null,
    isError: false,
    isLoading: false,
  });
  mocks.useDeployment.mockReturnValue({
    data: {
      deployment: {
        deployment_id: "dep-123",
        description: "A deployment used for testing insect observations.",
        name: "Forest garden",
        start_time: new Date("2025-06-01T00:00:00.000Z"),
      },
      devices: [{ deployment_id: "dep-123", device_id: "hub-1", name: "North hub" }],
    },
    error: null,
    isError: false,
    isLoading: false,
  });
});

test("renders deployment info with connected hubs", async () => {
  const { getByText } = await renderWithRootProviders(<DeploymentInfoCard />);

  await expect.element(getByText("Deployment Information for: Forest garden")).toBeInTheDocument();
  await expect
    .element(getByText("A deployment used for testing insect observations."))
    .toBeInTheDocument();
  await expect.element(getByText("Connected hubs")).toBeInTheDocument();
  await expect.element(getByText("North hub")).toBeInTheDocument();
  await expect.element(getByText("Active")).toBeInTheDocument();
});

test("renders deployment info empty devices state", async () => {
  mocks.useDeployment.mockReturnValue({
    data: {
      deployment: {
        deployment_id: "dep-123",
        description: "",
        name: "Forest garden",
        start_time: new Date("2025-06-01T00:00:00.000Z"),
      },
      devices: [],
    },
    error: null,
    isError: false,
    isLoading: false,
  });

  const { getByText } = await renderWithRootProviders(<DeploymentInfoCard />);

  await expect.element(getByText("This deployment has no description")).toBeInTheDocument();
  await expect.element(getByText("This deployment has no connected hubs")).toBeInTheDocument();
});

test("renders deployment info loading state", async () => {
  mocks.useDeployment.mockReturnValue({
    data: undefined,
    error: null,
    isError: false,
    isLoading: true,
  });

  const { getByText } = await renderWithRootProviders(<DeploymentInfoCard />);

  await expect.element(getByText("Loading...")).toBeInTheDocument();
});

test("renders deployment info error state", async () => {
  mocks.useDeployment.mockReturnValue({
    data: undefined,
    error: new Error("Could not load deployment"),
    isError: true,
    isLoading: false,
  });

  const { getByText } = await renderWithRootProviders(<DeploymentInfoCard />);

  await expect.element(getByText("Error: Could not load deployment")).toBeInTheDocument();
});
