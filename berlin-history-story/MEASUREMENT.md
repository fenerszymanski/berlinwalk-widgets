# Berlin History Story V1 - 30-day measurement contract

Status: `UNPUBLISHED`. Do not set a measurement date until the native Wix page is truly `PUBLISHED — VERIFIED`.

## Window and decision

- Start: the Europe/Berlin publication date.
- End: 30 Europe/Berlin calendar days later, exclusive: `[start, end)`.
- Read no earlier than `end + 3 days` so Search Console has time to settle.
- Expansion is eligible only at **108 or more raw GA4 recorded views**, or **3.6/day**. Do not multiply GA4 by the older consent proxy.
- A failed source or an immature Search Console window is `UNKNOWN_BLOCKED`, never zero and never an automatic no-expansion decision.

## Required signals

| Signal | Exact definition |
|---|---|
| GA4 daily views | `screenPageViews`, exact `pagePath=/berlin-history-story` |
| Average time | `userEngagementDuration / screenPageViews`, both exact `pagePath=/berlin-history-story` |
| Closing CTA clicks | `eventName=bw_history_story_closing_cta_click` and exact `pagePath=/berlin-history-story` |
| Wall Timeline clicks | `eventName=bw_history_story_wall_timeline_click` and exact `pagePath=/berlin-history-story` |
| Search performance | Search Console exact canonical `https://www.berlinwalk.com/berlin-history-story`: clicks, impressions, CTR and average position |

The component emits the two click events only after analytics consent. It deliberately does not add a manual `page_view`, scroll depth, rail, related-link or other incidental event.

## Run

From the BerlinWalk workspace:

```sh
node berlinwalk-widgets/scripts/measure-berlin-history-story-30d.mjs \
  --start YYYY-MM-DD --end YYYY-MM-DD --format markdown
```

The command is read-only against Google and writes no local files. Save its output with the release evidence only after the full 30-day window is available.
