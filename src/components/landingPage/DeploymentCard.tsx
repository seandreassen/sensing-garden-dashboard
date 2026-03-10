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

function DeploymentCard({ active, id }: Deployment) {
  const navigate = useNavigate();
  const featureName = "Deployment Name";

  const handleCardClicked = () => {
    navigate({ to: "/deployment/$deploymentId", params: { deploymentId: id } });
  };

  return (
    <Card
      size="sm"
      className="mx-auto w-full max-w-xs cursor-pointer rounded-sm"
      onClick={handleCardClicked} // ← riktig navn
    >
      <CardHeader>
        <CardTitle>{featureName}</CardTitle>
        <CardDescription>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat quaerat dolorem
          quibusdam officia cum harum animi repellendus accusantium perferendis natus sequi pariatur
          consequuntur explicabo, deleniti dolorum velit adipisci praesentium aspernatur!
        </CardDescription>
      </CardHeader>
      <CardContent>Deployment ({active ? "Active" : "Inactive"})</CardContent>
      <CardFooter className="flex-col gap-2">
        <Button size="sm" className="w-full">
          Edit deployment
        </Button>
      </CardFooter>
    </Card>
  );
}

export { DeploymentCard };
