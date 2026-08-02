# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static website for author Louise Hayes (seapoet.art) promoting her memoir "Disintegrating Into Adulthood" and her poetry prints. There is no build system, package manager, or test suite — it's plain HTML/CSS/JS served directly by GitHub Pages. The `CNAME` file maps the repo to the custom domain `seapoet.art`.

## Working on this site

There are no build/lint/test commands. To preview changes, open the HTML files directly in a browser (e.g. `index.html`) or serve the directory with any static file server. Deployment is automatic: pushing to `main` publishes straight to GitHub Pages at seapoet.art — there is no CI/build step in between, so whatever is committed is what goes live.

## Live pages

- `index.html` — the homepage (book info, author bio, preview PDF link, poetry prints teaser, awards). Must stay at the repo root — GitHub Pages serves this file directly for `https://seapoet.art/`; only `index.html` and `CNAME` live at the root, every other HTML page lives under `content/`.
- `content/poetryprints.html` — the single poetry-prints gallery page (linked from `index.html`'s "View Prints" button). Every poem lives here as a `<figure class="poem" data-tags="...">` — `data-tags` holds one or more space-separated tag slugs (`political`, `sobriety`, `mental-health`, `ocean-theme`, `miscellaneous`; a poem spanning multiple tags just gets multiple slugs, e.g. `data-tags="sobriety mental-health"`). A client-side tag filter (`js/poetry-filter.js`) lets viewers narrow the view to one tag at a time via pill buttons; without JS every poem stays visible (progressive enhancement, not a hard requirement). The same script paginates the gallery at 10 poems per page (recomputed against whichever tag filter is active) with Prev/Next controls below the grid — see `.pagination`/`.pagination-btn`/`.page-indicator` in `css/styles.css`.

The `.gallery-page`/`.gallery`/`.empty-note` CSS classes (see below) are shared scaffolding for this page — follow that pattern rather than inventing new markup if the gallery structure changes again. `.empty-note` is shown by `js/poetry-filter.js` when a tag filter matches zero poems (there's always at least one poem per tag today, so this is dormant until a category is emptied out).

**`POETRY-IMAGES.md`** (repo root) is a running checklist of every file in `images/poetry/<category>/` vs. what's actually wired into `content/poetryprints.html`, including each poem's current tag(s). The site owner uploads new prints directly to the category folders from her phone (see workflow below) — check this file first when asked to review poetry images, and keep it in sync whenever the gallery is edited.

Old Webflow-era drafts (`index2.html`, `index3.html`, `index_2.html`, `index.html.bak`, `css/webflow.css`, `css/split-opl.webflow.css`, `js/webflow.js`, `js/slideshow.js`) and images only those files referenced were removed in commit `56309b8` — check `<link>`/`<script src>` usage in the live HTML files before assuming any given CSS/JS/image is still wired up if new dead code accumulates again.

## Active assets

- `css/styles.css` — the single, consolidated stylesheet for the whole site (normalize reset + custom styles + poetry-gallery-page styles all live here now; there is no separate `normalize.css` and no per-page inline `<style>` blocks). Styling uses CSS custom properties defined in `:root` at the top of the file (colors, spacing, transitions) — change theme values there rather than hardcoding new ones inline.
- `js/main.js` — vanilla JS, IIFE-wrapped, no dependencies or build step. Loaded only by `index.html`. Handles the loading overlay, smooth-scroll for in-page anchors, auto `target="_blank"`/`rel="noopener noreferrer"` injection on external links, `IntersectionObserver`-based lazy loading, and lightweight `console.log` analytics stubs (no real analytics wired up — see the commented-out GA snippet in `index.html`). The poetry gallery page doesn't include it since it has no anchors/external links to enhance.
- `js/poetry-filter.js` — vanilla JS, same IIFE house style as `main.js`, loaded only by `content/poetryprints.html`. Implements the tag-filter click handling described above (matches a poem's `data-tags` against the clicked pill) plus pagination: it slices whatever the current filter matches into pages of 10, toggles the native `hidden` attribute on everything outside the current filter+page, updates `aria-pressed`/pagination button `disabled` state, and updates an `aria-live` status region with the visible range (e.g. "Showing 11–20 of 28 poems"). Changing the tag filter resets to page 1. Kept as a separate file rather than folded into `main.js` since it's specific to this one page's markup and `main.js` is otherwise page-agnostic.
- `images/poetry/` holds all poetry print images in a single flat folder (no per-category subfolders — a poem's tags in `content/poetryprints.html` are what categorize it, not its file location). Filenames use hyphens, not underscores (e.g. `sun-kissed.jpg`), and are typically derived from the poem's title (spaces → hyphens, punctuation dropped). The site owner uploads new prints directly to this folder from her phone via GitHub's upload URL (`github.com/<owner>/<repo>/upload/main/images/poetry`) — new files can show up before the matching `<img>` tag is added to the page, which is what `POETRY-IMAGES.md` tracks.
- `images/` (top level) holds book/author/site artwork (mix of `.jpg` and `.webp`, some images provided in both formats for performance — prefer adding new images in both when feasible).
- `content/book_preview.pdf` is linked directly from the homepage as a free preview download.

## Conventions to follow

- Keep accessibility attributes (`aria-label`, `role="img"`, `alt` text, `loading="lazy"`) consistent with the existing pattern when adding new links/images in `index.html`.
- `index.html` carries SEO/social metadata (Open Graph, Twitter Card, `schema.org` `Book` JSON-LD) that must stay in sync with real content — update these together if the book/author details change.
- External links should open in a new tab with `rel="noopener noreferrer"`; `main.js` also enforces this automatically at runtime for any external `http` link missing those attributes.
