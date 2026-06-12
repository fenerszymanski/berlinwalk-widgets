#!/usr/bin/env python3
"""Split ChatGPT-generated BerlinWalk tool icon sheets into deployable icons."""

from __future__ import annotations

import json
import math
import shutil
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "tools-hub" / "data.json"
ICONS_DIR = ROOT / "tools-home" / "icons"
SRC_DIR = ICONS_DIR / "_src" / "chatgpt-standard-20260612"
SET_DIR = ICONS_DIR / "chatgpt-standard-2026-06-12"
PNG_512_DIR = SET_DIR / "png-512"
PNG_160_DIR = SET_DIR / "png-160"
MANIFEST_PATH = ICONS_DIR / "manifest.json"

SHEETS = [
    (SRC_DIR / "sheet-01-tools-01-25-chatgpt.png", 0),
    (SRC_DIR / "sheet-02-tools-26-50-chatgpt.png", 25),
]

CATEGORY_DIRS = {
    "Money": "money",
    "Weather": "weather",
    "Maps": "maps",
    "Discovery": "discovery",
}


def category_dir(category: str) -> str:
    return CATEGORY_DIRS.get(category, "other")


def detect_tile_bands(sheet: Image.Image) -> tuple[list[tuple[int, int]], list[tuple[int, int]]]:
    pixels = sheet.convert("RGB").load()
    width, height = sheet.size
    x_counts = [0] * width
    y_counts = [0] * height
    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]
            if g > 85 and r < 80 and b < 115:
                x_counts[x] += 1
                y_counts[y] += 1

    def bands(counts: list[int]) -> list[tuple[int, int]]:
        out = []
        start = None
        for i, count in enumerate(counts):
            if count > 30 and start is None:
                start = i
            elif count <= 30 and start is not None:
                if i - start > 10:
                    out.append((start, i - 1))
                start = None
        if start is not None:
            out.append((start, len(counts) - 1))
        return out

    x_bands = bands(x_counts)
    y_bands = bands(y_counts)
    if len(x_bands) != 5 or len(y_bands) != 5:
        raise ValueError(f"Expected 5x5 tile bands, got {len(x_bands)} x {len(y_bands)}")
    return x_bands, y_bands


def crop_grid_cell(sheet: Image.Image, index: int, x_bands: list[tuple[int, int]], y_bands: list[tuple[int, int]]) -> Image.Image:
    col = index % 5
    row = index // 5
    left, right = x_bands[col]
    upper, lower = y_bands[row]
    pad = 12
    left = max(0, left - pad)
    upper = max(0, upper - pad)
    right = min(sheet.width, right + pad)
    lower = min(sheet.height, lower + pad)
    cell = sheet.crop((left, upper, right, lower))
    side = min(cell.size)
    x = (cell.width - side) // 2
    y = (cell.height - side) // 2
    return cell.crop((x, y, x + side, y + side))


def write_icon(cell: Image.Image, tool: dict, source_sheet: Path, cell_index: int):
    slug = tool["slug"]
    category = tool["category"]
    icon_512 = cell.resize((512, 512), Image.Resampling.LANCZOS).convert("RGBA")
    icon_160 = cell.resize((160, 160), Image.Resampling.LANCZOS).convert("RGBA")

    paths = {
        "canonical512": ICONS_DIR / f"{slug}.png",
        "canonical160": ICONS_DIR / f"{slug}-160.png",
        "set512": PNG_512_DIR / category_dir(category) / f"{slug}.png",
        "set160": PNG_160_DIR / category_dir(category) / f"{slug}-160.png",
    }
    for out in paths.values():
        out.parent.mkdir(parents=True, exist_ok=True)
    icon_512.save(paths["canonical512"], optimize=True)
    icon_160.save(paths["canonical160"], optimize=True)
    icon_512.save(paths["set512"], optimize=True)
    icon_160.save(paths["set160"], optimize=True)

    return {
        "slug": slug,
        "title": tool["title"],
        "category": category,
        "model": "ChatGPT browser image generation",
        "style": "BerlinWalk glossy 3D tool icon set 2026-06-12",
        "sourceSheet": str(source_sheet.resolve()),
        "sourceCell": cell_index + 1,
        "png512": str(paths["canonical512"].resolve()),
        "png160": str(paths["canonical160"].resolve()),
        "githubPagesUrl": f"https://fenerszymanski.github.io/berlinwalk-widgets/tools-home/icons/{slug}-160.png",
        "wixUrl": None,
    }


def make_contact_sheet(tools: list[dict]):
    cols = 5
    card_w = 250
    card_h = 300
    rows = math.ceil(len(tools) / cols)
    sheet = Image.new("RGB", (cols * card_w, rows * card_h), "#FAFAF5")
    draw = ImageDraw.Draw(sheet)
    for i, tool in enumerate(tools):
        x = (i % cols) * card_w
        y = (i // cols) * card_h
        icon = Image.open(ICONS_DIR / f"{tool['slug']}-160.png").convert("RGBA")
        sheet.paste(icon, (x + 45, y + 24), icon)
        draw.text((x + 20, y + 205), tool["slug"][:31], fill="#212121")
        draw.text((x + 20, y + 228), tool["category"], fill="#1B5E20")
    sheet.save(SET_DIR / "contact-sheet.png", optimize=True)


def write_readme(tools: list[dict]):
    lines = [
        "# BerlinWalk Tool Icons - ChatGPT Standard Set 2026-06-12",
        "",
        "Source: generated in the Codex in-app browser through ChatGPT, not through a paid image-generation API.",
        "",
        "Files:",
        "- `png-512/` and `png-160/` are separated by tool category.",
        "- Canonical deploy files are copied to `tools-home/icons/<slug>.png` and `tools-home/icons/<slug>-160.png`.",
        "- Original ChatGPT sheets live in `tools-home/icons/_src/chatgpt-standard-20260612/`.",
        "",
        "Design standard:",
        "- One family only: glossy 3D app-style icon tiles.",
        "- Cream page background, rounded BerlinWalk green tile, centered yellow medallion.",
        "- One clear symbolic object per tool.",
        "- Avoid mixed photos, flat vectors, text-heavy icons, one-off colors, or AI sheets that cannot be cleanly cropped.",
        "",
        f"Tool count: {len(tools)}",
        "",
    ]
    lines.extend(f"- `{tool['slug']}` - {tool['title']} ({tool['category']})" for tool in tools)
    (SET_DIR / "README.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    tools = data["tools"]
    SET_DIR.mkdir(parents=True, exist_ok=True)
    for folder in [PNG_512_DIR, PNG_160_DIR]:
        if folder.exists():
            shutil.rmtree(folder)
        folder.mkdir(parents=True)

    chosen_sheet = SRC_DIR / "sheet-02-option-b-tools-26-50-chatgpt.png"
    stable_sheet = SRC_DIR / "sheet-02-tools-26-50-chatgpt.png"
    if chosen_sheet.exists():
        shutil.copyfile(chosen_sheet, stable_sheet)

    manifest = []
    for sheet_path, start_index in SHEETS:
        if not sheet_path.exists():
            raise FileNotFoundError(f"Missing sheet: {sheet_path}")
        sheet = Image.open(sheet_path).convert("RGB")
        x_bands, y_bands = detect_tile_bands(sheet)
        for local_index in range(25):
            tool = tools[start_index + local_index]
            cell = crop_grid_cell(sheet, local_index, x_bands, y_bands)
            manifest.append(write_icon(cell, tool, sheet_path, local_index))

    (SET_DIR / "live-tools.json").write_text(json.dumps(tools, indent=2) + "\n", encoding="utf-8")
    (SET_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    make_contact_sheet(tools)
    write_readme(tools)
    print(f"Split {len(manifest)} ChatGPT-generated icons")
    print(f"Contact sheet: {SET_DIR / 'contact-sheet.png'}")


if __name__ == "__main__":
    main()
