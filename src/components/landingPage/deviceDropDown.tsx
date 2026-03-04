import { useNavigate } from "@tanstack/react-router";

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
