import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import PortalAccessGate from "@/components/portal-access-gate";
import {
  LaunchAdminDashboard,
  LaunchClientDashboard,
  LaunchFieldPortal,
  LaunchPartnerPortal,
} from "@/components/launch-portals";
import { RaasAssessmentPage } from "@/components/raas/assessment-page";
import { MethodPage } from "@/components/raas/method-page";
import { MiyawakiPage } from "@/components/raas/miyawaki-page";
import { RaasSiteShell } from "@/components/raas/site-shell";
import { SolutionsPage } from "@/components/raas/solutions-page";
import { NurseryPage } from "@/components/raas/nursery-page";
import { PlantDetailPage } from "@/components/raas/plant-detail-page";
import { CartPage } from "@/components/raas/cart-page";
import { BlogPage } from "@/components/raas/blog-page";
import { BlogArticlePage } from "@/components/raas/blog-article-page";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { canAccessPortal, getPortalRole, portalRoute } from "@/lib/portal-auth";
import { getCatalogPlant, getCatalogPlants } from "@/lib/nursery-data";
import { getBlogPost, getBlogPosts } from "@/lib/blog-data";

export const dynamic = "force-dynamic";

const protectedPortals = new Set(["/client", "/partner-portal", "/field", "/admin"]);
const publicPages = {
  "/solutions": SolutionsPage,
  "/approach": MethodPage,
  "/method": MethodPage,
  "/miyawaki": MiyawakiPage,
  "/assessment": RaasAssessmentPage,
} as const;

const pageMetadata: Record<string, { title: string; description: string }> = {
  "/solutions": {
    title: "What We Restore",
    description:
      "Native planting, invasive management, soil repair, water-sensitive restoration and living landscape resilience.",
  },
  "/approach": {
    title: "Our Restoration Approach",
    description:
      "An assessment-led path from ecological baseline to establishment, stewardship and field evidence.",
  },
  "/method": {
    title: "Our Restoration Approach",
    description:
      "An assessment-led path from ecological baseline to establishment, stewardship and field evidence.",
  },
  "/miyawaki": {
    title: "Miyawaki Native Forests",
    description:
      "A practical guide to when compact, dense native forest planting is—and is not—appropriate.",
  },
  "/assessment": {
    title: "Discuss Your Site",
    description:
      "Share the location, condition and intended outcome of a potential ecological restoration site.",
  },
  "/nursery": {
    title: "Native Plant Nursery",
    description:
      "Explore Prachurja™ native nursery plants by ecological role, water requirement and regional context.",
  },
  "/cart": {
    title: "Nursery Cart",
    description:
      "Review native plant quantities before requesting availability, provenance, delivery and final pricing.",
  },
  "/blog": {
    title: "Field Journal",
    description: "Practical notes on native species, living soil, habitat, restoration and long-term stewardship.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug = [] } = await params;
  const pathname = `/${slug.join("/")}`;
  if (pathname.startsWith("/plants/") && slug.length === 2) {
    const plant = await getCatalogPlant(slug[1]);
    if (plant) {
      return {
        title: `${plant.commonName} · Native Nursery`,
        description: `${plant.botanicalName}: ${plant.ecologicalRole.toLowerCase()} planting stock for locally suitable sites.`,
      };
    }
  }
  if (pathname.startsWith("/blog/") && slug.length === 2) {
    const post = await getBlogPost(slug[1]);
    if (post) return { title: post.title, description: post.excerpt };
  }
  return (
    pageMetadata[pathname] ?? {
      title: "Secure Workspace",
      robots: { index: false, follow: false },
    }
  );
}

export default async function PrototypeRoute({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const pathname = `/${slug.join("/")}`;

  if (pathname === "/economics" || pathname === "/infrastructure") {
    redirect("/approach");
  }

  if (pathname === "/nursery") {
    const plants = await getCatalogPlants();
    return <RaasSiteShell><NurseryPage plants={plants} /></RaasSiteShell>;
  }

  if (pathname === "/cart") {
    return <RaasSiteShell><CartPage /></RaasSiteShell>;
  }

  if (pathname === "/blog") {
    const posts = await getBlogPosts();
    return <RaasSiteShell><BlogPage posts={posts} /></RaasSiteShell>;
  }

  if (pathname.startsWith("/blog/") && slug.length === 2) {
    const [post, posts] = await Promise.all([getBlogPost(slug[1]), getBlogPosts()]);
    if (!post) notFound();
    return <RaasSiteShell><BlogArticlePage post={post} related={posts.filter((item) => item.id !== post.id)} /></RaasSiteShell>;
  }

  if (pathname.startsWith("/plants/") && slug.length === 2) {
    const plant = await getCatalogPlant(slug[1]);
    if (!plant) notFound();
    return <RaasSiteShell><PlantDetailPage plant={plant} /></RaasSiteShell>;
  }

  if (pathname === "/portal") {
    const user = await requireChatGPTUser("/portal");
    const role = await getPortalRole(user.email);
    if (role) redirect(portalRoute(role));
    return <PortalAccessGate user={{ name: user.displayName, email: user.email }} />;
  }

  if (protectedPortals.has(pathname)) {
    const user = await requireChatGPTUser(pathname);
    const role = await getPortalRole(user.email);
    if (!role || !canAccessPortal(role, pathname)) {
      return (
        <PortalAccessGate
          user={{ name: user.displayName, email: user.email }}
          assignedRole={role}
        />
      );
    }
    const viewer = { name: user.displayName, email: user.email, role };
    if (pathname === "/admin") return <LaunchAdminDashboard viewer={viewer} />;
    if (pathname === "/client") return <LaunchClientDashboard viewer={viewer} />;
    if (pathname === "/partner-portal") return <LaunchPartnerPortal viewer={viewer} />;
    return <LaunchFieldPortal viewer={viewer} />;
  }

  const Page = publicPages[pathname as keyof typeof publicPages];
  if (!Page) notFound();
  return (
    <RaasSiteShell>
      <Page />
    </RaasSiteShell>
  );
}
