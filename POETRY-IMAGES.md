# Poetry Image Tracker

Running list of what's in `images/poetry/` vs. what's actually wired into `content/poetryprints.html`. Update this whenever images are added or the gallery is edited, so it's always clear what's pending review.

`images/poetry/` is a single flat folder (no per-category subfolders) — poems carry one or more tags instead of living in a themed directory.

Filenames use hyphens, not underscores (e.g. `sun-kissed.jpg`) — keep new uploads consistent with this.

Tags are one or more of: `political`, `sobriety`, `mental-health`, `ocean-theme`, `miscellaneous` (space-separated in `data-tags` when a poem carries more than one).

| Image file | Poem title | Tags | On page? |
|---|---|---|---|
| `more-than-thoughts-and-prayers.jpg` | More Than Thoughts and Prayers | political | Yes |
| `july-4th.jpg` | July 4th | political | Yes |
| `heres-your-fcking-poem.jpg` | Here's Your F$cking Poem | political | Yes |
| `renee-nicole-good.jpg` | Renee Nicole Good | political | Yes |
| `alex-jeffrey-pretti.jpg` | Alex Jeffrey Pretti | political | Yes |
| `red-line.jpg` | Red Line | political | Yes |
| `the-schoolgirls-of-minab.jpg` | The Schoolgirls of Minab | political | Yes |
| `there-is-no-hierarchy-in-death.jpg` | There is No Hierarchy in Death | political | Yes |
| `fifty-stars.jpg` | Fifty Stars | political | Yes |
| `i-dissent.jpg` | I Dissent | political | Yes |
| `reparations.jpg` | Reparations | political | Yes |
| `sometimes-you-need-to-go-low-to-scrape-the-sht-off-your-shoes.jpg` | Sometimes You Need to Go Low to Scrape the Sh*t off Your Shoes | political | Yes |
| `biddeford-maine.jpg` | Biddeford, Maine | political | Yes |
| `moral-referendum.jpg` | Moral Referendum | political | Yes |
| `alysa-liu.jpg` | Alysa Liu | political | Yes |
| `bigger-than-me.jpg` | Bigger Than Me | sobriety, mental-health | Yes |
| `dancing-with-angels.jpg` | Dancing With Angels | sobriety, mental-health | Yes |
| `bleary-eyed-to-the-sun.jpg` | Bleary Eyed To The Sun | sobriety, mental-health | Yes |
| `newfound-happy-hour.jpg` | Newfound Happy Hour | sobriety, mental-health | Yes |
| `the-moments-in-between.jpg` | The Moments In Between | sobriety, mental-health | Yes |
| `sun-kissed.jpg` | Sun-Kissed | ocean-theme | Yes |
| `one-step-at-a-time.jpg` | One Step At A Time | ocean-theme | Yes |
| `to-dream.jpg` | To Dream | ocean-theme | Yes |
| `legacy.jpg` | Legacy | ocean-theme | Yes |
| `sea-summons.jpg` | Sea Summons | ocean-theme | Yes |
| `the-artists-curse.jpg` | The Artist's Curse | miscellaneous | Yes |
| `art-is-not-for-keeping.jpg` | Art Is Not For Keeping | miscellaneous | Yes |
| `four-green.jpeg` | Four Green | miscellaneous | Yes |

**Skipped from the 2026-08-02 political batch** (not added as gallery entries):
- `image0.jpeg` — byte-identical duplicate of the already-published `more-than-thoughts-and-prayers.jpg`.
- `image16.jpeg` — a titleless pull-quote graphic ("Those who broke the walls...") pulled from the `reparations.jpg` poem, not a standalone poem.

The five former `sobriety-mental-health` poems were split into two tags (`sobriety` + `mental-health`) applied to all five, since the site previously treated them as one combined category and there's no reliable way to tell which single tag fits each poem best from the title alone — revisit if the site owner wants to narrow any of them to just one tag. `ocean` was renamed to `ocean-theme` (same five poems, no re-categorization needed).

Pagination shows 10 poems per page (see `js/poetry-filter.js`); this table's "On page?" column tracks whether an image is wired into the gallery markup at all, not which page it lands on.

_Last reviewed: 2026-08-02 — all images currently in `images/poetry/` are on the page._
