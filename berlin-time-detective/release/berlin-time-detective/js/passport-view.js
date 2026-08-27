import { MISSION_COLLECTIBLES, MISSION_IDS, calculateMissionScore, selectCompletedMissionIds, selectMissionClueText, selectTotalScore } from "./game-state.js";
import { MISSION_REGISTRY } from "./mission-registry.js";

export function createPassportView({ triggerCount, listRoot }) {
  let snapshot = null;

  function render(state) {
    snapshot = state;
    const completed = new Set(selectCompletedMissionIds(state));
    triggerCount.textContent = `${completed.size} / 5 missions`;
    listRoot.innerHTML = MISSION_IDS.map((missionId) => {
      const definition = MISSION_REGISTRY.find((mission) => mission.id === missionId);
      const mission = state.missions[missionId];
      const done = completed.has(missionId);
      const collectible = MISSION_COLLECTIBLES[missionId];
      return `<article class="passport-entry ${done ? "is-complete" : "is-locked"}" data-mission-id="${missionId}">
        <div class="passport-entry__number">${String(definition.number).padStart(2, "0")}</div>
        <div class="passport-entry__art">${done ? `<img src="${collectible.image}" width="640" height="640" alt="${collectible.name} collectible">` : `<span aria-hidden="true">LOCKED</span>`}</div>
        <div class="passport-entry__copy"><p class="eyebrow">Mission ${definition.number}</p><h3>${done ? collectible.name : definition.title}</h3><p>${done ? selectMissionClueText(missionId) : `${definition.stopIds.length} route ${definition.stopIds.length === 1 ? "place" : "places"} waiting.`}</p>${done ? `<span class="mono-label">Frozen score ${String(calculateMissionScore(mission)).padStart(4, "0")}</span>` : ""}</div>
      </article>`;
    }).join("");
    const total = selectTotalScore(state);
    listRoot.closest(".passport-modal-card")?.querySelector("[data-passport-total]")?.replaceChildren(document.createTextNode(`Committed score ${String(total).padStart(4, "0")} / 1000`));
  }

  return { render, getState: () => snapshot, getCompletedCount: () => (snapshot ? selectCompletedMissionIds(snapshot).length : 0) };
}
