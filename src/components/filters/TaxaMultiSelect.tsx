import { CheckIcon, GitBranchIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  filterFieldClass,
  filterLabelClass,
  filterSelectClass,
} from "@/components/filters/filterStyles";
import { Label } from "@/components/ui/Label";
import { Select, SelectTrigger } from "@/components/ui/Select";
import type { TaxonomyLevel } from "@/lib/filters";
import { useFilters } from "@/lib/hooks/useFilters";

const mockTaxonomy = {
  family: [
    "Apidae", // bees
    "Formicidae", // ants
    "Culicidae", // mosquitoes
    "Coccinellidae", // ladybugs
    "Carabidae", // ground beetles
    "Pieridae", // butterflies
    "Acrididae", // grasshoppers
    "Gryllidae", // crickets
  ],

  genus: [
    "Apis",
    "Bombus",
    "Formica",
    "Camponotus",
    "Anopheles",
    "Culex",
    "Harmonia",
    "Carabus",
    "Pieris",
    "Locusta",
    "Gryllus",
  ],

  species: [
    "Apis mellifera",
    "Bombus terrestris",
    "Formica rufa",
    "Camponotus pennsylvanicus",
    "Anopheles gambiae",
    "Culex pipiens",
    "Harmonia axyridis",
    "Carabus nemoralis",
    "Pieris rapae",
    "Locusta migratoria",
    "Gryllus campestris",
  ],
};

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

function TaxaMultiSelect() {
  const { taxonomyLevel, selectedTaxa, updateFilters } = useFilters();

  const currentLevel: TaxonomyLevel = taxonomyLevel ?? "family";
  const currentSelectedTaxa = selectedTaxa ?? [];
  const taxonomyText = TAXONOMY_TEXT[currentLevel];

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);

  const availableTaxa = useMemo(() => mockTaxonomy[taxonomyLevel] || [], [taxonomyLevel]);

  const filteredTaxa = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return availableTaxa;
    }
    return availableTaxa.filter((taxon) => taxon.toLowerCase().includes(q));
  }, [availableTaxa, search]);

  const toggleTaxon = (taxon: string) => {
    const next = currentSelectedTaxa.includes(taxon)
      ? currentSelectedTaxa.filter((t) => t !== taxon)
      : [...currentSelectedTaxa, taxon];

    updateFilters({ selectedTaxa: next });
  };

  useEffect(() => {
    setSearch("");
  }, [currentLevel]);

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
    <div className={filterFieldClass} ref={rootRef}>
      <Label htmlFor="filter-taxa" className={filterLabelClass}>
        <GitBranchIcon className="h-3 w-3" />
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
              {currentSelectedTaxa.length === 0
                ? taxonomyText.triggerLabel
                : currentSelectedTaxa.length === 1
                  ? currentSelectedTaxa[0]
                  : `${currentSelectedTaxa.length} selected`}
            </span>
          </SelectTrigger>
        </Select>

        {open && (
          <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-background shadow-lg">
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
              {filteredTaxa.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {taxonomyText.emptyLabel}
                </div>
              ) : (
                filteredTaxa.map((taxon) => {
                  const selected = currentSelectedTaxa.includes(taxon);

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
