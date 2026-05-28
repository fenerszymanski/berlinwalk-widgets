import { triggeredEmails } from 'wix-crm-backend';

const SURVIVAL_MAP_WELCOME_MESSAGE_ID = '46a631f2-156e-4f14-9a8c-49d26fd97990';
const OWNER_NOTIFICATION_MESSAGE_ID = '2fb9b51f-91cd-4705-9967-178f861df727';
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

export async function sendSurvivalMapEmails(subscriberContactId, payload = {}) {
  const contactId = cleanText(subscriberContactId);
  const variables = {
    email: cleanEmail(payload.email),
    source: cleanText(payload.source),
    page: cleanText(payload.page),
    offer: cleanText(payload.offer, 'berlin-survival-map')
  };

  const sends = [];

  if (contactId) {
    sends.push(
      sendTriggeredEmail(
        'subscriber welcome',
        SURVIVAL_MAP_WELCOME_MESSAGE_ID,
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
      OWNER_NOTIFICATION_MESSAGE_ID,
      OWNER_CONTACT_ID,
      variables
    )
  );

  const results = await Promise.all(sends);
  const queued = results.filter((item) => item.queued).length;

  return {
    queued,
    failed: results.length - queued,
    results
  };
}
