import { useNavigate } from "@tanstack/react-router";
import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/Button";
import type { Deployment } from "@/lib/types/api";
import { cn } from "@/lib/utils";

function DeploymentCard({ active, id, name, place, hub_count, last_updated }: Deployment) {
  const navigate = useNavigate();

  const handleCardClicked = () => {
    navigate({ to: "/deployment/$deploymentId", params: { deploymentId: id } });
  };

  const handleEditClicked = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate({ to: "/deployment/$deploymentId", params: { deploymentId: id } });
  };

  return (
    <button
      type="button"
      className="flex h-52 w-full cursor-pointer flex-col rounded-sm border border-white/10 bg-neutral-900 px-5 py-4 text-left transition-colors hover:border-green-700 hover:shadow-[0_0_0_1px_var(--color-green-700)]"
      onClick={handleCardClicked}
    >
      {/* Header: Title + Status badge */}
      <div className="mb-1 flex items-center justify-between gap-2">
        <h3 className="truncate text-base font-bold text-card-foreground">{name ?? id}</h3>
        <span
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded border px-2.5 py-1 text-xs font-semibold uppercase",
            active
              ? "border-green-700 bg-green-950/50 text-green-400"
              : "border-red-700 bg-red-950/50 text-red-400",
          )}
        >
          <span
            className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-green-400" : "bg-red-400")}
          />
          {active ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Location */}
      <div className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{place ?? "—"}</span>
      </div>

      {/* Divider */}
      <hr className="mb-3 border-white/10" />

      {/* ID badge + hub count */}
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 rounded border border-white/15 px-2 py-1 text-xs text-muted-foreground">
          <span className="font-medium text-muted-foreground/50">ID</span>
          {id}
        </span>
        {hub_count !== undefined && (
          <span className="text-sm text-muted-foreground">{hub_count} hubs</span>
        )}
      </div>

      {/* Last updated */}
      <p className="mb-3 text-sm text-muted-foreground">
        {last_updated ? `Last updated: ${last_updated}` : ""}
      </p>

      {/* Edit button — always at bottom */}
      <div className="mt-auto">
        <Button size="sm" className="w-full" onClick={handleEditClicked}>
          Edit deployment
        </Button>
      </div>
    </button>
  );
}

export { DeploymentCard };
