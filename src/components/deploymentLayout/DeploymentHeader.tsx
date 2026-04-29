import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";

import { DeploymentSelector } from "@/components/deploymentLayout/DeploymentSelector";
import { Logo } from "@/components/landingPage/Logo";
import { Button } from "@/components/ui/Button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Separator } from "@/components/ui/Separator";
import { useCreateDeployment } from "@/lib/hooks/useDeploymentMutations";
import { cn } from "@/lib/utils";

function Header() {
  const navigate = useNavigate();
  const createDeployment = useCreateDeployment();

  function handleCreate() {
    createDeployment.mutate(
      { name: "New Deployment", description: "New deployment" },
      {
        onSuccess: (deployment) => {
          void navigate({
            to: "/deployment/$deploymentId/edit",
            params: { deploymentId: deployment.deployment_id },
          });
        },
      },
    );
  }

  return (
    <div className="sticky top-0 z-50 border-b bg-card backdrop-blur-lg">
      <div className="flex items-center gap-8 px-6 py-4 pr-20">
        <div className="flex items-center gap-5">
          <Link to="/">
            <Logo />
          </Link>

          <Separator orientation="vertical" />

          <div className="flex flex-col items-start leading-tight font-bold uppercase">
            <p className="text-[10px] tracking-widest text-primary">Sensing Garden</p>
            <p className="text-[8px] text-muted-foreground">Deployment Monitor</p>
          </div>
        </div>

        <Separator orientation="vertical" />

        <div className="flex items-center gap-10">
          <Link to="/" className={cn(buttonVariants({ variant: "nav", size: "none" }), "gap-1.5")}>
            <ArrowLeftIcon className="size-4" />
            Deployment overview
          </Link>
          <DeploymentSelector />
        </div>

        <div className="ml-auto">
          <Button
            onClick={handleCreate}
            disabled={createDeployment.isPending}
            className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-primary transition-colors hover:bg-primary/20"
          >
            <PlusIcon className="h-4 w-4" />
            Create deployment
          </Button>
        </div>
      </div>
    </div>
  );
}

export { Header };
