import { TagIcon } from "lucide-react";

import { filterLabelClass, filterSelectClass } from "@/components/filters/filterStyles";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import type { TaxonomyLevel } from "@/lib/filters";
import { useFilters } from "@/lib/hooks/useFilters";

const levels: { value: TaxonomyLevel; label: string }[] = [
  { value: "family", label: "Family" },
  { value: "genus", label: "Genus" },
  { value: "species", label: "Species" },
];

function TaxonomyFilter() {
  const { updateFilters, taxonomyLevel } = useFilters();

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="filter-taxonomy-level" className={filterLabelClass}>
        <TagIcon className="size-4" />
        Taxonomy Level
      </Label>
      <Select
        value={taxonomyLevel}
        onValueChange={(value) => updateFilters({ taxonomyLevel: value ?? undefined })}
      >
        <SelectTrigger id="filter-taxonomy-level" className={filterSelectClass}>
          <SelectValue placeholder="Select Taxonomy Level">
            {levels.find((level) => level.value === taxonomyLevel)?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {levels.map((level) => (
            <SelectItem key={level.value} value={level.value}>
              {level.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export { TaxonomyFilter };
