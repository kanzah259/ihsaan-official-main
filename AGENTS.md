# Agent Instructions

## Start here

Read these before making changes:

- [docs/CODEBASE_MAP.md](docs/CODEBASE_MAP.md) - system overview, directory guide, key workflows, boot sequence, and known risks. Read this first when navigating the codebase or changing routes, includes, CSS, or Supabase.
- [docs/DESIGN.md](docs/DESIGN.md) - Stitch-format design system: colors, typography, layout, components, and assets. Read this before creating or restyling any UI, and keep it in sync when visual decisions change.

Supporting docs:

- [README.md](README.md) - quick start, routes, and environment notes.
- [supabase/README.md](supabase/README.md) - tracker provisioning runbook.

## Project shape

Static HTML/CSS/JS site with no build step. `index.html` is the shell, `pages/` holds route fragments loaded through `data-include`, `scripts/routing.js` handles hash routing, and the opportunities tracker talks to Supabase from the browser. Script order in `index.html` matters, and the site must be served over HTTP (`node scripts/local-server.mjs`, port 4173), not `file://`.

## Commit authorship

Never add AI agent profiles to commit authors, co-authors, or trailers. Applies to every branch, including `main`.
