# Berlin Bike Lanes Tourists - Local Embed QA

Generated: 2026-06-27, Europe/Berlin

Local server: `http://127.0.0.1:4189/`

## Results

| Embed | Viewport | Status | Overflow | Notes |
| --- | --- | --- | ---: | --- |
| `berlin-bike-lane-reflex-checker/` | desktop | 200 | 0 | Interaction changed result to `Park it where people can pass without detouring.` |
| `berlin-bike-lane-reflex-checker/` | 390px mobile | 200 | 0 | Interaction changed result to `Park it where people can pass without detouring.` |
| `quick-summary/?post=berlin-bike-lanes-tourists` | desktop | 200 | 0 | Rendered the Berlin Bike Lanes quick summary key. |
| `quick-summary/?post=berlin-bike-lanes-tourists` | 390px mobile | 200 | 0 | Rendered the Berlin Bike Lanes quick summary key. |
| `faq/?post=berlin-bike-lanes-tourists` | desktop | 200 | 0 | Rendered the question `Can tourists walk in Berlin bike lanes?` |
| `faq/?post=berlin-bike-lanes-tourists` | 390px mobile | 200 | 0 | Rendered the question `Can tourists walk in Berlin bike lanes?` |

Console note: the only browser console error seen during local Quick Summary/FAQ checks was the local `favicon.ico` 404 from `python3 -m http.server`; no widget/data/rendering error was seen.
