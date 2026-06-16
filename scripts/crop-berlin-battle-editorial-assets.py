#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
BATTLE = ROOT / "berlin-battle"
SOURCE = BATTLE / "assets" / "source" / "editorial-20260616"
SHEETS = SOURCE / "sheets"
CONTACTS = SOURCE / "contact-sheets"
CARDS = BATTLE / "assets" / "cards"
TOPICS = BATTLE / "assets" / "topics"

CARD_SIZE = 640
COVER_SIZE = (960, 600)


BATCHES = {
    "districts": [
        ("districts-batch-1.png", ["mitte", "kreuzberg", "friedrichshain", "neukolln"]),
        ("districts-batch-2.png", ["prenzlauer-berg", "charlottenburg", "schoneberg", "wedding"]),
        ("districts-batch-3.png", ["moabit", "tiergarten", "tempelhof", "kopenick"]),
        ("districts-batch-4.png", ["spandau", "pankow", "lichtenberg", "treptow"]),
    ],
    "museums": [
        ("museums-batch-1.png", ["neues-museum", "altes-museum", "alte-nationalgalerie", "bode-museum"]),
        ("museums-batch-2.png", ["humboldt-forum", "jewish-museum-berlin", "berlinische-galerie", "hamburger-bahnhof"]),
        ("museums-batch-3.png", ["gemaldegalerie", "ddr-museum", "topography-of-terror", "museum-fur-naturkunde"]),
        ("museums-batch-4.png", ["deutsches-technikmuseum", "futurium", "urban-nation", "museum-for-communication"]),
    ],
    "clubs": [
        ("clubs-batch-1.png", ["techno-warehouse", "riverside-club", "queer-dancefloor", "punk-show"]),
        ("clubs-batch-2.png", ["jazz-cellar", "open-air-rave", "karaoke-bar", "kneipe-crawl"]),
        ("clubs-batch-3.png", ["spati-corner", "cocktail-bar", "rooftop-sunset", "comedy-night"]),
        ("clubs-batch-4.png", ["late-doner-stop", "night-bus-ride", "gallery-opening", "afterhours-breakfast"]),
    ],
}


COVER_CARDS = {
    "districts": {
        "file": "district-battle-cover.webp",
        "cards": ["mitte", "kreuzberg", "tempelhof", "kopenick"],
    },
    "museums": {
        "file": "museum-battle-cover.webp",
        "cards": ["neues-museum", "altes-museum", "museum-fur-naturkunde", "urban-nation"],
    },
    "clubs": {
        "file": "night-battle-cover.webp",
        "cards": ["techno-warehouse", "spati-corner", "night-bus-ride", "afterhours-breakfast"],
    },
}


def font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    path = "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf"
    return ImageFont.truetype(path, size)


def out_path(topic: str, slug: str) -> Path:
    if topic == "districts":
        return CARDS / "districts" / f"{slug}.webp"
    if topic == "museums":
        return CARDS / "museums" / f"{slug}.webp"
    if topic == "clubs":
        return CARDS / "night" / f"{slug}.webp"
    raise ValueError(topic)


def split_sheet(sheet_path: Path, names: list[str], topic: str) -> list[Path]:
    im = Image.open(sheet_path).convert("RGB")
    width, height = im.size
    half_w, half_h = width // 2, height // 2
    boxes = [
        (0, 0, half_w, half_h),
        (half_w, 0, width, half_h),
        (0, half_h, half_w, height),
        (half_w, half_h, width, height),
    ]
    written = []
    for name, box in zip(names, boxes):
        crop = im.crop(box).resize((CARD_SIZE, CARD_SIZE), Image.Resampling.LANCZOS)
        target = out_path(topic, name)
        target.parent.mkdir(parents=True, exist_ok=True)
        crop.save(target, "WEBP", quality=88, method=6)
        written.append(target)
    return written


def make_topic_contact(topic: str, paths: list[Path]) -> None:
    thumb = 160
    cols = 4
    rows = (len(paths) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * thumb, rows * thumb), "#FAFAF5")
    for i, path in enumerate(paths):
        img = Image.open(path).convert("RGB").resize((thumb, thumb), Image.Resampling.LANCZOS)
        sheet.paste(img, ((i % cols) * thumb, (i // cols) * thumb))
    CONTACTS.mkdir(parents=True, exist_ok=True)
    sheet.save(CONTACTS / f"{topic}-cards-contact-sheet.jpg", quality=92)


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    return mask


def cover_bg(card_paths: list[Path]) -> Image.Image:
    base = Image.new("RGB", COVER_SIZE, "#1B5E20")
    for i, path in enumerate(card_paths):
        img = Image.open(path).convert("RGB").resize((480, 480), Image.Resampling.LANCZOS)
        x = (i % 2) * 480
        y = (i // 2) * 240 - 120
        base.paste(img, (x, y))
    base = base.filter(ImageFilter.GaussianBlur(18))
    tint = Image.new("RGBA", COVER_SIZE, (27, 94, 32, 118))
    base = base.convert("RGBA")
    base.alpha_composite(tint)
    return base.convert("RGB")


def make_cover(topic: str, spec: dict[str, object]) -> Path:
    card_paths = [out_path(topic, slug) for slug in spec["cards"]]  # type: ignore[index]
    canvas = cover_bg(card_paths).convert("RGBA")
    draw = ImageDraw.Draw(canvas)

    positions = [(74, 88, -7), (326, 60, 6), (570, 104, -5), (248, 262, 4)]
    card_w, card_h = 250, 250
    for path, (x, y, angle) in zip(card_paths, positions):
        img = Image.open(path).convert("RGBA").resize((card_w, card_h), Image.Resampling.LANCZOS)
        mask = rounded_mask((card_w, card_h), 34)
        framed = Image.new("RGBA", (card_w + 18, card_h + 18), (0, 0, 0, 0))
        shadow = Image.new("RGBA", framed.size, (0, 0, 0, 0))
        sd = ImageDraw.Draw(shadow)
        sd.rounded_rectangle((12, 12, card_w + 12, card_h + 12), radius=38, fill=(0, 0, 0, 110))
        shadow = shadow.filter(ImageFilter.GaussianBlur(8))
        framed.alpha_composite(shadow)
        framed.paste(img, (8, 8), mask)
        fd = ImageDraw.Draw(framed)
        fd.rounded_rectangle((8, 8, card_w + 8, card_h + 8), radius=34, outline="#FFE600", width=5)
        framed = framed.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
        canvas.alpha_composite(framed, (x, y))

    TOPICS.mkdir(parents=True, exist_ok=True)
    target = TOPICS / str(spec["file"])
    canvas.convert("RGB").save(target, "WEBP", quality=88, method=6)
    return target


def main() -> None:
    all_written: dict[str, list[Path]] = {}
    for topic, batches in BATCHES.items():
        written: list[Path] = []
        for sheet_name, names in batches:
            sheet_path = SHEETS / sheet_name
            if not sheet_path.exists():
                raise FileNotFoundError(sheet_path)
            written.extend(split_sheet(sheet_path, names, topic))
        make_topic_contact(topic, written)
        all_written[topic] = written

    cover_paths = []
    for topic, spec in COVER_CARDS.items():
        cover_paths.append(make_cover(topic, spec))

    cover_contact = Image.new("RGB", (3 * 320, 200), "#FAFAF5")
    for i, path in enumerate(cover_paths):
        img = Image.open(path).convert("RGB").resize((320, 200), Image.Resampling.LANCZOS)
        cover_contact.paste(img, (i * 320, 0))
    cover_contact.save(CONTACTS / "topic-covers-contact-sheet.jpg", quality=92)

    total = sum(len(paths) for paths in all_written.values())
    print(f"Wrote {total} cards and {len(cover_paths)} covers")


if __name__ == "__main__":
    main()
