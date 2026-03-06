import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { useDeployments } from "@/lib/hooks/useDeployments";

export const Route = createFileRoute("/deployment/$deploymentId/")({
  component: DeploymentPage,
});

function DeploymentPage() {
  const navigate = useNavigate();
  const { deploymentId } = Route.useParams();
  const { data: deployments, isLoading } = useDeployments();

  const deployment = deployments?.find((d) => d.deploymentId === deploymentId);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!deployment) {
    return <div>Fant ikke deployment</div>;
  }

  const { modelId, name, location, startDate, active } = deployment;

  // evt derived:
  const deploymentDate = new Intl.DateTimeFormat("nb-NO", {
    dateStyle: "medium",
  }).format(new Date(startDate));

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 p-6 pt-16">
      <h1 className="text-2xl font-semibold">Deployment: {deploymentId}</h1>
      <h1>{name}</h1>
      <div className="grid w-full max-w-7xl grid-cols-1 gap-4 px-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-12 xl:grid-cols-4">
        <div />
      </div>
      <div>{modelId}</div>
      <div>{location}</div>
      <div>{deploymentDate}</div>
      <div>{active ? "Active" : "Inactive"}</div>
      <button
        className="text-sm text-white/60 underline underline-offset-4"
        onClick={() => navigate({ to: "/" })}
      >
        ← Back
      </button>
    </main>
  );
}
