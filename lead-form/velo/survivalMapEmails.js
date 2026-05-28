import { triggeredEmails } from 'wix-crm-backend';
import wixData from 'wix-data';

const LOG_COLLECTION = 'SurvivalMapEmailLogs';
const DIRECT_TRIGGERED_EMAILS_ENABLED = true;

// These are real Velo Developer Tools -> Triggered Emails IDs, not
// Automation action messageIds.
const SURVIVAL_MAP_WELCOME_EMAIL_ID = 'VKufY4L';
const OWNER_NOTIFICATION_EMAIL_ID = 'VKugjPv';
const OWNER_CONTACT_ID = '9e996f34-501f-4d45-8228-098680672e69';

function cleanText(value, fallback = '') {
  return String(value == null ? fallback : value).trim().slice(0, 500);
}

function cleanEmail(value) {
  return cleanText(value).toLowerCase();
}

async function sendTriggeredEmail(kind, messageId, contactId, variables) {
  try {
    await triggeredEmails.emailContact(messageId, contactId, { variables });
    console.log('[survival-map] ' + kind + ' queued for', contactId);
    return { kind, queued: true };
  } catch (error) {
    const message = error && error.message ? error.message : String(error);
    console.error('[survival-map] ' + kind + ' send failed:', message);
    return { kind, queued: false, error: message };
  }
}

function resultByKind(results, kind) {
  return results.find((item) => item.kind === kind) || null;
}

async function logEmailSend(contactId, variables, results, queued, failed, deliveryPath, note) {
  const welcome = resultByKind(results, 'subscriber welcome');
  const owner = resultByKind(results, 'owner notification');

  try {
    const inserted = await wixData.insert(
      LOG_COLLECTION,
      {
        email: variables.email,
        contactId,
        source: variables.source,
        page: variables.page,
        offer: variables.offer,
        welcomeQueued: Boolean(welcome && welcome.queued),
        ownerQueued: Boolean(owner && owner.queued),
        queuedCount: queued,
        failedCount: failed,
        welcomeError: cleanText(welcome && welcome.error),
        ownerError: cleanText(owner && owner.error),
        deliveryPath: cleanText(deliveryPath),
        note: cleanText(note),
        createdAt: new Date()
      },
      { suppressAuth: true }
    );

    console.log('[survival-map] email log inserted', inserted && inserted._id);
    return inserted && inserted._id ? inserted._id : '';
  } catch (error) {
    console.error('[survival-map] email log insert failed:', error && error.message ? error.message : error);
    return '';
  }
}

export async function sendSurvivalMapEmails(subscriberContactId, payload = {}) {
  const contactId = cleanText(subscriberContactId);
  const variables = {
    email: cleanEmail(payload.email),
    source: cleanText(payload.source),
    page: cleanText(payload.page),
    offer: cleanText(payload.offer, 'berlin-survival-map'),
    SITE_URL: 'https://www.berlinwalk.com'
  };

  const sends = [];
  const canSendDirect = Boolean(
    DIRECT_TRIGGERED_EMAILS_ENABLED &&
    SURVIVAL_MAP_WELCOME_EMAIL_ID &&
    OWNER_NOTIFICATION_EMAIL_ID
  );

  if (!canSendDirect) {
    const results = [
      {
        kind: 'subscriber welcome',
        queued: Boolean(contactId),
        mode: 'automation_label_trigger'
      },
      {
        kind: 'owner notification',
        queued: Boolean(contactId),
        mode: 'automation_label_trigger'
      }
    ];
    const queued = results.filter((item) => item.queued).length;
    const failed = results.length - queued;
    const logId = await logEmailSend(
      contactId,
      variables,
      results,
      queued,
      failed,
      'automation_label_trigger',
      'Logged by Velo; delivery handled by active Wix label-trigger automations.'
    );

    return {
      queued,
      failed,
      logId,
      results
    };
  }

  if (contactId) {
    sends.push(
      sendTriggeredEmail(
        'subscriber welcome',
        SURVIVAL_MAP_WELCOME_EMAIL_ID,
        contactId,
        variables
      )
    );
  } else {
    console.warn('[survival-map] no subscriber contactId, skipping welcome email');
  }

  sends.push(
    sendTriggeredEmail(
      'owner notification',
      OWNER_NOTIFICATION_EMAIL_ID,
      OWNER_CONTACT_ID,
      variables
    )
  );

  const results = await Promise.all(sends);
  const queued = results.filter((item) => item.queued).length;
  const logId = await logEmailSend(
    contactId,
    variables,
    results,
    queued,
    results.length - queued,
    'direct_triggered_email',
    ''
  );

  return {
    queued,
    failed: results.length - queued,
    logId,
    results
  };
}
