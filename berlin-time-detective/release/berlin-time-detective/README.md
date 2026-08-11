# Berlin Time Detective

Berlin Time Detective is a five-mission BerlinWalk web game. This folder is a local, unpublished static package with no build step.

To serve it locally, run a static HTTP server from the directory that contains `release/`, for example:

```bash
python3 -m http.server 8001
```

Then open `/release/berlin-time-detective/`. The game includes its own image credits and works with a keyboard, touch, or pointer input. `release-manifest.json` records the package file hashes.
