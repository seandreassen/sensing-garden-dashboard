import { CheckIcon, GitBranchIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { filterLabelClass, filterSelectClass } from "@/components/filters/filterStyles";
import { Label } from "@/components/ui/Label";
import { Select, SelectTrigger } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { useFilters } from "@/lib/hooks/useFilters";
import { useTaxaCount } from "@/lib/hooks/useTaxaCount";
import type { TaxonomyLevel } from "@/lib/utils/filters";

const TAXONOMY_TEXT: Record<
  TaxonomyLevel,
  {
    selectedLabel: string;
    triggerLabel: string;
    searchPlaceholder: string;
    emptyLabel: string;
  }
> = {
  family: {
    selectedLabel: "Selected families",
    triggerLabel: "Select families",
    searchPlaceholder: "Search families...",
    emptyLabel: "No families found",
  },
  genus: {
    selectedLabel: "Selected genera",
    triggerLabel: "Select genera",
    searchPlaceholder: "Search genera...",
    emptyLabel: "No genera found",
  },
  species: {
    selectedLabel: "Selected species",
    triggerLabel: "Select species",
    searchPlaceholder: "Search species...",
    emptyLabel: "No species found",
  },
};

interface TaxaMultiSelectProps {
  deploymentId: string;
}

function TaxaMultiSelect({ deploymentId }: TaxaMultiSelectProps) {
  const { startDate, endDate, hub, minConfidence, taxonomyLevel, selectedTaxa, updateFilters } =
    useFilters();
  const { data: foundData, isLoading: foundLoading } = useTaxaCount({
    start_time: startDate,
    end_time: endDate,
    device_id: hub ? [hub] : undefined,
    deployment_id: deploymentId,
    min_confidence: minConfidence,
    taxonomy_level: taxonomyLevel,
    sort_desc: true,
  });

  const taxonomyText = TAXONOMY_TEXT[taxonomyLevel];

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);

  // TODO: Get more accurate available taxa with useDetectableTaxa if deployment has model_id. It currently doesn't work as expected.
  const availableTaxaLoading = foundLoading;
  const availableTaxa = useMemo(
    () => foundData?.counts.map((taxaCount) => taxaCount.taxa) ?? [],
    [foundData],
  );

  const filteredTaxa = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return availableTaxa;
    }
    return availableTaxa.filter((taxon) => taxon.toLowerCase().includes(q));
  }, [availableTaxa, search]);

  const toggleTaxon = (taxon: string) => {
    const next = selectedTaxa.includes(taxon)
      ? selectedTaxa.filter((t) => t !== taxon)
      : [...selectedTaxa, taxon];

    updateFilters({ selectedTaxa: next });
  };

  useEffect(() => {
    setSearch("");
  }, [taxonomyLevel]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2" ref={rootRef}>
      <Label htmlFor="filter-taxa" className={filterLabelClass}>
        <GitBranchIcon className="size-4" />
        {taxonomyText.selectedLabel}
      </Label>

      <div className="relative">
        <Select value="">
          <SelectTrigger
            id="filter-taxa"
            className={filterSelectClass}
            onPointerDown={(e) => {
              e.preventDefault();
              setOpen((prev) => !prev);
            }}
          >
            <span>
              {selectedTaxa.length === 0
                ? taxonomyText.triggerLabel
                : selectedTaxa.length === 1
                  ? selectedTaxa[0]
                  : `${selectedTaxa.length} selected`}
            </span>
          </SelectTrigger>
        </Select>

        {open && (
          <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
            <div className="p-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={taxonomyText.searchPlaceholder}
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
            </div>

            <div className="flex gap-2 px-2 pb-2">
              <button
                type="button"
                onClick={() => updateFilters({ selectedTaxa: availableTaxa })}
                className="rounded-md border px-3 py-2 text-sm"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={() => updateFilters({ selectedTaxa: [] })}
                className="rounded-md border px-3 py-2 text-sm"
              >
                Clear all
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto border-t p-1">
              {availableTaxaLoading ? (
                <div className="flex h-61.75 items-center justify-center">
                  <Spinner />
                </div>
              ) : filteredTaxa.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {taxonomyText.emptyLabel}
                </div>
              ) : (
                filteredTaxa.map((taxon) => {
                  const selected = selectedTaxa.includes(taxon);

                  return (
                    <button
                      key={taxon}
                      type="button"
                      onClick={() => toggleTaxon(taxon)}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm"
                    >
                      {selected ? (
                        <CheckIcon className="flex h-4 w-4 rounded border" />
                      ) : (
                        <span className="h-4 w-4 rounded border" />
                      )}
                      {taxon}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { TaxaMultiSelect };
