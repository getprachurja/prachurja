export function reference(prefix: string): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const tail = crypto.randomUUID().slice(0, 6).toUpperCase();
  return `${prefix}-${date}-${tail}`;
}

export function errorResponse(error: unknown, fallback = "Unable to complete the request") {
  const message = error instanceof Error ? error.message : fallback;
  console.error(error);
  return Response.json({ error: message || fallback }, { status: 500 });
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
