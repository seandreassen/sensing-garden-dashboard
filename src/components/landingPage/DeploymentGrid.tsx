import { DeploymentCard } from "@/components/landingPage/DeploymentCard";
import type { Deployment } from "@/lib/types/api";

interface DeploymentGridProps {
  deployments: Deployment[];
}

function DeploymentGrid({ deployments }: DeploymentGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {deployments.map((deployment) => (
        <DeploymentCard key={deployment.deployment_id} deployment={deployment} />
      ))}
    </div>
  );
}

export { DeploymentGrid };
