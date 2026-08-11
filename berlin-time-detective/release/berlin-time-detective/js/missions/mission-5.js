import { calculateMissionScore, selectMissionStatus } from "../game-state.js";
import { completionMarkup, clearModule, formatScore, renderHeader, revealMarkup, setFeedback, shell } from "./shared.js";

const SYMBOLS = Object.freeze(["time-gear", "street-key", "spree-keystone", "detail-lens"]);
const SYMBOL_LABELS = Object.freeze({ "time-gear": "Time Gear", "street-key": "Street Key", "spree-keystone": "Spree Keystone", "detail-lens": "Detail Lens" });
const PATH = Object.freeze([
  { id: "entrance", label: "Rosenthaler Straße 40/41 entrance" },
  { id: "courtyard-1", label: "Courtyard 1" },
  { id: "courtyard-2", label: "Courtyard 2" },
]);
const PATH_TOKENS = Object.freeze({ entrance: "path-a", "courtyard-1": "path-b", "courtyard-2": "path-c" });
const TOKEN_TO_PATH = Object.freeze(Object.fromEntries(Object.entries(PATH_TOKENS).map(([id, token]) => [token, id])));
// The private PATH array is the verified order. The visible list is stable but
// deliberately not the answer order, so the player still has to observe it.
const DISPLAY_PATH = Object.freeze([PATH[1], PATH[0], PATH[2]]);

export function createMission5(context) {
  const { root, definition, session, store, announce, toast, audio, schedule, guard, signal } = context;
  let symbols = new Set();
  let path = [];
  let pending = false;
  let practiceWrong = new Set();
  let practiceHintUsed = false;
  let practiceComplete = false;

  function stateMission() { return store.getState().missions[definition.id]; }
  function isPractice() { return session.mode === "practice"; }
  function score() { return isPractice() ? Math.max(0, 200 - (practiceHintUsed ? 40 : 0) - practiceWrong.size * 25) : calculateMissionScore(stateMission()); }

  function complete() {
    if (!guard() || !pending) return;
    pending = false;
    if (isPractice()) {
      practiceComplete = true;
      announce("Practice complete. The passport is unchanged.");
      toast("Practice complete. Passport unchanged.");
      render(store.getState());
      return;
    }
    store.dispatch({ type: "COMPLETE_MISSION", missionId: definition.id, clueId: definition.clueId });
    if (!guard()) return;
    audio.playSuccess();
    announce("Mission 5 complete. 5 of 5 missions. Score recorded. Courtyard Key unlocked.");
    toast("Courtyard Key unlocked.");
    render(store.getState());
    root.querySelector("[data-completion] h3")?.focus({ preventScroll: true });
  }

  function toggleSymbol(id) {
    if (pending || session.mode === "review" || practiceComplete) return;
    if (symbols.has(id)) symbols.delete(id); else symbols.add(id);
    audio.playStep();
    render(store.getState());
  }

  function choosePath(pathToken) {
    if (pending || session.mode === "review" || practiceComplete) return;
    const id = TOKEN_TO_PATH[pathToken];
    if (!id) return;
    if (symbols.size < SYMBOLS.length) {
      setFeedback(root, "Place all four earned clue symbols on the lock first.", "wrong");
      announce("The courtyard lock needs all four earned clue symbols.");
      return;
    }
    const expected = PATH[path.length]?.id;
    const choiceId = `path-${path.length}-${id}`;
    const repeated = isPractice() ? practiceWrong.has(choiceId) : stateMission().wrongChoiceIds.includes(choiceId);
    if (id !== expected) {
      if (isPractice()) practiceWrong.add(choiceId);
      else {
        store.dispatch({ type: "WRONG_CHOICE", missionId: definition.id, choiceId });
        if (!guard()) return;
      }
      setFeedback(root, repeated ? "That route observation is already recorded. No extra penalty." : "That is not the next verified passage in the bounded sequence.", "wrong");
      toast(repeated ? "Same route observation. No extra penalty." : "Route observation recorded.");
      announce(repeated ? "Same route observation recorded. No extra penalty." : `Route observation recorded. Score is now ${formatScore(score())} points.`);
      audio.playError();
      render(store.getState());
      return;
    }
    path.push(id);
    const solved = path.length === PATH.length;
    if (!isPractice()) {
      store.dispatch({ type: "CHECKPOINT", missionId: definition.id, progress: { step: path.length, solved, checkpoint: { symbols: SYMBOLS.filter((symbol) => symbols.has(symbol)), path: [...path] } } });
      if (!guard()) return;
    }
    setFeedback(root, solved ? "The first verified passage is open. Confirming the final clue." : "Passage confirmed. Continue to the next courtyard.", "correct");
    announce(solved ? "Verified courtyard passage complete." : `Passage ${path.length} of 3 confirmed.`);
    if (solved) {
      pending = true;
      toast("Passage secured. Confirming the stamp.");
      schedule(complete, 360);
    }
    render(store.getState());
  }

  function useHint() {
    if (session.mode === "review" || pending || practiceComplete) return;
    if (isPractice()) { if (practiceHintUsed) return; practiceHintUsed = true; }
    else {
      store.dispatch({ type: "USE_HINT", missionId: definition.id });
      if (!guard()) return;
    }
    setFeedback(root, "The bounded route begins at Rosenthaler Straße 40/41, then Courtyard 1, then Courtyard 2. It does not claim a full eight-courtyard navigation path.");
    toast("Hint recorded. 40 points deducted.");
    announce(`Hint used. Score is now ${formatScore(score())} points.`);
    render(store.getState());
  }

  function renderBody() {
    const pathStep = path.length;
    root.querySelector("[data-mission-body]").innerHTML = `<div class="mission-image-grid mission-image-grid--courtyard"><figure class="mission-image-card mission-image-card--plan"><img src="assets/mission-5/source-hackesche-plan-ccby.png" width="598" height="557" alt="A complete site-plan drawing for the verified courtyard sequence"><figcaption><span class="evidence-pane__label">Plan evidence</span><strong>Courtyard sequence</strong><small>Full source plan shown without altered geography.</small></figcaption></figure><aside class="mission-image-copy"><p class="eyebrow">Stop 13</p><h3>Unlock the courtyards</h3><p>Combine the four earned game symbols, then open the first verified passage in order.</p><div class="symbol-lock" role="group" aria-label="Four earned game clue symbols">${SYMBOLS.map((id) => `<button class="symbol-button${symbols.has(id) ? " is-selected" : ""}" type="button" data-symbol="${id}" aria-pressed="${symbols.has(id)}"><span class="symbol-button__mark" aria-hidden="true">${id === "time-gear" ? "TG" : id === "street-key" ? "SK" : id === "spree-keystone" ? "SP" : "DL"}</span><span>${SYMBOL_LABELS[id]}</span></button>`).join("")}</div></aside></div><section class="courtyard-sequence" aria-labelledby="courtyard-sequence-title"><h3 id="courtyard-sequence-title">${symbols.size === SYMBOLS.length ? `Passage ${Math.min(pathStep + 1, 3)} of 3` : "Set the four clue symbols"}</h3><div class="sequence-options">${DISPLAY_PATH.map((entry) => `<button class="sequence-button${path.includes(entry.id) ? " is-complete" : ""}" type="button" data-path="${PATH_TOKENS[entry.id]}" ${path.includes(entry.id) ? "disabled" : ""}>${entry.label}</button>`).join("")}</div><p class="source-note">The plan is an independent 2005 schematic. The game verifies only the first three-part passage shown here.</p></section>`;
    root.querySelectorAll("[data-symbol]").forEach((button) => button.addEventListener("click", () => toggleSymbol(button.dataset.symbol), { signal }));
    root.querySelectorAll("[data-path]").forEach((button) => button.addEventListener("click", () => choosePath(button.dataset.path), { signal }));
  }

  function mount() {
    root.innerHTML = shell(definition, "Hackescher Markt", "The Courtyard Lock", "Use the four earned clue symbols to unlock a short, verified passage through the courtyard plan.");
    const saved = stateMission().progress;
    if (!isPractice() && saved?.checkpoint) { symbols = new Set(saved.checkpoint.symbols || []); path = [...(saved.checkpoint.path || [])]; }
    renderBody();
    root.querySelector("[data-hint-button]").addEventListener("click", useHint, { signal });
    root.addEventListener("click", (event) => {
      if (event.target.closest("[data-review]")) store.dispatch({ type: "OPEN_MISSION", missionId: definition.id, mode: "review" });
      if (event.target.closest("[data-practice]")) store.dispatch({ type: "OPEN_MISSION", missionId: definition.id, mode: "practice" });
      if (event.target.closest("[data-open-result]")) store.dispatch({ type: "OPEN_RESULT" });
    }, { signal });
    // A refresh can land after the solved checkpoint but before the delayed
    // completion stamp. Resume that guarded transition so the player never
    // gets a completed-looking but unfrozen lock with all controls disabled.
    if (!isPractice() && saved?.solved === true && symbols.size === SYMBOLS.length && path.length === PATH.length && path.every((id, index) => id === PATH[index].id)) {
      pending = true;
      schedule(complete, 360);
    }
  }

  function render(state) {
    const completed = selectMissionStatus(state, definition.id) === "complete" && !isPractice();
    renderHeader(root, state, definition, { pending, mode: session.mode, scoreOverride: isPractice() ? score() : null, hintUsedOverride: isPractice() ? practiceHintUsed : null });
    if (!completed && !practiceComplete) renderBody();
    if (completed || practiceComplete) {
      root.querySelector("[data-reveal]").hidden = false;
      root.querySelector("[data-reveal]").innerHTML = revealMarkup(definition, "A bounded passage through eight courtyards", "Hackesche Höfe is a group of eight interconnecting courtyards. This game verifies only the first supported passage: Rosenthaler Straße 40/41 entrance, Courtyard 1, then Courtyard 2. The symbols are game devices, not historical signage, and the plan is not a live navigation or accessibility map.", "The Hackesche Höfe architecture and discovery pages, Berlin attraction record, and Berlin monument database support the place and sequence boundary.");
      root.querySelector("[data-completion]").hidden = false;
      root.querySelector("[data-completion]").innerHTML = `${completionMarkup(definition, isPractice() ? "Practice complete. Passport score unchanged." : `5 / 5 missions · Score ${formatScore(state.missions[definition.id].frozenScore)}`, session.mode)}<button class="primary-button" type="button" data-open-result>Open final result</button>`;
      setFeedback(root, isPractice() ? "Practice complete. The passport remains unchanged." : "Mission complete. Courtyard Key added to the passport.", "correct");
    } else {
      root.querySelector("[data-reveal]").hidden = true;
      root.querySelector("[data-completion]").hidden = true;
    }
  }

  return { mount, render, destroy() { clearModule(root); } };
}
