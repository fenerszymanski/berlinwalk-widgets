import wixData from 'wix-data';
import { contacts, triggeredEmails } from 'wix-crm-backend';

const COLLECTION = 'FirstDayPlannerLeads';
const CONTACT_LABEL = 'First-Day Planner Lead';
const TIMEZONE = 'Europe/Berlin';
const BOOKING_SHORT_URL = 'https://www.berlinwalk.com/book';

const STAGES = [
  { key: 'minus3', offset: -3, sentField: 'sentMinus3At', errorField: 'minus3Error', messageId: 'TODO_FIRST_DAY_PLANNER_MINUS_3' },
  { key: 'minus2', offset: -2, sentField: 'sentMinus2At', errorField: 'minus2Error', messageId: 'TODO_FIRST_DAY_PLANNER_MINUS_2' },
  { key: 'minus1', offset: -1, sentField: 'sentMinus1At', errorField: 'minus1Error', messageId: 'TODO_FIRST_DAY_PLANNER_MINUS_1' },
  { key: 'dayOf', offset: 0, sentField: 'sentDayOfAt', errorField: 'dayOfError', messageId: 'TODO_FIRST_DAY_PLANNER_DAY_OF' }
];

function invalidPayload(message) {
  const error = new Error(message);
  error.code = 'invalid_payload';
  return error;
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value));
}

function cleanText(value, fallback = '') {
  return String(value == null ? fallback : value).trim().slice(0, 500);
}

function validatePayload(payload) {
  const email = normalizeEmail(payload && payload.email);
  const arrivalDate = cleanText(payload && payload.arrivalDate);
  if (!validEmail(email)) throw invalidPayload('email is required');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(arrivalDate)) throw invalidPayload('arrivalDate must be YYYY-MM-DD');
  if (!payload || payload.consent !== true) throw invalidPayload('consent is required');
  return {
    email,
    arrivalDate,
    arrivalTime: cleanText(payload.arrivalTime),
    startPoint: cleanText(payload.startPoint),
    energy: cleanText(payload.energy),
    priority: cleanText(payload.priority),
    luggage: cleanText(payload.luggage),
    planTitle: cleanText(payload.planTitle, 'Berlin first-day plan'),
    ticket: cleanText(payload.ticket),
    tourFit: cleanText(payload.tourFit),
    weatherMode: cleanText(payload.weatherMode),
    weatherTitle: cleanText(payload.weatherTitle),
    requestedAction: cleanText(payload.requestedAction),
    source: cleanText(payload.source, 'tool'),
    page: cleanText(payload.page),
    consent: true
  };
}

function dateFromKey(dateKey) {
  const parts = dateKey.split('-').map(Number);
  return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12, 0, 0));
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function toDateKey(date) {
  return date.getUTCFullYear() + '-' + pad2(date.getUTCMonth() + 1) + '-' + pad2(date.getUTCDate());
}

function addDays(dateKey, days) {
  const date = dateFromKey(dateKey);
  date.setUTCDate(date.getUTCDate() + days);
  return toDateKey(date);
}

function berlinNowParts(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(now).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});

  return {
    dateKey: parts.year + '-' + parts.month + '-' + parts.day,
    hour: Number(parts.hour || 0)
  };
}

function leadKey(email, arrivalDate) {
  return email + '|' + arrivalDate;
}

function contactIdFrom(contact) {
  if (!contact) return '';
  return contact._id || contact.id || contact.contactId || (contact.contact && (contact.contact._id || contact.contact.id)) || '';
}

async function findContactByEmail(email) {
  const results = await contacts.queryContacts()
    .eq('primaryInfo.email', email)
    .limit(1)
    .find({ suppressAuth: true });

  return results.items && results.items.length ? results.items[0] : null;
}

function labelKeyFrom(result) {
  if (!result) return '';
  if (result.key) return result.key;
  if (result.label && result.label.key) return result.label.key;
  if (result.item && result.item.key) return result.item.key;
  return '';
}

async function ensureContact(email) {
  let contact = await findContactByEmail(email);

  if (!contact) {
    try {
      contact = await contacts.createContact({
        emails: [{ email, primary: true }]
      }, { suppressAuth: true });
    } catch (error) {
      contact = await findContactByEmail(email);
      if (!contact) throw error;
    }
  }

  const contactId = contactIdFrom(contact);
  if (!contactId) throw new Error('contact_not_created');

  try {
    const labelResult = await contacts.findOrCreateLabel(CONTACT_LABEL, { suppressAuth: true });
    const labelKey = labelKeyFrom(labelResult);

    if (labelKey) {
      await contacts.labelContact(contactId, [labelKey], { suppressAuth: true });
    }
  } catch (error) {
    console.warn('First-Day Planner contact label failed', error);
  }

  return contactId;
}

async function findExistingLead(key) {
  const results = await wixData.query(COLLECTION)
    .eq('leadKey', key)
    .limit(1)
    .find({ suppressAuth: true });

  return results.items && results.items.length ? results.items[0] : null;
}

export async function saveFirstDayPlannerLead(payload) {
  const lead = validatePayload(payload);
  const contactId = await ensureContact(lead.email);
  const key = leadKey(lead.email, lead.arrivalDate);
  const now = new Date();
  const existing = await findExistingLead(key);

  const item = {
    leadKey: key,
    email: lead.email,
    contactId,
    arrivalDate: lead.arrivalDate,
    arrivalTime: lead.arrivalTime,
    startPoint: lead.startPoint,
    energy: lead.energy,
    priority: lead.priority,
    luggage: lead.luggage,
    planTitle: lead.planTitle,
    ticket: lead.ticket,
    tourFit: lead.tourFit,
    weatherMode: lead.weatherMode,
    weatherTitle: lead.weatherTitle,
    requestedAction: lead.requestedAction,
    source: lead.source,
    page: lead.page,
    consent: lead.consent,
    lastSignupAt: now,
    updatedAt: now
  };

  if (existing) {
    const updated = await wixData.update(
      COLLECTION,
      Object.assign({}, existing, item),
      { suppressAuth: true }
    );

    return { contactId, leadId: updated._id, created: false, updated: true };
  }

  const inserted = await wixData.insert(
    COLLECTION,
    Object.assign({}, item, { createdAt: now }),
    { suppressAuth: true }
  );

  return { contactId, leadId: inserted._id, created: true, updated: false };
}

function messageIdFor(stage) {
  return stage.messageId && stage.messageId.indexOf('TODO_') !== 0 ? stage.messageId : '';
}

function stageDueForLead(lead, stage, berlinToday, berlinHour) {
  if (!lead || lead[stage.sentField]) return false;
  if (!lead.arrivalDate) return false;

  const dueDate = addDays(lead.arrivalDate, stage.offset);

  if (dueDate !== berlinToday) return false;
  if (stage.key === 'dayOf' && berlinHour >= 18) return false;

  return true;
}

function emailVariables(lead, stage) {
  return {
    stage: stage.key,
    arrivalDate: String(lead.arrivalDate || ''),
    planTitle: String(lead.planTitle || 'Berlin first-day plan'),
    ticket: String(lead.ticket || ''),
    tourFit: String(lead.tourFit || ''),
    weatherTitle: String(lead.weatherTitle || ''),
    startPoint: String(lead.startPoint || ''),
    bookingUrl: BOOKING_SHORT_URL,
    meetingPointUrl: 'https://www.berlinwalk.com/meeting-point',
    ticketCalculatorUrl: 'https://www.berlinwalk.com/tools/transport-ticket-calculator',
    whatsOpenUrl: 'https://www.berlinwalk.com/tools/whats-open-in-berlin-today',
    berlinThreeDaysUrl: 'https://www.berlinwalk.com/tools/berlin-3-day-itinerary'
  };
}

async function sendStageEmail(lead, stage, now) {
  const messageId = messageIdFor(stage);
  if (!messageId) {
    return {
      sent: false,
      skipped: true,
      reason: 'missing_message_id',
      stage: stage.key
    };
  }

  await triggeredEmails.emailContact(messageId, lead.contactId, {
    variables: emailVariables(lead, stage)
  });

  const patch = Object.assign({}, lead);
  patch[stage.sentField] = now;
  patch[stage.errorField] = '';
  patch.updatedAt = now;
  await wixData.update(COLLECTION, patch, { suppressAuth: true });
  return {
    sent: true,
    stage: stage.key,
    leadId: lead._id
  };
}

async function markStageError(lead, stage, error, now) {
  const patch = Object.assign({}, lead);
  patch[stage.errorField] = String(error && error.message ? error.message : error).slice(0, 500);
  patch.updatedAt = now;
  await wixData.update(COLLECTION, patch, { suppressAuth: true });
}

export async function processFirstDayPlannerDueEmails(now = new Date()) {
  const berlin = berlinNowParts(now);
  const latestArrivalDate = addDays(berlin.dateKey, 3);
  const results = await wixData.query(COLLECTION)
    .between('arrivalDate', berlin.dateKey, latestArrivalDate)
    .eq('consent', true)
    .limit(100)
    .find({ suppressAuth: true });

  const items = results.items || [];
  const summary = {
    checked: items.length,
    sent: 0,
    skipped: 0,
    errors: 0,
    stages: []
  };

  for (const lead of items) {
    if (!lead.contactId) {
      summary.skipped += 1;
      continue;
    }

    for (const stage of STAGES) {
      if (!stageDueForLead(lead, stage, berlin.dateKey, berlin.hour)) continue;
      try {
        const result = await sendStageEmail(lead, stage, now);
        if (result.sent) summary.sent += 1;
        else summary.skipped += 1;
        summary.stages.push(result);
      } catch (error) {
        summary.errors += 1;
        summary.stages.push({
          sent: false,
          stage: stage.key,
          leadId: lead._id,
          reason: 'send_failed'
        });
        await markStageError(lead, stage, error, now);
      }
    }
  }

  return summary;
}
