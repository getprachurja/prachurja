import catalogue from "@/data/plant-catalogue.json";

export const plantLayers = ["Shrub Layer", "Sub-Tree Layer", "Tree Layer", "Canopy Tree Layer"] as const;
export type PlantLayer = (typeof plantLayers)[number];

const commonNames: Record<string, string> = {
  "Adhatoda vasica": "Malabar Nut",
  "Annona squamosa": "Custard Apple",
  "Aegle marmelos": "Bael",
  "Azadirachta indica": "Neem",
  "Butea monosperma": "Palash",
  "Cassia fistula": "Amaltas",
  "Ficus benghalensis": "Banyan",
  "Ficus religiosa": "Peepal",
  "Lawsonia inermis": "Henna",
  "Mangifera indica": "Mango",
  "Moringa oleifera": "Drumstick Tree",
  "Murraya koenigii": "Curry Leaf",
  "Neolamarckia cadamba": "Kadamba",
  "Nyctanthes arbor-tristis": "Parijat",
  "Ocimum tenuiflorum": "Tulsi",
  "Ocimum sanctum": "Holy Basil",
  "Phyllanthus emblica": "Amla",
  "Pongamia pinnata": "Karanj",
  "Prosopis cineraria": "Khejri",
  "Pterocarpus santalinus": "Red Sanders",
  "Pterospermum acerifolium": "Kanak Champa",
  "Saraca asoca": "Ashoka",
  "Schleichera oleosa": "Kusum",
  "Shorea robusta": "Sal",
  "Syzygium cumini": "Jamun",
  "Tamarindus indica": "Tamarind",
  "Tectona grandis": "Teak",
  "Terminalia arjuna": "Arjun",
  "Terminalia bellirica": "Baheda",
  "Terminalia chebula": "Harad",
  "Vitex negundo": "Nirgundi",
  "Ziziphus mauritiana": "Indian Jujube"
};

const verifiedImages: Record<string, string> = {
  "Azadirachta indica": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Neem_Tree_in_Rajasthan%2C_India.jpg/640px-Neem_Tree_in_Rajasthan%2C_India.jpg",
  "Butea monosperma": "https://upload.wikimedia.org/wikipedia/commons/3/38/STS_001_Butea_monosperma.jpg",
  "Ficus benghalensis": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Great_banyan_tree_kol.jpg",
  "Ficus religiosa": "https://upload.wikimedia.org/wikipedia/commons/9/94/Ficus_religiosa_Bo.jpg",
  "Neolamarckia cadamba": "https://upload.wikimedia.org/wikipedia/commons/d/dc/Neolamarckia_cadamba_6226.jpg",
  "Phyllanthus emblica": "https://upload.wikimedia.org/wikipedia/commons/7/7f/Phyllanthus_officinalis.jpg",
  "Pongamia pinnata": "https://upload.wikimedia.org/wikipedia/commons/1/1b/Pongamia_pinnata_%28Karanj%29_near_Hyderabad_W_IMG_7633.jpg",
  "Pterospermum acerifolium": "https://upload.wikimedia.org/wikipedia/commons/8/8f/Kanak_Champa_%28Pterospermum_acerifolium%29_in_Hyderabad_W_IMG_7126.jpg",
  "Schleichera oleosa": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Schleic_oleos_080320-5971_rgn.JPG",
  "Shorea robusta": "https://upload.wikimedia.org/wikipedia/commons/f/fd/Shorea_robusta.jpg",
  "Syzygium cumini": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Syzygium_cumini_Bra30.png",
  "Terminalia arjuna": "https://upload.wikimedia.org/wikipedia/commons/9/94/Fruit_I_IMG_9577.jpg",
  "Terminalia bellirica": "https://upload.wikimedia.org/wikipedia/commons/7/74/Terminalia_bellirica.jpg",
  "Terminalia chebula": "https://upload.wikimedia.org/wikipedia/commons/f/ff/Harra_%28Terminalia_chebula%29_leafless_tree_at_23_Mile%2C_Duars%2C_WB_W_IMG_5905.jpg"
};

const layerSettings: Record<PlantLayer, { size: string; basePrice: number; water: "Low" | "Moderate" | "High" }> = {
  "Shrub Layer": { size: "30–45 cm", basePrice: 85, water: "Moderate" },
  "Sub-Tree Layer": { size: "45–75 cm", basePrice: 135, water: "Moderate" },
  "Tree Layer": { size: "60–90 cm", basePrice: 175, water: "Low" },
  "Canopy Tree Layer": { size: "75–120 cm", basePrice: 225, water: "Moderate" }
};

function slugify(botanical: string) {
  return botanical.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const fullPlantCatalogue = plantLayers.flatMap((layer) =>
  (catalogue[layer] as string[]).map((botanical, index) => {
    const settings = layerSettings[layer];
    return {
      id: slugify(botanical),
      common: commonNames[botanical] ?? botanical,
      botanical,
      region: "Indian restoration reference list · verify local range and provenance",
      role: `${layer} structure and diversity`,
      layer,
      water: settings.water,
      size: settings.size,
      price: settings.basePrice + (index % 6) * 10,
      stock: (index % 11 === 0 ? "Contract grow" : index % 7 === 0 ? "Low stock" : "Available") as "Available" | "Low stock" | "Contract grow",
      image: verifiedImages[botanical] ?? `/api/plant-image?name=${encodeURIComponent(botanical)}&layer=${encodeURIComponent(layer)}`,
    };
  }),
);

export const plantLayerCounts = Object.fromEntries(
  plantLayers.map((layer) => [layer, catalogue[layer].length]),
) as Record<PlantLayer, number>;
