# September–December 2026 Event Tools — Icon Production Brief

Status: internal production brief only. It is not a public credit or a release instruction.

## Shared output gate

- Produce one original square PNG per tool at 512 × 512, then create a clean 160 px rendition after QA.
- Use the existing BerlinWalk glossy 3D icon family: deep green, warm yellow and cream, crisp object silhouette, soft studio light, generous safe margin.
- No text, letters, numbers, venue logos, team marks, festival marks, map labels, people, or recognisable copyrighted artwork.
- Each object must remain recognisable at 160 px. Reject a result that duplicates another tool's central object or needs text to explain itself.
- Save the raw generation and the final files internally. Public image credits must never mention the generation method, prompts or workflow.

## Per-tool prompts

| Tool slug | Central visual direction | Reject if |
|---|---|---|
| `berlin-autumn-film-language-board` | A glossy cinema clapperboard beside three abstract subtitle strips and a small amber screening light, arranged as a compact comparison board. | It looks like a generic movie poster, uses readable words, or resembles an existing ticket icon. |
| `tempelhof-kite-day-approach` | A bright yellow giant kite rising over a minimal runway arrow and green field strip, with the approach arrow visibly distinct. | It becomes a literal map, contains a route name, or looks like an aviation logo. |
| `uber-arena-night-cost-clock` | A polished arena bowl containing a hockey puck and basketball orbiting a single evening clock face. | Team marks, jersey numbers, player likenesses, or a generic football ball appear. |
| `berlin-double-closure-weekend` | Three linked weekend blocks: a small fireworks burst, a moon, and a road-barrier ribbon, displayed as a physical desk calendar without dates. | It shows a real Marathon route, readable calendar dates, or a generic fireworks-only icon. |
| `clubkultur-week-door-free-finder` | A neon green club doorway with a small bright selector dial and floating music pulse, presented as a decision device instead of a nightclub facade. | It includes a real club logo, a bouncer/person, alcohol branding, or readable neon text. |
| `food-week-can-i-actually-go` | A polished tasting plate with five small access tokens arranged around it: open doorway, reservation card, ticket stub, invitation envelope, question mark. | It contains restaurant branding, readable labels, chef likenesses, or a generic fork-only icon. |
| `jazzfest-room-comparator` | Four distinct acoustic-room tiles converging toward one upright saxophone silhouette, with a restrained stage-light glow. | It includes an artist likeness, concert branding, readable labels, or a musical-note clip-art look. |
| `science-week-three-day-window` | A glass observation window framing three luminous orbital dots over a compact Berlin science pavilion, showing a planning window instead of a calendar. | It shows a lab brand, a scientist portrait, formula text, or a generic microscope-only icon. |
| `november-nine-hour-line` | A respectful vertical memorial line with a subtle broken-wall fragment and an amber evidence pin, quiet and dignified. | It looks celebratory, contains slogans/years, depicts victims, or uses a literal political logo. |
| `christmas-garden-closed-night-calendar` | A winter botanical leaf and light trail beside a dark closed-gate crescent, clearly a timed evening check without numbers. | It resembles a Christmas market, uses festive lettering, or displays a real ticket price/time. |
| `berlin-christmas-window-overlap` | Four overlapping translucent winter-event windows: light walk, circus tent, second circus ring, choral note, resolving into one clean ledger tile. | It becomes a Christmas-market stall, uses text/dates, or resembles the Christmas Garden icon. |

## File targets after approval

For each `tool-slug`, create:

- `tools-home/icons/<tool-slug>.png`
- `tools-home/icons/<tool-slug>-160.png`

Only after visual QA and an explicit external-write approval may its final Wix media URL be added to `tools-hub/data.json` and the matching CMS record.
