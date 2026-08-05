import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  BLOG_CTA_CONTRACT,
  TOOL_CTA_CONTRACT,
  buildTripPlannerDistributionUrl,
  preserveExternalAttribution
} from "../scripts/p0-organic-distribution-contract.mjs";
import { planRichContentMutation } from "../scripts/prepare-trip-planner-blog-ctas.mjs";

const root = new URL("../", import.meta.url);
const source = async (file) => readFile(new URL(file, root), "utf8");

test("tool result CTAs are hidden before results and reveal once after result rendering", async () => {
  for (const spec of TOOL_CTA_CONTRACT) {
    const html = await source(spec.file);
    assert.equal((html.match(/class="(?:bw-)?trip-planner-cta"/g) || []).length, 1, spec.file);
    assert.match(html, /data-bw-trip-planner-cta[^>]*hidden/, spec.file);
    assert.match(html, new RegExp(`data-surface="${spec.surface}"`));
    assert.match(html, new RegExp(spec.copy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(html, new RegExp(spec.anchor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(html, /target="_top"/);
    assert.match(html, /data-trip-planner-link/);
    assert.match(html, /distributionCta\.hidden = (?:false|visible\.length === 0|stack\.children\.length === 0)/);
  }
});

test("tool CTA URLs use canonical LP, non-GA surface attribution and dark text on yellow", async () => {
  for (const spec of TOOL_CTA_CONTRACT) {
    const url = new URL(buildTripPlannerDistributionUrl(spec.surface));
    assert.equal(url.origin, "https://www.berlinwalk.com");
    assert.equal(url.pathname, "/berlin-trip-planner");
    assert.equal(url.searchParams.get("bw_internal_campaign"), "tp_first_sale_aug2026");
    assert.equal(url.searchParams.get("bw_internal_content"), spec.surface);
    assert.equal(url.searchParams.get("utm_source"), null);
    assert.equal(url.searchParams.get("utm_campaign"), null);
    const html = await source(spec.file);
    assert.match(html, /background: *#FFE600/);
    assert.match(html, /color: *#123D18/);
    assert.doesNotMatch(html, /background: *#FFE600;[^}]*color: *(?:#fff|#FFFFFF)/i);
  }
});

test("external UTM and click IDs are preserved alongside internal attribution at click time", () => {
  const internal = buildTripPlannerDistributionUrl("tool_first_day_result_v1");
  const preserved = new URL(preserveExternalAttribution(internal, "utm_source=google&utm_medium=organic&fbclid=click123"));
  assert.equal(preserved.searchParams.get("utm_source"), "google");
  assert.equal(preserved.searchParams.get("utm_medium"), "organic");
  assert.equal(preserved.searchParams.get("utm_campaign"), null);
  assert.equal(preserved.searchParams.get("utm_content"), null);
  assert.equal(preserved.searchParams.get("bw_internal_campaign"), "tp_first_sale_aug2026");
  assert.equal(preserved.searchParams.get("bw_internal_content"), "tool_first_day_result_v1");
  assert.equal(preserved.searchParams.get("fbclid"), "click123");
  const fallback = new URL(preserveExternalAttribution(internal, ""));
  assert.equal(fallback.searchParams.get("bw_internal_campaign"), "tp_first_sale_aug2026");
});

test("blog mutation planner is idempotent, H1-safe and preserves unrelated node IDs", () => {
  const fixture = {
    id: "draft_fixture",
    revision: "9",
    richContent: {
      nodes: [
        { type: "IMAGE", id: "image_1", nodes: [], imageData: {} },
        { type: "PARAGRAPH", id: "ticket_block", nodes: [{ type: "TEXT", id: "text_1", nodes: [], textData: { text: "24-hour ticket is the best deal for occasional riders", decorations: [] } }], paragraphData: {} }
      ]
    }
  };
  const planned = planRichContentMutation(fixture, BLOG_CTA_CONTRACT[0]);
  assert.equal(planned.before.headingOneCount, 0);
  assert.equal(planned.after.headingOneCount, 0);
  assert.equal(planned.before.ctaCount, 0);
  assert.equal(planned.after.ctaCount, 1);
  assert.equal(planned.after.linkCount, planned.before.linkCount + 1);
  assert.equal(planned.existingNodeIdsPreserved, true);
  assert.match(planned.linkUrl, /bw_internal_campaign=tp_first_sale_aug2026/);
  assert.deepEqual(planned.rollback.originalRichContent, fixture.richContent);
  assert.ok(planned.proposedRichContent.nodes.some((node) => node.id === "image_1"));
  assert.throws(() => planRichContentMutation({ ...fixture, richContent: { nodes: [...fixture.richContent.nodes, planned.proposedRichContent.nodes[2]] } }, BLOG_CTA_CONTRACT[0]), /cta_already_present/);
});

test("airport CTA anchors after the complete Quick Comparison list", () => {
  const fixture = {
    id: "airport_draft_fixture",
    revision: "9",
    richContent: {
      nodes: [
        { type: "HEADING", id: "comparison_heading", nodes: [{ type: "TEXT", id: "heading_text", nodes: [], textData: { text: "Quick Comparison", decorations: [] } }], headingData: { level: 2 } },
        { type: "BULLETED_LIST", id: "comparison_list", nodes: [
          { type: "LIST_ITEM", id: "fex", nodes: [{ type: "TEXT", id: "fex_text", nodes: [], textData: { text: "FEX + transfer", decorations: [] } }] },
          { type: "LIST_ITEM", id: "s9", nodes: [{ type: "TEXT", id: "s9_text", nodes: [], textData: { text: "S9 direct", decorations: [] } }] },
          { type: "LIST_ITEM", id: "taxi", nodes: [{ type: "TEXT", id: "taxi_text", nodes: [], textData: { text: "Taxi:", decorations: [] } }] }
        ], bulletedListData: { indentation: 0 } },
        { type: "HEADING", id: "ticket_heading", nodes: [{ type: "TEXT", id: "ticket_text", nodes: [], textData: { text: "How to Buy Your Ticket", decorations: [] } }], headingData: { level: 2 } }
      ]
    }
  };
  const planned = planRichContentMutation(fixture, BLOG_CTA_CONTRACT[1]);
  assert.equal(planned.insertionIndex, 2);
  assert.equal(planned.proposedRichContent.nodes[2].id, "bw_tp_post_ber_airport_alex_v1");
  assert.equal(planned.proposedRichContent.nodes[3].id, "ticket_heading");
});
