import { calculateMissionScore, MISSION_COLLECTIBLES, selectMissionStatus } from "../game-state.js";
import { selectMissionClueText } from "../game-state.js";

export function formatScore(score) {
  return String(Math.max(0, Math.round(score))).padStart(4, "0");
}

export function shell(definition, eyebrow, title, instruction) {
  return `<article class="mission-card" data-mission-id="${definition.id}">
    <header class="mission-card__header">
      <div><p class="eyebrow">Mission ${definition.number} of 5 · ${eyebrow}</p><h2 data-mission-heading tabindex="-1">${title}</h2><p class="mission-card__task-label">Your task</p><p class="mission-card__instruction">${instruction}</p></div>
      <div class="mission-card__status"><span class="status-chip" data-mode-label>Evidence</span><span class="mono-label" data-score-label>200 points possible</span></div>
    </header>
    <div class="mission-card__body" data-mission-body></div>
    <footer class="mission-card__footer"><button class="outline-button" type="button" data-hint-button>Hint <span class="button-detail">−40</span></button><p class="mission-feedback" data-feedback aria-live="off">Use the task above, then make one choice to continue.</p><span class="mission-card__footer-note">Wrong choices add context. They never block the route.</span></footer>
    <section class="mission-reveal" data-reveal hidden></section>
    <section class="mission-completion" data-completion hidden></section>
  </article>`;
}

export function renderHeader(root, state, definition, { pending = false, mode = "play", scoreOverride = null, hintUsedOverride = null } = {}) {
  const mission = state.missions[definition.id];
  const completed = mode !== "practice" && selectMissionStatus(state, definition.id) === "complete";
  const label = root.querySelector("[data-mode-label]");
  const score = root.querySelector("[data-score-label]");
  const hint = root.querySelector("[data-hint-button]");
  if (label) {
    label.textContent = mode === "practice" ? "Practice" : mode === "review" ? "Review only" : completed ? "Complete" : pending ? "Confirming" : "Evidence";
    label.classList.toggle("is-complete", completed);
  }
  if (score) score.textContent = completed ? `Frozen score ${formatScore(mission.frozenScore)}` : `${formatScore(Number.isFinite(scoreOverride) ? scoreOverride : calculateMissionScore(mode === "practice" ? { hintUsed: false, wrongChoiceIds: [] } : mission))} points possible`;
  if (hint) {
    hint.hidden = mode === "review" || completed;
    hint.disabled = mode === "review" || completed || pending || (mode === "practice" ? Boolean(hintUsedOverride) : mission.hintUsed);
    hint.innerHTML = (mode === "practice" ? hintUsedOverride : mission.hintUsed) ? "Hint used" : "Hint <span class=\"button-detail\">−40</span>";
  }
  root.dataset.mode = mode === "practice" ? "practice" : completed ? "complete" : pending ? "pending" : "evidence";
}

export function revealMarkup(definition, title, body, sourceNote) {
  return `<div class="mission-reveal__copy"><p class="eyebrow">Source-backed reveal</p><h3>${title}</h3><p>${body}</p><p class="source-note">${sourceNote}</p></div><div class="mission-reveal__seal" aria-label="Mission complete">Evidence<br>secured</div>`;
}

export function completionMarkup(definition, summary, mode = "play") {
  const collectible = MISSION_COLLECTIBLES[definition.id];
  const nextMission = definition.number < 5 ? `mission-${definition.number + 1}` : null;
  const continueButton = mode === "play" && nextMission ? `<button class="primary-button" type="button" data-continue-mission="${nextMission}">Continue to Mission ${definition.number + 1}</button>` : "";
  return `<div class="completion-art"><img src="${collectible.image}" width="640" height="640" alt="${collectible.name} collectible"></div><div class="completion-copy"><p class="eyebrow">Clue collected · Mission ${definition.number} complete</p><h3>${collectible.name} unlocked</h3><p data-completion-summary>${summary}</p><p data-completion-clue>${selectMissionClueText(definition.id)}</p><div class="completion-actions">${continueButton}<button class="outline-button" type="button" data-review>Review mission</button><button class="text-button" type="button" data-practice>Practice without changing the passport</button></div></div>`;
}

export function setFeedback(root, text, kind = "") {
  const feedback = root.querySelector("[data-feedback]");
  if (!feedback) return;
  feedback.textContent = text;
  feedback.classList.toggle("is-wrong", kind === "wrong");
  feedback.classList.toggle("is-correct", kind === "correct");
}

export function clearModule(root) { root.replaceChildren(); }
