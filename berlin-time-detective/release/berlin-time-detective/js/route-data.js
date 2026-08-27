export const MAP_BOUNDS = Object.freeze({
  west: 13.3978271484375,
  east: 13.4197998046875,
  north: 52.52958999943302,
  south: 52.516220863930734,
});

export const AUTHENTIC_STOPS = Object.freeze([
  Object.freeze({ id: "stop-1", number: 1, name: "Alexanderplatz", lat: 52.5219, lon: 13.4132, missionId: "mission-1" }),
  Object.freeze({ id: "stop-2", number: 2, name: "Rotes Rathaus", lat: 52.5186, lon: 13.4085, missionId: "mission-1" }),
  Object.freeze({ id: "stop-3", number: 3, name: "Neptune Fountain & TV Tower", lat: 52.5196111, lon: 13.4068611, missionId: "mission-1" }),
  Object.freeze({ id: "stop-4", number: 4, name: "St. Mary's Church", lat: 52.5205347, lon: 13.4071243, missionId: "mission-2" }),
  Object.freeze({ id: "stop-5", number: 5, name: "Marienviertel", lat: 52.520294, lon: 13.405970, missionId: "mission-2" }),
  Object.freeze({ id: "stop-6", number: 6, name: "Marx-Engels-Forum", lat: 52.518555, lon: 13.404640, missionId: "mission-3" }),
  Object.freeze({ id: "stop-7", number: 7, name: "Liebknecht Bridge", lat: 52.518611, lon: 13.402222, missionId: "mission-3" }),
  Object.freeze({ id: "stop-8", number: 8, name: "Humboldt Forum", lat: 52.5172402, lon: 13.4016459, missionId: "mission-3" }),
  Object.freeze({ id: "stop-9", number: 9, name: "Berliner Dom", lat: 52.5191, lon: 13.4013, missionId: "mission-4" }),
  Object.freeze({ id: "stop-10", number: 10, name: "Altes Museum", lat: 52.5199, lon: 13.3998, missionId: "mission-4" }),
  Object.freeze({ id: "stop-11", number: 11, name: "National Gallery & Neues Museum", lat: 52.5205, lon: 13.3980, missionId: "mission-4" }),
  Object.freeze({ id: "stop-12", number: 12, name: "Friedrichsbrücke", lat: 52.52058, lon: 13.40037, missionId: "mission-4" }),
  Object.freeze({ id: "stop-13", number: 13, name: "Hackescher Markt", lat: 52.5230, lon: 13.4028, missionId: "mission-5" }),
]);

export const MISSION_GROUPS = Object.freeze([
  Object.freeze({ id: "mission-1", number: 1, title: "Three eras, one skyline", stopIds: Object.freeze(["stop-1", "stop-2", "stop-3"]), available: true }),
  Object.freeze({ id: "mission-2", number: 2, title: "The Lost Streets", stopIds: Object.freeze(["stop-4", "stop-5"]), available: false }),
  Object.freeze({ id: "mission-3", number: 3, title: "Across the Spree", stopIds: Object.freeze(["stop-6", "stop-7", "stop-8"]), available: false }),
  Object.freeze({ id: "mission-4", number: 4, title: "The Island's Fingerprint", stopIds: Object.freeze(["stop-9", "stop-10", "stop-11", "stop-12"]), available: false }),
  Object.freeze({ id: "mission-5", number: 5, title: "The Courtyard Lock", stopIds: Object.freeze(["stop-13"]), available: false }),
]);

export const MISSION_IDS = Object.freeze(MISSION_GROUPS.map((mission) => mission.id));

export function getStop(stopId) {
  return AUTHENTIC_STOPS.find((stop) => stop.id === stopId) || null;
}

export function getMission(missionId) {
  return MISSION_GROUPS.find((mission) => mission.id === missionId) || null;
}
