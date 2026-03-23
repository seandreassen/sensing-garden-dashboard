import { createFileRoute } from "@tanstack/react-router";

import { DeploymentGrid } from "@/components/landingPage/DeploymentGrid";
import { HeroCarousel } from "@/components/landingPage/HeroCarousel";
import { Header } from "@/components/layout/RootHeader";
import { Separator } from "@/components/ui/Separator";
import { Spinner } from "@/components/ui/Spinner";
import { useDeployments } from "@/lib/hooks/useDeployments";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: deployments, isLoading } = useDeployments();

  const activeDeployments = deployments?.filter((d) => d.active) ?? [];
  const inactiveDeployments = deployments?.filter((d) => !d.active) ?? [];

  return (
    <>
      <Header />
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Spinner className="size-8" />
        </div>
      ) : (
        <div className="flex w-full flex-col">
          <HeroCarousel />
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
            <DeploymentGrid deployments={activeDeployments} />
            <Separator />
            <div className="flex flex-col gap-2">
              <p className="ml-8">Inactive Deployments</p>
              <DeploymentGrid deployments={inactiveDeployments} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
