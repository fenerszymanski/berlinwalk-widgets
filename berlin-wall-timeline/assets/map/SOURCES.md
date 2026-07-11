# Berlin Wall Timeline map data

`map-data.json` is a compact, pre-projected SVG-path package for the timeline. It is not a live tile map and does not make runtime requests to any map provider.

## Sources

- Wall, rear wall, border strip and political border: [Berlin Open Data WFS, Verlauf der Berliner Mauer 1989](https://daten.berlin.de/datensaetze/verlauf-der-berliner-mauer-1989-wfs-3dcda64c). The dataset is published under Datenlizenz Deutschland Zero 2.0.
- Berlin Ortsteile: [Berlin Geoportal WFS via ODIS WFS Explorer](https://wfsexplorer.odis-berlin.de/?layer=alkis_ortsteile%3Aortsteile&wfs=https%3A%2F%2Fgdi.berlin.de%2Fservices%2Fwfs%2Falkis_ortsteile). Ortsteile are grouped into historical occupation-sector overlays for story use.
- Waterways and named water areas: [OpenStreetMap](https://www.openstreetmap.org/copyright), queried from the Berlin bounding box through the Overpass API and simplified to the major named waterways, canals and lakes used by the visual map.
- Historical places and tour landmarks: the existing BerlinWalk Wall-map landmark dataset in `east-west-1989/data/landmarks.json`.

## Processing

The build script in `../../_build/build_map_data.py` simplifies the source geometries, projects them into the timeline's `1000x640` SVG coordinate system, and writes the runtime package. The runtime keeps the existing schematic SVG as a fallback if the package cannot load.

The map is a visual story reconstruction, not a survey-grade historical boundary claim. The official Wall source itself notes that the 1989 border strip is not parcel-accurate.
