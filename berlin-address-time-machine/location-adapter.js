export const LOCATION_ENDPOINT = 'https://app.berlinwalk.com/api?route=berlin-location';
export const LOCATION_CONTRACT_VERSION = '20260829a';

const QUERY_PATTERN = /^[\p{L}\p{N}\s.'’-]+$/u;
const HOUSE_NUMBER_PATTERN = /(?:^|\s)(\d{1,4})([a-zA-Z])?$/;

export class LocationAdapterError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'LocationAdapterError';
    this.code = code;
  }
}

export function normaliseAddressInput(value) {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (!text) {
    throw new LocationAdapterError('empty_input', 'Enter a Berlin street or place name first.');
  }
  if (text.length < 3) {
    throw new LocationAdapterError('short_input', 'Add a little more detail, such as a street name.');
  }
  if (text.length > 80 || !QUERY_PATTERN.test(text)) {
    throw new LocationAdapterError('invalid_input', 'Use letters, numbers, spaces, dots, apostrophes or hyphens.');
  }
  return text;
}

export function splitHouseNumber(value) {
  const text = normaliseAddressInput(value);
  const match = text.match(HOUSE_NUMBER_PATTERN);
  if (!match) return { query: text, houseNumber: null };
  const street = text.slice(0, match.index).trim();
  if (street.length < 3) return { query: text, houseNumber: null };
  return {
    query: street,
    houseNumber: {
      number: match[1],
      ...(match[2] ? { suffix: match[2].toUpperCase() } : {}),
    },
  };
}

export function buildLocationRequest(value) {
  const parsed = splitHouseNumber(value);
  return parsed.houseNumber
    ? { query: parsed.query, houseNumber: `${parsed.houseNumber.number}${parsed.houseNumber.suffix || ''}` }
    : { query: parsed.query };
}

function finiteCoordinate(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function candidateFromPayload(candidate) {
  const lat = Number(candidate?.lat);
  const lon = Number(candidate?.lon);
  if (!finiteCoordinate(lat) || !finiteCoordinate(lon)) return null;
  const street = String(candidate.street || '').trim();
  const houseNumber = String(candidate.houseNumber || '').trim();
  const houseNumberSuffix = String(candidate.houseNumberSuffix || '').trim();
  const postcode = String(candidate.postcode || '').trim();
  const district = String(candidate.district || '').trim();
  const locality = String(candidate.locality || 'Berlin').trim() || 'Berlin';
  if (!street || !houseNumber) return null;
  return {
    street,
    houseNumber,
    houseNumberSuffix,
    postcode,
    district,
    locality,
    lat,
    lon,
  };
}

export function displayCandidate(candidate) {
  if (!candidate) return '';
  const number = `${candidate.houseNumber}${candidate.houseNumberSuffix || ''}`;
  const locality = [candidate.postcode, candidate.locality].filter(Boolean).join(' ');
  return `${candidate.street} ${number}${locality ? `, ${locality}` : ''}`;
}

export async function searchBerlinAddress(value, {
  fetchImpl = globalThis.fetch,
  endpoint = LOCATION_ENDPOINT,
  signal,
} = {}) {
  const body = buildLocationRequest(value);
  if (typeof fetchImpl !== 'function') {
    throw new LocationAdapterError('fetch_unavailable', 'The address search is not available in this browser.');
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
    if (error?.name === 'AbortError') {
      throw new LocationAdapterError('aborted', 'The address search was cancelled.');
    }
    throw new LocationAdapterError('network', 'I could not reach the Berlin address service. You can still choose a map point.');
  }

  if (!response || !response.ok) {
    const status = Number(response?.status);
    const code = status === 429 ? 'rate_limited' : status >= 500 ? 'service_unavailable' : 'service_error';
    throw new LocationAdapterError(code, 'The Berlin address service is temporarily unavailable. You can still choose a map point.');
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new LocationAdapterError('invalid_response', 'The Berlin address service returned an unreadable response.');
  }

  if (payload?.ok !== true || payload?.contractVersion !== LOCATION_CONTRACT_VERSION) {
    throw new LocationAdapterError('contract_mismatch', 'The Berlin address service is not ready for this tool yet.');
  }

  const candidates = Array.isArray(payload.candidates)
    ? payload.candidates.map(candidateFromPayload).filter(Boolean).slice(0, 3)
    : [];
  return {
    candidates,
    ambiguous: Boolean(payload.ambiguous) || candidates.length > 1,
    datasetVersion: String(payload.datasetVersion || ''),
    checkedAt: String(payload.checkedAt || ''),
  };
}
