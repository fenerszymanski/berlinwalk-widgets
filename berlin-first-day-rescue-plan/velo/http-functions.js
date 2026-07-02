import { ok, badRequest, serverError, response } from 'wix-http-functions';
import { sendRescuePlanEmail } from 'backend/rescuePlanEmail';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://berlinwalk-content-app.vercel.app',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

function headerValue(request, name) {
  const headers = request && request.headers ? request.headers : {};
  return headers[name] || headers[name.toLowerCase()] || headers[name.toUpperCase()] || '';
}

export function options_rescuePlanEmail(request) {
  return response({
    status: 204,
    headers: CORS_HEADERS
  });
}

export async function post_rescuePlanEmail(request) {
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
    const result = await sendRescuePlanEmail(payload, headerValue(request, 'authorization'));
    return ok({
      headers: CORS_HEADERS,
      body: { ok: true, sent: result.sent, contactId: result.contactId }
    });
  } catch (error) {
    const code = error && error.code ? error.code : 'server_error';
    if (code === 'invalid_payload') {
      return badRequest({
        headers: CORS_HEADERS,
        body: { ok: false, error: code, details: error.message }
      });
    }
    if (code === 'forbidden') {
      return response({
        status: 403,
        headers: CORS_HEADERS,
        body: { ok: false, error: code }
      });
    }

    console.error('rescuePlanEmail failed', error);
    return serverError({
      headers: CORS_HEADERS,
      body: { ok: false, error: code }
    });
  }
}
