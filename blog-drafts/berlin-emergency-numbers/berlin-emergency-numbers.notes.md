# Berlin Emergency Numbers — production notes (internal)

Run: 2026-07-18 ~17:05 CEST daily-blog automation (Claude), third package of the day.
Topic distinct from all 230 published + 2 unpublished drafts (smoking-in-berlin,
do-you-need-a-car-in-berlin) and 88 local body drafts. No emergency post exists.

## Slug / SEO
- Slug: `berlin-emergency-numbers`
- Focus keyword: `Berlin emergency numbers` (isMain)
- Category: Tourist Tips (id 6da64e22-3360-42ec-a558-e906e4deeb19)
- Search intent: safety/logistics — "what number do I call in Berlin", 112 vs 110,
  night pharmacy, stolen wallet/passport, doctor when it's not life-threatening.

## Verified facts (WebSearch 2026-07-18)
- 112 = ambulance + fire brigade (medical emergencies, danger to life, fire).
  Free, works without SIM/credit, EU-wide single emergency number, English-speaking
  dispatch available in Berlin.
  Sources: iamexpat.de/expat-info/emergency-numbers-services-germany,
  berlin.de/en/tourism/travel-information/1748526-2862820-emergency-services-pharmacies.en.html
- 110 = police (crime, theft, assault, serious traffic accidents).
- 116117 = non-emergency on-call medical service (ärztlicher Bereitschaftsdienst),
  24/7, for a doctor when it is NOT life-threatening (nights/weekends when practices closed).
- Apotheken-Notdienst = rotating emergency pharmacies for nights/Sundays/holidays.
  Find via Apothekerkammer Berlin Notdienstfinder (akberlin.de) or aponet.de.
  Emergency fee applies 20:00–06:00 and all day Sun/holidays (small, ~2.50 EUR).
  Source: berlin.de tourism page, akberlin.de/patientinnen/notdienstfinder
- Giftnotruf (poison control) Charité: 030 19240, 24/7.
  Source: giftnotruf.charite.de/en/
- Berliner Krisendienst (psychological/mental-health crisis): region-based lines,
  around the clock; central line commonly cited as (030) 390 63 10.
  Source: berliner-krisendienst.de/en/  (link readers there for the right regional line)
- Lost/stolen bank + credit cards: 116 116 central German card-blocking hotline
  (Sperr-Notruf); from abroad +49 116 116. Block first, then police report.
- Lost/stolen passport: file a police loss report (Verlustanzeige) — Berlin police
  Internetwache online or at a station — then contact your embassy/consulate for an
  emergency travel document. The police report is also what a travel insurer needs
  for stolen items.

## Internal links (published, verified live slugs)
- /post/pharmacy-in-berlin
- /post/doctor-in-berlin
- /post/lost-property-berlin  (distinct: items left on transport, BVG Fundbüro)
- /post/berlin-tourist-scams
- /post/is-berlin-safe-to-visit-an-honest-2026-guide
- Tool: /tools/pharmacy-in-berlin-helper (medical routing sub-case)

## External links (official)
- 112: European emergency number (112.eu) / berlin.de tourism emergency page
- 116117: 116117.de
- akberlin.de Notdienstfinder (emergency pharmacy)
- berliner-krisendienst.de/en

## Widget: berlin-emergency-numbers (Berlin Emergency Number Finder)
Fresh interaction (NOT a picker/checker clone): reader taps the situation that fits
their moment; the panel resolves to the ONE number to dial, whether it is free,
a short "what to say" script (with the German line), and the next practical step.
Distinct from pharmacy-in-berlin-helper (that routes medical/pharmacy only; this
covers crime, passport, fire, cards, poison, crisis + the 112-vs-110 core decision).

## Images (planned, non-paid/free only)
- Cover: Berliner Feuerwehr ambulance with 112 livery (Wikimedia Commons, CC).
- Inline: Polizei Berlin car; Apotheke / Notdienst pharmacy sign; phone dialing 112;
  Berlin street/Charité context.
Reject accident/injury/blood/protest imagery.
