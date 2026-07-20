import { env } from "cloudflare:workers";

type RuntimeEnvironment = Record<string, string | undefined>;

type SelectOptions = {
  filters?: Record<string, string | number | boolean>;
  limit?: number;
  order?: { column: string; ascending?: boolean };
  select?: string;
};

function runtime() {
  return env as unknown as RuntimeEnvironment;
}

function configuration() {
  const values = runtime();
  const url = values.SUPABASE_URL?.replace(/\/$/, "");
  const publishableKey = values.SUPABASE_PUBLISHABLE_KEY;
  const appSecret = values.SUPABASE_APP_SECRET;
  if (!url || !publishableKey || !appSecret) {
    throw new Error("Supabase is not configured for the Prachurja server runtime.");
  }
  return { url, publishableKey, appSecret };
}

function camelToSnake(value: string) {
  return value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function snakeToCamel(value: string) {
  return value.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

function mapKeys(value: unknown, transform: (key: string) => string): unknown {
  if (Array.isArray(value)) return value.map((item) => mapKeys(item, transform));
  if (!value || typeof value !== "object" || value instanceof Date || value instanceof File) return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => [transform(key), mapKeys(item, transform)]),
  );
}

function queryUrl(table: string, options: SelectOptions = {}) {
  const { url } = configuration();
  const query = new URLSearchParams({ select: options.select ?? "*" });
  for (const [column, value] of Object.entries(options.filters ?? {})) query.set(column, `eq.${value}`);
  if (options.order) query.set("order", `${options.order.column}.${options.order.ascending ? "asc" : "desc"}`);
  if (options.limit) query.set("limit", String(options.limit));
  return `${url}/rest/v1/${table}?${query}`;
}

async function request<T>(input: string, init: RequestInit = {}): Promise<T> {
  const { publishableKey, appSecret } = configuration();
  const response = await fetch(input, {
    ...init,
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
      "x-prachurja-app-key": appSecret,
      ...init.headers,
    },
  });
  if (!response.ok) {
    let detail = "Supabase request failed";
    try {
      const payload = await response.json() as { message?: string };
      if (payload.message) detail = payload.message;
    } catch {
      // Preserve the generic error for non-JSON responses.
    }
    throw new Error(`${detail} (${response.status})`);
  }
  if (response.status === 204) return undefined as T;
  const body = await response.json();
  return mapKeys(body, snakeToCamel) as T;
}

export function selectRows<T>(table: string, options: SelectOptions = {}) {
  return request<T[]>(queryUrl(table, options));
}

export function insertRow<T>(table: string, row: Record<string, unknown>) {
  return request<T[]>(queryUrl(table), {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(mapKeys(row, camelToSnake)),
  }).then((rows) => rows[0]);
}

export function updateRows<T>(table: string, row: Record<string, unknown>, filters: Record<string, string | number | boolean>) {
  return request<T[]>(queryUrl(table, { filters }), {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(mapKeys(row, camelToSnake)),
  });
}

export function upsertRows<T>(table: string, rows: Array<Record<string, unknown>>, conflictColumn: string) {
  const { url } = configuration();
  const query = new URLSearchParams({ on_conflict: conflictColumn });
  return request<T[]>(`${url}/rest/v1/${table}?${query}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(mapKeys(rows, camelToSnake)),
  });
}

export function deleteRows(table: string, filters: Record<string, string | number | boolean>) {
  return request<void>(queryUrl(table, { filters }), { method: "DELETE", headers: { Prefer: "return=minimal" } });
}

export async function countRows(table: string) {
  const { publishableKey, appSecret } = configuration();
  const response = await fetch(queryUrl(table, { select: "id", limit: 1 }), {
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
      "x-prachurja-app-key": appSecret,
      Prefer: "count=exact",
      Range: "0-0",
    },
  });
  if (!response.ok) throw new Error(`Supabase count failed (${response.status})`);
  const total = response.headers.get("content-range")?.split("/").at(-1);
  return total && total !== "*" ? Number(total) : 0;
}

export function supabaseFunctionUrl(name: string) {
  return `${configuration().url}/functions/v1/${name}`;
}

export function supabaseServerHeaders() {
  const { publishableKey, appSecret } = configuration();
  return { apikey: publishableKey, Authorization: `Bearer ${publishableKey}`, "x-prachurja-app-key": appSecret };
}
