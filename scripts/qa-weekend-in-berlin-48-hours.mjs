#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bodyPath = path.join(root, 'blog-drafts/weekend-in-berlin-48-hours.body.md');
const widgetPath = path.join(root, 'berlin-weekend-arrival-board/index.html');
const draftScriptPath = path.join(root, 'scripts/create-weekend-in-berlin-48-hours-draft.mjs');
const body = fs.readFileSync(bodyPath, 'utf8');
const widget = fs.readFileSync(widgetPath, 'utf8');
const draftScript = fs.readFileSync(draftScriptPath, 'utf8');
const quick = JSON.parse(fs.readFileSync(path.join(root, 'quick-summary/data.json'), 'utf8'));
const faq = JSON.parse(fs.readFileSync(path.join(root, 'faq/data.json'), 'utf8'));
const slugMap = JSON.parse(fs.readFileSync(path.join(root, 'faq/slug-map.json'), 'utf8'));
const inject = fs.readFileSync(path.join(root, 'faq/inject.js'), 'utf8');
const slug = 'weekend-in-berlin-48-hour-itinerary';

const checks = [];
function check(name, ok, detail = '') {
  checks.push({ name, ok: Boolean(ok), detail });
}

const images = [...body.matchAll(/^!\[([^\]]+)]\(([^)]+)\)$/gm)];
const captions = [...body.matchAll(/^_[^\n]+_$/gm)];
const links = [...body.matchAll(/\[[^\]]+\]\((https?:\/\/[^)]+)\)/g)].map((match) => match[1]);
const internal = links.filter((url) => url.includes('berlinwalk.com'));
const official = links.filter((url) => /bvg\.de|smb\.museum|bundestag\.de|stiftung-berliner-mauer\.de|visitberlin\.de/.test(url));
const placeholders = [...body.matchAll(/^\{\{[^\n]+}}$/gm)].map((match) => match[0]);

check('body H1 count is zero', !/^#\s+/m.test(body));
check('focus keyword appears in H2', /^## .*weekend in Berlin/im.test(body));
check('six inline images', images.length === 6, String(images.length));
check('six caption lines', captions.length === 6, String(captions.length));
check('all image files exist', images.every((match) => fs.existsSync(path.join(root, match[2]))));
check('three required embeds', placeholders.length === 3 && placeholders.includes('{{quick-summary}}') && placeholders.includes('{{widget:berlin-weekend-arrival-board}}') && placeholders.includes('{{faq}}'), placeholders.join(', '));
check('at least three internal links', internal.length >= 3, String(internal.length));
check('at least two official external links', official.length >= 2, String(official.length));
check('public body has no em dash', !/[—–]/.test(body));
check('public body uses no collective business voice', !/\b(we|our|us)\b/i.test(body));
check('Quick Summary key exists', Boolean(quick[slug]));
check('FAQ key has at least six entries', (faq[slug]?.items?.length || 0) >= 6, String(faq[slug]?.items?.length || 0));
check('FAQ slug map exists', slugMap[slug] === slug);
check('FAQ schema generated', inject.includes(`"${slug}": {`) && inject.includes(`"${slug}": "${slug}"`));
check('widget has 4 arrival states', (widget.match(/data-arrival="/g) || []).length === 4);
check('widget has 3 departure states', (widget.match(/data-departure="/g) || []).length === 3);
check('widget includes 12 state combinations', widget.includes('fri18') && widget.includes('fri22') && widget.includes('sat09') && widget.includes('sat14') && widget.includes('sun16') && widget.includes('sun20') && widget.includes('mon10'));
check('widget loads shared brand resize script', widget.includes('<script src="../js/brand.js"></script>'));
check('yellow controls force dark text', widget.includes('background:var(--yellow);color:#123d18') && widget.includes('color:#123d18!important'));
check('draft helper defaults to dry run', draftScript.includes("dryRun: list.includes('--dry-run') || !execute"));
check('draft helper requires explicit unpublished flag', draftScript.includes("--create-unpublished-draft"));
check('draft helper sets publish false', draftScript.includes('publish: false'));
check('draft helper contains no publish true or publish endpoint', !draftScript.includes('publish: true') && !/\/publish(?:['"`/?])/.test(draftScript));

const failed = checks.filter((item) => !item.ok);
for (const item of checks) {
  console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.name}${item.detail ? `: ${item.detail}` : ''}`);
}
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed.`);
if (failed.length) process.exit(1);
