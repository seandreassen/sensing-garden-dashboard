import { createFileRoute } from "@tanstack/react-router";

import { DeviceDropdown } from "@/components/landingPage/deviceDropDown";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <DeviceDropdown />
    </main>
  );
}
