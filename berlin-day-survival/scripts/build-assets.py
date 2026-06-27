#!/usr/bin/env python3

from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import math
import os
import sys

ROOT = Path(__file__).resolve().parents[1]
W, H = 960, 600
SOCIAL_W, SOCIAL_H = 1200, 630

GREEN = "#1B5E20"
DARK = "#073B16"
YELLOW = "#FFE600"
LIME = "#7CB342"
LIGHT = "#C5E1A5"
CREAM = "#FAFAF5"
INK = "#212121"
MUTED = "#526052"
RED = "#E63946"
SKY = "#1D8A99"
WHITE = "#FFFFFF"
BLACK = "#101510"


def ensure(path):
    path.parent.mkdir(parents=True, exist_ok=True)


def save_webp(img, rel):
    path = ROOT / rel
    ensure(path)
    img.convert("RGB").save(path, "WEBP", quality=88, method=6)


def save_jpg(img, rel):
    path = ROOT / rel
    ensure(path)
    img.convert("RGB").save(path, "JPEG", quality=88, optimize=True)


def base(bg=CREAM, grid=True):
    img = Image.new("RGB", (W, H), bg)
    d = ImageDraw.Draw(img)
    if grid:
        for x in range(0, W, 48):
            d.line((x, 0, x, H), fill="#E8F0DC", width=1)
        for y in range(0, H, 48):
            d.line((0, y, W, y), fill="#E8F0DC", width=1)
    d.rectangle((0, 0, W, 10), fill=YELLOW)
    return img


def shadow(draw, xy, radius=18, fill=(7, 59, 22, 48)):
    x0, y0, x1, y1 = xy
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    ld.rounded_rectangle((x0, y0, x1, y1), radius=radius, fill=fill)
    layer = layer.filter(ImageFilter.GaussianBlur(12))
    return layer


def composite_shadow(img, xy, radius=18):
    img.alpha_composite(shadow(None, xy, radius=radius), (0, 0))


def receipt(draw, x, y, w, h, fill=WHITE):
    draw.rounded_rectangle((x, y, x + w, y + h), radius=18, fill=fill, outline="#D7E3CC", width=3)
    for i in range(5):
        yy = y + 58 + i * 38
        x1 = max(x + 50, x + w - 34 - i * 16)
        draw.rounded_rectangle((x + 34, yy, x1, yy + 10), radius=5, fill="#DDE9D0")
    for i in range(7):
        xx = x + 18 + i * 34
        draw.polygon([(xx, y + h), (xx + 17, y + h + 18), (xx + 34, y + h)], fill=fill)


def bottle(draw, x, y, scale=1.0, color=SKY, cap=YELLOW):
    w = int(54 * scale)
    h = int(180 * scale)
    draw.rounded_rectangle((x + w * 0.28, y, x + w * 0.72, y + h * 0.22), radius=int(8 * scale), fill=cap)
    draw.rounded_rectangle((x, y + h * 0.16, x + w, y + h), radius=int(18 * scale), fill=color, outline=DARK, width=max(2, int(3 * scale)))
    draw.rounded_rectangle((x + w * 0.16, y + h * 0.42, x + w * 0.84, y + h * 0.62), radius=int(8 * scale), fill=CREAM)
    draw.ellipse((x + w * 0.18, y + h * 0.2, x + w * 0.36, y + h * 0.34), fill="#FFFFFFAA")


def doner(draw, x, y, scale=1.0):
    pts = [
        (x, y + 150 * scale),
        (x + 120 * scale, y),
        (x + 240 * scale, y + 150 * scale),
    ]
    draw.polygon(pts, fill="#E7B86B", outline=DARK)
    draw.polygon([(x + 36 * scale, y + 126 * scale), (x + 120 * scale, y + 28 * scale), (x + 204 * scale, y + 126 * scale)], fill="#F8D98A")
    for dx, dy, col in [(70, 82, RED), (126, 70, LIME), (158, 100, GREEN), (108, 108, "#A65D2E")]:
        draw.ellipse((x + dx * scale, y + dy * scale, x + (dx + 30) * scale, y + (dy + 24) * scale), fill=col)


def currywurst(draw, x, y, scale=1.0):
    draw.rounded_rectangle((x, y + 78 * scale, x + 250 * scale, y + 162 * scale), radius=int(24 * scale), fill=YELLOW, outline=DARK, width=max(2, int(3 * scale)))
    for i in range(5):
        xx = x + 34 * scale + i * 38 * scale
        draw.rounded_rectangle((xx, y + 44 * scale, xx + 54 * scale, y + 94 * scale), radius=int(17 * scale), fill="#C4743A", outline=DARK, width=max(2, int(2 * scale)))
        draw.ellipse((xx + 14 * scale, y + 58 * scale, xx + 34 * scale, y + 78 * scale), fill=RED)
    draw.line((x + 188 * scale, y + 18 * scale, x + 210 * scale, y + 118 * scale), fill=DARK, width=max(2, int(4 * scale)))


def cup(draw, x, y, scale=1.0, color=WHITE):
    w = 120 * scale
    h = 140 * scale
    draw.rounded_rectangle((x, y, x + w, y + h), radius=int(18 * scale), fill=color, outline=DARK, width=max(2, int(3 * scale)))
    draw.arc((x + w - 18 * scale, y + 42 * scale, x + w + 58 * scale, y + 104 * scale), start=-70, end=80, fill=DARK, width=max(3, int(7 * scale)))
    draw.rounded_rectangle((x + 22 * scale, y + 52 * scale, x + w - 22 * scale, y + 70 * scale), radius=int(8 * scale), fill=YELLOW)


def bench(draw, x, y, scale=1.0):
    for i in range(3):
        draw.rounded_rectangle((x, y + i * 28 * scale, x + 310 * scale, y + 18 * scale + i * 28 * scale), radius=int(8 * scale), fill=GREEN, outline=DARK, width=max(2, int(2 * scale)))
    draw.rectangle((x + 36 * scale, y + 84 * scale, x + 56 * scale, y + 170 * scale), fill=DARK)
    draw.rectangle((x + 250 * scale, y + 84 * scale, x + 270 * scale, y + 170 * scale), fill=DARK)


def tram(draw, y=460):
    draw.rectangle((0, y, W, H), fill="#DDE7DA")
    draw.rounded_rectangle((80, y - 64, 270, y + 38), radius=18, fill=YELLOW, outline=DARK, width=4)
    draw.rectangle((112, y - 42, 238, y + 4), fill="#9FD3DD", outline=DARK, width=2)
    draw.ellipse((116, y + 26, 146, y + 56), fill=DARK)
    draw.ellipse((210, y + 26, 240, y + 56), fill=DARK)


def scene_hero():
    img = base()
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((58, 84, 902, 514), radius=28, fill="#FFFFFF", outline="#D7E3CC", width=4)
    d.rectangle((58, 84, 902, 150), fill=GREEN)
    for x in [146, 300, 454, 608, 762]:
        d.rounded_rectangle((x, 188, x + 74, 430), radius=18, fill="#F2F5EA", outline=DARK, width=3)
    bottle(d, 164, 228, 1.1, color=SKY)
    doner(d, 284, 260, 0.78)
    currywurst(d, 410, 284, 0.64)
    cup(d, 604, 258, 0.85)
    receipt(d, 718, 216, 118, 198, fill="#FFFDF4")
    d.arc((104, 170, 850, 590), 190, 350, fill=YELLOW, width=12)
    return img


def scene_morning():
    img = base("#FFF9E8")
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((92, 120, 868, 466), radius=30, fill=WHITE, outline="#D8E5CA", width=4)
    d.rectangle((92, 120, 868, 196), fill=GREEN)
    for x in range(156, 800, 110):
        d.ellipse((x, 260, x + 82, 318), fill="#DFAF5E", outline=DARK, width=3)
        d.arc((x + 8, 268, x + 74, 316), 190, 350, fill="#F8D98A", width=8)
    cup(d, 642, 266, 0.86)
    d.rectangle((120, 430, 840, 466), fill="#CBA56A")
    return img


def scene_hydration():
    img = base("#F2FBF8")
    d = ImageDraw.Draw(img)
    tram(d, 460)
    d.rounded_rectangle((108, 118, 410, 436), radius=28, fill="#D5EEF2", outline=DARK, width=4)
    d.ellipse((184, 176, 332, 324), fill="#B7DFE7", outline=DARK, width=4)
    d.rectangle((246, 314, 270, 430), fill=DARK)
    bottle(d, 556, 208, 1.35, color=SKY)
    bottle(d, 674, 240, 1.0, color=GREEN, cap=YELLOW)
    return img


def scene_landmark():
    img = base("#F8F4E8")
    d = ImageDraw.Draw(img)
    d.rectangle((0, 410, W, H), fill="#E7E0CE")
    d.polygon([(150, 408), (260, 118), (370, 408)], fill="#D8C6A2", outline=DARK)
    d.rectangle((194, 292, 326, 408), fill="#C8AD7A", outline=DARK)
    receipt(d, 584, 144, 160, 260, fill="#FFFFFF")
    d.rounded_rectangle((112, 458, 848, 512), radius=22, fill=GREEN)
    for x in [160, 270, 380, 490, 600, 710]:
        d.ellipse((x, 438, x + 42, 480), fill=DARK)
    return img


def scene_lunch():
    img = base("#FFF6E1")
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((72, 150, 888, 462), radius=28, fill=WHITE, outline="#D8E5CA", width=4)
    d.rectangle((72, 150, 888, 210), fill=GREEN)
    doner(d, 168, 246, 1.1)
    currywurst(d, 520, 260, 1.0)
    d.rounded_rectangle((382, 300, 456, 444), radius=24, fill=SKY, outline=DARK, width=4)
    d.rounded_rectangle((398, 336, 440, 376), radius=8, fill=CREAM)
    return img


def scene_afternoon():
    img = base("#F1FAEA")
    d = ImageDraw.Draw(img)
    d.ellipse((-100, 330, 1060, 760), fill="#CFE4BA")
    bench(d, 300, 306, 1.1)
    bottle(d, 188, 300, 1.0, color=GREEN)
    d.ellipse((650, 242, 796, 388), fill=YELLOW, outline=DARK, width=4)
    d.line((720, 388, 720, 470), fill=DARK, width=10)
    d.arc((84, 96, 260, 214), 205, 350, fill=GREEN, width=10)
    return img


def scene_night():
    img = base("#14251A", grid=False)
    d = ImageDraw.Draw(img)
    for y in range(0, H, 42):
        d.line((0, y, W, y), fill="#1E3A27", width=1)
    d.rounded_rectangle((128, 102, 832, 498), radius=26, fill="#0B1A10", outline=YELLOW, width=6)
    d.rectangle((128, 102, 832, 178), fill=GREEN)
    for x in [186, 306, 426, 546, 666]:
        d.rounded_rectangle((x, 224, x + 76, 418), radius=18, fill="#D5EEF2", outline=YELLOW, width=3)
        bottle(d, x + 16, 258, 0.72, color=SKY)
    d.ellipse((60, 476, 900, 640), fill="#09130C")
    return img


def result_image(kind):
    img = base("#FFF9E8")
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((80, 94, 880, 506), radius=32, fill=WHITE, outline="#D8E5CA", width=4)
    d.rectangle((80, 94, 880, 166), fill=GREEN)
    if kind == "smart-wanderer":
        d.polygon([(220, 412), (480, 154), (740, 412)], fill="#DDECD1", outline=DARK)
        d.line((276, 358, 684, 258), fill=YELLOW, width=14)
        bottle(d, 440, 240, 1.0, SKY)
    elif kind == "spaeti-strategist":
        scene = scene_night().resize((520, 325))
        img.paste(scene, (220, 176))
    elif kind == "doner-loyalist":
        doner(d, 280, 230, 1.45)
        doner(d, 502, 270, 0.9)
    elif kind == "club-mate-creature":
        for x, scale in [(260, 1.2), (410, 1.45), (610, 1.1)]:
            bottle(d, x, 218, scale, color=GREEN)
        d.arc((200, 178, 764, 474), 200, 340, fill=YELLOW, width=12)
    elif kind == "budget-saint":
        receipt(d, 310, 184, 230, 268, fill="#FFFDF4")
        d.ellipse((586, 296, 700, 410), fill=YELLOW, outline=DARK, width=5)
        d.arc((602, 320, 684, 392), 80, 280, fill=DARK, width=7)
    elif kind == "alexanderplatz-victim":
        receipt(d, 520, 162, 210, 306, fill="#FFFDF4")
        d.polygon([(190, 438), (302, 178), (414, 438)], fill="#D8C6A2", outline=DARK)
        d.line((550, 230, 705, 420), fill=RED, width=13)
    elif kind == "sunday-casualty":
        d.rounded_rectangle((234, 208, 720, 420), radius=26, fill="#DDE9D0", outline=DARK, width=4)
        d.line((280, 244, 674, 384), fill=RED, width=18)
        d.line((674, 244, 280, 384), fill=RED, width=18)
        bottle(d, 420, 236, 1.0, SKY)
    else:
        bench(d, 252, 318, 1.28)
        bottle(d, 198, 272, 1.0, SKY)
        doner(d, 596, 290, 0.84)
        d.ellipse((418, 228, 544, 354), fill=YELLOW, outline=DARK, width=4)
    return img


def social_image():
    img = Image.new("RGB", (SOCIAL_W, SOCIAL_H), CREAM)
    d = ImageDraw.Draw(img)
    for x in range(0, SOCIAL_W, 48):
        d.line((x, 0, x, SOCIAL_H), fill="#E8F0DC", width=1)
    for y in range(0, SOCIAL_H, 48):
        d.line((0, y, SOCIAL_W, y), fill="#E8F0DC", width=1)
    d.rectangle((0, 0, SOCIAL_W, 86), fill=GREEN)
    d.rectangle((0, 86, SOCIAL_W, 102), fill=YELLOW)
    panel = scene_hero().resize((640, 400))
    img.paste(panel, (496, 152))
    receipt(d, 86, 176, 260, 326, fill=WHITE)
    bottle(d, 366, 300, 1.08, color=SKY)
    doner(d, 168, 388, 0.66)
    return img


def contact_sheet(items, rel):
    cols = 4
    thumb_w, thumb_h = 240, 150
    rows = math.ceil(len(items) / cols)
    sheet = Image.new("RGB", (cols * thumb_w, rows * thumb_h), CREAM)
    for idx, item in enumerate(items):
        img = item[1]
        thumb = img.resize((thumb_w, thumb_h))
        x = (idx % cols) * thumb_w
        y = (idx // cols) * thumb_h
        sheet.paste(thumb, (x, y))
    save_jpg(sheet, rel)


def main():
    if os.environ.get("ALLOW_LEGACY_DAY_SURVIVAL_PLACEHOLDERS") != "1":
        print(
            "Refusing to overwrite Berlin Day Survival visuals with the legacy "
            "local placeholder generator. Current visuals must come from Yusuf's "
            "ChatGPT browser workflow unless he explicitly approves an exception.",
            file=sys.stderr,
        )
        return 2

    scene_map = [
        ("hero", scene_hero(), "assets/hero/berlin-day-survival-hero.webp"),
        ("morning-bakery", scene_morning(), "assets/scenes/morning-bakery.webp"),
        ("hydration", scene_hydration(), "assets/scenes/hydration.webp"),
        ("landmark-price-zone", scene_landmark(), "assets/scenes/landmark-price-zone.webp"),
        ("lunch-decision", scene_lunch(), "assets/scenes/lunch-decision.webp"),
        ("afternoon-bench", scene_afternoon(), "assets/scenes/afternoon-bench.webp"),
        ("night-spaeti", scene_night(), "assets/scenes/night-spaeti.webp"),
    ]
    for _, img, rel in scene_map:
        save_webp(img, rel)

    result_ids = [
        "smart-wanderer",
        "spaeti-strategist",
        "doner-loyalist",
        "club-mate-creature",
        "budget-saint",
        "alexanderplatz-victim",
        "sunday-casualty",
        "late-night-survivor",
    ]
    result_map = []
    for result_id in result_ids:
        img = result_image(result_id)
        result_map.append((result_id, img))
        save_webp(img, f"assets/results/{result_id}.webp")

    save_jpg(social_image(), "assets/social/berlin-day-survival-social-1200x630.jpg")
    contact_sheet(scene_map, "assets/source/local-illustration-20260627/scenes-contact-sheet.jpg")
    contact_sheet(result_map, "assets/source/local-illustration-20260627/results-contact-sheet.jpg")

    notes = ROOT / "assets/source/local-illustration-20260627/SOURCE_NOTES.md"
    ensure(notes)
    notes.write_text(
        "# Berlin Day Survival Local Illustration Source\n\n"
        "Generated with `scripts/build-assets.py` using project-local vector-style drawing in Pillow.\n"
        "Direction: textless editorial illustration, BerlinWalk green/yellow/cream palette, snack-counter/day-survival energy, no logos, no watermarks, no stock photos.\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    raise SystemExit(main())
