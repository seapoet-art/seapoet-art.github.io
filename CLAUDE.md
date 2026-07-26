# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static website for author Louise Hayes (seapoet.art) promoting her memoir "Disintegrating Into Adulthood" and her poetry prints. There is no build system, package manager, or test suite — it's plain HTML/CSS/JS served directly by GitHub Pages. The `CNAME` file maps the repo to the custom domain `seapoet.art`.

## Working on this site

There are no build/lint/test commands. To preview changes, open the HTML files directly in a browser (e.g. `index.html`) or serve the directory with any static file server. Deployment is automatic: pushing to `main` publishes straight to GitHub Pages at seapoet.art — there is no CI/build step in between, so whatever is committed is what goes live.

## Live pages

- `index.html` — the homepage (book info, author bio, preview PDF link, poetry prints teaser, awards)
- `poetryprints.html` — a hub page linking to the 4 poetry print category pages below (linked from `index.html`'s "View Prints" button)
- `political-poetry.html`, `sobriety-mental-health-poetry.html`, `ocean-poetry.html`, `miscellaneous-poetry.html` — one page per poetry theme, each a simple image gallery. `political-poetry.html` currently has no prints yet (placeholder "coming soon" message) — check `images/poetry/political/` before assuming it's still empty.

All poetry-print gallery pages share the `.gallery-page`/`.gallery`/`.empty-note` CSS classes (see below) — follow that pattern rather than inventing new markup if another category page is added later.

Old Webflow-era drafts (`index2.html`, `index3.html`, `index_2.html`, `index.html.bak`, `css/webflow.css`, `css/split-opl.webflow.css`, `js/webflow.js`, `js/slideshow.js`) and images only those files referenced were removed in commit `56309b8` — check `<link>`/`<script src>` usage in the live HTML files before assuming any given CSS/JS/image is still wired up if new dead code accumulates again.

## Active assets

- `css/styles.css` — the single, consolidated stylesheet for the whole site (normalize reset + custom styles + poetry-gallery-page styles all live here now; there is no separate `normalize.css` and no per-page inline `<style>` blocks). Styling uses CSS custom properties defined in `:root` at the top of the file (colors, spacing, transitions) — change theme values there rather than hardcoding new ones inline.
- `js/main.js` — vanilla JS, IIFE-wrapped, no dependencies or build step. Loaded only by `index.html`. Handles the loading overlay, smooth-scroll for in-page anchors, auto `target="_blank"`/`rel="noopener noreferrer"` injection on external links, `IntersectionObserver`-based lazy loading, and lightweight `console.log` analytics stubs (no real analytics wired up — see the commented-out GA snippet in `index.html`). The poetry gallery pages don't include it since they have no anchors/external links to enhance.
- `images/poetry/<category>/` holds the poetry print images, one subfolder per theme (`political`, `sobriety-mental-health`, `ocean`, `miscellaneous`) matching the category pages above — add new prints to the matching subfolder rather than dropping them in `images/` directly.
- `images/` (top level) holds book/author/site artwork (mix of `.jpg` and `.webp`, some images provided in both formats for performance — prefer adding new images in both when feasible).
- `content/book_preview.pdf` is linked directly from the homepage as a free preview download.

## Conventions to follow

- Keep accessibility attributes (`aria-label`, `role="img"`, `alt` text, `loading="lazy"`) consistent with the existing pattern when adding new links/images in `index.html`.
- `index.html` carries SEO/social metadata (Open Graph, Twitter Card, `schema.org` `Book` JSON-LD) that must stay in sync with real content — update these together if the book/author details change.
- External links should open in a new tab with `rel="noopener noreferrer"`; `main.js` also enforces this automatically at runtime for any external `http` link missing those attributes.
