import { getSecret } from 'wix-secrets-backend';
import { fetch } from 'wix-fetch';

// Canonical source for the hourly Wix scheduled-job bridge. The live site
// currently exports this function from Backend/http-functions.js so it can
// share that already-published backend file.
export async function processHistoryLeadDueEmails() {
  const secret = String(await getSecret('HISTORY_LEAD_CRON_SECRET') || '').trim();
  if (!secret) throw new Error('HISTORY_LEAD_CRON_SECRET is missing');

  const endpoint = 'https://app.berlinwalk.com/api/history-lead?action=sendDue';
  const result = await fetch(endpoint, {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + secret,
      Accept: 'application/json'
    }
  });
  const text = await result.text();
  if (!result.ok) throw new Error('History lead cron failed with status ' + result.status);

  let payload = {};
  try {
    payload = JSON.parse(text || '{}');
  } catch (error) {
    throw new Error('History lead cron returned invalid JSON');
  }

  return {
    ok: payload.ok === true,
    inspected: Number(payload.inspected || 0),
    sent: Number(payload.sent || 0),
    failed: Number(payload.failed || 0),
    bookingRead: String(payload.bookingRead || '')
  };
}
