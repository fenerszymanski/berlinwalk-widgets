#!/usr/bin/env node

/*
 * Updates only the dedicated, unpublished History Story Custom Embed.
 * --dry-run makes read-only Wix and jsDelivr requests; --apply never
 * publishes and can PATCH only the known dedicated embed ID.
 *
 * From the BerlinWalk workspace:
 *   source scripts/load-api-keys.sh
 *   BW_BERLIN_HISTORY_STORY_REF=<exact-public-commit> \
 *     node berlinwalk-widgets/scripts/upsert-berlin-history-story-page-wix-embed.mjs --dry-run
 */

const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const API_ROOT = 'https://www.wixapis.com';
const DEDICATED_EMBED_ID = 'c2efe491-bdf5-4deb-8946-54649fd49344';
const EMBED_NAME = 'BerlinWalk Berlin History Story V1 Page';
const EMBED_POSITION = 'BODY_END';
const MAX_EMBED_HTML_LENGTH = 15000;
const PATH = '/berlin-history-story';
const REF = process.env.BW_BERLIN_HISTORY_STORY_REF || '';

function parseArgs(argv) {
  const known = new Set(['--dry-run', '--apply', '--help']);
  const unknown = argv.filter((arg) => !known.has(arg));
  if (unknown.length) throw new Error('Unknown argument(s): ' + unknown.join(', '));
  const apply = argv.includes('--apply');
  if (argv.includes('--dry-run') && apply) throw new Error('Use either --dry-run or --apply, not both.');
  return { apply, help: argv.includes('--help') };
}

function requireRef() {
  if (!/^[0-9a-f]{40}$/i.test(REF)) throw new Error('Set BW_BERLIN_HISTORY_STORY_REF to the exact 40-character public git commit SHA.');
}

function requireWixKey() {
  if (!process.env.WIX_API_KEY) throw new Error('WIX_API_KEY is missing. Load it with the workspace Keychain loader first.');
  return process.env.WIX_API_KEY;
}

async function wixFetch(pathname, options = {}) {
  const response = await fetch(API_ROOT + pathname, {
    method: options.method || 'GET',
    headers: {
      Authorization: requireWixKey(),
      'wix-site-id': SITE_ID,
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await response.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  if (!response.ok) throw new Error('Wix ' + (options.method || 'GET') + ' ' + pathname + ' failed (' + response.status + '): ' + text.slice(0, 300));
  return data;
}

function payload() {
  requireRef();
  const build = 'berlin-history-story-v2-' + REF;
  const cdnBase = 'https://cdn.jsdelivr.net/gh/fenerszymanski/berlinwalk-widgets@' + REF + '/berlin-history-story/';
  return {
    build,
    path: PATH,
    tag: 'bw-berlin-history-story',
    relatedScript: cdnBase + 'related-history-posts.js?v=' + build,
    script: cdnBase + 'history-story-element.js?v=' + build,
    hostId: 'bw-berlin-history-story-page',
  };
}

function buildHtml() {
  const p = payload();
  const js = '(()=>{const P=' + JSON.stringify(p) + ';const clean=s=>(s||"/").replace(/\\/+$/,"" )||"/";if(clean(location.pathname)!==P.path)return;'
    + 'function load(src,key){const attr="data-bw-berlin-history-story-"+key;const existing=document.querySelector("script["+attr+"]");if(existing){if(existing.getAttribute(attr+"-loaded")==="true")return Promise.resolve();return new Promise((resolve,reject)=>{existing.addEventListener("load",resolve,{once:true});existing.addEventListener("error",reject,{once:true})})}return new Promise((resolve,reject)=>{const s=document.createElement("script");s.src=src;s.defer=true;s.setAttribute(attr,"true");s.onload=()=>{s.setAttribute(attr+"-loaded","true");resolve()};s.onerror=()=>{console.warn("Berlin History Story asset failed",src);reject(new Error("Berlin History Story asset failed"))};document.head.appendChild(s)})}'
    + 'function layout(main,host){if(host.parentElement!==main)main.appendChild(host);if(main===document.body)return;host.style.setProperty("grid-row","2 / 3","important");host.style.setProperty("min-width","0","important");host.style.setProperty("width","100%","important");Array.from(main.children).forEach(child=>{if(child!==host)child.style.setProperty("display","none","important")})}'
    + 'function mount(){const main=document.querySelector("main[data-main-content-parent]")||document.querySelector("main")||document.body;let host=document.getElementById(P.hostId);if(!host){host=document.createElement("section");host.id=P.hostId;host.className="bw-berlin-history-story-host";host.setAttribute("aria-label","Berlin History Story");host.setAttribute("data-bw-berlin-history-story",P.build);host.innerHTML="<"+P.tag+"></"+P.tag+">"}layout(main,host);return host}'
    + 'function run(){document.documentElement.classList.add("bw-berlin-history-story-mounted");document.documentElement.setAttribute("data-bw-berlin-history-story",P.build);mount();load(P.relatedScript,"related").then(()=>load(P.script,"runtime")).catch(()=>{})}run();if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run,{once:true});window.addEventListener("load",run,{once:true});[400,1200,2800,5600].forEach(t=>setTimeout(run,t))})();';
  new Function(js);
  const html = '<script id="bw-berlin-history-story-page-js">' + js + '</script>';
  if (html.length > MAX_EMBED_HTML_LENGTH) throw new Error('Embed HTML is ' + html.length + ' chars; Wix limit is ' + MAX_EMBED_HTML_LENGTH + '.');
  return html;
}

function markers(html) {
  const p = payload();
  return {
    exactPathGuard: html.includes('P.path') && html.includes(PATH),
    build: html.includes(p.build),
    tag: html.includes(p.tag),
    relatedScript: html.includes(p.relatedScript),
    runtimeScript: html.includes(p.script),
    keepsNativeShell: !html.includes('#SITE_HEADER') && !html.includes('#SITE_FOOTER') && !html.includes('hideNative'),
    noIframe: !html.includes('<iframe'),
    noPublishCall: !html.includes('/site-publisher/') && !html.includes('publish'),
  };
}

async function verifyPublicAssets(p) {
  const expected = [
    { key: 'relatedScript', url: p.relatedScript, marker: 'BERLIN_HISTORY_STORY_RELATED_POSTS' },
    { key: 'runtimeScript', url: p.script, marker: "var TAG = 'bw-berlin-history-story'" },
  ];
  const results = [];
  for (const item of expected) {
    const response = await fetch(item.url, { redirect: 'follow', cache: 'no-store' });
    const text = await response.text();
    if (!response.ok || !text.includes(item.marker)) {
      throw new Error('The exact public ' + item.key + ' asset is unavailable or does not match the expected package marker. Refusing to install this pin.');
    }
    results.push({ key: item.key, status: response.status, finalUrl: response.url, marker: item.marker });
  }
  return results;
}

async function listAllEmbeds() {
  let cursor = '';
  const all = [];
  const seen = new Set();
  for (;;) {
    const search = new URLSearchParams({ 'paging.limit': '100' });
    if (cursor) search.set('paging.cursor', cursor);
    const data = await wixFetch('/embeds/v1/custom-embeds?' + search);
    all.push(...(data.customEmbeds || []));
    if (!data.pagingMetadata?.hasNext) return all;
    const next = data.pagingMetadata?.cursors?.next;
    if (!next || seen.has(next)) throw new Error('Invalid Wix custom-embed pagination response.');
    seen.add(next);
    cursor = next;
  }
}

async function findCurrent() {
  const all = await listAllEmbeds();
  const namedOther = all.filter((embed) => embed.name === EMBED_NAME && embed.id !== DEDICATED_EMBED_ID);
  if (namedOther.length) throw new Error('A same-named Custom Embed does not have the dedicated History Story ID. Resolve it before writing.');
  const summary = all.find((embed) => embed.id === DEDICATED_EMBED_ID);
  if (!summary) throw new Error('The dedicated History Story Custom Embed ID was not found. Refusing to create a new target.');
  const current = await readBack(DEDICATED_EMBED_ID);
  assertExistingTarget(current);
  return current;
}

async function updateCurrent(current, html) {
  const data = await wixFetch('/embeds/v1/custom-embeds/' + DEDICATED_EMBED_ID, {
    method: 'PATCH',
    body: {
      customEmbed: {
        id: DEDICATED_EMBED_ID,
        revision: current.revision,
        name: EMBED_NAME,
        enabled: true,
        loadOnce: false,
        domain: current.domain || 'berlinwalk.com',
        position: EMBED_POSITION,
        embedData: { ...current.embedData, category: 'ESSENTIAL', html },
      },
    },
  });
  return data.customEmbed || data;
}

async function readBack(id) {
  const data = await wixFetch('/embeds/v1/custom-embeds/' + id);
  return data.customEmbed || data;
}

function assertExistingTarget(embed) {
  const html = embed?.embedData?.html || '';
  if (!embed?.id || embed.id !== DEDICATED_EMBED_ID || embed.name !== EMBED_NAME || embed.position !== EMBED_POSITION) {
    throw new Error('The existing Custom Embed does not match the dedicated History Story identity.');
  }
  if (!html.includes(PATH) || !html.includes('bw-berlin-history-story-page') || html.includes('e75629a8-15bc-40de-b8e7-a9e24a8ffc55')) {
    throw new Error('The dedicated History Story Custom Embed is missing its path/host marker or contains a Wall Timeline identifier.');
  }
  return { id: embed.id, revision: embed.revision, name: embed.name, position: embed.position, enabled: Boolean(embed.enabled) };
}

function assertReadBack(embed, html) {
  const actual = embed?.embedData?.html || '';
  if (!embed?.id || embed.id !== DEDICATED_EMBED_ID || embed.name !== EMBED_NAME || embed.position !== EMBED_POSITION || !embed.enabled) {
    throw new Error('Custom Embed readback did not preserve the expected identity or enabled state.');
  }
  if (actual !== html) throw new Error('Custom Embed readback HTML does not match the exact local payload.');
  const result = markers(actual);
  if (!Object.values(result).every(Boolean)) throw new Error('Custom Embed readback markers failed: ' + JSON.stringify(result));
  return result;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log('Usage: BW_BERLIN_HISTORY_STORY_REF=<exact-commit> node berlinwalk-widgets/scripts/upsert-berlin-history-story-page-wix-embed.mjs [--dry-run|--apply]');
    return;
  }
  const html = buildHtml();
  const p = payload();
  const publicAssets = await verifyPublicAssets(p);
  const current = await findCurrent();
  const target = assertExistingTarget(current);
  if (!args.apply) {
    console.log(JSON.stringify({
      ok: true, dryRun: true, writesWix: false, publishesSite: false,
      name: EMBED_NAME, path: PATH, ref: REF, target, publicAssets,
      htmlLength: html.length, headroom: MAX_EMBED_HTML_LENGTH - html.length, markers: markers(html),
    }, null, 2));
    return;
  }
  const result = await updateCurrent(current, html);
  const readback = await readBack(result.id);
  const readbackMarkers = assertReadBack(readback, html);
  console.log(JSON.stringify({
    ok: true, dryRun: false, writesWix: true, publishesSite: false, mode: 'update',
    id: readback.id, revision: readback.revision, enabled: readback.enabled, position: readback.position,
    name: readback.name, ref: REF, htmlLength: readback.embedData?.html?.length || 0, markers: readbackMarkers,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
