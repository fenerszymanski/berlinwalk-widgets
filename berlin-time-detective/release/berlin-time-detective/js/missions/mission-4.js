import { calculateMissionScore, selectMissionStatus } from "../game-state.js";
import { completionMarkup, clearModule, formatScore, renderHeader, revealMarkup, setFeedback, shell } from "./shared.js";

const DETAIL_CORRECT = "weathered-surface";
const BUILDING_CORRECT = "stop-11-2009";

export function createMission4(context) {
  const { root, definition, session, store, announce, toast, audio, schedule, guard, signal } = context;
  let step = 0;
  let detailChoice = null;
  let buildingChoice = null;
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
    announce("Mission 4 complete. 4 of 5 missions. Score recorded. Detail Lens unlocked.");
    toast("Detail Lens unlocked.");
    render(store.getState());
    root.querySelector("[data-completion] h3")?.focus({ preventScroll: true });
  }

  function wrong(stepNumber, id) {
    const choiceId = `step-${stepNumber}-${id}`;
    const repeated = isPractice() ? practiceWrong.has(choiceId) : stateMission().wrongChoiceIds.includes(choiceId);
    if (isPractice()) practiceWrong.add(choiceId);
    else {
      store.dispatch({ type: "WRONG_CHOICE", missionId: definition.id, choiceId });
      if (!guard()) return;
    }
    const message = stepNumber === 1 ? "Look again at the boundary between weathered material and careful repair." : "That stop and period do not match the detail. Use the route order and the supported reopening record.";
    setFeedback(root, repeated ? "That observation is already recorded. No extra penalty." : message, "wrong");
    toast(repeated ? "Same observation. No extra penalty." : "Observation recorded.");
    announce(repeated ? "Same observation recorded. No extra penalty." : `Observation recorded. Score is now ${formatScore(score())} points.`);
    audio.playError();
  }

  function choose(stepNumber, id) {
    if (pending || session.mode === "review" || practiceComplete) return;
    const correct = stepNumber === 1 ? id === DETAIL_CORRECT : id === BUILDING_CORRECT;
    if (!correct) {
      wrong(stepNumber, id);
      if (!guard()) return;
      render(store.getState());
      return;
    }
    if (stepNumber === 1) {
      detailChoice = id;
      step = 1;
      if (!isPractice()) {
        store.dispatch({ type: "CHECKPOINT", missionId: definition.id, progress: { step: 1, solved: false, checkpoint: { detailChoice: id } } });
        if (!guard()) return;
      }
      setFeedback(root, "The repair keeps the weathered surface visible. Now match the route stop and supported period.", "correct");
      announce("Detail secured. Match the route stop and period.");
      render(store.getState());
      return;
    }
    buildingChoice = id;
    step = 2;
    if (!isPractice()) {
      store.dispatch({ type: "CHECKPOINT", missionId: definition.id, progress: { step: 2, solved: true, checkpoint: { detailChoice, buildingChoice: id } } });
      if (!guard()) return;
    }
    pending = true;
    setFeedback(root, "Detail and route record secured. Confirming the clue.", "correct");
    toast("Detail secured. Confirming the stamp.");
    schedule(complete, 360);
    render(store.getState());
  }

  function useHint() {
    if (session.mode === "review" || pending || practiceComplete) return;
    if (isPractice()) { if (practiceHintUsed) return; practiceHintUsed = true; }
    else {
      store.dispatch({ type: "USE_HINT", missionId: definition.id });
      if (!guard()) return;
    }
    setFeedback(root, "Look for visible war damage that was incorporated into a modern restoration. The route's eleventh stop carries the documented reopening record.");
    toast("Hint recorded. 40 points deducted.");
    announce(`Hint used. Score is now ${formatScore(score())} points.`);
    render(store.getState());
  }

  function renderBody() {
    const first = `<fieldset class="choice-fieldset"><legend>1. Which detail should stay visible?</legend><div class="choice-grid"><button class="choice-button${detailChoice === DETAIL_CORRECT ? " is-selected" : ""}" type="button" data-step-choice="1" data-choice="${DETAIL_CORRECT}">Weathered surfaces meeting careful repair</button><button class="choice-button" type="button" data-step-choice="1" data-choice="glass-roof">A new glass roof with no older trace</button><button class="choice-button" type="button" data-step-choice="1" data-choice="fresh-stone">Fresh stone with uniform colour throughout</button></div></fieldset>`;
    const second = `<fieldset class="choice-fieldset"><legend>2. Which route stop and period match?</legend><div class="choice-grid"><button class="choice-button" type="button" data-step-choice="2" data-choice="stop-9-1905">Stop 9 · cathedral · reopened 1905</button><button class="choice-button" type="button" data-step-choice="2" data-choice="stop-10-1830">Stop 10 · classical museum · reopened 1830</button><button class="choice-button${buildingChoice === BUILDING_CORRECT ? " is-selected" : ""}" type="button" data-step-choice="2" data-choice="${BUILDING_CORRECT}">Stop 11 · long museum façade · reopened 2009</button><button class="choice-button" type="button" data-step-choice="2" data-choice="stop-12-1982">Stop 12 · bridge · rebuilt 1982</button></div></fieldset>`;
    root.querySelector("[data-mission-body]").innerHTML = `<div class="mission-image-grid"><figure class="mission-image-card"><img src="assets/mission-4/mission-4-repair.webp" width="1200" height="800" alt="A long museum façade where restored and weathered surfaces meet"><figcaption><span class="evidence-pane__label">Detail evidence</span><strong>Read the repair</strong><small>The source register opens after the observation.</small></figcaption></figure><aside class="mission-image-copy"><p class="eyebrow">Stops 9–12</p><h3>The Island's Fingerprint</h3><p>Choose a labelled detail, then match the route stop and supported period. The image is evidence, not an unlabelled hotspot.</p></aside></div><div class="mission-steps">${step === 0 ? first : `${first}<div class="step-divider" aria-hidden="true">Detail secured</div>${second}`}</div>`;
    root.querySelectorAll("[data-step-choice]").forEach((button) => button.addEventListener("click", () => choose(Number(button.dataset.stepChoice), button.dataset.choice), { signal }));
  }

  function mount() {
    root.innerHTML = shell(definition, "Museum Island", "The Island's Fingerprint", "Read a documented repair detail, then match it to the route stop and supported reopening period.");
    const saved = stateMission().progress;
    if (!isPractice() && saved?.checkpoint) { detailChoice = saved.checkpoint.detailChoice || null; buildingChoice = saved.checkpoint.buildingChoice || null; step = saved.step || 0; }
    renderBody();
    root.querySelector("[data-hint-button]").addEventListener("click", useHint, { signal });
    root.addEventListener("click", (event) => {
      if (event.target.closest("[data-review]")) store.dispatch({ type: "OPEN_MISSION", missionId: definition.id, mode: "review" });
      if (event.target.closest("[data-practice]")) store.dispatch({ type: "OPEN_MISSION", missionId: definition.id, mode: "practice" });
    }, { signal });
  }

  function render(state) {
    const completed = selectMissionStatus(state, definition.id) === "complete" && !isPractice();
    renderHeader(root, state, definition, { pending, mode: session.mode, scoreOverride: isPractice() ? score() : null, hintUsedOverride: isPractice() ? practiceHintUsed : null });
    if (!completed && !practiceComplete) renderBody();
    if (completed || practiceComplete) {
      root.querySelector("[data-reveal]").hidden = false;
      root.querySelector("[data-reveal]").innerHTML = revealMarkup(definition, "A repair can keep damage visible", "The Neues Museum was badly damaged in the Second World War. During the restoration led by David Chipperfield, visible war scars were incorporated rather than patched over; the museum reopened in 2009.", "The Staatliche Museen zu Berlin profile supports the damage, restoration, and reopening record.");
      root.querySelector("[data-completion]").hidden = false;
      root.querySelector("[data-completion]").innerHTML = completionMarkup(definition, isPractice() ? "Practice complete. Passport score unchanged." : `4 / 5 missions · Score ${formatScore(state.missions[definition.id].frozenScore)}`, session.mode);
      setFeedback(root, isPractice() ? "Practice complete. The passport remains unchanged." : "Mission complete. Detail Lens added to the passport.", "correct");
    } else {
      root.querySelector("[data-reveal]").hidden = true;
      root.querySelector("[data-completion]").hidden = true;
    }
  }

  return { mount, render, destroy() { clearModule(root); } };
}
