import { Spinner } from "@/components/ui/Spinner";
import { useDeployment } from "@/lib/hooks/useDeployment";

interface HubsCountProps {
  deploymentId: string;
}

function HubsCount({ deploymentId }: HubsCountProps) {
  const { data, isError, isLoading, error } = useDeployment({
    deployment_id: deploymentId,
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Error: {error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-sm text-muted-foreground">No data for selected filters</span>
      </div>
    );
  }

  return <span className="mt-2 text-4xl font-semibold">{data.devices.length}</span>;
}

export { HubsCount };
