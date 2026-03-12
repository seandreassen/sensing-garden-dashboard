import { ConfidenceFilter } from "@/components/filters/ConfidenceFilter";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { HubFilter } from "@/components/filters/HubFilter";
import { TaxonomyFilter } from "@/components/filters/TaxonomyFilter";

function FiltersRow() {
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_2fr] gap-6 px-6 py-4">
      <DateRangeFilter />
      <HubFilter />
      <TaxonomyFilter />
      <ConfidenceFilter />
    </div>
  );
}
export { FiltersRow };
