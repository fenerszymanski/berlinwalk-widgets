export const MEASUREMENT_EVENT_NAME = "berlinwalk:game-event";
export const MEASUREMENT_SCHEMA_VERSION = 1;

export const MEASUREMENT_EVENTS = Object.freeze([
  "game_view",
  "game_start",
  "mission_start",
  "hint_used",
  "mission_complete",
  "game_complete",
  "replay",
  "tour_cta_click",
]);

const ALLOWED_KEYS = new Set([
  "schemaVersion",
  "eventName",
  "runId",
  "missionId",
  "mode",
  "action",
  "completedMissions",
  "score",
  "timestamp",
]);

function stateSnapshot(getState) {
  try {
    const state = getState?.();
    const completedMissions = Object.values(state?.missions || {}).filter((mission) => mission?.frozenScore !== null).length;
    const score = Object.values(state?.missions || {}).reduce((total, mission) => total + (Number.isFinite(mission?.frozenScore) ? mission.frozenScore : 0), 0);
    return {
      runId: typeof state?.runId === "string" && state.runId ? state.runId : null,
      completedMissions,
      score,
    };
  } catch {
    return { runId: null, completedMissions: 0, score: 0 };
  }
}

function completedCount(state) {
  return Object.values(state?.missions || {}).filter((mission) => mission?.frozenScore !== null).length;
}

export function createMeasurementAdapter({ target = globalThis.document, getState = () => null, now = () => new Date().toISOString() } = {}) {
  let gameViewEmitted = false;
  const gameStarts = new Set();
  const missionStarts = new Set();
  const hints = new Set();
  const missionCompletions = new Set();
  const gameCompletions = new Set();

  function sessionTokenStorage() {
    try { return globalThis.sessionStorage; } catch { return null; }
  }

  function tokenKey(eventName, runId, missionId = "") {
    return `berlinwalk:measurement:v1:${eventName}:${runId}:${missionId}`;
  }

  function hasToken(set, key) {
    if (set.has(key)) return true;
    try {
      if (sessionTokenStorage()?.getItem(key) === "1") {
        set.add(key);
        return true;
      }
    } catch { /* sessionStorage is an optional same-tab dedupe aid */ }
    return false;
  }

  function rememberToken(set, key) {
    set.add(key);
    try { sessionTokenStorage()?.setItem(key, "1"); } catch { /* memory fallback keeps this document safe */ }
  }

  function emit(eventName, fields = {}) {
    if (!MEASUREMENT_EVENTS.includes(eventName)) return false;
    try {
      const snapshot = stateSnapshot(getState);
      const payload = {
        schemaVersion: MEASUREMENT_SCHEMA_VERSION,
        eventName,
        ...(snapshot.runId ? { runId: snapshot.runId } : {}),
        ...fields,
        completedMissions: snapshot.completedMissions,
        score: snapshot.score,
        timestamp: String(now()),
      };
      const safePayload = Object.fromEntries(Object.entries(payload).filter(([key, value]) => ALLOWED_KEYS.has(key) && value !== undefined && value !== null));
      const detail = Object.freeze(safePayload);
      const event = new CustomEvent(MEASUREMENT_EVENT_NAME, { detail });
      target?.dispatchEvent?.(event);
      return true;
    } catch {
      return false;
    }
  }

  function runId() { return stateSnapshot(getState).runId; }

  function gameView() {
    if (gameViewEmitted) return false;
    gameViewEmitted = true;
    return emit("game_view");
  }

  function gameStart() {
    const id = runId();
    const key = id ? tokenKey("game_start", id) : null;
    if (!key || hasToken(gameStarts, key)) return false;
    rememberToken(gameStarts, key);
    return emit("game_start");
  }

  function missionStart({ missionId, mode = "play" } = {}) {
    const id = runId();
    if (!id || typeof missionId !== "string" || mode !== "play") return false;
    const key = tokenKey("mission_start", id, missionId);
    if (hasToken(missionStarts, key)) return false;
    rememberToken(missionStarts, key);
    return emit("mission_start", { missionId, mode });
  }

  function hintUsed({ missionId, mode = "play" } = {}) {
    const id = runId();
    if (!id || typeof missionId !== "string") return false;
    const key = tokenKey("hint_used", id, missionId);
    if (hasToken(hints, key)) return false;
    rememberToken(hints, key);
    return emit("hint_used", { missionId, mode });
  }

  function missionComplete({ missionId, mode = "play" } = {}) {
    const id = runId();
    if (!id || typeof missionId !== "string") return false;
    const key = tokenKey("mission_complete", id, missionId);
    if (hasToken(missionCompletions, key)) return false;
    rememberToken(missionCompletions, key);
    return emit("mission_complete", { missionId, mode });
  }

  function gameComplete() {
    const id = runId();
    const key = id ? tokenKey("game_complete", id) : null;
    if (!key || hasToken(gameCompletions, key)) return false;
    rememberToken(gameCompletions, key);
    return emit("game_complete");
  }

  function syncState(state = getState?.()) {
    const id = typeof state?.runId === "string" && state.runId ? state.runId : null;
    if (!id) return;
    for (const [missionId, mission] of Object.entries(state.missions || {})) {
      if (mission?.hintUsed) rememberToken(hints, tokenKey("hint_used", id, missionId));
      if (mission?.frozenScore !== null) rememberToken(missionCompletions, tokenKey("mission_complete", id, missionId));
    }
    if (completedCount(state) === 5) rememberToken(gameCompletions, tokenKey("game_complete", id));
  }

  function replay({ missionId, mode, action } = {}) {
    const fields = {};
    if (typeof missionId === "string") fields.missionId = missionId;
    if (typeof mode === "string") fields.mode = mode;
    if (typeof action === "string") fields.action = action;
    return emit("replay", fields);
  }

  function tourCtaClick() { return emit("tour_cta_click", { action: "booking" }); }

  function observe(previous, next, { suppress = false } = {}) {
    if (suppress || !previous || !next) return;
    for (const [missionId, mission] of Object.entries(next.missions || {})) {
      const before = previous.missions?.[missionId];
      if (!before?.hintUsed && mission?.hintUsed) hintUsed({ missionId, mode: next.view?.mode || "play" });
      if (before?.frozenScore === null && mission?.frozenScore !== null) missionComplete({ missionId, mode: next.view?.mode || "play" });
    }
    if (completedCount(previous) < 5 && completedCount(next) === 5) gameComplete();
  }

  return Object.freeze({
    emit,
    gameView,
    gameStart,
    missionStart,
    hintUsed,
    missionComplete,
    gameComplete,
    replay,
    tourCtaClick,
    observe,
    syncState,
  });
}
