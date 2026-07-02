# Berlin AB or ABC Ticket Zones - Internal Package Notes

Date: 2026-07-02 Europe/Berlin

Public post language: English. Internal handoff language: Turkish. Final Wix state target: UNPUBLISHED draft.

## Topic Decision

Chosen topic: `Berlin AB or ABC Ticket: Which Zone Do Tourists Need?`

Focus keyword: `Berlin AB or ABC ticket`

Slug: `berlin-ab-abc-ticket-zones`

Category: Tourist Tips

Why this topic: The existing published transport guide and `transport-ticket-calculator` explain the broader system. This draft stays narrower: it solves the recurring tourist-intent zone mistake around AB vs ABC, especially BER Airport, Potsdam and Oranienburg/Sachsenhausen. It is distinct enough from `Berlin Public Transport 2026`, `Berlin Airport to Alexanderplatz`, `BER Airport Departure Guide`, `Sachsenhausen from Berlin`, and `Best Day Trips from Berlin`.

## Dedupe Notes

- Existing published overlap: `berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus` includes a general transport overview.
- Existing tool overlap: `transport-ticket-calculator` compares many ticket products. The new tool does not compete as a fare calculator; it is a zone decision storyboard.
- Existing article overlap: `berlin-ber-airport-departure-guide`, `how-to-get-from-berlin-airport-to-alexanderplatz-the-easy-way`, and `best-day-trips-from-berlin` mention ABC in context, but none own the keyword/intent `Berlin AB or ABC ticket`.

## Research Sources Checked

- BVG tariff zones and information: https://www.bvg.de/en/subscriptions-and-tickets/tariff-zones-and-information
- BVG FAQ for tourists: https://www.bvg.de/en/tourists/faq-tourists
- VBB single fare ticket: https://www.vbb.de/en/tickets/single-fare-tickets/single-fare-ticket/
- VBB 24-hour ticket / day pass: https://www.vbb.de/en/tickets/day-passes/day-pass/
- S-Bahn Berlin fare zones: https://sbahn.berlin/en/tickets/the-vbb-fare-explained/fare-zones/
- S-Bahn Berlin BER Airport: https://sbahn.berlin/en/plan-a-journey/information-for-berlin-visitors/berlins-berlin-brandenburg-ber-airport/
- VBB BER Airport: https://www.vbb.de/en/driving-information/ber-airport/

Current fact snapshot from official pages on 2026-07-02:

- VBB single fare Berlin AB: EUR 4.00 regular / EUR 2.50 reduced.
- VBB single fare Berlin ABC: EUR 5.00 regular / EUR 3.50 reduced.
- VBB 24-hour Berlin AB: EUR 11.20 regular / EUR 7.40 reduced.
- VBB 24-hour Berlin ABC: EUR 12.90 regular / EUR 8.00 reduced.
- BVG tourist FAQ: Zone A is city center including S-Bahn Ring; B is city outskirts up to city limits; C includes Berlin suburbs, Potsdam and BER Airport.
- S-Bahn BER page: BER Airport is in fare zone C.

## Widget Ideas Considered

1. Zone Storyboard: user adds BER, Potsdam, Oranienburg, city-only, hotel edge and airport-day cards to a route tray; output is AB/ABC/extension logic. Chosen because it maps to the real reader problem.
2. Ticket Price Comparator: compare single, 24-hour, small group and extension tickets. Rejected as too close to the existing `transport-ticket-calculator`.
3. Zone Quiz: quick yes/no questions and score. Rejected because it feels generic and less useful than seeing route segments.

Chosen tool: `berlin-zone-ticket-decoder`

## Visual Policy

Article images: real/Wikimedia or previously sourced BerlinWalk Wikimedia assets only.

AI visuals: one built-in Codex image generation asset for the BerlinTools icon. No paid image API, CLI generation, or local placeholder drawing.

Built-in icon prompt/output:

- Source output: `tools-home/icons/_src/chatgpt-standard-20260612/berlin-zone-ticket-decoder/codex-imagegen-icon.png`
- Canonical 512: `tools-home/icons/berlin-zone-ticket-decoder.png`
- Canonical 160: `tools-home/icons/berlin-zone-ticket-decoder-160.png`
- Prompt: see `tools-home/icons/_src/chatgpt-standard-20260612/berlin-zone-ticket-decoder/PROMPT.md`

## SEO Plan

- Wix title/H1: `Berlin AB or ABC Ticket: Which Zone Do Tourists Need?`
- SEO title: `Berlin AB or ABC Ticket: Fare Zones for Tourists`
- Meta description: `Berlin AB or ABC ticket guide for tourists: when AB is enough, when ABC is needed for BER Airport, Potsdam or Oranienburg, and how to avoid zone mistakes.`
- Excerpt: `A clear Berlin ticket-zone guide for tourists deciding between AB and ABC: city sightseeing, BER Airport, Potsdam, Oranienburg, 24-hour tickets and extension tickets.`
- Categories: Tourist Tips
- Tags: Berlin AB or ABC Ticket, Berlin Ticket Zones, BVG Tickets, Berlin Public Transport, BER Airport, Potsdam

## QA Targets

- Body validator must pass.
- Wix draft must remain UNPUBLISHED.
- Rich-content body HEADING level 1 count must be 0.
- 5 image nodes with alt text.
- Captions after every inline image must be Ricos paragraphs with center alignment, italic, and 12px font.
- 3 HTML embeds: Quick Summary, widget, FAQ.
- No internal source/process leak terms in public body.
