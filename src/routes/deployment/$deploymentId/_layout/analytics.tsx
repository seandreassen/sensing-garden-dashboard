import { createFileRoute } from "@tanstack/react-router";

import { AnalyticsData } from "@/components/analytics/AnalyticsData";

export const Route = createFileRoute("/deployment/$deploymentId/_layout/analytics")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AnalyticsData />;
}
