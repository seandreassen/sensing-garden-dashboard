const filterFieldClass = "flex flex-col gap-1.5";

const filterLabelClass =
  "flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-muted-foreground uppercase";

const filterLabelTextOnlyClass =
  "text-[11px] font-medium tracking-wider text-muted-foreground uppercase";

const filterSelectClass =
  "h-9 w-full cursor-pointer appearance-none rounded border border-border bg-card px-3 text-sm text-foreground transition-colors outline-none hover:border-muted-foreground focus:ring-1 focus:ring-ring";

// Tab button base classes for FilterHeader
const filterDeploymentTabClass =
  "border-b-2 px-4 py-2.5 text-xs font-semibold tracking-wide uppercase transition-colors";
const filterDeploymentTabActiveClass = "border-primary text-primary";
const filterDeploymentTabInactiveClass =
  "border-transparent text-muted-foreground hover:text-foreground";

const filterWorkspaceTabClass =
  "relative rounded-t px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-colors";
const filterWorkspaceTabActiveClass = "bg-primary text-primary-foreground";
const filterWorkspaceTabInactiveClass = "text-muted-foreground hover:text-foreground";

export {
  filterFieldClass,
  filterLabelClass,
  filterLabelTextOnlyClass,
  filterSelectClass,
  filterDeploymentTabClass,
  filterDeploymentTabActiveClass,
  filterDeploymentTabInactiveClass,
  filterWorkspaceTabClass,
  filterWorkspaceTabActiveClass,
  filterWorkspaceTabInactiveClass,
};
