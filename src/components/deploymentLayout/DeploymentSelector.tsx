import { useNavigate, Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { buttonVariants } from "@/components/ui/button-variants";
import { useCreateDeployment } from "@/lib/hooks/useDeploymentMutations";
import { useDeployments } from "@/lib/hooks/useDeployments";
import { cn } from "@/lib/utils";

interface DeploymentSelectorProps {
  deploymentId: string;
}

function DeploymentSelector({ deploymentId }: DeploymentSelectorProps) {
  const { data: deployments } = useDeployments();
  const navigate = useNavigate();
  const createDeployment = useCreateDeployment();

  const activeDeployments =
    deployments?.filter(
      (deployment) => !deployment.end_time || deployment.end_time > new Date(),
    ) ?? [];

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
    <nav className="flex items-center px-6">
      <ul className="mt-2 flex list-none">
        {activeDeployments.map((deployment) => (
          <li key={deployment.deployment_id} className="flex">
            <Link
              to="/deployment/$deploymentId/overview"
              params={{ deploymentId: deployment.deployment_id }}
              search={(prev) => ({ ...prev, hub: undefined })}
              activeOptions={{ exact: false }}
              className={cn(
                buttonVariants({ variant: "nav", size: "lg" }),
                "rounded-none text-sm uppercase",
                deployment.deployment_id === deploymentId &&
                  "border-b-2 border-primary! text-primary hover:text-primary",
              )}
            >
              {deployment.name ?? deployment.deployment_id}
            </Link>
          </li>
        ))}
      </ul>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCreate}
        disabled={createDeployment.isPending}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </nav>
  );
}
export { DeploymentSelector };
