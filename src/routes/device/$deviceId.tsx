import { createFileRoute } from "@tanstack/react-router";

import { useDeviceIds } from "@/lib/hooks/useDeviceIds";
// import { useClassifications } from "@/hooks/useClassifications";

export const Route = createFileRoute("/device/$deviceId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { deviceId } = Route.useParams();

  const { isLoading, isError } = useDeviceIds();

  return (
    <div>
      <p>Valgt enhet: {deviceId}</p>
      {isLoading && <p>Laster...</p>}
      {isError && <p>Noe gikk galt</p>}
    </div>
  );
}
