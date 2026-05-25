# Phoenix Web — Implementation Plan
## UI/UX Refinements + Accessibility (WCAG 2.2 AA)
_Review and confirm before implementation begins._

---

## PHASE 1 — Header & Navigation

### 1.1 Hero logo — bigger
- Increase `hero-flame` max-width from 200px → 280px
- Increase `hero-wordmark` max-width from 440px → 580px
- Adjust vertical gap so flame and wordmark still feel balanced

### 1.2 Search bar — always visible, not an overlay
- **Remove** the search icon + full-screen overlay approach
- **Add** a persistent compact search `<input>` in the header right group (pill shape, ~180px wide on desktop)
- On mobile it collapses to an icon that expands below the header (single-row) — does not cover content
- Remove the `#search-overlay` div and all related JS entirely
- Keep the same content index and scroll-to-section behaviour

### 1.3 Mobile menu — cleanup
- **Remove** "Join Our Community" link from `.mobile-nav`
- **Add** social media icon row (Instagram, Facebook, YouTube, X, LinkedIn) at the **bottom** of the mobile nav drawer
- **Add** social icons to the **right side of the header** bar (visible on desktop, hidden on smallest screens)

### 1.4 Contact scroll fix
- Root cause: `#contact` is on the `<section>` but the header offset calculation uses a CSS variable `--h` that isn't always parsed correctly by `parseInt(getComputedStyle…)` at click time
- Fix: read `header.offsetHeight` directly instead of the CSS variable
- Also ensure the `data-section` attribute on the Contact nav link is `"contact"` (matches `id="contact"`)

---

## PHASE 2 — Branding & Content

### 2.1 Colour palette — match the actual logo
Current state: gradient goes orange → red → pink (`#F5A623 → #E85D04 → #C9184A`)
The logo uses: **warm orange `#F47920`** as primary, with the flame having orange/pink/purple tones
- Adjust `--grad` to a warmer, two-stop gradient: `#F5A623 → #F47920` (pure orange family)
- Remove the pink `#C9184A` as a primary gradient stop (keep as accent only, e.g. join button)
- Update `--red` and `--orange` tokens to match

### 2.2 "Global Majority Movement" hero subtext — reduce
- The `.hero-sub` paragraph is quite long; trim to one concise line or remove entirely
- Move the full tagline to the footer only

### 2.3 Our Impact stat cards — spacing + inner shadow
- Increase gap between cards from `2px` → `16px`
- Add `box-shadow: inset 0 2px 12px rgba(0,0,0,0.45)` to each `.stat-card`
- Slightly increase card padding

### 2.4 Join Our Community — move out of header
- **Remove** `.btn-join` from the `<header>`
- **Add** a new `<section id="join">` positioned between `#news` and `#contact`:
  - Eyebrow label: "Be part of the movement"
  - H2: "Join our community"
  - Short narrative paragraph (2–3 sentences about why to join)
  - Large gradient CTA button
- **Update** nav: replace the "Join our community" link slot with nothing (nav is already cleaned up)
- **Update** mobile nav (already removing it per 1.3)

---

## PHASE 3 — UK Map

### 3.1 Replace custom England SVG with provided UK map
- Copy `unitedkingdommap.svg` to `assets/images/uk-map.svg`
- Embed it inline in `#where-we-work` so JavaScript can interact with it
- Set map fill to `rgba(255,255,255,0.05)`, stroke `rgba(255,255,255,0.12)`
- Scale with `viewBox="0 0 816.4 1080"`, CSS `width: 100%; max-width: 420px`

### 3.2 Overlay 9 region dots at correct UK coordinates
Approximate SVG coordinates (816.4 × 1080 space, verified against coastal path data):

| Region | cx | cy |
|---|---|---|
| North East & Cumbria | 430 | 490 |
| North West | 348 | 530 |
| Yorkshire & Humber | 470 | 530 |
| East Midlands | 470 | 650 |
| West Midlands | 395 | 660 |
| East of England | 545 | 650 |
| Greater London | 525 | 760 |
| South East | 530 | 805 |
| South West | 310 | 840 |

### 3.3 Interactive hover → region data card (floating, not tooltip)
- On dot hover (and keyboard focus), a **positioned card** appears near the dot showing:
  - Region name
  - Active badge
  - Partner organisation name (if linked)
  - "View partner →" link to `#network`
- Card is `position: absolute` within a `position: relative` map container
- Auto-positioned: appears to the right of the dot if room, otherwise left
- Animates in with `opacity + translateY` transition (respects reduced-motion)

---

## PHASE 4 — Components & Layout

### 4.1 Partner cards — overlay instead of layout-shifting accordion
- Current: click expands card inline, pushing siblings down
- New: click opens a **floating overlay panel** anchored to the grid (not modal, not full-screen)
  - The card grid stays at fixed height
  - An absolutely-positioned panel slides up/in above the grid with the partner's full details
  - A close `×` button in the corner dismisses it
  - Clicking outside also closes it
  - Only one panel open at a time
  - Cards themselves keep their float animation when closed

### 4.2 Grants section — smoother, no stacking
- Replace `<details>/<summary>` with custom accordion using CSS `max-height` transitions
- Each step opens with a smooth slide (0.4s ease), not the browser-default snap
- Active step gets a left-border highlight (orange)
- Steps don't push each other — they expand within their container space

### 4.3 News — filterable, clickable, article template
- Filter tabs already work; **add** smooth `opacity + height` transition when hiding/showing cards
- Each `.news-card` becomes a link to `/news/[slug].html`
- **Create** `news/article-template.html` — a reusable article detail page with:
  - Back link to `#news`
  - Hero area (category badge, title, date)
  - Body copy placeholder (easily editable)
  - Related/back navigation
- **Create** 4 article pages: `news/grants-round.html`, `news/strategy.html`, `news/cheltenham.html`, `news/updates.html`

### 4.4 Remove "More stories coming soon" block
- Delete the `.news-more` div from HTML and all associated CSS

---

## PHASE 5 — Accessibility (WCAG 2.2 AA)

### 5.1 Skip link
- Add `<a class="skip-link" href="#main-content">Skip to main content</a>` as first child of `<body>`
- Add `id="main-content"` to the first `<main>` element (wrapping all sections)
- Style: visually hidden until focused, then appears top-left with orange background

### 5.2 Landmarks & structure
- Wrap all sections in `<main id="main-content">` with `role="main"`
- Ensure `<nav>` has `aria-label="Primary navigation"`
- Footer has `role="contentinfo"`
- Each section gets an `aria-labelledby` pointing to its heading

### 5.3 Heading hierarchy
- Hero: no heading (it's branding) — add `<h1 class="sr-only">The Phoenix Community Trust</h1>`
- Each section's `.section-h` is already `<h2>` ✓
- Partner card names: `<h3>` ✓
- News titles: change to `<h3>` (currently `<h3>` ✓)
- Verify no skipped levels

### 5.4 Keyboard accessibility
- All `.partner-float` cards: add `tabindex="0"` and `role="button"` + `aria-expanded`
- All region dots on the SVG map: `tabindex="0"`, `role="button"`, `aria-label="[Region name] — active"`
- Enter/Space key triggers click handlers on all custom interactive elements
- Visible `:focus-visible` ring on all interactive elements (2px orange outline, 2px offset)

### 5.5 ARIA states
- Nav links: `aria-current="page"` when active (use "page" for single-page sections)
- News tabs: `role="tab"`, `aria-controls="news-grid"`, `aria-selected`
- News grid: `role="tabpanel"`, `aria-live="polite"` (announces filter changes)
- Partner overlay panel: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Search input: `role="combobox"`, `aria-autocomplete="list"`, `aria-controls`
- Mobile nav: `aria-expanded` on hamburger, `aria-hidden` on drawer when closed

### 5.6 Reduced motion
```css
@media (prefers-reduced-motion: reduce) {
  /* Disable: float animation, flame float, glow pulse, counter animation,
     dot pulse, scroll parallax, card transitions > 0.1s */
  .partner-float { animation: none; }
  .flame-svg, .hero-glow { animation: none; }
  .dot-pulse { animation: none; }
  .reveal-up { transition: opacity 0.2s; transform: none; }
}
```

### 5.7 Form accessibility
- All `<input>` and `<textarea>` already have `<label for="">` ✓
- Add `aria-required="true"` to required fields
- Add `aria-describedby` linking to a `.form-note` with privacy info
- On submit error: `role="alert"` on error messages
- Success message: `role="status"` on the confirmation

### 5.8 SVG map accessibility
- Add `<title>` and `<desc>` inside the inline SVG
- Add `role="list"` to the dots group, each dot `role="listitem"`
- Add `<ul class="sr-only">` fallback listing all 9 regions with links to `#network`
- Script: add keyboard nav (Tab between dots, Enter activates hover card, Escape closes)

### 5.9 Images & icons
- `hero-flame`: `alt="Phoenix flame logo"` ✓
- `hero-wordmark`: `alt="The Phoenix Community Trust"` ✓
- `footer-logo`: `alt="The Phoenix Community Trust"` ✓
- Social icon SVGs: add `aria-hidden="true"` to decorative SVGs; the `<a>` already has `aria-label` ✓
- Partner card img placeholders: `role="img"` + `aria-label="[Partner name] logo placeholder"`

### 5.10 Colour contrast
- Current muted text `#777` on `#0a0a0a` = ~5.6:1 (AA pass for normal text ✓)
- `rgba(255,255,255,0.25)` on dark = ~1.6:1 (FAIL for footer legal links — increase to 0.45)
- Nav link inactive `rgba(255,255,255,0.55)` ≈ 4.1:1 (borderline — increase to 0.7)
- `.active-pill` green on dark: check green `#22c55e` on `#111` = ~8.2:1 ✓

---

## NEW FILES CREATED
```
assets/images/uk-map.svg         (copied from Desktop)
news/article-template.html       (reusable article layout)
news/grants-round.html
news/strategy.html
news/cheltenham.html
news/updates.html
```

## FILES MODIFIED
```
index.html      — structure changes, new #join section, skip link, landmarks
styles.css      — colours, search, spacing, accessibility styles
script.js       — scroll fix, search inline, map overlay cards, keyboard nav
```

---

## QUESTIONS FOR YOU BEFORE I START

1. **Search bar placement**: Should the inline search sit inside the header (replaces the icon), or below the header as a full-width bar that's always visible?
2. **Partner overlay**: Should opening a partner card show a small floating panel above the grid, or a centred modal with a backdrop?
3. **News articles**: Since this is a static site, article pages will be separate `.html` files. Is that fine, or would you prefer them all on the same page (expand in-place)?
4. **"Join our community" button colour**: Keep pink gradient or switch to the orange-only palette?
5. **UK map dots**: Do you want dots only for the 9 English regions, or all UK regions including Scotland, Wales, Northern Ireland?
