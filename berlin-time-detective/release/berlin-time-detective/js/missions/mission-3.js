import { calculateMissionScore, selectMissionStatus } from "../game-state.js";
import { completionMarkup, clearModule, formatScore, renderHeader, revealMarkup, setFeedback, shell } from "./shared.js";

const ITEMS = Object.freeze({
  palace: { label: "Layer A", image: "assets/mission-3/evidence-a.webp", alt: "A long stone facade with repeated windows" },
  palast: { label: "Layer B", image: "assets/mission-3/evidence-b.webp", alt: "A broad facade with a glassy horizontal rhythm" },
  humboldt: { label: "Layer C", image: "assets/mission-3/evidence-c.webp", alt: "A pale facade with repeated openings and a dome in the distance" },
});
const LAYER_TOKENS = Object.freeze({ palace: "layer-a", palast: "layer-b", humboldt: "layer-c" });
const TOKEN_TO_LAYER = Object.freeze(Object.fromEntries(Object.entries(LAYER_TOKENS).map(([id, token]) => [token, id])));
const CORRECT_ORDER = ["palace", "palast", "humboldt"];

export function createMission3(context) {
  const { root, definition, session, store, announce, toast, audio, schedule, guard, signal } = context;
  let order = ["palast", "humboldt", "palace"];
  let pending = false;
  let practiceWrong = new Set();
  let practiceHintUsed = false;
  let practiceComplete = false;

  function stateMission() { return store.getState().missions[definition.id]; }
  function isPractice() { return session.mode === "practice"; }
  function score() { return isPractice() ? Math.max(0, 200 - (practiceHintUsed ? 40 : 0) - practiceWrong.size * 25) : calculateMissionScore(stateMission()); }

  function sameOrder() { return order.every((item, index) => item === CORRECT_ORDER[index]); }

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
    announce("Mission 3 complete. 3 of 5 missions. Score recorded. Spree Keystone unlocked.");
    toast("Spree Keystone unlocked.");
    render(store.getState());
    root.querySelector("[data-completion] h3")?.focus({ preventScroll: true });
  }

  function move(id, direction) {
    if (pending || session.mode === "review" || practiceComplete) return;
    const index = order.indexOf(id);
    const target = direction === "earlier" ? index - 1 : index + 1;
    if (index < 0 || target < 0 || target >= order.length) return;
    [order[index], order[target]] = [order[target], order[index]];
    audio.playStep();
    render(store.getState());
  }

  function submit() {
    if (pending || session.mode === "review" || practiceComplete) return;
    const choiceId = `order-${order.join("-")}`;
    const repeated = isPractice() ? practiceWrong.has(choiceId) : stateMission().wrongChoiceIds.includes(choiceId);
    if (!sameOrder()) {
      if (isPractice()) practiceWrong.add(choiceId);
      else {
        store.dispatch({ type: "WRONG_CHOICE", missionId: definition.id, choiceId });
        if (!guard()) return;
      }
      setFeedback(root, repeated ? "That order is already recorded. No extra penalty." : "That sequence skips a change in the site. Move the layers earlier or later and check again.", "wrong");
      toast(repeated ? "Same order. No extra penalty." : "Order recorded.");
      announce(repeated ? "Same order recorded. No extra penalty." : `Order observation recorded. Score is now ${formatScore(score())} points.`);
      audio.playError();
      render(store.getState());
      return;
    }
    if (!isPractice()) {
      store.dispatch({ type: "CHECKPOINT", missionId: definition.id, progress: { step: 1, solved: true, checkpoint: { order: [...order] } } });
      if (!guard()) return;
    }
    pending = true;
    setFeedback(root, "Sequence secured. Confirming the site clue.", "correct");
    toast("Sequence secured. Confirming the stamp.");
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
    setFeedback(root, "Start with the completed Baroque palace, then the 1976 replacement, then the 2020 Humboldt Forum.");
    toast("Hint recorded. 40 points deducted.");
    announce(`Hint used. Score is now ${formatScore(score())} points.`);
    render(store.getState());
  }

  function renderBody() {
    root.querySelector("[data-mission-body]").innerHTML = `<div class="mission-image-grid mission-image-grid--layers"><div class="layer-stack" role="list" aria-label="Three evidence layers">${order.map((id, index) => `<article class="layer-card" role="listitem" data-layer-id="${LAYER_TOKENS[id]}"><div class="layer-card__number">${index + 1}</div><img src="${ITEMS[id].image}" width="1200" height="800" alt="${ITEMS[id].alt}"><div class="layer-card__copy"><span class="mono-label">${ITEMS[id].label}</span><strong>Evidence layer</strong><div class="layer-card__controls"><button class="small-button" type="button" data-move="earlier" data-layer="${LAYER_TOKENS[id]}" aria-label="Move ${ITEMS[id].label} earlier" ${index === 0 ? "disabled" : ""}>Move earlier</button><button class="small-button" type="button" data-move="later" data-layer="${LAYER_TOKENS[id]}" aria-label="Move ${ITEMS[id].label} later" ${index === order.length - 1 ? "disabled" : ""}>Move later</button></div></div></article>`).join("")}</div><aside class="mission-image-copy"><p class="eyebrow">Stops 6–8</p><h3>Across the Spree</h3><p>Place three documentary layers in route order. The open site between them is part of the evidence, not a missing photograph.</p><div class="mini-source-card"><span class="mono-label">Accessible alternative</span><span>Use Move earlier / Move later, then Check sequence.</span></div></aside></div><button class="primary-button" type="button" data-check-order>Check sequence</button>`;
    root.querySelectorAll("[data-move]").forEach((button) => button.addEventListener("click", () => move(TOKEN_TO_LAYER[button.dataset.layer], button.dataset.move), { signal }));
    root.querySelector("[data-check-order]").addEventListener("click", submit, { signal });
  }

  function mount() {
    root.innerHTML = shell(definition, "Marx–Engels-Forum · Liebknecht Bridge · Humboldt Forum", "Across the Spree", "Arrange three source-backed site layers in the order supported by the historical record. Use the move buttons; no drag is required.");
    const checkpoint = stateMission().progress?.checkpoint;
    if (!isPractice() && Array.isArray(checkpoint?.order) && checkpoint.order.length === 3) order = [...checkpoint.order];
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
      root.querySelector("[data-reveal]").innerHTML = revealMarkup(definition, "The site carries more than one building", "The Baroque Berlin Palace was completed in 1716 and badly damaged in 1945. Its remains were removed in 1950–51; the site then moved through parade and open uses. The Palace of the Republic opened in 1976 and was demolished by 2008. After archaeology and an interim lawn, the Humboldt Forum was completed in 2020 as a modern Franco Stella building with reconstructed Baroque façades.", "The Humboldt Forum's official History of the Site feature supports the sequence and the interim periods.");
      root.querySelector("[data-completion]").hidden = false;
      root.querySelector("[data-completion]").innerHTML = completionMarkup(definition, isPractice() ? "Practice complete. Passport score unchanged." : `3 / 5 missions · Score ${formatScore(state.missions[definition.id].frozenScore)}`, session.mode);
      setFeedback(root, isPractice() ? "Practice complete. The passport remains unchanged." : "Mission complete. Spree Keystone added to the passport.", "correct");
    } else {
      root.querySelector("[data-reveal]").hidden = true;
      root.querySelector("[data-completion]").hidden = true;
    }
  }

  return { mount, render, destroy() { clearModule(root); } };
}
