import { z } from "zod";

const rangePresets = ["24h", "7d", "30d", "3m", "1y", "custom"] as const;
type RangePreset = (typeof rangePresets)[number];

const taxonomyLevels = ["family", "genus", "species"] as const;
type TaxonomyLevel = (typeof taxonomyLevels)[number];

const filtersDefault = {
  rangePreset: "30d" as RangePreset,
  startDate: "",
  endDate: "",
  hub: "",
  taxonomyLevel: "family" as TaxonomyLevel,
  minConfidence: 0,
  selectedTaxa: [],
};

const filtersSchema = z.object({
  rangePreset: z.enum(rangePresets).optional().catch(filtersDefault.rangePreset),
  startDate: z.string().optional().catch(""),
  endDate: z.string().optional().catch(""),
  hub: z.string().optional().catch(""),
  taxonomyLevel: z.enum(taxonomyLevels).optional().catch(filtersDefault.taxonomyLevel),
  minConfidence: z.number().min(0).max(100).optional().catch(filtersDefault.minConfidence),
  selectedTaxa: z.array(z.string()).optional().catch(filtersDefault.selectedTaxa),
});

type Filters = z.infer<typeof filtersSchema>;

export {
  rangePresets,
  type RangePreset,
  taxonomyLevels,
  type TaxonomyLevel,
  filtersDefault,
  filtersSchema,
  type Filters,
};
