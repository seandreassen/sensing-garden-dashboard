import { Link } from "@tanstack/react-router";

import { ExportData } from "@/components/ExportData";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import type { FileRoutesByTo } from "@/routeTree.gen";
const tabs: { label: string; route: keyof FileRoutesByTo }[] = [
  { label: "Overview", route: "/deployment/$deploymentId/overview" },
  { label: "Analytics", route: "/deployment/$deploymentId/analytics" },
  { label: "Observations", route: "/deployment/$deploymentId/observations" },
  { label: "Info", route: "/deployment/$deploymentId/info" },
] as const;

function TabSelector() {
  return (
    <div className="flex flex-row bg-popover py-3">
      <nav>
        <ul className="flex flex-auto list-none gap-2 px-6">
          {tabs.map((tab) => (
            <li key={tab.route} className="flex">
              <Link
                to={tab.route}
                params={(prev) => prev}
                search={(prev) => prev}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "tracking-wide uppercase [&.active]:bg-primary [&.active]:text-primary-foreground",
                )}
              >
                {tab.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <span className="flex flex-auto justify-end pr-8" aria-label="Export data button">
        <ExportData />
      </span>
    </div>
  );
}
export { TabSelector };
