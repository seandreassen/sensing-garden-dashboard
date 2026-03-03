import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/deployment/$deploymentId/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/deployment/$deploymentId/edit"!</div>;
}
