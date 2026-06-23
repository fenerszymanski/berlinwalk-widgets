# Berlin Smile Challenge Page

Custom element wrapper for the Wix `/games/berlin-smile-challenge` page.

Use on Wix:

```html
<bw-berlin-smile-challenge-page></bw-berlin-smile-challenge-page>
<script src="https://fenerszymanski.github.io/berlinwalk-widgets/berlin-smile-challenge-page/berlin-smile-challenge-page-element.js?v=smile-launch-20260623"></script>
```

The wrapper renders the editorial game landing page, embeds the standalone
`berlin-smile-challenge/` game iframe, forwards UTM parameters, and listens for
`bw-resize` messages from the game so the framed device stays at the right
height in Wix.

Target live URL:

```text
https://www.berlinwalk.com/games/berlin-smile-challenge
```
