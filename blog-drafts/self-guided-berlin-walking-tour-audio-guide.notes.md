# Notes - self-guided-berlin-walking-tour-audio-guide

- Status: complete local main-domain migration package; no Wix mutation performed in this branch.
- Source owner being replaced: `https://app.berlinwalk.com/audio-tours/self-guided-berlin-walking-tour-audio-guide`.
- Planned canonical owner: `https://www.berlinwalk.com/post/self-guided-berlin-walking-tour-audio-guide`.
- Focus keyword: `self-guided Berlin walking tour with audio`.
- Search intent: choose a real self-guided Berlin route by start, finish, duration and subject.
- Category: Tour Route + Tourist Tips.
- Widget: `berlin-audio-route-map`.
- Quick Summary / FAQ key: `self-guided-berlin-walking-tour-audio-guide`.
- Route facts checked 15 July 2026 against the live five-route Audio Tours hub and product route data. External practical links checked against BVG, Google Maps Help and the Berlin Wall Memorial.
- Post must remain UNPUBLISHED until the root migration run clears exact draft readback, deployed widget/map QA and publication gate.
- Redirect order: publish and verify the main-domain post first, then change the exact app-domain path to a 301. Never redirect before the new owner returns 200.

## Widget ideas considered

1. A duration-and-interest picker. Rejected because the Audio Tours hub already has comparison cards and the pattern would be too familiar.
2. A sample stop carousel. Rejected because it would reveal too little route logic and risk feeling decorative.
3. A real OpenStreetMap view of every public start and finish, with route spans, duration and transport handoff. Selected because it answers the geographic decision the article is built around.
