import { ok, badRequest, serverError, response } from 'wix-http-functions';
import { saveFirstDayPlannerLead } from 'backend/firstDayPlannerFunnel';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export function options_firstDayPlannerLead(request) {
  return response({
    status: 204,
    headers: CORS_HEADERS
  });
}

export async function post_firstDayPlannerLead(request) {
  let payload;
  try {
    payload = await request.body.json();
  } catch (error) {
    return badRequest({
      headers: CORS_HEADERS,
      body: { ok: false, error: 'invalid_json' }
    });
  }

  try {
    const result = await saveFirstDayPlannerLead(payload);
    return ok({
      headers: CORS_HEADERS,
      body: {
        ok: true,
        contactId: result.contactId,
        leadId: result.leadId,
        created: result.created,
        updated: result.updated
      }
    });
  } catch (error) {
    const code = error && error.code ? error.code : 'server_error';
    if (code === 'invalid_payload') {
      return badRequest({
        headers: CORS_HEADERS,
        body: { ok: false, error: code, details: error.message }
      });
    }

    console.error('firstDayPlannerLead failed', error);
    return serverError({
      headers: CORS_HEADERS,
      body: { ok: false, error: code }
    });
  }
}
