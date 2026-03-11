import { createFileRoute } from "@tanstack/react-router";

import { AnalyticsData } from "@/components/analytics/AnalyticsData";

export const Route = createFileRoute("/deployment/$deploymentId/_filterLayout/analytics")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AnalyticsData />;
}
