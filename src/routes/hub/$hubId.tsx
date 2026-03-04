import { createFileRoute } from "@tanstack/react-router";

import { useHubs } from "@/lib/hooks/useHubs";

export const Route = createFileRoute("/hub/$hubId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { hubId } = Route.useParams();

  const { isLoading, isError } = useHubs();

  return (
    <div>
      <p>Valgt enhet: {hubId}</p>
      {isLoading && <p>Laster...</p>}
      {isError && <p>Noe gikk galt</p>}
    </div>
  );
}
