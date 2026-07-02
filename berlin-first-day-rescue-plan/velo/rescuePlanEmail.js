import { contacts, triggeredEmails } from 'wix-crm-backend';
import { getSecret } from 'wix-secrets-backend';

const CONTACT_LABEL = 'Berlin First-Day Rescue Plan Customer';
const MESSAGE_ID_SECRET = 'RESCUE_PLAN_EMAIL_MESSAGE_ID';
const WEBHOOK_SECRET = 'RESCUE_EMAIL_WEBHOOK_SECRET';

function invalidPayload(message) {
  const error = new Error(message);
  error.code = 'invalid_payload';
  return error;
}

function forbidden() {
  const error = new Error('forbidden');
  error.code = 'forbidden';
  return error;
}

function configError(message) {
  const error = new Error(message);
  error.code = 'config_error';
  return error;
}

function cleanText(value, fallback = '', maxLength = 900) {
  return String(value == null ? fallback : value).trim().slice(0, maxLength);
}

function normalizeEmail(value) {
  return cleanText(value, '', 180).toLowerCase();
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizeEmail(value));
}

async function readSecret(name) {
  try {
    return cleanText(await getSecret(name), '', 1000);
  } catch (error) {
    return '';
  }
}

function suppliedBearer(authorizationHeader) {
  return cleanText(authorizationHeader, '', 1200).replace(/^Bearer\s+/i, '').trim();
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
  if (!contactId) throw configError('contact_not_created');

  try {
    const labelResult = await contacts.findOrCreateLabel(CONTACT_LABEL, { suppressAuth: true });
    const labelKey = labelKeyFrom(labelResult);
    if (labelKey) await contacts.labelContact(contactId, [labelKey], { suppressAuth: true });
  } catch (error) {
    console.warn('Rescue Plan contact label failed', error);
  }

  return contactId;
}

function emailVariables(email) {
  return {
    planUrl: cleanText(email.planUrl, '', 900),
    firstMove: cleanText(email.firstMove || email.firstTitle, 'Start with one clear first move', 180),
    orderId: cleanText(email.orderId, '', 140),
    preheader: cleanText(email.preheader, 'Open your mobile plan and keep the first hours simple.', 180),
    officialCheckNote: 'This is a short arrival rescue, not a full itinerary or a guarantee of live opening hours. Check official links inside the plan for current details.',
    supportNote: 'If the link does not open, reply to this email with your order reference and I will help.'
  };
}

export async function sendRescuePlanEmail(payload, authorizationHeader = '') {
  const expectedSecret = await readSecret(WEBHOOK_SECRET);
  if (expectedSecret && suppliedBearer(authorizationHeader) !== expectedSecret) {
    throw forbidden();
  }

  const email = payload && payload.email ? payload.email : {};
  const recipient = normalizeEmail(email.to || payload.to || payload.customerEmail);
  if (!validEmail(recipient)) throw invalidPayload('missing_or_invalid_recipient');

  const messageId = await readSecret(MESSAGE_ID_SECRET);
  if (!messageId) throw configError('missing_rescue_plan_email_message_id');

  const contactId = await ensureContact(recipient);
  await triggeredEmails.emailContact(messageId, contactId, {
    variables: emailVariables(email)
  });

  return {
    sent: true,
    contactId
  };
}
