import { AudioController } from "./audio.js";
import { createDialogManager } from "./dialog.js";
import { createStore, selectCompletedMissionIds, selectGameComplete, selectMissionStatus, selectTotalScore, selectDurableState } from "./game-state.js";
import { createMapView } from "./map-view.js";
import { MISSION_REGISTRY } from "./mission-registry.js";
import { createMissionRunner } from "./mission-runner.js";
import { createMeasurementAdapter } from "./measurement.js";
import { createPassportView } from "./passport-view.js";
import { createPersistence, STORAGE_KEYS } from "./persistence.js";

const app = document.getElementById("game-app");
const announcer = document.getElementById("game-status-announcer");
const toastElement = document.getElementById("toast-notification");
const routeRail = document.getElementById("route-rail");
const gameMain = document.getElementById("game-main");
const introPanel = document.getElementById("intro-panel");
const missionView = document.getElementById("mission-view");
const missionWorkspace = document.getElementById("mission-workspace");
const resultView = document.getElementById("result-view");
const startButton = document.getElementById("start-mission");
const missionCount = document.getElementById("mission-count");
const scoreValue = document.getElementById("score-value");
const audioToggle = document.getElementById("audio-toggle");
const caseProgressTitle = document.getElementById("case-progress-title");
const caseProgressCopy = document.getElementById("case-progress-copy");
const introTitle = document.getElementById("intro-title");
const introDescription = document.getElementById("intro-description");
const introCurrentMission = document.getElementById("intro-current-mission");

const store = createStore();
const audio = new AudioController();
const persistence = createPersistence({ onStatus: () => {} });
const loaded = persistence.load();
if (loaded.durable) store.hydrate(loaded.durable);
if (selectGameComplete(store.getState())) store.dispatch({ type: "OPEN_RESULT" });

const measurement = createMeasurementAdapter({ getState: () => store.getState() });
let observedState = store.getState();
let suppressMeasurement = false;
measurement.syncState(observedState);

function hydrateStore(durable) {
  suppressMeasurement = true;
  try {
    return store.hydrate(durable);
  } finally {
    observedState = store.getState();
    measurement.syncState(observedState);
    suppressMeasurement = false;
  }
}

let toastTimer = null;
let announcementTimer = null;
let announcementToken = 0;
let lastPersistedRevision = store.getState().revision;
let persistedRevision = persistence.getVerifiedRevision();
let lastScreen = null;
const announcementHistory = [];

function formatScore(score) { return String(Math.max(0, Math.round(score))).padStart(4, "0"); }

function announce(message) {
  if (!message) return;
  const token = ++announcementToken;
  announcementHistory.push(message);
  if (announcementTimer !== null) window.clearTimeout(announcementTimer);
  announcer.textContent = "";
  announcementTimer = window.setTimeout(() => {
    announcementTimer = null;
    if (token !== announcementToken) return;
    announcer.textContent = message;
  }, 24);
}

function toast(message) {
  if (toastTimer !== null) window.clearTimeout(toastTimer);
  toastElement.textContent = message;
  toastElement.hidden = false;
  toastElement.setAttribute("aria-hidden", "false");
  toastTimer = window.setTimeout(() => { toastElement.hidden = true; toastElement.setAttribute("aria-hidden", "true"); toastTimer = null; }, 2200);
}

function syncAudioController(state) {
  if (state.audioEnabled !== audio.enabled) audio.setEnabled(state.audioEnabled);
}

const passportView = createPassportView({ triggerCount: document.getElementById("passport-trigger-count"), listRoot: document.getElementById("passport-list") });

let runner = null;
const mapView = createMapView({
  listRoot: document.getElementById("route-stop-list"),
  mapRoot: document.getElementById("route-map"),
  pinsRoot: document.getElementById("map-pins"),
  mapCard: document.getElementById("route-map-card"),
  progressRoot: document.getElementById("map-progress"),
  onMissionOpen: (missionId) => openMission(missionId, "play", { genuine: true }),
});

function updateCredits(state) {
  const completed = new Set(selectCompletedMissionIds(state));
  const item = (text) => `<li>${text}</li>`;
  const credits = [
    item(`World Clock construction photograph: Erich John, <a href="https://commons.wikimedia.org/wiki/File:Weltzeituhr_19690930.jpg" target="_blank" rel="noreferrer">Wikimedia Commons source</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>. Cropped and converted to WebP.`),
    item(`June 2023 TV Tower and Rotes Rathaus photograph: Arild Vågen, <a href="https://commons.wikimedia.org/wiki/File:Berliner_Fernsehturm_and_Rotes_Rathaus_June_2023_01.jpg" target="_blank" rel="noreferrer">Wikimedia Commons source</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>. Cropped and converted to WebP.`),
    item(`Field map work: Justin Kunimune, <a href="https://commons.wikimedia.org/wiki/File:Location_map_Berlin_central_2.svg" target="_blank" rel="noreferrer">Wikimedia Commons source</a>, <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noreferrer">CC0</a>; map data <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a>, <a href="https://opendatacommons.org/licenses/odbl/1-0/" target="_blank" rel="noreferrer">ODbL</a>. Cropped and rasterized for the route bounds.`),
  ];
  if (completed.has("mission-2")) {
    credits.push(item(`M2 church evidence: Plamen Agov (MrPanyGoff), <a href="https://commons.wikimedia.org/wiki/File:St._Mary%27s_Church_-_Berlin.jpg" target="_blank" rel="noreferrer">St. Mary's Church - Berlin on Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">CC BY-SA 3.0</a>. Cropped and converted to WebP; the game derivative is marked CC BY-SA 3.0.`));
    credits.push(item(`M2 plan: Johann Gregor Memhardt, 1652 plan / 1888 ZLB reprint, <a href="https://commons.wikimedia.org/wiki/File:Memhardt_Grundri%C3%9F_der_Beyden_Churf._Residentz_St%C3%A4tte_Berlin_und_C%C3%B6lln_1652_(1888).jpg" target="_blank" rel="noreferrer">Wikimedia Commons source</a>, public domain. Cropped around the St. Mary's mark; title, date, legend, and direct labels masked in the play derivative.`));
    credits.push(item(`M2 market evidence: Friedrich Albert Schwartz, <a href="https://commons.wikimedia.org/wiki/File:Neuer_Markt,_Berlin_1880.jpg" target="_blank" rel="noreferrer">Neuer Markt, Berlin 1880 on Wikimedia Commons</a>, public domain. Cropped and converted to WebP; shown after the answer.`));
  } else {
    credits.push(item(`M2 evidence photograph: Plamen Agov (MrPanyGoff), <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">CC BY-SA 3.0</a>. Cropped and converted to WebP.`));
    credits.push(item(`M2 plan artwork: public-domain plan image, <a href="https://creativecommons.org/publicdomain/mark/1.0/" target="_blank" rel="noreferrer">public domain</a>. Cropped and converted to WebP.`));
  }
  if (completed.has("mission-3")) {
    credits.push(item(`M3 evidence A: unknown photographer, Library of Congress Photochrom Collection, public domain, <a href="https://commons.wikimedia.org/wiki/File:Berlin_Stadtschloss_um_1900.jpg" target="_blank" rel="noreferrer">Wikimedia Commons record</a>, <a href="https://hdl.loc.gov/loc.pnp/ppmsca.00333" target="_blank" rel="noreferrer">Library of Congress source</a>. c.1890–1905; cropped and converted to WebP.`));
    credits.push(item(`M3 evidence B: Lutz Schramm, <a href="https://commons.wikimedia.org/wiki/File:Palast_der_Republik_Berlin_1976.jpg" target="_blank" rel="noreferrer">Wikimedia Commons source</a>, <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">CC BY 2.0</a>. Cropped and converted to WebP.`));
    credits.push(item(`M3 evidence C: Gerda Arendt, <a href="https://commons.wikimedia.org/wiki/File:Humboldt_Forum,_west_facade,_Berlin.jpg" target="_blank" rel="noreferrer">Wikimedia Commons source</a>, <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noreferrer">CC0</a>. Photographed 19 December 2023; cropped and converted to WebP.`));
  } else {
    credits.push(item(`M3 evidence A: unknown photographer, <a href="https://creativecommons.org/publicdomain/mark/1.0/" target="_blank" rel="noreferrer">public domain</a>. Cropped and converted to WebP.`));
    credits.push(item(`M3 evidence B: Lutz Schramm, <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">CC BY 2.0</a>. Cropped and converted to WebP.`));
    credits.push(item(`M3 evidence C: Gerda Arendt, <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noreferrer">CC0</a>. Cropped and converted to WebP.`));
  }
  if (completed.has("mission-4")) credits.push(item(`M4 repair detail: West façade of the Neues Museum, Janericloebe, via <a href="https://commons.wikimedia.org/wiki/File:Berlin_Neues_Museum_001.JPG" target="_blank" rel="noreferrer">Wikimedia Commons</a>, <a href="https://creativecommons.org/publicdomain/mark/1.0/" target="_blank" rel="noreferrer">public domain</a>. Current Commons version straightened and cropped by Holger.Ellgaard; converted to WebP.`));
  else credits.push(item(`M4 detail evidence: public-domain documentary raster. Cropped and converted to WebP; full source credit appears after Mission 4.`));
  if (completed.has("mission-5")) credits.push(item(`Hackesche Höfe site-plan drawing: Manfred Brückels (Eisenacher), <a href="https://commons.wikimedia.org/wiki/File:HackescheH%C3%B6fe_4.png" target="_blank" rel="noreferrer">Wikimedia Commons source</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">CC BY-SA 3.0</a>. Display resized; no geographic features altered.`));
  else credits.push(item(`M5 plan evidence: Manfred Brückels (Eisenacher), <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">CC BY-SA 3.0</a>. Display resized; full source credit appears after Mission 5.`));
  credits.push(item("Collectible objects are purpose-made game rasters. They are not documentary evidence."));
  document.getElementById("credits-list").innerHTML = `<ul>${credits.join("")}</ul>`;
}

function titleForScore(total) {
  if (total >= 900) return "Master Time Detective";
  if (total >= 750) return "Archive Sleuth";
  if (total >= 500) return "Field Investigator";
  return "Berlin Observer";
}

function renderResult(state) {
  const complete = selectGameComplete(state);
  if (!complete || state.view.screen !== "result") { resultView.hidden = true; resultView.replaceChildren(); return; }
  resultView.hidden = false;
  const total = selectTotalScore(state);
  const saved = persistedRevision === state.revision && persistence.getVerifiedRevision() === state.revision;
  const collectibles = MISSION_REGISTRY.map((definition) => `<li><img src="${definition.collectible.image}" width="640" height="640" alt="${definition.collectible.name} collectible"><span>Mission ${definition.number}</span><strong>${definition.collectible.name}</strong></li>`).join("");
  resultView.innerHTML = `<article class="result-card"><div class="result-card__header"><div><p class="eyebrow">Case closed</p><h2 id="result-title">${titleForScore(total)}</h2><p>All five mission records are complete and the passport is frozen.</p></div><div class="result-score"><span class="mono-label">5 / 5 missions</span><strong>${formatScore(total)} / 1000</strong></div></div><ul class="collectible-grid" aria-label="Five mission collectibles">${collectibles}</ul><p class="result-save-status">${saved ? "Saved case verified." : "This result is in memory only because the latest save is not verified."}</p><div class="result-actions"><button class="primary-button" type="button" data-share-result>Share result</button><button class="outline-button" type="button" data-result-restart>Restart case</button>${saved ? `<a class="booking-button" href="https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based" target="_blank" rel="noreferrer">Book a Berlin walking tour</a>` : ""}</div></article>`;
}

function focusMissionHeading() {
  window.requestAnimationFrame(() => missionWorkspace.querySelector("[data-mission-heading]")?.focus());
}

function updateCaseProgress(state) {
  const completed = selectCompletedMissionIds(state);
  const active = MISSION_REGISTRY.find((mission) => mission.id === state.view.activeMissionId);
  const next = MISSION_REGISTRY.find((mission) => selectMissionStatus(state, mission.id) === "available");

  if (state.view.screen === "intro") {
    const current = next || MISSION_REGISTRY[0];
    const resuming = completed.length > 0;
    startButton.dataset.missionId = current.id;
    startButton.textContent = resuming ? `Continue to Mission ${current.number}` : "Start Mission 1";
    introTitle.textContent = resuming ? "Resume with the next clue" : "Start with one clue";
    introDescription.textContent = resuming
      ? `Your saved case has ${completed.length} collected clue${completed.length === 1 ? "" : "s"}. Continue with one clear evidence task.`
      : "Follow five short evidence cases from Alexanderplatz to Hackescher Markt. You only need to focus on one task at a time.";
    introCurrentMission.textContent = `Mission ${current.number} is ready: ${current.title}.`;
  }

  if (state.view.screen === "result") {
    caseProgressTitle.textContent = "Case complete · 5 clues collected";
    caseProgressCopy.textContent = "Your finished passport is ready to review, share, or restart.";
    return;
  }
  if (state.view.screen === "mission-complete" && active && active.number < 5) {
    const following = MISSION_REGISTRY.find((mission) => mission.number === active.number + 1);
    caseProgressTitle.textContent = `Clue collected · Mission ${active.number} of 5`;
    caseProgressCopy.textContent = `Use Continue to open Mission ${following.number}: ${following.title}.`;
    return;
  }
  if (active) {
    caseProgressTitle.textContent = `Mission ${active.number} of 5 · ${active.title}`;
    caseProgressCopy.textContent = "Read “Your task”, make one choice, then collect the clue.";
    return;
  }
  const current = next || MISSION_REGISTRY[0];
  caseProgressTitle.textContent = `Mission ${current.number} of 5 · ${current.title}`;
  caseProgressCopy.textContent = completed.length ? "Your next unlocked case is ready. Finish one clue at a time." : "Start the first short evidence case. Each clue unlocks one clear next mission.";
}

function syncRunner(state) {
  const activeMissionId = state.view.activeMissionId;
  if (!activeMissionId || !["mission", "mission-complete", "mission-review"].includes(state.view.screen)) {
    runner?.destroy();
    return;
  }
  const desiredMode = state.view.mode || "play";
  const current = runner?.getActive();
  if (!current || current.missionId !== activeMissionId || current.mode !== desiredMode || current.runId !== state.runId) {
    runner?.open(activeMissionId, desiredMode);
    focusMissionHeading();
  } else {
    runner.getModule()?.render?.(state);
  }
}

function renderGlobal(state) {
  syncAudioController(state);
  const completed = selectCompletedMissionIds(state);
  const total = selectTotalScore(state);
  app.dataset.screen = state.view.screen;
  app.dataset.score = String(total);
  app.dataset.completedMissions = String(completed.length);
  missionCount.textContent = `${completed.length} / 5 missions`;
  scoreValue.textContent = `SCORE ${formatScore(total)}`;
  audioToggle.textContent = state.audioEnabled ? "Audio on" : "Audio off";
  audioToggle.setAttribute("aria-pressed", String(state.audioEnabled));
  audioToggle.setAttribute("aria-label", state.audioEnabled ? "Turn audio off" : "Turn audio on");
  introPanel.hidden = state.view.screen !== "intro";
  missionView.hidden = !state.view.activeMissionId || !["mission", "mission-complete", "mission-review"].includes(state.view.screen);
  updateCaseProgress(state);
  mapView.render(state);
  passportView.render(state);
  updateCredits(state);
  renderResult(state);
  syncRunner(state);
  if (lastScreen !== state.view.screen && state.view.screen === "result") {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resultView.scrollIntoView({ block: "start", behavior: reducedMotion ? "auto" : "smooth" });
  }
  lastScreen = state.view.screen;
}

function openMission(missionId, mode = "play", { genuine = false } = {}) {
  if (selectMissionStatus(store.getState(), missionId) === "locked") return;
  const next = store.dispatch({ type: "OPEN_MISSION", missionId, mode });
  if (genuine && mode === "play" && next.view.screen === "mission" && next.view.mode === "play" && next.view.activeMissionId === missionId) measurement.missionStart({ missionId, mode });
  return next;
}

function performRestart() {
  const fresh = persistence.resetFresh();
  if (!fresh) {
    toast("The saved case could not be reset. Your current case is unchanged.");
    announce("Restart failed. The current case is unchanged.");
    return;
  }
  runner?.destroy();
  hydrateStore(fresh);
  persistedRevision = fresh.revision;
  lastPersistedRevision = fresh.revision;
  toast("Fresh case saved and verified.");
  announce("Fresh case ready.");
  return true;
}

const dialogManager = createDialogManager({ backgroundNodes: [routeRail, gameMain] });

document.getElementById("info-trigger").addEventListener("click", (event) => dialogManager.open("info-modal", event.currentTarget));
document.getElementById("passport-trigger").addEventListener("click", (event) => dialogManager.open("passport-modal", event.currentTarget));
document.getElementById("credits-trigger").addEventListener("click", (event) => dialogManager.open("credits-modal", event.currentTarget));
document.getElementById("restart-trigger").addEventListener("click", (event) => dialogManager.open("restart-modal", event.currentTarget));
document.getElementById("restart-cancel").addEventListener("click", () => dialogManager.close());
document.getElementById("restart-confirm").addEventListener("click", () => { dialogManager.close({ restoreFocus: false }); if (performRestart()) measurement.replay({ mode: "play", action: "restart" }); });
startButton.addEventListener("click", () => {
  const missionId = startButton.dataset.missionId || "mission-1";
  const next = openMission(missionId, "play", { genuine: false });
  if (next?.view.screen === "mission" && next.view.mode === "play" && next.view.activeMissionId === missionId) {
    if (missionId === "mission-1") measurement.gameStart();
    measurement.missionStart({ missionId, mode: "play" });
  }
});

missionWorkspace.addEventListener("click", (event) => {
  const missionRoot = event.target.closest(".mission-card[data-mission-id]");
  const missionId = missionRoot?.dataset.missionId;
  if (!missionId) return;
  const continueButton = event.target.closest("[data-continue-mission]");
  if (continueButton && !continueButton.disabled) {
    const nextMissionId = continueButton.dataset.continueMission;
    const next = openMission(nextMissionId, "play", { genuine: true });
    if (next?.view.screen === "mission" && next.view.activeMissionId === nextMissionId) {
      const nextDefinition = MISSION_REGISTRY.find((mission) => mission.id === nextMissionId);
      announce(`Mission ${nextDefinition.number} is ready. Read your task, then make one choice.`);
      toast(`Mission ${nextDefinition.number} is ready.`);
    }
    return;
  }
  const hint = event.target.closest("[data-hint-button]");
  const mode = store.getState().view.mode || "play";
  if (hint && !hint.disabled && mode === "practice") measurement.hintUsed({ missionId, mode });
  const practice = event.target.closest("[data-practice]");
  if (practice && !practice.disabled) measurement.replay({ missionId, mode: "practice", action: "practice" });
}, { capture: true });

audioToggle.addEventListener("click", async () => {
  const enabled = await audio.toggle();
  store.dispatch({ type: "SET_AUDIO", enabled });
  announce(enabled ? "Audio on." : "Audio off.");
});

resultView.addEventListener("click", async (event) => {
  const cta = event.target.closest(".booking-button");
  const current = store.getState();
  if (cta && !cta.hidden && current.view.screen === "result" && selectGameComplete(current)) measurement.tourCtaClick();
  if (event.target.closest("[data-result-restart]")) dialogManager.open("restart-modal", event.target.closest("[data-result-restart]"));
  if (!event.target.closest("[data-share-result]")) return;
  const sentence = `I completed Berlin Time Detective with ${selectTotalScore(store.getState())} of 1000 points across 5 missions.`;
  try {
    if (navigator.share) await navigator.share({ title: "Berlin Time Detective", text: sentence });
    else if (navigator.clipboard) await navigator.clipboard.writeText(sentence);
    announce("Result ready to share.");
    toast("Result copied for sharing.");
  } catch { announce("Share cancelled."); }
});

runner = createMissionRunner({ registry: MISSION_REGISTRY, store, announce, toast, audio, root: missionWorkspace, onRender: () => renderGlobal(store.getState()) });

store.subscribe((state) => {
  const previous = observedState;
  if (state.revision !== lastPersistedRevision) {
    const result = persistence.save(state);
    if (result.ok) persistedRevision = result.verifiedRevision;
    else if (result.reason === "stale-or-equal-tab") {
      const incoming = persistence.read(STORAGE_KEYS.current);
      if (incoming && persistence.acceptIncoming(incoming)) {
        runner?.destroy();
        persistedRevision = incoming.revision;
        lastPersistedRevision = incoming.revision;
        hydrateStore(incoming);
        announce("A newer saved case was loaded before this change could replace it.");
        return;
      }
      toast("A newer saved case is open in another tab.");
    } else if (result.reason !== "already-verified") {
      window.setTimeout(() => toast("Saving is unavailable. The case can continue in memory, but it is not marked saved."), 0);
    }
    lastPersistedRevision = state.revision;
  }
  observedState = state;
  measurement.observe(previous, state, { suppress: suppressMeasurement });
  renderGlobal(state);
});

window.addEventListener("storage", (event) => {
  const incoming = persistence.handleStorageEvent(event);
  if (!incoming) return;
  runner.destroy();
  hydrateStore(incoming);
  persistedRevision = incoming.revision;
  lastPersistedRevision = incoming.revision;
  if (selectGameComplete(store.getState())) store.dispatch({ type: "OPEN_RESULT" });
  announce("A newer saved case was loaded from another tab.");
});

window.addEventListener("beforeunload", () => runner.destroy());

if (loaded.warning) toast(loaded.warning);
renderGlobal(store.getState());
measurement.gameView();
