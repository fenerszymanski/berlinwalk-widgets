# Berlin Split Real Berlin Map Source - 2026-06-30

Internal production note for `Berlin Split: The Lost Archive`.

## Source

- Map data and raster tiles: OpenStreetMap contributors.
- Tile endpoint used for prototype asset generation: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
- Fetch date: 2026-06-30.
- Center: `52.5208, 13.4074`.
- Zoom: `13`.
- Final crop: `960x600`.
- Tile range: `x 4399-4402`, `y 2685-2687`.

## Files

- `berlin-center-osm-z13-960x600.png` - raw stitched central Berlin map.
- `../../visuals/berlin-split-real-berlin-map.webp` - final lightly archive-styled game map.

## Attribution

If this map is shown publicly, keep visible attribution nearby:

`© OpenStreetMap contributors`

The game currently renders this attribution inside the mini-map panel via `visuals.mapAttribution`.
