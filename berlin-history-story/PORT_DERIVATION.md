# Berlin History Story V2 - Wall Timeline engine port

## Source snapshot

- Source runtime: `berlin-wall-timeline/wall-timeline-element.js`
- Source commit: `2eee9c45d3da46946e872c8b8cf96500bcc5e52f`
- Source git blob: `2d4c2615250ed3ab47b18e5892410a8854ad114c`
- Source SHA-256: `8e737b380981d6708ad7b50cbd91beaa5f14b4b82216a10d628fbe6dbf65be7d`
- Byte-identical private seed commit: `94ba03f2e4ca69e9f969298752b5414b956751fd`
- Data-swap commit: `f43080f06f22b81360e5a72e5043bdb4ef7dd688`

The seed commit contains `berlin-history-story/history-story-element.js` with
the exact bytes of the recorded Wall source. The data-swap runtime then changes
that copied file into the 12-chapter History Story version; the repository check
`scripts/check-history-story-engine-port.mjs` verifies both sides together.

This package is a data-swap port of the proven Wall Timeline runtime, not a
separate scrolly engine. The Story keeps the source engine's lifecycle order,
RAF-coalesced scroll loop, fixed/absolute sticky-stage switch, accessible
chapter rail, card observer, script-relative map loader with fallback,
year/progress HUD, reduced-motion base and `#bwqa=<scrollY>` screenshot hook.

`assets/map/map-data.json` deliberately carries the History Story package
version (`berlin-history-story-map-v1`); it is a static copied data source, not
a runtime dependency on the Wall package.

## Deliberate swaps

| Wall source area | Berlin History Story replacement |
| --- | --- |
| Wall identity, URLs, build and SEO | `bw-berlin-history-story`, History Story URL/UTMs and local-preview-only SEO safety net |
| Scrolly opening and H1 | One unnumbered editorial cover outside the engine's records, using the existing 1652-plan derivative and a native anchor to the Molkenmarkt prologue |
| 9 Wall chapters | 12 records: one prologue, ten chronological history chapters and one epilogue, with `yearStart`, `yearEnd`, `visual`, `mapState` and photo data |
| Wall SVG, ring, tunnel and crowd state | History diagrams: medieval pair, royal grid, Hobrecht blocks, Greater Berlin, remembrance, sectors, Wall and present-day places |
| Wall map state | Only the permitted Four sectors and the Airlift and The Wall chapter map states |
| Wall CTA and paid audio CTA | One final Free Tour CTA; The Wall chapter has only an outbound Wall Timeline link |
| Wall imagery | Nine source-led licensed History Story assets plus one optimized archive derivative reused by the cover and prologue |

## Deliberate non-transfers

No Wall-specific escape counters, Tunnel 57 interaction, death-strip tooltip,
falling slabs, random crowd animation, paid audio CTA, old embed ID, old
page slug, or old asset path is carried into the Story runtime. The Dictatorship,
deportation and destruction chapter remains
non-gamified and has no sales CTA.

## Namespace audit rule

After every port edit, grep `berlin-wall-timeline`, `wall-timeline` and
`e75629a8`. The only intentional runtime occurrence is the outbound deep link
from The Wall chapter, expressed through `WALL_URL`. The updater retains the protected
embed ID only in a negative assertion which rejects it as a target; the Wall
Timeline embed itself is never read or written by this package.
