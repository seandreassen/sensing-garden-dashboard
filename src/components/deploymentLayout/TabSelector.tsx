import { Link } from "@tanstack/react-router";

import type { FileRoutesByTo } from "@/routeTree.gen";

const tabs: { label: string; route: keyof FileRoutesByTo }[] = [
  { label: "Overview", route: "/deployment/$deploymentId/overview" },
  { label: "Analytics", route: "/deployment/$deploymentId/analytics" },
  { label: "Observations", route: "/deployment/$deploymentId/observations" },
] as const;

function TabSelector() {
  return (
    <nav className="mt-2">
      <ul className="flex list-none px-6">
        {tabs.map((tab) => (
          <li key={tab.route} className="flex">
            <Link
              to={tab.route}
              params={(prev) => prev}
              search={(prev) => prev}
              className="rounded-t px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-colors [&.active]:bg-primary [&.active]:text-primary-foreground [&:not(.active)]:text-muted-foreground [&:not(.active)]:hover:text-foreground"
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
export { TabSelector };
