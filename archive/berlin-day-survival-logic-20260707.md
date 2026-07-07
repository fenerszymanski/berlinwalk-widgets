# Berlin Day Survival Logic Archive

Archived on 2026-07-07 before removing the game from live navigation and source.

## Why It Was Removed

The game repeatedly froze on real iPhone Safari/Chrome after several rebuilds.
The failures did not reproduce reliably in Playwright emulation. The next clean
attempt should start from a new Wix page and a new game implementation instead
of reusing the old iframe/native-shell history.

## Recovery Pointer

Full deleted source can be recovered from widget repo commit
`c4afa11d5b1f659a83c55a9c9b69fe28e976b151`.

Deleted source paths:

- `berlin-day-survival/`
- `berlin-day-survival-page/`
- `berlin-day-survival-lite/`

## Core Concept

Player chooses a tiny first-day Berlin budget, makes six practical city
decisions, and receives a shareable survival type.

Public positioning:

- Title: `Berlin Day Survival`
- Subtitle: `Your budget is small. Berlin is hungry. Choose wisely.`
- Duration: under 1 minute
- Tone: practical Berlin humor, small real mistakes, no glossy travel filler

## Budgets

| Budget | Mode | Starting cents | Energy | Berlin sense |
| --- | --- | ---: | ---: | ---: |
| EUR 10 | Hard Mode | 1000 | 58 | 48 |
| EUR 15 | Normal Mode | 1500 | 62 | 52 |
| EUR 20 | Comfort Mode | 2000 | 66 | 54 |

## Conditions

- `first-day`: normal first arrival setup.
- `sunny-saturday`: longer lines, warm city, outdoor pressure.
- `rainy-museum-day`: museum/weather crowding.
- `sunday-shops`: shops closed, supermarket choices need fallbacks.
- `heatwave-walk`: water decisions matter more.
- `late-arrival`: skipped food and lower energy.

## Rounds

1. `morning`: skipped breakfast.
2. `hydration`: water after walking.
3. `landmark`: food pressure near a famous square.
4. `lunch`: real meal or false economy.
5. `afternoon`: foot/energy crash.
6. `night`: dinner collapse rescue.

## Choice Model

Each choice changes:

- wallet in cents
- energy/fuel
- Berlin sense/smarts
- chaos
- tags such as `smart`, `budget`, `supermarket`, `spaeti`, `doner`, `tourist_trap`

Important old choice ideas:

- Supermarket bakery roll + banana.
- Supermarket 1.5L water + Pfand.
- Walk two blocks before choosing food.
- Backshop sandwich + ayran or banana.
- Club Mate + bench reset.
- Late döner rescue, no shame.
- Expensive panic meal as a fail-risk option.

Sunday variants matter:

- Supermarket choices become station shop or bakery fallbacks.
- `Try the supermarket anyway` can be a deliberate mistake.

## Result Rules

Hard rule from prior approved logic:

- Any negative final wallet should fail, not become a weak survival result.

Old result types:

- `Budget Busted`
- `Smart Wanderer`
- `Späti Strategist`
- `Döner Loyalist`
- `Club Mate Creature`
- `Budget Saint`
- `Alexanderplatz Victim`
- `Sunday Casualty`
- `Late-Night Survivor`

## Old Audio/Visual Preferences

- Full-image treatment was preferred over aggressive cropping.
- Previous voice direction: one consistent German-accented English Berlin guide
  voice, dry and practical.
- Previous ElevenLabs voice: `Jonas - Confident and Trustworthy`
  (`60UU378MZ8YbeLyaF7TI`).

## Rebuild Guardrails

- Do not reuse the old iframe shell.
- Do not reuse old Wix page custom embeds.
- Do not use document-wide mutation loops.
- Do not rely on parent/iframe height messaging.
- Build the next version on a fresh Wix page with the smallest possible runtime.
- Keep the public URL on `berlinwalk.com`.
