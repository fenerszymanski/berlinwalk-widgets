import { calculateMissionScore, selectMissionStatus } from "../game-state.js";
import { completionMarkup, clearModule, formatScore, renderHeader, revealMarkup, setFeedback, shell } from "./shared.js";

const CORRECT_A = "surviving-landmark";
const CORRECT_B = "lost-pattern";
const FINDINGS = Object.freeze(["surviving landmark", "lost street and block pattern"]);

export function createMission2(context) {
  const { root, definition, session, store, announce, toast, audio, schedule, guard, signal } = context;
  let panelA = null;
  let panelB = null;
  let pending = false;
  let practiceHintUsed = false;
  let practiceWrong = new Set();
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
    announce("Mission 2 complete. 2 of 5 missions. Score recorded. Street Key unlocked.");
    toast("Street Key unlocked.");
    render(store.getState());
    root.querySelector("[data-completion] h3")?.focus({ preventScroll: true });
  }

  function setChoice(panel, value) {
    if (pending || session.mode === "review" || practiceComplete) return;
    if (panel === "a") panelA = value; else panelB = value;
    audio.playStep();
    render(store.getState());
  }

  function submit() {
    if (pending || session.mode === "review" || practiceComplete) return;
    if (!panelA || !panelB) {
      setFeedback(root, "Assign one finding to each marked fragment before checking.", "wrong");
      announce("Assign one finding to each marked fragment before checking.");
      return;
    }
    const correct = panelA === CORRECT_A && panelB === CORRECT_B;
    const choiceId = `m2-${panelA}-${panelB}`;
    const repeated = isPractice() ? practiceWrong.has(choiceId) : stateMission().wrongChoiceIds.includes(choiceId);
    if (!correct) {
      if (isPractice()) practiceWrong.add(choiceId);
      else {
        store.dispatch({ type: "WRONG_CHOICE", missionId: definition.id, choiceId });
        if (!guard()) return;
      }
      setFeedback(root, repeated ? "That assignment is already recorded. No extra penalty." : "One or both assignments need another look. Compare the marked forms, then check again.", "wrong");
      toast(repeated ? "Same assignment. No extra penalty." : "Assignment recorded.");
      announce(repeated ? "Same assignment recorded. No extra penalty." : `Assignment recorded. Score is now ${formatScore(score())} points.`);
      audio.playError();
      render(store.getState());
      return;
    }
    if (!isPractice()) {
      store.dispatch({ type: "CHECKPOINT", missionId: definition.id, progress: { step: 1, solved: true, checkpoint: { firstChoice: panelA, secondChoice: panelB } } });
      if (!guard()) return;
    }
    pending = true;
    setFeedback(root, "Both marked fragments are assigned. Confirming the route clue.", "correct");
    toast("Route clue secured. Confirming the stamp.");
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
    setFeedback(root, "Compare form rather than labels: the church-form fragment is the surviving landmark; the block fragment records the lost street pattern.");
    toast("Hint recorded. 40 points deducted.");
    announce(`Hint used. Score is now ${formatScore(score())} points.`);
    render(store.getState());
  }

  function panelMarkup(id, label, image, alt, selected) {
    return `<figure class="evidence-panel"><div class="evidence-panel__marker" aria-hidden="true">${label}</div><img src="${image}" width="1200" height="800" alt="${alt}"><figcaption><strong>Evidence ${label}</strong><small>Marked fragment</small></figcaption><fieldset class="choice-fieldset choice-fieldset--panel"><legend>Assign one finding to Evidence ${label}</legend><div class="choice-grid choice-grid--two">${FINDINGS.map((finding, index) => { const value = index === 0 ? CORRECT_A : CORRECT_B; return `<button class="choice-button${selected === value ? " is-selected" : ""}" type="button" data-panel="${id}" data-finding="${value}">${finding}</button>`; }).join("")}</div></fieldset></figure>`;
  }

  function renderBody() {
    root.querySelector("[data-mission-body]").innerHTML = `<p class="mission-prompt">Compare the two marked fragments. Assign one finding to each.</p><div class="mission-image-grid mission-image-grid--two-panels">${panelMarkup("a", "A", "assets/mission-2/evidence-a.webp", "A marked church-form fragment with a tower, arched windows, and red roof", panelA)}${panelMarkup("b", "B", "assets/mission-2/evidence-b.webp", "A marked plan fragment with a church form, dense blocks, and a city-wall edge with street geometry", panelB)}</div><figure class="plan-overview"><img src="assets/mission-2/mission-2-plan-neutral.webp" width="1200" height="800" alt="A neutral plan texture with a church form, dense blocks, and an unlabelled city-wall edge and street geometry"><figcaption><span class="evidence-pane__label">Route plan</span><strong>Geometry without the key</strong><small>Names, title, date, and legend stay out of the play view.</small></figcaption></figure><button class="primary-button" type="button" data-check-findings>Check findings</button>`;
    root.querySelectorAll("[data-panel]").forEach((button) => button.addEventListener("click", () => setChoice(button.dataset.panel, button.dataset.finding), { signal }));
    root.querySelector("[data-check-findings]").addEventListener("click", submit, { signal });
  }

  function mount() {
    root.innerHTML = shell(definition, "Stops 4–5", "The Lost Streets", "Use the neutral plan detail and route context to place two documented traces in order.");
    const checkpoint = stateMission().progress?.checkpoint;
    if (!isPractice() && checkpoint) { panelA = checkpoint.firstChoice || null; panelB = checkpoint.secondChoice || null; }
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
      root.querySelector("[data-reveal]").innerHTML = revealMarkup(definition, "A church can outlast its surrounding streets", "St Mary's Church was first recorded in 1292. Berlin's 2014–15 excavations found late-13th-century wells, cellars, and building traces. Red-brick traces by the west entrance mark the former Neuer Markt 3–8; 1880s street works removed some medieval streets and blocks, so today's open area is not the historic condition.", "The Berlin Mitte memorial-tablet records and monument database support the church, excavation, and lost-fabric claims.");
      root.querySelector("[data-reveal]").insertAdjacentHTML("beforeend", `<img class="reveal-image" src="assets/mission-2/mission-2-reveal.webp" width="1200" height="800" alt="Historic market photograph showing a church beside a dense built edge"><p class="source-note">The historic photograph is shown only after the answer so the open-square change can be read in context.</p>`);
      root.querySelector("[data-completion]").hidden = false;
      root.querySelector("[data-completion]").innerHTML = completionMarkup(definition, isPractice() ? "Practice complete. Passport score unchanged." : `2 / 5 missions · Score ${formatScore(state.missions[definition.id].frozenScore)}`, session.mode);
      setFeedback(root, isPractice() ? "Practice complete. The passport remains unchanged." : "Mission complete. Street Key added to the passport.", "correct");
    } else {
      root.querySelector("[data-reveal]").hidden = true;
      root.querySelector("[data-completion]").hidden = true;
    }
  }

  return { mount, render, destroy() { clearModule(root); } };
}
