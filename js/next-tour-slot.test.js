const assert = require('node:assert/strict');
const { bwNextTourSlot, bwNextTourSlots } = require('./next-tour-slot.js');

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

const upcoming = bwNextTourSlots({ now: new Date('2026-07-05T10:00:00Z'), count: 2 });
assert.equal(upcoming.length, 2);
assert.equal(upcoming[0].weekdayShort, 'Tue');
assert.equal(upcoming[0].startLabel, '11:30');
assert.equal(upcoming[1].weekdayShort, 'Wed');
assert.equal(upcoming[1].relativeLabel, 'Wednesday');

const sameDayUpcoming = bwNextTourSlots({ now: new Date('2026-07-07T05:00:00Z'), count: 2 });
assert.equal(sameDayUpcoming[0].relativeLabel, 'Today (Tue)');
assert.equal(sameDayUpcoming[1].relativeLabel, 'Tomorrow (Wed)');

console.log('next-tour-slot tests passed');
