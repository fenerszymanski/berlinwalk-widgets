# Drink Alcohol in Public Berlin - Draft Notes

Internal handoff for Yusuf / future agents. Public post copy is in `drink-alcohol-in-public-berlin.body.md`.

## Topic Decision

- Title: `Can You Drink Alcohol in Public in Berlin? Rules Tourists Should Know`
- Focus keyword: `drink alcohol in public Berlin`
- Slug/key: `drink-alcohol-in-public-berlin`
- Category recommendation: `Tourist Tips` + `Berlin Myths`
- Tags: `Berlin alcohol rules`, `Public drinking`, `Späti`, `Berlin nightlife`, `Tourist tips`
- Search intent: Tourist wants to know whether a beer in a park, on the street, on public transport, or near stations is allowed and what local etiquette/rules apply.

## Dedupe Notes

- Wix inventory on 2026-06-27: 145 published posts and 163 drafts.
- Existing adjacent posts: Berlin Beer Gardens, Späti guide, Berlin Night Transport, Pfand, Tap Water/Drinking Water, Berlin Safety.
- No direct published/draft post found for `public drinking`, `drink alcohol in public Berlin`, `smoking`, `alcohol`, or `cannabis`.
- Topic is distinct because it answers the specific public-space rule/etiquette query, with the 2026 Zoo/Ostbahnhof station exception as the current practical hook.

## Research Sources

- S-Bahn Berlin official notice, `Alkoholkonsum verboten!`, 2026-05-05: https://sbahn.berlin/aktuelles/artikel/alkohol-verboten/
  - Key fact: since 2026-05-01, DB model project bans alcohol consumption and open carrying at Bahnhof Zoologischer Garten and Ostbahnhof, including forecourts; licensed gastronomy/shops excepted.
- Berlin.de park rules: https://www.berlin.de/sen/uvk/natur-und-gruen/stadtgruen/oeffentliche-gruen-und-erholungsanlagen/gruenanlagengesetz/parkregeln/artikel.1268137.en.php
  - Key fact: public green-space rules emphasize consideration, protecting green spaces/equipment, and clearing rubbish/dirt.
- BVG Usage Policy: https://www.bvg.de/en/service-and-support/usage-policy
  - Key fact: passengers must follow staff/security instructions; use for transport behavior framing, not as a claim of a blanket BVG alcohol ban.
- German Youth Protection Act §9: https://www.gesetze-im-internet.de/juschg/__9.html
  - Key fact: beer/wine-type drinks not supplied to under-16s; stronger alcohol/special alcohol sweet drinks have stricter youth-protection rules.

## Widget Ideas Considered

1. `Berlin Public Drinking Rule Checker` - choose place/container/time and get a clear "usually okay / close it / do not drink here" recommendation. Selected because it directly helps the tourist make a real decision before opening a drink.
2. `Späti Corner Etiquette Meter` - score whether a Späti pavement stop is socially okay. Useful but too narrow for a full Berlin Tool.
3. `Beer Garden vs Park Picker` - choose mood, toilet need, weather, group size. Useful but overlaps the existing beer gardens surface.

## Selected Widget

- Widget/tool slug: `berlin-public-drinking-rule-checker`
- Blog embed URL target after deploy: `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-public-drinking-rule-checker/`
- BerlinTools status: widget built locally, but BerlinTools surface/CMS is intentionally blocked until a required ChatGPT-browser glossy icon can be generated and uploaded. No placeholder/generic icon should be used.

## Visual Notes

- Final article set: 5 Wikimedia Commons images, contact sheet generated and viewed.
- No AI visuals and no paid image/video API used.
- Cover selected: James-Simon-Park public lawn scene. It was the strongest card-crop signal for relaxed Berlin outdoor public space.
- Rejected: first Zollpackhof image because it was too static/empty and did not read clearly as a public-drinking/beer-garden story at card crop.

## SEO Plan

- SEO title: `Drink Alcohol in Public Berlin: Rules Tourists Should Know`
- Meta description: `Can you drink alcohol in public in Berlin? A tourist guide to parks, Spätis, public transport, Zoo/Ostbahnhof alcohol bans, age rules and local etiquette.`
- Social title: `Can You Drink Outside in Berlin?`
- Social description: `A practical Berlin tourist guide to public drinking, parks, Spätis, trains, station bans and the rules that actually matter.`
- Structured data: BlogPosting JSON-LD in Wix draft SEO data; FAQ JSON-LD via `faq/inject.js` mapping.

## Open TODO

- Generate the dedicated BerlinTools glossy icon through the approved ChatGPT browser workflow, then add a `tools-hub/data.json` entry, upload icon to Wix Media, insert/update BerlinTools CMS item, and patch the BerlinTools Layout Fixes icon map.
