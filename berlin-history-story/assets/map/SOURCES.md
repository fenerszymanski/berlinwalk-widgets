# Berlin History Story V1 map data

`map-data.json` is a compact, pre-projected SVG-path package inherited byte-for-byte from the verified Berlin Wall Timeline map package. It is not a live tile map and makes no runtime request to a map provider beyond loading this static package.

## Sources and required attribution

- Wall, rear-wall, border-strip and political-border geometry: [Berlin Open Data WFS, Verlauf der Berliner Mauer 1989](https://daten.berlin.de/datensaetze/verlauf-der-berliner-mauer-1989-wfs-3dcda64c). Licence: Datenlizenz Deutschland Zero 2.0.
- Berlin Ortsteile: [Berlin Geoportal WFS via ODIS WFS Explorer](https://wfsexplorer.odis-berlin.de/?layer=alkis_ortsteile%3Aortsteile&wfs=https%3A%2F%2Fgdi.berlin.de%2Fservices%2Fwfs%2Falkis_ortsteile). The renderer uses simplified district geometry as a contextual outline, not as a historical occupation-boundary claim.
- Waterways and named water areas: [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright), queried from the Berlin bounding box through Overpass and simplified to the major waterways retained in the static package. Licence: ODbL.
- Historical places and tour landmarks: existing BerlinWalk Wall-map landmark dataset in `east-west-1989/data/landmarks.json` at the time this static package was built.

The visible map credit is: `Map data: Berlin Open Data · Berlin Geoportal / ODIS · © OpenStreetMap contributors`.

## Use boundary

The map is a visual story reconstruction. It is not a survey-grade historical boundary map, does not establish a 1920 boundary claim, and is used in this story only for sector, airport, Wall and present-day orientation.
