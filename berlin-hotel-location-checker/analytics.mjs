/**
 * Thin privacy boundary for this tool's shared BerlinWalk event bridge.
 * Only the bridge's closed action/event enums and numeric/boolean metadata pass.
 */

export const HOTEL_ACTIONS = Object.freeze([
  'address_submitted',
  'map_pin_selected',
  'priority_selected',
  'address_resolved',
  'score_calculated',
  'vbb_opened',
  'article_opened',
  'planner_opened',
  'tour_opened',
]);

export const HOTEL_EVENTS = Object.freeze(['start', 'complete', 'share_success', 'cta_click', 'action']);

const ACTION_SET = new Set(HOTEL_ACTIONS);
const EVENT_SET = new Set(HOTEL_EVENTS);
const NUMERIC_LIMITS = Object.freeze({
  stepIndex: [0, 50],
  resultCount: [0, 999],
  durationMs: [0, 600000],
});

export function buildHotelEventOptions(actionName, metadata = {}) {
  if (actionName !== null && actionName !== undefined && !ACTION_SET.has(actionName)) {
    throw new TypeError(`Unsupported hotel-location action: ${String(actionName)}`);
  }
  const safeMetadata = {};
  for (const [key, value] of Object.entries(metadata ?? {})) {
    if (NUMERIC_LIMITS[key] && typeof value === 'number' && Number.isFinite(value)) {
      const [minimum, maximum] = NUMERIC_LIMITS[key];
      safeMetadata[key] = Math.min(maximum, Math.max(minimum, Math.round(value)));
    }
    if (key === 'success' && typeof value === 'boolean') safeMetadata.success = value;
  }
  const options = {};
  if (actionName !== null && actionName !== undefined) options.actionName = actionName;
  if (Object.keys(safeMetadata).length) options.metadata = safeMetadata;
  return options;
}

export function emitHotelEvent(eventName, actionName, metadata = {}) {
  if (!EVENT_SET.has(eventName)) throw new TypeError(`Unsupported hotel-location event: ${String(eventName)}`);
  const options = buildHotelEventOptions(actionName, metadata);
  const tracker = globalThis.BWToolEvents;
  if (!tracker || typeof tracker.track !== 'function') return false;
  return tracker.track(eventName, options);
}
