#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  BLOG_CTA_CONTRACT,
  buildTripPlannerDistributionUrl,
  CANONICAL_TRIP_PLANNER_URL
} from "./p0-organic-distribution-contract.mjs";

const API_ROOT = "https://www.wixapis.com";
const SITE_ID = "12ee5ea0-70a7-492f-8020-ffb27cbb630f";
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_OUTPUT = path.join(REPO_ROOT, "evidence", "blog-cta-dry-run");

function sha256(value) {
  return crypto
    .createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value))
    .digest("hex");
}

function parseArgs(argv) {
  const outputArg = argv.find((arg) => arg.startsWith("--output="));
  const fixtureArg = argv.find((arg) => arg.startsWith("--fixture="));
  const unknown = argv.filter(
    (arg) => !arg.startsWith("--output=") && !arg.startsWith("--fixture=") && arg !== "--self-test"
  );
  if (unknown.length) throw new Error(`Unknown argument: ${unknown.join(", ")}`);
  return {
    output: outputArg ? path.resolve(outputArg.slice("--output=".length)) : DEFAULT_OUTPUT,
    fixture: fixtureArg ? path.resolve(fixtureArg.slice("--fixture=".length)) : "",
    selfTest: argv.includes("--self-test")
  };
}

function authHeaders() {
  if (!process.env.WIX_API_KEY) {
    throw new Error("Missing WIX_API_KEY; load it from the workspace Keychain before the read-only dry run.");
  }
  return {
    Authorization: process.env.WIX_API_KEY,
    "wix-site-id": SITE_ID,
    "Content-Type": "application/json"
  };
}

async function wixFetch(pathname, { method = "GET", body } = {}) {
  const response = await fetch(`${API_ROOT}${pathname}`, {
    method,
    headers: authHeaders(),
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const raw = await response.text();
  let payload = {};
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch {
    payload = { raw: raw.slice(0, 500) };
  }
  if (!response.ok) {
    throw new Error(`Wix ${method} ${pathname} failed (${response.status}): ${payload.message || "read failed"}`);
  }
  return payload;
}

async function queryCollection(endpoint, collectionKey) {
  const result = [];
  for (let offset = 0; offset < 500; offset += 100) {
    const payload = await wixFetch(endpoint, {
      method: "POST",
      body: {
        query: {
          paging: { limit: 100, offset }
        },
        fieldsets: ["URL"]
      }
    });
    const rows = Array.isArray(payload[collectionKey]) ? payload[collectionKey] : [];
    result.push(...rows);
    if (rows.length < 100) return result;
  }
  throw new Error(`Wix ${endpoint} pagination exceeded bounded read limit`);
}

function postFrom(payload) {
  return payload?.draftPost || payload?.post || payload;
}

function capturedRevision(draft) {
  if (draft?.revision?.id || draft?.revision) return draft.revision?.id || draft.revision;
  if (draft?.editedDate && draft?.contentId) {
    return "editedDate:" + draft.editedDate + ";contentId:" + draft.contentId;
  }
  return null;
}

function nodeText(node) {
  if (!node || typeof node !== "object") return "";
  const own = node.textData?.text;
  const children = Array.isArray(node.nodes) ? node.nodes.map(nodeText).join(" ") : "";
  return [typeof own === "string" ? own : "", children].filter(Boolean).join(" ");
}

function walkNodes(value, visit) {
  if (Array.isArray(value)) {
    for (const item of value) walkNodes(item, visit);
    return;
  }
  if (!value || typeof value !== "object") return;
  visit(value);
  if (Array.isArray(value.nodes)) walkNodes(value.nodes, visit);
}

function headingOneCount(richContent) {
  let count = 0;
  walkNodes(richContent, (node) => {
    if (node.type === "HEADING" && node.headingData?.level === 1) count += 1;
  });
  return count;
}

function allNodeIds(richContent) {
  const ids = [];
  walkNodes(richContent, (node) => {
    if (typeof node.id === "string" && node.id) ids.push(node.id);
  });
  return ids;
}

function allText(richContent) {
  const values = [];
  walkNodes(richContent, (node) => {
    if (node.type === "TEXT" && typeof node.textData?.text === "string") values.push(node.textData.text);
  });
  return values.join(" ");
}

function linkCount(richContent) {
  let count = 0;
  walkNodes(richContent, (node) => {
    if (!Array.isArray(node.textData?.decorations)) return;
    count += node.textData.decorations.filter((decoration) => decoration.type === "LINK").length;
  });
  return count;
}

function linkTextNode(text, anchor, url, id) {
  const split = text.indexOf(anchor);
  if (split < 0) return { type: "TEXT", id: `${id}_copy`, nodes: [], textData: { text, decorations: [] } };
  const before = text.slice(0, split);
  const after = text.slice(split + anchor.length);
  const nodes = [];
  if (before) nodes.push({ type: "TEXT", id: `${id}_before`, nodes: [], textData: { text: before, decorations: [] } });
  nodes.push({
    type: "TEXT",
    id: `${id}_anchor`,
    nodes: [],
    textData: {
      text: anchor,
      decorations: [{ type: "LINK", linkData: { link: { url, target: "BLANK" } } }]
    }
  });
  if (after) nodes.push({ type: "TEXT", id: `${id}_after`, nodes: [], textData: { text: after, decorations: [] } });
  return nodes;
}

function ctaParagraph(spec) {
  const prefix = `bw_tp_${spec.surface}`;
  return {
    type: "PARAGRAPH",
    id: prefix,
    nodes: [
      {
        type: "TEXT",
        id: `${prefix}_copy`,
        nodes: [],
        textData: { text: `${spec.copy} `, decorations: [] }
      },
      {
        type: "TEXT",
        id: `${prefix}_anchor`,
        nodes: [],
        textData: {
          text: spec.anchor,
          decorations: [{ type: "LINK", linkData: { link: { url: buildTripPlannerDistributionUrl(spec.surface), target: "BLANK" } } }]
        }
      }
    ],
    paragraphData: { textStyle: { textAlignment: "AUTO" }, indentation: 0 }
  };
}

function findInsertionIndex(nodes, spec) {
  const matches = [];
  nodes.forEach((node, index) => {
    const text = [
      nodeText(node),
      node.type || "",
      node.htmlData?.url || ""
    ].join(" ").toLowerCase();
    if (spec.anchorTerms.every((term) => text.includes(term.toLowerCase()))) matches.push(index);
  });
  if (matches.length !== 1) {
    throw new Error(`${spec.slug}:expected_one_semantic_anchor:${matches.length}`);
  }
  return matches[0] + 1;
}

export function planRichContentMutation(post, spec) {
  const draft = postFrom(post);
  if (!draft?.id) throw new Error(`${spec.slug}:missing_draft_id`);
  const revision = capturedRevision(draft);
  if (!revision) {
    throw new Error(`${spec.slug}:missing_expected_revision`);
  }
  const richContent = draft.richContent;
  if (!richContent || !Array.isArray(richContent.nodes)) throw new Error(`${spec.slug}:missing_rich_content`);
  if (headingOneCount(richContent) !== 0) throw new Error(`${spec.slug}:body_h1_present`);
  if (allText(richContent).includes(spec.anchor)) throw new Error(`${spec.slug}:cta_already_present`);
  const index = findInsertionIndex(richContent.nodes, spec);
  const proposed = structuredClone(richContent);
  proposed.nodes.splice(index, 0, ctaParagraph(spec));
  if (headingOneCount(proposed) !== 0) throw new Error(`${spec.slug}:proposed_body_h1_present`);
  const beforeIds = allNodeIds(richContent);
  const afterIds = allNodeIds(proposed);
  if (beforeIds.some((id) => !afterIds.includes(id))) throw new Error(`${spec.slug}:existing_node_lost`);
  return {
    draftId: draft.id,
    slug: spec.slug,
    revision,
    insertionIndex: index,
    before: {
      headingOneCount: headingOneCount(richContent),
      nodeCount: beforeIds.length,
      textCount: allText(richContent).length,
      ctaCount: 0,
      linkCount: linkCount(richContent),
      richContentSha256: sha256(richContent)
    },
    after: {
      headingOneCount: headingOneCount(proposed),
      nodeCount: afterIds.length,
      textCount: allText(proposed).length,
      ctaCount: 1,
      linkCount: linkCount(proposed),
      richContentSha256: sha256(proposed)
    },
    proposedRichContent: proposed,
    rollback: { draftId: draft.id, revision, originalRichContent: richContent },
    existingNodeIdsPreserved: beforeIds.every((id) => afterIds.includes(id)),
    linkUrl: buildTripPlannerDistributionUrl(spec.surface)
  };
}

async function readLiveState() {
  const [drafts, posts] = await Promise.all([
    queryCollection("/blog/v3/draft-posts/query", "draftPosts"),
    queryCollection("/blog/v3/posts/query", "posts")
  ]);
  const bySlug = (rows, slug) => rows.find((row) => row.slug === slug || row.seoSlug === slug) || null;
  const resolved = [];
  for (const spec of BLOG_CTA_CONTRACT) {
    const draftSummary = bySlug(drafts, spec.slug);
    const liveSummary = bySlug(posts, spec.slug);
    if (!draftSummary && !liveSummary) {
      resolved.push({ slug: spec.slug, status: "FAIL", reason: "post_not_found" });
      continue;
    }
    if (!draftSummary) {
      resolved.push({ slug: spec.slug, status: "PARTIAL", reason: "live_post_found_but_no_draft", liveId: liveSummary.id || null });
      continue;
    }
    const detail = postFrom(await wixFetch(`/blog/v3/draft-posts/${encodeURIComponent(draftSummary.id)}?fieldsets=RICH_CONTENT`));
    try {
      resolved.push({ status: "PASS", spec, plan: planRichContentMutation(detail, spec), liveId: liveSummary?.id || null, slug: spec.slug, draft: detail });
    } catch (error) {
      resolved.push({ status: "FAIL", slug: spec.slug, reason: error instanceof Error ? error.message : "planning_failed", draftId: detail?.id || null, revision: capturedRevision(detail), draft: detail });
    }
  }
  return resolved;
}

async function writeEvidence(output, resolved) {
  await fs.mkdir(output, { recursive: true });
  const manifest = [];
  for (const entry of resolved) {
    if (entry.draft) {
      const backupName = `${entry.slug}.draft.rich-content.before.json`;
      await fs.writeFile(path.join(output, backupName), `${JSON.stringify(entry.draft, null, 2)}\n`);
      manifest.push({ slug: entry.slug, draftId: entry.draft.id, backup: backupName, sha256: sha256(entry.draft) });
    }
  }
  const report = {
    mode: "read_only_dry_run",
    writesAttempted: 0,
    publishesAttempted: 0,
    canonicalUrl: CANONICAL_TRIP_PLANNER_URL,
    posts: resolved.map(({ draft, plan, spec, ...safe }) => ({
      ...safe,
      surface: spec?.surface || null,
      anchor: spec?.anchor || null,
      copy: spec?.copy || null,
      linkUrl: plan?.linkUrl || null,
      draftId: plan?.draftId || safe.draftId || null,
      revision: plan?.revision || safe.revision || null,
      before: plan?.before || null,
      after: plan?.after || null,
      insertionIndex: plan?.insertionIndex ?? null
    })),
    backups: manifest,
    rollbackManifest: manifest.map((item) => ({ slug: item.slug, draftId: item.draftId, backup: item.backup }))
  };
  await fs.writeFile(path.join(output, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  return report;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.selfTest) {
    const fixture = {
      id: "draft_fixture",
      revision: "7",
      richContent: { nodes: [{ type: "PARAGRAPH", id: "anchor", nodes: [{ type: "TEXT", id: "t", nodes: [], textData: { text: "24-hour ticket is the best deal for occasional riders", decorations: [] } }] }] }
    };
    const planned = planRichContentMutation(fixture, BLOG_CTA_CONTRACT[0]);
    if (planned.after.ctaCount !== 1 || planned.after.nodeCount <= planned.before.nodeCount) throw new Error("self-test failed");
    console.log("self-test PASS");
    return;
  }
  const resolved = args.fixture
    ? JSON.parse(await fs.readFile(args.fixture, "utf8"))
    : await readLiveState();
  const report = await writeEvidence(args.output, resolved);
  console.log(JSON.stringify({
    mode: report.mode,
    writesAttempted: report.writesAttempted,
    publishesAttempted: report.publishesAttempted,
    posts: report.posts.map((post) => ({ slug: post.slug, status: post.status, reason: post.reason || null, draftId: post.draftId || null, revision: post.revision || null }))
  }, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
