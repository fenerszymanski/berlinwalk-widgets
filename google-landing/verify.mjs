import fs from 'node:fs/promises';

const source = await fs.readFile(new URL('./google-landing-element.js', import.meta.url), 'utf8');
const required = [
  'Free Berlin Walking Tour in English',
  'English Walking Tour in Berlin',
  'bw_booking_page_view',
  'bw_booking_pick_date_click',
  'bw_booking_slot_select',
  'bw_booking_next_click',
  'bwBookingFunnelEvent',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'gbraid',
  'wbraid',
  'color: var(--green-ink) !important',
];

const missing = required.filter((marker) => !source.includes(marker));
if (missing.length) throw new Error(`Missing required markers: ${missing.join(', ')}`);
if (source.includes('1h45')) throw new Error('Forbidden tour duration found');
if (source.includes('—') || source.includes('–')) throw new Error('Em/en dash found');
if (source.includes('sessionStorage') || source.includes('localStorage')) {
  throw new Error('Pre-consent client storage found');
}

const endpoint = new URL('https://berlinwalk-content-app.vercel.app/api/booking-calendar-availability');
endpoint.searchParams.set('days', '30');
endpoint.searchParams.set('guests', '1');
const response = await fetch(endpoint);
const data = await response.json();
if (!response.ok) throw new Error(data.error || `Availability HTTP ${response.status}`);
if (!Array.isArray(data.slots) || !data.slots.length) throw new Error('No live availability slots');

const first = data.slots[0];
for (const field of ['startDate', 'sessionId', 'serviceId', 'locationId', 'timezone']) {
  if (!first[field]) throw new Error(`First live slot is missing ${field}`);
}

console.log(JSON.stringify({
  ok: true,
  sourceMarkers: required.length,
  liveSlots: data.slots.length,
  firstSlot: {
    startDate: first.startDate,
    timezone: first.timezone,
    locationName: first.locationName,
  },
}, null, 2));
