import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/deployment/$deploymentId/_filterLayout/info")({
  head: () => ({
    meta: [{ title: "Info | Sensing Garden Dashboard" }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <div>This page is not finished yet</div>;
}
