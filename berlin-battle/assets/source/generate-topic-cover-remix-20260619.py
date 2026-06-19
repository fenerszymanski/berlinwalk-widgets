#!/usr/bin/env python3
"""Create distinctive Berlin Battle topic covers from existing card art.

This is a local, deterministic remix step. It does not call any image model or
paid API. Source images are the already-approved Berlin Battle item cards.
"""

from __future__ import annotations

import json
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[2]
DATA_PATH = ROOT / "data.json"
SOURCE_DIR = ROOT / "assets" / "source"
W, H = 960, 600

GREEN = (27, 94, 32)
GREEN_DARK = (18, 63, 22)
YELLOW = (255, 230, 0)
LIME = (124, 179, 66)
CREAM = (250, 250, 245)
TEXT = (33, 33, 33)
RED = (230, 57, 70)
BLUE = (62, 138, 168)


def rgba(color: tuple[int, int, int], alpha: int) -> tuple[int, int, int, int]:
    return color[0], color[1], color[2], alpha


def mix(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient(
    top_left: tuple[int, int, int],
    bottom_right: tuple[int, int, int],
    accent: tuple[int, int, int] | None = None,
) -> Image.Image:
    img = Image.new("RGB", (W, H), top_left)
    px = img.load()
    for y in range(H):
        for x in range(W):
            t = (x / W * 0.55) + (y / H * 0.45)
            base = mix(top_left, bottom_right, t)
            if accent:
                dx = (x - W * 0.72) / W
                dy = (y - H * 0.25) / H
                glow = max(0, 1 - math.sqrt(dx * dx + dy * dy) * 3.2)
                base = mix(base, accent, glow * 0.35)
            px[x, y] = base
    noise = Image.effect_noise((W, H), 12).convert("L")
    overlay = Image.new("RGB", (W, H), (128, 128, 128))
    overlay.putalpha(noise.point(lambda v: int(abs(v - 128) * 0.28)))
    return Image.alpha_composite(img.convert("RGBA"), overlay.convert("RGBA"))


def cover_crop(img: Image.Image, width: int, height: int) -> Image.Image:
    img = img.convert("RGB")
    ratio = max(width / img.width, height / img.height)
    size = (int(img.width * ratio + 0.5), int(img.height * ratio + 0.5))
    resized = img.resize(size, Image.Resampling.LANCZOS)
    left = (resized.width - width) // 2
    top = (resized.height - height) // 2
    return resized.crop((left, top, left + width, top + height))


def rounded_mask(width: int, height: int, radius: int) -> Image.Image:
    mask = Image.new("L", (width, height), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, width, height), radius=radius, fill=255)
    return mask


def paste_layer(base: Image.Image, layer: Image.Image, x: int, y: int) -> None:
    base.alpha_composite(layer, (int(x), int(y)))


def add_card(
    base: Image.Image,
    src: Image.Image,
    x: int,
    y: int,
    width: int,
    height: int,
    *,
    angle: float = 0,
    radius: int = 28,
    border: tuple[int, int, int] = CREAM,
    border_width: int = 8,
    shadow_alpha: int = 88,
    saturation: float = 1.05,
    contrast: float = 1.03,
) -> None:
    pad = 42
    layer = Image.new("RGBA", (width + pad * 2, height + pad * 2), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    shadow = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    rect = (pad, pad, pad + width, pad + height)
    shadow_draw.rounded_rectangle(rect, radius=radius, fill=(0, 0, 0, shadow_alpha))
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    layer.alpha_composite(shadow)
    draw.rounded_rectangle(rect, radius=radius, fill=rgba(border, 255))
    inner = (
        pad + border_width,
        pad + border_width,
        pad + width - border_width,
        pad + height - border_width,
    )
    image = cover_crop(src, width - border_width * 2, height - border_width * 2)
    image = ImageEnhance.Color(image).enhance(saturation)
    image = ImageEnhance.Contrast(image).enhance(contrast)
    mask = rounded_mask(image.width, image.height, max(4, radius - border_width))
    layer.paste(image.convert("RGBA"), (inner[0], inner[1]), mask)
    if angle:
        layer = layer.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
    paste_layer(base, layer, x - layer.width // 2, y - layer.height // 2)


def add_circle(
    base: Image.Image,
    src: Image.Image,
    cx: int,
    cy: int,
    radius: int,
    *,
    border: tuple[int, int, int] = CREAM,
    border_width: int = 10,
    shadow_alpha: int = 80,
    saturation: float = 1.08,
) -> None:
    size = radius * 2
    layer = Image.new("RGBA", (size + 72, size + 72), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    shadow = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    outer = (36, 36, 36 + size, 36 + size)
    shadow_draw.ellipse(outer, fill=(0, 0, 0, shadow_alpha))
    shadow = shadow.filter(ImageFilter.GaussianBlur(16))
    layer.alpha_composite(shadow)
    draw.ellipse(outer, fill=rgba(border, 255))
    inner_size = size - border_width * 2
    image = cover_crop(src, inner_size, inner_size)
    image = ImageEnhance.Color(image).enhance(saturation)
    mask = Image.new("L", (inner_size, inner_size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, inner_size, inner_size), fill=255)
    layer.paste(image.convert("RGBA"), (36 + border_width, 36 + border_width), mask)
    paste_layer(base, layer, cx - layer.width // 2, cy - layer.height // 2)


def add_particles(draw: ImageDraw.ImageDraw, rng: random.Random, palette: list[tuple[int, int, int]], count: int) -> None:
    for _ in range(count):
        x = rng.randint(24, W - 24)
        y = rng.randint(24, H - 24)
        r = rng.randint(2, 9)
        color = rng.choice(palette)
        draw.ellipse((x - r, y - r, x + r, y + r), fill=rgba(color, rng.randint(38, 110)))


def add_curve(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: tuple[int, int, int], width: int, alpha: int) -> None:
    draw.line(points, fill=rgba(color, alpha), width=width, joint="curve")


def load_topic_assets(topic: dict) -> list[Image.Image]:
    images = []
    for item in topic.get("items", []):
        path = ROOT / item["image"]
        images.append(Image.open(path).convert("RGB"))
    return images


def recipe_food(images: list[Image.Image], rng: random.Random) -> Image.Image:
    base = gradient((248, 235, 205), (35, 103, 47), (255, 218, 71))
    draw = ImageDraw.Draw(base, "RGBA")
    draw.polygon([(0, 430), (960, 320), (960, 600), (0, 600)], fill=rgba(GREEN_DARK, 80))
    draw.polygon([(62, 0), (386, 0), (214, 600), (0, 600)], fill=rgba(YELLOW, 70))
    for x in range(-80, 1040, 96):
        draw.line((x, 0, x - 220, 600), fill=rgba(CREAM, 36), width=2)
    add_circle(base, images[1], 505, 306, 166, border=CREAM, border_width=12, saturation=1.18)
    add_circle(base, images[0], 266, 245, 112, border=YELLOW, border_width=8, saturation=1.15)
    add_circle(base, images[5], 732, 208, 100, border=(255, 248, 207), border_width=8, saturation=1.08)
    add_card(base, images[15], 710, 448, 220, 154, angle=-8, radius=24, border=GREEN, border_width=7)
    add_card(base, images[12], 228, 430, 236, 160, angle=7, radius=24, border=RED, border_width=7)
    add_particles(draw, rng, [YELLOW, RED, CREAM], 50)
    return base


def recipe_districts(images: list[Image.Image], rng: random.Random) -> Image.Image:
    base = gradient((246, 244, 220), (183, 211, 160), (122, 176, 211))
    draw = ImageDraw.Draw(base, "RGBA")
    draw.line([(0, 408), (170, 365), (326, 398), (514, 324), (694, 360), (960, 285)], fill=rgba(BLUE, 115), width=52, joint="curve")
    draw.line([(0, 408), (170, 365), (326, 398), (514, 324), (694, 360), (960, 285)], fill=rgba((219, 241, 245), 200), width=26, joint="curve")
    blocks = [
        (62, 54, 246, 188, LIME), (306, 38, 484, 194, GREEN), (560, 50, 782, 178, YELLOW),
        (96, 238, 270, 358, YELLOW), (362, 226, 546, 358, LIME), (628, 226, 854, 374, GREEN),
        (236, 422, 438, 542, GREEN), (520, 426, 742, 548, LIME),
    ]
    for x0, y0, x1, y1, color in blocks:
        draw.rounded_rectangle((x0, y0, x1, y1), radius=26, fill=rgba(color, 40), outline=rgba(GREEN_DARK, 55), width=2)
    coords = [(178, 137), (410, 124), (704, 118), (188, 298), (454, 288), (740, 300), (336, 482), (630, 490)]
    picks = [0, 1, 2, 3, 5, 10, 11, 15]
    for i, (cx, cy) in enumerate(coords):
        add_card(base, images[picks[i]], cx, cy, 178, 126, angle=[-8, 4, -4, 6, -2, 5, -5, 3][i], radius=20, border=CREAM, border_width=6, shadow_alpha=58)
        draw.ellipse((cx - 9, cy + 83, cx + 9, cy + 101), fill=rgba(RED if i % 3 == 0 else GREEN, 170))
    add_curve(draw, coords, GREEN_DARK, 7, 90)
    add_particles(draw, rng, [GREEN, LIME, YELLOW], 28)
    return base


def recipe_museums(images: list[Image.Image], rng: random.Random) -> Image.Image:
    base = gradient((246, 244, 232), (178, 168, 135), (255, 248, 196))
    draw = ImageDraw.Draw(base, "RGBA")
    draw.rectangle((0, 430, 960, 600), fill=rgba((83, 74, 54), 88))
    for x in [86, 850]:
        draw.rounded_rectangle((x - 34, 40, x + 34, 520), radius=22, fill=rgba(CREAM, 130))
        draw.rectangle((x - 54, 92, x + 54, 120), fill=rgba((210, 198, 168), 120))
        draw.rectangle((x - 60, 505, x + 60, 545), fill=rgba((210, 198, 168), 130))
    for cx in [236, 480, 724]:
        draw.polygon([(cx - 118, 58), (cx + 118, 58), (cx + 80, 510), (cx - 80, 510)], fill=rgba((255, 250, 224), 52))
    add_card(base, images[1], 270, 222, 236, 174, angle=-2, radius=16, border=(232, 221, 185), border_width=12, shadow_alpha=55)
    add_card(base, images[2], 492, 174, 248, 178, angle=2, radius=16, border=CREAM, border_width=14, shadow_alpha=60)
    add_card(base, images[11], 708, 230, 220, 164, angle=-3, radius=16, border=(232, 221, 185), border_width=12, shadow_alpha=55)
    add_card(base, images[6], 484, 420, 300, 184, angle=0, radius=18, border=GREEN, border_width=9, shadow_alpha=72)
    for x in [238, 490, 728]:
        draw.ellipse((x - 56, 536, x + 56, 554), fill=rgba(GREEN_DARK, 34))
    add_particles(draw, rng, [YELLOW, CREAM], 26)
    return base


def recipe_night(images: list[Image.Image], rng: random.Random) -> Image.Image:
    base = gradient((6, 30, 18), (10, 79, 43), (124, 179, 66))
    draw = ImageDraw.Draw(base, "RGBA")
    for angle in range(-30, 80, 18):
        x0 = 480 + math.cos(math.radians(angle)) * 38
        y0 = 246 + math.sin(math.radians(angle)) * 38
        x1 = 480 + math.cos(math.radians(angle)) * 780
        y1 = 246 + math.sin(math.radians(angle)) * 500
        draw.line((x0, y0, x1, y1), fill=rgba(YELLOW if angle % 36 == 0 else LIME, 46), width=20)
    draw.ellipse((326, 92, 634, 400), outline=rgba(YELLOW, 110), width=14)
    draw.ellipse((382, 148, 578, 344), outline=rgba(CREAM, 55), width=6)
    add_circle(base, images[0], 470, 244, 128, border=YELLOW, border_width=8, saturation=1.16)
    add_card(base, images[7], 218, 392, 232, 170, angle=-12, radius=24, border=(20, 122, 67), border_width=7, shadow_alpha=110, saturation=1.12)
    add_card(base, images[10], 746, 354, 240, 166, angle=11, radius=24, border=CREAM, border_width=7, shadow_alpha=108, saturation=1.12)
    add_card(base, images[13], 730, 160, 190, 136, angle=-7, radius=22, border=LIME, border_width=6, shadow_alpha=100, saturation=1.12)
    add_particles(draw, rng, [YELLOW, LIME, CREAM, RED], 78)
    return base


def recipe_transport(images: list[Image.Image], rng: random.Random) -> Image.Image:
    base = gradient((246, 248, 221), (34, 111, 61), (255, 230, 0))
    draw = ImageDraw.Draw(base, "RGBA")
    routes = [
        ([(0, 112), (220, 150), (384, 92), (610, 128), (960, 78)], YELLOW, 32),
        ([(0, 462), (196, 374), (412, 420), (648, 328), (960, 368)], GREEN, 28),
        ([(128, 0), (210, 182), (166, 358), (284, 600)], BLUE, 20),
        ([(804, 0), (738, 172), (812, 336), (742, 600)], RED, 16),
    ]
    for pts, color, width in routes:
        add_curve(draw, pts, color, width, 150)
        add_curve(draw, pts, CREAM, max(4, width // 4), 135)
        for x, y in pts[1:-1]:
            draw.ellipse((x - 15, y - 15, x + 15, y + 15), fill=rgba(CREAM, 210), outline=rgba(color, 190), width=4)
    add_card(base, images[0], 360, 292, 360, 236, angle=-3, radius=30, border=YELLOW, border_width=10, shadow_alpha=80, saturation=1.08)
    add_card(base, images[2], 700, 214, 250, 170, angle=8, radius=26, border=CREAM, border_width=8, shadow_alpha=70)
    add_card(base, images[8], 664, 452, 236, 158, angle=-7, radius=24, border=GREEN, border_width=8, shadow_alpha=70)
    add_card(base, images[14], 162, 392, 210, 144, angle=8, radius=22, border=(255, 248, 207), border_width=7, shadow_alpha=65)
    add_particles(draw, rng, [YELLOW, GREEN, BLUE], 32)
    return base


def recipe_techno(images: list[Image.Image], rng: random.Random) -> Image.Image:
    base = gradient((4, 16, 12), (33, 54, 38), (255, 230, 0))
    draw = ImageDraw.Draw(base, "RGBA")
    for x in range(42, 920, 58):
        h = rng.randint(90, 320)
        draw.rounded_rectangle((x, 520 - h, x + 22, 520), radius=8, fill=rgba(LIME if x % 3 else YELLOW, rng.randint(42, 105)))
    for cx, cy, r in [(180, 218, 84), (180, 398, 66), (794, 180, 78), (798, 372, 98)]:
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=rgba((3, 8, 6), 150), outline=rgba(YELLOW, 70), width=8)
        draw.ellipse((cx - r // 3, cy - r // 3, cx + r // 3, cy + r // 3), fill=rgba(YELLOW, 30))
    for i, idx in enumerate([0, 3, 7, 10]):
        add_card(base, images[idx], 320 + i * 112, 300 + (-1) ** i * 34, 154, 306, angle=[-8, -2, 4, 9][i], radius=22, border=(15, 124, 70) if i % 2 else YELLOW, border_width=7, shadow_alpha=116, saturation=0.98, contrast=1.1)
    draw.line((0, 548, 960, 548), fill=rgba(YELLOW, 135), width=10)
    add_particles(draw, rng, [YELLOW, LIME, CREAM], 62)
    return base


def recipe_doner(images: list[Image.Image], rng: random.Random) -> Image.Image:
    base = gradient((236, 211, 166), (57, 119, 56), (255, 245, 185))
    draw = ImageDraw.Draw(base, "RGBA")
    for x in range(-80, 1040, 78):
        draw.line((x, 0, x + 240, 600), fill=rgba((101, 72, 34), 34), width=3)
    draw.polygon([(120, 95), (772, 18), (910, 492), (246, 572)], fill=rgba((255, 248, 218), 130))
    draw.polygon([(168, 138), (752, 70), (856, 450), (274, 520)], fill=rgba((213, 177, 112), 80))
    add_card(base, images[0], 480, 300, 394, 292, angle=-4, radius=42, border=CREAM, border_width=11, shadow_alpha=86, saturation=1.13)
    for idx, pos, angle in zip([1, 2, 5, 7], [(222, 194), (724, 174), (244, 442), (742, 434)], [-12, 10, 9, -8]):
        add_card(base, images[idx], pos[0], pos[1], 184, 132, angle=angle, radius=22, border=YELLOW if idx % 2 else GREEN, border_width=7, shadow_alpha=62, saturation=1.08)
    for _ in range(34):
        x, y = rng.randint(110, 850), rng.randint(74, 520)
        color = rng.choice([LIME, RED, CREAM, GREEN])
        draw.ellipse((x - 4, y - 4, x + 4, y + 4), fill=rgba(color, 120))
    return base


def recipe_currywurst(images: list[Image.Image], rng: random.Random) -> Image.Image:
    base = gradient((255, 236, 186), (124, 45, 32), (255, 230, 0))
    draw = ImageDraw.Draw(base, "RGBA")
    tile = 48
    for y in range(0, H, tile):
        for x in range(0, W, tile):
            if (x // tile + y // tile) % 2 == 0:
                draw.rectangle((x, y, x + tile, y + tile), fill=rgba(CREAM, 54))
            else:
                draw.rectangle((x, y, x + tile, y + tile), fill=rgba(RED, 38))
    draw.ellipse((174, 94, 838, 522), fill=rgba((255, 245, 214), 130))
    draw.ellipse((228, 142, 782, 482), outline=rgba(RED, 120), width=22)
    add_card(base, images[1], 372, 296, 320, 230, angle=-8, radius=34, border=YELLOW, border_width=10, shadow_alpha=82, saturation=1.18)
    add_card(base, images[4], 616, 286, 294, 214, angle=8, radius=34, border=CREAM, border_width=10, shadow_alpha=82, saturation=1.15)
    add_card(base, images[6], 230, 156, 190, 134, angle=9, radius=22, border=GREEN, border_width=7, shadow_alpha=64)
    add_card(base, images[7], 756, 448, 190, 134, angle=-9, radius=22, border=GREEN, border_width=7, shadow_alpha=64)
    for _ in range(40):
        x, y = rng.randint(130, 830), rng.randint(70, 530)
        r = rng.randint(3, 12)
        draw.ellipse((x - r, y - r, x + r, y + r), fill=rgba(RED, rng.randint(50, 105)))
    return base


def recipe_parks(images: list[Image.Image], rng: random.Random) -> Image.Image:
    base = gradient((217, 239, 239), (73, 142, 74), (255, 247, 176))
    draw = ImageDraw.Draw(base, "RGBA")
    draw.line([(0, 418), (142, 374), (266, 420), (424, 352), (620, 388), (772, 332), (960, 360)], fill=rgba((83, 168, 198), 165), width=92, joint="curve")
    draw.line([(0, 418), (142, 374), (266, 420), (424, 352), (620, 388), (772, 332), (960, 360)], fill=rgba((226, 249, 249), 115), width=42, joint="curve")
    for x, y, r in [(72, 70, 56), (140, 118, 74), (842, 80, 68), (884, 146, 86), (72, 536, 92)]:
        draw.ellipse((x - r, y - r, x + r, y + r), fill=rgba(GREEN, 56))
    add_card(base, images[0], 246, 202, 256, 178, angle=-9, radius=28, border=CREAM, border_width=8, shadow_alpha=60, saturation=1.12)
    add_card(base, images[7], 506, 184, 286, 196, angle=5, radius=28, border=YELLOW, border_width=8, shadow_alpha=60, saturation=1.1)
    add_card(base, images[10], 724, 310, 246, 172, angle=-7, radius=26, border=CREAM, border_width=8, shadow_alpha=60, saturation=1.12)
    add_card(base, images[15], 386, 426, 280, 188, angle=8, radius=28, border=GREEN, border_width=8, shadow_alpha=62, saturation=1.08)
    add_particles(draw, rng, [CREAM, LIME, YELLOW], 38)
    return base


def recipe_lines(images: list[Image.Image], rng: random.Random) -> Image.Image:
    base = gradient((245, 248, 226), (31, 91, 54), (255, 230, 0))
    draw = ImageDraw.Draw(base, "RGBA")
    colors = [YELLOW, GREEN, BLUE, RED, (247, 138, 40), (136, 64, 150), (30, 130, 96)]
    path_sets = [
        [(0, 98), (190, 142), (370, 120), (574, 172), (960, 126)],
        [(0, 260), (170, 214), (340, 264), (530, 232), (740, 292), (960, 248)],
        [(70, 600), (170, 424), (318, 350), (472, 392), (632, 330), (912, 392)],
        [(800, 0), (722, 128), (782, 260), (704, 412), (750, 600)],
        [(96, 0), (164, 154), (128, 286), (224, 454), (194, 600)],
    ]
    for i, pts in enumerate(path_sets):
        color = colors[i % len(colors)]
        add_curve(draw, pts, color, 26 if i < 3 else 20, 160)
        add_curve(draw, pts, CREAM, 6, 145)
        for x, y in pts[1:-1]:
            draw.ellipse((x - 13, y - 13, x + 13, y + 13), fill=rgba(CREAM, 220), outline=rgba(color, 190), width=4)
    add_card(base, images[0], 286, 184, 240, 166, angle=-6, radius=24, border=YELLOW, border_width=8, shadow_alpha=70)
    add_card(base, images[9], 570, 294, 278, 188, angle=5, radius=26, border=CREAM, border_width=8, shadow_alpha=70)
    add_card(base, images[12], 304, 446, 228, 154, angle=8, radius=24, border=GREEN, border_width=8, shadow_alpha=68)
    add_card(base, images[6], 734, 146, 210, 144, angle=-7, radius=22, border=(255, 248, 207), border_width=7, shadow_alpha=62)
    add_particles(draw, rng, colors[:5], 36)
    return base


RECIPES = {
    "food": recipe_food,
    "districts": recipe_districts,
    "museums": recipe_museums,
    "clubs": recipe_night,
    "transport": recipe_transport,
    "techno-clubs": recipe_techno,
    "doner-shops": recipe_doner,
    "currywurst-shops": recipe_currywurst,
    "parks-lakes": recipe_parks,
    "ubahn-sbahn-lines": recipe_lines,
}


def save_cover(topic: dict) -> Image.Image:
    images = load_topic_assets(topic)
    rng = random.Random("berlin-battle-topic-cover-20260619-" + topic["id"])
    recipe = RECIPES[topic["id"]]
    cover = recipe(images, rng).convert("RGB")
    cover = ImageEnhance.Contrast(cover).enhance(1.02)
    cover = ImageEnhance.Sharpness(cover).enhance(1.04)
    out_path = ROOT / topic["image"]
    out_path.parent.mkdir(parents=True, exist_ok=True)
    cover.save(out_path, "WEBP", quality=91, method=6)
    return cover


def make_contact_sheet(covers: list[tuple[str, Image.Image]]) -> None:
    thumb_w, thumb_h = 288, 180
    gap = 18
    cols = 2
    rows = math.ceil(len(covers) / cols)
    sheet = Image.new("RGB", (cols * thumb_w + (cols + 1) * gap, rows * thumb_h + (rows + 1) * gap), CREAM)
    for idx, (_title, cover) in enumerate(covers):
        x = gap + (idx % cols) * (thumb_w + gap)
        y = gap + (idx // cols) * (thumb_h + gap)
        thumb = cover.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        sheet.paste(thumb, (x, y))
    sheet.save(SOURCE_DIR / "berlin-battle-topic-covers-unique-contact-sheet-20260619.jpg", "JPEG", quality=90)


def main() -> None:
    data = json.loads(DATA_PATH.read_text())
    covers = []
    for topic in data["topics"]:
        if topic["id"] not in RECIPES:
            continue
        cover = save_cover(topic)
        covers.append((topic["title"], cover))
        print(f"wrote {topic['image']}")
    make_contact_sheet(covers)
    print("wrote assets/source/berlin-battle-topic-covers-unique-contact-sheet-20260619.jpg")


if __name__ == "__main__":
    main()
