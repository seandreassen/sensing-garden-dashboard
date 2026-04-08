import { PencilIcon, PlusIcon, Trash2Icon, XIcon, CheckIcon } from "lucide-react";
import { useRef, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import type { Location } from "@/lib/types/api";

interface Device {
  device_id: string;
  name: string;
  location?: Location;
}

function InlineField({
  value,
  onChange,
  placeholder,
  isDirty,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isDirty?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setIsEditing(false)}
        onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
        placeholder={placeholder}
        className="h-8 w-full border-none bg-accent px-2 text-sm outline-none"
      />
    );
  }

  return (
    <Button
      variant="ghost"
      className={`h-8 w-full justify-start text-sm ${isDirty ? "text-primary" : ""}`}
      onClick={() => setIsEditing(true)}
    >
      <span className="truncate">{value || placeholder}</span>
      <PencilIcon className="ml-auto h-3 w-3 shrink-0" />
    </Button>
  );
}

function NewDeviceRow({
  onConfirm,
  onCancel,
}: {
  onConfirm: (device: Device) => void;
  onCancel: () => void;
}) {
  const [deviceId, setDeviceId] = useState("");
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col gap-1 rounded border border-ring px-2 py-2">
      <input
        ref={inputRef}
        value={deviceId}
        onChange={(e) => setDeviceId(e.target.value)}
        placeholder="Device ID"
        className="h-8 w-full border-none bg-accent px-2 text-sm outline-none"
      />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onConfirm({ device_id: deviceId, name })}
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
          onClick={() => onConfirm({ device_id: deviceId, name })}
        >
          <CheckIcon className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function DeviceRow({
  device,
  initialDevice,
  onNameChange,
  onDelete,
}: {
  device: Device;
  initialDevice: Device;
  onNameChange: (name: string) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded border border-input px-2 py-1">
      <div className="flex min-w-0 flex-1 flex-col">
        <InlineField
          value={device.name}
          onChange={onNameChange}
          placeholder="Device name"
          isDirty={device.name !== initialDevice.name}
        />
        <span className="px-2 text-xs text-muted-foreground">{device.device_id}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="shrink-0 text-destructive hover:text-destructive"
      >
        <Trash2Icon className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

function EditDevicesCard({
  initialDevices = [],
  onChange,
}: {
  initialDevices?: Device[];
  onChange?: (devices: Device[]) => void;
}) {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [adding, setAdding] = useState(false);
  const isDirty = JSON.stringify(devices) !== JSON.stringify(initialDevices);

  function update(next: Device[]) {
    setDevices(next);
    onChange?.(next);
  }

  return (
    <Card>
      <div className="flex items-center justify-between px-4">
        <CardTitle className={isDirty ? "text-primary" : ""}>Devices</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setAdding(true)}>
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col gap-2 px-4">
        {devices.map((device, i) => (
          <DeviceRow
            key={device.device_id}
            device={device}
            initialDevice={initialDevices[i] ?? device}
            onNameChange={(name) => update(devices.map((d, j) => (j === i ? { ...d, name } : d)))}
            onDelete={() => update(devices.filter((_, j) => j !== i))}
          />
        ))}
        {adding && (
          <NewDeviceRow
            onConfirm={(device) => {
              update([...devices, device]);
              setAdding(false);
            }}
            onCancel={() => setAdding(false)}
          />
        )}
        {devices.length === 0 && !adding && (
          <p className="py-2 text-center text-sm text-muted-foreground">No devices yet</p>
        )}
      </div>
    </Card>
  );
}

export { EditDevicesCard };
export type { Device };
