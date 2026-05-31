#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const OUTPUT_DIR = 'output/qa/ultimate-trip-planner-email-sequence';

const STAGES = [
  { key: 'instant', label: 'Instant plan', offset: null },
  { key: 'minus7', label: '7 days before arrival', offset: -7 },
  { key: 'minus3', label: '3 days before arrival', offset: -3 },
  { key: 'minus1', label: '1 day before arrival', offset: -1 },
  { key: 'dayOf', label: 'Arrival day before 18:00 Berlin time', offset: 0 }
];

function usage() {
  console.log(`Usage:
  node ultimate-berlin-trip-planner/velo/simulate-email-sequence.mjs
  node ultimate-berlin-trip-planner/velo/simulate-email-sequence.mjs --arrival 2026-06-12 --signup 2026-06-01
  node ultimate-berlin-trip-planner/velo/simulate-email-sequence.mjs --arrival 2026-06-12 --signup 2026-06-01 --booked
  node ultimate-berlin-trip-planner/velo/simulate-email-sequence.mjs --arrival 2026-06-12 --job-date 2026-06-09 --hour 10

Dry-run only. Shows how the 7/3/1/day-of scheduler should branch and skip.

Options:
  --arrival DATE   Arrival date, YYYY-MM-DD. Default: 10 days from today.
  --signup DATE    Latest signup/update date, YYYY-MM-DD. Default: today.
  --job-date DATE  Optional scheduler run date to evaluate due stages.
  --hour HOUR      Berlin scheduler hour for --job-date. Default: 10.
  --booked         Use booked/prep branch instead of sales branch.
  --out FILE       Write JSON to a specific path.
`);
}

function parseArgs(argv) {
  const options = {
    arrivalDate: '',
    signupDate: '',
    jobDate: '',
    hour: 10,
    booked: false,
    outPath: ''
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--arrival') {
      options.arrivalDate = argv[index + 1] || '';
      index += 1;
    } else if (arg === '--signup') {
      options.signupDate = argv[index + 1] || '';
      index += 1;
    } else if (arg === '--job-date') {
      options.jobDate = argv[index + 1] || '';
      index += 1;
    } else if (arg === '--hour') {
      options.hour = Number(argv[index + 1] || 10);
      index += 1;
    } else if (arg === '--booked') {
      options.booked = true;
    } else if (arg === '--out') {
      options.outPath = argv[index + 1] || '';
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  options.hour = Math.max(0, Math.min(23, Math.round(options.hour || 10)));
  return options;
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function dateKey(date) {
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
}

function todayKey() {
  const now = new Date();
  now.setUTCHours(12, 0, 0, 0);
  return dateKey(now);
}

function dateFromKey(value) {
  if (!validDateKey(value)) throw new Error(`Invalid date: ${value}`);
  return new Date(`${value}T12:00:00Z`);
}

function addDays(dateValue, days) {
  const date = dateFromKey(dateValue);
  date.setUTCDate(date.getUTCDate() + days);
  return dateKey(date);
}

function validDateKey(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''));
}

function defaultArrivalDate() {
  return addDays(todayKey(), 10);
}

function outputPath(options) {
  if (options.outPath) return path.resolve(process.cwd(), options.outPath);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  return path.resolve(process.cwd(), OUTPUT_DIR, `email-sequence-${stamp}.json`);
}

function compareDates(left, right) {
  return String(left || '').localeCompare(String(right || ''));
}

function branchFor(options) {
  return options.booked ? 'booked_prep' : 'sales_conversion';
}

function messagePath(stage, options) {
  return `${options.booked ? 'booked' : 'sales'}.${stage.key}`;
}

function plannedStage(stage, options) {
  const branch = branchFor(options);
  if (stage.key === 'instant') {
    return {
      stage: stage.key,
      label: stage.label,
      branch,
      messagePath: messagePath(stage, options),
      dueDate: options.signupDate,
      status: 'send_on_submit',
      note: options.booked
        ? 'Immediate prep email; sales CTA suppressed.'
        : 'Immediate plan delivery email; includes the tour CTA.'
    };
  }

  const dueDate = addDays(options.arrivalDate, stage.offset);
  const relation = compareDates(dueDate, options.signupDate);
  let status = 'scheduled';
  let note = 'Hourly scheduler should send this stage on the due date.';

  if (relation < 0) {
    status = 'window_already_passed';
    note = 'This reminder date is before the latest signup/update date, so it should not be sent later.';
  } else if (relation === 0) {
    status = 'folded_into_instant';
    note = 'Velo skips scheduled reminders on the same Berlin date as signup to avoid double-sending.';
  } else if (stage.key === 'dayOf') {
    status = 'scheduled_before_18';
    note = 'Arrival-day email is eligible only before 18:00 Berlin time.';
  }

  if (options.booked && status.startsWith('scheduled')) {
    note += ' Booked branch uses meeting point, weather, and prep language.';
  }

  return {
    stage: stage.key,
    label: stage.label,
    branch,
    messagePath: messagePath(stage, options),
    dueDate,
    status,
    note
  };
}

function dueForJob(stagePlan, options) {
  if (!options.jobDate || stagePlan.stage === 'instant') return false;
  if (stagePlan.dueDate !== options.jobDate) return false;
  if (stagePlan.dueDate === options.signupDate) return false;
  if (stagePlan.stage === 'dayOf' && options.hour >= 18) return false;
  return stagePlan.status === 'scheduled' || stagePlan.status === 'scheduled_before_18';
}

function simulate(options) {
  const arrivalDate = options.arrivalDate || defaultArrivalDate();
  const signupDate = options.signupDate || todayKey();
  if (!validDateKey(arrivalDate)) throw new Error('arrival date must be YYYY-MM-DD');
  if (!validDateKey(signupDate)) throw new Error('signup date must be YYYY-MM-DD');
  if (options.jobDate && !validDateKey(options.jobDate)) throw new Error('job date must be YYYY-MM-DD');

  const normalized = {
    ...options,
    arrivalDate,
    signupDate
  };
  const timeline = STAGES.map((stage) => plannedStage(stage, normalized));
  const dueNow = timeline.filter((stagePlan) => dueForJob(stagePlan, normalized));

  return {
    generatedAt: new Date().toISOString(),
    mode: 'dry_run_email_sequence_simulator',
    arrivalDate,
    latestSignupDate: signupDate,
    jobDate: normalized.jobDate || '',
    berlinHour: normalized.hour,
    booked: normalized.booked,
    branch: branchFor(normalized),
    timeline,
    dueNow,
    notes: [
      'Instant sends at signup if the matching message ID exists.',
      'Scheduled reminders are skipped on the same Berlin date as the latest signup/update.',
      'Arrival-day email is eligible only before 18:00 Berlin time.',
      'Booked leads use booked/prep message IDs and should not fall back to sales IDs.'
    ]
  };
}

function summarize(result) {
  const scheduled = result.timeline.filter((stage) => stage.status.startsWith('scheduled')).length;
  const folded = result.timeline.filter((stage) => stage.status === 'folded_into_instant').length;
  const passed = result.timeline.filter((stage) => stage.status === 'window_already_passed').length;
  console.log(`Sequence branch: ${result.branch}`);
  console.log(`Arrival: ${result.arrivalDate}; latest signup: ${result.latestSignupDate}`);
  if (result.jobDate) {
    console.log(`Job run: ${result.jobDate} ${result.berlinHour}:00 Berlin; due now: ${result.dueNow.map((stage) => stage.stage).join(', ') || 'none'}`);
  }
  console.log(`Scheduled future stages: ${scheduled}; folded into instant: ${folded}; windows passed: ${passed}`);
}

async function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    usage();
    process.exitCode = 1;
    return;
  }

  if (options.help) {
    usage();
    return;
  }

  let result;
  try {
    result = simulate(options);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
    return;
  }

  const outPath = outputPath(options);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  summarize(result);
  console.log(`Result written to ${path.relative(process.cwd(), outPath)}`);
}

main();
