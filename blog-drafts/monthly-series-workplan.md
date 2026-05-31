# Monthly "Berlin in [Month]" Series — Workplan

Goal: complete the 12-month series. **Done (4):** June (legacy slug `visiting-berlin-in-june`),
July, August, September. **To produce (8):** October, November, December, January, February,
March, April, May.

**Publish order (agreed):** October → November → December → January → February → March → April → May.
(Front-loads autumn + Christmas = high search intent; then early-2027 planning.)

**Delivery (agreed):** write all 8 drafts in bulk (local `.md` in `blog-drafts/`), Yusuf publishes in Wix.
Do NOT touch the June post for now.

## Per-post requirements (Yusuf, 2026-05-31)

1. **Research:** get detailed, current info and **confirm key facts from multiple sources**
   (weather from Berlin.de + one more; event dates from the official event site + one more;
   daylight from timeanddate). List sources at the end like the existing drafts.
2. **Images:** find **2–3 images** per post, the **first one at the very top = the blog hero image**.
   Source CC/PD from Wikimedia Commons; download to `blog-drafts/images/berlin-in-<month>/`;
   write **alt text** for each; record attribution/license in the draft. Mark which is the hero.
3. **SEO settings:** front matter with meta title (~55–60 chars), meta description (~150–155),
   slug `berlin-in-<month>-2026`, primary + secondary keywords, OG note.
4. **Focus keyword** = `Berlin in <Month>`. Must appear in the **H1**, in **at least one H2**,
   and **at least once in the body**. (e.g. H2 "What to Pack for Berlin in October" already
   contains it; also use it naturally in the intro/weather sections.)

## Standard structure (match the September draft)

Front matter → Widget Plan (7 embeds) → Quick Summary (5 bullets) → Draft sections:
Intro · Is <Month> a Good Time to Visit Berlin? · Berlin Weather in <Month> · The Light Changes
(daylight + clock change) · What Tourists Get Right/Wrong · Major Berlin Events in <Month> 2026
(+ per-event H2s) · What to Pack for Berlin in <Month> · What to Book Early · Public Transport ·
A Good <Month> Day in Berlin · Where to Stay · My Honest Advice · Sources to Check Before Publishing.
~1,800–2,200 words. Tone: first-person Yusuf, atmospheric, no em dashes, no fluff.

Internal links each post: the month-by-month "best time to visit" hub, adjacent months
(via months-nav), + 4–6 relevant evergreen guides (transport, packing/weather, budget, rain, etc.).

## Widget embeds (per `?month=` param)

quick-summary · monthly-weather · daylight-visualizer · month-comparison · itinerary-card · faq · months-nav.

**Widget data gap to fill (prerequisite):** add the 8 new months to:
- `month-comparison/data.json` (has Jun–Oct partial; add Jan,Feb,Mar,Apr,Nov,Dec)
- `daylight-visualizer/data.json` (add Jan,Feb,Mar,Apr,May,Oct,Nov)
- `itinerary-card/data.json` (add all 8)
`monthly-weather` and `months-nav` already cover 12 months. ✅

## Per-month signature angle (anchor each post; verify exact 2026/27 dates at write-time)

- **October** — autumn colours; Festival of Lights; **German Unity Day (Oct 3)**; clocks back (last Sun).
- **November** — quietest/moody; **Fall of the Wall (Nov 9)**; Christmas markets open ~last week.
- **December** — **Christmas markets** (Gendarmenmarkt etc.); shortest days; **NYE at Brandenburg Gate**.
- **January** — coldest/cheapest/quietest; Grüne Woche; Fashion Week; Transmediale; indoor/museum month.
- **February** — winter; **Berlinale** film festival; days lengthening.
- **March** — early spring, variable; clocks forward; ITB Berlin; shoulder season.
- **April** — spring/blossoms; Easter; **Gallery Weekend**; Walpurgisnacht (Apr 30).
- **May** — often best weather, long days; **Karneval der Kulturen**; May 1 / MyFest; Pokalfinale.

## Workflow per post
1. Multi-source research (events/weather/daylight) → verify.
2. Source 2–3 Commons images (+ alt text, attribution); download to images folder.
3. Write the `.md` draft to the template, with SEO front matter + focus-keyword placement.
4. (Separately) top up the 3 widgets' month data.
Yusuf then creates the Wix draft, uploads images (sets hero), pastes SEO, embeds widgets, publishes.
