import { Link } from "@tanstack/react-router";

import { buttonVariants } from "@/components/ui/button-variants";
import { useDeployments } from "@/lib/hooks/useDeployments";
import { cn } from "@/lib/utils";

interface DeploymentSelectorProps {
  deploymentId: string;
}

function DeploymentSelector({ deploymentId }: DeploymentSelectorProps) {
  const { data: deployments } = useDeployments();

  const activeDeployments = deployments?.filter((d) => d.active) ?? [];

  return (
    <nav>
      <ul className="mt-2 flex list-none px-6">
        {activeDeployments.map((deployment) => (
          <li key={deployment.id} className="flex">
            <Link
              to="/deployment/$deploymentId/overview"
              params={{ deploymentId: deployment.id }}
              search={(prev) => ({ ...prev, hub: undefined })}
              activeOptions={{ exact: false }}
              className={cn(
                buttonVariants({ variant: "nav", size: "lg" }),
                "text-sm uppercase rounded-none",
                deployment.id === deploymentId &&
                  "text-primary hover:text-primary border-primary! border-b-2",
              )}
            >
              {deployment.id}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
export { DeploymentSelector };
