export const LOCATION_ENDPOINT = 'https://app.berlinwalk.com/api?route=berlin-location';
export const LOCATION_CONTRACT_VERSION = '20260829a';

const INPUT_PATTERN = /^[\p{L}\p{N}\s.,'\-]+$/u;
const HOUSE_NUMBER_PATTERN = /(?:^|\s)(\d{1,3})([a-zA-Z])?$/;

export class LocationAdapterError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'LocationAdapterError';
    this.code = code;
  }
}

export function normaliseAddressInput(value) {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (!text) throw new LocationAdapterError('empty_input', 'Enter a Berlin address first.');
  if (text.length < 3) throw new LocationAdapterError('short_input', 'Add a street or place name.');
  if (text.length > 80 || !INPUT_PATTERN.test(text)) {
    throw new LocationAdapterError('invalid_input', 'Use a Berlin street, house number and optional postcode.');
  }
  return text;
}

export function splitBerlinAddress(value) {
  const text = normaliseAddressInput(value);
  const beforeComma = text.split(',')[0].trim();
  const addressOnly = beforeComma
    .replace(/\s+\d{5}\s+Berlin$/iu, '')
    .replace(/\s+Berlin$/iu, '')
    .trim();
  const match = addressOnly.match(HOUSE_NUMBER_PATTERN);
  if (!match) return { query: addressOnly, houseNumber: null };
  const street = addressOnly.slice(0, match.index).trim();
  if (street.length < 3) return { query: addressOnly, houseNumber: null };
  return {
    query: street,
    houseNumber: {
      number: match[1],
      ...(match[2] ? { suffix: match[2].toUpperCase() } : {}),
    },
  };
}

export function buildLocationRequest(value) {
  const parsed = splitBerlinAddress(value);
  return parsed.houseNumber
    ? { query: parsed.query, houseNumber: `${parsed.houseNumber.number}${parsed.houseNumber.suffix || ''}` }
    : { query: parsed.query };
}

export async function searchBerlinAddress(value, {
  fetchImpl = globalThis.fetch,
  endpoint = LOCATION_ENDPOINT,
  signal,
} = {}) {
  const body = buildLocationRequest(value);
  if (typeof fetchImpl !== 'function') {
    throw new LocationAdapterError('fetch_unavailable', 'Address search is unavailable in this browser.');
  }

  let response;
  try {
    response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error?.name === 'AbortError') throw new LocationAdapterError('aborted', 'Address search was cancelled.');
    throw new LocationAdapterError('network', 'The Berlin address service could not be reached.');
  }

  if (!response?.ok) {
    const status = Number(response?.status || 0);
    const code = status === 429 ? 'rate_limited' : status >= 500 ? 'service_unavailable' : 'service_error';
    throw new LocationAdapterError(code, 'The Berlin address service is temporarily unavailable.');
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new LocationAdapterError('invalid_response', 'The Berlin address service returned an unreadable response.');
  }
  if (payload?.ok !== true || payload?.contractVersion !== LOCATION_CONTRACT_VERSION || !Array.isArray(payload.candidates)) {
    throw new LocationAdapterError('contract_mismatch', 'The Berlin address service is not ready for this tool.');
  }
  return {
    ok: true,
    candidates: payload.candidates.slice(0, 3),
    ambiguous: Boolean(payload.ambiguous),
    datasetVersion: String(payload.datasetVersion || ''),
    checkedAt: String(payload.checkedAt || ''),
  };
}
