import { CameraIcon } from "lucide-react";

import { TotalInsectCount } from "@/components/analysis/TotalInsectCount";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface TotalInsectCountCardProps {
  deploymentId: string;
}

function TotalInsectCountCard({ deploymentId }: TotalInsectCountCardProps) {
  return (
    <Card className="flex h-36 w-1/5 flex-col gap-3">
      <CardHeader className="flex flex-col gap-3">
        <CameraIcon className="size-5 text-primary" />
        <CardTitle className="text-sm text-muted-foreground uppercase">
          Total observations
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <TotalInsectCount deploymentId={deploymentId} />
      </CardContent>
    </Card>
  );
}

export { TotalInsectCountCard };
