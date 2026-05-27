#!/usr/bin/env python3
"""One-off optimizer for adding a single new photo to gallery without disturbing
the existing 9 photos. Use optimize.py for a full regeneration from source/.
"""
from __future__ import annotations

import sys
from pathlib import Path
from typing import Any

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent
OUT_DIR = ROOT / "images"
WIDTHS = [400, 800, 1200, 1600]
FULL_MAX = 2400
SIZE_LIMITS_KB = {
    "400w": 35,
    "800w": 90,
    "1200w": 150,
    "1600w": 220,
    "full": 340,
}
MIN_QUALITY = 55


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
        if size_kb(path) <= upper or quality <= MIN_QUALITY:
            return quality
        quality -= 5


def main() -> None:
    if len(sys.argv) != 4:
        raise SystemExit("Usage: optimize-single.py <source-path> <photo-id 2 digits> <ratio WxH e.g. 16x9>")
    src_path = Path(sys.argv[1]).expanduser()
    photo_id = sys.argv[2]
    rw_str, rh_str = sys.argv[3].lower().split("x")
    rw, rh = int(rw_str), int(rh_str)

    if not src_path.exists():
        raise SystemExit(f"Source not found: {src_path}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    img = ImageOps.exif_transpose(Image.open(src_path)).convert("RGB")
    cropped = crop_center(img, (rw, rh))

    print(f"Source: {src_path.name} ({img.size[0]}x{img.size[1]}) -> crop {cropped.size[0]}x{cropped.size[1]} at {rw}:{rh}")
    print("file                   size KB  q")
    print("---------------------  -------  --")

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

    for name, kb, q in rows:
        print(f"{name:<21}  {kb:7.1f}  {q}")
    total_kb = sum(kb for _, kb, _ in rows)
    print(f"\nTotal for photo {photo_id}: {total_kb / 1024:.2f} MB")


if __name__ == "__main__":
    main()
