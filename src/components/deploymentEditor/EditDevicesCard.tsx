import { PencilIcon, PlusIcon, Trash2Icon, XIcon, CheckIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import type { Location } from "@/lib/types/api";

interface Device {
  device_id: string;
  name: string;
  location?: Location;
}

interface EditingDevice {
  device_id: string;
  name: string;
  location?: Location;
  isNew: boolean;
}

const inputClass =
  "w-full rounded border border-input bg-background px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-ring";

function DeviceRow({
  device,
  onEdit,
  onDelete,
}: {
  device: Device;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded border border-input px-3 py-2">
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium">{device.name || "(unnamed)"}</span>
        <span className="truncate text-xs text-muted-foreground">{device.device_id}</span>
      </div>
      <Button variant="ghost" size="icon" onClick={onEdit} className="shrink-0">
        <PencilIcon className="h-3.5 w-3.5" />
      </Button>
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

function DeviceEditor({
  editing,
  onChange,
  onConfirm,
  onCancel,
}: {
  editing: EditingDevice;
  onChange: (updated: EditingDevice) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded border border-ring px-3 py-2">
      {editing.isNew && (
        <div className="flex flex-col gap-1">
          <label htmlFor="device-id" className="text-xs text-muted-foreground">
            Device ID
          </label>
          <input
            id="device-id"
            className={inputClass}
            value={editing.device_id}
            onChange={(e) => onChange({ ...editing, device_id: e.target.value })}
            placeholder="device-id"
          />
        </div>
      )}
      {!editing.isNew && <span className="text-xs text-muted-foreground">{editing.device_id}</span>}
      <div className="flex flex-col gap-1">
        <label htmlFor="device-name" className="text-xs text-muted-foreground">
          Name
        </label>
        <input
          id="device-name"
          className={inputClass}
          value={editing.name}
          onChange={(e) => onChange({ ...editing, name: e.target.value })}
          placeholder="Device name"
        />
      </div>
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <XIcon className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onConfirm}>
          <CheckIcon className="h-3.5 w-3.5" />
        </Button>
      </div>
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
  const [editing, setEditing] = useState<(EditingDevice & { index: number }) | null>(null);
  const isDirty = JSON.stringify(devices) !== JSON.stringify(initialDevices);

  function update(next: Device[]) {
    setDevices(next);
    onChange?.(next);
  }

  function startAdd() {
    setEditing({ index: -1, device_id: "", name: "", isNew: true });
  }

  function startEdit(index: number) {
    const d = devices[index];
    setEditing({ index, device_id: d.device_id, name: d.name, location: d.location, isNew: false });
  }

  function confirmEdit() {
    if (!editing) {
      return;
    }
    if (editing.index === -1) {
      update([
        ...devices,
        { device_id: editing.device_id, name: editing.name, location: editing.location },
      ]);
    } else {
      update(
        devices.map((d, i) =>
          i === editing.index
            ? { device_id: d.device_id, name: editing.name, location: editing.location }
            : d,
        ),
      );
    }
    setEditing(null);
  }

  function deleteDevice(index: number) {
    update(devices.filter((_, i) => i !== index));
  }

  return (
    <Card>
      <div className="flex items-center justify-between px-4">
        <CardTitle className={isDirty ? "text-primary" : ""}>Devices</CardTitle>
        <Button variant="ghost" size="icon" onClick={startAdd}>
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col gap-2 px-4">
        {devices.map((device, i) =>
          editing?.index === i ? (
            <DeviceEditor
              key={device.device_id}
              editing={editing}
              onChange={(updated) => setEditing({ ...updated, index: i })}
              onConfirm={confirmEdit}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <DeviceRow
              key={device.device_id}
              device={device}
              onEdit={() => startEdit(i)}
              onDelete={() => deleteDevice(i)}
            />
          ),
        )}
        {editing?.index === -1 && (
          <DeviceEditor
            editing={editing}
            onChange={(updated) => setEditing({ ...updated, index: -1 })}
            onConfirm={confirmEdit}
            onCancel={() => setEditing(null)}
          />
        )}
        {devices.length === 0 && editing === null && (
          <p className="py-2 text-center text-sm text-muted-foreground">No devices yet</p>
        )}
      </div>
    </Card>
  );
}

export { EditDevicesCard };
export type { Device };
