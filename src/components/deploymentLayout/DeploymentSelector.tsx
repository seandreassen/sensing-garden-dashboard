import { useNavigate } from "@tanstack/react-router";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/Dropdown";
import { useDeployments } from "@/lib/hooks/useDeployments";
import { cn } from "@/lib/utils";

interface DeploymentSelectorProps {
  deploymentId: string;
}

function DeploymentSelector({ deploymentId }: DeploymentSelectorProps) {
  const { data: deployments } = useDeployments();
  const navigate = useNavigate();

  const activeDeployments =
    deployments?.filter((deployment) => !deployment.end_time || deployment.end_time > new Date()) ??
    [];

  const currentDeployment = activeDeployments.find((d) => d.deployment_id === deploymentId);

  return (
    <nav className="flex items-center border-b bg-background px-6 py-3">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-primary transition-colors hover:bg-primary/20">
          <span>{currentDeployment?.name ?? "Select deployment"}</span>

          <span className="text-xs opacity-70">▼</span>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64 p-1">
          {activeDeployments.map((deployment) => {
            const isActive = deployment.deployment_id === deploymentId;

            return (
              <DropdownMenuItem key={deployment.deployment_id}>
                <button
                  onClick={() =>
                    navigate({
                      to: "/deployment/$deploymentId/overview",
                      params: { deploymentId: deployment.deployment_id },
                    })
                  }
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  {deployment.name}
                  {isActive && <span className="text-xs opacity-80">✓</span>}
                </button>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}

export { DeploymentSelector };
