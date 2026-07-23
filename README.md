# Prachurja

Prachurja is an ecological-restoration website and secure operations platform. The public experience is deliberately simple: it explains the restoration approach, the kinds of landscapes Prachurja can support, and when a Miyawaki native forest may be appropriate.

Financial targets, per-hectare revenue assumptions, margins, CapEx, OpEx and the ₹100-crore business-plan ambition are internal planning material. They are not part of the public website.

## Public experience

- `/` — simple restoration overview
- `/approach` — baseline, design, establishment, stewardship and monitoring
- `/solutions` — native planting, invasive management, soil, water and fire resilience
- `/miyawaki` — suitability-led Miyawaki native forest guide
- `/assessment` — site-assessment workflow
- Prach — a Groq-backed restoration guide with an in-app local fallback

## Secure operations

- `/portal` — authenticated workspace entry
- `/client` — client project visibility
- `/partner-portal` — supply and inventory operations
- `/field` — field reporting
- `/admin` — assessment pipeline, evidence media, users and workspace controls
- `/api/health` — production database health

## Architecture

- Next.js 16 and React 19
- Supabase Postgres, Auth and Storage
- Row-level security and server-side application authorization
- Groq chat completion through a server-only API route
- Vercel production frontend and server routes
- Connected Sites deployment target

## Local setup

Requires Node.js 22.13 or newer.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Set `GROQ_API_KEY` only in server environment variables. Never expose it through a `NEXT_PUBLIC_` variable.

## Verification

```bash
npm run lint
npm test
npm run sites:build
```
