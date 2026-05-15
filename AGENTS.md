# Agent Handoff — Berlin Walk

This file is the single source of truth for AI agents (Claude Code, Codex, or others) working on this repo. Read this at the start of every session. Append a one-paragraph entry to `SESSION_LOG.md` at the end.

`README.md` is the user-facing project description and architectural conventions. This file layers on top with operational context: live endpoints, IDs, ongoing work, gotchas.

---

## 1. Project at a glance

- **Site:** Berlin Walk — a free tip-based walking tour of Berlin's historic centre
- **Platform:** Wix Studio (`berlinwalk.com`, site ID `12ee5ea0-70a7-492f-8020-ffb27cbb630f`)
- **Owner:** Yusuf (single operator, also the tour guide)
- **Repo:** `fenerszymanski/berlinwalk-widgets` on GitHub, deployed to `fenerszymanski.github.io/berlinwalk-widgets/` via GitHub Pages
- **Local path:** `/Users/yusufucuz/Documents/New project/berlinwalk-widgets/`

## 2. What lives where

| Folder / file | Purpose |
|---|---|
| `email-journey/` | Markdown drafts for the 7-email post-booking sequence + `mockups/` with browser preview HTML and Wix-paste HTML |
| `leave-review/` | Iframe widget for the per-booking review submission form (`berlinwalk.com/leave-review`) |
| `reviews/` | `bw-reviews` Custom Element + local test page (`berlinwalk.com/reviews`) |
| `testimonials/`, `stats/`, `route/`, `faq/`, `gallery/`, etc. | Homepage Custom Elements — see `README.md` for the full list |
| `lead-form/` | Berlin Essentials email capture iframe widget |
| `free-museums-map/`, `free-museums-compare/` | Post-specific widgets for the free Berlin museums article |
| `blog-workplan.md` | Prioritized list of new blog post ideas checked against the live sitemap |
| `blog-visual-plan.md` | Visual/image plan for current blog drafts before moving them into Wix |
| `blog-drafts/` | Draft blog posts before they are moved into Wix |
| `_audit.md`, `MIGRATION.md`, `_swap-status.md`, etc. | Historical planning docs — read for context only, mostly stale |

## 3. Key live URLs

- `berlinwalk.com/leave-review` — review submission form (iframe of `leave-review/index.html`)
- `berlinwalk.com/reviews` — public review display (Custom Element `bw-reviews`)
- `https://www.berlinwalk.com/_functions/subscribe` — Berlin Essentials lead form
- `https://www.berlinwalk.com/_functions/submitReview` — POST, review submission
- `https://www.berlinwalk.com/_functions/listReviews` — GET, approved reviews
- `https://www.berlinwalk.com/_functions/cancelBookingJourney` — POST, halts 7-email runs on cancellation

All Velo HTTP functions live in `backend/http-functions.js` on the Wix site (not in this repo).

## 4. Brand system

- **Colors:** Green `#1B5E20` (primary), Yellow `#FFE600` (energy), Lime `#7CB342` (accent), Light Green `#C5E1A5` (soft fill), Berlin Red `#E63946` (occasional caution only)
- **Fonts:** Montserrat (default), Merriweather (selective serif for editorial moments)
- **Tone:** First-person Yusuf voice, atmospheric, historically grounded, **no em dashes**, no marketing fluff, confident but restrained
- **Brand guide source:** `BerlinWalk_Brand_Guide_v1_2_revised.pdf` (Yusuf's downloads — not in repo)

## 5. Wix automation: 7-email booking journey

- **Automation ID:** `16a0d96d-9a1d-4107-ad5c-c3d21c6d8da1`
- **Name:** "Berlin Free Walking Tour - Smart Email Journey"
- **Trigger:** Wix Bookings → Session booked, filtered to service `448872c2-4bd8-4f15-8030-594f5b2162c7`
- **Structure:** Branched (CODE_CONDITION right after E1)
  - **TRUE branch** (booking ≥3 days before session): E1 → 6h → E2 → 24h → E3 → 3d before → E4 → 1d before → E5 → 3h before → E6 → 1d after → E7
  - **FALSE branch** (short notice): E1 → 1d before → E5 → 3h before → E6 → 1d after → E7
- **Condition logic:** JavaScript code condition comparing `start_date − 3 days >= booking_creation_date`
- **Cancellation handling:** Separate automation "Cancel 7-email journey on booking cancellation" — Booking Canceled trigger → HTTP POST to `cancelBookingJourney` → calls Wix `cancelEvent` API with `triggerKey=wix_bookings-sessions_booked` and `externalEntityId=bookingId`

## 6. Wix CMS collections

- **`Reviews`** — guest reviews. Fields: bookingId, firstName, lastInitial, showName (boolean), country, rating (1-5), reviewText, tourDate, guestEmail (encrypted), approved (boolean), source ('direct' for site submissions, 'FreeTour.com' for imports), sourceUrl
- Permissions: ANYONE can insert+read, ADMIN-only update+remove
- Moderation gate: `approved=false` by default; `listReviews` only returns `approved=true`

## 7. Working conventions

### Code style
- Custom Elements use light DOM (no Shadow DOM), scoped CSS by component class prefix, guarded `customElements.define()`
- Brand-coloured Wix HTML-block emails use inline CSS only — no `<style>`, no Google Fonts `<link>`, no SVG, no JS, table layouts
- Wix variables in email HTML use `${var_name}` syntax (Wix Bookings trigger payload)

### Wix idiosyncrasies that have bitten us
- **Wix REST API cannot read or write draft automations** (those with `draftInfo` set). Workaround: create new automation via REST instead of patching the draft.
- **Past-due delays cascade-fire emails** — Wix doesn't auto-skip overdue delays in a chain; we solved with the TRUE/FALSE branched structure above.
- **`now()` works in validate but unreliably at runtime** in CONDITION expressions. Use `var('booking_creation_date')` instead.
- **`created_date` is NOT a valid Wix Bookings trigger variable.** The correct name is `booking_creation_date`.
- **Wix AI hallucinates messageIds and claims success without committing changes.** Always verify via REST GET after Wix AI claims a change.
- **The Wix connector can handle reads and smaller REST calls, but large blog draft create payloads with full Ricos JSON + multiple embeds may be unreliable/truncated.** When building rich blog drafts, prefer local REST with `WIX_API_KEY` from Yusuf's clipboard, or create the Wix draft once Yusuf is back on desktop and can provide the key safely.
- **Wix Blog editor may render consecutive Ricos `PARAGRAPH` nodes with no visible paragraph gap after API import.** For API-created blog drafts, insert blank spacer paragraphs (NBSP text) between adjacent body paragraphs after Markdown-to-Ricos conversion, then verify visually in the editor.
- **GitHub Pages deploys can sit Queued 5-15 min** during traffic spikes. Last-Modified header on the deployed asset is the source of truth.
- **Wix Triggered Email templates get garbage-collected** if not referenced. If you delete an automation step, its template may become invisible to subsequent PATCH calls (returns "Message [...] set failed [Deleted]"). Recovery: ask Yusuf for the new messageIds via the Wix dashboard URL trick (the messageId is in the URL when editing a template).

### Wix dashboard URL trick to get a template's messageId
When Yusuf is in the Wix automation editor → email step → "Edit email," the browser URL contains the messageId between `/automations/edit/` and `/content/en`. Example: `…/automations/edit/{MESSAGE_ID}/content/en?...&actionId={ACTION_ID}…`. Ask him for the URL when you need a current messageId.

### Git / deploy workflow
- Yusuf does `git push` and Wix Editor publishing — agents drafting code stage/commit but do not push unless explicitly asked
- GitHub Pages auto-deploys main branch; cache-bust with `?cb={timestamp}` query when verifying changes
- Cloudflare-style `_headers` file in repo root allows iframe embedding from `berlinwalk.com`

### Sensitive data
- The Wix API key (starts with `IST.`) lives in Yusuf's clipboard during sessions that need it, and is pasted into `WIX_API_KEY` constant in `backend/http-functions.js` on the Wix site
- **Never commit or echo this key in chat.** If it leaks, flag for rotation (Wix Dashboard → Settings → API Keys → revoke + regenerate, then update the `WIX_API_KEY` constant).
- Wipe any clipboard storage to `/tmp/wix_key.txt` after each use

## 8. Open items / known TODOs

Pulled from `SESSION_LOG.md` — see that file for active state. As of the latest session:

1. **Test cancel-on-cancel flow end-to-end.** Book + cancel a test tour, verify Velo logs show `cancelEvent status: 200` and E2 doesn't fire at +6h. If the externalEntityId mismatch, debug.
2. **Convert homepage `bw-testimonials`** to read from `listReviews` instead of `testimonials/data.json` so site-submitted reviews flow through to the homepage carousel.
3. **Convert `/leave-review` to a Custom Element** (currently iframe) to fix mobile sizing and match the rest of the site's element pattern. The mobile breakpoint height is the current workaround.
4. **Preview the new Wix blog drafts and add images.** July/August/September Wix drafts exist and GitHub Pages serves their widget data. Commit/push the local ID/log updates, then visually preview the free museums, July, August, and September drafts and add/select cover and inline images using `blog-visual-plan.md`.

## 9. Protocol for ending a session

Append one entry to `SESSION_LOG.md` with:

```markdown
## YYYY-MM-DD — {Agent name}

**Did:** one-line summary of what was accomplished (no more than 3 bullets)

**Changed:**
- `path/to/file.md` — what changed
- Wix: what was changed remotely (collection, automation, page)

**Opened:** any new TODOs (add to AGENTS.md §8 too if durable)
**Closed:** any TODOs resolved (remove from AGENTS.md §8)

**Next session should:** one or two sentences pointing at the next obvious step
```

Keep entries terse. The log is for the next agent to skim in 30 seconds, not a journal.
