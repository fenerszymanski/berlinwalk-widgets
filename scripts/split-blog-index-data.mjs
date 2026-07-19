#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const sourcePath = path.join(repoRoot, 'blog-index', 'data.json');
const indexPath = path.join(repoRoot, 'blog-index', 'index.json');
const archivePath = path.join(repoRoot, 'blog-index', 'archive.json');

const data = JSON.parse(await fs.readFile(sourcePath, 'utf8'));
if (!Array.isArray(data.allPosts)) throw new Error('blog-index/data.json is missing allPosts.');

const { allPosts, ...indexData } = data;
const archiveData = {
  updatedAt: data.updatedAt,
  source: data.source,
  totalPosts: data.totalPosts,
  bookingUrl: data.bookingUrl,
  allPosts,
};

await Promise.all([
  fs.writeFile(indexPath, `${JSON.stringify(indexData, null, 2)}\n`, 'utf8'),
  fs.writeFile(archivePath, `${JSON.stringify(archiveData, null, 2)}\n`, 'utf8'),
]);

console.log(`Wrote ${path.relative(repoRoot, indexPath)} without allPosts.`);
console.log(`Wrote ${path.relative(repoRoot, archivePath)} with ${allPosts.length} posts.`);
