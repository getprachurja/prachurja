export type RestorationProduct = {
  id: string;
  name: string;
  category: "Restoration" | "Conservation";
  marker: string;
  summary: string;
  mechanism: string[];
  outcome: string;
};

export const restorationProducts: RestorationProduct[] = [
  {
    id: "invasive-to-asset",
    name: "Invasive-to-Asset™",
    category: "Restoration",
    marker: "IA",
    summary:
      "Aggressive mechanical extraction of invasive species like Gliricidia and Lantana. Biomass is processed on-site via mobile retort pyrolyzers into carbon-locking biochar.",
    mechanism: [
      "Species-specific mechanical extraction",
      "Contained biomass movement",
      "Mobile retort pyrolysis",
      "Biochar enrichment and application",
    ],
    outcome: "Convert invasive biomass from a natural liability into a monitored restoration asset.",
  },
  {
    id: "endemic-pulse",
    name: "Endemic Pulse™",
    category: "Restoration",
    marker: "EP",
    summary:
      "Establishment of localized heritage nurseries. We preserve local genetic fidelity by collecting seeds exclusively from surrounding native mother trees.",
    mechanism: [
      "Mother-tree database",
      "Local seed collection",
      "Heritage nursery production",
      "Traceable native planting stock",
    ],
    outcome: "Build locally faithful native plant supply for large-scale restoration.",
  },
  {
    id: "miyawaki-plus",
    name: "Miyawaki Plus™",
    category: "Restoration",
    marker: "MP",
    summary:
      "Ultra-high-density four-tier native afforestation. Grid-based planting is integrated with organic hydrogels and automated drone growth tracking.",
    mechanism: [
      "Four-tier native structure",
      "High-density grid installation",
      "Organic hydrogel support",
      "Automated drone growth tracking",
    ],
    outcome: "Accelerate native canopy formation with measurable establishment tracking.",
  },
  {
    id: "hydro-ridge",
    name: "Hydro-Ridge™ Networks",
    category: "Conservation",
    marker: "HR",
    summary:
      "Precision terrain micro-sculpting using continuous contour trenches and check dams. Keeps water at the root zone during critical development.",
    mechanism: [
      "Continuous contour trenches",
      "Check-dam networks",
      "Root-zone water retention",
      "Terrain-led runoff control",
    ],
    outcome: "Retain critical moisture across restoration slopes and establishment zones.",
  },
  {
    id: "terra-lock",
    name: "Terra-Lock™ Soil Armor",
    category: "Conservation",
    marker: "TL",
    summary:
      "Biodegradable coir and jute geotextile mats combined with native Vetiver grass. Anchors fragile topsoil during monsoons to protect young roots.",
    mechanism: [
      "Coir and jute geotextiles",
      "Native Vetiver reinforcement",
      "Monsoon erosion protection",
      "Young-root stabilization",
    ],
    outcome: "Protect fragile soils while native restoration systems establish.",
  },
  {
    id: "pyro-shield",
    name: "Pyro-Shield™ Firebreaks",
    category: "Conservation",
    marker: "PS",
    summary:
      "Strategic green firebreaks planted with fire-resistant, high-moisture native species. Interlinked with real-time early-detection drone thermal grids.",
    mechanism: [
      "Strategic green-firebreak planning",
      "High-moisture native species",
      "Drone thermal grids",
      "Real-time early detection",
    ],
    outcome: "Reduce fire exposure through living buffers and monitored detection systems.",
  },
];

export const activePillars = [
  {
    number: "01",
    title: "Active Succession",
    copy:
      "Strategic installation of nitrogen-fixing pioneer species to block invasive light resources and build humus.",
  },
  {
    number: "02",
    title: "Subterranean Health",
    copy:
      "Biological soil remediation targeting microscopic networks, toxin binding and forest moisture preservation.",
  },
  {
    number: "03",
    title: "Trophic Catalyst",
    copy:
      "Integrating critical seed-bearing keystone flora to attract migratory fauna, which drive automatic rewilding.",
  },
] as const;

export const pioneerSpecies = [
  {
    common: "Karanj",
    botanical: "Millettia pinnata",
    role:
      "Actively restores atmospheric nitrogen to sterile earth through root symbiosis. Decomposes into thick organic humus.",
  },
  {
    common: "Palas",
    botanical: "Butea monosperma",
    role:
      "Thrives in intensely compacted and degraded clay terrains. Deep roots break up physical blockages to aerate the soil.",
  },
  {
    common: "Khair",
    botanical: "Senegalia catechu",
    role:
      "Anchors highly eroded, stony slopes. Survives intense heat blocks while stabilizing water-stressed zones.",
  },
] as const;

export const keystoneSpecies = [
  {
    common: "The Ficus Dynasty",
    botanical: "Peepal & Umbar",
    role:
      "Year-round asynchronous fruit production serves as a critical food oasis for forest birds.",
  },
  {
    common: "Jamun",
    botanical: "Syzygium cumini",
    role:
      "Fast-growing summer fruit-bearer that draws large frugivores, including hornbills and barbets.",
  },
] as const;

export const revenueStreams = [
  { label: "B2B Clearing Fee", value: 150000, share: 60, color: "forest" },
  { label: "Biochar Product Sales", value: 60000, share: 24, color: "mint" },
  { label: "Carbon Removal Credits", value: 40000, share: 16, color: "gold" },
] as const;

export const operatingCosts = [
  { label: "Extraction & Excavation", value: 45000 },
  { label: "Pyrolysis & Biochar Enrichment", value: 35000 },
  { label: "MRV Data Audit & Logistics", value: 20000 },
] as const;

export const infrastructureRows = [
  {
    item: "Mobile Processing Spoke Fleet",
    capex: "₹80,00,000",
    opex: "₹2,80,000",
    details: "Chippers, Excavators, Retort Kilns",
  },
  {
    item: "Central Finishing & Packing Yard",
    capex: "₹25,00,000",
    opex: "₹2,10,000",
    details: "Inoculation tanks, Pulverizers, Land rent",
  },
  {
    item: "Workforce & Labor Force",
    capex: "—",
    opex: "₹3,81,000",
    details: "1 Operations Manager, 2 Operators, 12 Laborers",
  },
  {
    item: "Logistics & MRV Systems",
    capex: "₹30,00,000",
    opex: "₹2,00,000",
    details: "3-Ton Trucks, Mapping Drones, Audits",
  },
] as const;

export const scaleRoadmap = [
  {
    period: "Months 1–6",
    title: "Build the intelligence layer",
    copy: "GIS mapping, drone survey systems and initial mother-tree database setup.",
  },
  {
    period: "Months 6–12",
    title: "Deploy processing capacity",
    copy: "Deploy mobile pyrolysis spoke fleets and set up the central biochar yard.",
  },
  {
    period: "Months 12–24",
    title: "Secure anchor demand",
    copy: "Secure massive multi-crore B2B corporate anchor contracts.",
  },
  {
    period: "Months 24+",
    title: "Scale verified assets",
    copy: "Integrate digital MRV on credit registries. Scale to a ₹100 CR run-rate.",
  },
] as const;

export const restorationTimeline = [
  {
    period: "Day 1–3",
    copy:
      "Clear invasive species and gently loosen top compacted soils with broadforks to preserve earth profiles.",
  },
  {
    period: "Day 4–5",
    copy:
      "Amend bare soils with biochar. Apply compost-tea extracts to inoculate biology.",
  },
  {
    period: "Day 6–10",
    copy:
      "Install heavy cardboard barrier layers and pile thick wood mulch to suppress invasive seed hatch.",
  },
  {
    period: "Next Rainy Season",
    copy:
      "Plant 70% pioneers and 30% keystone bird magnets through the sheet mulch to secure permanent canopy closure.",
  },
] as const;

export const microbialRecipe = [
  {
    component: "De-chlorinated Water",
    metric: "18 Liters",
    goal: "Safe aqueous environment with chlorine gassed off beforehand.",
  },
  {
    component: "Forest Inoculant + Vermicompost",
    metric: "3 Cups (mesh suspended)",
    goal: "Raw starter cultures of indigenous local bacteria and forest fungi.",
  },
  {
    component: "Blackstrap Molasses",
    metric: "2 Tablespoons",
    goal: "Simple sugars that cause a rapid bacterial population bloom.",
  },
  {
    component: "Liquid Kelp & Humic Acid",
    metric: "1.5 Tablespoons",
    goal: "Complex foods that support fungal hyphae growth for trees.",
  },
] as const;
