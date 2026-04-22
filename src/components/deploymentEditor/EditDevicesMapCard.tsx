import { APIProvider } from "@vis.gl/react-google-maps";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { DeviceField } from "@/components/deploymentEditor/DeviceField";
import { NewDeviceRow } from "@/components/deploymentEditor/NewDeviceRow";
import { MapWithDrop } from "@/components/map/MapWithDrop";
import { PinIcon } from "@/components/map/PinIcon";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { env } from "@/env";
import type { Location, DeploymentDevice } from "@/lib/types/api";

const dragImage = new Image();
dragImage.src =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg width="28" height="40" viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 40 14 40C14 40 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#EA4335"/>
      <circle cx="14" cy="14" r="6" fill="white"/>
    </svg>`,
  );

function EditDevicesMapCard({
  initialDevices = [],
  onChange,
}: {
  initialDevices?: DeploymentDevice[];
  onChange?: (devices: DeploymentDevice[]) => void;
}) {
  const [devices, setDevices] = useState<DeploymentDevice[]>(initialDevices);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setDevices(initialDevices);
  }, [initialDevices]);
  const draggingIndex = useRef<number | null>(null);
  const isDirty = JSON.stringify(devices) !== JSON.stringify(initialDevices);

  function update(next: DeploymentDevice[]) {
    setDevices(next);
    onChange?.(next);
  }

  const located = devices.filter(
    (d): d is DeploymentDevice & { location: Location } => d.location !== undefined,
  );

  function handleDropLocation(location: Location) {
    const index = draggingIndex.current;
    if (index === null) {
      return;
    }
    update(devices.map((d, i) => (i === index ? { ...d, location } : d)));
    draggingIndex.current = null;
  }

  function handleSetLocations(updater: React.SetStateAction<Location[]>) {
    const currentLocs = located.map((d) => d.location);
    const nextLocs = typeof updater === "function" ? updater(currentLocs) : updater;
    update(
      devices.map((d) => {
        const locIndex = located.findIndex((l) => l.device_id === d.device_id);
        if (locIndex === -1) {
          return d;
        }
        return { ...d, location: nextLocs[locIndex] };
      }),
    );
  }

  return (
    <Card className="flex-1">
      <div className="flex items-center justify-between px-4">
        <CardTitle className={isDirty ? "text-primary" : ""}>Devices</CardTitle>
        <Button variant="outline" size="icon" onClick={() => setAdding(true)}>
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col gap-2 px-4 pb-4">
        <div className="flex h-48 flex-col gap-2 overflow-y-auto">
          {adding && (
            <NewDeviceRow
              existingDeviceIds={new Set(devices.map((d) => d.device_id))}
              onConfirm={(device) => {
                update([...devices, device]);
                setAdding(false);
              }}
              onCancel={() => setAdding(false)}
            />
          )}
          {devices.map((device, i) => {
            return (
              <div
                key={device.device_id}
                draggable={false}
                className="flex items-center gap-1 rounded border border-input px-2 py-1"
              >
                <span
                  draggable
                  onDragStart={(e) => {
                    e.stopPropagation();
                    draggingIndex.current = i;
                    e.dataTransfer.setDragImage(dragImage, 14, 40);
                  }}
                  className="cursor-grab select-none"
                >
                  <PinIcon />
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <DeviceField
                    value={device.name ?? ""}
                    onChange={(name) =>
                      update(devices.map((d, j) => (j === i ? { ...d, name } : d)))
                    }
                    placeholder="Device name"
                    isDirty={device.name !== (initialDevices[i]?.name ?? "")}
                  />
                  <span className="px-2 text-xs text-muted-foreground">{device.device_id}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => update(devices.filter((_, j) => j !== i))}
                  className="shrink-0 text-destructive hover:text-destructive"
                >
                  <Trash2Icon className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })}
          {devices.length === 0 && !adding && (
            <p className="py-2 text-center text-sm text-muted-foreground">No devices yet</p>
          )}
        </div>
        <div className="h-2 w-full">
          {env.VITE_GOOGLE_MAPS_API_KEY ? (
            <APIProvider apiKey={env.VITE_GOOGLE_MAPS_API_KEY}>
              <MapWithDrop
                locations={located.map((d) => d.location)}
                markerLabels={located.map((d) => d.name || d.device_id)}
                setLocations={handleSetLocations}
                onDropLocation={handleDropLocation}
                allowDragAndDrop
              />
            </APIProvider>
          ) : (
            <p className="text-sm text-destructive">Missing VITE_GOOGLE_MAPS_API_KEY</p>
          )}
        </div>
      </div>
    </Card>
  );
}

export { EditDevicesMapCard };
