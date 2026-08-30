import {
  DEFAULT_PRIORITY_IDS,
  PRIORITIES,
  calculateLocationFit,
  haversineKm,
} from './engine.mjs';
import { emitHotelEvent } from './analytics.mjs';
import { searchBerlinAddress } from './location-adapter.mjs';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);
const MAP_BOUNDS = Object.freeze([[52.34, 13.20], [52.60, 13.62]]);
const MAP_PLACES = Object.freeze([
  { id: 'central', label: 'Mitte / Alexanderplatz', lat: 52.521918, lon: 13.413215 },
  { id: 'west', label: 'Charlottenburg / west', lat: 52.505, lon: 13.332 },
  { id: 'nightlife', label: 'Friedrichshain / Kreuzberg', lat: 52.5075, lon: 13.4548 },
  { id: 'south', label: 'Neukölln / Tempelhof', lat: 52.473, lon: 13.4036 },
  { id: 'airport', label: 'BER edge', lat: 52.3667, lon: 13.5033 },
  { id: 'north', label: 'Wedding / north', lat: 52.5351, lon: 13.3903 },
]);
const RADAR_ORDER = Object.freeze(['sightseeing', 'transport', 'ber', 'nightlife', 'quiet', 'meeting']);

const state = {
  selectedLocation: null,
  selectedPriorityIds: [...DEFAULT_PRIORITY_IDS],
  lastResult: null,
  map: null,
  mapTileFailed: false,
  selectedMarker: null,
  anchorLayers: new Map(),
};

const $ = (selector) => document.querySelector(selector);
const svgNs = 'http://www.w3.org/2000/svg';

function makeSvg(tag, attributes = {}) {
  const node = document.createElementNS(svgNs, tag);
  Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
  return node;
}

function setStatus(node, message, stateName = '') {
  node.textContent = message;
  if (stateName) node.dataset.state = stateName;
  else delete node.dataset.state;
}

function getFixtureKey() {
  if (!LOCAL_HOSTS.has(window.location.hostname)) return '';
  return new URLSearchParams(window.location.search).get('qaFixture') || '';
}

async function lookupAddress(query) {
  const fixtureKey = getFixtureKey();
  if (fixtureKey) {
    const fixtureResponse = await fetch('./qa/fixtures.json', { cache: 'no-store' });
    if (!fixtureResponse.ok) throw new Error('Local fixture file unavailable.');
    const fixtures = await fixtureResponse.json();
    const fixture = fixtures[fixtureKey];
    if (!fixture) throw new Error('Unknown local fixture.');
    return {
      ok: true,
      candidates: [{ ...fixture, source: 'local-fixture', matchedQuery: query }],
      localFixture: true,
    };
  }

  return searchBerlinAddress(query);
}

function normalizeCandidate(candidate) {
  const lat = Number(candidate.lat ?? candidate.latitude);
  const lon = Number(candidate.lon ?? candidate.lng ?? candidate.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw new Error('Candidate has no usable coordinates.');
  const street = [candidate.street, candidate.houseNumber, candidate.houseNumberSuffix || candidate.houseNumberAddition].filter(Boolean).join(' ');
  const locality = [candidate.postalCode || candidate.postcode, candidate.city || candidate.locality || candidate.ortName || 'Berlin'].filter(Boolean).join(' ');
  return {
    label: candidate.label || [street, locality].filter(Boolean).join(', ') || 'Selected Berlin address',
    street,
    locality,
    district: candidate.district || candidate.districtName || candidate.bezName || '',
    lat,
    lon,
    source: candidate.source || 'address',
  };
}

function nearestMapPlace(location) {
  return MAP_PLACES.reduce((best, place) => {
    const distanceKm = haversineKm(location, place);
    if (!best || distanceKm < best.distanceKm) return { place, distanceKm };
    return best;
  }, null).place;
}

function renderMap() {
  const mapNode = $('#berlin-map');
  const quickPoints = $('#map-quick-points');
  quickPoints.replaceChildren();
  MAP_PLACES.forEach((place) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'map-quick-button';
    button.dataset.mapAnchor = place.id;
    button.setAttribute('aria-pressed', 'false');
    button.textContent = place.label;
    button.addEventListener('click', () => selectLocation(place, 'map'));
    quickPoints.appendChild(button);
  });

  if (!window.L) {
    const fallback = document.createElement('p');
    fallback.className = 'map-fallback';
    fallback.textContent = 'The basemap did not load. You can still choose one of the fixed planning anchors below.';
    mapNode.replaceChildren(fallback);
    setStatus($('#selection-status'), 'Map tiles are unavailable right now; the fixed planning anchors still work.', 'error');
    return;
  }

  mapNode.replaceChildren();
  const leaflet = window.L;
  const map = leaflet.map(mapNode, {
    zoomControl: true,
    scrollWheelZoom: false,
    doubleClickZoom: true,
    minZoom: 9,
    maxZoom: 18,
  });
  state.map = map;
  map.fitBounds(MAP_BOUNDS, { padding: [18, 18], maxZoom: 11 });

  const tiles = leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);
  tiles.on('tileerror', () => {
    if (state.mapTileFailed) return;
    state.mapTileFailed = true;
    setStatus($('#selection-status'), 'The basemap is partly unavailable. Fixed planning anchors and address scoring still work.', 'error');
  });

  MAP_PLACES.forEach((place) => {
    const layer = leaflet.circleMarker([place.lat, place.lon], {
      radius: 8,
      color: '#FFFFFF',
      weight: 3,
      fillColor: '#1B5E20',
      fillOpacity: 1,
      bubblingMouseEvents: false,
    }).addTo(map);
    layer.bindTooltip(place.label, { direction: 'top', offset: [0, -8] });
    layer.on('click', () => selectLocation(place, 'map'));
    state.anchorLayers.set(place.id, layer);
  });

  map.on('click', ({ latlng }) => {
    const point = { lat: latlng.lat, lon: latlng.lng };
    selectLocation({ ...point, label: `Map point near ${nearestMapPlace(point).label}` }, 'map');
  });

  requestAnimationFrame(() => map.invalidateSize());
}

function selectLocation(location, source = 'map') {
  const normalized = normalizeCandidate({ ...location, source });
  state.selectedLocation = normalized;
  if (source === 'map') emitHotelEvent('action', 'map_pin_selected', { stepIndex: 1 });
  const message = source === 'address'
    ? `Address placed: ${normalized.label}. The map pin is geographic; the fit scores use approximate straight-line distances to fixed anchors.`
    : `Map point selected near ${nearestMapPlace(normalized).label}. The fit scores use approximate straight-line distances to fixed anchors.`;
  setStatus($('#selection-status'), message, 'success');
  drawSelectedPoint(normalized);
  updateScore();
}

function drawSelectedPoint(location) {
  const nearest = nearestMapPlace(location);
  if (state.map && window.L) {
    const latLng = [location.lat, location.lon];
    if (state.selectedMarker) state.selectedMarker.setLatLng(latLng);
    else {
      state.selectedMarker = window.L.marker(latLng, {
        alt: 'Selected hotel location',
        title: location.label,
        keyboard: false,
      }).addTo(state.map);
    }
    state.selectedMarker.bindTooltip(location.label, { direction: 'top', offset: [0, -20] });
    state.map.panInside(latLng, { padding: [42, 42] });
  }
  state.anchorLayers.forEach((layer, id) => {
    const selected = id === nearest.id;
    layer.setStyle({
      color: selected ? '#123D18' : '#FFFFFF',
      fillColor: selected ? '#FFE600' : '#1B5E20',
    });
  });
  document.querySelectorAll('.map-quick-button').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.mapAnchor === nearest.id));
  });
}

function renderCandidates(candidates) {
  const panel = $('#candidate-panel');
  const list = $('#candidate-list');
  list.replaceChildren();
  $('#candidate-count').textContent = `${candidates.length} found`;
  candidates.forEach((candidate, index) => {
    const normalized = normalizeCandidate(candidate);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'candidate-button';
    button.dataset.candidateIndex = String(index);
    const strong = document.createElement('strong');
    strong.textContent = normalized.label;
    const small = document.createElement('small');
    small.textContent = [normalized.district, `${normalized.lat.toFixed(4)}, ${normalized.lon.toFixed(4)}`].filter(Boolean).join(' · ');
    button.append(strong, small);
    button.addEventListener('click', () => {
      emitHotelEvent('action', 'address_resolved', { stepIndex: 1, resultCount: candidates.length });
      selectLocation(normalized, 'address');
    });
    list.appendChild(button);
  });
  panel.hidden = false;
}

function renderPriorities() {
  const list = $('#priority-list');
  PRIORITIES.forEach((priority) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'priority-button';
    button.dataset.priority = priority.id;
    button.setAttribute('aria-pressed', String(state.selectedPriorityIds.includes(priority.id)));
    const strong = document.createElement('strong');
    strong.textContent = priority.label;
    const small = document.createElement('small');
    small.textContent = priority.description;
    button.append(strong, small);
    button.addEventListener('click', () => togglePriority(priority.id));
    list.appendChild(button);
  });
  updatePriorityCount();
}

function togglePriority(priorityId) {
  const alreadySelected = state.selectedPriorityIds.includes(priorityId);
  if (alreadySelected && state.selectedPriorityIds.length === 1) {
    setStatus($('#priority-status'), 'Keep at least one priority selected.', 'error');
    return;
  }
  if (!alreadySelected && state.selectedPriorityIds.length >= 3) {
    setStatus($('#priority-status'), 'Choose up to three priorities. Remove one before adding another.', 'error');
    return;
  }
  state.selectedPriorityIds = alreadySelected
    ? state.selectedPriorityIds.filter((id) => id !== priorityId)
    : [...state.selectedPriorityIds, priorityId];
  emitHotelEvent('action', 'priority_selected', { stepIndex: 2 });
  document.querySelectorAll('[data-priority]').forEach((button) => {
    button.setAttribute('aria-pressed', String(state.selectedPriorityIds.includes(button.dataset.priority)));
  });
  updatePriorityCount();
  setStatus($('#priority-status'), 'Your total now uses the highlighted priorities.', 'success');
  updateScore();
}

function updatePriorityCount() {
  $('#priority-count').textContent = `${state.selectedPriorityIds.length} selected`;
}

function addRadarText(svg, text, x, y, className) {
  const node = makeSvg('text', { x, y, class: className });
  node.textContent = text;
  svg.appendChild(node);
}

function radarPoint(index, value, radius = 104) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / RADAR_ORDER.length;
  return { x: 160 + Math.cos(angle) * radius * (value / 100), y: 143 + Math.sin(angle) * radius * (value / 100) };
}

function radarFixedPoint(index, radius) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / RADAR_ORDER.length;
  return { x: 160 + Math.cos(angle) * radius, y: 143 + Math.sin(angle) * radius };
}

function renderRadar(subscores) {
  const svg = $('#score-radar');
  svg.querySelectorAll('[data-radar-drawn="true"]').forEach((node) => node.remove());
  [25, 50, 75, 100].forEach((radius) => {
    const points = RADAR_ORDER.map((_, index) => {
      const point = radarFixedPoint(index, radius);
      return `${point.x},${point.y}`;
    }).join(' ');
    svg.appendChild(makeSvg('polygon', { points, class: 'radar-grid', 'data-radar-drawn': 'true' }));
  });
  RADAR_ORDER.forEach((id, index) => {
    const point = radarFixedPoint(index, 104);
    svg.appendChild(makeSvg('line', { x1: 160, y1: 143, x2: point.x, y2: point.y, class: 'radar-axis', 'data-radar-drawn': 'true' }));
  });
  const scoreById = new Map(subscores.map((entry) => [entry.id, entry.score]));
  const areaPoints = RADAR_ORDER.map((id, index) => {
    const point = radarPoint(index, scoreById.get(id) ?? 0);
    return `${point.x},${point.y}`;
  }).join(' ');
  svg.appendChild(makeSvg('polygon', { points: areaPoints, class: 'radar-area', 'data-radar-drawn': 'true' }));
  RADAR_ORDER.forEach((id, index) => {
    const point = radarPoint(index, scoreById.get(id) ?? 0);
    svg.appendChild(makeSvg('circle', { cx: point.x, cy: point.y, r: 5, class: 'radar-point', 'data-radar-drawn': 'true' }));
    const labelPoint = radarFixedPoint(index, 130);
    const priority = PRIORITIES.find((item) => item.id === id);
    addRadarText(svg, priority.shortLabel, labelPoint.x, labelPoint.y, 'radar-label');
    svg.lastElementChild.dataset.radarDrawn = 'true';
  });
  const selectedLabels = state.selectedPriorityIds.map((id) => PRIORITIES.find((item) => item.id === id)?.shortLabel).filter(Boolean).join(', ');
  svg.setAttribute('aria-label', `Location profile. Selected priorities: ${selectedLabels}.`);
}

function renderSubscores(result) {
  const list = $('#subscore-list');
  list.replaceChildren();
  result.subscores.forEach((entry) => {
    const row = document.createElement('article');
    row.className = 'subscore-row';
    row.dataset.key = entry.id;
    const top = document.createElement('div');
    top.className = 'subscore-top';
    const title = document.createElement('strong');
    title.textContent = entry.label;
    if (result.selectedPriorityIds.includes(entry.id)) {
      const mark = document.createElement('span');
      mark.className = 'selected-mark';
      mark.textContent = 'in total';
      title.appendChild(mark);
    }
    const score = document.createElement('span');
    score.className = 'subscore-score';
    score.textContent = `${entry.score}/100`;
    top.append(title, score);
    const bar = document.createElement('div');
    bar.className = 'subscore-bar';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    bar.setAttribute('aria-valuenow', String(entry.score));
    bar.setAttribute('aria-label', `${entry.label}: ${entry.score} out of 100`);
    const fill = document.createElement('span');
    fill.style.width = `${entry.score}%`;
    bar.appendChild(fill);
    const reason = document.createElement('p');
    reason.className = 'subscore-reason';
    reason.textContent = entry.reason;
    row.append(top, bar, reason);
    list.appendChild(row);
  });
}

function renderScore(result) {
  const panel = $('#score-panel');
  panel.hidden = false;
  $('#result-location').textContent = `${state.selectedLocation.label} · ${state.selectedLocation.lat.toFixed(4)}, ${state.selectedLocation.lon.toFixed(4)}`;
  $('#score-number').textContent = String(result.totalScore);
  $('#score-band').textContent = result.band.label;
  $('#score-explanation').textContent = `Based on ${result.selectedPriorityIds.length} selected ${result.selectedPriorityIds.length === 1 ? 'priority' : 'priorities'}, this is a ${result.band.id} location fit.`;
  $('#score-ring-progress').style.strokeDashoffset = String(402.12 - (402.12 * result.totalScore) / 100);
  $('#score-ring-progress').parentElement.parentElement.setAttribute('aria-label', `Location fit score: ${result.totalScore} out of 100`);
  renderRadar(result.subscores);
  renderSubscores(result);
  const strongest = result.subscores.find((entry) => entry.id === result.tradeoff.strongest);
  const weakest = result.subscores.find((entry) => entry.id === result.tradeoff.weakest);
  $('#tradeoff-heading').textContent = `${strongest.label} is your strongest signal`;
  $('#tradeoff-copy').textContent = result.tradeoff.text;
  $('#recommendation-copy').textContent = result.recommendation;
  $('#method-summary').textContent = `The total is the average of ${result.selectedPriorityIds.length} selected priority ${result.selectedPriorityIds.length === 1 ? 'subscore' : 'subscores'}: ${result.selectedPriorityIds.map((id) => PRIORITIES.find((item) => item.id === id)?.shortLabel).join(', ')}.`;
  state.lastResult = result;
}

function renderOutsideScope() {
  const panel = $('#score-panel');
  panel.hidden = true;
  setStatus($('#selection-status'), 'That point is outside the Berlin planning area. Choose a point inside Berlin or search for a Berlin address.', 'error');
}

function updateScore() {
  if (!state.selectedLocation) return;
  const result = calculateLocationFit(state.selectedLocation, state.selectedPriorityIds);
  if (result.status !== 'ok') {
    renderOutsideScope();
    return;
  }
  emitHotelEvent('complete', 'score_calculated', { stepIndex: 3, success: true });
  renderScore(result);
}

function wireAddressSearch() {
  $('#address-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = $('#address-input');
    const query = input.value.trim();
    if (query.length < 3) {
      setStatus($('#address-status'), 'Enter at least three characters, such as a street and house number.', 'error');
      input.focus();
      return;
    }
    emitHotelEvent('action', 'address_submitted', { stepIndex: 1 });
    setStatus($('#address-status'), 'Looking for matching Berlin addresses…');
    $('#candidate-panel').hidden = true;
    try {
      const payload = await lookupAddress(query);
      const candidates = (payload.candidates || []).slice(0, 3);
      if (!candidates.length) throw new Error('No matching address.');
      renderCandidates(candidates);
      setStatus($('#address-status'), payload.localFixture ? 'Local fixture loaded for QA. Choose a candidate below.' : `${candidates.length} address candidate${candidates.length === 1 ? '' : 's'} found.`, 'success');
    } catch (error) {
      setStatus($('#address-status'), 'Address lookup is unavailable right now. Pick a map point instead; I will not invent a score from a failed search.', 'error');
      $('#candidate-panel').hidden = true;
    }
  });
}

function wireCtas() {
  $('#vbb-link').addEventListener('click', () => emitHotelEvent('cta_click', 'vbb_opened', { stepIndex: 3 }));
  document.querySelectorAll('[data-cta-action]').forEach((link) => {
    link.addEventListener('click', () => emitHotelEvent('cta_click', link.dataset.ctaAction, { stepIndex: 3 }));
  });
}

function init() {
  if (globalThis.BWToolEvents && typeof globalThis.BWToolEvents.init === 'function') {
    globalThis.BWToolEvents.init({ toolSlug: 'berlin-hotel-location-checker' });
  }
  if (getFixtureKey()) $('#fixture-notice').hidden = false;
  renderMap();
  renderPriorities();
  wireAddressSearch();
  wireCtas();
  emitHotelEvent('start', null, { stepIndex: 0 });
}

init();
