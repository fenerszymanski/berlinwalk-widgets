#!/usr/bin/env python3
"""Small invariant check for the committed runtime map package."""

from __future__ import annotations

import json
import sys
from pathlib import Path


def fail(message: str) -> None:
    raise SystemExit(f"map-data validation failed: {message}")


def main() -> None:
    path = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).parents[1] / "assets/map/map-data.json")
    data = json.loads(path.read_text(encoding="utf-8"))
    if data.get("version") != "berlin-wall-timeline-map-v1":
        fail("unexpected version")
    if len(data.get("sectors", [])) != 4:
        fail("expected four occupation sectors")
    if len(data.get("districts", [])) < 90:
        fail("district layer is incomplete")
    if len(data.get("waterLines", [])) < 1 or len(data.get("waterAreas", [])) < 1:
        fail("water layer is empty")
    if len(data.get("wall", {}).get("main", [])) < 50:
        fail("official main Wall layer is incomplete")
    if len(data.get("wall", {}).get("rear", [])) < 50:
        fail("official rear Wall layer is incomplete")
    names = {point.get("name") for point in data.get("points", [])}
    required = {"Alexanderplatz", "Bernauer Straße", "Bornholmer Straße", "Checkpoint Charlie"}
    missing = sorted(required - names)
    if missing:
        fail("missing story points: " + ", ".join(missing))
    if path.stat().st_size > 400_000:
        fail("runtime package exceeds 400 KB")
    print(json.dumps({
        "ok": True,
        "file": str(path),
        "bytes": path.stat().st_size,
        "sectors": len(data["sectors"]),
        "districts": len(data["districts"]),
        "waterLines": len(data["waterLines"]),
        "wallMain": len(data["wall"]["main"]),
    }, indent=2))


if __name__ == "__main__":
    main()
