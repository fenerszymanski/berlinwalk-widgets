import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export const PILOT = 'whats-open-in-berlin-today';

// Keep the complete pilot record; other records only supply related-card icons.
// Derived on every publication, never hand-maintained independently of data.json.
export function compactCatalog(data) {
  assert.ok(Array.isArray(data.tools), 'tools catalog must be an array');
  assert.equal(data.tools.filter(tool => tool.slug === PILOT).length, 1, 'exactly one pilot record required');
  const slugs = new Set();
  return { tools: data.tools.map(tool => {
    assert.ok(typeof tool.slug === 'string' && !slugs.has(tool.slug), 'unique slug required');
    slugs.add(tool.slug);
    return tool.slug === PILOT ? { ...tool } : { slug: tool.slug, image: tool.image || '' };
  }) };
}

export async function buildCatalog(root = new URL('../', import.meta.url)) {
  const input = JSON.parse(await readFile(new URL('tools-hub/data.json', root), 'utf8'));
  const output = JSON.stringify(compactCatalog(input)) + '\n';
  await writeFile(new URL('tools-hub/open-today.json', root), output);
  return Buffer.byteLength(output);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(`Open Today catalog built: ${await buildCatalog()} bytes`);
}
