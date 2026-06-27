# Berlin Bike Lane Map - Local QA

Generated: 2026-06-27, Europe/Berlin

Local server: `http://127.0.0.1:4190/`
Widget URL tested: `http://127.0.0.1:4190/berlin-bike-lane-map/`

## Results

| Viewport | Status | Markers | Tiles | Interaction | Overflow |
| --- | --- | ---: | ---: | --- | ---: |
| Desktop | 200 | 8 | 12 | East Side / Warschauer selected | 0 |
| 390px mobile | 200 | 8 | 6 | Karl-Marx-Allee selected | 0 |

## Notes

- Leaflet loaded successfully.
- Scoped Leaflet positioning fallback CSS is present.
- The widget calls `invalidateSize()` repeatedly after load and interaction.
- The widget is a supporting article embed, not a separate BerlinTools card/CMS item.
