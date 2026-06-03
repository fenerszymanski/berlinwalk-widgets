import wixData from 'wix-data';
import { contacts, triggeredEmails } from 'wix-crm-backend';
import { getSecret } from 'wix-secrets-backend';
import { fetch } from 'wix-fetch';

const COLLECTION = 'TripPlannerLeads';
const CONTACT_LABEL = 'Ultimate Berlin Trip Planner Lead';
const TIMEZONE = 'Europe/Berlin';
const BOOKING_SHORT_URL = 'https://www.berlinwalk.com/book';
const DUE_QUERY_PAGE_SIZE = 100;
const GEMINI_API_ROOT = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_DEFAULT_MODEL = 'gemini-2.5-flash';
const GEMINI_API_KEY_SECRET_NAMES = ['GEMINI_API_KEY', 'GOOGLE_AI_API_KEY', 'GOOGLE_GEMINI_API_KEY'];
const GEMINI_MODEL_SECRET_NAMES = ['TRIP_PLANNER_GEMINI_MODEL', 'GEMINI_MODEL'];
const AI_GENERATION_LIMIT = 2;
const PRIVATE_TEXT_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

const STAGES = [
  {
    key: 'instant',
    offset: null,
    sentField: 'sentInstantAt',
    errorField: 'instantError',
    messageId: 'VLDqhLM'
  },
  {
    key: 'minus7',
    offset: -7,
    sentField: 'sentMinus7At',
    errorField: 'minus7Error',
    messageId: 'VLDvLj8'
  },
  {
    key: 'minus3',
    offset: -3,
    sentField: 'sentMinus3At',
    errorField: 'minus3Error',
    messageId: 'VLDvnng'
  },
  {
    key: 'minus1',
    offset: -1,
    sentField: 'sentMinus1At',
    errorField: 'minus1Error',
    messageId: 'VLDwKUu'
  },
  {
    key: 'dayOf',
    offset: 0,
    sentField: 'sentDayOfAt',
    errorField: 'dayOfError',
    messageId: 'VLDwjZc'
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
    tripStyle: cleanText(payload.tripStyle, 'Custom mix'),
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

function cleanList(values, maxItems = 12, maxLength = 140) {
  if (!Array.isArray(values)) return [];
  return values
    .map(value => cleanText(value, '', maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function cleanRecord(source, fields, maxLength = 220) {
  const item = {};
  fields.forEach(field => {
    const value = cleanText(source && source[field], '', maxLength);
    if (value) item[field] = value;
  });
  return item;
}

function cleanPublicPlannerText(value, fallback = '', maxLength = 800) {
  const text = cleanText(value, fallback, maxLength);
  if (PRIVATE_TEXT_PATTERN.test(text)) return '';
  return text;
}

function cleanPublicPlannerList(values, maxItems = 12, maxLength = 140) {
  if (!Array.isArray(values)) return [];
  return values
    .map(value => cleanPublicPlannerText(value, '', maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function cleanPublicPlannerRecord(source, fields, maxLength = 220) {
  const item = {};
  fields.forEach(field => {
    const value = cleanPublicPlannerText(source && source[field], '', maxLength);
    if (value) item[field] = value;
  });
  return item;
}

function validateAiEnhancementPayload(payload) {
  const plan = payload && payload.plan;
  const days = Array.isArray(plan && plan.days) ? plan.days : [];
  if (!plan || !days.length) throw invalidPayload('plan.days are required');

  return {
    inputs: cleanPublicPlannerRecord(payload && payload.inputs, [
      'arrivalDate',
      'tripLength',
      'arrivalTime',
      'arrivalPoint',
      'stayArea',
      'groupType',
      'firstTime',
      'interests',
      'budgetStyle',
      'mustHandle',
      'pace',
      'tourIntent'
    ]),
    weather: cleanPublicPlannerRecord(payload && payload.weather, ['title', 'mode', 'copy', 'advice', 'tripSummary']),
    tourSlot: cleanPublicPlannerRecord(payload && payload.tourSlot, ['dayLabel', 'dateLabel', 'timeLabel', 'booked']),
    plan: {
      title: cleanPublicPlannerText(plan.title, 'Ultimate Berlin Trip Plan', 180),
      summary: cleanPublicPlannerText(plan.summary, '', 650),
      ticket: cleanPublicPlannerText(plan.ticket, '', 160),
      tourFit: cleanPublicPlannerText(plan.tourFit, '', 160),
      arrivalStatus: cleanPublicPlannerText(plan.arrivalStatus, '', 160),
      days: days.slice(0, 7).map(day => ({
        dayNumber: cleanNumber(day && day.dayNumber, 1, 1, 7),
        date: cleanPublicPlannerText(day && day.date, '', 80),
        title: cleanPublicPlannerText(day && day.title, '', 180),
        theme: cleanPublicPlannerText(day && day.theme, '', 160),
        places: cleanPublicPlannerList(day && day.places, 6, 120),
        blocks: Array.isArray(day && day.blocks)
          ? day.blocks.slice(0, 6).map(block => ({
            time: cleanPublicPlannerText(block && block.time, '', 80),
            title: cleanPublicPlannerText(block && block.title, '', 180),
            copy: cleanPublicPlannerText(block && block.copy, '', 280)
          }))
          : [],
        risks: cleanPublicPlannerList(day && day.risks, 6, 80)
      }))
    }
  };
}

async function readFirstSecret(names) {
  for (const name of names) {
    try {
      const value = cleanText(await getSecret(name), '', 2000);
      if (value) return value;
    } catch (error) {
      // Missing secrets throw in Wix; try the next accepted name.
    }
  }
  return '';
}

function geminiResponseSchema() {
  return {
    type: 'object',
    properties: {
      noteTitle: { type: 'string' },
      routeIntro: { type: 'string' },
      dayStories: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            dayNumber: { type: 'number' },
            text: { type: 'string' }
          },
          required: ['dayNumber', 'text']
        }
      },
      weatherSentence: { type: 'string' },
      tourSentence: { type: 'string' },
      chips: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            label: { type: 'string' },
            value: { type: 'string' }
          },
          required: ['label', 'value']
        }
      }
    },
    required: ['noteTitle', 'routeIntro', 'dayStories', 'weatherSentence', 'tourSentence', 'chips']
  };
}

function geminiPrompt(input) {
  return [
    'You are writing a short personalized route story for BerlinWalk.',
    'The itinerary logic is already decided. Do not move days, change times, invent venues, add new map stops, or create new CTAs.',
    'Use only the provided day titles, themes, timing blocks, places, weather notes, and risk tags.',
    'Do not add new neighborhoods, meals, safety warnings, ticket claims, booking advice, or attraction names that are not in the input.',
    'Write in warm, human English in the voice of Yusuf, the local guide. It should feel like a thoughtful route read after seeing this exact plan, not a template.',
    'Avoid technical planner terms, hype, generic travel philosophy, "if the slot fits", "one area per day" as a repeated slogan, and em dashes.',
    'noteTitle must be a short human title for the route rhythm, not a marketing headline.',
    'routeIntro must be one natural paragraph, 55-85 words, summarizing the whole route with at least two concrete details from the itinerary input.',
    'dayStories must include exactly one item for every input.plan.days item. Each text must be 18-34 words, storytelling-style, and must mention a real day detail from that day.',
    'weatherSentence must be one compact useful sentence based on weather.tripSummary or weather notes. Keep it shorter than the routeIntro.',
    'If input.tourSlot has a date/time and is not booked, tourSentence must naturally name the BerlinWalk day/time using the provided slot. If booked, switch to meeting-point/prep language.',
    'chips should contain 2 or 3 short human cues such as Best rhythm, Weather move, Tour anchor, or Energy guard. Do not repeat the same wording every time.',
    '',
    'Return valid JSON only matching the requested schema. Do not use markdown.',
    '',
    'Planner input:',
    JSON.stringify(input)
  ].join('\n');
}

function extractGeminiText(parsed) {
  const candidates = parsed && parsed.candidates;
  const parts = candidates && candidates[0] && candidates[0].content && candidates[0].content.parts;
  if (!Array.isArray(parts)) return '';
  return parts.map(part => cleanText(part && part.text, '', 5000)).filter(Boolean).join('\n');
}

function parseJsonText(text) {
  const raw = cleanText(text, '', 12000);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (error) {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw error;
    return JSON.parse(match[0]);
  }
}

function sanitizeAiEnhancement(data, input, model, usage) {
  const validDays = {};
  input.plan.days.forEach(day => {
    validDays[day.dayNumber] = true;
  });

  const dayStories = Array.isArray(data && data.dayStories)
    ? data.dayStories.map(item => ({
      dayNumber: cleanNumber(item && item.dayNumber, 0, 0, 7),
      text: cleanText(item && item.text, '', 220)
    })).filter(item => validDays[item.dayNumber] && item.text).slice(0, input.plan.days.length)
    : [];

  return {
    provider: 'gemini',
    model,
    noteTitle: cleanText(data && (data.noteTitle || data.headline), 'Yusuf guide read', 90),
    routeIntro: cleanText(data && (data.routeIntro || data.guideNote || data.localRead), '', 620),
    dayStories,
    weatherSentence: cleanText(data && data.weatherSentence, '', 220),
    tourSentence: cleanText(data && (data.tourSentence || data.tourNote), '', 220),
    chips: Array.isArray(data && data.chips)
      ? data.chips.map(item => ({
        label: cleanText(item && item.label, '', 34),
        value: cleanText(item && item.value, '', 90)
      })).filter(item => item.label && item.value).slice(0, 3)
      : [],
    headline: cleanText(data && data.headline, 'Local guide read', 90),
    localRead: cleanText(data && data.localRead, '', 420),
    watchOut: cleanText(data && data.watchOut, '', 280),
    tourNote: cleanText(data && data.tourNote, '', 220),
    usage: {
      promptTokens: cleanNumber(usage && usage.promptTokenCount, 0, 0, 100000),
      outputTokens: cleanNumber(usage && usage.candidatesTokenCount, 0, 0, 100000),
      totalTokens: cleanNumber(usage && usage.totalTokenCount, 0, 0, 100000)
    }
  };
}

function aiQuotaIdentity(payload, input) {
  const email = normalizeEmail(payload && (payload.quotaEmail || payload.email));
  const arrivalDate = cleanText(input && input.inputs && input.inputs.arrivalDate);
  if (!validEmail(email) || !/^\d{4}-\d{2}-\d{2}$/.test(arrivalDate)) {
    return { ok: false, email: '', arrivalDate: '', leadKey: '' };
  }
  return {
    ok: true,
    email,
    arrivalDate,
    leadKey: leadKey(email, arrivalDate)
  };
}

async function claimAiQuota(payload, input, now) {
  const identity = aiQuotaIdentity(payload, input);
  if (!identity.ok) {
    return {
      ok: false,
      reason: 'ai_quota_email_required',
      quota: { limit: AI_GENERATION_LIMIT, used: 0, remaining: 0 }
    };
  }

  const existing = await findExistingLead(identity.leadKey);
  if (!existing) {
    return {
      ok: false,
      reason: 'ai_quota_lead_not_found',
      quota: { limit: AI_GENERATION_LIMIT, used: 0, remaining: 0 }
    };
  }

  const used = cleanNumber(existing.aiRequestCount, 0, 0, 1000);
  if (used >= AI_GENERATION_LIMIT) {
    if (!existing.aiLimitReachedAt) {
      await wixData.update(
        COLLECTION,
        Object.assign({}, existing, { aiLimitReachedAt: now, updatedAt: now }),
        { suppressAuth: true }
      );
    }
    return {
      ok: false,
      reason: 'ai_quota_limit',
      quota: { limit: AI_GENERATION_LIMIT, used, remaining: 0 }
    };
  }

  const nextUsed = used + 1;
  await wixData.update(
    COLLECTION,
    Object.assign({}, existing, {
      aiRequestCount: nextUsed,
      aiLastRequestedAt: now,
      updatedAt: now
    }),
    { suppressAuth: true }
  );

  return {
    ok: true,
    quota: {
      limit: AI_GENERATION_LIMIT,
      used: nextUsed,
      remaining: Math.max(0, AI_GENERATION_LIMIT - nextUsed)
    }
  };
}

export async function enhanceTripPlannerPlan(payload) {
  const input = validateAiEnhancementPayload(payload);
  const apiKey = await readFirstSecret(GEMINI_API_KEY_SECRET_NAMES);
  if (!apiKey) {
    return { ok: false, reason: 'missing_api_key' };
  }

  const now = new Date();
  const quota = await claimAiQuota(payload, input, now);
  if (!quota.ok) {
    return {
      ok: false,
      reason: quota.reason,
      quota: quota.quota
    };
  }

  const requestedModel = await readFirstSecret(GEMINI_MODEL_SECRET_NAMES);
  const model = requestedModel || GEMINI_DEFAULT_MODEL;
  const url = `${GEMINI_API_ROOT}/${encodeURIComponent(model)}:generateContent`;

  try {
    const geminiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: 'You improve traveler-facing copy for BerlinWalk while preserving deterministic itinerary logic exactly.'
          }]
        },
        contents: [{
          role: 'user',
          parts: [{ text: geminiPrompt(input) }]
        }],
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 1200,
          thinkingConfig: {
            thinkingBudget: 0
          },
          responseMimeType: 'application/json',
          responseJsonSchema: geminiResponseSchema()
        }
      })
    });

    const text = await geminiResponse.text();
    let parsed = {};
    try {
      parsed = text ? JSON.parse(text) : {};
    } catch (error) {
      parsed = {};
    }

    if (!geminiResponse.ok) {
      return {
        ok: false,
        reason: 'api_error',
        status: geminiResponse.status,
        message: cleanText(parsed && (parsed.error && parsed.error.message || parsed.message) || text, '', 500)
      };
    }

    const modelText = extractGeminiText(parsed);
    const enhancement = sanitizeAiEnhancement(parseJsonText(modelText), input, model, parsed.usageMetadata || {});
    if (!enhancement.routeIntro && !enhancement.dayStories.length) {
      return { ok: false, reason: 'empty_ai_result', model };
    }

    return {
      ok: true,
      enhancement,
      quota: quota.quota
    };
  } catch (error) {
    return {
      ok: false,
      reason: 'network_or_parse_error',
      message: cleanText(error && error.message ? error.message : error, '', 500)
    };
  }
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
  const raw = stage.messageId;
  return raw && raw.indexOf('TODO_') !== 0 ? raw : '';
}

function shouldSuppressUltimateReminder(lead, stage) {
  return Boolean(stage && stage.key !== 'instant' && isBookedLead(lead));
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
    tripStyle: String(lead.tripStyle || ''),
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
  if (shouldSuppressUltimateReminder(lead, stage)) {
    return {
      sent: false,
      skipped: true,
      reason: 'booked_existing_sequence',
      stage: stage.key,
      booked: true
    };
  }

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
    tripStyle: lead.tripStyle,
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
  if (shouldSuppressUltimateReminder(lead, stage)) return false;
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
