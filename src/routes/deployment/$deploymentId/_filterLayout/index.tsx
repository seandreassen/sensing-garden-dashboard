import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/deployment/$deploymentId/_filterLayout/")({
  beforeLoad: ({ params }) => {
    throw Route.redirect({
      to: "/deployment/$deploymentId/overview",
      params,
    });
  },
});
