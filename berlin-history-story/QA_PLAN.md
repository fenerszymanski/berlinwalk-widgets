# Berlin History Story V2 - QA plan

The package remains `UNPUBLISHED` until every applicable check below passes and Yusuf gives fresh action-time approval.

## Build checks

- `node --check history-story-element.js`
- The standalone page opens on an unnumbered cover outside `CHAPTERS`; it contains the sole H1 `Berlin, Remade`, while the Molkenmarkt prologue begins with an H2.
- `node ../scripts/check-history-story-engine-port.mjs` proves the private
  byte-identical Wall source seed and validates the final data-swap runtime.
- No inherited Wall Timeline identity remains in element, updater, SEO, QA or output paths. The only permitted `berlin-wall-timeline` occurrence is the deliberate outbound link from The Wall chapter. The updater's only `e75629a8` occurrence is an explicit negative assertion that rejects the protected Wall embed ID.
- `git diff --check` passes.
- The public copy has 12 chapters, no body-title duplicate and no sales CTA in the Dictatorship, deportation and destruction chapter.
- The cover deck, meta line and native `Scroll to begin` anchor match `CONTENT_AND_SOURCES.md`; no public technical `Scene N` label is present.
- Asset hashes match `ASSET_MANIFEST.md`; each image has a public source and licence.
- The dictatorship delivery image is the 800x544 Bundesarchiv Bild 183-J31347 file with SHA-256 `566459b427f84ae822cdde0e806017c88a8dd45a96eb199905ebd297d039d53f`; it decodes cleanly, remains legible in the maximum 530px CSS slot, and its caption says it is evidence of physical destruction only.
- The Molkenmarkt delivery copy is 1200x747 px, the later-plan delivery copy is 1600x1030 px, the prologue archive derivative is 720x463 px, and the Potsdamer Platz delivery copy is 1600x1090 px; all decode cleanly, and the map labels remain legible at their resized dimensions.
- The later-plan credit identifies it as a later print around 1720 based on the 1652 plan and does not present it as a depiction of 1307 or 1618.
- The Potsdamer Platz credit names Rüdiger Stehn, links CC BY-SA 2.0, identifies the photograph as February 1978 despite the runtime filename, and records the resized delivery copy.
- The local social creative is exactly 1200x630 and its hash matches `ASSET_MANIFEST.md`.
- `map-data.json` fetch failure falls back to a labelled schematic without blanking the story.
- The map disclosure and the visible SVG credit include Berlin Open Data, Berlin Geoportal / ODIS and © OpenStreetMap contributors.
- Consent-gated click tracking emits only `bw_history_story_closing_cta_click` and `bw_history_story_wall_timeline_click`; it emits neither event without analytics consent or under `#bwqa`/QA query mode. Navigation, keyboard activation and modifier/middle-click behaviour remain intact.

## Browser checks

- Desktop 1280px and mobile 390px screenshots: unnumbered cover, prologue, Dictatorship, deportation and destruction, Four places to read Berlin today, sources and image-credit disclosures.
- Activate `Scroll to begin` with mouse and keyboard; it must use the native `#bw-hs-story-start` anchor and land at the first story chapter without adding a rail/progress record.
- Scroll down and rapidly back up; reload in a middle chapter; then test a landscape mobile viewport.
- With reduced motion, no decorative animation or long transform transition plays and the active chapter remains legible.
- Keyboard rail: every chapter button has a label, focus ring and usable target.
- Simulate an image failure and map fetch failure; both retain a useful text/diagram fallback.
- Check no horizontal overflow, no console errors, yellow button text is computed dark green/near-black, and source/credit disclosures are closed by default with keyboard operation.
- Verify every rendered related anchor is an ordinary Custom Element link, no link points to `/berlin-history-story` itself, and the disclosure contains exactly the source-controlled verified list. Related reading is rendered only after all 12 chapters: no related-reading block or anchor may appear in or beside the Dictatorship, deportation and destruction chapter (`1933–1945`).
- Before any later distribution change, run `source ../../../scripts/load-api-keys.sh && node scripts/check-history-story-related-links.mjs`. It must verify the live published graph, exact titles and zero inbound sources for the final related-reading payload. If an official target has since gained an inbound link, remove it without substituting a topic-mismatched post, record the changed scope, then rerun the check. The 42 zero-click context statistic is not a release requirement.

## Wix draft and pin checks

- Use the new updater's `--dry-run` first. It must cursor through existing custom embeds and show a separate target, never the Wall Timeline embed.
- The actual Wix call may PATCH only Custom Embed `c2efe491-bdf5-4deb-8946-54649fd49344` and must leave the site unpublished.
- Commit only the intended package and source-controlled updater/verifier/measurement paths. Pin the jsDelivr URL to that exact commit.
- Read the Wix draft back, verify its Custom Embed ID/path, then compare its installed pin with the local commit.
- Before any publication approval, capture live-in-draft desktop/mobile evidence for: hero, the Dictatorship, deportation and destruction chapter, the closing CTA, reduced motion, image credits and sources, related links, and the exact pin.
- Configure title, description, canonical and the uploaded social creative natively in Wix. After verified publication, run `BW_BERLIN_HISTORY_STORY_SOCIAL_IMAGE=<exact-wix-media-url> node scripts/verify-berlin-history-story-social-preview.mjs`; it checks server HTML as browser, Twitterbot and Facebook and decodes the downloaded image, so a runtime safety-net or false 1200x630 tag cannot produce a false pass.
