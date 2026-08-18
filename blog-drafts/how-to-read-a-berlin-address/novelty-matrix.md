# Berlin Address Compass — novelty matrix

Run: `2026-08-18-1215-Europe-Berlin`

Article: `how-to-read-a-berlin-address`

Tool: `berlin-address-compass`

## Candidate comparison

| Candidate | Primary mechanic | Input model | State progression | Output model | Visual grammar | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| Berlin Address Compass | Local address parsing | Free-form pasted or typed address | Parse → identify missing/present clues → four-part fold | Street/number/postcode/arrival-note checks with one correction move | Generated compass-card icon, ivory address fold, deep-green frame | **Selected** |
| Address map finder | Address field | One address | Search → map pin | Map result | Map panel | Rejected: would imply live geocoding and duplicate map tools. |
| Numbering quiz | Multiple choice | Street-number trivia | Question → score | Right/wrong answer | Quiz cards | Rejected: turns arrival help into a generic quiz. |
| House-number checklist | Checkboxes | Four manual toggles | Tick → verdict | Checklist verdict | Checklist card | Rejected: relabelled checker with no useful parsing. |

## Same-day and recent daily tools

| Recent tool | Primary mechanic | Input | State progression | Output | Visual grammar | Match count | Difference |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Berlin Meal Wallet | Spoken payment rehearsal | Food moment + resources | Scene → exchange → pocket note | Payment next move | Café receipt and speech bubbles | 0/5 | No dialogue, role-play or payment selection. |
| Berlin Pink Pipe Decoder | Observation decoder | Visible pipe clue | Valve turn → classify | Cautious pipe explanation | Pink industrial inspection dial | 1/5 | Both interpret clues, but this tool parses visitor-entered address text and returns component-level checks. |
| Berlin Spy Museum Mission Match | Preference matcher | Museum interest | Files → mission result | Visit fit | Mission dossier | 1/5 | No preference match or recommendation. |
| Berlin Pace Passport | Pace selector | Energy / pacing | Stamp selection | Day pace | Passport stamp card | 0/5 | No choice-card interaction or itinerary output. |
| Berlin Weekend First Night | Time rail | Arrival time | Time windows | Evening plan | Horizontal rail | 0/5 | No time calculation or route plan. |
| Berlin Landmark Window | Observation lens | Landmark/context | Compare clues | Landmark reading | Camera/lens | 1/5 | The address tool checks a structured user input, not a landmark comparison. |
| Berlin Bauhaus Lineage Map | Relation mapper | Building choice | Trace lineage | Architecture relation | Diagram/map | 0/5 | No map or lineage output. |
| Berlin Memorial Reading Order | Ordered sequence | Visitor intent | Order steps | Reading route | Editorial cards | 1/5 | No ordered visit recommendation. |
| Berlin Walking Kit | Packing selector | Conditions | Add/remove kit | Packing list | Object tray | 0/5 | No item-selection state. |
| Berlin Solo Day Path | Route branch | Pace/interest | Route branch | Day path | Street-path map | 0/5 | No route generation. |
| Berlin Private Route Brief | Brief assembly | Group needs | Build brief | Enquiry brief | Form/sheet | 1/5 | Text input is parsed locally, not assembled into a service request. |
| Berlin Day Duet | Pairing chooser | Pair preferences | Match | Shared plan | Split cards | 0/5 | No match or pair logic. |
| Berlin First Walk Lens | Lens chooser | First-day concern | View change | Area move | Viewfinder | 0/5 | No picker or area recommendation. |
| Berlin Tour Time Window | Availability range | Time range | Time result | Booking guidance | Time slots | 0/5 | No timing logic. |
| Museum Island One Pick | Mood selector | Mood/time | Recommendation | One museum | Collection cards | 0/5 | No recommendation output. |

No comparison reaches the 4-of-5 rejection threshold. The selected tool is not a calculator, picker, checker, card, calendar, map, quiz or generic checklist.
