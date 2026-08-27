import { MISSION_CLUES, MISSION_COLLECTIBLES, MISSION_MAX_SCORE } from "./game-state.js";
import { createMission1 } from "./missions/mission-1.js";
import { createMission2 } from "./missions/mission-2.js";
import { createMission3 } from "./missions/mission-3.js";
import { createMission4 } from "./missions/mission-4.js";
import { createMission5 } from "./missions/mission-5.js";

const definitions = [
  { id: "mission-1", number: 1, title: "Three eras, one skyline", stopIds: ["stop-1", "stop-2", "stop-3"], clueId: MISSION_CLUES["mission-1"], collectible: MISSION_COLLECTIBLES["mission-1"], maxScore: MISSION_MAX_SCORE, factory: createMission1, sourceRecordIds: ["alexanderplatz-1805", "rotes-rathaus-1869", "world-clock-1969", "m1-historical-photo", "m1-current-photo"] },
  { id: "mission-2", number: 2, title: "The Lost Streets", stopIds: ["stop-4", "stop-5"], clueId: MISSION_CLUES["mission-2"], collectible: MISSION_COLLECTIBLES["mission-2"], maxScore: MISSION_MAX_SCORE, factory: createMission2, sourceRecordIds: ["m2-st-marys", "m2-marienviertel-excavations", "m2-memhardt-plan", "m2-neuer-market"] },
  { id: "mission-3", number: 3, title: "Across the Spree", stopIds: ["stop-6", "stop-7", "stop-8"], clueId: MISSION_CLUES["mission-3"], collectible: MISSION_COLLECTIBLES["mission-3"], maxScore: MISSION_MAX_SCORE, factory: createMission3, sourceRecordIds: ["m3-site-history", "m3-palace-c1900", "m3-palast-1976", "m3-humboldt-2023"] },
  { id: "mission-4", number: 4, title: "The Island's Fingerprint", stopIds: ["stop-9", "stop-10", "stop-11", "stop-12"], clueId: MISSION_CLUES["mission-4"], collectible: MISSION_COLLECTIBLES["mission-4"], maxScore: MISSION_MAX_SCORE, factory: createMission4, sourceRecordIds: ["m4-smb-neues-museum", "m4-repair-photo"] },
  { id: "mission-5", number: 5, title: "The Courtyard Lock", stopIds: ["stop-13"], clueId: MISSION_CLUES["mission-5"], collectible: MISSION_COLLECTIBLES["mission-5"], maxScore: MISSION_MAX_SCORE, factory: createMission5, sourceRecordIds: ["m5-hackesche-plan", "m5-hackesche-facts"] },
];

export const MISSION_REGISTRY = Object.freeze(definitions.map((definition) => Object.freeze({ ...definition, stopIds: Object.freeze([...definition.stopIds]), sourceRecordIds: Object.freeze([...definition.sourceRecordIds]) })));
export const getMissionDefinition = (missionId) => MISSION_REGISTRY.find((mission) => mission.id === missionId) || null;
