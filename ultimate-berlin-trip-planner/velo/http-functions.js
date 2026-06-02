import { ok, badRequest, serverError, response } from 'wix-http-functions';
import { saveTripPlannerLead, markTripPlannerLeadBooked, enhanceTripPlannerPlan } from 'backend/tripPlannerFunnel';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export function options_tripPlannerLead(request) {
  return response({
    status: 204,
    headers: CORS_HEADERS
  });
}

export async function post_tripPlannerLead(request) {
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
    const result = await saveTripPlannerLead(payload);
    return ok({
      headers: CORS_HEADERS,
      body: {
        ok: true,
        contactId: result.contactId,
        leadId: result.leadId,
        created: result.created,
        updated: result.updated,
        instant: result.instant
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

    console.error('tripPlannerLead failed', error);
    return serverError({
      headers: CORS_HEADERS,
      body: { ok: false, error: code }
    });
  }
}

export function options_tripPlannerAi(request) {
  return response({
    status: 204,
    headers: CORS_HEADERS
  });
}

export async function post_tripPlannerAi(request) {
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
    const result = await enhanceTripPlannerPlan(payload);
    return ok({
      headers: CORS_HEADERS,
      body: result
    });
  } catch (error) {
    const code = error && error.code ? error.code : 'server_error';
    if (code === 'invalid_payload') {
      return badRequest({
        headers: CORS_HEADERS,
        body: { ok: false, error: code, details: error.message }
      });
    }

    console.error('tripPlannerAi failed', error);
    return serverError({
      headers: CORS_HEADERS,
      body: { ok: false, error: code }
    });
  }
}

export function options_tripPlannerBooking(request) {
  return response({
    status: 204,
    headers: CORS_HEADERS
  });
}

export async function post_tripPlannerBooking(request) {
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
    const result = await markTripPlannerLeadBooked(payload);
    return ok({
      headers: CORS_HEADERS,
      body: {
        ok: true,
        matched: result.matched,
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

    console.error('tripPlannerBooking failed', error);
    return serverError({
      headers: CORS_HEADERS,
      body: { ok: false, error: code }
    });
  }
}
