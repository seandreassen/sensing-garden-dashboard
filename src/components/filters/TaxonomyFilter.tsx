import { TagIcon } from "lucide-react";

import {
  filterFieldClass,
  filterLabelClass,
  filterSelectClass,
} from "@/components/filters/filterStyles";
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
    <div className={filterFieldClass}>
      <label htmlFor="filter-taxonomy" className={filterLabelClass}>
        <TagIcon className="h-3 w-3" />
        Taxonomy Level
      </label>
      <select
        id="filter-taxonomy"
        className={filterSelectClass}
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
