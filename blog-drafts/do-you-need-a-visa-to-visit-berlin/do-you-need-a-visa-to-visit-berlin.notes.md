# Do You Need a Visa to Visit Berlin — research notes (internal)

Drafted 2026-07-18 (Europe/Berlin). Daily-blog automation (Claude), ~07:05 run.

## Topic / SEO
- Title: "Do You Need a Visa to Visit Berlin? Entry Rules, EES and ETIAS Explained (2026)"
- Slug: `do-you-need-a-visa-to-visit-berlin`
- Category: Tourist Tips (pre-trip planning / entry logistics)
- Focus keyword: `do you need a visa to visit Berlin` (isMain)
- Secondary: Berlin entry requirements 2026, Schengen 90/180 rule, EES Berlin airport, ETIAS 2026, visa-free countries Germany, Schengen visa Germany
- Search intent: pre-trip planners (US/UK/CA/AU + non-visa-exempt) asking "do I need a visa for Berlin/Germany", "what is EES", "do I need ETIAS 2026", "how long can I stay".
- Distinct from existing PUBLISHED posts: nothing covers visas/entry/Schengen/EES/ETIAS. Closest are transport/arrival posts (airport-to-Alexanderplatz, BER departure guide) — those are about moving, not about entry eligibility. Completely open gap.

## Verified facts (sources checked 2026-07-18)
- Berlin is in Germany; Germany is in the Schengen Area. No separate "Berlin visa."
- Visa-exempt status depends on the passport/travel document and sometimes residence or family status. Common examples include US, UK, CA, AU, NZ, JP and KR passports; the current German Federal Foreign Office table is the decision source. Visa-exempt short stays are normally capped at 90 days in any rolling 180-day period.
- 90/180: cumulative across ALL Schengen countries; 180-day window is rolling (look back 180 days on any given day); short exits do not reset it. Overstay -> fines / entry ban.
- Non-visa-exempt nationals: need a Schengen short-stay (type C) visa; apply at the German mission for their region (appointment + docs). Apply early.
- EES (Entry/Exit System): FULLY OPERATIONAL across Schengen since 10 April 2026. It normally covers non-EU nationals making a short stay, whether visa-exempt or holding a short-stay visa, but there are exemptions including many residence-permit and long-stay-visa holders. Visa-free travellers normally have a facial image plus four fingerprints stored (children under 12 are not fingerprinted). For short-stay visa holders, EES stores the facial image; fingerprints already collected for the visa remain in VIS and are not stored again in EES. Nothing to apply/pay for; automatic at the border. BER warns longer waits can occur, so give buffer advice.
- ETIAS: NOT yet in force as of mid-2026; applications are not open. Expected Q4 2026 launch, followed by an at-least-six-month transitional period and an at-least-six-month grace period. During transition, travellers should apply but are not refused solely for lacking ETIAS if other entry conditions are met. During grace, ETIAS is generally required with a limited first-entry exception. Travel authorisation (not a visa) for visa-exempt short-stay travellers. Fee 20 EUR. Valid 3 years or until passport expires. Under-18 and over-70 fee-exempt but still normally apply. Warn against paid lookalike sites.
- EU/EEA/Swiss citizens are not subject to the Schengen 90/180 cap, EES or ETIAS. For a short visit, valid passport/ID is the simple rule; stays beyond three months can involve residence conditions and local registration.
- Passport rule of thumb: valid >= 3 months beyond departure, issued within last 10 years.

## Sources (rechecked before drafting)
- German Federal Foreign Office visa table: https://www.auswaertiges-amt.de/en/visa-service/231148-231148
- European Commission short-stay calculator and method: https://home-affairs.ec.europa.eu/policies/schengen/border-crossing/short-stay-calculator_en
- Official EES FAQ, scope and biometrics: https://travel-europe.europa.eu/ees/faq and https://www.travel-europe.europa.eu/en/ees/data-held-by-ees
- Official ETIAS status/timeline: https://travel-europe.europa.eu/en/etias and https://travel-europe.europa.eu/etias/ltr/about-etias/news-corner/revised-timeline-ees-and-etias.html
- Official EU residence guidance: https://europa.eu/youreurope/citizens/residence/residence-rights/index_en.htm
- BER EES guidance: https://ber.berlin-airport.de/en/flying/controls/id-and-passport-control/ees.html

## Internal links used (all PUBLISHED, confirmed in blog-index allPosts)
- /post/berlin-first-time-visitor-mistakes-12-things-to-know-before-you-go
- /post/how-many-days-in-berlin
- /post/how-to-get-from-berlin-airport-to-alexanderplatz-the-easy-way
- /post/berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus
- /post/berlin-ber-airport-departure-guide
External official: EU travel portal (travel-europe.europa.eu).

## Widget
- Slug: `berlin-entry-requirements` — "Berlin Entry Checker + Schengen 90/180 Day Counter"
- Two genuinely useful tools in one card, driven by the article's real reader problem:
  1. Entry checker: pick your passport group (EU/EEA/Swiss, visa-exempt like US/UK, or visa-required) -> plain verdict of what you need now (nothing / EES at border + watch ETIAS / Schengen visa) with 2026 status baked in.
  2. Schengen 90/180 counter: enter planned arrival/departure plus every relevant previous Schengen entry/exit pair. The code checks each planned day against its own preceding 180-day window, deduplicates overlaps, and reports the peak window, first over-limit day, and latest continuous day allowed from the planned arrival.
- NOT a clone of prior picker/planner/checker widgets: distinct two-mode layout, a real rolling-window calculation using exact date ranges, and status-aware verdict copy.

## Widget ideas considered
1. Entry checker + 90/180 counter (CHOSEN) — answers both live reader questions.
2. EES "what happens at the kiosk" step walkthrough (too thin/static).
3. ETIAS countdown + eligibility (weak until ETIAS actually launches; risk of going stale).

## Images (4, all licensed — see visual-sources.md)
1. Brandenburg Gate morning (cover) — welcome-to-Berlin
2. EU biometric passport — passport-validity / who-is-visa-free section
3. EES kiosks (real) — the 2026 border change
4. Central Berlin dusk skyline — closing / once you are in
