import { selectRows } from "@/lib/supabase-data";

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  readTime: string;
  coverImageUrl: string;
  featured: boolean;
  publishedAt: string;
};

const fallbackPosts: BlogPost[] = [
  {
    id: "why-native-species-matter",
    title: "Why native species matter in ecological restoration",
    excerpt: "A practical introduction to provenance, reference ecosystems and the relationships that make a plant truly belong.",
    body: "A native species list is not a universal shopping list. The right starting point is a nearby reference ecosystem, read alongside the receiving site’s soil, water, exposure and disturbance history.\n\nProvenance matters because plants from different regions may respond differently even when they share a botanical name. Restoration planning therefore considers where seed came from, how nursery stock was raised and whether the species belongs in that landscape.\n\nDiversity also matters. A resilient planting combines complementary canopy, sub-tree, shrub and ground-layer roles, with seasonal resources for local wildlife. The final community should be verified in the field, then monitored and adjusted through establishment.",
    category: "Species guides",
    readTime: "8 min",
    coverImageUrl: "/hero-restoration-v2.webp",
    featured: true,
    publishedAt: "2026-07-18T00:00:00.000Z",
  },
  {
    id: "plantation-versus-restoration",
    title: "Plantation versus ecosystem restoration",
    excerpt: "Why tree count alone cannot describe recovery—and what to measure instead.",
    body: "A plantation can meet a production or shade objective, but ecological restoration has a different test: is the living system recovering?\n\nThat question expands the work beyond planting. Soil cover, water movement, native recruitment, habitat structure, invasive regrowth and survival over time all matter. A baseline makes those changes visible.\n\nGood projects state their intended outcome, choose measures that fit it and report what the field evidence actually shows.",
    category: "Restoration practice",
    readTime: "6 min",
    coverImageUrl: "/hero-restoration.png",
    featured: false,
    publishedAt: "2026-07-12T00:00:00.000Z",
  },
  {
    id: "pioneer-species-and-soil",
    title: "How pioneer species help degraded soil",
    excerpt: "The first vegetation layer can protect the surface and create conditions for a more diverse community.",
    body: "Pioneer species are used for the jobs a damaged site needs first: fast cover, shade, organic inputs, erosion protection or a more stable root zone.\n\nThey are not a permanent substitute for diversity. Their role is to help a site move through succession while later-stage native species establish.\n\nSelection must still follow local range, provenance and site conditions. Maintenance then manages competition, failures and invasive regrowth as the community changes.",
    category: "Living soil",
    readTime: "7 min",
    coverImageUrl: "/hero-restoration-v2.webp",
    featured: false,
    publishedAt: "2026-07-06T00:00:00.000Z",
  },
  {
    id: "bird-friendly-native-garden",
    title: "Planning a bird-friendly native garden",
    excerpt: "Build seasonal food, shelter and water into a small landscape without treating wildlife as decoration.",
    body: "A bird-friendly garden begins with locally native plants that offer different forms of food and shelter across the year.\n\nLayering is useful: taller trees, smaller trees, shrubs and ground vegetation create more niches than a single row of ornamental trees. Safe water, reduced pesticide use and retained leaf litter can strengthen the habitat.\n\nObserve which species already use the area, then improve the landscape gradually rather than relying on a generic list.",
    category: "Habitat",
    readTime: "5 min",
    coverImageUrl: "/hero-restoration.png",
    featured: false,
    publishedAt: "2026-06-28T00:00:00.000Z",
  },
  {
    id: "long-term-maintenance",
    title: "What long-term plantation maintenance includes",
    excerpt: "Watering is only one part of establishment care; observation and timely correction are equally important.",
    body: "Establishment care connects planting day to a functioning landscape. It includes irrigation planning, mulch, weed and invasive control, protection from browsing, replacement planting and clear field records.\n\nThe schedule should respond to seasons and plant condition rather than repeat the same task indefinitely. Survival, growth, soil cover and visible stress help determine the next action.\n\nAs the system becomes more self-sustaining, inputs can reduce—but monitoring should continue against the original objective.",
    category: "Stewardship",
    readTime: "7 min",
    coverImageUrl: "/hero-restoration-v2.webp",
    featured: false,
    publishedAt: "2026-06-19T00:00:00.000Z",
  },
  {
    id: "responsible-invasive-biomass",
    title: "Responsible uses of invasive biomass",
    excerpt: "Removal is only the first step: containment, safe reuse and follow-up recovery determine the outcome.",
    body: "Invasive vegetation management must avoid spreading seeds or viable plant material during cutting, transport and storage.\n\nWhere safe and technically suitable, processed biomass may support mulch, compost, erosion-control or other site uses. The method depends on the species and the risk of regeneration.\n\nMost importantly, removal should be followed by native cover and repeat monitoring. Empty ground often invites the same problem back.",
    category: "Field methods",
    readTime: "6 min",
    coverImageUrl: "/hero-restoration.png",
    featured: false,
    publishedAt: "2026-06-10T00:00:00.000Z",
  },
];

type BlogRow = BlogPost & { status?: string };

function clean(value: string) {
  return value.replaceAll("â€”", "—").replaceAll("â€“", "–").replaceAll("â€™", "’");
}

function normalize(rows: BlogRow[]): BlogPost[] {
  return rows.map((row) => ({
    ...row,
    title: clean(row.title),
    excerpt: clean(row.excerpt),
    body: clean(row.body),
    coverImageUrl: row.coverImageUrl || "/hero-restoration-v2.webp",
  }));
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const rows = await selectRows<BlogRow>("blog_posts", {
      filters: { status: "Published" },
      order: { column: "published_at", ascending: false },
      limit: 100,
    });
    const posts = rows.length ? normalize(rows) : fallbackPosts;
    return posts.sort((a, b) => Number(b.featured) - Number(a.featured) || b.publishedAt.localeCompare(a.publishedAt));
  } catch {
    return fallbackPosts;
  }
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((post) => post.id === id) ?? null;
}
