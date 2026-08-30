export const TOOL_SLUG = 'berlin-address-time-machine';

export const ACTION_NAMES = Object.freeze([
  'address_submitted',
  'map_pin_selected',
  'geolocation_selected',
  'address_resolved',
  'layer_1989_selected',
  'layer_today_selected',
  'result_east',
  'result_west',
  'result_near_border',
  'result_outside_scope',
]);

const EVENT_NAMES = new Set(['start', 'complete', 'share_success', 'cta_click', 'action']);
const INTEGER_LIMITS = Object.freeze({
  stepIndex: [0, 50],
  resultCount: [0, 999],
  durationMs: [0, 600000],
});

export function safeMetadata(input = {}) {
  const output = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) return output;
  for (const [key, [minimum, maximum]] of Object.entries(INTEGER_LIMITS)) {
    const value = Number(input[key]);
    if (Number.isInteger(value) && value >= minimum && value <= maximum) output[key] = value;
  }
  if (typeof input.success === 'boolean') output.success = input.success;
  return output;
}

export function isAllowedAction(actionName) {
  return typeof actionName === 'string' && ACTION_NAMES.includes(actionName);
}

export function createAnalytics(bridge = globalThis.BWToolEvents, clock = () => Date.now()) {
  let startedAt = null;

  function send(eventName, actionName, metadata) {
    if (!EVENT_NAMES.has(eventName) || (actionName && !isAllowedAction(actionName))) return false;
    if (!bridge || typeof bridge.track !== 'function') return false;
    const options = { metadata: safeMetadata(metadata) };
    if (actionName) options.actionName = actionName;
    return bridge.track(eventName, options);
  }

  return Object.freeze({
    start() {
      if (startedAt === null) startedAt = clock();
      return send('start', '', {});
    },
    action(actionName, metadata = {}) {
      return send('action', actionName, metadata);
    },
    complete(success, actionName = '') {
      const durationMs = startedAt === null ? undefined : Math.max(0, Math.round(clock() - startedAt));
      return send('complete', actionName, { durationMs, success });
    },
  });
}
