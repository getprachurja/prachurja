# Prachurja

Prachurja is a full-stack ecological-restoration platform for public discovery, site-assessment intake, native nursery supply, partner onboarding, field reporting, client visibility and administration.

## Product surfaces

- `/` — public restoration website
- `/nursery`, `/plants/:id`, `/marketplace`, `/packages`, `/services` — catalogue and distinct restoration-service pathways
- `/cart` — device-persistent quotation cart with quantities and assessment handoff
- `/assessment` — persisted site-assessment workflow with a durable reference number
- `/projects`, `/projects/:id`, `/knowledge`, `/blog`, `/partner`, `/about` — public evidence, guidance and partnership pathways
- `/contact`, `/delivery`, `/privacy`, `/terms` — contact intake and launch information pages
- `/portal` — Sign in with ChatGPT entry and role request
- `/client` — client-owned assessment records
- `/partner-portal` — partner inventory management
- `/field` — field-report submission
- `/admin` — website CMS, media library, portal-user roles, assessments, partnerships and contact operations
- `/api/health` — runtime database health
- `/api/contact` — persisted public contact messages and admin inbox access

## Architecture

- Vinext / React frontend and server routes
- Cloudflare D1 via the logical `DB` binding
- Cloudflare R2 via the logical `MEDIA` binding for administrator-managed website images
- Drizzle schema and checked-in migrations
- Sign in with ChatGPT identity, server-side role checks and D1 membership records
- Live public content overrides managed from the administrator control centre
- Groq Chat Completions API for Prach, the website companion; a constrained navigation guide remains available when the API key is not configured

## Local setup

Requires Node.js 22.13 or newer.

```bash
npm install
copy .env.example .env.local
npm run db:generate
npm run dev
```

For production, configure `GROQ_API_KEY` as a secret and set the role allowlists shown in `.env.example`. The deployed Sites environment carries the owner administrator allowlist and Groq model selection.

## Verification

```bash
npm run lint
npm test
```

Public catalogue availability, indicative pricing and illustrative case-study metrics must be confirmed before contracting. Site-specific ecological decisions require professional assessment and applicable approvals.
