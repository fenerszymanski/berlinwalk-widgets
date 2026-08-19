# Berlin Plant Passport — novelty matrix

Run: `2026-08-19-1439-Europe-Berlin`

Article: `berlin-botanic-garden`

Tool: `berlin-plant-passport`

## Candidate comparison

| Candidate | Primary mechanic | Input model | State progression | Output model | Visual grammar | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| Berlin Plant Passport | Three-stamp visit passport | Cover, available time and visit aim are stamped in sequence | Stamp 1 → Stamp 2 → Stamp 3 → unlock a visit pass | A weather-aware garden/greenhouse visit shape, one caution and one next move | Tactile passport spread, numbered stamp rail, glasshouse icon | **Selected** |
| Garden map | Map filters | Stop choice | Filter → pin | Map route | Map panel | Rejected: relabelled map and would imply live wayfinding. |
| Ticket calculator | Ticket inputs | Group/price fields | Calculate | Total price | Calculator card | Rejected: price is live and the mechanic is common. |
| Greenhouse checklist | Checkboxes | Manual ticks | Tick → verdict | Checklist | Checklist card | Rejected: a generic checker without a real visit decision. |

## Same-day and recent daily tools

| Recent tool | Primary mechanic | Input | State progression | Output | Visual grammar | Match count | Difference |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Berlin Concrete Clue Chain (same-day reserved package) | Architectural clue sequence | Visible building clue | Clue → classify | Building detour reading | Concrete inspection chain | 1/5 | Both use a sequence, but Plant Passport records weather/time/aim to shape a garden visit rather than classifying architecture. |
| Berlin Address Compass | Local text parse | One free-form address | Parse → missing clue check | Address components | Folded address card | 0/5 | No text parsing or component validation. |
| Berlin Meal Wallet | Spoken payment rehearsal | Food moment/resources | Scene → exchange → note | Payment next move | Receipt and speech bubbles | 0/5 | No role-play or payment output. |
| Berlin Pink Pipe Decoder | Observation decoder | Visible pipe clue | Turn → classify | Cautious explanation | Industrial inspection dial | 1/5 | The passport is a three-input visit composition, not a single-object decoder. |
| Berlin Spy Museum Mission Match | Preference matcher | Museum interest | Files → mission | Visit fit | Mission dossier | 2/5 | Both consider a visit, but its match is a recommendation from preference; this is a fixed stamp chain that renders a visit pass. |
| Berlin Pace Passport | Pace selector | Energy/pacing | Stamp selection | Day pace | Passport stamp card | 3/5 | Rejected as a close visual neighbour during planning; the selected tool differentiates through a mandatory ordered three-stamp chain, weather-cover logic and greenhouse/outdoor output rather than an itinerary pace. |
| Berlin Weekend First Night | Time rail | Arrival time | Time windows | Evening plan | Horizontal rail | 1/5 | No time calculation or evening route. |
| Berlin Landmark Window | Observation lens | Landmark/context | Compare clues | Landmark reading | Camera lens | 1/5 | No landmark comparison or camera grammar. |
| Berlin Bauhaus Lineage Map | Relation mapper | Building choice | Trace lineage | Architecture relation | Diagram/map | 0/5 | No map, lineage or building choice. |
| Berlin Memorial Reading Order | Ordered sequence | Visitor intent | Order steps | Reading route | Editorial cards | 2/5 | No route, memorial content or cards; the output is a single visit pass. |
| Berlin Walking Kit | Packing selector | Conditions | Add/remove kit | Packing list | Object tray | 1/5 | No item tray or packing list. |
| Berlin Solo Day Path | Route branch | Pace/interest | Branch | Day path | Street-path map | 1/5 | No route branching or map output. |

No comparison reaches the 4-of-5 rejection threshold. The selected tool is neither a calculator, generic picker, checker, card, calendar nor map. Its closest visual neighbour, Berlin Pace Passport, was explicitly redesigned away from through ordered stamps and a place-specific greenhouse/outdoor outcome.
