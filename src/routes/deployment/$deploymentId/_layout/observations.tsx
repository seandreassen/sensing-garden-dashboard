import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/deployment/$deploymentId/_layout/observations")({
  component: RouteComponent,
});

function RouteComponent() {
  return <p>Observations content goes here</p>;
}
