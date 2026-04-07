import { createFileRoute } from "@tanstack/react-router";

import { DeploymentGrid } from "@/components/landingPage/DeploymentGrid";
import { HeroCarousel } from "@/components/landingPage/HeroCarousel";
import { Header } from "@/components/RootHeader";
import { Separator } from "@/components/ui/Separator";
import { Spinner } from "@/components/ui/Spinner";
import { useDeployments } from "@/lib/hooks/useDeployments";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading } = useDeployments();

  const now = new Date();
  const activeDeployments =
    data?.deployments?.filter((deployment) => !deployment.end_time || deployment.end_time > now) ??
    [];
  const inactiveDeployments =
    data?.deployments?.filter((deployment) => deployment.end_time && deployment.end_time < now) ??
    [];

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
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-8">
            <div className="flex flex-col gap-2">
              <h2 className="ml-8 text-2xl uppercase">Active deployments</h2>
              <Separator className="mb-4" />
              <DeploymentGrid deployments={activeDeployments} />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="ml-8 text-2xl uppercase">Inactive deployments</h2>
              <Separator className="mb-4" />
              <DeploymentGrid deployments={inactiveDeployments} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
