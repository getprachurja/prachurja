export type RestorationSystem = {
  id: string;
  name: string;
  shortName: string;
  category: "Restoration" | "Resilience";
  summary: string;
  steps: readonly string[];
  outcome: string;
};

export const restorationSystems: RestorationSystem[] = [
  {
    id: "invasive-management",
    name: "Invasive vegetation management",
    shortName: "Invasive management",
    category: "Restoration",
    summary:
      "Remove invasive vegetation carefully, contain regrowth and reuse suitable biomass within the restoration plan.",
    steps: [
      "Map the invasive species and seed sources",
      "Select a site-safe removal method",
      "Contain, process or reuse biomass responsibly",
      "Follow with native cover and repeat monitoring",
    ],
    outcome: "A controlled site that can begin a native recovery pathway.",
  },
  {
    id: "native-plant-supply",
    name: "Local native plant supply",
    shortName: "Native plant supply",
    category: "Restoration",
    summary:
      "Build planting stock from locally appropriate native species, with traceable seed sources and nursery care.",
    steps: [
      "Study nearby reference ecosystems",
      "Identify suitable mother trees and seed sources",
      "Raise diverse planting stock in a local nursery",
      "Match each species to its place in the site",
    ],
    outcome: "Planting material that reflects local ecology rather than a generic species list.",
  },
  {
    id: "miyawaki",
    name: "Miyawaki native forests",
    shortName: "Miyawaki forests",
    category: "Restoration",
    summary:
      "Create compact, dense native forests where the site, soil, water and long-term purpose make the method appropriate.",
    steps: [
      "Read the original vegetation and present site constraints",
      "Prepare compacted or depleted soil",
      "Plant a mixed, multi-layer native community",
      "Water, weed, mulch and monitor through establishment",
    ],
    outcome: "A small, structurally diverse native forest designed for a land-constrained site.",
  },
  {
    id: "water-retention",
    name: "Water-sensitive restoration",
    shortName: "Water restoration",
    category: "Resilience",
    summary:
      "Slow runoff and retain water in the landscape using terrain-led interventions that support roots and soil.",
    steps: [
      "Read slope, drainage and seasonal flow",
      "Protect existing water paths",
      "Use contour work or small structures where suitable",
      "Monitor erosion, infiltration and plant response",
    ],
    outcome: "More stable water movement and better moisture conditions for recovery.",
  },
  {
    id: "soil-protection",
    name: "Soil repair and erosion control",
    shortName: "Soil repair",
    category: "Resilience",
    summary:
      "Rebuild soil cover, structure and biological activity while protecting fragile surfaces during monsoon periods.",
    steps: [
      "Assess compaction, erosion and organic matter",
      "Protect exposed soil with suitable natural materials",
      "Introduce organic amendments only where needed",
      "Track soil cover and root-zone condition",
    ],
    outcome: "Protected topsoil and a healthier root zone for native vegetation.",
  },
  {
    id: "fire-resilience",
    name: "Living fire resilience",
    shortName: "Fire resilience",
    category: "Resilience",
    summary:
      "Reduce fuel risk around vulnerable edges through maintenance, access planning and locally suitable living buffers.",
    steps: [
      "Map fuel loads, access and exposure",
      "Retain ecologically valuable vegetation",
      "Design maintained buffers for the local fire regime",
      "Review the system before each fire season",
    ],
    outcome: "A maintained landscape edge with lower avoidable fire exposure.",
  },
];

export const restorationProcess = [
  {
    number: "01",
    title: "Read the land",
    copy: "Begin with the existing vegetation, soil, water, land use, disturbance history and nearby reference ecosystems.",
  },
  {
    number: "02",
    title: "Design for place",
    copy: "Choose the right restoration method and native species for the site. Miyawaki is one option, not the default answer.",
  },
  {
    number: "03",
    title: "Establish carefully",
    copy: "Prepare the site, plant in the right season and protect roots, soil moisture and young vegetation.",
  },
  {
    number: "04",
    title: "Steward over time",
    copy: "Maintain, replace failures, manage regrowth and adapt the plan as the landscape responds.",
  },
  {
    number: "05",
    title: "Measure recovery",
    copy: "Record survival, canopy, soil cover, water behaviour and field evidence against a documented baseline.",
  },
] as const;

export const activeRestorationPillars = [
  {
    title: "Native succession",
    copy: "Use early-stage native species to improve cover and conditions, then build toward a diverse, layered community.",
  },
  {
    title: "Living soil",
    copy: "Protect soil structure and encourage locally appropriate biological activity instead of treating soil as an inert growing medium.",
  },
  {
    title: "Wildlife connections",
    copy: "Include native food and habitat plants that help birds, insects and other fauna reconnect the recovering site to its landscape.",
  },
] as const;

export const exampleSpecies = [
  {
    common: "Karanj",
    botanical: "Millettia pinnata",
    note: "A potential pioneer for suitable local conditions; final selection follows site and provenance checks.",
  },
  {
    common: "Palas",
    botanical: "Butea monosperma",
    note: "A native species associated with dry deciduous landscapes and degraded terrain in parts of India.",
  },
  {
    common: "Khair",
    botanical: "Senegalia catechu",
    note: "May support dry, stony or erosion-prone sites within its natural range.",
  },
  {
    common: "Peepal and Umbar",
    botanical: "Ficus religiosa and Ficus racemosa",
    note: "Ficus species can provide important food resources where they belong in the local reference ecosystem.",
  },
  {
    common: "Jamun",
    botanical: "Syzygium cumini",
    note: "A fruiting native tree for suitable moist and riparian settings within its natural range.",
  },
] as const;

export const miyawakiLayers = [
  {
    title: "Canopy",
    copy: "Long-lived trees that can form the upper structure of the local forest community.",
  },
  {
    title: "Tree layer",
    copy: "Medium-height native trees that build diversity below the main canopy.",
  },
  {
    title: "Sub-tree layer",
    copy: "Smaller trees and woody species that occupy the middle structure.",
  },
  {
    title: "Shrub layer",
    copy: "Native shrubs that protect soil, fill lower space and provide habitat.",
  },
] as const;

export const miyawakiStages = [
  {
    number: "01",
    title: "Reference study",
    copy: "Study local remnant vegetation, soil, rainfall, drainage and the intended use of the site.",
  },
  {
    number: "02",
    title: "Species community",
    copy: "Select a diverse mix of locally native species across complementary vegetation layers.",
  },
  {
    number: "03",
    title: "Soil preparation",
    copy: "Relieve compaction and improve water-holding and organic structure according to test results.",
  },
  {
    number: "04",
    title: "Dense planting",
    copy: "Plant a mixed community closely enough to encourage vertical competition without creating a uniform grid.",
  },
  {
    number: "05",
    title: "Establishment care",
    copy: "Mulch, water, weed, replace failures and record the response until the forest is securely established.",
  },
] as const;

export const monitoringMeasures = [
  "Plant survival and replacement",
  "Canopy development and vertical structure",
  "Native recruitment and invasive regrowth",
  "Soil cover, erosion and moisture condition",
  "Photo points and repeatable field observations",
] as const;
