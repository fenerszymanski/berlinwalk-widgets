export const SCHEMA_VERSION = 2;
export const MISSION_MAX_SCORE = 200;
export const HINT_PENALTY = 40;
export const WRONG_CHOICE_PENALTY = 25;

export const MISSION_IDS = Object.freeze([
  "mission-1",
  "mission-2",
  "mission-3",
  "mission-4",
  "mission-5",
]);

export const MISSION_CLUES = Object.freeze({
  "mission-1": "clue-alexanderplatz-layers",
  "mission-2": "clue-street-key",
  "mission-3": "clue-spree-keystone",
  "mission-4": "clue-detail-lens",
  "mission-5": "clue-courtyard-key",
});

export const MISSION_COLLECTIBLES = Object.freeze({
  "mission-1": Object.freeze({ id: "time-gear", name: "Time Gear", image: "assets/mission-1/time-gear.png" }),
  "mission-2": Object.freeze({ id: "street-key", name: "Street Key", image: "assets/mission-2/street-key.png" }),
  "mission-3": Object.freeze({ id: "spree-keystone", name: "Spree Keystone", image: "assets/mission-3/spree-keystone.png" }),
  "mission-4": Object.freeze({ id: "detail-lens", name: "Detail Lens", image: "assets/mission-4/detail-lens.png" }),
  "mission-5": Object.freeze({ id: "courtyard-key", name: "Courtyard Key", image: "assets/mission-5/courtyard-key.png" }),
});

const CLUE_TEXT = Object.freeze({
  "mission-1": "Alexanderplatz keeps market, civic, and skyline layers in one field of evidence.",
  "mission-2": "A surviving church and a vanished market edge share the route's oldest traces.",
  "mission-3": "The Spree crossing holds a sequence of palace, replacement, and reconstructed forum.",
  "mission-4": "Restoration can keep damage visible instead of making the past look untouched.",
  "mission-5": "The first verified passage through the courtyards is a route clue, not a full tour plan.",
});

const STATUS_SCREENS = new Set(["mission", "mission-complete", "mission-review", "result"]);

const DURABLE_KEYS = new Set(["schemaVersion", "revision", "savedAt", "runId", "missions"]);
const MISSION_KEYS = new Set(["hintUsed", "wrongChoiceIds", "progress", "frozenScore", "clueId", "completedAt"]);
const PROGRESS_KEYS = new Set(["step", "solved", "checkpoint"]);
const CHECKPOINT_KEYS = Object.freeze({
  "mission-1": new Set(["year"]),
  "mission-2": new Set(["firstChoice", "secondChoice"]),
  "mission-3": new Set(["order"]),
  "mission-4": new Set(["detailChoice", "buildingChoice"]),
  "mission-5": new Set(["symbols", "path"]),
});

function newRunId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `run-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createMissionRecord() {
  return {
    hintUsed: false,
    wrongChoiceIds: [],
    progress: { step: 0, solved: false, checkpoint: null },
    frozenScore: null,
    clueId: null,
    completedAt: null,
  };
}

export function createInitialDurable(runId = newRunId()) {
  return {
    schemaVersion: SCHEMA_VERSION,
    revision: 0,
    savedAt: null,
    runId,
    missions: Object.fromEntries(MISSION_IDS.map((id) => [id, createMissionRecord()])),
  };
}

export function createInitialState() {
  return {
    ...createInitialDurable(),
    view: {
      screen: "intro",
      activeMissionId: null,
      activeStep: "intro",
      mode: "play",
    },
    audioEnabled: false,
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function expectedClue(missionId) {
  return MISSION_CLUES[missionId] || null;
}

const CANONICAL_CHECKPOINTS = Object.freeze({
  "mission-1": Object.freeze({ year: 1969 }),
  "mission-2": Object.freeze({ firstChoice: "surviving-landmark", secondChoice: "lost-pattern" }),
  "mission-3": Object.freeze({ order: Object.freeze(["palace", "palast", "humboldt"]) }),
  "mission-4": Object.freeze({ detailChoice: "weathered-surface", buildingChoice: "stop-11-2009" }),
  "mission-5": Object.freeze({ symbols: Object.freeze(["time-gear", "street-key", "spree-keystone", "detail-lens"]), path: Object.freeze(["entrance", "courtyard-1", "courtyard-2"]) }),
});

function matchesCanonicalCheckpoint(missionId, checkpoint) {
  const expected = CANONICAL_CHECKPOINTS[missionId];
  if (!checkpoint || !expected) return false;
  if (missionId === "mission-1") return checkpoint.year === expected.year;
  if (missionId === "mission-2" || missionId === "mission-4") return Object.keys(expected).every((key) => checkpoint[key] === expected[key]);
  if (missionId === "mission-3") return Array.isArray(checkpoint.order) && checkpoint.order.length === expected.order.length && checkpoint.order.every((value, index) => value === expected.order[index]);
  if (missionId === "mission-5") {
    const symbols = Array.isArray(checkpoint.symbols) ? checkpoint.symbols : [];
    const expectedSymbols = expected.symbols;
    return Array.isArray(checkpoint.path)
      && checkpoint.path.length === expected.path.length
      && checkpoint.path.every((value, index) => value === expected.path[index])
      && symbols.length === expectedSymbols.length
      && new Set(symbols).size === expectedSymbols.length
      && expectedSymbols.every((value) => symbols.includes(value));
  }
  return false;
}

const CHECKPOINT_DOMAINS = Object.freeze({
  "mission-1": Object.freeze({ years: new Set([1900, 1939, 1960, 1969, 1989, 2024]) }),
  "mission-2": Object.freeze({ choices: new Set(["surviving-landmark", "lost-pattern"]) }),
  "mission-3": Object.freeze({ layers: new Set(["palace", "palast", "humboldt"]) }),
  "mission-4": Object.freeze({ details: new Set(["weathered-surface", "glass-roof", "fresh-stone"]), buildings: new Set(["stop-9-1905", "stop-10-1830", "stop-11-2009", "stop-12-1982"]) }),
  "mission-5": Object.freeze({ symbols: new Set(["time-gear", "street-key", "spree-keystone", "detail-lens"]), path: new Set(["entrance", "courtyard-1", "courtyard-2"]) }),
});

const SOLVED_STEPS = Object.freeze({ "mission-1": 1, "mission-2": 1, "mission-3": 1, "mission-4": 2, "mission-5": 3 });

function validateCheckpointDomain(missionId, checkpoint, step, solved) {
  if (checkpoint === undefined) return false;
  if (checkpoint === null) return !solved && step === 0;
  if (!checkpoint || typeof checkpoint !== "object" || Array.isArray(checkpoint) || Object.keys(checkpoint).some((key) => !CHECKPOINT_KEYS[missionId].has(key))) return false;
  const domain = CHECKPOINT_DOMAINS[missionId];
  if (missionId === "mission-1") {
    if (Object.keys(checkpoint).length !== 1 || typeof checkpoint.year !== "number" || !Number.isInteger(checkpoint.year) || !domain.years.has(checkpoint.year)) return false;
  }
  if (missionId === "mission-2") {
    if (Object.keys(checkpoint).length !== 2 || typeof checkpoint.firstChoice !== "string" || typeof checkpoint.secondChoice !== "string" || !domain.choices.has(checkpoint.firstChoice) || !domain.choices.has(checkpoint.secondChoice)) return false;
  }
  if (missionId === "mission-3") {
    if (Object.keys(checkpoint).length !== 1 || !Array.isArray(checkpoint.order) || checkpoint.order.length !== 3 || new Set(checkpoint.order).size !== 3 || checkpoint.order.some((value) => typeof value !== "string" || !domain.layers.has(value))) return false;
  }
  if (missionId === "mission-4") {
    if (typeof checkpoint.detailChoice !== "string" || !domain.details.has(checkpoint.detailChoice)) return false;
    if (checkpoint.buildingChoice !== undefined && (typeof checkpoint.buildingChoice !== "string" || !domain.buildings.has(checkpoint.buildingChoice))) return false;
    if (step === 1 && Object.keys(checkpoint).length !== 1) return false;
    if (step >= 2 && (Object.keys(checkpoint).length !== 2 || checkpoint.buildingChoice === undefined)) return false;
  }
  if (missionId === "mission-5") {
    if (Object.keys(checkpoint).length !== 2 || !Array.isArray(checkpoint.symbols) || !Array.isArray(checkpoint.path)) return false;
    if (checkpoint.symbols.length > domain.symbols.size || new Set(checkpoint.symbols).size !== checkpoint.symbols.length || checkpoint.symbols.some((value) => typeof value !== "string" || !domain.symbols.has(value))) return false;
    if (checkpoint.path.length > 3 || new Set(checkpoint.path).size !== checkpoint.path.length || checkpoint.path.some((value) => typeof value !== "string" || !domain.path.has(value))) return false;
    if (checkpoint.path.length !== step) return false;
    if (checkpoint.path.some((value, index) => value !== ["entrance", "courtyard-1", "courtyard-2"][index])) return false;
    if (step === 3 && solved !== true) return false;
    if (solved && (checkpoint.symbols.length !== domain.symbols.size || checkpoint.path.length !== 3)) return false;
  }
  if (solved && step !== SOLVED_STEPS[missionId]) return false;
  return true;
}

function cloneMission(record) {
  return {
    ...record,
    wrongChoiceIds: [...record.wrongChoiceIds],
    progress: clone(record.progress),
  };
}

function updateDurable(state, missions) {
  return {
    ...state,
    schemaVersion: SCHEMA_VERSION,
    revision: state.revision + 1,
    savedAt: new Date().toISOString(),
    missions,
  };
}

function isActivePlay(state, missionId) {
  return state.view.activeMissionId === missionId && state.view.mode === "play";
}

export function calculateMissionScore(mission) {
  if (!mission) return 0;
  if (Number.isFinite(mission.frozenScore)) return mission.frozenScore;
  return Math.max(0, MISSION_MAX_SCORE - (mission.hintUsed ? HINT_PENALTY : 0) - mission.wrongChoiceIds.length * WRONG_CHOICE_PENALTY);
}

export function isMissionCompleteRecord(mission, missionId) {
  return Boolean(
    mission
      && mission.frozenScore !== null
      && Number.isFinite(mission.frozenScore)
      && mission.progress?.solved === true
      && matchesCanonicalCheckpoint(missionId, mission.progress?.checkpoint)
      && mission.clueId === expectedClue(missionId)
      && typeof mission.completedAt === "string"
      && Number.isFinite(Date.parse(mission.completedAt)),
  );
}

export function selectCompletedMissionIds(state) {
  const completed = [];
  for (const missionId of MISSION_IDS) {
    if (!isMissionCompleteRecord(state.missions[missionId], missionId)) break;
    completed.push(missionId);
  }
  return completed;
}

export function selectUnlockedMissionIds(state) {
  const completed = selectCompletedMissionIds(state);
  const next = MISSION_IDS[completed.length];
  return next ? [...completed, next] : completed;
}

export function selectMissionStatus(state, missionId) {
  const completed = selectCompletedMissionIds(state);
  if (completed.includes(missionId)) return "complete";
  const next = MISSION_IDS[completed.length];
  return missionId === next ? "available" : "locked";
}

export function selectTotalScore(state) {
  return selectCompletedMissionIds(state).reduce((sum, missionId) => sum + state.missions[missionId].frozenScore, 0);
}

export function selectClueIds(state) {
  return selectCompletedMissionIds(state).map((missionId) => state.missions[missionId].clueId);
}

export function selectGameComplete(state) {
  return selectCompletedMissionIds(state).length === MISSION_IDS.length;
}

export function selectMissionClueText(missionId) {
  return CLUE_TEXT[missionId] || "A clue is waiting in the field passport.";
}

export function reducer(state, action) {
  if (!action || typeof action.type !== "string") return state;

  switch (action.type) {
    case "OPEN_MISSION": {
      const missionId = action.missionId;
      if (!MISSION_IDS.includes(missionId) || selectMissionStatus(state, missionId) === "locked") return state;
      const completed = selectMissionStatus(state, missionId) === "complete";
      const mode = action.mode === "practice" ? "practice" : completed ? "review" : "play";
      return {
        ...state,
        view: { screen: completed && mode !== "practice" ? "mission-review" : "mission", activeMissionId: missionId, activeStep: completed ? "review" : "start", mode },
      };
    }
    case "SET_VIEW":
      return { ...state, view: { ...state.view, ...action.view } };
    case "SET_AUDIO":
      return { ...state, audioEnabled: Boolean(action.enabled) };
    case "USE_HINT": {
      const missionId = action.missionId;
      const mission = state.missions[missionId];
      if (!mission || !isActivePlay(state, missionId) || mission.hintUsed || isMissionCompleteRecord(mission, missionId)) return state;
      const missions = { ...state.missions, [missionId]: { ...cloneMission(mission), hintUsed: true } };
      return updateDurable(state, missions);
    }
    case "WRONG_CHOICE": {
      const missionId = action.missionId;
      const choiceId = String(action.choiceId || "");
      const mission = state.missions[missionId];
      if (!mission || !isActivePlay(state, missionId) || !choiceId || isMissionCompleteRecord(mission, missionId) || mission.wrongChoiceIds.includes(choiceId)) return state;
      const nextMission = cloneMission(mission);
      nextMission.wrongChoiceIds.push(choiceId);
      return updateDurable(state, { ...state.missions, [missionId]: nextMission });
    }
    case "CHECKPOINT": {
      const missionId = action.missionId;
      const mission = state.missions[missionId];
      if (!mission || !isActivePlay(state, missionId) || isMissionCompleteRecord(mission, missionId) || !action.progress) return state;
      const nextMission = cloneMission(mission);
      nextMission.progress = clone(action.progress);
      return updateDurable(state, { ...state.missions, [missionId]: nextMission });
    }
    case "COMPLETE_MISSION": {
      const missionId = action.missionId;
      const mission = state.missions[missionId];
      if (!mission || !isActivePlay(state, missionId) || isMissionCompleteRecord(mission, missionId) || mission.progress?.solved !== true || !matchesCanonicalCheckpoint(missionId, mission.progress?.checkpoint) || action.clueId !== expectedClue(missionId)) return state;
      const nextMission = cloneMission(mission);
      nextMission.frozenScore = calculateMissionScore(mission);
      nextMission.clueId = action.clueId;
      nextMission.completedAt = new Date().toISOString();
      const nextState = updateDurable(state, { ...state.missions, [missionId]: nextMission });
      return { ...nextState, view: { ...state.view, screen: "mission-complete", activeMissionId: missionId, activeStep: "complete", mode: "play" } };
    }
    case "OPEN_RESULT":
      if (!selectGameComplete(state)) return state;
      return { ...state, view: { screen: "result", activeMissionId: null, activeStep: "result", mode: "play" } };
    case "HYDRATE": {
      const durable = validateDurable(action.durable);
      if (!durable) return state;
      return { ...state, ...durable, view: { screen: "intro", activeMissionId: null, activeStep: "intro", mode: "play" }, audioEnabled: false };
    }
    case "RESET_RUN":
      return { ...createInitialState(), audioEnabled: state.audioEnabled };
    default:
      return state;
  }
}

export function validateDurable(raw) {
  if (!raw || typeof raw !== "object" || Object.keys(raw).some((key) => !DURABLE_KEYS.has(key)) || raw.schemaVersion !== SCHEMA_VERSION || !Number.isInteger(raw.revision) || raw.revision < 0 || typeof raw.savedAt !== "string" && raw.savedAt !== null || typeof raw.runId !== "string" || !raw.runId || !raw.missions || typeof raw.missions !== "object" || Array.isArray(raw.missions)) return null;
  const missions = {};
  for (const missionId of MISSION_IDS) {
    const record = raw.missions[missionId];
    if (!record || typeof record !== "object" || Array.isArray(record) || Object.keys(record).some((key) => !MISSION_KEYS.has(key)) || typeof record.hintUsed !== "boolean" || !Array.isArray(record.wrongChoiceIds) || record.wrongChoiceIds.some((id) => typeof id !== "string" || !id) || new Set(record.wrongChoiceIds).size !== record.wrongChoiceIds.length || !record.progress || typeof record.progress !== "object" || Array.isArray(record.progress) || Object.keys(record.progress).some((key) => !PROGRESS_KEYS.has(key)) || !Number.isInteger(record.progress.step) || record.progress.step < 0 || record.progress.step > 3 || typeof record.progress.solved !== "boolean") return null;
    if (record.frozenScore !== null && (typeof record.frozenScore !== "number" || !Number.isFinite(record.frozenScore) || record.frozenScore < 0 || record.frozenScore > MISSION_MAX_SCORE)) return null;
    if (record.clueId !== null && (typeof record.clueId !== "string" || record.clueId !== expectedClue(missionId))) return null;
    if (record.completedAt !== null && typeof record.completedAt !== "string") return null;
    if (record.frozenScore === null && record.clueId !== null) return null;
    if (record.frozenScore === null && record.completedAt !== null) return null;
    if (record.frozenScore !== null && (record.progress.solved !== true || !matchesCanonicalCheckpoint(missionId, record.progress.checkpoint) || record.clueId !== expectedClue(missionId) || typeof record.completedAt !== "string" || !Number.isFinite(Date.parse(record.completedAt)) || record.frozenScore !== Math.max(0, MISSION_MAX_SCORE - (record.hintUsed ? HINT_PENALTY : 0) - record.wrongChoiceIds.length * WRONG_CHOICE_PENALTY))) return null;
    if (record.progress.solved === true && !matchesCanonicalCheckpoint(missionId, record.progress.checkpoint)) return null;
    const checkpoint = record.progress.checkpoint;
    if (!validateCheckpointDomain(missionId, checkpoint, record.progress.step, record.progress.solved)) return null;
    missions[missionId] = {
      hintUsed: record.hintUsed,
      wrongChoiceIds: [...record.wrongChoiceIds],
      progress: clone(record.progress),
      frozenScore: record.frozenScore,
      clueId: record.clueId,
      completedAt: record.completedAt,
    };
  }
  for (const key of Object.keys(raw.missions)) if (!MISSION_IDS.includes(key)) return null;
  let previousIncomplete = false;
  for (const missionId of MISSION_IDS) {
    const complete = isMissionCompleteRecord(missions[missionId], missionId);
    if (complete && previousIncomplete) return null;
    if (!complete) previousIncomplete = true;
  }
  return { schemaVersion: SCHEMA_VERSION, revision: raw.revision, savedAt: raw.savedAt, runId: raw.runId, missions };
}

export function serializeDurable(stateOrDurable) {
  const durable = stateOrDurable?.view ? selectDurableState(stateOrDurable) : stateOrDurable?.durable || stateOrDurable;
  const validated = validateDurable(durable);
  return validated ? JSON.stringify(validated) : null;
}

export function selectDurableState(state) {
  if (!state || typeof state !== "object") return null;
  return { schemaVersion: state.schemaVersion, revision: state.revision, savedAt: state.savedAt, runId: state.runId, missions: state.missions };
}

export function createStore(initialState = createInitialState()) {
  let state = initialState;
  const listeners = new Set();
  function notify() { listeners.forEach((listener) => listener(state)); }
  return {
    getState: () => state,
    dispatch(action) {
      const next = reducer(state, action);
      if (next !== state) {
        state = next;
        notify();
      }
      return state;
    },
    hydrate(durable) {
      const next = reducer(state, { type: "HYDRATE", durable });
      if (next !== state) { state = next; notify(); }
      return state;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
