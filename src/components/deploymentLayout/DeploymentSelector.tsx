import { useNavigate } from "@tanstack/react-router";
import { ChevronDownIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/Dropdown";
import { useDeployments } from "@/lib/hooks/useDeployments";
import { cn } from "@/lib/utils";
import { Route } from "@/routes/deployment/$deploymentId/_filterLayout";

function DeploymentSelector() {
  const { deploymentId } = Route.useParams();
  const { data: deployments } = useDeployments();
  const navigate = useNavigate();

  const activeDeployments =
    deployments?.filter((d) => !d.end_time || d.end_time > new Date()) ?? [];

  const currentDeployment = activeDeployments.find((d) => d.deployment_id === deploymentId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-sm text-primary hover:bg-primary/20">
        <span>{currentDeployment?.name ?? "Select deployment"}</span>
        <ChevronDownIcon className="size-3.5 opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2">
        <nav>
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
                    "flex w-full items-center justify-between rounded-md px-3 py-1.5 text-left text-sm transition-colors",
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
        </nav>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { DeploymentSelector };
