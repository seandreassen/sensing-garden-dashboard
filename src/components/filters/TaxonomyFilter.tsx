import { TagIcon } from "lucide-react";

import { useFilterContext } from "@/lib/filters/filterState";
import type { TaxonomyLevel } from "@/lib/types/api";

const LEVELS: { value: TaxonomyLevel; label: string }[] = [
  { value: "family", label: "Family" },
  { value: "genus", label: "Genus" },
  { value: "species", label: "Species" },
];

function TaxonomyFilter() {
  const { filters, actions } = useFilterContext();

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="filter-taxonomy"
        className="flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-muted-foreground uppercase"
      >
        <TagIcon className="h-3 w-3" />
        Taxonomy Level
      </label>
      <select
        id="filter-taxonomy"
        className="h-9 w-full cursor-pointer appearance-none rounded border border-border bg-card px-3 text-sm text-foreground transition-colors outline-none hover:border-muted-foreground focus:ring-1 focus:ring-ring"
        value={filters.taxonomyLevel}
        onChange={(e) => actions.setTaxonomyLevel(e.target.value as TaxonomyLevel)}
      >
        {LEVELS.map((l) => (
          <option key={l.value} value={l.value}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export { TaxonomyFilter };
