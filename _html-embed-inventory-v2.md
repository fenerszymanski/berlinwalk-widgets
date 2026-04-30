# HTML Embed Inventory v2 — 2026-04-30

Replaces the v1 inventory, which undercounted FAQ by 50%. Source: comprehensive
re-scan of all 81 published posts via Wix Blog API rich content + FAQPage
JSON-LD + `<details>` accordion + `COLLAPSIBLE_LIST` native node detection.

## Summary

- Total posts scanned: 81
- Posts with at least one HTML embed: 22
- Posts with no HTML embeds: 59
- **FAQ count: 14 posts** (v1 said 6 — undercounted by ~2.3×; v2's first pass said 12, missed 2 more whose FAQ embeds use button-based class styling instead of `<details>`)
  - 12 via legacy HTML embed (mix of FAQPage JSON-LD, `<details>`, and class-based button accordions)
  - 2 via Wix-native `COLLAPSIBLE_LIST` rich-content node (invisible to HTML-only scans)
- Audio embeds: ~18 posts (15 legacy mp3 + 3 migrated)
- Summary blocks: ~20 posts (17 legacy + 3 migrated)
- **Standalone CTAs: 2 posts only** (5-best-doner, airport-to-alex — both already migrated). The "BERLIN WALK" string in 4 other posts is the FAQ embed kicker, not a separate CTA. No CTA migration backlog.

## FAQ inventory — full list

| post slug | source | currently in `/faq/data.json`? | FAQ slug |
|---|---|---|---|
| is-the-pergamon-museum-closed-... | legacy HTML embed (FAQPage JSON-LD) | YES | pergamon-closed |
| 5-mistakes-tourists-make-at-alexanderplatz | legacy HTML embed | YES | alex-mistakes |
| where-to-find-free-drinking-water-in-berlin | legacy HTML embed | YES | drinking-water |
| 7-things-most-tourists-dont-know-about-the-berliner-dom | legacy HTML embed | YES | berliner-dom |
| how-to-get-from-berlin-airport-to-alexanderplatz-the-easy-way | legacy HTML embed | YES | airport-to-alex |
| why-berliners-aren-t-rude-they-re-just-honest | legacy HTML embed | YES | why-berliners-rude |
| 5-best-döner-kebab-spots-in-berlin-you-need-to-try-in-2026 | legacy HTML embed | NO | 5-best-doner (TODO) |
| average-temperature-in-berlin-by-month-... | legacy HTML embed (FAQPage JSON-LD + 5 `<details>`) | NO | average-temp (TODO) |
| is-the-berlin-welcomecard-worth-it-in-2026-... | legacy HTML embed `bw-faq-wc` | NO | welcomecard (TODO) |
| are-shops-open-on-sunday-in-berlin-... | legacy HTML embed (FAQPage JSON-LD) | NO | sunday-shops (TODO) |
| humboldt-forum-berlin-free-entry-... | Wix native `COLLAPSIBLE_LIST` | NO | humboldt-forum (TODO — needs Q/A extraction) |
| is-museum-island-free-tickets-... | Wix native `COLLAPSIBLE_LIST` | NO | museum-island-free (TODO — needs Q/A extraction) |

→ **6 new FAQ entries to add** to `/faq/data.json` plus update `inject.js` SLUG_MAP.

## CTA inventory — unmigrated

| post slug | already in `/cta/data.json`? | suggested cta slug |
|---|---|---|
| 5-best-döner-kebab-... | YES | 5-best-doner |
| how-to-get-from-berlin-airport-to-alex... | YES | airport-to-alex |
| do-you-really-need-to-validate-your-ticket-on-berlin-trains | NO | validate-ticket (TODO) |
| is-tap-water-safe-to-drink-in-berlin-... | NO | tap-water (TODO) |
| the-pope-s-revenge-how-east-germany-s-tv-tower-backfired | NO | popes-revenge (TODO) |
| is-the-berlin-welcomecard-worth-it-... | NO | welcomecard-cta (TODO — separate from welcomecard FAQ) |

## Quick-summary / audio inventory

`/quick-summary/data.json` has 14 entries: gift-guide, pergamon-closed, berlin-food,
best-time, transport, where-to-stay, climate, german-phrases, safety, drinking-water,
welcomecard, sunday-shops, 12-stops, museum-pass.

The subagent found ~17 legacy summary embeds and ~15 legacy audio embeds across the
remaining unmigrated posts. The audio + summary already covered by the 14 data.json
entries are in different physical state from post to post — some still have the
legacy inline embed, others have been swapped to `quick-summary/?post=...`. For each
of the 14 entries, the author should walk into the corresponding post and confirm
the swap is done. (User has done some of these already — pergamon, average-temp, etc.)

## Tables / maps / calculators — unmigrated

| post slug | embed | scoped id |
|---|---|---|
| is-berlin-safe-to-visit-... | combo (audio+summary) + safety table + neighborhood map | bw-combo-safe, bw-safety-compare, bw-neighborhood-map |
| berlin-public-transport-explained-... | night-network map + ticket-comparison table | (no scoped ids in user's setup yet, but widgets exist as `transport-pdfs/` and `transport-compare/`) |

## Standalone widgets that exist on GitHub Pages

`alex-mistakes`, `welcomecard-calculator`, `welcomecard-compare`, `transport-calculator`,
`transport-compare`, `transport-pdfs`, `pergamon-timeline`, `pergamon-status`, `gift-finder`,
`avgtemp-bestmonth`, `avgtemp-chart`, `avgtemp-monthly`, `avgtemp-packing`, `avgtemp-traveler`,
`safety-compare`, `safety-map`, `sunday-map`, `museum-island-map`, `drinking-water-map`,
`cta`, `faq`, `lead-form`, `quick-summary`.

## Most important findings

1. **FAQ count was off by 2×.** Six new FAQ posts: 5-best-doner, average-temperature, welcomecard, sunday-shops, humboldt-forum, museum-island-free.
2. **`average-temperature` is a major previously-missed FAQ post** with full FAQPage JSON-LD.
3. **Two posts use Wix-native `COLLAPSIBLE_LIST`** instead of HTML-embed FAQs (humboldt-forum, museum-island-free). These don't appear in HTML-embed scans but ARE FAQ. Migration to `/faq/?post=slug` would also gain them FAQPage JSON-LD via `inject.js`, since native Wix accordion likely doesn't emit schema.
4. **`is-berlin-safe-to-visit` is the most embed-heavy unmigrated post** (3 legacy embeds: combo, safety table, neighborhood map). Widgets already exist on GitHub Pages — just needs Wix-side swap.
5. **`what-to-eat` has 9 tiny inline embeds.** Best consolidated into one widget if migrated, otherwise leave.

## Concrete next-action backlog (ordered by impact)

1. **Add 6 new FAQ entries to `/faq/data.json`** + regenerate `inject.js` SLUG_MAP.
   - 4 need Q/A extraction from rich content (5-best-doner already partly extracted today; average-temp, welcomecard, sunday-shops need scraping; humboldt-forum + museum-island-free need COLLAPSIBLE_LIST extraction).
2. **Add 4 new CTA entries to `/cta/data.json`**: validate-ticket, tap-water, popes-revenge, welcomecard-cta.
3. **Wix-side swaps** for the 4 already-built widgets that still show legacy in some posts (safety post = 3 swaps, transport post = 2 swaps).
4. **Lead-form** across remaining 80 posts — user-side Wix work.
