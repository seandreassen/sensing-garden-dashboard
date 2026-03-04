import type { Classification } from "@/lib/types/api";

const FAMILIES = [
  "Apidae",
  "Nymphalidae",
  "Syrphidae",
  "Coccinellidae",
  "Formicidae",
  "Chrysopidae",
  "Muscidae",
  "Vespidae",
];

const GENERA: Record<string, string[]> = {
  Apidae: ["Apis", "Bombus"],
  Nymphalidae: ["Vanessa", "Aglais"],
  Syrphidae: ["Episyrphus", "Syrphus"],
  Coccinellidae: ["Coccinella", "Harmonia"],
  Formicidae: ["Formica", "Lasius"],
  Chrysopidae: ["Chrysoperla"],
  Muscidae: ["Musca"],
  Vespidae: ["Vespula", "Polistes"],
};

const SPECIES: Record<string, string[]> = {
  Apis: ["Apis mellifera"],
  Bombus: ["Bombus terrestris", "Bombus pascuorum"],
  Vanessa: ["Vanessa cardui", "Vanessa atalanta"],
  Aglais: ["Aglais urticae"],
  Episyrphus: ["Episyrphus balteatus"],
  Syrphus: ["Syrphus ribesii"],
  Coccinella: ["Coccinella septempunctata"],
  Harmonia: ["Harmonia axyridis"],
  Formica: ["Formica rufa"],
  Lasius: ["Lasius niger"],
  Chrysoperla: ["Chrysoperla carnea"],
  Musca: ["Musca domestica"],
  Vespula: ["Vespula vulgaris"],
  Polistes: ["Polistes dominula"],
};

const DEVICES = ["sgmit1", "hub-garden-north", "hub-garden-south", "hub-rooftop"];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateMockClassifications(count: number, daysBack: number): Classification[] {
  const random = seededRandom(42);
  const now = Date.now();
  const startMs = now - daysBack * 24 * 60 * 60 * 1000;
  const results: Classification[] = [];

  for (let i = 0; i < count; i++) {
    const family = FAMILIES[Math.floor(random() * FAMILIES.length)];
    const genera = GENERA[family] ?? [family];
    const genus = genera[Math.floor(random() * genera.length)];
    const speciesList = SPECIES[genus] ?? [`${genus} sp.`];
    const species = speciesList[Math.floor(random() * speciesList.length)];

    const timestampMs = startMs + random() * (now - startMs);
    const hour = new Date(timestampMs).getHours();
    const isDaytime = hour >= 7 && hour <= 20;
    if (!isDaytime && random() > 0.15) {
      continue;
    }

    const familyConf = 0.5 + random() * 0.5;
    const genusConf = familyConf * (0.6 + random() * 0.35);
    const speciesConf = genusConf * (0.5 + random() * 0.4);

    results.push({
      device_id: DEVICES[Math.floor(random() * DEVICES.length)],
      timestamp: new Date(timestampMs).toISOString(),
      model_id: "yolov8n-insects-v2.1",
      family,
      genus,
      species,
      family_confidence: Math.round(familyConf * 1000) / 1000,
      genus_confidence: Math.round(genusConf * 1000) / 1000,
      species_confidence: Math.round(speciesConf * 1000) / 1000,
    });
  }

  return results.toSorted((a, b) => b.timestamp.localeCompare(a.timestamp));
}

const MOCK_CLASSIFICATIONS = generateMockClassifications(800, 30);

export { MOCK_CLASSIFICATIONS, DEVICES as MOCK_DEVICES };
