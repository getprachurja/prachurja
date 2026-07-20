import { selectRows } from "@/lib/supabase-data";

export type PortalRole = "admin" | "client" | "partner" | "field";

const routeByRole: Record<PortalRole, string> = {
  admin: "/admin",
  client: "/client",
  partner: "/partner-portal",
  field: "/field",
};

function configuredEmails(key: string): string[] {
  const runtime = process.env as Record<string, string | undefined>;
  return (runtime[key] ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function getPortalRole(email: string): Promise<PortalRole | null> {
  const normalized = email.trim().toLowerCase();
  const configured: Array<[PortalRole, string]> = [
    ["admin", "PRACHURJA_ADMIN_EMAILS"],
    ["client", "PRACHURJA_CLIENT_EMAILS"],
    ["partner", "PRACHURJA_PARTNER_EMAILS"],
    ["field", "PRACHURJA_FIELD_EMAILS"],
  ];

  for (const [role, key] of configured) {
    if (configuredEmails(key).includes(normalized)) return role;
  }

  try {
    const [member] = await selectRows<{ role: string; status: string }>("portal_members", {
      filters: { email: normalized },
      limit: 1,
      select: "role,status",
    });
    if (member?.status.toLowerCase() !== "active") return null;
    return isPortalRole(member.role) ? member.role : null;
  } catch {
    return null;
  }
}

export function isPortalRole(value: string): value is PortalRole {
  return ["admin", "client", "partner", "field"].includes(value);
}

export function portalRoute(role: PortalRole): string {
  return routeByRole[role];
}

export function canAccessPortal(role: PortalRole, pathname: string): boolean {
  return role === "admin" || routeByRole[role] === pathname;
}
