import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { useFilterContext } from "@/lib/filters/filterState";
import { useObservations } from "@/lib/hooks/useObservations";

import { filterFieldClass, filterLabelTextOnlyClass } from "./filterStyles";

function TaxaMultiSelect() {
  const { filters, actions } = useFilterContext();
  const [open, setOpen] = useState(false);

  const { data } = useObservations({
    startTime: filters.startTime,
    endTime: filters.endTime,
    deviceFilter: filters.deviceId,
  });

  const availableTaxa = useMemo(() => {
    if (!data?.items) {
      return [];
    }
    const names = new Set<string>();
    for (const obs of data.items) {
      const name = obs[filters.taxonomyLevel];
      if (name) {
        names.add(name);
      }
    }
    return Array.from(names).toSorted();
  }, [data, filters.taxonomyLevel]);

  const levelLabel =
    filters.taxonomyLevel === "family"
      ? "families"
      : filters.taxonomyLevel === "genus"
        ? "genera"
        : "species";

  return (
    <div className={`relative ${filterFieldClass}`}>
      <label htmlFor="filter-taxa" className={filterLabelTextOnlyClass}>
        Filter {levelLabel}
      </label>

      <Button
        id="filter-taxa"
        variant="outline"
        className="w-full justify-start text-xs font-normal"
        onClick={() => setOpen(!open)}
      >
        <span className="flex-1 truncate text-left">
          {filters.selectedTaxa.length === 0
            ? `All ${levelLabel}`
            : `${filters.selectedTaxa.length} selected`}
        </span>
        <ChevronsUpDownIcon className="h-3 w-3 shrink-0 text-muted-foreground" />
      </Button>

      {filters.selectedTaxa.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {filters.selectedTaxa.map((t) => (
            <span
              key={t}
              className="flex items-center gap-1 rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground"
            >
              {t}
              <Button variant="ghost" size="icon-xs" onClick={() => actions.toggleTaxon(t)}>
                <XIcon className="h-2.5 w-2.5" />
              </Button>
            </span>
          ))}
        </div>
      )}

      {open && (
        <div className="absolute top-full z-50 mt-1 max-h-48 w-56 overflow-y-auto rounded border border-border bg-card shadow-lg">
          {availableTaxa.length === 0 ? (
            <div className="px-3 py-2 text-xs text-muted-foreground">No data available</div>
          ) : (
            availableTaxa.map((taxon) => {
              const selected = filters.selectedTaxa.includes(taxon);
              return (
                <button
                  key={taxon}
                  type="button"
                  onClick={() => actions.toggleTaxon(taxon)}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-accent"
                >
                  <span
                    className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border ${selected ? "border-primary bg-primary" : "border-border"}`}
                  >
                    {selected && <CheckIcon className="h-2.5 w-2.5 text-primary-foreground" />}
                  </span>
                  {taxon}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export { TaxaMultiSelect };
