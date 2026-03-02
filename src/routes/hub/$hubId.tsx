import { createFileRoute } from "@tanstack/react-router";

import { useHubIds } from "@/lib/hooks/useHubIds";

export const Route = createFileRoute("/hub/$hubId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { hubId } = Route.useParams();

  const { isLoading, isError } = useHubIds();

  return (
    <div>
      <p>Valgt enhet: {hubId}</p>
      {isLoading && <p>Laster...</p>}
      {isError && <p>Noe gikk galt</p>}
    </div>
  );
}
