import { redirect } from "next/navigation";
import PlatformApp from "@/components/platform-app";
import PortalAccessGate from "@/components/portal-access-gate";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { canAccessPortal, getPortalRole, portalRoute } from "@/lib/portal-auth";

export const dynamic = "force-dynamic";

const protectedPortals = new Set(["/client", "/partner-portal", "/field", "/admin"]);

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
    return <PlatformApp viewer={{ name: user.displayName, email: user.email, role }} />;
  }

  return <PlatformApp />;
}
