import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const BATCH_SLUG = 'sep-dec-events-2026';
export const BATCH_DIR = path.join(ROOT, 'blog-drafts', BATCH_SLUG);
export const METADATA_PATH = path.join(BATCH_DIR, 'batch-post-metadata.json');
export const QUICK_SUMMARY_PATH = path.join(ROOT, 'quick-summary', 'data.json');
export const FAQ_PATH = path.join(ROOT, 'faq', 'data.json');
export const TOOLS_HUB_PATH = path.join(ROOT, 'tools-hub', 'data.json');
export const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
export const MEMBER_ID = '5a08a3af-4b9b-4403-9de7-3e26eba72dc0';
export const TOURIST_TIPS_CATEGORY_ID = '6da64e22-3360-42ec-a558-e906e4deeb19';
export const API_ROOT = 'https://www.wixapis.com';
export const WIDGET_ROOT = 'https://fenerszymanski.github.io/berlinwalk-widgets';

export function assert(condition, message) {
  if (!condition) throw new Error(message);
}

export function parseArgs(argv) {
  const flags = new Set();
  const values = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const equals = token.indexOf('=');
    if (equals > 2) {
      values.set(token.slice(0, equals), token.slice(equals + 1));
      continue;
    }
    const next = argv[index + 1];
    if (next && !next.startsWith('--')) {
      values.set(token, next);
      index += 1;
    } else {
      flags.add(token);
    }
  }
  return {
    has(name) { return flags.has(name) || values.has(name); },
    value(name) { return values.get(name); },
  };
}

export function readJson(filePath, label = filePath) {
  assert(fs.existsSync(filePath), `${label} is missing: ${filePath}`);
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error.message}`);
  }
}

export function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export function resolveInputPath(value, label) {
  assert(value, `${label} is required. See WIX_BATCH_README.md for the input schema.`);
  return path.resolve(process.cwd(), value);
}

export function sha256(value) {
  return crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
}

export function plainMarkdown(value) {
  return String(value || '')
    .replace(/\*\*/g, '')
    .replace(/_/g, '')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function countToken(body, token) {
  return body.split(token).length - 1;
}

export function readBatchMetadata() {
  const metadata = readJson(METADATA_PATH, 'Batch metadata');
  assert(metadata.batch === BATCH_SLUG, `Batch metadata must identify ${BATCH_SLUG}`);
  assert(Array.isArray(metadata.posts) && metadata.posts.length === 11, 'Batch metadata must contain exactly 11 posts');
  const seenPosts = new Set();
  const seenTools = new Set();
  for (const post of metadata.posts) {
    assert(post && typeof post === 'object', 'Every batch post must be an object');
    assert(typeof post.slug === 'string' && post.slug, 'Every batch post needs a slug');
    assert(typeof post.toolSlug === 'string' && post.toolSlug, `${post.slug} needs a toolSlug`);
    assert(typeof post.title === 'string' && post.title, `${post.slug} needs a title`);
    assert(Array.isArray(post.focusKeywords) && post.focusKeywords.length > 0, `${post.slug} needs focusKeywords`);
    assert(Array.isArray(post.tagLabels) && post.tagLabels.length > 0, `${post.slug} needs tagLabels`);
    assert(!seenPosts.has(post.slug), `Duplicate post slug in batch metadata: ${post.slug}`);
    assert(!seenTools.has(post.toolSlug), `Duplicate tool slug in batch metadata: ${post.toolSlug}`);
    seenPosts.add(post.slug);
    seenTools.add(post.toolSlug);
  }
  return metadata;
}

export function bodyPathFor(post) {
  return path.join(ROOT, 'blog-drafts', post.slug, `${post.slug}.body.md`);
}

export function bodyDirectoryFor(post) {
  return path.dirname(bodyPathFor(post));
}

export function readBody(post) {
  const filePath = bodyPathFor(post);
  assert(fs.existsSync(filePath), `Article body is missing for ${post.slug}: ${filePath}`);
  return fs.readFileSync(filePath, 'utf8').trim();
}

export function assertSupportEntries(post) {
  const quick = readJson(QUICK_SUMMARY_PATH, 'Quick Summary data');
  const faq = readJson(FAQ_PATH, 'FAQ data');
  assert(quick[post.slug]?.items?.length >= 4, `${post.slug} needs at least four Quick Summary items`);
  assert(faq[post.slug]?.items?.length === 5, `${post.slug} needs exactly five FAQ items`);
  const quickShard = path.join(ROOT, 'quick-summary', 'data', `${post.slug}.json`);
  const faqShard = path.join(ROOT, 'faq', 'data', `${post.slug}.json`);
  assert(fs.existsSync(quickShard), `${post.slug} Quick Summary shard is missing`);
  assert(fs.existsSync(faqShard), `${post.slug} FAQ shard is missing`);
  return { quick: quick[post.slug], faq: faq[post.slug] };
}

export function assertArticleShell(post, body) {
  const requiredTokens = ['{{quick-summary}}', `{{widget:${post.toolSlug}}}`, '{{faq}}'];
  for (const token of requiredTokens) assert(countToken(body, token) === 1, `${post.slug} must contain ${token} exactly once`);
  assert(!/^#\s+/m.test(body), `${post.slug} contains a forbidden Markdown H1`);
  assert(countToken(body, '{{article-image-credits}}') === 1, `${post.slug} must contain {{article-image-credits}} exactly once`);
}

export function markdownImages(body) {
  return [...body.matchAll(/^!\[(.*?)]\((.*?)\)$/gm)].map((match) => ({ altText: match[1].trim(), relPath: match[2].trim() }));
}

export function resolveArticleAsset(post, relativePath) {
  assert(relativePath && typeof relativePath === 'string', `${post.slug} has an empty article-image path`);
  const directory = bodyDirectoryFor(post);
  const absolute = path.resolve(directory, relativePath);
  assert(absolute === directory || absolute.startsWith(`${directory}${path.sep}`), `${post.slug} image path escapes its draft directory: ${relativePath}`);
  return absolute;
}

export function imageDimensions(filePath) {
  const bytes = fs.readFileSync(filePath);
  if (bytes.length >= 24 && bytes.toString('ascii', 1, 4) === 'PNG') {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  if (bytes.length >= 10 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    for (let offset = 2; offset + 9 < bytes.length;) {
      if (bytes[offset] !== 0xff) break;
      const marker = bytes[offset + 1];
      const length = bytes.readUInt16BE(offset + 2);
      if (length < 2) break;
      if (marker >= 0xc0 && marker <= 0xc3) {
        return { width: bytes.readUInt16BE(offset + 7), height: bytes.readUInt16BE(offset + 5) };
      }
      offset += 2 + length;
    }
  }
  throw new Error(`Unsupported article image format (use PNG or JPEG): ${filePath}`);
}

export function mimeTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  throw new Error(`Unsupported image extension (use .png, .jpg or .jpeg): ${filePath}`);
}

function asPostMap(rawPosts, label) {
  assert(rawPosts && typeof rawPosts === 'object', `${label}.posts must be an object or an array`);
  if (!Array.isArray(rawPosts)) return new Map(Object.entries(rawPosts));
  const map = new Map();
  for (const entry of rawPosts) {
    assert(entry && typeof entry.slug === 'string' && entry.slug, `${label}.posts array entries need a slug`);
    assert(!map.has(entry.slug), `${label} has duplicate post plan: ${entry.slug}`);
    map.set(entry.slug, entry);
  }
  return map;
}

export function loadImageManifest(inputPath) {
  const manifest = readJson(inputPath, 'Image manifest');
  assert(manifest.batch === BATCH_SLUG, `Image manifest must identify ${BATCH_SLUG}`);
  const postPlans = asPostMap(manifest.posts, 'Image manifest');
  const icons = manifest.toolIcons || manifest.icons || {};
  assert(icons && typeof icons === 'object' && !Array.isArray(icons), 'Image manifest toolIcons must be an object when present');
  return { manifest, postPlans, iconPlans: new Map(Object.entries(icons)) };
}

function assertUrl(value, label) {
  assert(typeof value === 'string' && value, `${label} must be a non-empty URL`);
  let parsed;
  try { parsed = new URL(value); } catch { throw new Error(`${label} must be a valid URL`); }
  assert(parsed.protocol === 'https:', `${label} must use https`);
}

function normalizeCredit(post, image, index) {
  const credit = image.credit;
  assert(credit && typeof credit === 'object' && !Array.isArray(credit), `${post.slug} image ${index + 1} marked commons needs a credit object`);
  for (const key of ['label', 'author', 'licenseLabel', 'sourceUrl']) {
    assert(typeof credit[key] === 'string' && credit[key].trim(), `${post.slug} image ${index + 1} credit.${key} is required`);
  }
  const licenseUrl = typeof credit.licenseUrl === 'string' && credit.licenseUrl.trim()
    ? credit.licenseUrl.trim()
    : null;
  if (licenseUrl) assertUrl(licenseUrl, `${post.slug} image ${index + 1} credit.licenseUrl`);
  assertUrl(credit.sourceUrl, `${post.slug} image ${index + 1} credit.sourceUrl`);
  return {
    label: credit.label.trim(),
    author: credit.author.trim(),
    licenseLabel: credit.licenseLabel.trim(),
    licenseUrl,
    sourceUrl: credit.sourceUrl.trim(),
    via: typeof credit.via === 'string' && credit.via.trim() ? credit.via.trim() : 'Wikimedia Commons',
  };
}

function positiveHeight(value, label) {
  const number = Number(value);
  assert(Number.isInteger(number) && number >= 120 && number <= 10000, `${label} must be an integer between 120 and 10000`);
  return String(number);
}

export function validateImagePlan(post, body, plan) {
  assert(plan && typeof plan === 'object' && !Array.isArray(plan), `Image manifest has no plan for ${post.slug}`);
  assert(typeof plan.coverPath === 'string' && plan.coverPath, `${post.slug} image plan needs coverPath`);
  assert(Array.isArray(plan.images) && plan.images.length === 4, `${post.slug} image plan needs exactly four images`);
  assert(typeof plan.embedVersion === 'string' && plan.embedVersion.trim(), `${post.slug} image plan needs an embedVersion`);
  assert(plan.embedHeights && typeof plan.embedHeights === 'object', `${post.slug} image plan needs embedHeights`);
  const embedHeights = {
    quickSummary: positiveHeight(plan.embedHeights.quickSummary, `${post.slug} quickSummary embed height`),
    tool: positiveHeight(plan.embedHeights.tool, `${post.slug} tool embed height`),
    faq: positiveHeight(plan.embedHeights.faq, `${post.slug} FAQ embed height`),
  };

  const bodyImages = markdownImages(body);
  assert(bodyImages.length === 4, `${post.slug} must contain exactly four Markdown article images, found ${bodyImages.length}`);
  assert(bodyImages.every((image) => image.altText), `${post.slug} every article image needs non-empty alt text`);
  const seen = new Set();
  const sourceCredits = [];
  const normalizedImages = plan.images.map((image, index) => {
    assert(image && typeof image === 'object', `${post.slug} image plan ${index + 1} must be an object`);
    assert(typeof image.path === 'string' && image.path, `${post.slug} image plan ${index + 1} needs path`);
    assert(image.sourceType === 'commons' || image.sourceType === 'generated', `${post.slug} image plan ${index + 1} sourceType must be commons or generated`);
    assert(!seen.has(image.path), `${post.slug} repeats image path ${image.path}`);
    seen.add(image.path);
    assert(bodyImages[index].relPath === image.path, `${post.slug} body image ${index + 1} must match image-manifest path ${image.path}`);
    const absolutePath = resolveArticleAsset(post, image.path);
    assert(fs.existsSync(absolutePath), `${post.slug} image file is missing: ${image.path}`);
    const dimensions = imageDimensions(absolutePath);
    assert(dimensions.width > 0 && dimensions.height > 0, `${post.slug} image ${image.path} has invalid dimensions`);
    const credit = image.sourceType === 'commons' ? normalizeCredit(post, image, index) : null;
    if (image.sourceType === 'generated') assert(!image.credit, `${post.slug} generated image ${index + 1} must not enter public Image credits`);
    if (credit) sourceCredits.push(credit);
    return {
      path: image.path,
      sourceType: image.sourceType,
      credit,
      absolutePath,
      dimensions,
      altText: bodyImages[index].altText,
    };
  });
  assert(normalizedImages.some((image) => image.path === plan.coverPath), `${post.slug} coverPath must be one of its four images`);
  assert(sourceCredits.length > 0, `${post.slug} needs at least one Commons image credit; keep generated-visual provenance out of public credits`);
  return {
    embedVersion: plan.embedVersion.trim(),
    embedHeights,
    images: normalizedImages,
    sourceCredits,
    coverPath: plan.coverPath,
  };
}

export function embedsFor(post, imagePlan) {
  const version = encodeURIComponent(imagePlan.embedVersion);
  return {
    '{{quick-summary}}': {
      id: `quick_summary_${post.slug.replace(/-/g, '_')}`,
      url: `${WIDGET_ROOT}/quick-summary/?post=${encodeURIComponent(post.slug)}&v=${version}`,
      height: imagePlan.embedHeights.quickSummary,
    },
    [`{{widget:${post.toolSlug}}}`]: {
      id: `widget_${post.toolSlug.replace(/-/g, '_')}`,
      url: `${WIDGET_ROOT}/${post.toolSlug}/?v=${version}`,
      height: imagePlan.embedHeights.tool,
    },
    '{{faq}}': {
      id: `faq_${post.slug.replace(/-/g, '_')}`,
      url: `${WIDGET_ROOT}/faq/?post=${encodeURIComponent(post.slug)}&v=${version}`,
      height: imagePlan.embedHeights.faq,
    },
  };
}

export function toolsHubRecords() {
  const data = readJson(TOOLS_HUB_PATH, 'tools-hub data');
  const tools = Array.isArray(data) ? data : data.tools;
  assert(Array.isArray(tools), 'tools-hub data must contain a tools array');
  return tools;
}

export function iconPlanFor(imageManifest, toolSlug) {
  const plan = imageManifest.iconPlans.get(toolSlug);
  assert(plan && typeof plan === 'object', `Image manifest has no toolIcons entry for ${toolSlug}`);
  assert(typeof plan.path === 'string' && plan.path, `Tool icon plan ${toolSlug} needs path`);
  const absolutePath = path.resolve(ROOT, plan.path);
  assert(absolutePath.startsWith(`${ROOT}${path.sep}`), `Tool icon ${toolSlug} path escapes the repository`);
  assert(fs.existsSync(absolutePath), `Tool icon ${toolSlug} file is missing: ${plan.path}`);
  assert(path.extname(absolutePath).toLowerCase() === '.png', `Tool icon ${toolSlug} must use the standard PNG format`);
  const dimensions = imageDimensions(absolutePath);
  assert(dimensions.width >= 512 && dimensions.height >= 512, `Tool icon ${toolSlug} must be at least 512px square`);
  const icon160Path = absolutePath.replace(/\.png$/i, '-160.png');
  assert(fs.existsSync(icon160Path), `Tool icon ${toolSlug} 160px derivative is missing: ${path.relative(ROOT, icon160Path)}`);
  const icon160Dimensions = imageDimensions(icon160Path);
  assert(icon160Dimensions.width === 160 && icon160Dimensions.height === 160, `Tool icon ${toolSlug} 160px derivative must be exactly 160x160`);
  const media = plan.wixMedia;
  assert(media && typeof media === 'object', `Tool icon ${toolSlug} needs wixMedia after the scoped media upload`);
  assert(typeof media.id === 'string' && media.id, `Tool icon ${toolSlug} wixMedia.id is required`);
  assert(typeof media.url === 'string' && media.url, `Tool icon ${toolSlug} wixMedia.url is required`);
  assertUrl(media.url, `Tool icon ${toolSlug} wixMedia.url`);
  return { path: plan.path, absolutePath, dimensions, icon160Path, icon160Dimensions, wixMedia: { id: media.id, url: media.url } };
}

export function batchReportPath(runId, filename) {
  assert(typeof runId === 'string' && runId.trim(), '--run-id is required with --apply');
  assert(/^[A-Za-z0-9._-]+$/.test(runId), '--run-id may contain only letters, numbers, dots, underscores and hyphens');
  return path.join(ROOT, 'output', 'qa', BATCH_SLUG, runId, 'wix', filename);
}
