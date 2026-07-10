const assert = require('node:assert/strict');
const {
  bwNextTourSlot,
  bwNextTourSlots,
  bwNextTourStarts,
  bwNextTourStartsLabel,
  bwLiveNextTourSlot,
  bwLiveNextTourStarts,
  bwLiveNextTourStartsLabel,
} = require('./next-tour-slot.js');

function slot(iso) {
  return bwNextTourSlot({ now: new Date(iso) });
}

assert.equal(slot('2026-07-04T18:00:00Z').dateKey, '2026-07-07');
assert.equal(slot('2026-07-05T10:00:00Z').relativeLabel, 'Tuesday');
assert.equal(slot('2026-07-05T10:00:00Z').dateKey, '2026-07-07');
assert.equal(slot('2026-07-05T10:00:00Z').slotsLabel, '11:30 and 15:30');
assert.equal(slot('2026-07-05T10:00:00Z').slotCount, 2);
assert.equal(slot('2026-07-07T05:00:00Z').relativeLabel, 'Today (Tue)');
assert.equal(slot('2026-07-07T05:00:00Z').dateKey, '2026-07-07');
assert.deepEqual(slot('2026-07-07T05:00:00Z').startLabels, ['11:30', '15:30']);
assert.equal(slot('2026-07-07T08:00:00Z').relativeLabel, 'Today (Tue)');
assert.equal(slot('2026-07-07T08:00:00Z').dateKey, '2026-07-07');
assert.equal(slot('2026-07-07T08:00:00Z').startLabel, '15:30');
assert.equal(slot('2026-07-07T08:00:00Z').slotsLabel, '15:30');
assert.equal(slot('2026-07-07T08:00:00Z').slotCount, 1);
assert.equal(slot('2026-07-06T10:00:00Z').relativeLabel, 'Tomorrow (Tue)');
assert.equal(slot('2026-07-06T10:00:00Z').dateKey, '2026-07-07');
assert.equal(slot('2026-11-05T10:00:00Z').slotsLabel, '11:30');
assert.equal(slot('2026-11-05T10:00:00Z').slotCount, 1);

const upcoming = bwNextTourSlots({ now: new Date('2026-07-05T10:00:00Z'), count: 2 });
assert.equal(upcoming.length, 2);
assert.equal(upcoming[0].weekdayShort, 'Tue');
assert.equal(upcoming[0].startLabel, '11:30');
assert.equal(upcoming[0].slotsLabel, '11:30 and 15:30');
assert.equal(upcoming[0].slotCount, 2);
assert.equal(upcoming[1].weekdayShort, 'Wed');
assert.equal(upcoming[1].relativeLabel, 'Wednesday');
assert.deepEqual(upcoming[1].startLabels, ['11:30', '15:30']);

const sameDayUpcoming = bwNextTourSlots({ now: new Date('2026-07-07T05:00:00Z'), count: 2 });
assert.equal(sameDayUpcoming[0].relativeLabel, 'Today (Tue)');
assert.equal(sameDayUpcoming[1].relativeLabel, 'Tomorrow (Wed)');

const nextStarts = bwNextTourStarts({ now: new Date('2026-07-05T10:00:00Z'), count: 2 });
assert.equal(nextStarts.length, 2);
assert.equal(nextStarts[0].compactRelativeLabel, 'Tue');
assert.equal(nextStarts[0].startLabel, '11:30');
assert.equal(nextStarts[1].compactRelativeLabel, 'Tue');
assert.equal(nextStarts[1].startLabel, '15:30');
assert.equal(bwNextTourStartsLabel({ now: new Date('2026-07-05T10:00:00Z'), count: 2 }), 'Tue 11:30 + 15:30');

const crossDayStarts = bwNextTourStarts({ now: new Date('2026-07-07T08:31:00Z'), count: 2 });
assert.equal(crossDayStarts.length, 2);
assert.equal(crossDayStarts[0].compactRelativeLabel, 'Today');
assert.equal(crossDayStarts[0].startLabel, '15:30');
assert.equal(crossDayStarts[1].compactRelativeLabel, 'Tomorrow');
assert.equal(crossDayStarts[1].startLabel, '11:30');
assert.equal(bwNextTourStartsLabel({ now: new Date('2026-07-07T08:31:00Z'), count: 2 }), 'Today 15:30 + Tomorrow 11:30');

const afterFirstCutoff = bwNextTourSlot({ now: new Date('2026-07-07T08:31:00Z') });
assert.equal(afterFirstCutoff.relativeLabel, 'Today (Tue)');
assert.equal(afterFirstCutoff.startLabel, '15:30');
assert.equal(afterFirstCutoff.slotsLabel, '15:30');

const afterBothCutoffs = bwNextTourSlot({ now: new Date('2026-07-07T10:31:00Z') });
assert.equal(afterBothCutoffs.relativeLabel, 'Tomorrow (Wed)');
assert.equal(afterBothCutoffs.slotsLabel, '11:30 and 15:30');

(async () => {
  const liveAvailability = {
    slots: [
      { startDate: '2026-07-11T11:30:00.000+02:00' },
      { startDate: '2026-07-14T11:30:00.000+02:00' },
      { startDate: '2026-07-14T15:30:00.000+02:00' },
      { startDate: '2026-07-15T11:30:00.000+02:00' },
    ],
  };
  const liveStarts = await bwLiveNextTourStarts({
    now: new Date('2026-07-10T18:00:00Z'),
    availability: liveAvailability,
    count: 2,
  });
  assert.deepEqual(liveStarts.map((entry) => entry.dateKey + ' ' + entry.startLabel), [
    '2026-07-11 11:30',
    '2026-07-14 11:30',
  ]);

  const liveNoSaturday = {
    slots: liveAvailability.slots.slice(1),
  };
  const liveSlot = await bwLiveNextTourSlot({
    now: new Date('2026-07-10T18:00:00Z'),
    availability: liveNoSaturday,
  });
  assert.equal(liveSlot.dateKey, '2026-07-14');
  assert.equal(liveSlot.relativeLabel, 'Tuesday');
  assert.equal(liveSlot.slotsLabel, '11:30 and 15:30');
  assert.equal(await bwLiveNextTourStartsLabel({
    now: new Date('2026-07-10T18:00:00Z'),
    availability: liveNoSaturday,
    count: 2,
  }), 'Tue 11:30 + 15:30');

  console.log('next-tour-slot tests passed');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
