/**
 * Berlin Hotel Location Checker — deterministic location-fit model.
 *
 * This module scores a point in Berlin against fixed, source-backed planning
 * anchors. It intentionally does not score the hotel, the neighbourhood's
 * safety, or a live transit journey.
 */

export const BERLIN_BBOX = Object.freeze({
  south: 52.3,
  north: 52.72,
  west: 12.98,
  east: 13.82,
});

export const PRIORITIES = Object.freeze([
  Object.freeze({
    id: 'sightseeing',
    label: 'First-time sightseeing',
    shortLabel: 'Sightseeing',
    description: 'Historic centre, museums and the first Berlin orientation walk.',
  }),
  Object.freeze({
    id: 'transport',
    label: 'Easy public transport',
    shortLabel: 'Public transport',
    description: 'A practical base near several fixed transport anchors.',
  }),
  Object.freeze({
    id: 'ber',
    label: 'BER Airport connection',
    shortLabel: 'BER connection',
    description: 'Less geographical friction for the airport leg.',
  }),
  Object.freeze({
    id: 'nightlife',
    label: 'Nightlife',
    shortLabel: 'Nightlife',
    description: 'Closer to established evening areas in Kreuzberg and Friedrichshain.',
  }),
  Object.freeze({
    id: 'quiet',
    label: 'Quiet evenings',
    shortLabel: 'Quiet evenings',
    description: 'Closer to parks and lower-intensity evening anchors.',
  }),
  Object.freeze({
    id: 'meeting',
    label: 'BerlinWalk meeting point',
    shortLabel: 'Meeting point',
    description: 'A simpler start for the BerlinWalk tour at Alexanderplatz.',
  }),
]);

export const DEFAULT_PRIORITY_IDS = Object.freeze(['sightseeing', 'transport', 'meeting']);

const WORLD_CLOCK = Object.freeze({
  id: 'world-clock',
  label: 'World Clock at Alexanderplatz',
  lat: 52.521918,
  lon: 13.413215,
});

const BER_AIRPORT = Object.freeze({
  id: 'ber-airport',
  label: 'BER Airport planning anchor',
  lat: 52.3667,
  lon: 13.5033,
});

const ANCHORS = Object.freeze({
  sightseeing: Object.freeze([
    WORLD_CLOCK,
    { id: 'museum-island', label: 'Museum Island', lat: 52.5169, lon: 13.4017 },
    { id: 'brandenburg-gate', label: 'Brandenburg Gate', lat: 52.5163, lon: 13.3777 },
    { id: 'hackescher-markt', label: 'Hackescher Markt', lat: 52.5221, lon: 13.4027 },
    { id: 'east-side-gallery', label: 'East Side Gallery', lat: 52.505, lon: 13.4397 },
  ]),
  transport: Object.freeze([
    { id: 'alexanderplatz-station', label: 'Alexanderplatz station', lat: 52.5218, lon: 13.4132 },
    { id: 'friedrichstrasse-station', label: 'Friedrichstraße station', lat: 52.5200, lon: 13.3869 },
    { id: 'berlin-hbf', label: 'Berlin Hauptbahnhof', lat: 52.5251, lon: 13.3694 },
    { id: 'ostkreuz-station', label: 'Ostkreuz station', lat: 52.5034, lon: 13.4692 },
    { id: 'suedkreuz-station', label: 'Südkreuz station', lat: 52.4756, lon: 13.3651 },
  ]),
  nightlife: Object.freeze([
    { id: 'oranienstrasse', label: 'Oranienstraße / Kreuzberg', lat: 52.5021, lon: 13.4219 },
    { id: 'raw-gelaende', label: 'RAW-Gelände / Friedrichshain', lat: 52.5075, lon: 13.4548 },
    { id: 'boxhagener-platz', label: 'Boxhagener Platz', lat: 52.5116, lon: 13.4549 },
    { id: 'nollendorfplatz', label: 'Nollendorfplatz', lat: 52.4994, lon: 13.3538 },
  ]),
  quiet: Object.freeze([
    { id: 'tiergarten', label: 'Tiergarten', lat: 52.5145, lon: 13.3501 },
    { id: 'tempelhofer-feld', label: 'Tempelhofer Feld', lat: 52.473, lon: 13.4036 },
    { id: 'viktoriapark', label: 'Viktoriapark', lat: 52.4887, lon: 13.3813 },
    { id: 'treptower-park', label: 'Treptower Park', lat: 52.4862, lon: 13.4691 },
    { id: 'charlottenburg-palace', label: 'Charlottenburg Palace gardens', lat: 52.5200, lon: 13.2950 },
  ]),
  neighborhoods: Object.freeze([
    { id: 'central', label: 'Mitte / Alexanderplatz', lat: 52.521918, lon: 13.413215 },
    { id: 'west', label: 'Charlottenburg / West Berlin', lat: 52.505, lon: 13.332 },
    { id: 'nightlife', label: 'Friedrichshain / Kreuzberg', lat: 52.5075, lon: 13.4548 },
    { id: 'south', label: 'Neukölln / Tempelhof', lat: 52.473, lon: 13.4036 },
    { id: 'airport', label: 'BER / southeast edge', lat: 52.3667, lon: 13.5033 },
    { id: 'north', label: 'Wedding / north Mitte', lat: 52.5351, lon: 13.3903 },
  ]),
});

export const LOCATION_ANCHORS = ANCHORS;
export const BER_ANCHOR = BER_AIRPORT;
export const MEETING_POINT_ANCHOR = WORLD_CLOCK;

const PRIORITY_BY_ID = new Map(PRIORITIES.map((priority) => [priority.id, priority]));

function finiteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function roundTo(value, decimals = 0) {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function haversineKm(first, second) {
  const firstLat = finiteNumber(first?.lat ?? first?.latitude);
  const firstLon = finiteNumber(first?.lon ?? first?.lng ?? first?.longitude);
  const secondLat = finiteNumber(second?.lat ?? second?.latitude);
  const secondLon = finiteNumber(second?.lon ?? second?.lng ?? second?.longitude);
  if ([firstLat, firstLon, secondLat, secondLon].some((value) => value === null)) {
    throw new TypeError('Both locations need finite latitude and longitude values.');
  }

  const earthRadiusKm = 6371.0088;
  const toRadians = (degrees) => degrees * Math.PI / 180;
  const deltaLat = toRadians(secondLat - firstLat);
  const deltaLon = toRadians(secondLon - firstLon);
  const a = Math.sin(deltaLat / 2) ** 2
    + Math.cos(toRadians(firstLat)) * Math.cos(toRadians(secondLat)) * Math.sin(deltaLon / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatApproxDistance(distanceKm) {
  if (!Number.isFinite(distanceKm)) return 'distance unavailable';
  if (distanceKm < 0.1) return 'under 100 m';
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m`;
  if (distanceKm < 10) return `${distanceKm.toFixed(1)} km`;
  return `${Math.round(distanceKm)} km`;
}

function validateLocation(location) {
  const lat = finiteNumber(location?.lat ?? location?.latitude);
  const lon = finiteNumber(location?.lon ?? location?.lng ?? location?.longitude);
  if (lat === null || lon === null || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    throw new TypeError('A location needs valid latitude and longitude values.');
  }
  return { ...location, lat, lon };
}

export function isInBerlinScope(location) {
  const normalized = validateLocation(location);
  return normalized.lat >= BERLIN_BBOX.south
    && normalized.lat <= BERLIN_BBOX.north
    && normalized.lon >= BERLIN_BBOX.west
    && normalized.lon <= BERLIN_BBOX.east;
}

function nearestAnchor(location, anchors) {
  return anchors.reduce((best, anchor) => {
    const distanceKm = haversineKm(location, anchor);
    if (!best || distanceKm < best.distanceKm) return { anchor, distanceKm };
    return best;
  }, null);
}

function distanceScore(distanceKm, maxDistanceKm, floor = 20) {
  const ratio = Math.min(1, Math.max(0, distanceKm / maxDistanceKm));
  return Math.round(100 - ratio * (100 - floor));
}

function scoreReason(key, score, nearest, extra = '') {
  const distance = formatApproxDistance(nearest.distanceKm);
  const scoreText = score >= 85 ? 'very close' : score >= 70 ? 'reasonably close' : 'a longer base-to-anchor distance';
  const reasons = {
    sightseeing: `The closest fixed sightseeing anchor is ${nearest.anchor.label}, approximately ${distance} away. That is ${scoreText}; it is not a live walking time.`,
    transport: `The closest fixed transport anchor is ${nearest.anchor.label}, approximately ${distance} away. Check today's route in VBB for the actual journey.`,
    ber: `The BER planning anchor is approximately ${distance} away. This is a location signal only; VBB should decide the live airport route.`,
    nightlife: `The closest fixed evening anchor is ${nearest.anchor.label}, approximately ${distance} away. This is an area-fit signal, not a venue or safety rating.`,
    quiet: `The closest fixed park or quiet-evening anchor is ${nearest.anchor.label}, approximately ${distance} away. It is an atmosphere proxy, not a safety score.`,
    meeting: `The World Clock at Alexanderplatz is approximately ${distance} away. My BerlinWalk tour starts there and takes about 2 hours; check the current tour page for details.`,
  };
  return `${reasons[key]}${extra}`;
}

function buildSubscores(location) {
  const sightseeing = nearestAnchor(location, ANCHORS.sightseeing);
  const transport = nearestAnchor(location, ANCHORS.transport);
  const nightlife = nearestAnchor(location, ANCHORS.nightlife);
  const quiet = nearestAnchor(location, ANCHORS.quiet);
  const meeting = { anchor: WORLD_CLOCK, distanceKm: haversineKm(location, WORLD_CLOCK) };
  const berDistanceKm = haversineKm(location, BER_AIRPORT);
  const berScore = Math.round(
    distanceScore(berDistanceKm, 28, 24) * 0.7 + distanceScore(transport.distanceKm, 6, 30) * 0.3,
  );

  const scoreEntries = [
    {
      id: 'sightseeing',
      label: 'First-time sightseeing',
      score: distanceScore(sightseeing.distanceKm, 8.2, 28),
      distanceKm: sightseeing.distanceKm,
      anchorLabel: sightseeing.anchor.label,
      reason: '',
    },
    {
      id: 'transport',
      label: 'Easy public transport',
      score: distanceScore(transport.distanceKm, 6, 30),
      distanceKm: transport.distanceKm,
      anchorLabel: transport.anchor.label,
      reason: '',
    },
    {
      id: 'ber',
      label: 'BER Airport connection',
      score: berScore,
      distanceKm: berDistanceKm,
      anchorLabel: BER_AIRPORT.label,
      reason: '',
    },
    {
      id: 'nightlife',
      label: 'Nightlife',
      score: distanceScore(nightlife.distanceKm, 7, 28),
      distanceKm: nightlife.distanceKm,
      anchorLabel: nightlife.anchor.label,
      reason: '',
    },
    {
      id: 'quiet',
      label: 'Quiet evenings',
      score: distanceScore(quiet.distanceKm, 7.5, 28),
      distanceKm: quiet.distanceKm,
      anchorLabel: quiet.anchor.label,
      reason: '',
    },
    {
      id: 'meeting',
      label: 'BerlinWalk meeting point',
      score: distanceScore(meeting.distanceKm, 7, 15),
      distanceKm: meeting.distanceKm,
      anchorLabel: meeting.anchor.label,
      reason: '',
    },
  ];

  const nearestById = { sightseeing, transport, ber: { distanceKm: berDistanceKm, anchor: BER_AIRPORT }, nightlife, quiet, meeting };
  return scoreEntries.map((entry) => ({
    ...entry,
    reason: scoreReason(entry.id, entry.score, nearestById[entry.id]),
  }));
}

function resolvePriorityIds(priorityIds) {
  const requested = Array.isArray(priorityIds) ? priorityIds : DEFAULT_PRIORITY_IDS;
  const valid = [...new Set(requested)].filter((id) => PRIORITY_BY_ID.has(id));
  return valid.length ? valid.slice(0, 3) : [...DEFAULT_PRIORITY_IDS];
}

function scoreBand(totalScore) {
  if (totalScore >= 85) return { id: 'strong', label: 'Strong fit for your selected priorities' };
  if (totalScore >= 70) return { id: 'good', label: 'Good fit with a few trade-offs' };
  if (totalScore >= 55) return { id: 'mixed', label: 'Usable, but expect extra journeys' };
  return { id: 'specific', label: 'A specific fit — one trade-off needs to be deliberate' };
}

function nearestNeighborhood(location) {
  return nearestAnchor(location, ANCHORS.neighborhoods).anchor;
}

function recommendationForArea(areaId, strongest, weakest) {
  const weakestLabel = PRIORITY_BY_ID.get(weakest.id)?.shortLabel ?? weakest.label;
  const strongestLabel = PRIORITY_BY_ID.get(strongest.id)?.shortLabel ?? strongest.label;
  const prefix = `This base is strongest for ${strongestLabel} and weakest for ${weakestLabel}. `;
  const advice = {
    central: 'If this is your first Berlin visit, use the World Clock at Alexanderplatz as your orientation point and keep one historic-centre loop for your first afternoon.',
    west: 'Keep Charlottenburg as your base if quiet evenings matter most; use Berlin Hauptbahnhof or Friedrichstraße when you make a central sightseeing day.',
    nightlife: 'Keep Friedrichshain or Kreuzberg if late evenings are the point; check VBB to Alexanderplatz before you commit to a morning tour or airport departure.',
    south: 'Use Neukölln or Tempelhof when local evenings and open space matter; build in a deliberate VBB journey for the historic centre.',
    airport: 'Choose the BER-facing edge only when airport simplicity outweighs central sightseeing convenience; test the exact flight-time route in VBB.',
    north: 'Use the north side if you want a calmer base near Wedding or Prenzlauer Berg; set the central destination explicitly in VBB each day.',
  };
  return `${prefix}${advice[areaId] ?? advice.central}`;
}

export function calculateLocationFit(inputLocation, priorityIds = DEFAULT_PRIORITY_IDS) {
  const location = validateLocation(inputLocation);
  if (!isInBerlinScope(location)) {
    return {
      status: 'outside_scope',
      approximateOnly: true,
      totalScore: null,
      band: null,
      selectedPriorityIds: resolvePriorityIds(priorityIds),
      subscores: [],
      strengths: [],
      tradeoff: null,
      recommendation: 'This point is outside the Berlin planning area. Choose a point inside Berlin or search for a Berlin address.',
    };
  }

  const subscores = buildSubscores(location);
  const selectedPriorityIds = resolvePriorityIds(priorityIds);
  const selected = subscores.filter((entry) => selectedPriorityIds.includes(entry.id));
  const totalScore = Math.round(selected.reduce((sum, entry) => sum + entry.score, 0) / selected.length);
  // The total follows the visitor's selected priorities. The trade-off is
  // deliberately broader: it shows what this location gives up elsewhere so
  // a perfect selected average cannot hide a meaningful weaker signal.
  const strongest = [...subscores].sort((a, b) => b.score - a.score)[0];
  const weakest = [...subscores].sort((a, b) => a.score - b.score)[0];
  const neighborhood = nearestNeighborhood(location);

  return {
    status: 'ok',
    approximateOnly: true,
    totalScore,
    band: scoreBand(totalScore),
    selectedPriorityIds,
    subscores,
    strengths: [...subscores].sort((a, b) => b.score - a.score).slice(0, 2).map((entry) => entry.id),
    tradeoff: {
      strongest: strongest.id,
      weakest: weakest.id,
      text: `${strongest.label} ${strongest.score}/100 versus ${weakest.label} ${weakest.score}/100.`,
    },
    neighborhood: { id: neighborhood.id, label: neighborhood.label },
    recommendation: recommendationForArea(neighborhood.id, strongest, weakest),
    method: 'Fixed approximate distances to named Berlin planning anchors; selected-priority average; no live journey time.',
  };
}
