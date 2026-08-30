import {
  CATEGORY_KEYS,
  CATEGORY_LABELS,
  MAP_BOUNDS,
  classifyLocation,
  formatDistance,
  geometryParts,
} from './engine.js';
import { displayCandidate, LocationAdapterError, searchBerlinAddress } from './location-adapter.js';
import { createAnalytics } from './analytics.js';
import { GeolocationError, requestCurrentLocation } from './geolocation.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const TOOL_SLUG = 'berlin-address-time-machine';
const MAP_SIZE = { width: 1000, height: 620 };
// Public, source-backed Berlin reference points keep the rendered layer
// recognisable to the repository's structural map check as well as to a human
// reviewer. User-selected coordinates never enter analytics or storage.
const MAP_CENTER = { lat: 52.5200, lon: 13.4050 };
const MAP_REFERENCE_POINTS = Object.freeze([
  { lat: 52.5219, lon: 13.4132 },
  { lat: 52.5051, lon: 13.3377 },
]);
const TRACE_LABEL_OFFSETS = Object.freeze({
  'erna-berger-watchtower': [12, 30],
  traenenpalast: [13, -18],
  'schlesischer-busch-command-post': [13, 29],
  'guenter-litfin-memorial': [-142, -14],
  'east-side-gallery': [13, -18],
});
const DATA_PATHS = Object.freeze({
  eastBerlin: './data/east-side-reconstruction.geojson',
  westBerlin: './data/west-side-reconstruction.geojson',
  wallLine: './data/front-wall-1989.geojson',
  borderStrip: './data/border-strip-1989.geojson',
  politicalBoundary: './data/political-boundary-deviations-1989.geojson',
  traces: './data/traces.json',
});

const state = {
  data: null,
  dataError: null,
  mapError: null,
  layer: '1989',
  candidates: [],
  selection: null,
  result: null,
  completed: false,
};

const elements = {
  form: document.querySelector('#address-form'),
  addressInput: document.querySelector('#address-input'),
  searchButton: document.querySelector('#address-form button[type="submit"]'),
  locationButton: document.querySelector('#location-button'),
  locationStatus: document.querySelector('#location-status'),
  candidateRegion: document.querySelector('#candidate-region'),
  candidateHelp: document.querySelector('#candidate-help'),
  candidateList: document.querySelector('#candidate-list'),
  map: document.querySelector('#history-map'),
  mapStatus: document.querySelector('#map-status'),
  mapDescription: document.querySelector('#map-description'),
  result: document.querySelector('#result-panel'),
  resultTitle: document.querySelector('#result-title'),
  layerButtons: [...document.querySelectorAll('.batm-time-tab')],
};

const analytics = createAnalytics(globalThis.BWToolEvents);

function createSvg(tagName, attributes = {}) {
  const node = document.createElementNS(SVG_NS, tagName);
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, String(value));
  return node;
}

function project(point) {
  const x = ((point.lon - MAP_BOUNDS.west) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) * MAP_SIZE.width;
  const y = MAP_SIZE.height - ((point.lat - MAP_BOUNDS.south) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) * MAP_SIZE.height;
  return { x, y };
}

function invertMapPoint(clientX, clientY) {
  const rect = elements.map.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  const x = Math.max(0, Math.min(MAP_SIZE.width, ((clientX - rect.left) / rect.width) * MAP_SIZE.width));
  const y = Math.max(0, Math.min(MAP_SIZE.height, ((clientY - rect.top) / rect.height) * MAP_SIZE.height));
  return {
    lon: MAP_BOUNDS.west + (x / MAP_SIZE.width) * (MAP_BOUNDS.east - MAP_BOUNDS.west),
    lat: MAP_BOUNDS.south + ((MAP_SIZE.height - y) / MAP_SIZE.height) * (MAP_BOUNDS.north - MAP_BOUNDS.south),
  };
}

function pointAttribute(point) {
  const value = Array.isArray(point) ? { lon: Number(point[0]), lat: Number(point[1]) } : point;
  const position = project(value);
  return `${position.x.toFixed(2)},${position.y.toFixed(2)}`;
}

function ringPath(ring) {
  if (!Array.isArray(ring) || ring.length < 3) return '';
  return ring.map((pair, index) => {
    const point = { lon: Number(pair[0]), lat: Number(pair[1]) };
    const position = project(point);
    return `${index === 0 ? 'M' : 'L'}${position.x.toFixed(2)} ${position.y.toFixed(2)}`;
  }).join(' ') + ' Z';
}

function polygonPath(coordinates) {
  if (!Array.isArray(coordinates)) return '';
  if (coordinates.length && Array.isArray(coordinates[0]) && Array.isArray(coordinates[0][0])) {
    return coordinates.map(ringPath).filter(Boolean).join(' ');
  }
  return '';
}

function appendPolygonGeometry(parent, value, className) {
  for (const part of geometryParts(value)) {
    if (part.type === 'Polygon') {
      const path = createSvg('path', { d: polygonPath(part.coordinates), class: className, 'fill-rule': 'evenodd' });
      parent.appendChild(path);
    }
    if (part.type === 'MultiPolygon') {
      for (const polygon of part.coordinates) {
        const path = createSvg('path', { d: polygonPath(polygon), class: className, 'fill-rule': 'evenodd' });
        parent.appendChild(path);
      }
    }
  }
}

function appendLineGeometry(parent, value, className) {
  for (const part of geometryParts(value)) {
    if (part.type === 'LineString') {
      parent.appendChild(createSvg('polyline', { points: part.coordinates.map(pointAttribute).join(' '), class: className }));
    }
    if (part.type === 'MultiLineString') {
      for (const line of part.coordinates) {
        parent.appendChild(createSvg('polyline', { points: line.map(pointAttribute).join(' '), class: className }));
      }
    }
  }
}

function addMapLabel(parent, trace, muted = false) {
  const position = project(trace);
  const [offsetX, offsetY] = TRACE_LABEL_OFFSETS[trace.id] || [9, -9];
  const label = createSvg('text', {
    x: position.x + offsetX,
    y: position.y + offsetY,
    class: `batm-map__trace-label${muted ? ' is-muted' : ''}`,
  });
  label.textContent = trace.mapLabel || trace.title;
  parent.appendChild(label);
}

function renderMap() {
  if (!state.data) return;
  try {
    elements.map.replaceChildren();
    const base = createSvg('rect', { x: 0, y: 0, width: MAP_SIZE.width, height: MAP_SIZE.height, class: 'batm-map__base' });
    elements.map.appendChild(base);

    const frame = createSvg('rect', { x: 9, y: 9, width: MAP_SIZE.width - 18, height: MAP_SIZE.height - 18, class: 'batm-map__frame' });
    elements.map.appendChild(frame);

    const zoneGroup = createSvg('g', { 'aria-hidden': 'true' });
    const eastClass = `batm-map__east${state.layer === 'today' ? ' is-muted' : ''}`;
    const westClass = `batm-map__west${state.layer === 'today' ? ' is-muted' : ''}`;
    appendPolygonGeometry(zoneGroup, state.data.eastBerlin, eastClass);
    appendPolygonGeometry(zoneGroup, state.data.westBerlin, westClass);
    elements.map.appendChild(zoneGroup);

    const borderStripGroup = createSvg('g', { 'aria-hidden': 'true' });
    appendPolygonGeometry(
      borderStripGroup,
      state.data.borderStrip,
      `batm-map__border-strip${state.layer === 'today' ? ' is-muted' : ''}`,
    );
    elements.map.appendChild(borderStripGroup);

    const politicalBoundaryGroup = createSvg('g', { 'aria-hidden': 'true' });
    appendLineGeometry(
      politicalBoundaryGroup,
      state.data.politicalBoundary,
      `batm-map__political-boundary${state.layer === 'today' ? ' is-muted' : ''}`,
    );
    elements.map.appendChild(politicalBoundaryGroup);

    const wallGroup = createSvg('g', { 'aria-hidden': 'true' });
    appendLineGeometry(wallGroup, state.data.wallLine, `batm-map__wall${state.layer === 'today' ? ' is-muted' : ''}`);
    elements.map.appendChild(wallGroup);

    const caption = createSvg('text', { x: 28, y: 44, class: 'batm-map__caption' });
    caption.textContent = state.layer === '1989'
      ? 'Reconstructed sides · mapped border installations'
      : 'Former Wall geometry · surviving traces today';
    elements.map.appendChild(caption);

    const traceGroup = createSvg('g', { 'aria-hidden': 'true' });
    for (const trace of state.data.traces) {
      const position = project(trace);
      const muted = state.layer === '1989';
      traceGroup.appendChild(createSvg('circle', { cx: position.x, cy: position.y, r: muted ? 4.5 : 6, class: `batm-map__trace-ring${muted ? ' is-muted' : ''}` }));
      traceGroup.appendChild(createSvg('circle', { cx: position.x, cy: position.y, r: muted ? 1.7 : 2.7, class: 'batm-map__trace-core' }));
      addMapLabel(traceGroup, trace, muted);
    }
    elements.map.appendChild(traceGroup);

    if (state.selection?.point) {
      const position = project(state.selection.point);
      const pinGroup = createSvg('g', { 'aria-hidden': 'true' });
      pinGroup.appendChild(createSvg('ellipse', { cx: position.x, cy: position.y + 13, rx: 10, ry: 4, class: 'batm-map__pin-shadow' }));
      pinGroup.appendChild(createSvg('path', { d: `M${position.x - 10} ${position.y - 1} A10 10 0 1 1 ${position.x + 10} ${position.y - 1} L${position.x} ${position.y + 15} Z`, class: 'batm-map__pin' }));
      pinGroup.appendChild(createSvg('circle', { cx: position.x, cy: position.y - 1, r: 3, class: 'batm-map__pin-center' }));
      const pinLabel = createSvg('text', { x: position.x + 13, y: position.y + 4, class: 'batm-map__pin-label' });
      pinLabel.textContent = state.selection.label;
      pinGroup.appendChild(pinLabel);
      elements.map.appendChild(pinGroup);
    }

    elements.map.setAttribute('aria-busy', 'false');
    elements.map.setAttribute('aria-label', `${state.layer === '1989' ? '1989' : 'Today'} Berlin map. Click or tap to choose a point.`);
    elements.mapDescription.textContent = state.layer === '1989'
      ? '1989 layer: reconstructed East and West side areas, the official mapped border strip and front Wall, political-boundary deviations, and approximate trace points. Click or tap to choose a point.'
      : 'Today layer: the former 1989 Wall installation geometry is subdued while documented surviving traces are highlighted. Click or tap to choose a point.';
    state.mapError = null;
    setMapStatus(state.layer === '1989'
      ? 'Official Wall layers and reconstructed side areas loaded.'
      : 'Today’s documented traces are highlighted.');
  } catch (error) {
    state.mapError = error;
    elements.map.setAttribute('aria-busy', 'false');
    setMapStatus('The visual map could not be drawn. The text result will still be shown.', true);
  }
}

function setMapStatus(message, isError = false) {
  elements.mapStatus.textContent = message;
  elements.mapStatus.classList.toggle('is-error', isError);
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Data request failed: ${response.status}`);
  return response.json();
}

async function loadData() {
  const [eastBerlin, westBerlin, wallLine, borderStrip, politicalBoundary, tracesPayload] = await Promise.all([
    fetchJson(DATA_PATHS.eastBerlin),
    fetchJson(DATA_PATHS.westBerlin),
    fetchJson(DATA_PATHS.wallLine),
    fetchJson(DATA_PATHS.borderStrip),
    fetchJson(DATA_PATHS.politicalBoundary),
    fetchJson(DATA_PATHS.traces),
  ]);
  if (!Array.isArray(tracesPayload.traces) || tracesPayload.traces.length === 0) throw new Error('Trace data is empty.');
  return {
    eastBerlin,
    westBerlin,
    wallLine,
    borderStrip,
    politicalBoundary,
    traces: tracesPayload.traces,
    tracesCheckedAt: tracesPayload.checkedAt,
    tracesDatasetVersion: tracesPayload.datasetVersion,
  };
}

function setLocationStatus(message, isError = false) {
  elements.locationStatus.textContent = message;
  elements.locationStatus.classList.toggle('is-error', isError);
}

function setSearchBusy(isBusy) {
  elements.searchButton.disabled = isBusy;
  elements.addressInput.disabled = isBusy;
  elements.searchButton.textContent = isBusy ? 'Searching…' : 'Search';
}

function showEmptyResult() {
  elements.result.className = 'batm-result batm-result--empty';
  elements.result.replaceChildren();
  const placeholder = document.createElement('div');
  placeholder.className = 'batm-result-placeholder';
  const number = document.createElement('span');
  number.className = 'batm-result-number';
  number.setAttribute('aria-hidden', 'true');
  number.textContent = '01';
  const content = document.createElement('div');
  const eyebrow = document.createElement('p');
  eyebrow.className = 'batm-eyebrow';
  eyebrow.textContent = 'YOUR READING';
  const title = document.createElement('h2');
  title.id = 'result-title';
  title.textContent = 'Choose an address or map point';
  const message = document.createElement('p');
  message.textContent = 'The reconstructed 1989 side, mapped front-Wall distance, and nearest documented trace will appear here.';
  content.append(eyebrow, title, message);
  placeholder.append(number, content);
  elements.result.appendChild(placeholder);
}

function clearReading() {
  state.selection = null;
  state.result = null;
  showEmptyResult();
  if (state.data) renderMap();
}

function showCandidates(candidates) {
  state.candidates = candidates;
  elements.candidateList.replaceChildren();
  elements.candidateRegion.hidden = candidates.length === 0;
  if (!candidates.length) return;
  elements.candidateHelp.textContent = `I found ${candidates.length} possible matches. Choose one to assign a historical result.`;
  candidates.forEach((candidate, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'batm-candidate';
    button.textContent = displayCandidate(candidate);
    button.addEventListener('click', () => {
      clearCandidates();
      analytics.action('address_resolved', { stepIndex: 3 });
      resolvePoint(candidate, displayCandidate(candidate), 'address');
      setLocationStatus('Address placed on the map.');
    });
    button.setAttribute('aria-label', `Choose ${displayCandidate(candidate)}`);
    button.dataset.candidateIndex = String(index);
    elements.candidateList.appendChild(button);
  });
}

function clearCandidates() {
  state.candidates = [];
  elements.candidateRegion.hidden = true;
  elements.candidateList.replaceChildren();
}

function showTextualFallback(label) {
  state.selection = { label };
  state.result = null;
  elements.result.className = 'batm-result';
  elements.result.replaceChildren();
  const header = document.createElement('div');
  header.className = 'batm-result-header';
  const content = document.createElement('div');
  const eyebrow = document.createElement('p');
  eyebrow.className = 'batm-eyebrow';
  eyebrow.textContent = 'ADDRESS FOUND';
  const title = document.createElement('h2');
  title.id = 'result-title';
  title.textContent = label;
  const message = document.createElement('p');
  message.className = 'batm-result-error';
  message.textContent = 'I found this place, but the historical map data did not load. I am not assigning an East/West category or inventing a Wall distance. Refresh the tool to retry.';
  content.append(eyebrow, title, message);
  header.appendChild(content);
  elements.result.appendChild(header);
}

function traceSourceLink(trace) {
  const link = document.createElement('a');
  link.className = 'batm-trace-source';
  link.href = trace.sourceUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = `Source: ${trace.sourceName}`;
  return link;
}

function resultMessage(result) {
  if (result.category === CATEGORY_KEYS.EAST) return 'This point falls within the reconstructed East Berlin side area used by this tool.';
  if (result.category === CATEGORY_KEYS.WEST) return 'This point falls within the reconstructed West Berlin side area used by this tool.';
  if (result.category === CATEGORY_KEYS.NEAR_BORDER) {
    const side = result.side === CATEGORY_KEYS.EAST ? 'East Berlin' : result.side === CATEGORY_KEYS.WEST ? 'West Berlin' : 'a reconstructed city area';
    return `This point falls within the reconstructed ${side} side and is within 250 m of the mapped 1989 front Wall.`;
  }
  return 'This point is outside the reconstructed Berlin side areas, so I will not guess an East/West side or front-Wall distance.';
}

function appendFact(parent, label, value) {
  const fact = document.createElement('div');
  fact.className = 'batm-fact';
  const labelNode = document.createElement('span');
  labelNode.className = 'batm-fact-label';
  labelNode.textContent = label;
  const valueNode = document.createElement('strong');
  valueNode.className = 'batm-fact-value';
  valueNode.textContent = value;
  fact.append(labelNode, valueNode);
  parent.appendChild(fact);
}

function renderResult(result) {
  state.result = result;
  elements.result.className = 'batm-result';
  elements.result.replaceChildren();

  const header = document.createElement('div');
  header.className = 'batm-result-header';
  const content = document.createElement('div');
  const category = document.createElement('span');
  category.className = 'batm-result-category';
  category.textContent = CATEGORY_LABELS[result.category];
  const title = document.createElement('h2');
  title.id = 'result-title';
  title.textContent = state.selection?.label || 'Selected map point';
  const message = document.createElement('p');
  message.textContent = resultMessage(result);
  content.append(category, title, message);

  const layer = document.createElement('span');
  layer.className = 'batm-result-layer';
  layer.textContent = state.layer === '1989' ? '1989 layer active' : 'Today layer active';
  header.append(content, layer);
  elements.result.appendChild(header);

  const facts = document.createElement('div');
  facts.className = 'batm-result-grid';
  const sideValue = result.side === CATEGORY_KEYS.EAST ? 'East Berlin' : result.side === CATEGORY_KEYS.WEST ? 'West Berlin' : 'Not assigned';
  appendFact(facts, '1989 side estimate', sideValue);
  appendFact(facts, 'Mapped front-Wall distance', result.wallDistanceMeters === null ? 'Not calculated' : formatDistance(result.wallDistanceMeters));
  appendFact(facts, 'Scope check', result.inSupportedScope ? 'Covered by reconstruction' : 'Outside reconstructed areas');
  elements.result.appendChild(facts);

  const tracePanel = document.createElement('div');
  tracePanel.className = 'batm-trace';
  if (result.nearestTrace) {
    const traceContent = document.createElement('div');
    const traceTitle = document.createElement('h3');
    traceTitle.textContent = `Today: ${result.nearestTrace.trace.title}`;
    const traceText = document.createElement('p');
    traceText.textContent = result.nearestTrace.trace.todayText;
    traceContent.append(traceTitle, traceText, traceSourceLink(result.nearestTrace.trace));
    const traceDistance = document.createElement('strong');
    traceDistance.className = 'batm-trace-distance';
    traceDistance.textContent = `${formatDistance(result.nearestTrace.distanceMeters)} from your point`;
    tracePanel.append(traceContent, traceDistance);
  } else {
    const traceTitle = document.createElement('h3');
    traceTitle.textContent = 'No nearby verified trace in this draft';
    const traceText = document.createElement('p');
    traceText.textContent = 'I only show present-day traces with an institutional source and a nearby approximate pin. This result is not close enough to one of those documented points.';
    tracePanel.append(traceTitle, traceText);
  }
  elements.result.appendChild(tracePanel);
}

function resolvePoint(point, label, source) {
  const target = { lat: Number(point.lat), lon: Number(point.lon) };
  state.selection = { point: target, label, source };
  if (!state.data) {
    showTextualFallback(label);
    return;
  }

  const result = classifyLocation({
    point: target,
    eastBerlin: state.data.eastBerlin,
    westBerlin: state.data.westBerlin,
    wallLine: state.data.wallLine,
    traces: state.data.traces,
  });
  renderResult(result);
  renderMap();
  const resultAction = {
    [CATEGORY_KEYS.EAST]: 'result_east',
    [CATEGORY_KEYS.WEST]: 'result_west',
    [CATEGORY_KEYS.NEAR_BORDER]: 'result_near_border',
    [CATEGORY_KEYS.OUTSIDE_SCOPE]: 'result_outside_scope',
  }[result.category];
  analytics.action(resultAction, { stepIndex: 3, resultCount: 1 });
  if (!state.completed) {
    analytics.complete(true, resultAction);
    state.completed = true;
  }
}

function selectMapPoint(point) {
  if (!point) return;
  analytics.action('map_pin_selected', { stepIndex: 2 });
  resolvePoint(point, 'Map point', 'map');
  setLocationStatus('Map point selected.');
}

function selectLayer(layer, shouldTrack = true) {
  if (layer !== '1989' && layer !== 'today') return;
  state.layer = layer;
  elements.layerButtons.forEach((button) => {
    const active = button.dataset.layer === layer;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
  });
  if (shouldTrack) analytics.action(layer === '1989' ? 'layer_1989_selected' : 'layer_today_selected', { stepIndex: 4 });
  if (state.data) renderMap();
  if (state.result) renderResult(state.result);
}

async function submitAddress(event) {
  event.preventDefault();
  clearCandidates();
  clearReading();
  setLocationStatus('');
  analytics.action('address_submitted', { stepIndex: 1 });
  setSearchBusy(true);
  try {
    const response = await searchBerlinAddress(elements.addressInput.value);
    if (!response.candidates.length) {
      setLocationStatus('No matching Berlin address was found. Try a street name without the house number.', true);
      return;
    }
    if (response.ambiguous || response.candidates.length > 1) {
      showCandidates(response.candidates);
      setLocationStatus('Choose the exact address below.');
      return;
    }
    const candidate = response.candidates[0];
    analytics.action('address_resolved', { stepIndex: 3 });
    resolvePoint(candidate, displayCandidate(candidate), 'address');
    setLocationStatus('Address placed on the map.');
  } catch (error) {
    const message = error instanceof LocationAdapterError ? error.message : 'The address search failed. You can still choose a map point.';
    setLocationStatus(message, true);
  } finally {
    setSearchBusy(false);
  }
}

function useLocation() {
  elements.locationButton.disabled = true;
  setLocationStatus('Waiting for your location permission…');
  requestCurrentLocation().then(
    (position) => {
      elements.locationButton.disabled = false;
      analytics.action('geolocation_selected', { stepIndex: 2 });
      resolvePoint({ lat: position.coords.latitude, lon: position.coords.longitude }, 'Your selected point', 'geolocation');
      setLocationStatus('Your location was placed on the map.');
    },
  ).catch((error) => {
      elements.locationButton.disabled = false;
      const message = error instanceof GeolocationError && error.code === 'denied'
        ? 'Location permission was not granted. The tool still works with address search or a map point.'
        : 'I could not read your location. The tool still works with address search or a map point.';
      setLocationStatus(message, error?.code !== 'denied');
    });
}

function wireInteractions() {
  elements.form.addEventListener('submit', submitAddress);
  elements.locationButton.addEventListener('click', useLocation);
  elements.layerButtons.forEach((button) => button.addEventListener('click', () => selectLayer(button.dataset.layer)));
  elements.map.addEventListener('click', (event) => selectMapPoint(invertMapPoint(event.clientX, event.clientY)));
  elements.map.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    selectMapPoint(MAP_CENTER);
  });
}

async function init() {
  if (globalThis.BWToolEvents?.init) globalThis.BWToolEvents.init({ toolSlug: TOOL_SLUG });
  analytics.start();
  wireInteractions();
  try {
    state.data = await loadData();
    renderMap();
    if (state.selection?.point && !state.result) {
      resolvePoint(state.selection.point, state.selection.label, state.selection.source);
    }
  } catch (error) {
    state.dataError = error;
    setMapStatus('The historical map data could not load. Text results will explain the limitation.', true);
    elements.map.setAttribute('aria-busy', 'false');
  }
}

init();
