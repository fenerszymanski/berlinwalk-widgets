# BerlinWalk Games Page

Custom Element source for the future `/games` hub page.

## Wix install snippet

```html
<bw-games-page></bw-games-page>
<script src="https://fenerszymanski.github.io/berlinwalk-widgets/games-page/games-page-element.js"></script>
```

## Purpose

`<bw-games-page>` is a Spotlight Grid style hub for the three live BerlinWalk game modes:

- Berlin Battle: `/games/berlin-battle`
- Berghain Bouncer: `/games/berghain-bouncer`
- Berlin Smile Challenge: `/games/berlin-smile-challenge`

It uses existing game cover/social art from the widget repo and avoids fake play-count stats. The current "Game board" section is intentionally status-based so real cross-game analytics can be wired later.

## Notes

- Public copy is English and uses neutral BerlinWalk / first-person-compatible tour language.
- The element does not update the global header/footer yet. Change those only after the Wix `/games` page exists and is published.
- Preview the Spotlight Grid direction by opening `games-page/index.html` or serving the repo root and visiting `/games-page/`.
- Preview the Hub + Panel alternative by opening `games-page/hub-modal.html`.
