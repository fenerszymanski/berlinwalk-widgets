# Where in Berlin Do You Belong?

Six four-choice Berlin situations map a player to one of all 12 Berlin boroughs.

## Local preview

```bash
cd /Users/yusufucuz/Documents/New\ project/berlinwalk-widgets
python3 -m http.server 8765
```

- Widget: `http://127.0.0.1:8765/where-in-berlin/`
- Wrapper: `http://127.0.0.1:8765/where-in-berlin-page/`

## Checks

```bash
node where-in-berlin/scripts/validate-content.mjs
node --check where-in-berlin/where-in-berlin-element.js
node --check where-in-berlin-page/where-in-berlin-page-element.js
```

`validate-content.mjs` enumerates all 4,096 answer paths. Each of the 12
boroughs must remain reachable and hold a 3-15% synthetic share.

From the workspace root, run the broader launch check:

```bash
node scripts/check-where-in-berlin-launch-readiness.mjs --live
```

It is read-only: it checks asset counts, syntax, content balance,
tracking/dashboard markers, the relevant Git path manifest and, with `--live`,
the public URL status.

## Launch gates

Full launch sequence: `where-in-berlin/LAUNCH_RUNBOOK.md`.

Do not run the live chain until Yusuf approves the launch. When approved:

1. Commit only the relevant paths printed by the readiness script.
2. Push `berlinwalk-widgets` and wait for GitHub Pages to serve
   `where-in-berlin/` and `where-in-berlin-page/`.
3. From the workspace root, run `source scripts/load-api-keys.sh`.
4. Run the `BerlinDistrictMatchEvents` collection setup script.
5. Run the Where in Berlin page embed upsert script with the pushed commit ref.
6. Publish the nav/footer patch and verify `/games/where-in-berlin` on desktop
   and mobile before marking the game shipped in the rollout plan.

## Audio

From the workspace root, load the local keychain credentials first:

```bash
source scripts/load-api-keys.sh
node berlinwalk-widgets/where-in-berlin/scripts/generate-elevenlabs-audio.mjs
```

The generator uses the existing Hidden Berlin Audio Route narrator. It does
not use Yusuf's voice clone. Internal prompts and source notes are under
`assets/source/` and must not be exposed in public copy or credits.
