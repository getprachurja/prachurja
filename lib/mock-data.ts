export type Plant = {
  id: string;
  common: string;
  botanical: string;
  region: string;
  role: string;
  water: "Low" | "Moderate" | "High";
  size: string;
  price: number;
  stock: "Available" | "Low stock" | "Contract grow";
  image: string;
};

export const plants: Plant[] = [
  { id: "neem", common: "Neem", botanical: "Azadirachta indica", region: "Central & peninsular India", role: "Drought resistant", water: "Low", size: "60–90 cm", price: 145, stock: "Available", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Neem_Tree_in_Rajasthan%2C_India.jpg/330px-Neem_Tree_in_Rajasthan%2C_India.jpg" },
  { id: "arjun", common: "Arjun", botanical: "Terminalia arjuna", region: "Riverine plains", role: "Riverbank species", water: "High", size: "75–100 cm", price: 190, stock: "Available", image: "https://upload.wikimedia.org/wikipedia/commons/9/94/Fruit_I_IMG_9577.jpg" },
  { id: "jamun", common: "Jamun", botanical: "Syzygium cumini", region: "Tropical & subtropical India", role: "Bird attracting", water: "Moderate", size: "60–90 cm", price: 175, stock: "Available", image: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Syzygium_cumini_Bra30.png" },
  { id: "mahua", common: "Mahua", botanical: "Madhuca longifolia", region: "Central Indian dry forests", role: "Community livelihood", water: "Low", size: "45–60 cm", price: 210, stock: "Low stock", image: "https://upload.wikimedia.org/wikipedia/commons/6/61/Mahuwa_trees_in_Chhattisgarh.jpg" },
  { id: "amla", common: "Amla", botanical: "Phyllanthus emblica", region: "Dry deciduous zones", role: "Agroforestry species", water: "Low", size: "45–75 cm", price: 160, stock: "Available", image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Phyllanthus_officinalis.jpg" },
  { id: "banyan", common: "Banyan", botanical: "Ficus benghalensis", region: "Most Indian plains", role: "Keystone canopy tree", water: "Moderate", size: "60–90 cm", price: 280, stock: "Contract grow", image: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Great_banyan_tree_kol.jpg" },
  { id: "peepal", common: "Peepal", botanical: "Ficus religiosa", region: "Plains & lower hills", role: "Wildlife supporting", water: "Moderate", size: "60–90 cm", price: 240, stock: "Low stock", image: "https://upload.wikimedia.org/wikipedia/commons/9/94/Ficus_religiosa_Bo.jpg" },
  { id: "palash", common: "Palash", botanical: "Butea monosperma", region: "Dry deciduous India", role: "Pollinator supporting", water: "Low", size: "45–75 cm", price: 185, stock: "Available", image: "https://upload.wikimedia.org/wikipedia/commons/3/38/STS_001_Butea_monosperma.jpg" },
  { id: "kadamba", common: "Kadamba", botanical: "Neolamarckia cadamba", region: "Moist tropical India", role: "Fast canopy formation", water: "High", size: "75–100 cm", price: 195, stock: "Available", image: "https://upload.wikimedia.org/wikipedia/commons/d/dc/Neolamarckia_cadamba_6226.jpg" },
  { id: "karanj", common: "Karanj", botanical: "Millettia pinnata", region: "Coasts & river systems", role: "Nitrogen fixing", water: "Moderate", size: "60–90 cm", price: 155, stock: "Available", image: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Pongamia_pinnata_%28Karanj%29_near_Hyderabad_W_IMG_7633.jpg" },
  { id: "tendu", common: "Tendu", botanical: "Diospyros melanoxylon", region: "Central Indian forests", role: "Understorey tree", water: "Low", size: "30–45 cm", price: 170, stock: "Contract grow", image: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Bark_of_Diospyros_melanoxylon.jpg" },
  { id: "sal", common: "Sal", botanical: "Shorea robusta", region: "Northern & central moist forests", role: "Canopy tree", water: "Moderate", size: "45–60 cm", price: 230, stock: "Contract grow", image: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Shorea_robusta.jpg" },
  { id: "khair", common: "Khair", botanical: "Senegalia catechu", region: "Dry forests & foothills", role: "Soil stabilising", water: "Low", size: "45–60 cm", price: 150, stock: "Available", image: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Acacia_catechu_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-003.jpg" },
  { id: "shisham", common: "Shisham", botanical: "Dalbergia sissoo", region: "Indo-Gangetic riverine belt", role: "Pioneer species", water: "Moderate", size: "60–90 cm", price: 180, stock: "Available", image: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Dalbergia_sissoo_Bra24.png" },
  { id: "baheda", common: "Baheda", botanical: "Terminalia bellirica", region: "Moist deciduous India", role: "Bird attracting", water: "Moderate", size: "60–90 cm", price: 205, stock: "Low stock", image: "https://upload.wikimedia.org/wikipedia/commons/7/74/Terminalia_bellirica.jpg" },
  { id: "harad", common: "Harad", botanical: "Terminalia chebula", region: "Sub-Himalayan & deciduous belts", role: "Canopy tree", water: "Moderate", size: "45–75 cm", price: 215, stock: "Contract grow", image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Harra_%28Terminalia_chebula%29_leafless_tree_at_23_Mile%2C_Duars%2C_WB_W_IMG_5905.jpg" },
  { id: "kusum", common: "Kusum", botanical: "Schleichera oleosa", region: "Central & eastern India", role: "Wildlife supporting", water: "Low", size: "45–60 cm", price: 225, stock: "Available", image: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Schleic_oleos_080320-5971_rgn.JPG" },
  { id: "bamboo", common: "Male Bamboo", botanical: "Dendrocalamus strictus", region: "Dry deciduous India", role: "Soil stabilising", water: "Low", size: "60–90 cm", price: 135, stock: "Available", image: "https://upload.wikimedia.org/wikipedia/commons/5/52/Bamboo_leaves1.JPG" },
  { id: "putranjiva", common: "Putranjiva", botanical: "Putranjiva roxburghii", region: "Moist deciduous plains", role: "Bird attracting", water: "Moderate", size: "45–75 cm", price: 200, stock: "Low stock", image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Putranjiva_roxburghii_01.JPG?width=1000" },
  { id: "kanak-champa", common: "Kanak Champa", botanical: "Pterospermum acerifolium", region: "Eastern & northeastern India", role: "Pollinator supporting", water: "Moderate", size: "60–90 cm", price: 260, stock: "Contract grow", image: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Kanak_Champa_%28Pterospermum_acerifolium%29_in_Hyderabad_W_IMG_7126.jpg" },
];

export const products = [
  ["biochar", "Community Biochar", "Soil Products", "Satpura Soil Collective", "Mandla, MP", 620, "Invasive-to-Asset"],
  ["vermicompost", "Screened Vermicompost", "Soil Products", "Mati Women’s Group", "Nagpur, MH", 280, "Locally made"],
  ["mulch", "Organic Leaf Mulch", "Soil Products", "Green Loop Works", "Pune, MH", 190, "Low-waste"],
  ["tree-guard", "Bamboo Tree Guard", "Bamboo Products", "Van Saathi Crafts", "Dindori, MP", 340, "Community made"],
  ["plant-guard", "Biodegradable Plant Guard", "Plantation Supplies", "EarthWeave Works", "Nashik, MH", 85, "Plastic-light"],
  ["seed-kit", "Native Meadow Seed Kit", "Community Products", "Deccan Seed Circle", "Dharwad, KA", 460, "Local provenance"],
  ["grow-bags", "Reusable Nursery Grow Bags", "Nursery Supplies", "Green Loop Works", "Pune, MH", 520, "Reusable"],
  ["coir", "Coir Root Trainer Set", "Nursery Supplies", "Coast Fibre Guild", "Alappuzha, KL", 390, "Natural fibre"],
  ["stakes", "Bamboo Marking Stakes", "Plantation Supplies", "Van Saathi Crafts", "Dindori, MP", 210, "Community made"],
  ["mulch-mat", "Jute Mulch Mats", "Plantation Supplies", "EarthWeave Works", "Nashik, MH", 260, "Biodegradable"],
  ["basket", "Field Collection Basket", "Community Products", "Van Saathi Crafts", "Dindori, MP", 480, "Community made"],
  ["briquette", "Biomass Soil Briquettes", "Invasive-Biomass Products", "Satpura Soil Collective", "Mandla, MP", 310, "Conditional reuse"],
] as const;

export const services = [
  ["landscape", "Forest & Landscape Restoration", "Rebuild ecological function across degraded or fragmented land."],
  ["regeneration", "Assisted Natural Regeneration", "Protect natural recovery while addressing the barriers that hold it back."],
  ["urban", "Urban Native Forests", "Create diverse native habitat within constrained urban sites."],
  ["greenbelt", "Corporate & Industrial Green Belts", "Design functional buffers with transparent monitoring and maintenance."],
  ["agroforestry", "Agroforestry", "Blend productive trees, soil recovery and farm resilience."],
  ["watershed", "Riverbank & Watershed Restoration", "Stabilise soil and rebuild riparian vegetation using site-led plans."],
  ["soil", "Soil Rehabilitation", "Diagnose compaction, erosion and organic-matter loss before planting."],
  ["invasives", "Invasive-Species Management", "Plan phased, lawful control with follow-up native recovery and monitoring."],
] as const;

export const serviceDetails = {
  landscape: {
    label: "Landscape-scale recovery",
    problem: "Fragmented habitat, depleted native vegetation and disconnected land uses that no longer support ecological processes at landscape scale.",
    clients: "Forest departments, conservation programmes, CSR foundations, institutions and large landholders managing multi-zone or corridor landscapes.",
    assessment: ["Map land use, habitat fragments and pressure points", "Define reference ecosystems for each zone", "Prioritise protection, regeneration and planting areas"],
    approach: "A zoned recovery plan joins habitat protection, assisted regeneration, soil and water work, native planting and community stewardship into one programme.",
    deliverables: ["Landscape baseline and opportunity map", "Zone-wise restoration prescriptions", "Native species and provenance plan", "Phased implementation and governance plan"],
    monitoring: "Track vegetation structure, habitat connectivity, threat reduction and recovery indicators across permanent landscape units.",
  },
  regeneration: {
    label: "Recovery with minimal disturbance",
    problem: "Natural seedlings, coppice or seed sources are present, but grazing, fire, repeated cutting, weeds or soil exposure prevent recovery.",
    clients: "Community forests, protected-area buffers, institutional land, farm commons and sites where natural recovery potential remains visible.",
    assessment: ["Inventory natural regeneration and seed sources", "Identify the barriers suppressing recovery", "Set protection thresholds and enrichment triggers"],
    approach: "Remove or reduce the limiting pressures first, protect existing regeneration and use enrichment planting only where ecological gaps remain.",
    deliverables: ["Regeneration potential map", "Protection and pressure-management protocol", "Selective enrichment plan", "Community maintenance responsibilities"],
    monitoring: "Measure recruitment, browsing damage, seedling growth, canopy closure and whether enrichment is still necessary.",
  },
  urban: {
    label: "Habitat within the city",
    problem: "Heat, compacted soil, fragmented green space, limited rooting volume and ornamental planting that provides little native habitat value.",
    clients: "Campuses, housing communities, schools, municipal sites, hospitals and public landscapes with defined long-term maintenance capacity.",
    assessment: ["Map utilities, shade, drainage and public use", "Test soil constraints and rooting depth", "Choose a realistic native habitat type for the footprint"],
    approach: "Design layered native planting around access, safety, hydrology and mature-space needs instead of forcing a single dense-planting formula onto every site.",
    deliverables: ["Urban site and utility plan", "Layered species palette", "Soil improvement and planting specification", "Public-use and maintenance plan"],
    monitoring: "Review establishment, heat and moisture stress, public-use conflicts, structural safety and seasonal habitat use.",
  },
  greenbelt: {
    label: "Functional industrial buffers",
    problem: "Dust, noise, visual exposure, heat and edge conditions around operational sites, often combined with compliance and reporting obligations.",
    clients: "Manufacturing facilities, logistics parks, mines, utilities, infrastructure operators and corporate campuses.",
    assessment: ["Map emission, wind, noise and access patterns", "Test soil and contamination constraints", "Define buffer functions and measurable compliance indicators"],
    approach: "Use function-specific native layers, safe setbacks, soil rehabilitation and maintainable access rather than a decorative perimeter plantation.",
    deliverables: ["Risk and buffer-function map", "Green-belt design and species matrix", "Bill of quantities and work schedule", "Compliance-ready monitoring framework"],
    monitoring: "Report survival, canopy and ground cover, dust interception proxies, gap replacement and maintenance completion by buffer zone.",
  },
  agroforestry: {
    label: "Trees within productive farms",
    problem: "Erosion, declining soil condition, climate exposure and low diversity in farm landscapes where tree choices must remain compatible with crops and livelihoods.",
    clients: "Individual farmers, producer organisations, farm collectives, watershed programmes and responsible agricultural supply chains.",
    assessment: ["Understand crops, labour, water and tenure", "Map boundaries, slopes and productive zones", "Test tree–crop compatibility and market assumptions"],
    approach: "Co-design boundary, block or scattered-tree systems that combine native ecological functions with practical farm operations and locally credible livelihood options.",
    deliverables: ["Farm resource and constraint map", "Agroforestry system design", "Phased planting and protection plan", "Farm management and harvest assumptions"],
    monitoring: "Track tree survival, crop interaction, soil cover, farmer workload and agreed livelihood indicators without overstating future income.",
  },
  watershed: {
    label: "Soil and water-led restoration",
    problem: "Bank erosion, channel instability, rapid runoff, sediment movement and loss of native riparian vegetation across connected slopes and drainage lines.",
    clients: "Watershed missions, local governments, river trusts, farm collectives, infrastructure projects and riparian landholders.",
    assessment: ["Read the catchment, flow paths and erosion features", "Map bank condition and flood disturbance", "Identify where structural work is necessary—and where it is not"],
    approach: "Sequence runoff reduction, bank protection, natural regeneration and locally adapted riparian planting from the catchment toward the channel.",
    deliverables: ["Catchment and erosion baseline", "Reach-wise treatment plan", "Riparian species and bioengineering schedule", "Seasonal implementation safeguards"],
    monitoring: "Use fixed cross-sections, photo points, vegetation cover, erosion observations and post-monsoon inspections.",
  },
  soil: {
    label: "Repair the growing medium",
    problem: "Compaction, exposed subsoil, erosion, low organic matter, disrupted soil biology or site history that makes immediate planting likely to fail.",
    clients: "Mine and construction sites, industrial land, campuses, degraded farms and restoration projects with poor establishment history.",
    assessment: ["Review disturbance and contamination history", "Sample physical and chemical constraints", "Map compaction, erosion and topsoil depth"],
    approach: "Stabilise erosion, relieve compaction where appropriate, rebuild organic inputs and establish protective vegetation before demanding full planting performance.",
    deliverables: ["Soil constraint map and test interpretation", "Amendment and earthwork specification", "Pioneer cover and succession plan", "Planting-readiness criteria"],
    monitoring: "Compare infiltration, bulk-density proxies, ground cover, erosion recurrence and plant establishment against the baseline.",
  },
  invasives: {
    label: "Control tied to native recovery",
    problem: "Invasive plants dominate habitat, suppress native recruitment or create operational risks, while one-time clearing repeatedly leads to reinvasion.",
    clients: "Forest managers, campuses, protected-area buffers, river corridors, infrastructure operators and community land stewards.",
    assessment: ["Confirm species, extent and reproduction pathway", "Review legal, safety and disposal requirements", "Map native recovery potential beneath the invasion"],
    approach: "Use phased, species-specific control timed to prevent spread, followed immediately by soil protection, native recovery and repeated follow-up.",
    deliverables: ["Invasive distribution and risk map", "Control method and safety protocol", "Biomass handling and disposal plan", "Native recovery and revisit schedule"],
    monitoring: "Record regrowth, reinvasion fronts, native recruitment and follow-up completion; revise methods when control creates unintended disturbance.",
  },
} as const;

export const packages = [
  ["home-garden", "Native Home Garden", "Home / institution", "80–120 m²", "45–60", "Seasonal habitat", "Low", "₹28,000"],
  ["pollinator", "Pollinator Garden", "School / campus", "150–250 m²", "120–180", "Nectar continuity", "Moderate", "₹68,000"],
  ["boundary", "Farm Boundary Plantation", "Working farm", "500 running m", "350–450", "Wind & soil protection", "Moderate", "Request quote"],
  ["agro-starter", "Agroforestry Starter", "Smallholder farm", "1 acre", "240–320", "Farm resilience", "Moderate", "Request quote"],
  ["green-belt", "Corporate Green-Belt", "Industry / CSR", "1–5 hectares", "Site dependent", "Buffer & biodiversity", "High", "Request quote"],
  ["mini-forest", "Urban Mini-Forest", "Urban campus", "300–1,000 m²", "900–3,000", "Layered native habitat", "High", "Request quote"],
] as const;

export const projects = [
  { id: "satpura-corridor", title: "Satpura Habitat Corridor", location: "Betul, Madhya Pradesh", area: "32 ha", type: "Degraded land restoration", status: "Maintenance year 2", species: 38, period: "36 months", progress: 68 },
  { id: "deccan-watershed", title: "Deccan Watershed Slopes", location: "Satara, Maharashtra", area: "18 ha", type: "Watershed restoration", status: "Plantation active", species: 27, period: "24 months", progress: 46 },
  { id: "bengaluru-campus", title: "Bengaluru Campus Mosaic", location: "Bengaluru, Karnataka", area: "6.5 ha", type: "Urban native forest", status: "Monitoring", species: 52, period: "36 months", progress: 81 },
  { id: "vidarbha-farm", title: "Vidarbha Farm Commons", location: "Wardha, Maharashtra", area: "14 ha", type: "Agroforestry", status: "Soil preparation", species: 21, period: "24 months", progress: 29 },
  { id: "chambal-riparian", title: "Chambal Riparian Reach", location: "Kota, Rajasthan", area: "9 km", type: "Riverbank restoration", status: "Baseline assessment", species: 19, period: "48 months", progress: 18 },
  { id: "odisha-mine-edge", title: "Odisha Mine-Edge Recovery", location: "Keonjhar, Odisha", area: "46 ha", type: "Soil rehabilitation", status: "Ecological planning", species: 31, period: "60 months", progress: 22 },
];

export const articles = [
  ["Species selection", "Why native species matter in ecological restoration", "8 min", "Species guides"],
  ["Methods", "Plantation versus ecosystem restoration", "6 min", "Restoration guides"],
  ["Soil recovery", "How pioneer species help degraded soil", "7 min", "Soil & water"],
  ["Home habitat", "Planning a bird-friendly native garden", "5 min", "Species guides"],
  ["Field operations", "What long-term plantation maintenance includes", "9 min", "Restoration guides"],
  ["Circularity", "Responsible uses of invasive biomass", "6 min", "Invasive species"],
] as const;

export const partners = [
  ["Narmada Native Nursery", "Jabalpur, MP", "42 batches", "94"],
  ["Deccan Seed & Sapling", "Dharwad, KA", "31 batches", "91"],
  ["Sahyadri Propagation Unit", "Satara, MH", "28 batches", "89"],
  ["Mahanadi Community Nursery", "Sambalpur, OD", "19 batches", "87"],
] as const;

export const enquiries = Array.from({ length: 10 }, (_, index) => ({
  id: `ENQ-26-${String(index + 41).padStart(3, "0")}`,
  organisation: ["District Watershed Cell", "Industrial Campus", "Education Trust", "Farm Collective", "CSR Foundation"][index % 5],
  state: ["Maharashtra", "Madhya Pradesh", "Karnataka", "Odisha"][index % 4],
  area: `${[12, 4.5, 2, 24, 8][index % 5]} ha`,
  status: ["New", "Review", "Assessment due", "Proposal sent"][index % 4],
}));

export const fieldTasks = Array.from({ length: 8 }, (_, index) => ({
  id: `FT-${220 + index}`,
  task: ["Planting count", "Mulch check", "Survival sample", "Invasive regrowth", "Photo point"][index % 5],
  zone: `Zone ${String.fromCharCode(65 + (index % 4))}${(index % 3) + 1}`,
  due: index < 3 ? "Today" : "This week",
  status: index === 0 ? "Ready" : index < 4 ? "Pending" : "Scheduled",
}));
