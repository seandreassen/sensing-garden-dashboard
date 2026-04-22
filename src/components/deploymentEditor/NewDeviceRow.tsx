import { CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";

import { filterSelectClass } from "@/components/filters/filterStyles";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import type { DeploymentDevice } from "@/lib/types/api";

function NewDeviceRow({
  remainingDeviceIds,
  onConfirm,
  onCancel,
}: {
  remainingDeviceIds: string[];
  onConfirm: (device: DeploymentDevice) => void;
  onCancel: () => void;
}) {
  const [deviceId, setDeviceId] = useState<string>("");
  const [name, setName] = useState<string>("");

  return (
    <div className="flex flex-col gap-1 rounded border border-ring px-2 py-2">
      <Input
        value={deviceId}
        onChange={(e) => setDeviceId(e.target.value)}
        placeholder="Device ID"
        className="h-8 w-full border-none bg-accent px-2 text-sm outline-none"
      />
      <Select value={deviceId ?? ""} onValueChange={(value) => setDeviceId(value ?? "")}>
        <SelectTrigger id="device-selector" className={filterSelectClass}>
          <SelectValue placeholder="Choose a hub" />
        </SelectTrigger>
        <SelectContent>
          {remainingDeviceIds.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && deviceId && onConfirm({ device_id: deviceId, name })}
        placeholder="Name"
        className="h-8 w-full border-none bg-accent px-2 text-sm outline-none"
      />
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <XIcon className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deviceId && onConfirm({ device_id: deviceId, name })}
          disabled={!deviceId}
        >
          <CheckIcon className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

export { NewDeviceRow };
