import { readFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const html = await readFile(join(here, 'index.html'), 'utf8');
const css = await readFile(join(here, 'styles.css'), 'utf8');
const js = await readFile(join(here, 'app.js'), 'utf8');
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function cssBlock(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) return '';
  const openIndex = source.indexOf('{', markerIndex + marker.length);
  if (openIndex === -1) return '';
  let depth = 1;
  for (let index = openIndex + 1; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') depth -= 1;
    if (depth === 0) return source.slice(openIndex + 1, index);
  }
  return '';
}

function hasRule(source, selector, declaration) {
  const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`${escape(selector)}\\s*\\{[^}]*${declaration}`, 's').test(source);
}

const years = ['1894', '1957', '1974', '2024'];
const assets = [
  'assets/1894-hallesches-tor.jpg',
  'assets/1957-destroyed-mehringplatz.jpg',
  'assets/1974-mehringplatz-construction.jpg',
  'assets/2024-mehringplatz.jpg'
];
const compactCss = cssBlock(css, '@media (max-width: 700px)');
const narrowCss = cssBlock(css, '@media (max-width: 300px)');

check((html.match(/role="tab"/g) || []).length === 4, 'Four timeline tabs are required.');
check(html.includes('styles.css?v=20260717b'), 'Compact viewer stylesheet cache-bust is missing.');
check(html.includes('role="tabpanel"'), 'Timeline tabpanel is missing.');
check(html.includes('aria-live="polite"'), 'Selection announcement live region is missing.');
check(html.includes('id="credits-dialog"') && /id="credits-dialog"[^>]*hidden/.test(html), 'Image Credits must be hidden by default.');
check(html.includes('aria-modal="true"'), 'Image Credits dialog must declare modal behaviour.');
check(html.includes('Different viewpoints'), 'Different-viewpoint warning is missing.');
check(html.includes('No reconstruction or same-angle overlay'), 'No-overlay disclosure is missing.');
check(css.includes('[hidden]') && css.includes('display: none !important'), 'Embedded hidden-state protection is missing.');
check(css.includes('@media (prefers-reduced-motion: reduce)'), 'Reduced-motion fallback is missing.');
check(css.includes('--yellow: #ffe600') && css.includes('color: #123d18'), 'Yellow and dark-green contrast tokens are missing.');
check(css.includes('object-fit: contain'), 'Evidence images must not be cropped.');
check(compactCss, 'The compact max-width 700px responsive contract is missing.');
check(!css.includes('@media (max-width: 820px)'), 'The obsolete 820px stacking breakpoint must not return.');
check(
  hasRule(compactCss, '.year-tabs', 'grid-template-columns:\\s*repeat\\(4,\\s*minmax\\(0,\\s*1fr\\)\\)'),
  'Compact timeline must keep all four years in one row.'
);
check(hasRule(compactCss, '.tab-label', 'display:\\s*none'), 'Compact timeline labels must be hidden.');
check(hasRule(compactCss, '.image-stage', 'height:\\s*130px'), 'Compact evidence images must use the 130px height cap.');
check(hasRule(compactCss, '.viewpoint', 'display:\\s*none'), 'Compact duplicate viewpoint paragraphs must be hidden.');
check(
  hasRule(compactCss, '.evidence-panel > div:first-child', 'display:\\s*none'),
  'Compact evidence-panel heading must be hidden.'
);
check(hasRule(compactCss, '.evidence-grid p', 'display:\\s*none'), 'Compact evidence descriptions must be hidden.');
check(
  hasRule(compactCss, '.viewer-footer', 'flex-direction:\\s*row'),
  'Compact footer must stay horizontal above the ultra-narrow fallback.'
);
check(narrowCss, 'The ultra-narrow max-width 300px fallback is missing.');
check(hasRule(narrowCss, '.image-stage', 'height:\\s*110px'), 'Ultra-narrow evidence images must use the 110px height cap.');
check(js.includes("event.key === 'Escape'"), 'Escape-to-close is missing.');
check(js.includes("event.key === 'ArrowRight'"), 'Arrow-key tab navigation is missing.');
check(js.includes("event.key === 'Home'"), 'Home/End tab navigation is missing.');
check(js.includes("window.addEventListener('resize', reportHeight)"), 'Responsive iframe height bridge is missing.');
check(!`${html}${css}${js}`.includes('—'), 'Public component contains an em dash.');

for (const year of years) {
  check(html.includes(`data-year="${year}"`), `Timeline tab ${year} is missing.`);
  check(new RegExp(`\\n  ${year}: \\{`).test(js), `Layer data ${year} is missing.`);
}

for (const asset of assets) {
  try {
    const fileStat = await stat(join(here, asset));
    check(fileStat.size > 10_000, `${asset} is unexpectedly small.`);
  } catch {
    failures.push(`${asset} is missing.`);
  }
}

if (failures.length) {
  console.error(`Viewer validation failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Viewer validation passed: compact responsive contract, four real evidence layers, accessible controls, protected credits and reduced-motion support.');
