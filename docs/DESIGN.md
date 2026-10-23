---
version: alpha
name: IHSAAN
description: Faith. Excellence. Service.
colors:
  primary: "#102B68"
  nav-dark: "#071a43"
  nav-mid: "#0B235A"
  nav-bright: "#194E8B"
  ink: "#071329"
  accent: "#4a9eff"
  sky: "#8fd0ff"
  surface: "#ffffff"
  surface-cool: "#f7faff"
  text-muted: "#52617c"
  silver-light: "#dfefff"
  silver-mid: "#8faac4"
  silver-soft: "#c4d8eb"
  gold: "#f5c842"
  membership-gold-dark: "#926114"
  membership-gold: "#b38329"
  tracker-hero: "#0b326d"
  tracker-action: "#0b3778"
  tracker-action-hover: "#0e4a9d"
  tracker-filter-active: "#113c7d"
  tracker-border: "#dce6f1"
  tracker-input-border: "#dae2ed"
  tracker-input-text: "#183a68"
  destructive: "#a13e3e"
typography:
  hero-home:
    fontFamily: Poppins
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  hero-programme:
    fontFamily: Poppins
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  heading-shared:
    fontFamily: Poppins
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body-prose:
    fontFamily: Poppins
    fontSize: 16px
    lineHeight: 1.85
    letterSpacing: "0.01em"
  body-card:
    fontFamily: Poppins
    fontSize: 15px
    lineHeight: 1.65
  label-kicker:
    fontFamily: Poppins
    fontSize: 12px
    fontWeight: 800
    letterSpacing: "0.13em"
  tracker-card-title:
    fontFamily: Poppins
    fontSize: 17px
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  tracker-input:
    fontFamily: Poppins
    fontSize: 12px
rounded:
  none: 0px
  compact: 4px
  button: 6px
  tracker-input: 7px
  control: 8px
  panel: 12px
  tracker-card: 14px
  board: 18px
  detail-dialog: 20px
  pill: 999px
spacing:
  xs: 8px
  sm: 12px
  md: 16px
  grid: 18px
  lg: 24px
  xl: 32px
  panel: 36px
components:
  button-hero:
    textColor: "{colors.ink}"
    rounded: "{rounded.compact}"
  button-professional:
    textColor: "{colors.primary}"
    rounded: "{rounded.button}"
    padding: "14px 18px"
  button-professional-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
  button-tracker:
    backgroundColor: "{colors.tracker-action}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
  button-tracker-hover:
    backgroundColor: "{colors.tracker-action-hover}"
  filter-tracker-active:
    backgroundColor: "{colors.tracker-filter-active}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "10px 13px"
  input-tracker:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.tracker-input-text}"
    typography: "{typography.tracker-input}"
    rounded: "{rounded.tracker-input}"
    padding: 10px
  board-tracker:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.board}"
  card-programme:
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.control}"
---

# Design System: IHSAAN

## Overview

IHSAAN's public website connects Muslim students and graduates in the UK and Ireland with employers, mentors, career resources, and community programmes. Its existing identity combines large photographic or video introductions, a navy-and-white palette, Poppins typography, and the brand statement **Faith. Excellence. Service.**

The marketing surfaces are image-led and spacious, with left-aligned headlines, dark overlays, cool silver calls to action, and alternating white and deep-blue sections. The opportunities tracker uses the same blue family in a denser, task-focused interface with search, filters, listing cards, forms, and dialogs. This is not a dark-only application: white content areas are fundamental to the system.

**Evidence status:** extracted from the current HTML, CSS, and presentation scripts. Appearance descriptions are source-based interpretations, not a browser-verified visual audit. No new brand direction is established here. Frontmatter names normalize observed values for reuse; they do not imply matching CSS custom-property names or a pre-existing centralized token library. Fluid font sizes, gradients, transparency, shadows, and responsive exceptions are documented below rather than flattened into misleading fixed tokens.

### Source of truth

All repository links are relative to this document.

| Source | Design information |
| --- | --- |
| [App shell](../index.html) | Font import, stylesheet order, shared navigation, footer, route includes |
| [Base styles](../css/base.css) | Global colors, containers, typography, buttons, focus and reduced-motion rules |
| [Navigation](../css/nav.css) and [hero](../css/hero.css) | Header, drawer, video treatment, silver and gold CTAs |
| [Home markup](../pages/home.html) and [styles](../css/home.css) | Narrative sections, audience cards, programme cards, event calendar |
| [Programme styles](../css/programmes.css), [carousel](../css/carousel.css), [contact](../css/contact.css), [footer](../css/footer.css) | Supporting components and shared inner-page cards |
| [Inner-page styles](../css/pages.css) | Faithful Talent, Career Conferences, Our Story, values and team cards |
| [Hackathon markup](../pages/haqqathons.html) and [styles](../css/hackathons.css) | Full-height photographic hero, recap player, testimonial, timeline, photo CTA |
| [Tracker markup](../pages/opportunities-tracker.html), [styles](../css/opportunities-tracker.css), [script](../scripts/opportunities-tracker.js) | Public listings, contributor workspace, roles, dialogs and runtime states |
| [Responsive overrides](../css/responsive.css) | Last-loaded mobile and tablet overrides |
| [Routing](../scripts/routing.js), [hero effects](../scripts/hero.js), [reveals](../scripts/scroll-reveal.js), [UI effects](../scripts/ui-effects.js) | Menu state, page transitions, text reveals and counters |

Styles are handwritten vanilla CSS, not Tailwind or a component-library theme. Read the final matching declaration across the stylesheet order in `index.html`, including selector specificity and media queries. In particular, `home.css` follows `programmes.css`, `hackathons.css` contains unscoped shared selectors, and `responsive.css` loads last. Earlier declarations alone are not reliable specifications.

## Colors

### Primary

- **Brand navy** (`primary`, CSS `--brand`): shared headings, outlined actions, blue-tinted borders, and brand emphasis.
- **Deep navy, middle navy, bright navy** (`nav-dark`, `nav-mid`, `nav-bright`; CSS `--navDark`, `--navMid`, `--navBright`): layered blue backgrounds and gradients. The header itself remains transparent, including its `.scrolled` state.
- **Ink navy** (`ink`, CSS `--ink`): body text, dark feature panels, and programme-card foundations.
- **Electric blue and pale sky** (`accent`, `sky`): focus outlines, hover underlines, highlights, glows, and cool gradient lighting. These are supporting interaction colors, not the default fill for every marketing button.

### Secondary

- **Cool silver** (`surface`, `silver-light`, `silver-mid`, `silver-soft`): the metallic primary marketing CTA uses `linear-gradient(115deg, #ffffff 0%, #dfefff 24%, #8faac4 48%, #c4d8eb 72%, #ffffff 100%)` with an animated background position and inset highlight.
- **Membership gold** (`membership-gold-dark`, `membership-gold`): the membership CTA uses a darker bronze-gold gradient, white text, and a gold focus outline. Do not substitute the brighter hackathon gold.
- **Highlight gold** (`gold`, CSS `--gold`): hackathon testimonial markers and selected decorative emphasis. Later hackathon overrides make the hero's emphasized word and event badge text white; they are not gold just because an earlier rule says so.

### Neutral and functional

- **White and cool white** (`surface`, `surface-cool`): page bodies, cards, contact forms, and alternating sections.
- **Muted blue-gray** (`text-muted`): supporting marketing copy on light backgrounds.
- **Translucent white:** `--silver` is `rgba(255,255,255,.80)` and `--muted` is `rgba(255,255,255,.65)`. These are text colors for dark backgrounds, not gray text for white cards.
- **Tracker blues:** `tracker-hero` is the final public hero fill; `tracker-action` and its hover color are form and application actions. The contributor sign-in card has its own final action fill (`#103d7b`).
- **Tracker borders:** `tracker-border` is the final listing-card border; `tracker-input-border` belongs to contributor fields. Borders on marketing cards usually use translucent brand navy instead.
- **Destructive red** (`destructive`): remove-member and remove-listing actions, with pale red borders and a darker red filled hover state. This is not an established site-wide validation palette.

Tracker organization marks have blue, gold, lilac, coral, green, and ink variants. These distinguish listing identities; they are not additional global brand accents or proof of success/error semantics.

## Typography

**Family:** Poppins throughout, with `system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif` as the body fallback stack. No second display or monospace family is established.

`index.html` requests Poppins weights **400, 700, and 900** from Google Fonts. CSS also requests intermediate weights such as 500, 600, 650, 750, and 800, plus a light navigation weight. Those weights are not explicitly loaded; do not assume genuine separate font files exist for them.

| Role | Observed treatment |
| --- | --- |
| Home display | Weight 700, tight tracking, desktop `clamp(36px, min(4.7vw, 7.9vh), 68px)`, line height 1.1, maximum width 13ch. Short desktop viewports have a separate rule. |
| Programme display | Career Conferences and Faithful Talent: weight 700, `clamp(48px, 6.4vw, 96px)`, line height .98, tracking -.035em, maximum width 12ch. |
| Story display | `clamp(46px, 6.2vw, 92px)` in the desktop hero. |
| Hackathon display | Viewport-width-and-height-aware sizing like the home display, with a separately scoped mobile rule. |
| Shared section heading | `.h2`: `clamp(24px, 2.6vw, 36px)`, weight 700, line height 1.2, tracking -.02em. Homepage and route-specific headings frequently override it with larger scales. |
| Marketing card title | Commonly `clamp(22px, 2.2vw, 32px)` or `clamp(24px, 2.4vw, 34px)`, tight tracking and roughly 1.08 line height. |
| Prose | Shared `.darkp`: 16px, line height 1.85; many route cards use 15px / 1.65. Hero and section copy use fluid sizes and bounded line lengths. |
| Kicker | Usually 11px or 12px, uppercase, bold, tracking .08em to .13em. Footer labels use weight 600. |
| Tracker display | Desktop `clamp(44px, 5.4vw, 78px)`, weight 800, line height .98, tracking -.055em. Mobile `clamp(39px, 12vw, 57px)`. |
| Tracker detail | Listing title 17px; summary 12px / 1.65; metadata labels 9px uppercase; contributor field labels 11px and inputs 12px. |

Headlines frequently use balanced wrapping. Preserve intentional short line lengths and title hierarchy rather than shrinking every heading to the shared `.h2` size. Marketing prose often spans about 42ch to 58ch, but some explanatory sections intentionally allow 88ch; there is no universal measure.

## Layout

### Containers and spacing

- Standard desktop container: `min(1120px, calc(100% - (var(--site-gutter) * 2)))`.
- Wide desktop container: `min(1320px, calc(100% - (var(--site-gutter-wide) * 2)))`.
- Standard gutter: `clamp(32px, 4.4vw, 88px)`. Wide gutter: `clamp(48px, 6vw, 116px)`.
- Several home sections and the main photographic hero use a 1440px rail. Faithful Talent, Career Conferences, and Our Story also have route-specific 1440px rails. Hackathons use a 1720px outer rail plus an inset to align content with the navigation.
- At 700px and below, both gutter variables become `clamp(18px, 5vw, 28px)`. Selected home sections instead use explicit widths of `calc(100% - 56px)`, then `calc(100% - 64px)` at 600px. The standard container becomes 88% at 600px.
- A shared section starts at 70px vertical padding and reduces to 50px on phones, but route sections have their own larger or fluid values. The frontmatter spacing entries are recurring measurements, not a strict enforced spacing scale.

### Composition and breakpoints

| Surface | Desktop | Narrower layouts |
| --- | --- | --- |
| Header | Logo, centered links, right-aligned social icons in three columns | At 900px, links and social icons hide; a burger opens a full-screen drawer |
| Home audience paths | Two equal cards | One column at 760px |
| Home programme cards | Three columns, fluid gaps | One column at 600px via explicit `!important` rules; see cascade caveat below |
| Faithful Talent pathways | Three columns | One column at 1080px |
| Conference expectations | Three columns; final feature spans two | Two at 1080px, one at 640px |
| Story values / team | Three value columns / two team columns | At 980px, two value columns / one team column; one value column at 640px |
| Contact | Copy and form in unequal columns | One column at 600px |
| Event calendar | Copy and embed in a flex row | Stacked at 768px |
| Tracker listings | Auto-fill columns with 270px minimum width | Two columns at 960px, one at 640px |
| Footer | Brand plus three link columns | Two columns at 980px with full-width brand; one at 640px |

**Cascade caveat:** `programmes.css` declares a two-column programme grid at 900px, but the later `home.css` repeats the same selectors with three columns outside a media query. Source order therefore overrides that tablet grid declaration. Treat the intended two-column tablet layout as unverified, not an established working rule.

The home hero's final phone heading rule comes from last-loaded `responsive.css`: `clamp(34px, 11vw, 48px)` at 600px, then `clamp(32px, 10vw, 42px)` at 400px. Its desktop sizing is not its final mobile sizing. The phone hero actions retain pill corners from `hero.css`, while padding and type sizes are overridden later.

### Existing screen inventory

- **Home (`#home`):** full-height video intro; challenge and evidence; potential and age comparison; student/professional paths; five programme cards; two partner-logo rows; contact form; embedded events calendar.
- **Our Story (`#who-we-are`):** photographic intro, mission/vision statements, highlighted quotation, values, team cards.
- **Career Conferences (`#career-conferences`):** photographic intro, event collage, attendance figures, expectation cards. Mobile swaps the collage for rotating photos.
- **Faithful Talent (`#faithful-talent`):** photographic intro, internship programme introduction, three metric cards and programme link.
- **Hackathons (`#haqqathons`):** photographic intro with three statistics, explanatory band, recap video cover, testimonial, partner logos, past-event timeline, photographic closing CTA.
- **Tracker (`#opportunities-tracker`):** compact blue hero, explanatory copy and team-access card, searchable/filterable board, details dialog, sign-in/recovery/password dialogs, and permission-dependent workspace tabs.
- **Get Involved / Career Guides:** shared gradient page head followed by stacked white cards. The navigation and homepage guide card link to Notion, even though an in-app guides route also exists.

This repository is the public website, not the membership portal. The student membership CTA opens `portal.ihsaan.network`; the professional path opens a Google Form. Do not infer portal screens from these links.

## Elevation & Depth

Depth is a combination of dark photographic overlays, blue-tinted shadows, translucent panels, fine borders, inset highlights, and restrained grid textures. White sections are relatively open; heroes, events, dialogs, and large programme cards carry stronger depth.

| Treatment | Observed recipe and use |
| --- | --- |
| Global shadow token | `0 18px 50px rgba(7, 19, 41, 0.22)` in `--shadow` |
| Interactive glow | `0 0 0 2px rgba(120,168,255,.10), 0 0 24px rgba(120,168,255,.30)` in `--glow` |
| Light editorial cards | `0 24px 62px rgba(16,43,104,.08)`, increasing to `0 30px 72px rgba(16,43,104,.12)` on hover |
| Programme cards | `0 24px 60px rgba(7,19,41,.16)` plus a fine inset white highlight; stronger shadow on hover |
| Tracker board | Final shadow `0 20px 48px rgba(14,48,101,.08)` |
| Opportunity dialog | `0 28px 80px rgba(3,17,45,.38)`; dark translucent backdrop with 5px blur |

Glass belongs to selected controls, navigation overlays, and panels, not every surface. The programmes dropdown uses 12px blur; the mobile drawer uses 24px; the hero secondary button uses 30px. The hero's text container is explicitly transparent with no card, border, shadow, or backdrop blur.

Grid motifs generally use 52px or 56px cells with low-opacity strokes; the footer uses 58px. Keep them subordinate to text and imagery.

### Motion

- Shared easing: `cubic-bezier(0.16, 1, 0.3, 1)` for entrances; `cubic-bezier(0.25, 1, 0.5, 1)` for quicker movement; `cubic-bezier(0.34, 1.56, 0.64, 1)` for spring-like button responses. Global durations are .2s, .4s, and .8s.
- Buttons lift and brighten; programme cards rise 8px and slightly scale while their images zoom. Editorial cards generally lift 4px.
- Scroll reveals use fading with 40px translation or .92 scale, trigger once, and accept per-element delays. Hero headings reveal words. Route changes fade the previous page and animate the next page upward.
- Partner-logo rows move in opposite directions over 50 seconds on desktop, use 32 seconds for coarse pointers, and pause on hover where available.
- **Reduced-motion limitation:** base styles suppress most animations, hide particles, and reveal content immediately. However, `carousel.css` explicitly keeps logo scrolling running over 40 seconds under reduced motion, and routing still schedules its transition in JavaScript. Do not describe reduced-motion support as complete.

## Shapes

The system intentionally contains several shape families, not one universal card radius:

- **Compact actions:** shared buttons use 6px corners; desktop silver hero buttons use 4px; homepage phone hero actions use full pill corners.
- **Photographic programme cards and contact form:** gently rounded 8px corners, with inset borders or translucent edges.
- **Audience cards:** 12px corners. **Tracker listings:** final 14px corners. **Tracker board and member dialog:** 18px. **Opportunity details dialog:** 20px.
- **Editorial cards:** Faithful Talent pathways, conference expectation cards, and the current Story values/team cards are square-edged unless a scoped rule changes them. The older generic `.card` has 18px corners instead.
- **Hackathon route:** event cards and badges are square; phone CTA overrides also force square corners. Do not apply the homepage pill convention here.
- **Identity imagery:** the current Story team portraits are square, not the circles used by the older `.team-photo` component.

Thin borders are usually 1px. Marketing panels use translucent navy on white or translucent white on navy; tracker surfaces use opaque pale blue-gray borders.

## Components

### Navigation and footer

The fixed header has a transparent background with no scrolled-state blur, shadow, or bottom border. Its logo is 32px tall at the base desktop size. White navigation text has a cool blue gradient underline on hover. The programmes menu is a floating dark translucent panel with 14px corners and staggered link entrances.

Social buttons are 32px squares with 10px corners; Instagram keeps its platform gradient, LinkedIn its blue, and TikTok its black fill. The 900px breakpoint replaces desktop navigation with a burger and full-screen translucent drawer, with a native details/summary programme accordion. Preserve expanded-state attributes and accessible names.

The footer is dark blue with a subtle grid, a logo rendered white via CSS filtering, left-aligned link groups, small uppercase section labels, and unboxed social icons. It is not a white footer despite the blue logo asset it loads.

### Buttons and links

- **Primary marketing:** silver gradient, dark text, sentence case, weight 600, animated sheen and inset highlight. Desktop sizing is fluid and height-sensitive; specific routes override size and corner shape.
- **Secondary hero:** white outline, translucent dark fill, white text, glass blur. Hover lifts and adds a highlight sweep.
- **Membership:** bronze-gold gradient and white text, reserved for the student membership action. In the audience card it is full width with a 54px minimum height and 6px corners.
- **Professional network:** transparent fill, navy outline and text; navy fill with white text on hover. Same audience-card dimensions as membership.
- **Generic inner-page action:** dark blue vertical gradient, 6px corners, `12px 14px` padding, maximum width 230px. It inherits the shared uppercase, heavy button treatment rather than the hero's sentence case.
- **Tracker:** compact blue-filled actions with white text, usually 7px or 8px corners, modest hover movement, and specific disabled states. Disabled member-primary actions use .65 opacity and a waiting cursor; disabled pagination uses .42 opacity and a not-allowed cursor.

Global keyboard focus is a 2px electric-blue outline offset 3px. Shared buttons add a glow; tracker controls and membership actions have scoped overrides. Do not replace these with hover-only feedback.

### Programme cards and editorial cards

Programme cards are full-card links with cover photography, dark bottom gradients, a numbered glass badge near the top left, and white title/description near the bottom. A small generated "Explore" pill completes the description. Desktop height is `clamp(360px, 34vw, 460px)`; do not treat earlier 320px or 340px declarations as universally effective.

Audience-path cards use light backgrounds, navy headings, descriptive copy, and bottom-aligned CTAs. Programme detail and values cards use light gradients with thin navy borders, ample padding, and large compact titles. A dark feature card can interrupt the light grid. Preserve each route's square or rounded shape rather than substituting the generic card component everywhere.

### Imagery and media

Reuse the actual community/event media rather than replacing it with abstract stock illustration. Sources already wired into the UI include:

| Role | Asset |
| --- | --- |
| Header brand | `assets/images/IHSAAN LOGO.webp` |
| Footer brand | `assets/images/blue-logo-IHSAAN.webp`, rendered white with CSS |
| Icon variants | `assets/images/white-icon.svg`, `assets/images/blue-icon.svg` |
| Home video / poster | `assets/videos/hero-video-remade.mp4` / `assets/images/loading.png` |
| Conference hero / collage | `assets/images/Career Conference Collage/20260203_190255.jpg` / `assets/images/Career Conference Collage/photo-collage.png` |
| Faithful Talent | `assets/images/faithful_talent.webp` |
| Programme imagery | `assets/images/career-guides.webp`, `career-conferences.webp`, `mmm.webp`, `Haqqathons.webp` under the same directory |
| Hackathon hero / closing image | `assets/images/hackathon1.JPG` / `assets/images/hackathon2.JPG` |
| Recap cover | `assets/images/hackathonsisters.png` |
| Team portraits | `assets/images/Profile Images/` |

The home video is muted, looping, autoplaying, and inline. Dark gradient veils, vignettes, and text shadows protect headline readability. The hackathon recap uses a photographic button cover over a YouTube iframe. Partner logos retain their own colors, aspect ratios, and transparent backgrounds in unboxed horizontal tracks. Icons are primarily inline SVG, with some image assets and existing audience-card emoji; no general icon font is established.

### Forms

The contact form is a translucent white panel on a faint blue grid. Labels sit above fields; fields use 8px corners, white fill, 15px text, and `13px 14px` padding. Focus strengthens the blue border, adds a 4px halo, and lifts the field slightly. The textarea resizes vertically. Submission currently uses `mailto:`; it is not evidence of an in-app success screen or backend contact workflow.

Contributor forms use smaller 12px inputs, 11px labels, 7px corners, and 10px padding. Focus uses a blue border and 3px halo. Opportunity submission has a two-column desktop layout with full-width description and submit rows, then a single column on phones. Optional details use native disclosure controls. Preserve actual required fields and recovery/password flows when generating related screens.

### Opportunities tracker

The public tracker has a short solid-blue hero, pale blue-white page gradient, introductory text beside a contributor-access card, then a large white listing board. Search appears before type filters and a result count. Active filters are navy-filled with white text; final filters have 8px corners, not the pill shape from earlier declarations.

Listing cards use a 14px radius, pale border, near-white gradient, organization mark, title/company identity, clamped three-line summary, compact two-column metadata, and separate detail/application actions. Application links are optional; preserve the unavailable/pending presentation rather than inventing a destination.

The board includes loading text, empty results, filter clearing, and pagination. Runtime content is generated by the tracker script. Contributor workspace tabs expose adding listings, managing listings, and people/access according to permission. These are states of this route, not separate public marketing pages. On phones, filters and workspace tabs scroll horizontally instead of forcing tiny wrapped controls.

Dialogs use native `<dialog>` with bounded viewport height, internal scrolling, visible close buttons, and dark blurred backdrops. Sign-in is at most 680px wide; opportunity details are at most 820px wide with a dark header, pale metadata strip, readable body sections, and an application action. Labels, status regions, hidden states, and permissions are part of the component contract, not just decorative styling.

## Do's and Don'ts

### Do

- **Do** use this document as a source-derived baseline for extending the existing site, and send it explicitly to Stitch because it lives in `docs/`, not at the repository root.
- **Do** preserve the navy, white, silver, and selective gold hierarchy and the exact brand statement.
- **Do** reuse the real event photography, logos, and Poppins stack; keep dark overlays behind white hero copy.
- **Do** distinguish spacious marketing surfaces from the compact tracker workspace.
- **Do** preserve route-specific containers, responsive behavior, shape exceptions, focus treatment, and native interactive elements.
- **Do** verify computed styles and actual rendering at representative desktop and phone sizes before claiming a new implementation matches this baseline.

### Don't

- **Don't** invent a new brand metaphor, alternate font family, universal corner radius, strict spacing grid, or unimplemented dark/light toggle from this extraction.
- **Don't** turn every section into a dark glass card, every CTA into gold, or every label into uppercase. Existing components have distinct treatments.
- **Don't** use stale selectors or earlier declarations without checking the full cascade. `.white` actually sets navy text; its name is not its visual contract.
- **Don't** copy the legacy `script-old.js` as the live interaction reference; `index.html` loads the split scripts instead.
- **Don't** assume all relative image URLs work. Some older CSS references point outside the actual asset directory; follow the active markup and verified asset paths listed above.
- **Don't** claim font-weight availability, complete reduced-motion accessibility, live tracker behavior, or pixel parity from source inspection alone.
- **Don't** invent portal screens, a payment flow for placeholder donate links, or contact submission success states. Those are not established by this codebase.

Format references: [Stitch DESIGN.md overview](https://stitch.withgoogle.com/docs/design-md/overview/) and [specification](https://stitch.withgoogle.com/docs/design-md/specification/). For repository navigation, see [CODEBASE_MAP.md](CODEBASE_MAP.md).
