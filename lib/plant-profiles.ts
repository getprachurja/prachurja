import type { NurseryPlant } from "@/lib/nursery";

export type PlantFieldProfile = {
  fieldRows: Array<{ label: string; value: string }>;
  care: readonly string[];
  recommendedUses: readonly string[];
  companions: string;
};

const companionGroups: Record<string, string> = {
  wet: "Arjun, Jamun and locally appropriate riparian shrubs, sedges and groundcover.",
  dry: "Palash, Amla and locally appropriate dry-deciduous shrubs, grasses and pioneers.",
  canopy: "A mixed community of locally native canopy, sub-tree, shrub and ground layers.",
  wildlife: "Native flowering and fruiting species that extend seasonal food and shelter.",
};

function groupFor(plant: NurseryPlant) {
  const text = `${plant.region} ${plant.ecologicalRole}`.toLowerCase();
  if (/river|riparian|moist|water/.test(text)) return "wet";
  if (/dry|drought|slope|erosion/.test(text)) return "dry";
  if (/wildlife|bird|pollinator|food|habitat/.test(text)) return "wildlife";
  return "canopy";
}

function usesFor(plant: NurseryPlant) {
  const role = plant.ecologicalRole.toLowerCase();
  const uses = ["Mixed restoration"];
  if (/river|riparian|water/.test(role)) uses.push("Riparian planting");
  else if (/slope|soil|erosion/.test(role)) uses.push("Soil protection");
  else if (/wildlife|bird|pollinator|food|habitat/.test(role)) uses.push("Habitat planting");
  else uses.push("Native canopy");
  uses.push(/farm|livelihood/.test(role) ? "Farm boundary" : "Landscape diversity");
  return uses;
}

export function getPlantFieldProfile(plant: NurseryPlant): PlantFieldProfile {
  const group = groupFor(plant);
  return {
    fieldRows: [
      { label: "Local reference name", value: plant.commonName },
      { label: "Native range", value: plant.region },
      { label: "Ecological role", value: plant.ecologicalRole },
      { label: "Wildlife relationship", value: /wildlife|bird|pollinator|food|habitat/i.test(plant.ecologicalRole) ? "Potential food, shelter or habitat value; confirm locally" : "Site-dependent habitat value within a diverse native community" },
      { label: "Current nursery size", value: plant.plantSize },
      { label: "Growth pattern", value: "Confirm for local provenance, soil and climate" },
      { label: "Soil preference", value: "Match to surveyed soil, drainage and root-zone condition" },
      { label: "Water requirement", value: plant.waterRequirement },
      { label: "Sunlight", value: "Confirm during site and layer assessment" },
      { label: "Planting season", value: "Local monsoon or reliable soil-moisture window" },
      { label: "Flowering & fruiting", value: "Seasonal; timing varies by region and climate" },
      { label: "Planting distance", value: "Set by mature form, method and restoration objective" },
    ],
    care: [
      "Validate provenance and site suitability.",
      "Prepare soil from the measured baseline.",
      "Plant in the local moisture window.",
      "Mulch without touching the stem.",
      "Monitor survival, stress and browsing.",
    ],
    recommendedUses: usesFor(plant),
    companions: companionGroups[group],
  };
}
