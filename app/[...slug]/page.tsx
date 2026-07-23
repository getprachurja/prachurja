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
import { EconomicsPage } from "@/components/raas/economics-page";
import { InfrastructurePage } from "@/components/raas/infrastructure-page";
import { MethodPage } from "@/components/raas/method-page";
import { RaasSiteShell } from "@/components/raas/site-shell";
import { SolutionsPage } from "@/components/raas/solutions-page";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { canAccessPortal, getPortalRole, portalRoute } from "@/lib/portal-auth";

export const dynamic = "force-dynamic";

const protectedPortals = new Set(["/client", "/partner-portal", "/field", "/admin"]);
const publicPages = {
  "/solutions": SolutionsPage,
  "/method": MethodPage,
  "/economics": EconomicsPage,
  "/infrastructure": InfrastructurePage,
  "/assessment": RaasAssessmentPage,
} as const;

const pageMetadata: Record<string, { title: string; description: string }> = {
  "/solutions": {
    title: "Engineered Restoration Systems",
    description: "Six standardized restoration and conservation systems for enterprise-scale ecological infrastructure.",
  },
  "/method": {
    title: "Active Forest Restoration",
    description: "Prachurja's active succession, subterranean health and trophic catalyst restoration method.",
  },
  "/economics": {
    title: "RaaS Economics",
    description: "The proposal's stacked per-hectare revenue model for clearing, biochar and carbon-removal value.",
  },
  "/infrastructure": {
    title: "Regional Scale Blueprint",
    description: "The regional infrastructure, operating model and roadmap designed for 1,000 hectares per year.",
  },
  "/assessment": {
    title: "Scope a Restoration Project",
    description: "Define a natural liability and begin an enterprise Restoration-as-a-Service assessment.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug = [] } = await params;
  const pathname = `/${slug.join("/")}`;
  return pageMetadata[pathname] ?? { title: "Secure Workspace", robots: { index: false, follow: false } };
}

export default async function PrototypeRoute({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  const pathname = `/${slug.join("/")}`;

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
      return <PortalAccessGate user={{ name: user.displayName, email: user.email }} assignedRole={role} />;
    }
    const viewer = { name: user.displayName, email: user.email, role };
    if (pathname === "/admin") return <LaunchAdminDashboard viewer={viewer} />;
    if (pathname === "/client") return <LaunchClientDashboard viewer={viewer} />;
    if (pathname === "/partner-portal") return <LaunchPartnerPortal viewer={viewer} />;
    return <LaunchFieldPortal viewer={viewer} />;
  }

  const Page = publicPages[pathname as keyof typeof publicPages];
  if (!Page) notFound();
  return <RaasSiteShell><Page /></RaasSiteShell>;
}
