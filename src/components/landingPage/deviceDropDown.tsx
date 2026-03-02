import { useNavigate } from "@tanstack/react-router";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useDeviceIds } from "@/lib/hooks/useDeviceIds";
import type { DeviceIdProps } from "@/lib/types/api";

export function DeviceDropdown({ value }: DeviceIdProps) {
  const { data: deviceIds, isLoading } = useDeviceIds();
  const navigate = useNavigate();

  const handleDeviceChange = (deviceId: string | null) => {
    if (deviceId) {
      navigate({ to: "/device/$deviceId", params: { deviceId } });
    }
  };

  return (
    <Select onValueChange={handleDeviceChange} disabled={isLoading} value={value}>
      <SelectTrigger className="w-1/2">
        <SelectValue placeholder={isLoading ? "Loading..." : "Choose hub"} />
      </SelectTrigger>
      <SelectContent className="max-h-60 overflow-y-auto">
        {deviceIds?.map((id) => (
          <SelectItem key={id} value={id}>
            {id}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
