# September–December 2026 Event Widgets — Novelty Matrix

Checked 22 August 2026 against the current public fleet and the six locally present, not-yet-committed tools in the shared checkout. Fingerprint fields are `primaryMechanic`, `inputModel`, `stateProgression`, `outputModel`, and `visualGrammar`.

| Tool | Primary mechanic | Input model | State progression | Output model | Visual grammar | Nearest tools | Gate |
|---|---|---|---|---|---|---|---|
| `berlin-autumn-film-language-board` | Read-only festival comparison | None, then one row expansion | Closed matrix to one expanded row | Festival-specific check prompt | Dense labelled matrix | `berlin-cinema-listing-decoder` | Pass: decoder accepts one listing and returns one verdict; this has no input and compares a season. |
| `tempelhof-kite-day-approach` | Organiser-led access correction | Arrival point | Selection to access note | Gate/access advisory | Licensed static site plan plus access chips | `tempelhof-field-planner`, `berlin-station-exit-map` | Conditional: no visit planner, code-drawn map or fixed walking-minute promise. |
| `uber-arena-night-cost-clock` | Event-night timing estimate | Date and departure area | Date to event chain to time window | Checked-on arrival/departure estimate | Vertical night clock | `berlin-matchday-board`, `berlin-night-transport-checker` | Conditional: no season calendar or fixed home-arrival guarantee. |
| `berlin-double-closure-weekend` | Reversible commitment chain | Accommodation area and one weekend block | Commitment changes the other two states | Three trade-off explanations | Three-column commitment board | `berlin-marathon-day`, `innotrans-three-evening-board`, `lights-route-order` | Pass only if it contains no map, scrubber or general planner. |
| `clubkultur-week-door-free-finder` | Reasoned elimination | Three preference answers | Cards move to a visible discard pile | Remaining format cards plus reason | Card deck and discard pile | `berlin-club-picker`, `berlin-club-night-clock` | Pass: it removes formats and preserves the reason; it does not recommend venues. |
| `food-week-can-i-actually-go` | Access-class sorting | Participation and format preferences | Neutral items sort once | Access class plus action | Neutral pool to five access columns | `dinner-neighbourhood-picker`, `berlin-reserve-or-walk-in`, `berlin-museum-ticket-desk` | Pass only with five classes: free entry, reservation, ticket, invite-only, check details. |
| `jazzfest-room-comparator` | Venue-character comparison | One first-time listener switch | Fixed panels reorder | A cautious starting point | Four parallel venue panels | `musikfest-evening-shape`, `ilb-day-shape`, `berlin-live-music-week` | Blocked pending official room data. Must not become before/concert/after routing. |
| `science-week-three-day-window` | Programme-density recommendation | Interest only | One calculated fixed recommendation | Three-day suggestion or data-unavailable state | Fixed ten-day density strip | `ilb-day-shape`, `berlin-beer-season-calendar`, `berlin-dates-check` | Blocked pending schedule. No draggable range, Gantt, or arbitrary arrival/departure inputs. |
| `november-nine-evidence-desk` | Source-backed plan verification | One visitor purpose card | Purpose locks to evidence status | Confirmed anchor, source pending, or safer next check | Cream archive/evidence desk | `berlin-marathon-day`, `mehringplatz-time-layer-viewer`, `berlin-wall-remnants`, `wall-site-one-hour` | Redesigned. Pass only with no map, no timeline and no time scrubber. |
| `christmas-garden-closed-night-calendar` | Reverse leave-by ladder | Entry time and departure area | Inputs to leave-by ladder | Time window plus caveats | Static blackout notice plus ladder | `reichstag-slot-window`, `berlin-public-holiday-checker`, `berlin-beer-season-calendar` | Redesigned. Calendar is reference-only, never the interactive decision surface. |
| `berlin-christmas-window-overlap` | Christmas expiry ledger | One of five fixed travel bands | Band to expiry categories | Before, during and after lists | Ledger columns, no time axis | `berlin-beer-season-calendar`, `berlin-dates-check`, `berlin-matchday-board` | Redesigned. No free date range, overlap function, draggable window, Gantt, or month grid. |

## Same-batch separations

- W5 removes cards one at a time; W6 classifies all items once.
- W8 shows a fixed data density strip; W11 has no date axis at all.
- W10 displays fixed blackout dates but its interactivity is a reverse journey ladder; W11 uses fixed travel bands and expiry categories.
- W2 maps access geometry only when a licensed map is available; W9 deliberately has neither map nor time axis.

## Rejection rule

Reject a build if it matches four of the five fingerprint fields of a named neighbour, if a programme-dependent tool invents data, or if its primary visual is a manually drawn/code-drawn illustration.
