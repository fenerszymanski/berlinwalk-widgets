import wixData from 'wix-data';
import { contacts, triggeredEmails } from 'wix-crm-backend';

const COLLECTION = 'TripPlannerLeads';
const CONTACT_LABEL = 'Ultimate Berlin Trip Planner Lead';
const TIMEZONE = 'Europe/Berlin';
const BOOKING_SHORT_URL = 'https://www.berlinwalk.com/book';
const DUE_QUERY_PAGE_SIZE = 100;

const STAGES = [
  {
    key: 'instant',
    offset: null,
    sentField: 'sentInstantAt',
    errorField: 'instantError',
    messageId: 'GATE_DOWNLOAD_ID_00',
    bookedMessageId: 'GATE_DOWNLOAD_ID_05'
  },
  {
    key: 'minus7',
    offset: -7,
    sentField: 'sentMinus7At',
    errorField: 'minus7Error',
    messageId: 'GATE_DOWNLOAD_ID_01',
    bookedMessageId: 'GATE_DOWNLOAD_ID_06'
  },
  {
    key: 'minus3',
    offset: -3,
    sentField: 'sentMinus3At',
    errorField: 'minus3Error',
    messageId: 'GATE_DOWNLOAD_ID_02',
    bookedMessageId: 'GATE_DOWNLOAD_ID_07'
  },
  {
    key: 'minus1',
    offset: -1,
    sentField: 'sentMinus1At',
    errorField: 'minus1Error',
    messageId: 'GATE_DOWNLOAD_ID_03',
    bookedMessageId: 'GATE_DOWNLOAD_ID_08'
  },
  {
    key: 'dayOf',
    offset: 0,
    sentField: 'sentDayOfAt',
    errorField: 'dayOfError',
    messageId: 'GATE_DOWNLOAD_ID_04',
    bookedMessageId: 'GATE_DOWNLOAD_ID_09'
  }
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

function cleanText(value, fallback = '', maxLength = 800) {
  return String(value == null ? fallback : value).trim().slice(0, maxLength);
}

function cleanNumber(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.round(number)));
}

function validateLeadPayload(payload) {
  const email = normalizeEmail(payload && payload.email);
  const arrivalDate = cleanText(payload && payload.arrivalDate);
  if (!validEmail(email)) throw invalidPayload('email is required');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(arrivalDate)) throw invalidPayload('arrivalDate must be YYYY-MM-DD');
  if (!payload || payload.consent !== true) throw invalidPayload('consent is required');

  return {
    email,
    arrivalDate,
    tripLength: cleanNumber(payload.tripLength, 3, 1, 7),
    arrivalTime: cleanText(payload.arrivalTime),
    arrivalPoint: cleanText(payload.arrivalPoint),
    stayArea: cleanText(payload.stayArea),
    groupType: cleanText(payload.groupType),
    firstTime: cleanText(payload.firstTime),
    interests: cleanText(payload.interests),
    budgetStyle: cleanText(payload.budgetStyle),
    mustHandle: cleanText(payload.mustHandle),
    pace: cleanText(payload.pace),
    tourIntent: cleanText(payload.tourIntent),
    planTitle: cleanText(payload.planTitle, 'Ultimate Berlin trip plan'),
    recommendedTourDay: cleanText(payload.recommendedTourDay),
    recommendedTourDate: cleanText(payload.recommendedTourDate),
    recommendedTourTime: cleanText(payload.recommendedTourTime),
    meetingPointUrl: cleanText(payload.meetingPointUrl, 'https://www.berlinwalk.com/meeting-point'),
    ticket: cleanText(payload.ticket),
    weatherTitle: cleanText(payload.weatherTitle),
    travelMode: cleanText(payload.travelMode),
    planHealth: cleanText(payload.planHealth),
    preArrivalChecklist: cleanText(payload.preArrivalChecklist),
    baseBrief: cleanText(payload.baseBrief),
    budgetPulse: cleanText(payload.budgetPulse),
    interestLens: cleanText(payload.interestLens),
    paceGuard: cleanText(payload.paceGuard),
    weatherStrategy: cleanText(payload.weatherStrategy),
    carryPack: cleanText(payload.carryPack),
    reservationRadar: cleanText(payload.reservationRadar),
    planAdvice: cleanText(payload.planAdvice),
    planSwaps: cleanText(payload.planSwaps),
    dayRhythm: cleanText(payload.dayRhythm),
    dayIntelligence: cleanText(payload.dayIntelligence),
    dayOperations: cleanText(payload.dayOperations, '', 1200),
    arrivalWindow: cleanText(payload.arrivalWindow),
    tripRisk: cleanText(payload.tripRisk),
    tourRecommendation: cleanText(payload.tourRecommendation),
    intentStage: cleanText(payload.intentStage),
    familyOrSlow: cleanText(payload.familyOrSlow),
    bookAheadNeeded: cleanText(payload.bookAheadNeeded),
    conversionSignal: cleanText(payload.conversionSignal),
    conversionScore: cleanNumber(payload.conversionScore, 0, 0, 100),
    conversionTier: cleanText(payload.conversionTier),
    conversionNextAction: cleanText(payload.conversionNextAction),
    conversionReasons: cleanText(payload.conversionReasons),
    source: cleanText(payload.source, 'tool'),
    page: cleanText(payload.page),
    consent: true
  };
}

function validateBookingPayload(payload) {
  const email = normalizeEmail(payload && payload.email);
  if (!validEmail(email)) throw invalidPayload('email is required');
  return {
    email,
    arrivalDate: cleanText(payload && payload.arrivalDate),
    bookingId: cleanText(payload && payload.bookingId),
    tourDate: cleanText(payload && payload.tourDate),
    bookingStatus: cleanText(payload && payload.bookingStatus, 'booked'),
    source: cleanText(payload && payload.source, 'booking_event')
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

function berlinDateKeyFrom(value) {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return berlinNowParts(date).dateKey;
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
    if (labelKey) await contacts.labelContact(contactId, [labelKey], { suppressAuth: true });
  } catch (error) {
    console.warn('Trip Planner contact label failed', error);
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

function isBookedLead(lead) {
  const status = String(lead && lead.bookingStatus || '').toLowerCase();
  const intent = String(lead && lead.tourIntent || '').toLowerCase();
  const inactiveStatuses = ['cancelled', 'canceled', 'refunded', 'declined', 'no_show', 'no-show'];
  const bookedStatuses = ['booked', 'confirmed', 'self_reported_booked'];
  if (!lead || inactiveStatuses.indexOf(status) !== -1) return false;
  return Boolean(lead.bookedAt || bookedStatuses.indexOf(status) !== -1 || intent.indexOf('already booked') !== -1);
}

function messageIdFor(stage, lead) {
  const booked = isBookedLead(lead);
  const raw = booked ? stage.bookedMessageId : stage.messageId;
  return raw && raw.indexOf('TODO_') !== 0 ? raw : '';
}

function emailVariables(lead, stage) {
  const booked = isBookedLead(lead);
  return {
    stage: stage.key,
    isBooked: booked ? 'yes' : 'no',
    arrivalDate: String(lead.arrivalDate || ''),
    tripLength: String(lead.tripLength || ''),
    planTitle: String(lead.planTitle || 'Ultimate Berlin trip plan'),
    recommendedTourDay: String(lead.recommendedTourDay || ''),
    recommendedTourDate: String(lead.recommendedTourDate || ''),
    recommendedTourTime: String(lead.recommendedTourTime || ''),
    ticket: String(lead.ticket || ''),
    weatherTitle: String(lead.weatherTitle || ''),
    travelMode: String(lead.travelMode || ''),
    planHealth: String(lead.planHealth || ''),
    preArrivalChecklist: String(lead.preArrivalChecklist || ''),
    baseBrief: String(lead.baseBrief || ''),
    budgetPulse: String(lead.budgetPulse || ''),
    interestLens: String(lead.interestLens || ''),
    paceGuard: String(lead.paceGuard || ''),
    weatherStrategy: String(lead.weatherStrategy || ''),
    carryPack: String(lead.carryPack || ''),
    reservationRadar: String(lead.reservationRadar || ''),
    planAdvice: String(lead.planAdvice || ''),
    planSwaps: String(lead.planSwaps || ''),
    dayRhythm: String(lead.dayRhythm || ''),
    dayIntelligence: String(lead.dayIntelligence || ''),
    dayOperations: String(lead.dayOperations || ''),
    arrivalWindow: String(lead.arrivalWindow || ''),
    tripRisk: String(lead.tripRisk || ''),
    tourRecommendation: String(lead.tourRecommendation || ''),
    intentStage: String(lead.intentStage || ''),
    familyOrSlow: String(lead.familyOrSlow || ''),
    bookAheadNeeded: String(lead.bookAheadNeeded || ''),
    conversionSignal: String(lead.conversionSignal || ''),
    conversionScore: String(lead.conversionScore || ''),
    conversionTier: String(lead.conversionTier || ''),
    conversionNextAction: String(lead.conversionNextAction || ''),
    conversionReasons: String(lead.conversionReasons || ''),
    arrivalTime: String(lead.arrivalTime || ''),
    arrivalPoint: String(lead.arrivalPoint || ''),
    stayArea: String(lead.stayArea || ''),
    groupType: String(lead.groupType || ''),
    interests: String(lead.interests || ''),
    budgetStyle: String(lead.budgetStyle || ''),
    mustHandle: String(lead.mustHandle || ''),
    pace: String(lead.pace || ''),
    tourIntent: String(lead.tourIntent || ''),
    bookingStatus: String(lead.bookingStatus || ''),
    tourDate: String(lead.tourDate || ''),
    bookingUrl: BOOKING_SHORT_URL,
    meetingPointUrl: String(lead.meetingPointUrl || 'https://www.berlinwalk.com/meeting-point'),
    firstDayPlannerUrl: 'https://www.berlinwalk.com/tools/berlin-first-day-planner',
    ticketCalculatorUrl: 'https://www.berlinwalk.com/tools/transport-ticket-calculator',
    whatsOpenUrl: 'https://www.berlinwalk.com/tools/whats-open-in-berlin-today',
    dailyBudgetUrl: 'https://www.berlinwalk.com/tools/berlin-daily-budget'
  };
}

async function sendStageEmail(lead, stage, now) {
  const messageId = messageIdFor(stage, lead);
  if (!messageId) {
    return {
      sent: false,
      skipped: true,
      reason: 'missing_message_id',
      stage: stage.key,
      booked: isBookedLead(lead)
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
    leadId: lead._id,
    booked: isBookedLead(lead)
  };
}

async function markStageError(lead, stage, error, now) {
  const patch = Object.assign({}, lead);
  patch[stage.errorField] = String(error && error.message ? error.message : error).slice(0, 500);
  patch.updatedAt = now;
  await wixData.update(COLLECTION, patch, { suppressAuth: true });
}

async function sendInstantIfDue(lead, now) {
  const instant = STAGES.find(stage => stage.key === 'instant');
  if (!instant || lead[instant.sentField]) return { sent: false, skipped: true, reason: 'already_sent', stage: 'instant' };
  try {
    return await sendStageEmail(lead, instant, now);
  } catch (error) {
    await markStageError(lead, instant, error, now);
    return { sent: false, stage: 'instant', reason: 'send_failed' };
  }
}

export async function saveTripPlannerLead(payload) {
  const lead = validateLeadPayload(payload);
  const contactId = await ensureContact(lead.email);
  const key = leadKey(lead.email, lead.arrivalDate);
  const now = new Date();
  const existing = await findExistingLead(key);
  const selfReportedBooked = String(lead.tourIntent || '').toLowerCase().indexOf('already booked') !== -1;

  const item = {
    leadKey: key,
    email: lead.email,
    contactId,
    arrivalDate: lead.arrivalDate,
    tripLength: lead.tripLength,
    arrivalTime: lead.arrivalTime,
    arrivalPoint: lead.arrivalPoint,
    stayArea: lead.stayArea,
    groupType: lead.groupType,
    firstTime: lead.firstTime,
    interests: lead.interests,
    budgetStyle: lead.budgetStyle,
    mustHandle: lead.mustHandle,
    pace: lead.pace,
    tourIntent: lead.tourIntent,
    planTitle: lead.planTitle,
    recommendedTourDay: lead.recommendedTourDay,
    recommendedTourDate: lead.recommendedTourDate,
    recommendedTourTime: lead.recommendedTourTime,
    meetingPointUrl: lead.meetingPointUrl,
    ticket: lead.ticket,
    weatherTitle: lead.weatherTitle,
    travelMode: lead.travelMode,
    planHealth: lead.planHealth,
    preArrivalChecklist: lead.preArrivalChecklist,
    baseBrief: lead.baseBrief,
    budgetPulse: lead.budgetPulse,
    interestLens: lead.interestLens,
    paceGuard: lead.paceGuard,
    weatherStrategy: lead.weatherStrategy,
    carryPack: lead.carryPack,
    reservationRadar: lead.reservationRadar,
    planAdvice: lead.planAdvice,
    planSwaps: lead.planSwaps,
    dayRhythm: lead.dayRhythm,
    dayIntelligence: lead.dayIntelligence,
    dayOperations: lead.dayOperations,
    arrivalWindow: lead.arrivalWindow,
    tripRisk: lead.tripRisk,
    tourRecommendation: lead.tourRecommendation,
    intentStage: lead.intentStage,
    familyOrSlow: lead.familyOrSlow,
    bookAheadNeeded: lead.bookAheadNeeded,
    conversionSignal: lead.conversionSignal,
    conversionScore: lead.conversionScore,
    conversionTier: lead.conversionTier,
    conversionNextAction: lead.conversionNextAction,
    conversionReasons: lead.conversionReasons,
    source: lead.source,
    page: lead.page,
    consent: lead.consent,
    bookingStatus: selfReportedBooked ? 'self_reported_booked' : (existing && existing.bookingStatus) || '',
    lastSignupAt: now,
    updatedAt: now
  };

  let saved;
  let created = false;

  if (existing) {
    saved = await wixData.update(
      COLLECTION,
      Object.assign({}, existing, item),
      { suppressAuth: true }
    );
  } else {
    saved = await wixData.insert(
      COLLECTION,
      Object.assign({}, item, { createdAt: now }),
      { suppressAuth: true }
    );
    created = true;
  }

  const instant = await sendInstantIfDue(saved, now);

  return {
    contactId,
    leadId: saved._id,
    created,
    updated: !created,
    instant
  };
}

function stageDueForLead(lead, stage, berlinToday, berlinHour) {
  if (!lead || stage.key === 'instant' || lead[stage.sentField]) return false;
  if (!lead.arrivalDate || stage.offset === null) return false;
  const dueDate = addDays(lead.arrivalDate, stage.offset);
  if (dueDate !== berlinToday) return false;
  const latestSignupDate = berlinDateKeyFrom(lead.lastSignupAt || lead.createdAt);
  if (latestSignupDate === berlinToday) return false;
  if (stage.key === 'dayOf' && berlinHour >= 18) return false;
  return true;
}

async function fetchDueCandidateLeads(berlinToday) {
  const latestArrivalDate = addDays(berlinToday, 7);
  let skip = 0;
  let items = [];

  while (true) {
    const page = await wixData.query(COLLECTION)
      .between('arrivalDate', berlinToday, latestArrivalDate)
      .eq('consent', true)
      .skip(skip)
      .limit(DUE_QUERY_PAGE_SIZE)
      .find({ suppressAuth: true });
    const pageItems = page.items || [];
    items = items.concat(pageItems);
    if (pageItems.length < DUE_QUERY_PAGE_SIZE) break;
    skip += pageItems.length;
  }

  return items;
}

export async function processTripPlannerDueEmails(now = new Date()) {
  const berlin = berlinNowParts(now);
  const items = await fetchDueCandidateLeads(berlin.dateKey);
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
          reason: 'send_failed',
          booked: isBookedLead(lead)
        });
        await markStageError(lead, stage, error, now);
      }
    }
  }

  return summary;
}

export async function markTripPlannerLeadBooked(payload) {
  const booking = validateBookingPayload(payload);
  let query = wixData.query(COLLECTION).eq('email', booking.email);
  if (/^\d{4}-\d{2}-\d{2}$/.test(booking.arrivalDate)) {
    query = query.eq('arrivalDate', booking.arrivalDate);
  }

  const results = await query.limit(50).find({ suppressAuth: true });
  const items = results.items || [];
  const now = new Date();
  let updated = 0;

  for (const lead of items) {
    await wixData.update(
      COLLECTION,
      Object.assign({}, lead, {
        bookedAt: now,
        bookingId: booking.bookingId,
        tourDate: booking.tourDate,
        bookingStatus: booking.bookingStatus || 'booked',
        bookingSource: booking.source,
        updatedAt: now
      }),
      { suppressAuth: true }
    );
    updated += 1;
  }

  return { matched: items.length, updated };
}
