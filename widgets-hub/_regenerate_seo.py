#!/usr/bin/env python3
"""Regenerate the compact JSON-LD structured data block inside
widgets-hub/SEO_ADDITIONAL_TAGS.md from tools-hub/data.json.

Wix Advanced SEO structured data has a ~7000 character limit, so we emit a
minified single-line JSON-LD with a slim CollectionPage + ItemList. Each item
is the minimal valid ListItem (position + name + url). Run whenever
tools-hub/data.json gains a new widget; the script preserves character count
under ~3500 even with double the current widget count.

Usage:  python3 widgets-hub/_regenerate_seo.py
"""
import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(REPO, "tools-hub", "data.json")
TARGET = os.path.join(REPO, "widgets-hub", "SEO_ADDITIONAL_TAGS.md")


def build_schema(tools):
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "url": "https://www.berlinwalk.com/widgets",
        "name": "Embed Free Berlin Planning Tools",
        "description": "Free embeddable Berlin planning tools for travel sites, hotels, and bloggers: interactive tools built by a local walking-tour guide. Auto-resize, mobile-friendly, attribution-only.",
        "inLanguage": "en",
        "publisher": {
            "@type": "TravelAgency",
            "name": "BerlinWalk",
            "url": "https://www.berlinwalk.com/",
        },
        "mainEntity": {
            "@type": "ItemList",
            "name": "Free Berlin planning tools",
            "numberOfItems": len(tools),
            "itemListOrder": "https://schema.org/ItemListOrderAscending",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": pos,
                    "name": t.get("title", t["slug"]),
                    "url": f"https://www.berlinwalk.com/tools/{t['slug']}",
                }
                for pos, t in enumerate(tools, start=1)
            ],
        },
    }


def regenerate():
    with open(DATA) as f:
        data = json.load(f)
    tools = [t for t in data["tools"] if t.get("widgetUrl")]
    schema = build_schema(tools)

    minified = json.dumps(schema, ensure_ascii=False, separators=(",", ":"))

    with open(TARGET) as f:
        md = f.read()

    block_pattern = re.compile(r"```json\s*\n.*?\n```", re.DOTALL)
    if not block_pattern.search(md):
        sys.exit("Could not find a ```json``` code block in SEO_ADDITIONAL_TAGS.md")

    new_block = "```json\n" + minified + "\n```"
    new_md = block_pattern.sub(new_block, md, count=1)

    with open(TARGET, "w") as f:
        f.write(new_md)

    print(f"Regenerated minified ItemList with {len(tools)} widgets")
    print(f"  output size: {len(minified)} characters (Wix limit: 7000)")


if __name__ == "__main__":
    regenerate()
