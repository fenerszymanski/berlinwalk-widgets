# BerlinWalk Widget Migration Plan

## Goal

Move Wix Blog HTML embeds away from Wix-hosted `usrfiles.com/html/...` files and
replace them with GitHub Pages "Embed a Site" URLs.

This avoids browser blocking issues, reduces blank iframe space, and lets us
update widgets centrally from one repository.

## Priority Order

1. Quick Summary + Audio
2. FAQ
3. Lead Form placements
4. Post-specific widgets
5. Inline CTA variants

## Quick Summary Workflow

For each blog post:

1. Pull the existing post rich content from Wix.
2. Extract the old quick summary items and audio URL.
3. Add one new record to `quick-summary/data.json`.
4. Commit locally.
5. Push with GitHub Desktop.
6. Replace the old Wix HTML embed with an "Embed a Site" URL.

Use this URL pattern in Wix:

```text
https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=POST_KEY
```

Recommended Wix element height:

```text
520px
```

## Naming Convention

Use short, readable post keys:

```text
gift-guide
pergamon-closed
berlin-welcomecard
sunday-berlin
berlin-safety
public-transport
```

Avoid full blog slugs unless needed.

## Quality Check

Before replacing the embed in Wix:

1. Open the GitHub Pages widget URL.
2. Confirm audio loads.
3. Confirm all summary items render.
4. Confirm no internal iframe scrolling at `520px`.
5. Only then replace the Wix embed.

## Current Migrated Posts

```text
gift-guide
pergamon-closed
```

