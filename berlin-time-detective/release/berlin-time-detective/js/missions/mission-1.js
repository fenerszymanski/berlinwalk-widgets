import { calculateMissionScore, selectMissionStatus } from "../game-state.js";
import { completionMarkup, clearModule, formatScore, renderHeader, revealMarkup, setFeedback, shell } from "./shared.js";

const TARGET_YEAR = 1969;

export function createMission1(context) {
  const { root, definition, session, store, announce, toast, audio, schedule, guard, signal } = context;
  let selectedYear = 1900;
  let pending = false;
  let practiceHintUsed = false;
  let practiceWrong = new Set();
  let practiceComplete = false;

  function mission() { return store.getState().missions[definition.id]; }
  function isPractice() { return session.mode === "practice"; }
  function localScore() { return Math.max(0, 200 - (practiceHintUsed ? 40 : 0) - practiceWrong.size * 25); }

  function setYear(value) {
    selectedYear = Number(value);
    const slider = root.querySelector("[data-year-slider]");
    const output = root.querySelector("[data-selected-year]");
    if (slider) slider.value = String(selectedYear);
    if (output) output.textContent = String(selectedYear);
    root.querySelectorAll("[data-year-choice]").forEach((button) => button.classList.toggle("is-selected", Number(button.dataset.yearChoice) === selectedYear));
  }

  function disableInputs(disabled) {
    root.querySelectorAll("[data-year-slider], [data-year-choice], [data-submit-year]").forEach((element) => { element.disabled = disabled; });
  }

  function complete() {
    if (!guard() || !pending) return;
    pending = false;
    if (isPractice()) {
      practiceComplete = true;
      audio.playSuccess();
      announce("Practice complete. The passport is unchanged.");
      toast("Practice complete. Passport unchanged.");
      render(store.getState());
      root.querySelector("[data-completion] h3")?.focus({ preventScroll: true });
      return;
    }
    store.dispatch({ type: "CHECKPOINT", missionId: definition.id, progress: { step: 1, solved: true, checkpoint: { year: TARGET_YEAR } } });
    if (!guard()) return;
    store.dispatch({ type: "COMPLETE_MISSION", missionId: definition.id, clueId: definition.clueId });
    if (!guard()) return;
    audio.playSuccess();
    announce("Mission 1 complete. 1 of 5 missions. Score recorded. Time Gear unlocked.");
    toast("Time Gear unlocked.");
    render(store.getState());
    root.querySelector("[data-completion] h3")?.focus({ preventScroll: true });
  }

  function submit() {
    if (pending || practiceComplete || session.mode === "review") return;
    if (selectedYear === TARGET_YEAR) {
      pending = true;
      setFeedback(root, "Evidence secured. Confirming the record.", "correct");
      disableInputs(true);
      toast("Evidence secured. Confirming the record.");
      schedule(complete, 420);
      render(store.getState());
      return;
    }
    const choiceId = `year-${selectedYear}`;
    const before = mission();
    const repeated = isPractice() ? practiceWrong.has(choiceId) : before.wrongChoiceIds.includes(choiceId);
    if (isPractice()) practiceWrong.add(choiceId);
    else {
      store.dispatch({ type: "WRONG_CHOICE", missionId: definition.id, choiceId });
      if (!guard()) return;
    }
    const score = isPractice() ? localScore() : calculateMissionScore(mission());
    const observation = selectedYear < TARGET_YEAR
      ? "That year leaves the skyline in an earlier layer. Look for the metal sphere and the red clinker city hall."
      : "That year belongs to a later layer. Compare the materials and skyline evidence, then try another candidate.";
    setFeedback(root, repeated ? "That observation is already on the case sheet. No extra penalty." : observation, "wrong");
    toast(repeated ? "Same observation. No extra penalty." : "Observation recorded. The case stays open.");
    announce(repeated ? "Same observation recorded. No extra penalty." : `Observation recorded for ${selectedYear}. Score is now ${formatScore(score)} points.`);
    audio.playError();
    render(store.getState());
  }

  function useHint() {
    if (session.mode === "review" || pending || practiceComplete) return;
    if (isPractice()) {
      if (practiceHintUsed) return;
      practiceHintUsed = true;
    } else {
      store.dispatch({ type: "USE_HINT", missionId: definition.id });
      if (!guard()) return;
    }
    setFeedback(root, "Start with materials. The red clinker city hall marks the civic centre. The metal sphere belongs to the later skyline.");
    toast("Hint recorded. 40 points deducted.");
    announce(`Hint used. Score is now ${formatScore(isPractice() ? localScore() : calculateMissionScore(mission()))} points.`);
    render(store.getState());
  }

  function mount() {
    root.innerHTML = shell(definition, "Alexanderplatz", "Set the city's time", "Compare the documentary views and identify the archive year associated with the TV Tower and World Clock era.");
    root.querySelector("[data-mission-body]").innerHTML = `<div class="evidence-viewer" aria-label="Two documentary evidence views">
      <figure class="evidence-pane"><img src="assets/mission-1/mission-1-historical.webp" width="1200" height="800" alt="Archive evidence: a World Clock construction photograph in Berlin"><figcaption><span class="evidence-pane__label">Archive evidence</span><strong>Archive</strong><small>World Clock under construction</small></figcaption></figure>
      <figure class="evidence-pane"><img src="assets/mission-1/mission-1-current.webp" width="1200" height="800" alt="Contemporary evidence photographed in June 2023: the Television Tower and Rotes Rathaus in Berlin"><figcaption><span class="evidence-pane__label">Contemporary evidence</span><strong>June 2023</strong><small>TV Tower beside the civic centre</small></figcaption></figure>
      <div class="evidence-divider" aria-hidden="true"><span>Archive</span></div>
    </div>
    <section class="timeline-panel" aria-labelledby="year-panel-title"><div class="timeline-panel__heading"><div><span class="eyebrow">Evidence year</span><h3 id="year-panel-title">Set the archive year</h3></div><output class="selected-year" data-selected-year for="year-slider">1900</output></div>
      <input id="year-slider" data-year-slider class="year-slider" type="range" min="1900" max="2024" step="1" value="1900" aria-label="Archive evidence year">
      <div class="timeline-scale" aria-hidden="true"><span>1900</span><span>1930</span><span>1960</span><span>1989</span><span>2024</span></div>
      <div class="year-actions" role="group" aria-label="Candidate archive years"><button class="year-button" type="button" data-year-choice="1900">1900</button><button class="year-button" type="button" data-year-choice="1939">1939</button><button class="year-button" type="button" data-year-choice="1969">1969</button><button class="year-button" type="button" data-year-choice="1989">1989</button><button class="year-button" type="button" data-year-choice="2024">2024</button></div>
      <button class="primary-button timeline-submit" type="button" data-submit-year>Set year</button>
    </section>
    <div class="mission-lower-grid"><section class="clue-card"><span class="eyebrow">Field note</span><h3>Materials leave a trail</h3><p>Look for the red clinker city hall, then the metal sphere that changes the skyline.</p></section><aside class="mission-note"><span class="eyebrow">Your move</span><p>Set a year. A wrong year records one useful observation and keeps the case open.</p><span class="mission-feedback-quiet">No drag required.</span></aside></div>`;
    root.querySelector("[data-year-slider]").addEventListener("input", (event) => { setYear(event.target.value); audio.playStep(); }, { signal });
    root.querySelectorAll("[data-year-choice]").forEach((button) => button.addEventListener("click", () => { setYear(button.dataset.yearChoice); audio.playStep(); }, { signal }));
    root.querySelector("[data-submit-year]").addEventListener("click", submit, { signal });
    root.querySelector("[data-hint-button]").addEventListener("click", useHint, { signal });
    root.addEventListener("click", (event) => {
      if (event.target.closest("[data-review]")) store.dispatch({ type: "OPEN_MISSION", missionId: definition.id, mode: "review" });
      if (event.target.closest("[data-practice]")) store.dispatch({ type: "OPEN_MISSION", missionId: definition.id, mode: "practice" });
    }, { signal });
    setYear(1900);
  }

  function render(state) {
    const status = selectMissionStatus(state, definition.id);
    const completed = status === "complete" && !isPractice();
    renderHeader(root, state, definition, { pending, mode: session.mode, scoreOverride: isPractice() ? localScore() : null, hintUsedOverride: isPractice() ? practiceHintUsed : null });
    if (completed || practiceComplete) {
      root.querySelector("[data-reveal]").hidden = false;
      root.querySelector("[data-reveal]").innerHTML = revealMarkup(definition, "The centre changed in layers", "In 1805, the cattle market and parade ground outside Berlin's city wall received the name Alexanderplatz. The Rotes Rathaus was completed in 1869. A century later, the TV Tower and World Clock became landmarks of East Berlin's redesigned centre.", "These are evidence views from different moments, not a same-viewpoint alignment.");
      root.querySelector("[data-completion]").hidden = false;
      root.querySelector("[data-completion]").innerHTML = completionMarkup(definition, isPractice() ? "Practice complete. Passport score unchanged." : `1 / 5 missions · Score ${formatScore(state.missions[definition.id].frozenScore)}`, session.mode);
      disableInputs(true);
      setFeedback(root, isPractice() ? "Practice complete. The passport remains unchanged." : "Mission complete. The clue is now part of the passport.", "correct");
    } else {
      root.querySelector("[data-reveal]").hidden = true;
      root.querySelector("[data-completion]").hidden = true;
      disableInputs(pending);
    }
    setYear(selectedYear);
  }

  return { mount, render, destroy() { clearModule(root); } };
}
