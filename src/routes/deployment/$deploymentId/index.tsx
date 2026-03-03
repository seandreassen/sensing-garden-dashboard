import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/deployment/$deploymentId/")({
  component: DeploymentPage,
});

function DeploymentPage() {
  const { deploymentId } = Route.useParams();
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 p-6 pt-16">
      <h1 className="text-2xl font-semibold">Deployment: {deploymentId}</h1>
      <button
        className="text-sm text-white/60 underline underline-offset-4"
        onClick={() => navigate({ to: "/" })}
      >
        ← Back
      </button>
    </main>
  );
}
