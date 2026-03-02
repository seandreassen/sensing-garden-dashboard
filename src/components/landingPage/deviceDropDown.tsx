import { useMatch, useNavigate } from "@tanstack/react-router";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useDeviceIds } from "@/lib/hooks/useDeviceIds";

export function DeviceDropdown() {
  const { data: deviceIds, isLoading } = useDeviceIds();
  const navigate = useNavigate();
  const match = useMatch({ from: "/device/$deviceId", shouldThrow: false });
  const deviceId = match?.params.deviceId;

  const handleDeviceChange = (selectedDeviceId: string | null) => {
    if (!selectedDeviceId) {
      return;
    }
    navigate({
      to: "/device/$deviceId",
      params: { deviceId: selectedDeviceId },
    });
  };

  return (
    <Select onValueChange={handleDeviceChange} disabled={isLoading} value={deviceId || ""}>
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
          {deviceIds?.map((id) => (
            <SelectItem key={id} value={id}>
              {id}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
