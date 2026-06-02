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
 * 2026-06-02 API note:
 * Live Wix API probing confirmed that Bookings Time Slots V2
 * `List Event Time Slots` returns bookable Berlin Free Walking Tour class
 * sessions, event IDs, capacity, location, and resource data. Use the backend
 * module in `velo/backend/bookingCalendarAvailability.jsw`; do not call the
 * Wix REST API or expose the Wix API key from frontend page code.
 */

import wixWindowFrontend from 'wix-window-frontend';
import wixLocation from 'wix-location';
import { loadBookingCalendarSlots } from 'backend/bookingCalendarAvailability';

const CALENDAR_ELEMENT_ID = '#bwBookingCalendar';
const BOOKING_FORM_PATH = '/booking-form';
const TIMEZONE = 'Europe/Berlin';
const DAYS_TO_LOAD = 365;

let normalizedSlots = [];

$w.onReady(async function () {
  const calendar = $w(CALENDAR_ELEMENT_ID);

  calendar.setAttribute('loading', 'true');
  calendar.setAttribute('service-title', 'Pick your tour date');
  calendar.setAttribute('default-guests', '2');
  calendar.setAttribute('max-guests', '8');
  calendar.setAttribute('cta-label', 'Reserve your spot');

  try {
    const pageData = await wixWindowFrontend.getAppPageData();
    const service = pageData?.service;
    const serviceId = service?.id;

    if (!serviceId) {
      throw new Error('No service was found for this Booking Calendar page.');
    }

    calendar.setAttribute('service-title', 'Pick your tour date');
    normalizedSlots = await loadBookingCalendarSlots({
      serviceId,
      days: DAYS_TO_LOAD,
      guests: 1,
    });

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

function buildBookingFormUrl(slot, guests) {
  /*
   * Wix's official shareable Booking Form links require class sessions to pass
   * `bookings_sessionId` and `bookings_timezone`. Time Slots V2 exposes the
   * current session identifier as `eventInfo.eventId`, so the backend normalizer
   * also copies that value into `slot.sessionId`.
   */
  const query = new URLSearchParams();

  query.set('bookings_timezone', slot.timezone || TIMEZONE);
  if (slot.sessionId || slot.eventId) query.set('bookings_sessionId', slot.sessionId || slot.eventId);
  query.set('guests', String(Math.max(1, guests || 1)));

  query.set('utm_source', wixLocation.query.utm_source || 'berlinwalk');
  query.set('utm_medium', wixLocation.query.utm_medium || 'booking_calendar');
  query.set('utm_campaign', wixLocation.query.utm_campaign || 'custom_booking_calendar');
  query.set('utm_content', 'calendar_continue');

  return `${BOOKING_FORM_PATH}?${query.toString()}`;
}
