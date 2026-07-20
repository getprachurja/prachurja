export const defaultSiteContent = {
  announcement: "Native plants · ecological restoration · local livelihoods",
  heroEyebrow: "Native nursery + restoration platform",
  heroTitleLine1: "Native Plants.",
  heroTitleAccent: "Local Livelihoods.",
  heroTitleLine3: "Living Forests.",
  heroDescription: "We grow native plants, restore degraded landscapes and create measurable environmental and community impact.",
  heroImageUrl: "/hero-restoration-v2.webp",
  footerDescription: "Native plants, ecological restoration and local capacity—connected from baseline to long-term evidence.",
  contactEmail: "",
  contactPhone: "",
  officeLocation: "Serving restoration projects across India",
};

export type SiteContent = typeof defaultSiteContent;
export type SiteContentKey = keyof SiteContent;

export const editableSiteContentKeys = Object.keys(defaultSiteContent) as SiteContentKey[];
