#!/usr/bin/env python3
"""
Derive West Berlin, East Berlin, and Death Strip polygons.

Strategy
--------
The Berlin Wall MultiLineString from npm:berlin-wall-shape is fragmentary
(136 disconnected segments) — naive polygonize() against it fails to close
the West Berlin ring at any reasonable snap tolerance.

So we use a hybrid approach:
  1. Take modern Berlin boroughs (m-hoerz/berlin-shapes berliner-bezirke).
  2. Cleanly West / cleanly East boroughs go straight to their side.
  3. The two split boroughs (Mitte, Friedrichshain-Kreuzberg) get cut by the
     Wall line — for Friedrichshain-Kreuzberg the Wall data closes the cut
     by itself; for Mitte the Wall data has gaps, so we add a hand-traced
     connector LineString following the historical Wall route.
  4. Each resulting piece is assigned by checking whether it contains a
     known West-side or East-side reference point.

Outputs:
  data/west-berlin.geojson
  data/east-berlin.geojson
  data/death-strip.geojson  (Wall buffered +/-100m, intersected with East)

Pinned: shapely==2.0.x.

If the bezirke fetch or polygonize fails entirely, we fall back to a coarse
hand-defined West Berlin polygon (see FALLBACK_WEST below).
"""

import json
import os
import sys
import urllib.request

from shapely.geometry import (
    LineString, MultiLineString, Polygon, MultiPolygon, Point, mapping, shape
)
from shapely.ops import unary_union, polygonize

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.normpath(os.path.join(HERE, "..", "data"))

WALL_PATH = os.path.join(DATA, "wall-line.geojson")
BEZIRKE_URL = "https://raw.githubusercontent.com/m-hoerz/berlin-shapes/master/berliner-bezirke.geojson"
BEZIRKE_CACHE = os.path.join(HERE, "_berliner-bezirke.geojson")

WEST_OUT = os.path.join(DATA, "west-berlin.geojson")
EAST_OUT = os.path.join(DATA, "east-berlin.geojson")
STRIP_OUT = os.path.join(DATA, "death-strip.geojson")

WEST_BEZIRKE = {
    "Charlottenburg-Wilmersdorf", "Spandau", "Steglitz-Zehlendorf",
    "Tempelhof-Schöneberg", "Neukölln", "Reinickendorf",
}
EAST_BEZIRKE = {
    "Pankow", "Treptow-Köpenick", "Marzahn-Hellersdorf", "Lichtenberg",
}
SPLIT_BEZIRKE = ["Mitte", "Friedrichshain-Kreuzberg"]

# Hand-traced connector following the Wall route through modern Mitte —
# fills gaps in the source Wall data so polygonize can close the cut.
MITTE_WALL_CONNECTOR = [
    [13.422, 52.561],
    [13.418, 52.555],
    [13.405, 52.547],
    [13.398, 52.540],
    [13.394, 52.532],
    [13.385, 52.524],
    [13.379, 52.516],
    [13.378, 52.510],
    [13.380, 52.504],
]

# Reference points used to classify split-borough pieces.
WEST_REFS = [
    Point(13.357, 52.548),  # Wedding (West)
    Point(13.350, 52.515),  # Tiergarten (West)
    Point(13.397, 52.499),  # Kreuzberg (West)
]
EAST_REFS = [
    Point(13.413, 52.521),  # Alexanderplatz (East)
    Point(13.450, 52.515),  # Friedrichshain (East)
]

# Coarse fallback West Berlin polygon — only used if everything else fails.
FALLBACK_WEST = [
    [13.197, 52.534], [13.226, 52.580], [13.270, 52.625], [13.310, 52.620],
    [13.345, 52.585], [13.385, 52.555], [13.395, 52.530], [13.395, 52.510],
    [13.405, 52.475], [13.395, 52.450], [13.355, 52.425], [13.295, 52.420],
    [13.230, 52.430], [13.190, 52.470], [13.180, 52.510], [13.197, 52.534],
]

M_PER_DEG = 111_320.0


def load_geojson(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def write_geojson(path, geom, props=None):
    feature = {
        "type": "Feature",
        "properties": props or {},
        "geometry": mapping(geom),
    }
    fc = {"type": "FeatureCollection", "features": [feature]}
    with open(path, "w", encoding="utf-8") as f:
        json.dump(fc, f, separators=(",", ":"))
    print(f"  wrote {path} ({os.path.getsize(path):,} bytes)")


def fetch_bezirke():
    if not os.path.exists(BEZIRKE_CACHE):
        print(f"  fetching {BEZIRKE_URL}")
        urllib.request.urlretrieve(BEZIRKE_URL, BEZIRKE_CACHE)
    return load_geojson(BEZIRKE_CACHE)


def bez_geom(bezirke_fc, name):
    polys = []
    for feat in bezirke_fc["features"]:
        if feat["properties"].get("spatial_alias") == name:
            g = shape(feat["geometry"])
            if isinstance(g, Polygon):
                polys.append(g)
            elif isinstance(g, MultiPolygon):
                polys.extend(list(g.geoms))
    return unary_union(polys)


def berlin_outline(bezirke_fc):
    polys = []
    for feat in bezirke_fc["features"]:
        g = shape(feat["geometry"])
        if isinstance(g, Polygon):
            polys.append(g)
        elif isinstance(g, MultiPolygon):
            polys.extend(list(g.geoms))
    dissolved = unary_union(polys)
    if isinstance(dissolved, MultiPolygon):
        biggest = max(dissolved.geoms, key=lambda p: p.area)
        return Polygon(biggest.exterior)
    return Polygon(dissolved.exterior)


def split_borough(borough_geom, wall_geom, extra_lines=None):
    boundary = borough_geom.boundary
    inputs = [boundary, wall_geom]
    if extra_lines is not None:
        inputs.append(extra_lines)
    combined = unary_union(inputs)
    polys = list(polygonize(combined))
    inside = [p for p in polys if borough_geom.contains(p.representative_point())]

    out = []
    for p in inside:
        if any(p.contains(q) for q in WEST_REFS):
            out.append((p, "W"))
        elif any(p.contains(q) for q in EAST_REFS):
            out.append((p, "E"))
        else:
            out.append((p, None))
    return out


def derive_west_east(bezirke_fc, wall_geom):
    core_west = unary_union([bez_geom(bezirke_fc, n) for n in WEST_BEZIRKE])
    core_east = unary_union([bez_geom(bezirke_fc, n) for n in EAST_BEZIRKE])

    west_extras = []
    east_extras = []
    for name in SPLIT_BEZIRKE:
        b = bez_geom(bezirke_fc, name)
        extra = LineString(MITTE_WALL_CONNECTOR) if name == "Mitte" else None
        pieces = split_borough(b, wall_geom, extra)
        n_w = sum(1 for _, s in pieces if s == "W")
        n_e = sum(1 for _, s in pieces if s == "E")
        n_u = sum(1 for _, s in pieces if s is None)
        print(f"  split {name}: {n_w} West / {n_e} East / {n_u} unknown sliver(s)")
        for p, side in pieces:
            if side == "W":
                west_extras.append(p)
            elif side == "E":
                east_extras.append(p)

    west = unary_union([core_west] + west_extras)
    east = unary_union([core_east] + east_extras)

    if isinstance(west, MultiPolygon):
        west = max(west.geoms, key=lambda p: p.area)
    if isinstance(east, MultiPolygon):
        east = max(east.geoms, key=lambda p: p.area)

    return west, east


def derive_death_strip(wall_geom, east_polygon):
    buf_deg = 100.0 / M_PER_DEG
    return wall_geom.buffer(buf_deg).intersection(east_polygon)


def main():
    print("Loading wall line…")
    wall_fc = load_geojson(WALL_PATH)
    if wall_fc.get("type") == "FeatureCollection":
        wall_geom = shape(wall_fc["features"][0]["geometry"])
    else:
        wall_geom = shape(wall_fc)

    print("Loading Berlin boroughs…")
    bezirke = fetch_bezirke()
    berlin = berlin_outline(bezirke)

    source = "derived"
    try:
        west, east = derive_west_east(bezirke, wall_geom)
        if west.is_empty or not west.is_valid:
            raise RuntimeError("derived west polygon invalid/empty")
    except Exception as e:
        print(f"  derivation failed ({e}); using fallback polygon")
        west = Polygon(FALLBACK_WEST).intersection(berlin)
        east = berlin.difference(west)
        if isinstance(east, MultiPolygon):
            east = max(east.geoms, key=lambda p: p.area)
        source = "fallback"

    print(f"West Berlin source: {source}")
    print(f"  west bounds: {west.bounds}")
    print(f"  east bounds: {east.bounds}")

    print("Deriving death strip…")
    strip = derive_death_strip(wall_geom, east)
    if strip.is_empty:
        print("  WARNING: death strip empty")

    print("Writing outputs…")
    write_geojson(WEST_OUT, west, {"name": "West Berlin (1989)", "source": source})
    write_geojson(EAST_OUT, east, {"name": "East Berlin (1989)"})
    write_geojson(STRIP_OUT, strip, {"name": "Death Strip / Mauerstreifen"})

    print("Done.")


if __name__ == "__main__":
    sys.exit(main())
