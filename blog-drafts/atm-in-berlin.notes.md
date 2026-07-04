# ATM in Berlin Draft Notes

Run date: 2026-07-04 Europe/Berlin

## Topic decision

- Working title: `ATM in Berlin: Cash, Fees and Safer Withdrawal Tips for Tourists`
- Focus keyword: `ATM in Berlin`
- Slug: `atm-in-berlin`
- Category: `Tourist Tips`
- Tags: `ATM in Berlin`, `Berlin Money`, `Cash Withdrawal`, `Berlin Tourist Tips`, `Travel Money`, `Berlin Cash`
- Search intent: high-intent Berlin tourists who need practical money advice before or during arrival and want to avoid ATM fees, bad conversion screens, and cash-only surprises.
- Dedupe result: no Wix Blog title/draft title found for `ATM` or a dedicated cash-withdrawal article. Existing related content is broader:
  - `Can You Use Credit Cards in Berlin?` mentions ATMs but is mainly card acceptance.
  - `Berlin Tourist Scams` mentions payment pressure and cash moments but is not an ATM guide.
  - `Berlin Daily Budget` covers total spend, not withdrawal-screen decisions.

## SEO package

- Wix title/H1: `ATM in Berlin: Cash, Fees and Safer Withdrawal Tips for Tourists`
- SEO title/title tag: `ATM in Berlin: Cash, Fees and Withdrawal Tips`
- Meta description: `ATM in Berlin guide for tourists: where to withdraw euros, how to avoid bad conversion screens, which fees to watch, and how much cash to carry.`
- Excerpt: `A practical ATM in Berlin guide for tourists: cash, bank machines, withdrawal fees, dynamic currency conversion and how much euro cash to carry.`
- Social title: `ATM in Berlin: What Tourists Should Check`
- Social description: `Withdraw euros in Berlin without rushing the fee or conversion screen. A practical cash and ATM guide for visitors.`
- Primary category: Tourist Tips
- Secondary keywords:
  - `Berlin ATM fees`
  - `cash withdrawal Berlin`
  - `Berlin cash for tourists`
  - `dynamic currency conversion ATM`
  - `withdraw euros Berlin`

## Official/current sources

- Bundesbank press release, `Payment behaviour in Germany in 2025`, published 2026-06-17:
  - `https://www.bundesbank.de/en/press/press-releases/payment-behaviour-in-germany-in-2025-964738`
  - Used for current cash/card split: cashless 55% of recorded purchases, cash 45%.
- Bundesbank cash acceptance study, published 2025-12-15:
  - `https://www.bundesbank.de/en/tasks/topics/bundesbank-study-what-is-cash-acceptance-like-in-germany--973642`
  - Used for cash acceptance context in German retail locations.
- BaFin consumer guidance, paying and withdrawing cash abroad:
  - `https://www.bafin.de/EN/verbraucherinnen-verbraucher/themen-finanzprodukte/konten-zahlungen/zahlungen/bezahlen-im-ausland/bezahlen-im-ausland_node_en.html`
  - Used for warning that card providers and ATM operators can charge fees abroad and conversion can add costs.
- Visa dynamic currency conversion explainer:
  - `https://www.visa.com/en-us/personal/travel/dynamic-currency-conversion`
  - Used for DCC definition and the practical point that accepting/declining DCC should not affect the ability to complete an international transaction.

## Internal links planned

- `https://www.berlinwalk.com/post/can-you-use-credit-cards-in-berlin-a-tourist-s-guide-to-paying-in-germany`
- `https://www.berlinwalk.com/post/is-berlin-expensive-a-realistic-daily-budget-for-2026-tourists`
- `https://www.berlinwalk.com/post/berlin-tourist-scams`

## Widget ideas considered

1. ATM Screen Coach: user chooses card currency, ATM type, screen offer and cash need; tool gives one next move. Chosen because it solves the article's central decision at the machine.
2. Cash Buffer Slider: traveller chooses day style and gets a cash amount. Rejected because it overlaps the existing daily budget calculator and is less specific.
3. Fee Scenario Comparator: compare bank fee, operator fee and conversion markup. Rejected because exact fee math would imply precision the tool cannot know for every bank/card.

## Chosen tool

- Tool slug: `berlin-atm-fee-checker`
- Widget URL: `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-atm-fee-checker/`
- Hub category: `MoneyShopping`
- Tool type: `Guide`
- Tool page plan: free Berlin money tool for reading ATM fees, currency conversion offers and cash-buffer decisions before withdrawing euros.

## QA checklist targets

- Exact publish body has no Markdown H1.
- Wix rich content body has HEADING level 1 count `0`.
- Six inline article images, six caption-style paragraphs.
- Three HTML embeds: Quick Summary, ATM widget, FAQ.
- Draft must remain `UNPUBLISHED`.
- Do not run post-publish `/blog` propagation or Search Console indexing.
