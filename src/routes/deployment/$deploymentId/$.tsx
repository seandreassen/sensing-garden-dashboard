import { createFileRoute } from "@tanstack/react-router";

import { NotFound } from "@/components/NotFound";

// Stops invalid urls starting with /deployment/$deploymentId/ from rendering layout component instead of not found page
export const Route = createFileRoute("/deployment/$deploymentId/$")({
  component: NotFound,
});
