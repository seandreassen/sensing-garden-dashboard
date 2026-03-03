import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import type { Deployment } from "@/lib/types/api";

function StatusIndicator({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-green-500" : "bg-red-500"}`} />
      <span className={`text-sm font-medium ${active ? "text-green-600" : "text-red-600"}`}>
        {active ? "Active" : "Inactive"}
      </span>
    </div>
  );
}

function DeploymentCard({ active, deploymentId, location, date, name }: Deployment) {
  const navigate = useNavigate();
  const deploymentDate =
    date instanceof Date
      ? new Intl.DateTimeFormat("nb-NO", { dateStyle: "medium" }).format(date)
      : String(date);
  const handleCardClicked = () => {
    navigate({ to: "/deployment/$deploymentId", params: { deploymentId } });
  };

  return (
    <Card
      size="sm"
      className="relative mx-auto w-full max-w-xs cursor-pointer rounded-sm"
      onClick={handleCardClicked}
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <div className="absolute top-3 right-3">
          <StatusIndicator active={active} />
        </div>
        <CardDescription>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat quaerat dolorem
          quibusdam officia cum harum animi repellendus accusantium perferendis natus sequi pariatur
          consequuntur explicabo, deleniti dolorum velit adipisci praesentium aspernatur!
        </CardDescription>
      </CardHeader>
      <CardContent>Start Date : {deploymentDate}</CardContent>
      <CardContent>Location : {location}</CardContent>
      <CardContent>Deployment ({active ? "Active" : "Inactive"})</CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation(); // hindrer at card-navigasjon trigges
            navigate({
              to: "/deployment/$deploymentId/edit",
              params: { deploymentId },
            });
          }}
        >
          Edit deployment
        </Button>
      </CardFooter>
    </Card>
  );
}

export { DeploymentCard };
