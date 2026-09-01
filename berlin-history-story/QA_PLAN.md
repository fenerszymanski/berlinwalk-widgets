# Berlin History Story V1 - QA plan

The package remains `UNPUBLISHED` until every applicable check below passes and Yusuf gives fresh action-time approval.

## Build checks

- `node --check history-story-element.js`
- No inherited Wall Timeline identity remains in element, updater, SEO, QA or output paths. The only permitted `berlin-wall-timeline` occurrence is the deliberate Scene 8 deep link; the unchanged `assets/map/map-data.json` retains its historic source-version string and is excluded from that grep.
- `git diff --check` passes.
- The public copy has ten scenes, no body-title duplicate and no sales CTA in the 1933-45 scene.
- Asset hashes match `ASSET_MANIFEST.md`; each image has a public source and licence.
- The local social creative is exactly 1200x630 and its hash matches `ASSET_MANIFEST.md`.
- `map-data.json` fetch failure falls back to a labelled schematic without blanking the story.
- The map disclosure and the visible SVG credit include Berlin Open Data, Berlin Geoportal / ODIS and © OpenStreetMap contributors.
- Consent-gated click tracking emits only `bw_history_story_closing_cta_click` and `bw_history_story_wall_timeline_click`; it emits neither event without analytics consent or under `#bwqa`/QA query mode. Navigation, keyboard activation and modifier/middle-click behaviour remain intact.

## Browser checks

- Desktop 1280px and mobile 390px screenshots: hero, scene 6, scene 10, sources and image-credit disclosures.
- Scroll down and rapidly back up; reload in a middle scene; then test a landscape mobile viewport.
- With reduced motion, no decorative animation or long transform transition plays and the active scene remains legible.
- Keyboard rail: every scene button has a label, focus ring and usable target.
- Simulate an image failure and map fetch failure; both retain a useful text/diagram fallback.
- Check no horizontal overflow, no console errors, yellow button text is computed dark green/near-black, and source/credit disclosures are closed by default with keyboard operation.
- Verify all 42 related links render as ordinary anchors in the Custom Element and no link points to `/berlin-history-story` itself.
- Do not treat the inherited 42-link baseline as a pass. Before release, rerun the current Wix inbound-link graph and apply the written history rubric in `RELATED_LINK_STATUS.md`.

## Wix draft and pin checks

- Use the new updater's `--dry-run` first. It must cursor through existing custom embeds and show a separate target, never the Wall Timeline embed.
- The actual Wix call may PATCH only Custom Embed `c2efe491-bdf5-4deb-8946-54649fd49344` and must leave the site unpublished.
- Commit only the intended package and source-controlled updater/verifier/measurement paths. Pin the jsDelivr URL to that exact commit.
- Read the Wix draft back, verify its Custom Embed ID/path, then compare its installed pin with the local commit.
- Before any publication approval, capture live-in-draft desktop/mobile evidence for: hero, 1933-45 scene, closing CTA, reduced motion, image credits and sources, related links, and the exact pin.
- Configure title, description, canonical and the uploaded social creative natively in Wix. After verified publication, run `BW_BERLIN_HISTORY_STORY_SOCIAL_IMAGE=<exact-wix-media-url> node scripts/verify-berlin-history-story-social-preview.mjs`; it checks server HTML as browser, Twitterbot and Facebook and decodes the downloaded image, so a runtime safety-net or false 1200x630 tag cannot produce a false pass.
