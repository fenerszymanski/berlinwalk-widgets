import { AUTHENTIC_STOPS, MAP_BOUNDS } from "./route-data.js";
import { MISSION_REGISTRY } from "./mission-registry.js";
import { selectCompletedMissionIds, selectMissionStatus } from "./game-state.js";

function percent(value, min, max) {
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

function completedPlaceCount(completedMissionIds) {
  return completedMissionIds.reduce((count, missionId) => count + (MISSION_REGISTRY.find((mission) => mission.id === missionId)?.stopIds.length || 0), 0);
}

function publicStopName(stop, completedMissionIds) {
  if (stop.id === "stop-11" && !completedMissionIds.includes("mission-4")) return "Museum Island galleries";
  return stop.name;
}

export function createMapView({ listRoot, mapRoot, pinsRoot, mapCard, progressRoot, onMissionOpen }) {
  const abortController = new AbortController();
  let lastState = null;

  function render(state) {
    lastState = state;
    const completedMissions = selectCompletedMissionIds(state);
    const completedStops = new Set(completedMissions.flatMap((missionId) => MISSION_REGISTRY.find((mission) => mission.id === missionId)?.stopIds || []));
    const activeMissionId = state.view.activeMissionId;
    listRoot.innerHTML = MISSION_REGISTRY.map((mission) => {
      const status = selectMissionStatus(state, mission.id);
      const isActive = activeMissionId === mission.id && ["mission", "mission-complete", "mission-review"].includes(state.view.screen);
      const statusLabel = status === "complete" ? "clue collected" : isActive ? "in progress" : status === "available" ? "next" : "locked";
      const stopLabels = mission.stopIds.map((stopId) => {
        const stop = AUTHENTIC_STOPS.find((item) => item.id === stopId);
        return stop ? publicStopName(stop, completedMissions) : stopId;
      }).join(" · ");
      return `<li class="route-mission route-mission--${status}" data-mission-id="${mission.id}">
        <button class="route-mission__button${activeMissionId === mission.id ? " is-active" : ""}" type="button" data-mission-id="${mission.id}" ${status === "locked" ? "disabled" : ""} aria-label="Mission ${mission.number}: ${mission.title}, ${statusLabel}">
          <span class="route-mission__number" aria-hidden="true">${String(mission.number).padStart(2, "0")}</span>
          <span class="route-mission__copy"><strong>${mission.title}</strong><small>${stopLabels}</small></span>
          <span class="route-mission__state">${status === "complete" ? "Clue collected" : isActive ? "In progress" : status === "available" ? "Next" : "Locked"}</span>
        </button>
      </li>`;
    }).join("");

    pinsRoot.innerHTML = AUTHENTIC_STOPS.map((stop) => {
      const left = percent(stop.lon, MAP_BOUNDS.west, MAP_BOUNDS.east);
      const top = percent(MAP_BOUNDS.north - stop.lat, 0, MAP_BOUNDS.north - MAP_BOUNDS.south);
      const status = completedStops.has(stop.id) ? "complete" : stop.missionId === activeMissionId ? "active" : selectMissionStatus(state, stop.missionId) === "available" ? "next" : "locked";
      return `<span class="map-pin map-pin--${status}" data-stop-id="${stop.id}" style="left:${left}%;top:${top}%;"><span class="sr-only">Stop ${stop.number}: ${publicStopName(stop, completedMissions)}, ${status}</span></span>`;
    }).join("");

    const places = completedPlaceCount(completedMissions);
    mapRoot.dataset.completedPlaces = String(places);
    mapRoot.dataset.completedMissions = String(completedMissions.length);
    mapRoot.className = `route-map route-map--progress-${places}`;
    mapCard.dataset.completedPlaces = String(places);
    mapCard.classList.toggle("route-map-card--transformed", places > 0);
    progressRoot.textContent = `${places} / 13 places · ${completedMissions.length} / 5 missions`;
  }

  listRoot.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-mission-id]");
    if (!button || button.disabled || !lastState) return;
    const missionId = button.dataset.missionId;
    if (selectMissionStatus(lastState, missionId) !== "locked") onMissionOpen(missionId);
  }, { signal: abortController.signal });

  return {
    render,
    getMapGeometry() {
      return AUTHENTIC_STOPS.map((stop) => ({ id: stop.id, left: percent(stop.lon, MAP_BOUNDS.west, MAP_BOUNDS.east), top: percent(MAP_BOUNDS.north - stop.lat, 0, MAP_BOUNDS.north - MAP_BOUNDS.south) }));
    },
    destroy() { abortController.abort(); },
  };
}
