#!/usr/bin/env node

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateDailyWidgetArticleLinks } from './validate-daily-widget-article-link.mjs';

function fixture(html) {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'berlinwalk-widget-link-'));
  const toolDir = path.join(rootDir, 'test-tool');
  fs.mkdirSync(toolDir);
  fs.writeFileSync(path.join(toolDir, 'index.html'), html);
  return { rootDir, cleanup() { fs.rmSync(rootDir, { recursive: true, force: true }); } };
}

test('permits a widget with no article link', (t) => {
  const item = fixture('<a href="https://www.smb.museum/en/">Official detail</a>');
  t.after(item.cleanup);
  assert.deepEqual(validateDailyWidgetArticleLinks({ toolSlug: 'test-tool', postSlug: 'test-post', rootDir: item.rootDir }).postLinks, []);
});

test('rejects the embedded post as a widget destination', (t) => {
  const item = fixture('<a href="https://www.berlinwalk.com/post/test-post" target="_blank" rel="noopener">Read guide</a>');
  t.after(item.cleanup);
  assert.throws(() => validateDailyWidgetArticleLinks({ toolSlug: 'test-tool', postSlug: 'test-post', rootDir: item.rootDir }), /links back to its embedded post/);
});

test('requires safe new-tab behavior for any other BerlinWalk post', (t) => {
  const item = fixture('<a href="https://www.berlinwalk.com/post/another-post">Another guide</a>');
  t.after(item.cleanup);
  assert.throws(() => validateDailyWidgetArticleLinks({ toolSlug: 'test-tool', postSlug: 'test-post', rootDir: item.rootDir }), /target="_blank" rel="noopener"/);
});
