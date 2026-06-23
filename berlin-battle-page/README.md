# Berlin Battle Page

Short custom element wrapper for the Wix `/games/berlin-battle` page.

Use on Wix:

```html
<bw-berlin-battle-page></bw-berlin-battle-page>
<script src="https://fenerszymanski.github.io/berlinwalk-widgets/berlin-battle-page/berlin-battle-page-element.js?v=battle-game-focus-20260623"></script>
```

The element renders a card-duel themed Berlin Battle page and embeds the standalone
`berlin-battle/` game iframe with automatic `bw-resize` handling and the iframe
permissions needed for the result share/copy actions.

Fast-play campaign URL:

```text
https://www.berlinwalk.com/games/berlin-battle?topic=food&utm_source=instagram&utm_medium=story&utm_campaign=bw_berlin_battle_reels_jun2026&utm_content=link_sticker_food
```

When a valid `topic` query parameter is present, the wrapper switches to a
short direct-play intro and the game iframe auto-starts that battle.

Internal stats dashboard:

```bash
source ../scripts/load-api-keys.sh
node ../scripts/setup-berlin-battle-events-collection.mjs
node ../scripts/berlin-battle-dashboard-server.mjs --port 4198
```

Then open `http://127.0.0.1:4198/`. The dashboard reads the Wix CMS
`BerlinBattleEvents` collection populated by the public `/api/battle-event`
tracking endpoint in the Content Studio app. Local game previews do not send
first-party events by default; add `tracking=local` to the game iframe URL only
when the local Content Studio server is running and you intentionally want to
write local QA events.
