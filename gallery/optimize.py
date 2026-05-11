#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent
SOURCE_DIR = ROOT / "source"
OUT_DIR = ROOT / "images"
MAPPING_PATH = ROOT / "source-mapping.json"
DATA_PATH = ROOT / "data.json"

AREAS = {
    "a": (1, 1),
    "b": (1, 1),
    "c": (1, 1),
    "d": (1, 1),
    "e": (5, 8),
    "f": (16, 9),
    "g": (16, 9),
    "h": (16, 9),
}
AREA_ORDER = list(AREAS)
WIDTHS = [400, 800, 1200, 1600]
FULL_MAX = 2400
IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"}
SIZE_LIMITS_KB = {
    "400w": 25,
    "800w": 58,
    "1200w": 88,
    "1600w": 128,
    "full": 205,
}


def crop_center(img: Image.Image, ratio: tuple[int, int]) -> Image.Image:
    sw, sh = img.size
    target = ratio[0] / ratio[1]
    src = sw / sh
    if src > target:
        new_w = int(sh * target)
        off = (sw - new_w) // 2
        return img.crop((off, 0, off + new_w, sh))
    new_h = int(sw / target)
    off = (sh - new_h) // 2
    return img.crop((0, off, sw, off + new_h))


def size_kb(path: Path) -> float:
    return path.stat().st_size / 1024


def save_with_budget(img: Image.Image, path: Path, fmt: str, label: str, start_quality: int) -> int:
    quality = start_quality
    upper = SIZE_LIMITS_KB[label]
    while True:
        kwargs: dict[str, Any]
        if fmt == "WEBP":
            kwargs = {"quality": quality, "method": 6}
        else:
            kwargs = {"quality": quality, "optimize": True, "progressive": True}
        img.save(path, fmt, **kwargs)
        if size_kb(path) <= upper or quality <= 20:
            return quality
        quality -= 5


def sizes_for_area(area: str) -> str:
    if area == "a":
        return "(max-width: 520px) 100vw, (max-width: 900px) 50vw, 40vw"
    if area in {"f", "g", "h"}:
        return "(max-width: 520px) 100vw, (max-width: 900px) 100vw, 40vw"
    return "(max-width: 520px) 100vw, (max-width: 900px) 50vw, 20vw"


def print_mapping_prompt(files: list[Path]) -> None:
    print(f"Found {len(files)} source photos:")
    for path in files:
        with Image.open(path) as img:
            w, h = img.size
        orientation = "portrait" if h > w else "landscape" if w > h else "square"
        print(f"  source/{path.name} ({w}x{h}, {orientation})")
    print(
        """
Slots needing assignment:
  a (1:1 square, HERO 2x2 - most striking photo, e.g. group at famous landmark)
  b (1:1 square, small - atmospheric detail)
  c (1:1 square, small - atmospheric detail)
  d (1:1 square, small - atmospheric detail)
  e (5:8 portrait, tall - vertical orientation photo)
  f (16:9 landscape, wide - panoramic shot)
  g (16:9 landscape, wide - panoramic shot)
  h (16:9 landscape, wide - panoramic shot)

Create gallery/source-mapping.json with source filenames as keys and area, alt,
and caption fields. Example:
{
  "IMG_001.jpg": {
    "area": "a",
    "alt": "Walking tour group at Alexanderplatz",
    "caption": "Morning walk starting at Alexanderplatz"
  }
}
"""
    )


def load_mapping(files: list[Path]) -> dict[str, dict[str, str]]:
    if not MAPPING_PATH.exists():
        print_mapping_prompt(files)
        sys.exit(1)
    mapping = json.loads(MAPPING_PATH.read_text())
    source_names = {path.name for path in files}
    mapped_names = set(mapping)
    missing = source_names - mapped_names
    unknown = mapped_names - source_names
    if missing or unknown:
        raise SystemExit(f"Mapping/source mismatch. Missing: {sorted(missing)} Unknown: {sorted(unknown)}")
    areas = [entry.get("area") for entry in mapping.values()]
    if sorted(areas) != AREA_ORDER:
        raise SystemExit(f"Mapping must assign each area exactly once: {', '.join(AREA_ORDER)}")
    for name, entry in mapping.items():
        if not entry.get("alt") or not entry.get("caption"):
            raise SystemExit(f"Missing alt/caption for {name}")
    return mapping


def optimize(src_path: Path, photo_id: str, area: str) -> list[tuple[str, float, int]]:
    img = ImageOps.exif_transpose(Image.open(src_path)).convert("RGB")
    cropped = crop_center(img, AREAS[area])
    rw, rh = AREAS[area]
    rows: list[tuple[str, float, int]] = []

    for width in WIDTHS:
        height = int(width * rh / rw)
        resized = cropped.resize((width, height), Image.Resampling.LANCZOS)
        label = f"{width}w"
        webp = OUT_DIR / f"{photo_id}-{label}.webp"
        jpg = OUT_DIR / f"{photo_id}-{label}.jpg"
        webp_q = save_with_budget(resized, webp, "WEBP", label, 80)
        jpg_q = save_with_budget(resized, jpg, "JPEG", label, 82)
        rows.append((webp.name, size_kb(webp), webp_q))
        rows.append((jpg.name, size_kb(jpg), jpg_q))

    full_w = min(FULL_MAX, cropped.width)
    full_h = int(full_w * rh / rw)
    full = cropped.resize((full_w, full_h), Image.Resampling.LANCZOS)
    webp = OUT_DIR / f"{photo_id}-full.webp"
    jpg = OUT_DIR / f"{photo_id}-full.jpg"
    webp_q = save_with_budget(full, webp, "WEBP", "full", 82)
    jpg_q = save_with_budget(full, jpg, "JPEG", "full", 85)
    rows.append((webp.name, size_kb(webp), webp_q))
    rows.append((jpg.name, size_kb(jpg), jpg_q))
    return rows


def main() -> None:
    files = sorted(
        [path for path in SOURCE_DIR.iterdir() if path.suffix.lower() in IMAGE_SUFFIXES],
        key=lambda path: path.name.lower(),
    )
    if len(files) != 8:
        raise SystemExit(f"Expected 8 source photos in {SOURCE_DIR}, found {len(files)}")

    mapping = load_mapping(files)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for old in OUT_DIR.glob("*"):
        if old.is_file():
            old.unlink()

    photos: list[dict[str, str]] = []
    summary: list[tuple[str, str, str, float, int]] = []
    by_area = sorted(mapping.items(), key=lambda item: AREA_ORDER.index(item[1]["area"]))
    for index, (filename, entry) in enumerate(by_area, 1):
        photo_id = f"{index:02d}"
        area = entry["area"]
        for out_name, kb, quality in optimize(SOURCE_DIR / filename, photo_id, area):
            summary.append((photo_id, area, out_name, kb, quality))
        rw, rh = AREAS[area]
        photos.append(
            {
                "id": photo_id,
                "area": area,
                "alt": entry["alt"],
                "caption": entry["caption"],
                "sizes": sizes_for_area(area),
                "aspectRatio": f"{rw}/{rh}",
            }
        )

    DATA_PATH.write_text(json.dumps({"photos": photos}, indent=2) + "\n")

    print("Optimized gallery images:")
    print("id  area  file                 size KB  q")
    print("--  ----  -------------------  -------  --")
    for photo_id, area, out_name, kb, quality in summary:
        print(f"{photo_id:<2}  {area:<4}  {out_name:<19}  {kb:7.1f}  {quality}")
    total_kb = sum((OUT_DIR / row[2]).stat().st_size for row in summary) / 1024
    print(f"\nTotal gallery/images: {total_kb / 1024:.2f} MB")


if __name__ == "__main__":
    main()
