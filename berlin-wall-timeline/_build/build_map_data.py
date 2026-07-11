#!/usr/bin/env python3
"""Build the static, stylised Berlin map used by the Wall timeline.

The runtime consumes projected SVG path strings instead of loading a map SDK or
requesting tiles. Source files are downloaded separately from the public Berlin
WFS/OpenStreetMap endpoints and passed to this script.
"""

from __future__ import annotations

import argparse
import json
import math
from pathlib import Path
from typing import Any, Iterable

from shapely.geometry import GeometryCollection, LineString, MultiLineString, MultiPolygon, Point, Polygon, shape
from shapely.ops import unary_union


VIEW_W = 1000
VIEW_H = 640
MAP_MARGIN = 56

SECTORS = {
    "french": {
        "label": "French sector",
        "fill": "#7CB342",
        # The French sector covered the Wedding and Reinickendorf boroughs.
        # The source is current Ortsteile, so dissolve every present-day
        # neighbourhood that sits inside those two historical boroughs.
        "names": {
            "Borsigwalde", "Frohnau", "Gesundbrunnen", "Heiligensee",
            "Hermsdorf", "Konradshöhe", "Lübars", "Märkisches Viertel",
            "Reinickendorf", "Tegel", "Waidmannslust", "Wedding", "Wittenau",
        },
    },
    "british": {
        "label": "British sector",
        "fill": "#FAFAF5",
        "names": {
            "Charlottenburg", "Charlottenburg-Nord", "Westend", "Spandau",
            "Staaken", "Falkenhagener Feld", "Gatow", "Hakenfelde", "Haselhorst",
            "Kladow", "Siemensstadt", "Wilhelmstadt", "Tiergarten", "Moabit",
            "Hansaviertel", "Wilmersdorf", "Halensee", "Schmargendorf",
        },
    },
    "american": {
        "label": "American sector",
        "fill": "#FFE600",
        "names": {
            "Kreuzberg", "Neukölln", "Britz", "Buckow", "Gropiusstadt", "Neukölln",
            "Rudow", "Tempelhof", "Mariendorf", "Marienfelde", "Lichtenrade",
            "Schöneberg", "Friedenau", "Steglitz", "Lankwitz", "Lichterfelde",
            "Dahlem", "Zehlendorf", "Nikolassee", "Schlachtensee", "Wannsee",
            "Grunewald",
        },
    },
    "soviet": {
        "label": "Soviet sector",
        "fill": "#E63946",
        "names": set(),
    },
}

LABEL_NAMES = {
    "Mitte", "Prenzlauer Berg", "Friedrichshain", "Lichtenberg", "Köpenick",
    "Neukölln", "Tempelhof", "Kreuzberg", "Charlottenburg", "Tiergarten",
    "Wedding", "Spandau", "Reinickendorf", "Zehlendorf", "Schöneberg",
}

AIRPORTS = [
    {"id": "tempelhof", "name": "Tempelhof", "lon": 13.4037, "lat": 52.4730, "role": "arrival"},
    {"id": "gatow", "name": "Gatow", "lon": 13.1384, "lat": 52.4730, "role": "arrival"},
    {"id": "tegel", "name": "Tegel", "lon": 13.2877, "lat": 52.5597, "role": "arrival"},
    {"id": "hamburg", "name": "Hamburg", "lon": 10.0067, "lat": 53.5511, "role": "origin"},
    {"id": "hannover", "name": "Hannover", "lon": 9.7320, "lat": 52.3759, "role": "origin"},
    {"id": "frankfurt", "name": "Frankfurt", "lon": 8.6821, "lat": 50.1109, "role": "origin"},
]

STORY_POINTS = [
    {"id": "berliner-mauer-bernauer", "group": "story", "name": "Bernauer Straße", "lon": 13.3963, "lat": 52.5352},
    {"id": "bornholmer-strasse", "group": "story", "name": "Bornholmer Straße", "lon": 13.3964, "lat": 52.5544},
    {"id": "brandenburg-gate", "group": "story", "name": "Brandenburg Gate", "lon": 13.3777, "lat": 52.5163},
]


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def features(data: dict[str, Any]) -> list[dict[str, Any]]:
    if data.get("type") == "FeatureCollection":
        return list(data.get("features", []))
    if data.get("type") == "Feature":
        return [data]
    return [{"type": "Feature", "properties": {}, "geometry": data}]


def all_geometries(data: dict[str, Any]) -> list[Any]:
    return [shape(f["geometry"]) for f in features(data) if f.get("geometry")]


def geometry_parts(geom: Any) -> Iterable[Any]:
    if geom.is_empty:
        return []
    if isinstance(geom, (Polygon, LineString, Point)):
        return [geom]
    if isinstance(geom, (MultiPolygon, MultiLineString, GeometryCollection)):
        return list(geom.geoms)
    return []


def simplify(geom: Any, tolerance: float) -> Any:
    return geom.simplify(tolerance, preserve_topology=True)


def coordinate_pairs(coords: Iterable[tuple[float, float]], project) -> list[tuple[float, float]]:
    return [project(float(lon), float(lat)) for lon, lat, *_ in coords]


def path_for(geom: Any, project, close: bool | None = None) -> str:
    chunks: list[str] = []
    if isinstance(geom, Polygon):
        rings = [geom.exterior, *geom.interiors]
        for ring in rings:
            pts = coordinate_pairs(ring.coords, project)
            if not pts:
                continue
            chunks.append("M " + " ".join(f"{x:.1f},{y:.1f}" for x, y in pts) + " Z")
    elif isinstance(geom, LineString):
        pts = coordinate_pairs(geom.coords, project)
        if pts:
            chunks.append("M " + " ".join(f"{x:.1f},{y:.1f}" for x, y in pts) + (" Z" if close else ""))
    elif isinstance(geom, Point):
        x, y = project(geom.x, geom.y)
        chunks.append(f"M {x:.1f},{y:.1f}")
    elif isinstance(geom, (MultiPolygon, MultiLineString, GeometryCollection)):
        for part in geom.geoms:
            chunks.append(path_for(part, project, close=close))
    return " ".join(c for c in chunks if c)


def point_for(geom: Any, project) -> tuple[float, float]:
    p = geom.representative_point()
    return project(p.x, p.y)


def bounds_for(geoms: Iterable[Any]) -> tuple[float, float, float, float]:
    union = unary_union([g for g in geoms if not g.is_empty])
    minx, miny, maxx, maxy = union.bounds
    pad_x = (maxx - minx) * 0.025
    pad_y = (maxy - miny) * 0.025
    return minx - pad_x, miny - pad_y, maxx + pad_x, maxy + pad_y


def projection(bounds: tuple[float, float, float, float]):
    min_lon, min_lat, max_lon, max_lat = bounds
    mid_lat = math.radians((min_lat + max_lat) / 2)
    x_span = (max_lon - min_lon) * math.cos(mid_lat)
    y_span = max_lat - min_lat
    scale = min((VIEW_W - MAP_MARGIN * 2) / x_span, (VIEW_H - MAP_MARGIN * 2) / y_span)
    x_offset = (VIEW_W - x_span * scale) / 2
    y_offset = (VIEW_H - y_span * scale) / 2

    def project(lon: float, lat: float) -> tuple[float, float]:
        x = x_offset + (lon - min_lon) * math.cos(mid_lat) * scale
        y = y_offset + (max_lat - lat) * scale
        return x, y

    return project


def feature_paths(data: dict[str, Any], project, tolerance: float) -> list[str]:
    paths = []
    for geom in all_geometries(data):
        s = simplify(geom, tolerance)
        d = path_for(s, project)
        if d:
            paths.append(d)
    return paths


def parse_water(path: Path, project) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    raw = read_json(path)
    lines: list[dict[str, Any]] = []
    areas: list[dict[str, Any]] = []
    keep_names = {
        "Spree", "Havel", "Landwehrkanal", "Teltowkanal", "Berlin-Spandauer Schifffahrtskanal",
        "Westhafenkanal", "Charlottenburger Verbindungskanal", "Neuköllner Schifffahrtskanal",
        "Müggelsee", "Großer Müggelsee", "Tegeler See", "Wannsee", "Schlachtensee",
        "Krumme Lanke", "Rummelsburger See", "Plötzensee", "Weißer See", "Orankesee",
    }
    for el in raw.get("elements", []):
        tags = el.get("tags", {})
        name = tags.get("name")
        geom = el.get("geometry")
        if not name or not geom or len(geom) < 2:
            continue
        coords = [(p["lon"], p["lat"]) for p in geom]
        line = LineString(coords)
        kind = tags.get("waterway")
        if kind in {"river", "canal"}:
            if name in keep_names or line.length > 0.008:
                lines.append({"name": name, "d": path_for(simplify(line, 0.00012), project)})
        elif tags.get("natural") == "water" or tags.get("water") == "lake":
            if coords[0] != coords[-1]:
                coords.append(coords[0])
            polygon = Polygon(coords)
            if name in keep_names or polygon.area > 0.00018:
                areas.append({"name": name, "d": path_for(simplify(polygon, 0.00012), project)})
    return [x for x in lines if x["d"]], [x for x in areas if x["d"]]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ortsteile", type=Path, required=True)
    parser.add_argument("--water", type=Path, required=True)
    parser.add_argument("--wall-dir", type=Path, required=True)
    parser.add_argument("--east", type=Path, required=True)
    parser.add_argument("--west", type=Path, required=True)
    parser.add_argument("--strip", type=Path, required=True)
    parser.add_argument("--landmarks", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()

    ortsteile = read_json(args.ortsteile)
    district_geoms = [(f["properties"].get("nam", ""), shape(f["geometry"])) for f in features(ortsteile) if f.get("geometry")]
    bounds = bounds_for([g for _, g in district_geoms])
    project = projection(bounds)

    all_sector_names = set().union(*(s["names"] for s in SECTORS.values()))
    known_names = {name for name, _ in district_geoms}
    SECTORS["soviet"]["names"] = known_names - all_sector_names

    sector_out = []
    for key, spec in SECTORS.items():
        merged = unary_union([g for name, g in district_geoms if name in spec["names"]])
        sector_out.append({
            "id": key,
            "label": spec["label"],
            "fill": spec["fill"],
            "d": path_for(simplify(merged, 0.00013), project),
            "labelPoint": [round(v, 1) for v in point_for(merged, project)],
        })

    districts = []
    for name, geom in district_geoms:
        d = path_for(simplify(geom, 0.00016), project)
        if d:
            districts.append({"name": name, "d": d})

    labels = []
    for name, geom in district_geoms:
        if name not in LABEL_NAMES:
            continue
        x, y = point_for(geom, project)
        labels.append({"name": name, "x": round(x, 1), "y": round(y, 1)})

    official = {}
    for key in ["a_grenzmauer", "b_hinterlandmauer", "d_grenzstreifen", "c_politischegrenze"]:
        data = read_json(args.wall_dir / f"{key}.geojson")
        official[key] = feature_paths(data, project, 0.000035 if key.startswith(("a_", "b_", "c_")) else 0.0001)

    landmarks = read_json(args.landmarks)
    points = []
    for group in ["checkpoints", "watchtowers", "tour_landmarks"]:
        for item in landmarks.get(group, []):
            x, y = project(float(item["lng"]), float(item["lat"]))
            points.append({"id": f"{group}-{item['name']}", "group": group, "name": item["name"], "x": round(x, 1), "y": round(y, 1), "lat": item["lat"], "lng": item["lng"]})

    for item in STORY_POINTS:
        x, y = project(float(item["lon"]), float(item["lat"]))
        points.append({**item, "x": round(x, 1), "y": round(y, 1), "lng": item["lon"]})

    airports = []
    for item in AIRPORTS:
        x, y = project(item["lon"], item["lat"])
        airports.append({**item, "x": round(x, 1), "y": round(y, 1)})

    water_lines, water_areas = parse_water(args.water, project)
    payload = {
        "version": "berlin-wall-timeline-map-v1",
        "viewBox": [0, 0, VIEW_W, VIEW_H],
        "bounds": [round(v, 7) for v in bounds],
        "districts": districts,
        "labels": labels,
        "sectors": sector_out,
        "waterLines": water_lines,
        "waterAreas": water_areas,
        "westBerlin": feature_paths(read_json(args.west), project, 0.00013),
        "eastBerlin": feature_paths(read_json(args.east), project, 0.00013),
        "deathStrip": feature_paths(read_json(args.strip), project, 0.0001),
        "wall": {
            "main": official["a_grenzmauer"],
            "rear": official["b_hinterlandmauer"],
            "political": official["c_politischegrenze"],
            "strip": official["d_grenzstreifen"],
        },
        "points": points,
        "airports": airports,
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, separators=(",", ":")) + "\n", encoding="utf-8")
    print(json.dumps({"out": str(args.out), "bytes": args.out.stat().st_size, "districts": len(districts), "waterLines": len(water_lines), "waterAreas": len(water_areas), "sectors": len(sector_out), "wallMain": len(official["a_grenzmauer"]), "wallRear": len(official["b_hinterlandmauer"])}, indent=2))


if __name__ == "__main__":
    main()
