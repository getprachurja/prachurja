# Prachurja

Prachurja is an enterprise Restoration-as-a-Service platform for converting natural liabilities into high-integrity, monitored ecological assets.

The public website follows the approved business and technical proposals: six engineered restoration systems, an active forest-restoration method, stacked per-hectare economics, a regional infrastructure blueprint and a phased route to scale.

## Public experience

- `/` — B2B RaaS model and strategic overview
- `/solutions` — the six engineered restoration and conservation systems
- `/method` — active succession, subterranean health and trophic catalysts
- `/economics` — proposal unit economics and target margin structure
- `/infrastructure` — regional CapEx, OpEx and enterprise scaling roadmap
- `/assessment` — enterprise project-scoping workflow

Proposal metrics are presented as targets or assumptions that require project-level validation, contracting, statutory review and registry eligibility.

## Secure operations

- `/portal` — authenticated workspace entry
- `/client` — enterprise assessment records and project visibility
- `/partner-portal` — regional supply and inventory operations
- `/field` — field reporting
- `/admin` — assessment pipeline, evidence media, user roles and workspace controls
- `/api/health` — production database health

## Architecture

- Next.js 16 and React 19
- Supabase Postgres, Auth and Storage
- Row-level security and server-side application authorization
- Vercel production frontend and server routes
- Connected Sites deployment target
- Role-specific client, partner, field and administrator workspaces

## Local setup

Requires Node.js 22.13 or newer.

```bash
npm install
copy .env.example .env.local
npm run dev
```

## Verification

```bash
npm run lint
npm test
npm run sites:build
```
