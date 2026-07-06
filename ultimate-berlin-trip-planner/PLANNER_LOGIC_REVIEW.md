# Ultimate Berlin Trip Planner — Logic Review

Internal review note for Yusuf. This is the current deterministic planner logic in
`index.html`, written so we can review the itinerary brain in one pass instead of
finding mistakes one by one in the UI.

Last reviewed locally: 2026-07-05

Update 2026-07-05: Wave 0 stabilization added a small sequential block-window
scheduler in `index.html`. Rendered time windows keep their original durations,
but a block now starts no earlier than the previous timed block ends. This fixes
the verified Day 1 lunch `13:30-14:30` / afternoon `14:00-16:30` overlap without
changing the underlying day-template order.

Update 2026-07-05: Wave 1 opening guardrails added official-source-backed place
metadata for key anchors (`closedDays`, `indoor`, `note`) and a post-generation
opening pass. Museum-heavy days that land on Monday or on a date with a closed
anchor now swap with the nearest true outdoor-safe day (`wall`, `history`,
`free`, `local`) when possible. If the trip is too short to swap, the day card
gets a visible opening warning and the route starts with the open-air history
fallback. Unlocked day cards now render Sunday/Monday/holiday notes directly.

Update 2026-07-05: Wave 1 copy/input pass made `Potsdam day trip` a visible
conditional interest for 4+ day trips when arrival is not evening, and filters
it out automatically when the trip is too short or too late. Core itinerary and
tour-framework copy now gives one main anchor first, with fallback language
only when opening/weather/energy makes it necessary.

Update 2026-07-05: Wave 2.1 added a restrained First-Day Rescue Plan bridge at
the end of the unlocked Day 1 card only. It stays out of the locked preview,
links to the branded product URL with the `tp_rescue_bridge` UTM set, and tracks
`bw_trip_planner_rescue_cta_click` through the existing consent-gated Trip
Planner event path.

Update 2026-07-05: Wave 2.3 tightened the tour booking bridge. The recommended
tour card now uses one decisive `Reserve the {weekday} {time} spot` CTA pointing
to the canonical Wix Bookings service route with `utm_campaign=tp_tour_bridge`.
The same CTA repeats once under the unlocked plan action row with
`utm_content=plan_actions`; no date preselect query was added because the current
Bookings route does not expose a supported preselect contract. The legacy
two-step start card is also hidden during one-question quiz flow so visitors do
not see both `Start building my plan` and `Next question`.

Update 2026-07-05: Wave 2.4 made one-question quiz answer tracking explicit on
`Next question` / final build clicks. The planner already has default answers,
so a visitor can move through the quiz without changing a selected option. Those
default commits now send one deduped `bw_trip_planner_quiz_answer` event per
step, which keeps the per-step funnel report from mistaking default-answer
progress for drop-off.

Update 2026-07-06: Wave 1.5 added live-weather day reordering. When the daily
Open-Meteo forecast marks a trip date as clearly rainy, the post-generation pass
now moves the nearest indoor-heavy non-tour day onto that date and moves the
exposed route to the clearer date, while checking that the swap does not create
Monday/closed-anchor opening risk. Day cards and Smart Swaps show a visible
`Rain swap` note. A localhost-only `mockRainDay` query parameter exists for QA
and does not affect the public embed.

## 1. User Inputs

### Visible inputs

| Field | Current options | Notes to review |
|---|---|---|
| Arrival date | `YYYY-MM-DD` | Drives weather, opening-day warnings, tour day, season. |
| Trip length | `1` to `7` days | Controls whether the conditional Potsdam interest is visible. |
| Arrival time | `Before 09:00`, `09:00-10:00`, `10:00-14:30`, `14:30-18:00`, `After 18:00` | Used heavily for Day 1 and tour slot eligibility. |
| Arrival point | `BER Airport`, `Hauptbahnhof`, `Alexanderplatz`, `Hotel/Airbnb`, `Car / rental` | BER and car make same-day tour stricter. |
| Stay area | `Mitte / Alexanderplatz`, `Kreuzberg / Friedrichshain`, `Prenzlauer Berg`, `Charlottenburg / West`, `Not sure yet` | Used for base logic, food/dinner, first-day fallback. |
| Who is traveling | `Solo`, `Couple / friends`, `Family`, `Older / slower` | Family/older/slower creates slower rhythm and breaks. |
| First time in Berlin? | `Yes`, `No`, `Long time ago` | First timers get more core context; repeat visitors get local/food earlier. |
| Top interests | `History`, `Berlin Wall / Cold War`, `Museums`, `Food`, `Nightlife`, `Free / low budget`, conditional `Potsdam day trip` | Potsdam appears only on 4+ day trips when arrival is not evening. |
| Trip mode | `Low budget`, `Smart spend`, `Comfort` | Low budget favors free anchors; comfort/reservations push museum/timed-entry checks. |
| Plan needs | `Rain backup`, `Low walking / breaks`, `Photo-friendly route`, `Timed entry planning` | Rain/free/covered backup and slower pace rules live here. |
| Pace | `Gentle`, `Balanced`, `Packed` | Gentle adds coffee/rest; packed can add nearby options but still area-based. |

### Hidden/stored input

| Field | Current options | Notes |
|---|---|---|
| Walking tour intent | `Not booked yet`, `Already booked`, `Not sure` | UI is hidden right now, but query params and lead payload can still set it. `Already booked` changes sales language into prep language. |

## 2. Tour Slot Logic

BerlinWalk availability used by the planner:

- Tour days: Tuesday to Saturday.
- No tour: Sunday and Monday.
- Standard slot: `11:30-13:30`.
- Summer double-slot season: July 1 to September 30.
- Summer slots: `11:30-13:30` and `15:30-17:30`.

Arrival-day tour eligibility:

| Arrival state | Same-day `11:30`? | Same-day `15:30` in Jul-Sep? | Current reasoning |
|---|---:|---:|---|
| Before 09:00 | Yes | Usually not used because 11:30 is chosen first | Enough margin. |
| 09:00-10:00, central start | Yes | Usually not used because 11:30 is chosen first | Central start means low transfer friction. |
| 09:00-10:00, BER/car | Usually no | BER/car no | Airport/car is too tight. |
| 10:00-14:30, Hbf/Alex/hotel | No for 11:30 | Yes in Jul-Sep if not BER/car | Afternoon slot can work from central/non-airport arrival. |
| 10:00-14:30, BER/car | No | No | Too much friction. |
| 14:30-18:00 | No | No | Day 1 becomes arrival/dinner. |
| After 18:00 | No | No | Day 1 becomes arrival/dinner/rest. |

If same-day tour is not possible:

- Planner searches the next Tue-Sat inside the trip.
- If no slot is inside the trip, it recommends the next Tue-Sat after the trip.
- If `tourIntent=booked`, sales CTA is suppressed and the plan uses meeting-point/prep language.

Review question:

- Should we ever prefer the summer `15:30` slot over `11:30` for a morning arrival, or is `11:30` always the better conversion anchor?

## 3. Date / Opening / Weather Logic

Date status:

| Status | Rule | Current note |
|---|---|---|
| Public holiday | Berlin holiday list + one-off holidays | Sunday-style shopping rules; keep day outdoor-first. |
| Christmas Eve | `12-24` | Early-closing warning; errands before lunch, simple route. |
| Sunday | `getUTCDay() === 0` | Regular shops close; use stations, restaurants, museums, parks, markets, walking routes. |
| Monday | `getUTCDay() === 1` | Museum caution; outdoor history backup. |
| Weekday | Otherwise | Normal rhythm. |

Place metadata now exists on the key planning anchors where a stable rule is
safe to encode:

- `museum_island`: indoor cluster, no blanket closure encoded, Monday caution
  stays in `note` because the island is not a single venue.
- `topography_terror`: indoor/outdoor history backup, daily rule, special
  holiday exceptions in `note`.
- `reichstag`: indoor/booking note, no weekly closure encoded.
- `berlin_cathedral`: indoor note, Sunday/service caution.
- `markthalle_neun`: indoor, Sunday closed.
- `holocaust_memorial`: outdoor field as primary anchor; information-centre
  Monday closure noted but not treated as full-anchor closure.
- `charlottenburg_palace` and `sanssouci`: Monday palace-interior closure,
  garden/park fallback in `note`.

Post-generation opening pass:

1. Detects closed anchors via `closedDays` and detects Monday museum/palace risk
   without pretending Museum Island is one uniformly closed venue.
2. For Days 2-7, swaps the risky museum-heavy day with the nearest true
   outdoor-safe non-tour day.
3. If no swap exists, inserts an `Opening backup` block and puts
   Topography of Terror / Brandenburg Gate / Holocaust Memorial first in the
   route.
4. Caps slow-trip `Pause` blocks so they cannot appear on consecutive days.

Weather:

- Live Open-Meteo near Alexanderplatz for near dates.
- Monthly fallback for later dates.
- `Rain backup` selected acts like a rain concern even if live forecast is not rainy.
- Rain concern changes risk chips, weather strategy, nearby extra copy, and some tour/day choices.
- If a live daily forecast inside the trip is clearly rainy, the planner prefers
  moving an indoor-heavy day (`museums`, `food`, or indoor-metadata-heavy route)
  onto that date and moving the exposed day away, unless that would break tour
  placement or opening rules.

Resolved 2026-07-05:

- Monday museum days are now forcibly swapped with outdoor-safe days when the
  trip has one. If no swap exists, the unlocked day card shows the warning and
  open-air fallback.

## 4. Plan Generation Order

Current high-level sequence:

1. Day 1 is always an arrival/orientation day.
2. Days 2-7 are filled from a queue of day types.
3. If the first viable BerlinWalk tour day is inside the trip and not Day 1, that day becomes a `tour framework` day.
4. The focus used by the tour framework is marked as consumed so the next day does not repeat the same focus immediately.
5. Used map anchors are remembered. Later days avoid repeated anchors and may switch to anti-repeat variants.
6. Opening post-processing swaps risky museum/closed-anchor days off Monday or
   injects a visible fallback warning when no safe swap exists.
7. Weather post-processing can swap a covered day onto a clearly rainy live
   forecast date, after opening swaps have already protected museum/closure
   risks.

Day type queue:

| Trigger | Adds day type(s) |
|---|---|
| Explicit selected interests | Adds selected types in selected/query order: `history`, `wall`, `museums`, `food`, `nightlife`, `free`, plus `potsdam` when eligible. |
| First time = yes / long ago | Adds `wall`, `history`, `museums`. |
| First time = no | Adds `local`, `food`, and `wall` if wall was selected. |
| Low budget | Adds `free`. |
| Rain backup | Adds `free`. |
| Timed entry planning or comfort | Adds `museums`. |
| Photo-friendly route | Adds `free`. |
| Family / slower / low walking | Adds `local`, `free`. |
| Packed or nightlife selected | Adds `nightlife`. |
| 5+ days and not evening arrival | Adds `potsdam` automatically even if the visitor did not select it. |
| Always as fallback | `wall`, `history`, `free`, `museums`, `food`, `local`. |
| 6+ days and not slow | Adds `nightlife`. |
| 7 days | Adds another `local`. |

Review questions:

- Should `Potsdam` stay at 4+ days, or should the chip appear only at 5+ days?
- For repeat visitors (`firstTime=no`), should `history + wall` still start with the tour on Day 1, or should it skip central overview more often?
- Should `food` appear earlier for low-budget repeat visitors, or is the current `local -> food -> wall/free` tendency okay?

## 5. Day 1 Logic

Day 1 always starts with an arrival block.

### Arrival block titles

| Condition | Title |
|---|---|
| Evening arrival | `Arrive, eat, and stop` |
| Afternoon arrival | `Reach your base before dinner` |
| Same-day tour possible | `Get central without over-solving Berlin` |
| Arrival point Alexanderplatz | `Use the central start lightly` |
| Arrival point car | `Park first, then make the day lighter` |
| Default | `Land, reach your base, then keep it light` |

### Arrival copy by point/time

| Arrival point/time | Current behavior |
|---|---|
| BER evening | ABC ticket, reach base, check-in/food/water/sleep. |
| BER afternoon | ABC ticket, drop bags, dinner close to base. |
| BER with same-day tour | ABC ticket, bags if needed, keep first walk central. |
| BER no same-day tour | Reach base, keep first walk near base profile. |
| Hbf evening | Hbf -> base -> dinner/rest. |
| Hbf afternoon | Hbf -> base -> dinner nearby. |
| Hbf with same-day tour | Store bags if needed, ride toward Alexanderplatz. |
| Hbf no same-day tour | Reach base first, add only one nearby stop. |
| Alexanderplatz | Already central; light loop around Alexanderplatz/Marienkirche/edge. |
| Car | Park first, then transit/walk. |
| Hotel/Airbnb | Start from stay and keep first route close. |

### Day 1 branches

| Branch | Blocks |
|---|---|
| Evening arrival | Arrival + Dinner only. |
| Already booked tour | Arrival + Meeting point prep + Evening. |
| Same-day 11:30 tour | Arrival + BerlinWalk + selected focus after tour + Evening. |
| Same-day 15:30 tour | Arrival + BerlinWalk + Evening. No extra focus after the afternoon tour. |
| Trip length > 1, no tour | Arrival + base-side move/dinner + Evening. |
| One-day trip, no tour | Arrival + one compact focus move + Evening. |

### Day 1 map anchors

If same-day tour is possible, map anchors come from the selected tour focus:

| Tour focus | Day 1 map anchors |
|---|---|
| History | World Clock / Brandenburg Gate / Topography of Terror / Reichstag |
| Museums | World Clock / Museum Island / Brandenburg Gate / Hackescher Markt |
| Wall, rain concern | World Clock / Topography of Terror / Hackescher Markt |
| Wall, no rain concern | World Clock / Wall Memorial / Hackescher Markt |
| Food | World Clock / Hackesche Hofe / Hackescher Markt / Markthalle Neun |
| Free | World Clock / Brandenburg Gate / Topography of Terror / Tiergarten |
| Nightlife | World Clock / Hackescher Markt / RAW-Gelande / Simon-Dach-Strasse |

If no same-day tour and no one-day focus, map anchors come from arrival/stay-area fallback:

| Stay/arrival condition | Map anchors |
|---|---|
| Evening/afternoon + Mitte | Hackescher Markt / Hackesche Hofe |
| Evening/afternoon + East | Oranienstrasse / Markthalle Neun |
| Evening/afternoon + North | Kastanienallee / Kulturbrauerei |
| Evening/afternoon + West | Savignyplatz / Lietzensee |
| Morning + Mitte | Alexanderplatz / Hackescher Markt / Museum Island |
| Morning + East | Alexanderplatz / Markthalle Neun / Oranienstrasse |
| Morning + North | Alexanderplatz / Kulturbrauerei / Kastanienallee |
| Morning + West | Savignyplatz / Lietzensee / Charlottenburg Palace |

Review question:

- Day 1 same-day tour plus selected focus may still be dense. Should Day 1 after-tour focus be shorter for all arrivals, even before 09:00?

## 6. Core Day Templates

These are the base day templates before personalization, anti-repeat, and season logic.

### `history`

Title: `Free central history without museum overload`

| Time | Title | Copy |
|---|---|---|
| Morning | Brandenburg Gate and memorials | Use the central memorial layer first: Brandenburg Gate, Holocaust Memorial, and government quarter edges. |
| Afternoon | Topography of Terror | Use Topography as the serious history anchor; Reichstag exterior is the lighter fallback. |
| Evening | Simple central dinner | Stay central or near base. No second paid entry. |

Map anchors: Brandenburg Gate / Topography of Terror / Reichstag

### `wall`

Title: `Wall, East Berlin, and post-1989 energy`

| Time | Title | Copy |
|---|---|---|
| Morning | Berlin Wall Memorial | Start at Bernauer Strasse to understand the Wall as a system. |
| Afternoon | East Side Gallery and Friedrichshain | Walk East Side Gallery, then stay east for food or river time. |
| Evening | Dinner east | Stay east instead of crossing the city again. |

Map anchors: Wall Memorial / East Side Gallery / Oberbaum Bridge / Markthalle Neun

### `museums`

Title: `Museum Island without museum overload`

| Time | Title | Copy |
|---|---|---|
| Morning | Pick one museum anchor | One checked-open museum beats four rushed ones. |
| Afternoon | Berlin Cathedral and river edge | Keep the afternoon light around Berlin Cathedral, the Spree, and the government-quarter edge. |
| Evening | Central dinner | Stay in Mitte, Hackescher Markt, or near base. |

Map anchors: Museum Island / Brandenburg Gate / Reichstag

### `food`

Title: `Food, courtyards, and the lived-in city`

| Time | Title | Copy |
|---|---|---|
| Morning | Prenzlauer Berg coffee walk | Use Kastanienallee and a proper coffee pause as the food-day rhythm. |
| Afternoon | Hackesche Hofe courtyards | Use Hackesche Hofe as the afternoon anchor; stay under cover there if rain wins. |
| Evening | One-area dinner | Dinner in same area. |

Map anchors: Hackesche Hofe / Markthalle Neun / Kastanienallee

### `free`

Title: `Free Berlin that still feels essential`

| Time | Title | Copy |
|---|---|---|
| Morning | Topography of Terror | Start with the free, serious, weather-safe anchor. |
| Afternoon | Tiergarten and Victory Column | Use Tiergarten after lunch; shorten to a cafe/station break if weather turns. |
| Evening | Cheap food near the route | Keep the evening low-cost and close. |

Map anchors: Topography of Terror / Tiergarten / Tempelhofer Feld

### `nightlife`

Title: `A smart day before a Berlin night`

| Time | Title | Copy |
|---|---|---|
| Morning | Keep sightseeing compact | One essential culture block early; avoid 25,000-step day. |
| Afternoon | Rest, food, and outfit check | Eat, plan ride back, reduce midnight decisions. |
| Evening | Night plan + backup | Pick one night area and save ride-home backup. |

Map anchors: RAW-Gelande / Oranienstrasse / Simon-Dach-Strasse

### `local`

Title: `Local-feeling Berlin beyond the checklist`

| Time | Title | Copy |
|---|---|---|
| Morning | Kulturbrauerei and Prenzlauer Berg | Start around Kulturbrauerei and keep the pace slow. |
| Afternoon | Lietzensee slow hour | Use Lietzensee as the quiet anchor; switch to a longer Kulturbrauerei loop if staying north. |
| Evening | Dinner near base | End close to where you sleep. |

Map anchors: Kulturbrauerei / Savignyplatz / Lietzensee

### `potsdam`

Title: `Potsdam palace day`

| Time | Title | Copy |
|---|---|---|
| Morning | Train ride to Potsdam Hbf | Take the regional train after the rush; Charlottenburg Palace is the lower-energy Berlin fallback. |
| Afternoon | Sanssouci Palace gardens | Use Sanssouci as the main anchor; if the palace interior is closed, make the park the point. |
| Evening | Early return | Back before the day turns into a second mission. |

Map anchors: Potsdam Hbf / Sanssouci / Charlottenburg Palace

## 7. Tour Framework Templates

Used when the BerlinWalk tour is placed on a non-arrival day, or as Day 1 focus after a same-day 11:30 tour.

Tour focus priority if multiple interests are selected:

1. History
2. Wall / Cold War
3. Museums
4. Food
5. Free / low budget
6. Nightlife

Resolved 2026-07-05:

- The BerlinWalk tour is strongest as a history/Wall bridge, so `History` and
  `Wall` now outrank `Museums` when multiple interests are selected.

### Focus variants

| Focus | Title | Afternoon/default focus | Map anchors |
|---|---|---|---|
| History | BerlinWalk tour, then free central history | Brandenburg Gate / memorials / Reichstag exterior / Topography | World Clock / Brandenburg Gate / Topography / Reichstag |
| Museums | BerlinWalk tour, then Museum Island | One Museum Island anchor | World Clock / Museum Island / Brandenburg Gate / Hackescher Markt |
| Wall + rain | BerlinWalk tour, then one Cold War layer | Topography as rain-safe layer; save Wall Memorial/East Side for separate day | World Clock / Topography / Hackescher Markt |
| Wall, no rain | BerlinWalk tour, then one Cold War layer | One serious Wall / Cold War stop | World Clock / Wall Memorial / Hackescher Markt |
| Food | BerlinWalk tour, then courtyards and food | Hackescher Markt food/courtyard layer | World Clock / Hackesche Hofe / Hackescher Markt / Markthalle Neun |
| Free | BerlinWalk tour, then free central sights | Free outdoor history | World Clock / Brandenburg Gate / Topography / Tiergarten |
| Nightlife | BerlinWalk tour, then protect energy for night | Rest/food/compact culture stop | World Clock / Hackescher Markt / RAW-Gelande / Simon-Dach-Strasse |

If the selected slot is the summer `15:30` slot, the day becomes:

- Morning: light nearby anchor/lunch/margin
- Afternoon: BerlinWalk
- Evening: focus evening close

If the tour is `11:30`, the day becomes:

- Morning: BerlinWalk
- Afternoon: selected focus
- Evening: focus evening close

## 8. Personalization Rules

### Slow / gentle / family

Triggered by:

- `pace=gentle`
- `groupType=family`
- `groupType=slow`
- `mustHandle=kids`

Effect:

- Adds copy to first morning/afternoon block: protect one real cafe/rest break.
- `nearbyAddonBlock()` becomes a real `Pause` instead of an optional extra.
- Pace guard says 2-3 anchors/day and sit-down breaks.

### Low budget

Triggered by:

- `budgetStyle=low`
- `Free / low budget` interest

Effect:

- Adds `free` day type to queue.
- Museum copy warns to keep paid entry to one strong choice.
- Food copy favors casual food/markets over reservation-heavy choices.
- Budget pulse says free anchors first; pay only for entries that change the day.

### Rain backup

Triggered by:

- `mustHandle=rain`
- Live weather theme rain/storm/snow

Effect:

- Adds `free` day type.
- Adds rain risk chips.
- Wall tour focus uses Topography as rain-safe anchor.
- Nearby add-ons become covered/cafe/market backups.

### Photo-friendly route

Triggered by:

- `mustHandle=photos`

Effect:

- Adds `free` day type.
- Allows one nearby add-on, but no longer creates separate long photo-pause blocks.

### Timed entry planning / comfort

Triggered by:

- `mustHandle=reservations`
- `budgetStyle=comfort`

Effect:

- Adds `museums` day type.
- Adds reservation copy to first relevant museum/Reichstag/night/dinner block.
- Comfort + Potsdam says switch to Charlottenburg if the day feels heavy.

### Family / low walking

Triggered by:

- `groupType=family`
- `mustHandle=kids`

Effect:

- Adds local/free day types.
- On `free` or `local` days, inserts a `Break` block before evening.
- Risk tags show break/family pause.

## 9. Nearby Add-On / Pause Logic

The planner now avoids generic extra bloat.

No add-on if:

- Day 1.
- Potsdam day.
- Day already has break/nearby/optional/photo pause.
- Day has an afternoon tour block.

Add-on can appear if:

- Pace/profile is slow/gentle.
- Rain concern exists.
- Long daylight season.
- Packed/photo profile asks for one nearby option.

Add-on variants:

| Day type | Title | Meaning |
|---|---|---|
| Slow/gentle any day | `Coffee pause near {last place}` | Sit-down coffee/snack/bench. Not sightseeing. |
| Museums + rain | `Museum Island backup only` | Stay in same cluster; nearby open museum/cafe. |
| Museums no rain | `One more Museum Island edge` | Nearby edge/cathedral/cafe only. |
| Wall + rain | `Nearby rain-safe finish` | Spree edge, Oberbaum, cafe/covered stop toward Kreuzberg. |
| Wall no rain | `Oberbaum Bridge or Spree edge` | 20-40 minute close finish, not new route. |
| Food | `One cafe or courtyard nearby` | Cafe/courtyard/dessert near last place. |
| Free + rain | `Covered free/cheap fallback` | Free exhibition, station shop, cafe, covered market. |
| Free no rain | `Short outdoor finish nearby` | Park/bridge/river/exterior photo stop. |
| Nightlife | `Rest before the night` | Food/shower/nap/transit planning. |
| Local | `Cafe or local pause nearby` | Cafe/bookshop/park bench/small local stop. |

Review question:

- Should gentle mode create a coffee pause every non-arrival non-Potsdam day, or only on longer days?

## 10. Anti-Repeat Logic

The planner remembers place IDs already used in previous days.

If a later day would reuse anchors:

1. It tries a theme-specific alternative template for `history`, `wall`, `free`, or `museums`.
2. It removes already-used map anchors where possible.
3. It fills back up to 2-3 places using fallback lists.

### Anti-repeat variants

| Original type | Replacement title | Replacement places |
|---|---|---|
| History repeated | `Government quarter, memorials, and old Mitte` | Holocaust Memorial / Gendarmenmarkt / Nikolaiviertel |
| Wall repeated | `East Side Gallery and the Spree edge` | East Side Gallery / Oberbaum Bridge / Markthalle Neun |
| Free repeated | `Free Berlin away from the repeat anchors` | Tempelhofer Feld / Treptower Park / Victory Column |
| Museums repeated | `Charlottenburg Palace and west-side calm` | Charlottenburg Palace / Savignyplatz / Lietzensee |

Fallback place pools:

| Type | Fallback places |
|---|---|
| History | Holocaust Memorial, Gendarmenmarkt, Nikolaiviertel, Brandenburg Gate, Reichstag, Topography |
| Wall | East Side Gallery, Oberbaum Bridge, Wall Memorial, Topography, Markthalle Neun |
| Free | Tempelhofer Feld, Treptower Park, Victory Column, Tiergarten, Topography |
| Museums | Museum Island, Berlin Cathedral, Charlottenburg Palace, Savignyplatz, Reichstag |
| Food | Hackesche Hofe, Markthalle Neun, Oranienstrasse, Kastanienallee, Savignyplatz |
| Local | Kulturbrauerei, Savignyplatz, Lietzensee, Kastanienallee, Charlottenburg Palace |
| Nightlife | RAW-Gelande, Oranienstrasse, Simon-Dach-Strasse, Hackescher Markt |
| Potsdam | Potsdam Hbf, Sanssouci, Charlottenburg Palace |

Review questions:

- Are Holocaust Memorial / Gendarmenmarkt / Nikolaiviertel good alternatives for a repeat history day?
- Is Treptower Park a good free/low-budget anchor for tourists, or too far/too niche?
- Should the museum repeat alternative be Charlottenburg Palace, or should it be a different Museum Island strategy?

## 11. Place Catalog

Current named anchors available to the planner:

| ID | Label | Area/type |
|---|---|---|
| `world_clock` | World Clock | Alexanderplatz / central landmark |
| `alexanderplatz` | Alexanderplatz | Mitte / transport |
| `museum_island` | Museum Island | Mitte / museum |
| `hackescher_markt` | Hackescher Markt | Mitte / food |
| `wall_memorial` | Wall Memorial | Wedding/Mitte / history |
| `east_side_gallery` | East Side Gallery | Friedrichshain / wall |
| `oberbaum_bridge` | Oberbaum Bridge | Friedrichshain/Kreuzberg / landmark |
| `markthalle_neun` | Markthalle Neun | Kreuzberg / food |
| `brandenburg_gate` | Brandenburg Gate | Mitte / landmark |
| `holocaust_memorial` | Holocaust Memorial | Mitte / history |
| `reichstag` | Reichstag | Mitte / landmark |
| `gendarmenmarkt` | Gendarmenmarkt | Mitte / landmark |
| `nikolaiviertel` | Nikolaiviertel | Mitte / neighborhood |
| `berlin_cathedral` | Berlin Cathedral | Museum Island / landmark |
| `hackesche_hofe` | Hackesche Hofe | Mitte / courtyards |
| `kastanienallee` | Kastanienallee | Prenzlauer Berg / neighborhood |
| `topography_terror` | Topography of Terror | Mitte/Kreuzberg / history |
| `tiergarten` | Tiergarten | Mitte/West / park |
| `victory_column` | Victory Column | Tiergarten / landmark |
| `tempelhofer_feld` | Tempelhofer Feld | Neukoelln/Tempelhof / park |
| `treptower_park` | Treptower Park | Treptow / park |
| `raw_gelande` | RAW-Gelande | Friedrichshain / nightlife |
| `oranienstrasse` | Oranienstrasse | Kreuzberg / nightlife |
| `simon_dach_strasse` | Simon-Dach-Strasse | Friedrichshain / nightlife |
| `kulturbrauerei` | Kulturbrauerei | Prenzlauer Berg / culture |
| `savignyplatz` | Savignyplatz | Charlottenburg / neighborhood |
| `lietzensee` | Lietzensee | Charlottenburg / park |
| `sanssouci` | Sanssouci | Potsdam / day trip |
| `potsdam_hbf` | Potsdam Hbf | Potsdam / station |
| `charlottenburg_palace` | Charlottenburg Palace | Charlottenburg / palace |

## 12. Base Camp Logic

| Stay area | Base title | Anchor | First move | Transit | Late return |
|---|---|---|---|---|---|
| Mitte | Mitte / central base | World Clock | Walk to the core | Mostly walk | Easy late return |
| East | East-side base | East Side / Kreuzberg | Ride to Mitte | U/S-Bahn spine | Strong night links |
| North | Prenzlauer Berg / north base | Kulturbrauerei | Tram or U2 south | Short Mitte ride | Quiet return |
| West | Charlottenburg / west base | Savignyplatz | Start earlier | S-Bahn / U2 | Plan return route |
| Unsure | Flexible Berlin base | World Clock | Use Alexanderplatz | AB default | Save hotel map |

Review question:

- Should `Hotel/Airbnb` + unknown car/rental arrivals default to base logic, or do we need a separate driving/parking branch?

## 13. Ticket / Budget Logic

Ticket nudge:

| Condition | Ticket copy |
|---|---|
| Arrival point car | `Park once, use AB` |
| Low budget + BER | `ABC first, AB later` |
| Low budget + non-BER | `AB day ticket if busy` |
| Comfort + BER | `ABC first, keep it simple` |
| Comfort + non-BER | `AB day ticket` |
| BER default | `ABC first` |
| Trip length >= 4 | `AB day tickets or pass` |
| Packed pace | `AB day ticket` |
| Default | `AB single/day` |

Budget modes:

| Mode | Budget pulse |
|---|---|
| Low budget | Free anchors first; EUR25-45/day; 1 paid anchor max. |
| Smart spend | Free core sights + 1-2 worth-it anchors; EUR45-75/day. |
| Comfort | Timed entries/easier transfers/calmer meals; EUR75+/day. |

## 14. Current Known Weak Spots

These are not bugs exactly, but deserve Yusuf review:

- `Potsdam day trip` is visible only when it is operationally realistic; confirm whether 4+ days is the right threshold.
- Tour focus priority now favors `History` then `Wall` before `Museums`.
- Monday museum days are swapped when a suitable outdoor-safe day exists; very short trips use a visible opening fallback instead.
- Gentle mode may produce many coffee pauses across a long plan.
- Some helper/risk copy still lists backups, but core day templates now lead with one primary anchor.
- Long plans are now less repetitive by map anchors, but block copy can still repeat phrases like "Keep this cluster relaxed".
- `tourIntent` is hidden, so booked-user behavior exists but is not actively chosen in the UI.
- The former block-time overlap bug has a render-level scheduler now; future
  template edits should still avoid impossible windows at the source.

## 15. Suggested Review Pass

Yusuf can review in this order:

1. Is the conditional `Potsdam day trip` chip clear enough at 4+ days?
2. Are the BerlinWalk same-day / next-day tour rules correct?
3. Are the seven core day templates good Berlin logic?
4. Are the tour framework priorities correct?
5. Are the anti-repeat alternatives good enough, or should some be replaced?
6. Should gentle mode be less repetitive with coffee pauses?
7. Should Monday/Sunday/public holiday logic become more aggressive?
8. Which copy feels too mechanical and should be rewritten in a warmer local voice?
