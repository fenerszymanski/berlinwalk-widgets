/*
 * BerlinWalk custom Booking Calendar page Velo kit.
 *
 * Page element needed:
 * - Custom Element ID: #bwBookingCalendar
 * - Tag name: bw-booking-calendar
 * - Source URL after push:
 *   https://fenerszymanski.github.io/berlinwalk-widgets/booking-calendar/booking-calendar-element.js
 *
 * This page replaces the native Wix Booking Calendar page. It keeps Wix's
 * Booking Form and confirmation flow intact.
 *
 * 2026-06-01 API note:
 * Wix's Custom Booking Calendar page article still shows
 * `availabilityCalendar.queryAvailability()`, but the newer Bookings Time Slots
 * V2 docs say Availability Calendar is being replaced. Treat this file as a
 * live POC scaffold. If `queryAvailability()` is unavailable on the site,
 * replace `loadSlots()` with the Time Slots V2 flow (for group/class sessions:
 * List Event Time Slots, then route the selected event/session to Booking Form).
 */

import wixWindowFrontend from 'wix-window-frontend';
import wixLocation from 'wix-location';
import { availabilityCalendar } from 'wix-bookings.v2';

const CALENDAR_ELEMENT_ID = '#bwBookingCalendar';
const BOOKING_FORM_PATH = '/booking-form';
const TIMEZONE = 'Europe/Berlin';
const DAYS_TO_LOAD = 14;

let normalizedSlots = [];

$w.onReady(async function () {
  const calendar = $w(CALENDAR_ELEMENT_ID);

  calendar.setAttribute('loading', 'true');
  calendar.setAttribute('service-title', 'Pick your tour date');
  calendar.setAttribute('default-guests', '2');
  calendar.setAttribute('max-guests', '8');
  calendar.setAttribute('cta-label', 'Continue to form');

  try {
    const pageData = await wixWindowFrontend.getAppPageData();
    const service = pageData?.service;
    const serviceId = service?.id;

    if (!serviceId) {
      throw new Error('No service was found for this Booking Calendar page.');
    }

    calendar.setAttribute('service-title', 'Pick your tour date');
    normalizedSlots = await loadSlots(serviceId);

    calendar.setAttribute('availability-json', JSON.stringify(normalizedSlots));
    calendar.setAttribute('loading', '');
  } catch (error) {
    calendar.setAttribute('loading', '');
    calendar.setAttribute('error-message', 'Could not load live availability. Please try again in a moment.');
    console.error('BerlinWalk booking calendar error:', error);
  }

  calendar.on('bw-booking-calendar-continue', (event) => {
    const detail = event.detail || {};
    const slot = detail.slot;
    if (!slot) return;

    const guests = Number(detail.guests || 1);
    wixLocation.to(buildBookingFormUrl(slot, guests));
  });
});

async function loadSlots(serviceId) {
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + DAYS_TO_LOAD * 24 * 60 * 60 * 1000);
  const response = await availabilityCalendar.queryAvailability({
    filter: {
      serviceId: [serviceId],
      startDate,
      endDate,
    },
  }, {
    timezone: TIMEZONE,
  });

  return normalizeAvailability(response, serviceId);
}

function normalizeAvailability(response, serviceId) {
  const entries =
    response?.availabilityEntries ||
    response?.entries ||
    response?.slots ||
    response?.items ||
    [];

  return entries
    .map((entry, index) => {
      const slot = entry.slot || entry;
      const startDate =
        slot.startDate ||
        slot.start?.dateTime ||
        entry.startDate ||
        entry.start?.dateTime;
      const endDate =
        slot.endDate ||
        slot.end?.dateTime ||
        entry.endDate ||
        entry.end?.dateTime;

      if (!startDate) return null;

      return {
        id: String(slot.id || slot.eventId || entry.id || `${startDate}-${index}`),
        eventId: slot.eventId || entry.eventId || '',
        serviceId: slot.serviceId || serviceId,
        startDate,
        endDate: endDate || '',
        timezone: slot.timezone || TIMEZONE,
        openSpots: Number.isFinite(Number(entry.openSpots || slot.openSpots))
          ? Number(entry.openSpots || slot.openSpots)
          : null,
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

function buildBookingFormUrl(slot, guests) {
  /*
   * Wix's shareable Booking Form link supports preloaded defaults via query
   * parameters. The exact final parameter names can vary by Bookings flow and
   * should be confirmed once on the live form URL after selecting a real slot.
   *
   * For class/group sessions, eventId is the safest key to preserve because Wix
   * can derive time, resource, location, and timezone from the event.
   */
  const query = new URLSearchParams();

  query.set('serviceId', slot.serviceId);
  query.set('startDate', slot.startDate);
  if (slot.endDate) query.set('endDate', slot.endDate);
  query.set('timezone', slot.timezone || TIMEZONE);
  query.set('numberOfParticipants', String(Math.max(1, guests || 1)));
  if (slot.eventId) query.set('eventId', slot.eventId);

  query.set('utm_source', wixLocation.query.utm_source || 'berlinwalk');
  query.set('utm_medium', wixLocation.query.utm_medium || 'booking_calendar');
  query.set('utm_campaign', wixLocation.query.utm_campaign || 'custom_booking_calendar');
  query.set('utm_content', 'calendar_continue');

  return `${BOOKING_FORM_PATH}?${query.toString()}`;
}
