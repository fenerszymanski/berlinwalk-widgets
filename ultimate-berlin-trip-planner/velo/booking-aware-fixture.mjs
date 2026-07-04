#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const widgetRoot = path.resolve(scriptDir, '..');
const repoRoot = path.resolve(widgetRoot, '..');
const sourcePath = path.join(scriptDir, 'tripPlannerFunnel.js');
const outputDir = path.join(repoRoot, 'output/qa/ultimate-trip-planner-velo');

const MESSAGE_IDS = {
  TODO_TRIP_PLANNER_INSTANT: 'sales-instant-id',
  TODO_TRIP_PLANNER_MINUS_7: 'sales-minus7-id',
  TODO_TRIP_PLANNER_MINUS_3: 'sales-minus3-id',
  TODO_TRIP_PLANNER_MINUS_1: 'sales-minus1-id',
  TODO_TRIP_PLANNER_DAY_OF: 'sales-dayof-id'
};

const EXPECTED_STAGE_MESSAGE_IDS = {
  minus7: 'VLDvLj8',
  minus3: 'VLDvnng'
};

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = { out: '' };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--out') {
      parsed.out = args[index + 1] || '';
      index += 1;
    } else if (arg.startsWith('--out=')) {
      parsed.out = arg.slice('--out='.length);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return parsed;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function timestampSlug() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function transformFunnelSource() {
  let source = fs.readFileSync(sourcePath, 'utf8');
  source = source.replace(/^import .+;$/gm, '');
  source = source.replace(/export\s+async\s+function\s+/g, 'async function ');

  const replacements = Object.entries(MESSAGE_IDS)
    .sort((a, b) => b[0].length - a[0].length);
  for (const [placeholder, messageId] of replacements) {
    source = source.replace(new RegExp(`${escapeRegExp(placeholder)}(?![A-Z0-9_])`, 'g'), messageId);
  }

  return `${source}

return {
  processTripPlannerDueEmails,
  markTripPlannerLeadBooked
};`;
}

function createWixDataMock(db) {
  function makeQuery() {
    const state = {
      eq: [],
      between: [],
      skip: 0,
      limit: 50
    };

    const query = {
      eq(field, value) {
        state.eq.push({ field, value });
        return query;
      },
      between(field, min, max) {
        state.between.push({ field, min, max });
        return query;
      },
      skip(value) {
        state.skip = Number(value) || 0;
        return query;
      },
      limit(value) {
        state.limit = Number(value) || 50;
        return query;
      },
      async find() {
        let items = db.items.slice();
        for (const condition of state.eq) {
          items = items.filter((item) => item[condition.field] === condition.value);
        }
        for (const condition of state.between) {
          items = items.filter((item) => item[condition.field] >= condition.min && item[condition.field] < condition.max);
        }
        return {
          items: items.slice(state.skip, state.skip + state.limit),
          totalCount: items.length
        };
      }
    };

    return query;
  }

  return {
    query() {
      return makeQuery();
    },
    async update(collection, item) {
      const index = db.items.findIndex((candidate) => candidate._id === item._id);
      const next = clone(item);
      if (index === -1) {
        db.items.push(next);
      } else {
        db.items[index] = next;
      }
      db.updates.push({ collection, item: next });
      return next;
    },
    async insert(collection, item) {
      const next = Object.assign({ _id: `fixture-${db.items.length + 1}` }, clone(item));
      db.items.push(next);
      db.inserts.push({ collection, item: next });
      return next;
    }
  };
}

function createContactsMock() {
  return {
    queryContacts() {
      return {
        eq() {
          return this;
        },
        limit() {
          return this;
        },
        async find() {
          return { items: [] };
        }
      };
    },
    async createContact(payload) {
      const email = payload && payload.emails && payload.emails[0] && payload.emails[0].email;
      return { _id: `contact-${email || 'fixture'}` };
    },
    async findOrCreateLabel() {
      return { key: 'ultimate-trip-planner-lead' };
    },
    async labelContact() {
      return {};
    }
  };
}

function createHarness(options = {}) {
  const db = {
    items: [],
    inserts: [],
    updates: [],
    sentEmails: []
  };
  const wixData = createWixDataMock(db);
  const contacts = createContactsMock();
  const triggeredEmails = {
    async emailContact(messageId, contactId, payload = {}) {
      db.sentEmails.push({
        messageId,
        contactId,
        variables: clone(payload.variables || {})
      });
    }
  };

  const factory = new Function('wixData', 'contacts', 'triggeredEmails', transformFunnelSource(options));
  const api = factory(wixData, contacts, triggeredEmails);
  return { db, api };
}

function baseLead(overrides = {}) {
  return Object.assign({
    _id: overrides._id || `lead-${Math.random().toString(16).slice(2)}`,
    email: 'guest@example.com',
    contactId: 'contact-fixture',
    arrivalDate: '2026-06-08',
    tripLength: 3,
    planTitle: 'Fixture Berlin plan',
    recommendedTourDay: 'Day 2',
    consent: true,
    createdAt: '2026-06-01T08:00:00.000Z',
    lastSignupAt: '2026-06-01T08:00:00.000Z',
    tourIntent: ''
  }, overrides);
}

async function testBookedLeadSuppressesUltimateReminders() {
  const { db, api } = createHarness();
  const now = new Date('2026-06-05T08:00:00.000Z');
  db.items.push(
    baseLead({ _id: 'lead-sales', email: 'sales@example.com', contactId: 'contact-sales' }),
    baseLead({ _id: 'lead-booked', email: 'booked@example.com', contactId: 'contact-booked', bookedAt: '2026-06-04T09:00:00.000Z', bookingStatus: 'booked' })
  );

  const summary = await api.processTripPlannerDueEmails(now);
  assert.equal(summary.sent, 1);
  assert.equal(db.sentEmails.length, 1);

  const salesEmail = db.sentEmails.find((email) => email.contactId === 'contact-sales');
  assert.equal(salesEmail.messageId, EXPECTED_STAGE_MESSAGE_IDS.minus3);
  assert.equal(salesEmail.variables.isBooked, 'no');
  assert(!db.sentEmails.some((email) => email.contactId === 'contact-booked'));

  return {
    sent: summary.sent,
    messages: db.sentEmails.map((email) => `${email.contactId}:${email.messageId}:${email.variables.isBooked}`),
    bookedSuppressed: !db.sentEmails.some((email) => email.contactId === 'contact-booked')
  };
}

async function testInactiveBookingStatusUsesSalesBranch() {
  const { db, api } = createHarness();
  db.items.push(baseLead({
    _id: 'lead-cancelled',
    email: 'cancelled@example.com',
    contactId: 'contact-cancelled',
    bookedAt: '2026-06-04T09:00:00.000Z',
    bookingStatus: 'cancelled'
  }));

  const summary = await api.processTripPlannerDueEmails(new Date('2026-06-05T08:00:00.000Z'));
  assert.equal(summary.sent, 1);
  assert.equal(db.sentEmails.length, 1);
  assert.equal(db.sentEmails[0].messageId, EXPECTED_STAGE_MESSAGE_IDS.minus3);
  assert.equal(db.sentEmails[0].variables.isBooked, 'no');

  return {
    bookingStatus: 'cancelled',
    messageId: db.sentEmails[0].messageId,
    isBooked: db.sentEmails[0].variables.isBooked
  };
}

async function testMinus7UpperBoundaryCandidateIncluded() {
  const { db, api } = createHarness();
  db.items.push(baseLead({
    _id: 'lead-minus7-boundary',
    email: 'minus7-boundary@example.com',
    contactId: 'contact-minus7-boundary',
    arrivalDate: '2026-06-12',
    createdAt: '2026-06-01T08:00:00.000Z',
    lastSignupAt: '2026-06-01T08:00:00.000Z'
  }));

  const summary = await api.processTripPlannerDueEmails(new Date('2026-06-05T08:00:00.000Z'));
  assert.equal(summary.sent, 1);
  assert.equal(db.sentEmails.length, 1);
  assert.equal(db.sentEmails[0].messageId, EXPECTED_STAGE_MESSAGE_IDS.minus7);
  assert.equal(db.sentEmails[0].variables.stage, 'minus7');

  return {
    sent: summary.sent,
    messageId: db.sentEmails[0].messageId,
    stage: db.sentEmails[0].variables.stage
  };
}

async function testSelfReportedBookedSuppressesScheduledReminders() {
  const { db, api } = createHarness();
  db.items.push(baseLead({
    _id: 'lead-self-reported-booked',
    email: 'self-reported@example.com',
    contactId: 'contact-self-reported',
    tourIntent: 'Already booked'
  }));

  const summary = await api.processTripPlannerDueEmails(new Date('2026-06-05T08:00:00.000Z'));
  assert.equal(summary.sent, 0);
  assert.equal(db.sentEmails.length, 0);

  return {
    sent: summary.sent,
    messages: db.sentEmails.length,
    suppressed: true
  };
}

async function testBookingMarkerScopesByArrivalDate() {
  const { db, api } = createHarness();
  db.items.push(
    baseLead({ _id: 'lead-target-date', email: 'same@example.com', contactId: 'contact-same-1', arrivalDate: '2026-06-08' }),
    baseLead({ _id: 'lead-other-date', email: 'same@example.com', contactId: 'contact-same-2', arrivalDate: '2026-06-10' })
  );

  const result = await api.markTripPlannerLeadBooked({
    email: 'same@example.com',
    arrivalDate: '2026-06-08',
    bookingId: 'fixture-booking',
    tourDate: '2026-06-08',
    bookingStatus: 'booked',
    source: 'fixture_booking_event'
  });

  const target = db.items.find((item) => item._id === 'lead-target-date');
  const other = db.items.find((item) => item._id === 'lead-other-date');
  assert.equal(result.matched, 1);
  assert.equal(result.updated, 1);
  assert.equal(target.bookingId, 'fixture-booking');
  assert.equal(target.bookingStatus, 'booked');
  assert.equal(target.bookingSource, 'fixture_booking_event');
  assert.equal(other.bookingId, undefined);
  assert.equal(other.bookedAt, undefined);

  return {
    matched: result.matched,
    updated: result.updated,
    targetBookingId: target.bookingId,
    otherTouched: Boolean(other.bookedAt || other.bookingId)
  };
}

const TESTS = [
  ['booked leads suppress Ultimate reminders', testBookedLeadSuppressesUltimateReminders],
  ['cancelled booked markers use the sales branch', testInactiveBookingStatusUsesSalesBranch],
  ['minus7 includes the upper-bound arrival date', testMinus7UpperBoundaryCandidateIncluded],
  ['self-reported booked leads suppress scheduled reminders', testSelfReportedBookedSuppressesScheduledReminders],
  ['booking marker respects arrivalDate scope', testBookingMarkerScopesByArrivalDate]
];

async function run() {
  const args = parseArgs();
  const results = [];

  for (const [name, fn] of TESTS) {
    try {
      const details = await fn();
      results.push({ name, status: 'pass', details });
    } catch (error) {
      results.push({
        name,
        status: 'fail',
        error: String(error && error.stack ? error.stack : error)
      });
    }
  }

  const failed = results.filter((result) => result.status === 'fail');
  const outPath = args.out
    ? path.resolve(process.cwd(), args.out)
    : path.join(outputDir, `booking-aware-fixture-${timestampSlug()}.json`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    source: path.relative(repoRoot, sourcePath).replaceAll(path.sep, '/'),
    status: failed.length ? 'fail' : 'pass',
    tests: results
  }, null, 2));

  for (const result of results) {
    const marker = result.status === 'pass' ? 'OK' : 'FAIL';
    console.log(`${marker} ${result.name}`);
  }
  console.log(`Result file: ${path.relative(repoRoot, outPath).replaceAll(path.sep, '/')}`);

  if (failed.length) {
    process.exitCode = 1;
  } else {
    console.log(`PASS ${results.length} booking-aware Velo fixture checks`);
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
