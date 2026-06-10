#!/usr/bin/env python3
"""Regenerate the compact JSON-LD structured data block inside
widgets-hub/SEO_ADDITIONAL_TAGS.md from tools-hub/data.json.

Wix Advanced SEO structured data has a ~7000 character limit, so we emit a
minified single-line JSON-LD with a slim CollectionPage + ItemList. Each item
is the minimal valid ListItem (position + name + url).

If the minified payload exceeds the Wix limit, the script progressively compacts
output while keeping the structure valid:
1) remove top-level description
2) remove item names (keep position + url)
3) remove item positions
4) remove item list metadata
5) remove publisher wrapper
6) if still over limit, keep only url + pos pair for each list item as last resort

Usage:  python3 widgets-hub/_regenerate_seo.py
"""
import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(REPO, "tools-hub", "data.json")
TARGET = os.path.join(REPO, "widgets-hub", "SEO_ADDITIONAL_TAGS.md")
WIX_LIMIT = 7000


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


def is_visible_tool(tool):
    status = str(tool.get("status", "")).lower()
    return (
        bool(tool.get("widgetUrl"))
        and tool.get("hidden") is not True
        and tool.get("published") is not False
        and status != "draft"
    )


def regenerate():
    with open(DATA) as f:
        data = json.load(f)
    tools = [t for t in data["tools"] if is_visible_tool(t)]
    schema = build_schema(tools)
    candidates = []

    candidates.append(("full", schema))

    without_description = dict(schema)
    without_description = {**without_description}
    without_description.pop("description", None)
    candidates.append(("without description", without_description))

    no_names = json.loads(json.dumps(without_description))
    for item in no_names["mainEntity"]["itemListElement"]:
        item.pop("name", None)
    candidates.append(("without item names", no_names))

    no_positions = json.loads(json.dumps(no_names))
    for item in no_positions["mainEntity"]["itemListElement"]:
        item.pop("position", None)
    candidates.append(("without item positions", no_positions))

    no_list_meta = json.loads(json.dumps(no_positions))
    no_list_meta["mainEntity"].pop("numberOfItems", None)
    no_list_meta["mainEntity"].pop("itemListOrder", None)
    candidates.append(("without item list metadata", no_list_meta))

    without_publisher = json.loads(json.dumps(no_list_meta))
    without_publisher.pop("publisher", None)
    candidates.append(("without publisher", without_publisher))

    only_url = {
        "@context": no_list_meta["@context"],
        "@type": no_list_meta["@type"],
        "url": no_list_meta["url"],
        "name": no_list_meta["name"],
        "inLanguage": no_list_meta["inLanguage"],
        "mainEntity": {
            "@type": no_list_meta["mainEntity"]["@type"],
            "itemListElement": [
                {
                    "@type": item["@type"],
                    "url": item["url"]
                }
                for item in no_list_meta["mainEntity"]["itemListElement"]
            ]
        }
    }
    candidates.append(("only url + mandatory context", only_url))

    minified = None
    chosen_label = "full"
    for label, candidate in candidates:
        candidate_json = json.dumps(candidate, ensure_ascii=False, separators=(",", ":"))
        if len(candidate_json) <= WIX_LIMIT:
            minified = candidate_json
            chosen_label = label
            break

    if minified is None:
        raise SystemExit("Unable to fit schema under Wix limit even with minimal URL-only ListItem output.")

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
    print(f"  output size: {len(minified)} characters (Wix limit: {WIX_LIMIT})")
    print(f"  chosen variant: {chosen_label}")


if __name__ == "__main__":
    regenerate()
