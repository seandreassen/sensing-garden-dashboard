import { Card, CardContent } from "@/components/ui/Card";
import { useObservations } from "@/lib/hooks/useObservations";
import { cn } from "@/lib/utils";

type DeviceRowProps = { device_id: string; name?: string };

function DeviceRow({ device_id, name }: DeviceRowProps) {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data } = useObservations({
    device_id: [device_id],
    start_time: oneWeekAgo,
    limit: 1,
  });

  const isActive = (data?.count ?? 0) > 0;

  return (
    <Card className="px-3 py-2">
      <CardContent className="flex items-center justify-start gap-2 p-0">
        <span className="truncate text-sm font-medium">{name ?? device_id}</span>
        <span
          className={cn("size-2 shrink-0 rounded-full", isActive ? "bg-success" : "bg-destructive")}
        />
        <span className="text-sm text-muted-foreground">{isActive ? "Active" : "Inactive"}</span>
      </CardContent>
    </Card>
  );
}

export { DeviceRow };
