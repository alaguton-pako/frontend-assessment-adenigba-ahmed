# Pokémon Explorer — Checkit Frontend Assessment

A browsable, searchable Pokémon encyclopedia built with Next.js 16, TypeScript, and Tailwind CSS. Deployed on Cloudflare Workers via OpenNext.

**Live URL**: https://pokemon-content-explorer-app.pokemon-content-explorer-ahmed-adenigba.workers.dev

---

## Setup

```bash
git clone <repo-url>
cd pokemon-content-explorer-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). That's it — no API keys needed, PokéAPI is fully public.

---

## Why PokéAPI?

No API key, no rate limit headaches, stable endpoints, rich data, and good documentation. It also has a dedicated `/type/:name` endpoint that made server-side type filtering straightforward — more on that below.

---

## Architecture Decisions

### Folder Structure

```
app/                  → Next.js App Router pages, layouts, loading/error states
components/ui/        → Reusable UI components (card, pagination, search)
lib/                  → All API calls live here — components never call fetch() directly
types/                → Shared TypeScript interfaces
features/             → Feature-scoped logic (search and filter hook)
```

The rule of thumb was: if a component needs data, it asks `lib/` for it. If it needs to know the current URL state, it reads from the router. Nothing fetches data inline inside JSX.

### Pagination over Infinite Scroll

Pagination was the right call here for two reasons. First, it plays nicely with server-side rendering — each page is a clean URL that can be cached, shared, and bookmarked. Infinite scroll typically needs a client-side state machine to track what's loaded, which fights against SSR. Second, pagination makes the "20 items per page" requirement explicit and verifiable.

Think of it like chapters in a book vs. a never-ending scroll of paper — chapters are easier to navigate back to.

### Server-Side Filtering

Early in development, filtering was client-side — fetch 100 Pokémon, filter in the browser. This was the obvious first approach but had a real limitation: searching "char" would only find Pokémon in the current 100, not across all 1302.

The fix was to move filtering to the server:

- **Name search**: fetches all 1302 Pokémon names (the response is tiny — just names and URLs, no images or stats) and filters server-side. This list is cached via ISR so it's not a live request on every search.
- **Type filter**: PokéAPI has a `/type/fire` endpoint that returns every Fire-type Pokémon. We call this on the server and return only the matching slice for the current page.

The analogy: instead of downloading an entire library to your laptop and searching locally, we're asking the librarian (the server) to hand us only the relevant books.

### No TanStack Query

The assessment lists TanStack Query as preferred for client-side data fetching. I intentionally skipped it because there is no meaningful client-side data fetching in this app. All filtering, searching, and pagination happens on the server via Next.js Server Components. TanStack Query solves problems like caching client requests, background refetching, and optimistic updates — none of which apply here. Adding it would have been adding a dependency to solve a problem we don't have.

### No Dynamic Imports

`SearchAndFilter` was the one component considered for `next/dynamic` (lazy loading). The decision was to leave it as a regular import because it's a lightweight component — two inputs and a select. The overhead of a dynamic import (an extra network round trip, potential layout shift while it loads) would have made the page feel slower, not faster. Dynamic imports are the right tool for heavy components like rich text editors or chart libraries — not for a search bar.

---

## Performance Optimizations

### 1. `next/image` with Priority Loading

All Pokémon card images use `next/image` with explicit `sizes` attributes. The first four cards (above the fold) get `priority={true}` which injects `fetchpriority="high"` into the HTML, telling the browser to load those images before anything else.

### 2. ISR Caching (`revalidate: 3600`)

Every API call in `lib/pokemon-api.ts` uses `next: { revalidate: 3600 }`. This means the first visitor triggers a real API call to PokéAPI, and for the next hour every other visitor gets the cached response instantly. After an hour, the cache refreshes in the background while still serving the old content — so there's never a slow request for a real user.

The type list (`/type?limit=18`) uses `revalidate: 86400` (24 hours) since Pokémon types essentially never change.

### 3. Font Optimization with `next/font`

Inter is loaded via `next/font/google` with `display: "swap"`. Without this, the browser holds off rendering text until the font downloads — a measurable delay. With `swap`, text renders immediately in a system font and switches to Inter once it's ready. The font is also exposed as a CSS variable (`--font-inter`) so it's consumed cleanly across the app.

### 4. Server Components by Default

`PokemonCard` ships zero JavaScript to the browser — it's a Server Component. No `"use client"` means no hydration cost, no bundle weight. The only client components are ones that genuinely need interactivity: `SearchAndFilter` (manages input state) and `Pagination` (handles navigation).

### 5. Preconnect to Image Origin

```html
<link rel="preconnect" href="https://raw.githubusercontent.com" />
```

This tells the browser to establish a connection to GitHub's CDN before it even starts parsing the page content. By the time the image requests fire, the connection is already open — shaving ~100ms off the LCP.

---

## Lighthouse Results

### Desktop
| Metric | Score |
|--------|-------|
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

### Mobile
| Metric | Score |
|--------|-------|
| Performance | 85 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

The mobile performance gap is expected — mobile Lighthouse simulates a slow 4G connection and a mid-range device. The main contributor is LCP (the above-the-fold Pokémon images), which are served from GitHub's CDN rather than an optimized image pipeline. With more time, serving images through Cloudflare Images or a dedicated CDN would close this gap.

**Accessibility fix applied**: The type filter `<select>` and search `<input>` originally had no associated labels, which screen readers announced as generic unnamed controls. Fixed by adding `sr-only` labels with matching `id`/`htmlFor` pairs — invisible to sighted users, correctly announced by screen readers.

---

## Bonus Tasks

### B-1: Cloudflare Workers Edge Caching (+4 pts)

The app is deployed via OpenNext's Cloudflare adapter, which maps Next.js fetch cache semantics to the Workers runtime as follows:

| Next.js | Cloudflare Workers equivalent |
|---------|-------------------------------|
| `revalidate: 3600` | Cached at the edge for 1 hour, then revalidated |
| `force-cache` | Served from edge cache indefinitely until manually purged |
| `no-store` | Bypasses edge cache entirely, always hits origin |

The listing page (`/`) sets explicit `Cache-Control` headers:

```
Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400
x-cache-status: MISS
```

You can verify caching behaviour with:

```bash
curl -I https://pokemon-content-explorer-app.pokemon-content-explorer-ahmed-adenigba.workers.dev/
```

On first request: `x-cache-status: MISS` (cache cold, hitting origin).
On subsequent requests: Cloudflare's own `cf-cache-status: HIT` header will appear, confirming the edge is serving cached content.

### B-3: Accessibility Audit (+3 pts)

Lighthouse accessibility audit run on production build.

**Score: 100/100 on desktop, 100/100 on mobile.**

Issues found and fixed:
- `<select>` for type filter had no associated label → added `sr-only` label with `htmlFor`
- `<input>` for search had no associated label → added `sr-only` label with `htmlFor`
- Clear button had no accessible name → added `aria-label="Clear search and filters"`

No known remaining accessibility issues.

---

## Trade-offs & Known Limitations

- **Images not optimized by Next.js on Cloudflare**: `unoptimized: true` is set in `next.config.ts` because the Next.js image optimization server doesn't run on Cloudflare Workers. Images are served directly from GitHub's CDN. This affects mobile LCP but is a known constraint of the deployment target.

- **Name search fetches 1302 entries**: PokéAPI has no server-side name search endpoint, so searching by name requires fetching all Pokémon names. This list is ~60KB, cached via ISR, and contains no images — so in practice it's fast. With more time, a dedicated search index (Algolia, or even a simple KV store on Cloudflare) would be the right solution.

- **Type + name combined filter**: When both a type filter and a name search are active, we fetch the full type list and filter by name in memory. This is correct and fast for the current dataset but would need rethinking at a larger scale.

## What I'd tackle next with 2 more hours

1. Add Cloudflare KV for persistent ISR caching across Worker instances — right now each Worker instance has its own cache, so the first request to a cold instance always hits origin.
2. Implement `generateStaticParams` for the first 151 Pokémon detail pages so they're pre-rendered at build time rather than on demand.
3. Add type-specific background colors to cards (fire = warm red, water = blue, etc.) — small detail but makes the grid much more visually scannable.   