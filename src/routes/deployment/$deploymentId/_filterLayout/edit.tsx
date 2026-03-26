import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/deployment/$deploymentId/_filterLayout/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/deployment/$deploymentId/_filterLayout/edit"!</div>;
}
