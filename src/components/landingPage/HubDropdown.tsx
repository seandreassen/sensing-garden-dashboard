import { useNavigate, useParams } from "@tanstack/react-router";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useHubs } from "@/lib/hooks/useHubs";

function HubDropdown() {
  const { data: hubs, isLoading } = useHubs();
  const navigate = useNavigate();
  const params = useParams({ from: "/hub/$hubId", shouldThrow: false });
  const hubId = params?.hubId;

  const handleHubChange = (selectedHubId: string | null) => {
    if (!selectedHubId) {
      return;
    }
    navigate({
      to: "/hub/$hubId",
      params: { hubId: selectedHubId },
    });
  };

  return (
    <Select onValueChange={handleHubChange} disabled={isLoading} value={hubId || ""}>
      <SelectTrigger className="w-full max-w-64">
        <SelectValue placeholder={isLoading ? "Loading..." : "Choose hub"} />
      </SelectTrigger>
      <SelectContent
        alignItemWithTrigger={false}
        align="start"
        className="max-h-60 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <SelectGroup>
          <SelectLabel>Choose hub</SelectLabel>
          {hubs?.map((hub) => (
            <SelectItem key={hub.device_id} value={hub.device_id}>
              {hub.device_id}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export { HubDropdown };
