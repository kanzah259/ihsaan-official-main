---
last_mapped: 2026-10-23T07:10:00Z
---

# Codebase Map

## System Overview

IHSAAN’s public website is a **static SPA shell**: `index.html` loads CSS and scripts, then replaces `[data-include]` placeholders with HTML fragments from `pages/`. Client-side hash routing (`scripts/routing.js`) shows one `.page[data-page]` section at a time.

The **opportunities tracker** is the only backend-backed surface. It talks to Supabase from the browser (`scripts/opportunities-tracker.js` + `scripts/supabase-config.js`) with RLS; admin actions go through the `tracker-admin` Edge Function under `supabase/functions/`.

Membership apply CTAs on the home page point at **https://portal.ihsaan.network** (separate member-portal repo). This repo is the marketing site, not the portal app.

Scanner snapshot (cartographer): ~89 scanned files; code/docs concentrated in `pages/`, `css/`, `scripts/`, `supabase/`.

## Directory Guide

| Path | Purpose |
| --- | --- |
| `index.html` | App shell: meta, stylesheets, top nav, `data-include` mounts, footer, script order |
| `pages/` | Route bodies: `home`, `who-we-are`, `get-involved`, `career-conferences`, `faithful-talent`, `haqqathons`, `opportunities-tracker`, `career-guides` |
| `css/` | Feature-split styles; `base.css` + section files + `responsive.css` last |
| `scripts/includes.js` | Fetches `data-include` HTML into the DOM |
| `scripts/routing.js` | Hash → active page; mobile drawer; programmes dropdown |
| `scripts/main.js` | Boot: includes → bind routes → tracker → effects |
| `scripts/opportunities-tracker.js` | Tracker UI + Supabase client flows |
| `scripts/supabase-config.js` | Public Supabase URL / publishable key / admin function name |
| `scripts/hero.js`, `parallax.js`, `scroll-reveal.js`, `ui-effects.js`, `year.js` | Presentation / motion helpers |
| `scripts/local-server.mjs` | Zero-dep static file server (port `4173`) |
| `assets/images/` | Logos, heroes, partners, event media |
| `supabase/migrations/` | Tracker schema + RLS + seed/import SQL (run in timestamp order) |
| `supabase/functions/tracker-admin/` | Edge Function for privileged tracker admin |
| `supabase/README.md` | Tracker provisioning runbook |
| `script-old.js` | Legacy monolith; not loaded by `index.html` |
| `docs/` | Project documentation (this map, etc.) |

## Key Workflows

### Local preview

1. `node scripts/local-server.mjs`
2. Open `http://localhost:4173`
3. Navigate via `#route` hashes or nav `data-route` links

### Add or edit a marketing page

1. Edit or add `pages/<route>.html` with `<section class="page" data-page="<route>" …>`
2. Register include in `index.html` (`<div data-include="pages/…">`)
3. Add nav / footer links with `href="#<route>"` and `data-route="<route>"`
4. Add CSS under `css/` and link from `index.html` if needed

### Membership CTA

- Home Students & Graduates button → `https://portal.ihsaan.network` (`pages/home.html`)
- Professional network still uses an external Google Form

### Opportunities tracker changes

1. Schema/RLS: new file in `supabase/migrations/`, document in `supabase/README.md`
2. Client UX: `pages/opportunities-tracker.html` + `scripts/opportunities-tracker.js` + `css/opportunities-tracker.css`
3. Admin API: `supabase/functions/tracker-admin/index.ts` (name wired via `adminFunctionName` in config)
4. Auth redirects must include local and production origins (see supabase README)

### Boot sequence

`load` → `loadIncludes()` → collect `.page` / `[data-route]` → `initOpportunitiesTracker()` → `handleRoute()` → scroll/hero/UI init

## Known Risks

- **No bundler**: script globals and load order in `index.html` matter; breaks are runtime-only.
- **Includes need HTTP**: `file://` breaks `fetch` for pages and Auth redirects.
- **Large media**: many HEIC/WebP assets inflate the tree; prefer WebP already referenced by pages.
- **Publishable key in repo**: expected for RLS apps; never add secret/`service_role` keys to `supabase-config.js`.
- **`script-old.js`**: dead weight; easy to confuse with live scripts.
- **Dual career-guides surfaces**: in-app `#career-guides` vs Notion link in nav — keep copy/links intentional.
- **Portal coupling**: membership UX depends on portal.ihsaan.network staying available; this site only deep-links.
