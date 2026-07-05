const assert = require('node:assert/strict');
const { bwNextTourSlot } = require('./next-tour-slot.js');

function slot(iso) {
  return bwNextTourSlot({ now: new Date(iso) });
}

assert.equal(slot('2026-07-04T18:00:00Z').dateKey, '2026-07-07');
assert.equal(slot('2026-07-05T10:00:00Z').relativeLabel, 'Tuesday');
assert.equal(slot('2026-07-05T10:00:00Z').dateKey, '2026-07-07');
assert.equal(slot('2026-07-07T05:00:00Z').relativeLabel, 'Today (Tue)');
assert.equal(slot('2026-07-07T05:00:00Z').dateKey, '2026-07-07');
assert.equal(slot('2026-07-07T08:00:00Z').relativeLabel, 'Tomorrow (Wed)');
assert.equal(slot('2026-07-07T08:00:00Z').dateKey, '2026-07-08');
assert.equal(slot('2026-07-06T10:00:00Z').relativeLabel, 'Tomorrow (Tue)');
assert.equal(slot('2026-07-06T10:00:00Z').dateKey, '2026-07-07');

console.log('next-tour-slot tests passed');
