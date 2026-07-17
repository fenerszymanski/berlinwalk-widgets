# Berlin Audio Tours social preview

The selected production asset is `audio-tours-social-1200x630.jpg`.

- Canvas: 1200 x 630 px, JPEG
- Direction: Editorial Split
- Destination: `https://www.berlinwalk.com/audio-tours`
- Board: `b749bd24-352e-49d3-b55c-f1ddc43d0ee1`
- Headline: `Berlin Audio Tours`
- Kicker: `PRESS PLAY. STEP INTO BERLIN.`
- Supporting copy: `Five self-guided walks, written around the places where the history happened.`

The composition uses BerlinWalk's real product photography for the five live audio routes. Source URLs are fixed in `scripts/build-audio-tours-social-preview.cjs`; no replacement or synthetic city image is used.

## Rebuild

Run with the workspace dependency runtime and the brand asset directory:

```sh
NODE_PATH=/Users/yusufucuz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules \
BERLINWALK_BRAND_ROOT='/Users/yusufucuz/Documents/New project/brand' \
/Users/yusufucuz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
scripts/build-audio-tours-social-preview.cjs
```

The four named direction exports and the contact sheet are retained as internal design evidence. Only the canonical `audio-tours-social-1200x630.jpg` file should be selected in Wix Social Share settings.
