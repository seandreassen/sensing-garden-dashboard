import { createFileRoute } from "@tanstack/react-router";

import { DeploymentCard } from "@/components/landingPage/DeploymentCard";
import { DeviceDropdown } from "@/components/landingPage/deviceDropDown";
import { useDeployments } from "@/lib/hooks/useDeployments";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: deployments, isLoading } = useDeployments();

  const activeDeployments = deployments?.filter((d) => d.active) ?? [];
  const inactiveDeployments = deployments?.filter((d) => !d.active) ?? [];

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 p-6 pt-16">
      <DeviceDropdown />
      {isLoading ? (
        <span className="text-white/40">Loading deployments...</span>
      ) : (
        <>
          <div className="grid w-full max-w-7xl grid-cols-1 gap-4 px-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-12 xl:grid-cols-4">
            {activeDeployments.map(({ deploymentId, active }) => (
              <DeploymentCard key={deploymentId} deploymentId={deploymentId} active={active} />
            ))}
          </div>
          <div className="w-full max-w-7xl px-6 lg:px-12">
            <div className="h-px w-full bg-white/20" />
          </div>
          <div className="grid w-full max-w-7xl grid-cols-1 gap-4 px-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-12 xl:grid-cols-4">
            <span className="col-span-4 underline underline-offset-4">Inactive Deployments</span>
            {inactiveDeployments.map(({ deploymentId, active }) => (
              <DeploymentCard key={deploymentId} deploymentId={deploymentId} active={active} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
