import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import { DeploymentCard } from "@/components/landingPage/DeploymentCard";
import type { Deployment } from "@/lib/types/api";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    className,
    params,
    to,
  }: {
    children?: React.ReactNode;
    className?: string;
    params?: { deploymentId: string };
    to: string;
  }) => (
    <a className={className} href={to.replace("$deploymentId", params?.deploymentId ?? "")}>
      {children}
    </a>
  ),
}));

function createDeployment(overrides: Partial<Deployment> = {}): Deployment {
  return {
    deployment_id: "dep-123",
    description: "Forest deployment",
    end_time: undefined,
    location_name: "Trondheim",
    name: "Forest garden",
    start_time: new Date("2025-06-01T00:00:00.000Z"),
    ...overrides,
  };
}

test("renders active deployment card details", async () => {
  const { getByText } = await render(<DeploymentCard deployment={createDeployment()} />);

  await expect.element(getByText("Forest garden")).toBeInTheDocument();
  await expect.element(getByText("Trondheim")).toBeInTheDocument();
  await expect.element(getByText("dep-123")).toBeInTheDocument();
  await expect.element(getByText("Active")).toBeInTheDocument();
});

test("renders inactive deployment card status", async () => {
  const { getByText } = await render(
    <DeploymentCard
      deployment={createDeployment({
        end_time: new Date("2025-01-01T00:00:00.000Z"),
        name: "Archived garden",
      })}
    />,
  );

  await expect.element(getByText("Archived garden")).toBeInTheDocument();
  await expect.element(getByText("Inactive")).toBeInTheDocument();
});
