# Where in Berlin Do You Belong? Launch Runbook

Internal launch notes for the retention-game rollout. Do not publish or push
until Yusuf explicitly approves this game going live.

## Current gate

- Local package: ready.
- GitHub Pages: not live yet.
- Wix `/games/where-in-berlin`: not live yet.
- Collection setup, page embed, nav/footer publish: not run yet.
- Reason: Yusuf launch approval is still required.

## Pre-launch verifier

From the workspace root:

```bash
node scripts/check-where-in-berlin-launch-readiness.mjs --live
```

Expected before launch:

- `ok: true`
- `shippedLive: false`
- asset counts: 24 question images, 12 result posters, 26 MP3 files
- Wix and GitHub Pages URLs may still be `404`

Do not continue if `ok` is not true.

## Relevant widget commit paths

The `berlinwalk-widgets` repo is usually dirty. Do not use a bare
`git commit`. Commit only the game paths below.

```text
where-in-berlin
where-in-berlin-page
games-page/games-page-element.js
games-page/games-hub-modal-element.js
js/games-preview-rail.js
berlin-battle-home/berlin-battle-home-element.js
site-header/site-header-element.js
site-footer/site-footer-element.js
```

`SESSION_LOG.md` is intentionally not in the automatic commit list because it
often contains unrelated shared-worktree entries. If it must be committed, first
inspect its diff and include only when the staged diff is acceptable.

## Safe isolated widget commit

Use an alternate index so unrelated staged files in the shared worktree cannot
enter the release commit.

```bash
cd /Users/yusufucuz/Documents/New\ project/berlinwalk-widgets
export GIT_INDEX_FILE=/tmp/bw-where-in-berlin.index
rm -f "$GIT_INDEX_FILE"
git read-tree HEAD
git add -- \
  where-in-berlin \
  where-in-berlin-page \
  games-page/games-page-element.js \
  games-page/games-hub-modal-element.js \
  js/games-preview-rail.js \
  berlin-battle-home/berlin-battle-home-element.js \
  site-header/site-header-element.js \
  site-footer/site-footer-element.js
git diff --cached --name-only
git diff --cached --check
git commit -m "Add Where in Berlin district match game"
unset GIT_INDEX_FILE
git push origin main
```

After push, record the commit:

```bash
cd /Users/yusufucuz/Documents/New\ project
WHERE_REF=$(git -C berlinwalk-widgets rev-parse --short=12 HEAD)
echo "$WHERE_REF"
```

## Pages propagation

Wait until GitHub Pages serves both routes:

```bash
curl -sS -L -o /tmp/where-game.html -w "%{http_code}\n" \
  "https://fenerszymanski.github.io/berlinwalk-widgets/where-in-berlin/?cb=$WHERE_REF"
curl -sS -L -o /tmp/where-page.html -w "%{http_code}\n" \
  "https://fenerszymanski.github.io/berlinwalk-widgets/where-in-berlin-page/?cb=$WHERE_REF"
```

Both must return `200` before Wix exposure.

## Wix and tracking launch

From the workspace root:

```bash
source scripts/load-api-keys.sh
node scripts/setup-berlin-district-match-events-collection.mjs
node scripts/upsert-games-nav-footer-embed.mjs --dry-run
node scripts/upsert-games-nav-footer-embed.mjs
BW_WHERE_IN_BERLIN_REF="$WHERE_REF" node scripts/upsert-where-in-berlin-page-wix-embed.mjs
```

The page embed script publishes the Wix site. If a later step updates another
custom embed without publishing, publish the site before live QA.

## Live QA

Run the verifier again:

```bash
node scripts/check-where-in-berlin-launch-readiness.mjs --live
```

Now the GitHub Pages URLs should be `200`; the Wix route must also return `200`
and render the game before the rollout can be marked shipped.

Manual browser QA still needs:

- desktop `/games/where-in-berlin`
- 390px mobile `/games/where-in-berlin`
- complete one game result
- replay same Berlin day and confirm second stamp is locked
- share action works or degrades cleanly
- booking CTA URL includes the game UTM
- header/footer/games hub/home links do not point to a 404

Only after this passes:

1. Mark the game shipped in `RETENTION_GAMES_ROLLOUT_PLAN.md`.
2. Append final root and widget session logs.
3. Report the shipped live URL and the next queued item, Berlin Pulse.
