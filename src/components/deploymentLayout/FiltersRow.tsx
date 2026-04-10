import { ConfidenceFilter } from "@/components/filters/ConfidenceFilter";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { HubFilter } from "@/components/filters/HubFilter";
import { TaxaMultiSelect } from "@/components/filters/TaxaMultiSelect";
import { TaxonomyFilter } from "@/components/filters/TaxonomyFilter";

interface FiltersRowProps {
  deploymentId: string;
}

function FiltersRow({ deploymentId }: FiltersRowProps) {
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_2fr] gap-6 px-6 py-3">
      <DateRangeFilter />
      <HubFilter deploymentId={deploymentId} />
      <TaxonomyFilter />
      <TaxaMultiSelect />
      <ConfidenceFilter />
    </div>
  );
}
export { FiltersRow };
