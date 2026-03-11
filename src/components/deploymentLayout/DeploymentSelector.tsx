import { Link } from "@tanstack/react-router";

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
      <ul className="flex list-none px-6">
        {activeDeployments.map((deployment) => (
          <li key={deployment.id} className="flex">
            <Link
              to="/deployment/$deploymentId/overview"
              params={{ deploymentId: deployment.id }}
              search={(prev) => ({ ...prev, hub: undefined })}
              activeOptions={{ exact: false }}
              className={cn(
                "px-4 py-3 text-xs font-semibold tracking-wide uppercase transition-colors",
                deployment.id === deploymentId
                  ? "border-primary! border-b-2"
                  : "text-muted-foreground hover:text-foreground",
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
