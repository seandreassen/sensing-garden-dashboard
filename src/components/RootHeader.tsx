import { useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

import { Logo } from "@/components/landingPage/Logo";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { useCreateDeployment } from "@/lib/hooks/useDeploymentMutations";

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
      <div className="flex items-center justify-between gap-8 px-6 py-4 pr-20 pl-20">
        <div className="flex items-center gap-5">
          <Logo />
          <Separator orientation="vertical" />
          <p className="text-xs font-bold tracking-widest uppercase">Sensing Garden</p>
        </div>

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
  );
}

export { Header };
