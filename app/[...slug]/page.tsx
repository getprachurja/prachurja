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
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { canAccessPortal, getPortalRole, portalRoute } from "@/lib/portal-auth";

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
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug = [] } = await params;
  const pathname = `/${slug.join("/")}`;
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
