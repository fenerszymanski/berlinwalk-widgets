#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const API_ROOT = 'https://www.wixapis.com';
const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const EMBED_NAME = 'BerlinTools Live Booking Bridge';
const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));

function parseArgs(argv) {
  return { dryRun: argv.includes('--dry-run'), publish: argv.includes('--publish') };
}

function headers() {
  if (!process.env.WIX_API_KEY) throw new Error('Missing WIX_API_KEY. Run: source ../scripts/load-api-keys.sh');
  return {
    Authorization: process.env.WIX_API_KEY,
    'wix-site-id': SITE_ID,
    'Content-Type': 'application/json',
  };
}

async function wixFetch(pathname, { method = 'GET', body } = {}) {
  const response = await fetch(`${API_ROOT}${pathname}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  let parsed;
  try { parsed = text ? JSON.parse(text) : {}; } catch { parsed = { raw: text }; }
  if (!response.ok) throw new Error(`Wix ${method} ${pathname} failed (${response.status}): ${text.slice(0, 500)}`);
  return parsed;
}

function sourceUrl() {
  const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
  return `https://cdn.jsdelivr.net/gh/fenerszymanski/berlinwalk-widgets@${commit}/js/tool-bridge-live-availability.js`;
}

function buildHtml(url) {
  return [
    '<script id="bw-tool-bridge-live-availability-loader">',
    '(function(){',
    "var p=location.pathname.toLowerCase();if(p.indexOf('/tools/')!==0||p==='/tools/')return;",
    `var s='${url}';`,
    "if(document.querySelector('script[src=\"'+s+'\"]'))return;",
    "var e=document.createElement('script');e.src=s;e.defer=true;document.head.appendChild(e);",
    '})();',
    '</script>',
  ].join('');
}

async function findExisting() {
  const result = await wixFetch('/embeds/v1/custom-embeds?paging.limit=100');
  return (result.customEmbeds || []).find((embed) => embed.name === EMBED_NAME) || null;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const url = sourceUrl();
  const html = buildHtml(url);
  const existing = await findExisting();
  const summary = { ok: true, dryRun: options.dryRun, name: EMBED_NAME, sourceUrl: url, exists: Boolean(existing) };

  if (options.dryRun) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  let result;
  if (existing) {
    const updated = await wixFetch(`/embeds/v1/custom-embeds/${existing.id}`, {
      method: 'PATCH',
      body: {
        customEmbed: {
          id: existing.id,
          revision: existing.revision,
          name: existing.name,
          enabled: true,
          loadOnce: false,
          domain: existing.domain || 'berlinwalk.com',
          position: 'BODY_END',
          embedData: { ...existing.embedData, category: 'ESSENTIAL', html },
        },
      },
    });
    result = updated.customEmbed || updated;
    summary.action = 'updated';
  } else {
    const created = await wixFetch('/embeds/v1/custom-embeds', {
      method: 'POST',
      body: {
        customEmbed: {
          name: EMBED_NAME,
          enabled: true,
          loadOnce: false,
          domain: 'berlinwalk.com',
          position: 'BODY_END',
          embedData: { category: 'ESSENTIAL', html },
        },
      },
    });
    result = created.customEmbed || created;
    summary.action = 'created';
  }

  summary.id = result.id;
  summary.revision = result.revision;
  if (options.publish) {
    await wixFetch('/site-publisher/v1/site/publish', { method: 'POST', body: {} });
    summary.published = true;
  }
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
