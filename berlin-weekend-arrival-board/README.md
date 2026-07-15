# Berlin Weekend Arrival Board

Article-specific widget for `weekend-in-berlin-48-hour-itinerary`.

It uses a time-board interaction rather than a route map so it complements the separate two-day itinerary package. Four arrival states and three departure states change the visible schedule, usable-hours count and Sunday cutoff. All output names real places and one concrete visitor action.

The widget is intentionally not added to `tools-hub/data.json` in this branch. A public BerlinTools card requires its own glossy 3D icon and a Wix CMS item; those should be created in the normal pre-publish promotion pass rather than shipping a placeholder.

Local QA target: desktop at 1100px, mobile at 390px and narrow mobile at 320px. Check all 12 arrival/departure combinations, focus controls, dark text on yellow selected buttons/CTA, no horizontal overflow and no console errors.
