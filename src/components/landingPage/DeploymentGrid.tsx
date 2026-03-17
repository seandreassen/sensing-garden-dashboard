import { DeploymentCard } from "@/components/landingPage/DeploymentCard";
import type { Deployment } from "@/lib/types/api";

interface DeploymentGridProps {
  deployments: Deployment[];
}

function DeploymentGrid({ deployments }: DeploymentGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {deployments.map((deployment) => (
        <DeploymentCard
          key={deployment.id}
          id={deployment.id}
          active={deployment.active}
          name={deployment.name}
          location={deployment.location}
          hub_count={deployment.hub_count}
          last_updated={deployment.last_updated}
        />
      ))}
    </div>
  );
}

export { DeploymentGrid };
