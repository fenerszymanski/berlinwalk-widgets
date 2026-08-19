#!/usr/bin/env python3

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SCREENSHOT_DIR = ROOT / "output/playwright/blog-last20-widget-audit-20260819"


def natural_key(path: Path):
    return int(path.name.split("-", 1)[0])


def build(kind: str):
    paths = sorted(SCREENSHOT_DIR.glob(f"*-{kind}.png"), key=natural_key)
    cell_w, cell_h = (310, 610) if kind == "desktop" else (250, 610)
    columns = 4
    rows = (len(paths) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * cell_w, rows * cell_h), "#eef3e8")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default(size=14)

    for index, image_path in enumerate(paths):
        row, column = divmod(index, columns)
        x, y = column * cell_w, row * cell_h
        label = image_path.stem.replace(f"-{kind}", "")
        with Image.open(image_path).convert("RGB") as source:
            source.thumbnail((cell_w - 20, cell_h - 50), Image.Resampling.LANCZOS)
            image_x = x + (cell_w - source.width) // 2
            image_y = y + 34 + (cell_h - 44 - source.height) // 2
            sheet.paste(source, (image_x, image_y))
        draw.text((x + 10, y + 10), label, fill="#123d18", font=font)
        draw.rectangle((x, y, x + cell_w - 1, y + cell_h - 1), outline="#a8b99e", width=1)

    output = SCREENSHOT_DIR / f"contact-sheet-{kind}.jpg"
    sheet.save(output, quality=90, optimize=True)
    print(output)


if __name__ == "__main__":
    build("desktop")
    build("mobile")
