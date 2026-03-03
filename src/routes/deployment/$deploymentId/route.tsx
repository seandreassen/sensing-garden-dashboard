import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/deployment/$deploymentId")({
  component: DeploymentLayout,
});

function DeploymentLayout() {
  return <Outlet />;
}
