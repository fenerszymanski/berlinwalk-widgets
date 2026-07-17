## Mehringplatz Time-Layer Viewer

A dependency-free, responsive evidence viewer for the unpublished `Berlin Then and Now` draft.

### Editorial model

- Four licensed photographs: 1894, 1957, 1974 and 2024.
- Side-by-side comparison with an explicit different-viewpoint warning.
- No opacity overlay, fake same-angle claim or generated reconstruction.
- Evidence prompts explain what survived, disappeared or changed.

### Accessibility and embed behaviour

- Arrow keys plus Home/End move through the year tabs.
- All images have descriptive alt text and use `object-fit: contain` to avoid evidence-cropping.
- A polite live region announces selection changes.
- Image Credits is closed by default, opens as an overlay and closes via its button, Escape or outside click without changing the component height.
- The modal traps keyboard focus while open.
- Reduced-motion preferences disable transitions.
- Load and viewport-resize checks send `bw:mehringplatz-resize` to the parent preview/embed without observing height changes recursively.
- Yellow controls use dark-green text.

### Local use

Serve the `berlinwalk-widgets` directory over HTTP and open `/mehringplatz-time-layer-viewer/`. Run `node test.mjs` for static validation.

The four viewer images are derivatives of the article package assets. Full source, licence, attribution and hash records live in `../blog-drafts/berlin-then-and-now/image-manifest.json`.
