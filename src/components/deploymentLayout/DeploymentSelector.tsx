import { Link } from "@tanstack/react-router";

import { buttonVariants } from "@/components/ui/button-variants";
import { useDeployments } from "@/lib/hooks/useDeployments";
import { cn } from "@/lib/utils";

interface DeploymentSelectorProps {
  deploymentId: string;
}

function DeploymentSelector({ deploymentId }: DeploymentSelectorProps) {
  const { data: deployments } = useDeployments();

  const activeDeployments =
    deployments?.deployments.filter(
      (deployment) => !deployment.end_time || deployment.end_time > new Date(),
    ) ?? [];

  return (
    <nav>
      <ul className="mt-2 flex list-none px-6">
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
              {deployment.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
export { DeploymentSelector };
