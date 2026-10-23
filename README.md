# IHSAAN Official Website

Public marketing site for [IHSAAN](https://ihsaan.network) — Faith. Excellence. Service.

Static HTML/CSS/JS SPA shell with hash routing. Programme pages and the opportunities tracker load as HTML includes into `index.html`. Member applications go to the member portal at [portal.ihsaan.network](https://portal.ihsaan.network).

## Stack

- Vanilla HTML, CSS, and JavaScript (no build step)
- Hash-based SPA routing (`#home`, `#who-we-are`, …)
- [Supabase](https://supabase.com) for the opportunities tracker (Auth + RLS + Edge Function)
- Local static server: `scripts/local-server.mjs` (default port `4173`)

## Quick start

Needs Node.js. From the repo root:

```bash
node scripts/local-server.mjs
```

Open [http://localhost:4173](http://localhost:4173).

Serve over HTTP (not `file://`) so `data-include` fetches and Supabase auth redirects work.

## Project layout

| Path | Role |
| --- | --- |
| `index.html` | Shell: nav, footer, page includes, script tags |
| `pages/` | Route sections injected via `data-include` |
| `css/` | Stylesheets (loaded from `index.html`) |
| `scripts/` | Client JS + local server |
| `assets/images/` | Brand, hero, partner, and programme imagery |
| `supabase/` | Tracker migrations, Edge Function, setup notes |
| `docs/` | Architecture map and project docs |

See [docs/CODEBASE_MAP.md](docs/CODEBASE_MAP.md) for navigation paths and workflows.

## Key routes

| Hash | Page |
| --- | --- |
| `#home` | Home |
| `#who-we-are` | Our Story |
| `#get-involved` | Get involved |
| `#career-conferences` | Career Conferences |
| `#faithful-talent` | Faithful Talent |
| `#haqqathons` | Hackathons |
| `#opportunities-tracker` | Opportunities tracker |
| `#career-guides` | Career Guides (in-app; nav also links Notion) |
| `#privacy` | Privacy notice |
| `#terms` | Terms of use |

External links used in nav/CTAs include Career Guides on Notion, My Muslim Mentor, and the member portal.

## Opportunities tracker

Setup steps live in [supabase/README.md](supabase/README.md).

1. Run SQL migrations in `supabase/migrations/` (timestamp order) in the Supabase SQL Editor.
2. Put the project URL and publishable key in `scripts/supabase-config.js`.
3. Configure Auth Site URL / Redirect URLs for local (`http://localhost:4173`) and production (`https://ihsaan.network`).

Do not put secret or `service_role` keys in the frontend config.

## Related

- Production site: https://ihsaan.network
- Member portal: https://portal.ihsaan.network
- Contact: ihsaan@fosis.org.uk
