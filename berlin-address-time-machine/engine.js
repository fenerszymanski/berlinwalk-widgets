const EARTH_RADIUS_METERS = 6371008.8;

export const MAP_BOUNDS = Object.freeze({
  south: 52.3,
  north: 52.72,
  west: 12.98,
  east: 13.82,
});

export const CATEGORY_KEYS = Object.freeze({
  EAST: 'east',
  WEST: 'west',
  NEAR_BORDER: 'near_border',
  OUTSIDE_SCOPE: 'outside_scope',
});

export const CATEGORY_LABELS = Object.freeze({
  [CATEGORY_KEYS.EAST]: 'East Berlin',
  [CATEGORY_KEYS.WEST]: 'West Berlin',
  [CATEGORY_KEYS.NEAR_BORDER]: 'Near the mapped Wall',
  [CATEGORY_KEYS.OUTSIDE_SCOPE]: 'Outside supported Berlin scope',
});

export const DEFAULT_NEAR_BORDER_METERS = 250;
export const DEFAULT_TRACE_RADIUS_METERS = 2500;

function finiteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

export function normalisePoint(point) {
  if (Array.isArray(point) && point.length >= 2) {
    const [lon, lat] = point;
    return finiteNumber(lat) && finiteNumber(lon) ? { lat, lon } : null;
  }
  if (!point || typeof point !== 'object') return null;
  const lat = Number(point.lat);
  const lon = Number(point.lon ?? point.lng);
  return finiteNumber(lat) && finiteNumber(lon) ? { lat, lon } : null;
}

export function isInSupportedBerlinScope(point, bounds = MAP_BOUNDS) {
  const value = normalisePoint(point);
  if (!value) return false;
  return value.lat >= bounds.south && value.lat <= bounds.north
    && value.lon >= bounds.west && value.lon <= bounds.east;
}

function geometryFromGeoJson(value) {
  if (!value || typeof value !== 'object') return null;
  if (value.type === 'Feature') return value.geometry || null;
  return value;
}

export function geometryParts(value) {
  if (!value || typeof value !== 'object') return [];
  if (value.type === 'FeatureCollection') {
    return value.features.flatMap((feature) => geometryParts(feature));
  }
  if (value.type === 'Feature') return geometryParts(value.geometry);
  if (value.type === 'GeometryCollection') {
    return value.geometries.flatMap((geometry) => geometryParts(geometry));
  }
  if (typeof value.type === 'string' && Array.isArray(value.coordinates)) {
    return [value];
  }
  return [];
}

function toCoordinatePair(pair) {
  return Array.isArray(pair) && pair.length >= 2 && finiteNumber(Number(pair[0]))
    && finiteNumber(Number(pair[1]))
    ? { lon: Number(pair[0]), lat: Number(pair[1]) }
    : null;
}

function pointInRing(point, ring) {
  const value = normalisePoint(point);
  if (!value || !Array.isArray(ring) || ring.length < 3) return false;
  const vertices = ring.map(toCoordinatePair).filter(Boolean);
  if (vertices.length < 3) return false;

  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const current = vertices[i];
    const previous = vertices[j];
    const crossesLatitude = (current.lat > value.lat) !== (previous.lat > value.lat);
    if (!crossesLatitude) continue;
    const crossingLon = ((previous.lon - current.lon) * (value.lat - current.lat))
      / (previous.lat - current.lat) + current.lon;
    if (value.lon < crossingLon) inside = !inside;
  }
  return inside;
}

function pointInPolygonCoordinates(point, coordinates) {
  if (!Array.isArray(coordinates)) return false;
  return coordinates.some((polygon) => {
    if (!Array.isArray(polygon) || polygon.length === 0) return false;
    if (!pointInRing(point, polygon[0])) return false;
    return !polygon.slice(1).some((hole) => pointInRing(point, hole));
  });
}

export function pointInGeometry(point, value) {
  const geometry = geometryFromGeoJson(value);
  if (!geometry) return false;
  if (geometry.type === 'Polygon') return pointInPolygonCoordinates(point, [geometry.coordinates]);
  if (geometry.type === 'MultiPolygon') return pointInPolygonCoordinates(point, geometry.coordinates);
  if (geometry.type === 'GeometryCollection') {
    return geometry.geometries.some((child) => pointInGeometry(point, child));
  }
  if (geometry.type === 'FeatureCollection') {
    return geometry.features.some((feature) => pointInGeometry(point, feature));
  }
  return false;
}

function localProjection(point, origin) {
  const latitude = ((point.lat + origin.lat) / 2) * Math.PI / 180;
  return {
    x: (point.lon - origin.lon) * Math.PI / 180 * EARTH_RADIUS_METERS * Math.cos(latitude),
    y: (point.lat - origin.lat) * Math.PI / 180 * EARTH_RADIUS_METERS,
  };
}

function distanceToSegment(point, start, end) {
  const origin = { lat: (start.lat + end.lat + point.lat) / 3, lon: point.lon };
  const target = localProjection(point, origin);
  const a = localProjection(start, origin);
  const b = localProjection(end, origin);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return Math.hypot(target.x - a.x, target.y - a.y);
  const t = Math.max(0, Math.min(1, ((target.x - a.x) * dx + (target.y - a.y) * dy) / lengthSquared));
  return Math.hypot(target.x - (a.x + t * dx), target.y - (a.y + t * dy));
}

function lineSegmentsFromPart(part) {
  if (!part || !Array.isArray(part.coordinates)) return [];
  if (part.type === 'LineString') {
    return part.coordinates.slice(1).flatMap((coordinate, index) => {
      const start = toCoordinatePair(part.coordinates[index]);
      const end = toCoordinatePair(coordinate);
      return start && end ? [[start, end]] : [];
    });
  }
  if (part.type === 'MultiLineString') {
    return part.coordinates.flatMap((line) => lineSegmentsFromPart({ type: 'LineString', coordinates: line }));
  }
  return [];
}

export function lineSegments(value) {
  return geometryParts(value).flatMap(lineSegmentsFromPart);
}

export function distanceToLineMeters(point, value) {
  const target = normalisePoint(point);
  if (!target) return null;
  const segments = lineSegments(value);
  if (segments.length === 0) return null;
  let minimum = Infinity;
  for (const [start, end] of segments) {
    const distance = distanceToSegment(target, start, end);
    if (distance < minimum) minimum = distance;
  }
  return Number.isFinite(minimum) ? minimum : null;
}

export function haversineDistanceMeters(first, second) {
  const a = normalisePoint(first);
  const b = normalisePoint(second);
  if (!a || !b) return null;
  const lat1 = a.lat * Math.PI / 180;
  const lat2 = b.lat * Math.PI / 180;
  const deltaLat = (b.lat - a.lat) * Math.PI / 180;
  const deltaLon = (b.lon - a.lon) * Math.PI / 180;
  const sinLat = Math.sin(deltaLat / 2);
  const sinLon = Math.sin(deltaLon / 2);
  const value = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
  return 2 * EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(value), Math.sqrt(Math.max(0, 1 - value)));
}

export function formatDistance(meters) {
  if (!finiteNumber(meters)) return 'Not available';
  if (meters < 100) return `~${Math.max(1, Math.round(meters))} m`;
  if (meters < 1000) return `~${Math.round(meters / 10) * 10} m`;
  return `~${(meters / 1000).toFixed(1)} km`;
}

function nearestTrace(point, traces, maximumDistanceMeters) {
  if (!Array.isArray(traces)) return null;
  let closest = null;
  for (const trace of traces) {
    const distanceMeters = haversineDistanceMeters(point, trace);
    if (!finiteNumber(distanceMeters)) continue;
    if (!closest || distanceMeters < closest.distanceMeters) {
      closest = { trace, distanceMeters };
    }
  }
  return closest && closest.distanceMeters <= maximumDistanceMeters ? closest : null;
}

export function classifyLocation({
  point,
  eastBerlin,
  westBerlin,
  wallLine,
  traces = [],
  bounds = MAP_BOUNDS,
  nearBorderMeters = DEFAULT_NEAR_BORDER_METERS,
  traceRadiusMeters = DEFAULT_TRACE_RADIUS_METERS,
} = {}) {
  const target = normalisePoint(point);
  const outsideScope = !target || !isInSupportedBerlinScope(target, bounds);
  if (outsideScope) {
    return {
      category: CATEGORY_KEYS.OUTSIDE_SCOPE,
      categoryLabel: CATEGORY_LABELS[CATEGORY_KEYS.OUTSIDE_SCOPE],
      side: null,
      point: target,
      inSupportedScope: false,
      wallDistanceMeters: null,
      nearestTrace: null,
    };
  }

  const inEast = pointInGeometry(target, eastBerlin);
  const inWest = pointInGeometry(target, westBerlin);
  const side = inEast && !inWest ? CATEGORY_KEYS.EAST : inWest && !inEast ? CATEGORY_KEYS.WEST : null;
  const wallDistanceMeters = distanceToLineMeters(target, wallLine);
  const category = side && finiteNumber(wallDistanceMeters) && wallDistanceMeters <= nearBorderMeters
    ? CATEGORY_KEYS.NEAR_BORDER
    : side || CATEGORY_KEYS.OUTSIDE_SCOPE;
  const trace = nearestTrace(target, traces, traceRadiusMeters);

  return {
    category,
    categoryLabel: CATEGORY_LABELS[category],
    side,
    point: target,
    inSupportedScope: Boolean(side),
    wallDistanceMeters: side ? wallDistanceMeters : null,
    nearestTrace: trace,
  };
}
