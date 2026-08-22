const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const injectorSource = fs.readFileSync(path.join(root, 'js', 'lead-form-inject.js'), 'utf8');
const elementSource = fs.readFileSync(path.join(__dirname, 'content-upgrade-card-element.js'), 'utf8');

test('global injector does not restore the old content-upgrade or teaser surfaces', () => {
  assert.doesNotMatch(injectorSource, /bw-content-upgrade-card/);
  assert.doesNotMatch(injectorSource, /data-bw-content-upgrade/);
  assert.doesNotMatch(injectorSource, /CONTENT_UPGRADE_MAGNETS/);
  assert.doesNotMatch(injectorSource, /bw-date-check-teaser/);
  assert.doesNotMatch(injectorSource, /private-tour|trip-planner|first-day-rescue/i);
  assert.match(injectorSource, /data-bw-date-check-card/);
  assert.match(injectorSource, /data-bw-blog-booking/);
});

test('content-upgrade custom element remains available only as a standalone component', () => {
  assert.match(elementSource, /customElements\.define\(TAG/);
  assert.match(elementSource, /data-bw-content-upgrade-ready/);
  assert.match(elementSource, /role="region" aria-labelledby="bw-content-upgrade-title"/);
  assert.match(elementSource, /inputmode="email" autocomplete="email"/);
  assert.match(elementSource, /name="email" type="email"/);
  assert.match(elementSource, /By requesting this list/);
  assert.match(elementSource, /Privacy Policy/);
  assert.doesNotMatch(elementSource, /overflow(?:-y)?:\s*(?:auto|scroll)/i);
});
