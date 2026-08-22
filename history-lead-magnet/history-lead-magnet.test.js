const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const injectorPath = path.join(root, 'js', 'lead-form-inject.js');
const elementPath = path.join(__dirname, 'history-lead-magnet-element.js');
const injectorSource = fs.readFileSync(injectorPath, 'utf8');
const elementSource = fs.readFileSync(elementPath, 'utf8');

test('global blog surfaces retire the old history lead-magnet injection', () => {
  assert.doesNotMatch(injectorSource, /bw-history-lead-magnet/);
  assert.doesNotMatch(injectorSource, /data-bw-history/);
  assert.doesNotMatch(injectorSource, /CONTENT_UPGRADE_MAGNETS|bw-content-upgrade-card/);
  assert.doesNotMatch(injectorSource, /bw-date-check-teaser/);
  assert.match(injectorSource, /data-bw-blog-booking/);
  assert.match(injectorSource, /data-bw-date-check-card/);
  assert.match(injectorSource, /data-bw-leadform/);
});

test('history element and its approved image manifest remain standalone assets', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'assets-manifest.json'), 'utf8'));
  assert.equal(manifest.status, 'approved-assets');
  assert.deepEqual(Object.keys(manifest.stories).sort(), ['bethlehem', 'engelbecken', 'monbijou']);
  Object.values(manifest.stories).forEach((story) => {
    assert.equal(story.approved, true);
    for (const asset of [story.archive, story.current]) {
      assert.match(asset.src, /^assets\/optimized\/.+\.jpg$/);
      assert.ok(asset.alt);
      assert.ok(asset.creator);
      assert.ok(asset.sourceName);
      assert.match(asset.sourcePage, /^https:\/\//);
      assert.match(asset.licenseUrl, /^https:\/\//);
      assert.ok(asset.changes);
      assert.equal(fs.existsSync(path.join(__dirname, asset.src)), true);
    }
  });
  assert.match(elementSource, /customElements\.define\(TAG/);
  assert.match(elementSource, /data-bw-history-access/);
  assert.match(elementSource, /function analyticsAllowed\(\)/);
  assert.match(elementSource, /credentials: 'include'/);
  assert.match(elementSource, /payload\.access !== true/);
});

test('standalone history consent remains required and unchecked', () => {
  assert.match(elementSource, /name="consent" type="checkbox" required/);
  assert.doesNotMatch(elementSource, /name="consent" type="checkbox" required[^>]*\schecked(?:\s|>)/i);
  assert.match(elementSource, /consentVersion:/);
  assert.match(elementSource, /sourceSlug: sourceSlug\(this\)/);
  assert.match(elementSource, /sourceUrl: sourcePageUrl\(this\)/);
});
