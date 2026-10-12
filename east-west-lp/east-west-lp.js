/* East or West Berlin in 1989? landing page, deployable build.
 * Loaded by the Wix embed loader on /east-or-west (see lp/wix-embed-east-or-west.html).
 * Renders in a shadow root. Runtime URLs resolve from this script's own folder:
 * ../east-west-1989/data/ for the tool geography, img/ for the photo and wordmark.
 * Leaflet loads from cdnjs with the tool's SRI hash. Geometry is local code (no Turf). The lead POST runs from this page,
 * not from an iframe, because the endpoint checks Origin.
 */
(function () {
  'use strict';

  // GEO-BEGIN
  // Geometry without Turf. Wix freezes some globals, which breaks Turf 6.5.0 at load.
  // Distances: haversine on the sphere (radius 6371008.8 m), the same formula as Turf's distance.
  // Line distances: the foot of the perpendicular is found in a local plane centred on the query point, and the
  // distance is the great-circle distance to that foot.
  // Point in polygon: even-odd ray casting over outer ring and holes.
  var BWGEO = (function () {
    var R = 6371008.8;
    var RAD = Math.PI / 180;
    function haversine(a, b) {
      var dLat = (b[1] - a[1]) * RAD;
      var dLng = (b[0] - a[0]) * RAD;
      var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(a[1] * RAD) * Math.cos(b[1] * RAD) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
      return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    }
    function ringContains(ring, pt) {
      var x = pt[0], y = pt[1], inside = false;
      for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        var xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1];
        if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    }
    function polygonContains(rings, pt) {
      var inside = false;
      for (var i = 0; i < rings.length; i++) {
        if (ringContains(rings[i], pt)) inside = !inside;
      }
      return inside;
    }
    function pointInGeometry(pt, geom) {
      if (geom.type === 'Polygon') return polygonContains(geom.coordinates, pt);
      if (geom.type === 'MultiPolygon') {
        for (var i = 0; i < geom.coordinates.length; i++) {
          if (polygonContains(geom.coordinates[i], pt)) return true;
        }
      }
      return false;
    }
    function pointInFeature(pt, feat) {
      return pointInGeometry(pt, feat.geometry || feat);
    }
    // Local tangent-plane projection centred on the query point p, so error stays tiny at any distance.
    function makeProjector(p) {
      var kx = RAD * R * Math.cos(p[1] * RAD), ky = RAD * R;
      return {
        fwd: function (q) { return [(q[0] - p[0]) * kx, (q[1] - p[1]) * ky]; },
        inv: function (Q) { return [p[0] + Q[0] / kx, p[1] + Q[1] / ky]; }
      };
    }
    // Nearest point on the segment a-b to p. The foot parameter comes from the local plane; the
    // distance is the great-circle distance to that foot point, so it stays exact at any range.
    function segmentNearest(p, a, b, proj) {
      var A = proj.fwd(a), B = proj.fwd(b);
      var abx = B[0] - A[0], aby = B[1] - A[1];
      var len2 = abx * abx + aby * aby;
      var t = len2 === 0 ? 0 : (-A[0] * abx - A[1] * aby) / len2;
      t = Math.max(0, Math.min(1, t));
      var q = [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])];
      return { dist: haversine(p, q), point: q };
    }
    // lines: array of coordinate arrays (LineStrings). Returns the nearest point on any of them.
    function nearestOnLines(p, lines) {
      var proj = makeProjector(p);
      var best = { dist: Infinity, point: null };
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line.length === 1) {
          var d1 = haversine(p, line[0]);
          if (d1 < best.dist) best = { dist: d1, point: line[0] };
          continue;
        }
        for (var k = 0; k < line.length - 1; k++) {
          var s = segmentNearest(p, line[k], line[k + 1], proj);
          if (s.dist < best.dist) best = s;
        }
      }
      return best;
    }
    return {
      haversine: haversine,
      pointInGeometry: pointInGeometry,
      pointInFeature: pointInFeature,
      nearestOnLines: nearestOnLines
    };
  })();
  // GEO-END

  var SELF = document.currentScript || Array.prototype.slice.call(document.getElementsByTagName('script'))
    .filter(function (s) { return /east-west-lp\.js(\?|$)/.test(s.src); }).pop();
  var BASE = new URL('./', SELF.src).href;
  var FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;800&display=swap';
  var STYLE = ":host {\n    --green: #1B5E20;\n    --yellow: #FFE600;\n    --cream: #FAFAF5;\n    --text: #212121;\n    --muted: #4E5A4E;\n    --border: #DCE8C8;\n    --field-border: #8FA97A;\n    --yellow-text: #123D18;\n    --allied: #185FA5;\n    --east: #A32D2D;\n    --death: #2C2C2A;\n    --wall: #B3262F;\n    --outside: #5F5F5F;\n    --err: #8A1C1C;\n  }\n  * { box-sizing: border-box; }\n  .lp-root {\n    margin: 0;\n    background: var(--cream);\n    color: var(--text);\n    font-family: Montserrat, Arial, sans-serif;\n    font-size: 16px;\n    line-height: 1.5;\n    color-scheme: light;\n    overflow-x: hidden;\n  }\n  a { color: var(--green); }\n  :focus-visible { outline: 3px solid var(--green); outline-offset: 2px; }\n  .wrap { max-width: 1120px; margin: 0 auto; padding: 20px 16px 28px; }\n  .cols { display: grid; gap: 28px; }\n  .mark { display: block; height: 34px; width: auto; }\n  h1 {\n    font-size: 28px;\n    line-height: 1.18;\n    font-weight: 800;\n    color: var(--green);\n    margin: 18px 0 10px;\n  }\n  .lead { margin: 0 0 18px; color: var(--muted); font-size: 16px; }\n  label { display: block; font-weight: 700; font-size: 14px; margin: 0 0 6px; }\n  .row { display: flex; flex-direction: column; gap: 10px; }\n  input[type=\"text\"], input[type=\"email\"] {\n    width: 100%;\n    font: inherit;\n    font-size: 16px;\n    padding: 13px 14px;\n    border: 1px solid var(--field-border);\n    border-radius: 10px;\n    background: #fff;\n    color: var(--text);\n  }\n  button {\n    font: inherit;\n    font-weight: 800;\n    font-size: 16px;\n    width: 100%;\n    padding: 14px 18px;\n    border: 0;\n    border-radius: 10px;\n    background: var(--yellow);\n    color: var(--yellow-text);\n    cursor: pointer;\n  }\n  button:disabled { opacity: 0.6; cursor: default; }\n  .privacy { margin: 8px 0 0; font-size: 12px; color: var(--muted); }\n  .help { margin: 8px 0 0; font-size: 13px; color: var(--muted); }\n  .msg { min-height: 1.3em; margin: 8px 0 0; font-size: 14px; color: var(--muted); overflow-wrap: anywhere; }\n  .msg.err { color: var(--err); }\n\n  .result {\n    margin-top: 16px;\n    border-radius: 14px;\n    overflow: hidden;\n    border: 1px solid var(--border);\n    background: #fff;\n  }\n  .res-head { padding: 16px; color: #fff; }\n  .res-head.west { background: var(--allied); }\n  .res-head.east { background: var(--east); }\n  .res-head.wall { background: var(--wall); }\n  .res-head.strip { background: var(--death); }\n  .res-head.outside { background: var(--outside); }\n  .kicker {\n    display: block;\n    font-size: 11px;\n    font-weight: 800;\n    letter-spacing: 2px;\n    text-transform: uppercase;\n    margin-bottom: 4px;\n  }\n  .res-title { font-size: 24px; font-weight: 800; line-height: 1.15; }\n  .res-sub { font-size: 13px; margin-top: 3px; }\n  .res-body { padding: 16px; }\n  .map-wrap { margin: 0 0 14px; }\n  .lp-map {\n    width: 100%;\n    height: 260px;\n    border-radius: 12px;\n    border: 1px solid var(--border);\n    background: #E8EEDC;\n    overflow: hidden;\n  }\n  .map-hint { margin: 6px 0 0; font-size: 12px; color: var(--muted); line-height: 1.4; }\n  .map-fail { margin: 0 0 14px; font-size: 13px; color: var(--muted); }\n  .matched { margin: 0 0 12px; font-size: 13px; color: var(--muted); overflow-wrap: anywhere; }\n  .cells { display: grid; gap: 10px; grid-template-columns: 1fr; margin-bottom: 14px; }\n  @media (min-width: 480px) { .cells { grid-template-columns: 1fr 1fr; } }\n  .cell { border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; background: var(--cream); }\n  .cell-label { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }\n  .cell-value { font-size: 16px; font-weight: 700; margin-top: 2px; overflow-wrap: anywhere; }\n  .ctx { margin: 0; font-size: 15px; }\n  .note { margin: 12px 0 0; font-size: 12px; color: var(--muted); }\n\n  .letter {\n    margin-top: 22px;\n    padding: 20px 16px 18px;\n    background: #fff;\n    border: 1px solid var(--border);\n    border-top: 6px solid var(--yellow);\n    border-radius: 14px;\n  }\n  .letter h2 { margin: 0 0 8px; font-size: 20px; line-height: 1.25; color: var(--green); }\n  .letter p { margin: 0 0 14px; font-size: 14px; color: var(--muted); }\n  .consent {\n    display: flex;\n    gap: 10px;\n    align-items: flex-start;\n    font-weight: 400;\n    font-size: 13px;\n    line-height: 1.45;\n    margin: 0 0 14px;\n    color: var(--text);\n  }\n  .consent input[type=\"checkbox\"] { flex: 0 0 auto; width: 18px; height: 18px; margin: 2px 0 0; }\n  .hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }\n  .done h3 { margin: 0 0 6px; font-size: 18px; color: var(--green); }\n  .done p { margin: 0; font-size: 14px; color: var(--text); }\n\n  .photo { margin: 0; }\n  .photo img { display: block; width: 100%; height: auto; border-radius: 14px; }\n  .photo figcaption { margin-top: 8px; font-size: 12px; color: var(--muted); line-height: 1.4; }\n  .legal { margin-top: 28px; font-size: 12px; color: var(--muted); }\n  .legal a { color: var(--muted); }\n\n  @media (min-width: 560px) {\n    .row { flex-direction: row; }\n    .row button { width: auto; white-space: nowrap; }\n  }\n  @media (min-width: 900px) {\n    .wrap { padding: 36px 24px 36px; }\n    .cols { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 56px; align-items: start; }\n    .photo { position: sticky; top: 24px; }\n    h1 { font-size: 40px; margin-top: 22px; }\n    .lp-map { height: 380px; }\n    .lead { font-size: 18px; }\n  }\n";
  var MARKUP = "<div class=\"lp-root\"><div class=\"wrap\">\n  <div class=\"cols\">\n    <section aria-labelledby=\"top\">\n      <img class=\"mark\" src=\"img/walkofberlin-wordmark-green.svg\" alt=\"Walk of Berlin\" width=\"227\" height=\"36\">\n      <h1 id=\"top\">Was your street in East or West Berlin in 1989?</h1>\n      <p class=\"lead\">Berlin split in 1961. Type your street and see which side it was on in 1989.</p>\n\n      <form id=\"lookup\" novalidate>\n        <label for=\"addr\">Berlin street and house number</label>\n        <div class=\"row\">\n          <input id=\"addr\" name=\"address\" type=\"text\" autocomplete=\"off\" maxlength=\"120\" placeholder=\"Bernauer Straße 10\">\n          <button type=\"submit\" id=\"lookupBtn\">Check my street</button>\n        </div>\n        <p class=\"privacy\">Your address is sent to OpenStreetMap to find the spot. I do not store it.</p>\n        <p class=\"help\">Berlin addresses only. Example: Kurfürstendamm 20.</p>\n        <p class=\"msg\" id=\"lookupMsg\" role=\"status\" aria-live=\"polite\"></p>\n      </form>\n\n      <div class=\"result\" id=\"result\" aria-live=\"polite\" hidden></div>\n\n      <section class=\"letter\" id=\"letter\" hidden aria-labelledby=\"letter-title\">\n        <h2 id=\"letter-title\">Want one Berlin story like this every week? I write Walk of Berlin Weekly.</h2>\n        <p>Every Monday I send one email: the Berlin dates about to land, what I checked myself that week, and the one move I would make. No tour pitch in it.</p>\n        <form id=\"signup\" novalidate>\n          <label for=\"email\">Your email</label>\n          <input id=\"email\" name=\"email\" type=\"email\" autocomplete=\"email\" placeholder=\"you@example.com\" style=\"margin-bottom:14px\">\n          <label class=\"consent\" for=\"consent\">\n            <input id=\"consent\" name=\"consent\" type=\"checkbox\">\n            <span>Send me Walk of Berlin Weekly, my Monday letter: one email a week about what is actually changing in Berlin, plus occasional Walk of Berlin emails. I can unsubscribe from any email with one click. Read the <a href=\"https://walkofberlin.com/privacy-policy\" target=\"_blank\" rel=\"noopener\">Privacy Policy</a>.</span>\n          </label>\n          <div class=\"hp\" aria-hidden=\"true\"><label for=\"website\">Leave this empty</label><input id=\"website\" name=\"website\" type=\"text\" tabindex=\"-1\" autocomplete=\"off\"></div>\n          <button type=\"submit\" id=\"signupBtn\">Send it to me</button>\n          <p class=\"msg\" id=\"signupMsg\" role=\"status\" aria-live=\"polite\"></p>\n        </form>\n        <div class=\"done\" id=\"done\" hidden>\n          <h3>Check your inbox</h3>\n          <p id=\"doneText\"></p>\n        </div>\n      </section>\n    </section>\n\n    <figure class=\"photo\">\n      <img src=\"img/brandenburg-gate-wall-1989.jpg\" width=\"1200\" height=\"800\" alt=\"The Berlin Wall at the Brandenburg Gate in 1989. A crane lifts a section of the wall at night while people stand and watch.\">\n      <figcaption>The Berlin Wall at the Brandenburg Gate, 1989. Photo by SSGT F. Lee Corkran, public domain, via <a href=\"https://commons.wikimedia.org/wiki/File:Crane_removed_part_of_Wall_Brandenburg_Gate.jpg\" target=\"_blank\" rel=\"noopener\">Wikimedia Commons</a>.</figcaption>\n    </figure>\n  </div>\n\n  <footer class=\"legal\">\n    <a href=\"https://app.berlinwalk.com/impressum\" target=\"_blank\" rel=\"noopener\">Imprint</a> &middot;\n    <a href=\"https://walkofberlin.com/privacy-policy\" target=\"_blank\" rel=\"noopener\">Privacy Policy</a>\n  </footer>\n</div></div>";


function boot(ROOT) {
  'use strict';

  // Consent and asset values are copied from the live Walk of Berlin Weekly letter bar
  // (berlinwalk-widgets/blog-category/blog-category-element.js). Do not edit them here alone.
  var CONSENT_VERSION = 'berlin-weekly-letter-v2-2026-10-02';
  var ASSET_ID = 'berlin-weekly-letter';
  var ASSET_VERSION = '2026-09-v1';
  var LETTER_API = 'https://app.berlinwalk.com/api/download-lead?action=submit';
  var DATA_BASE = new URL('../east-west-1989/data/', BASE).href;
  var GEOCODER = 'https://nominatim.openstreetmap.org/search';
  var BERLIN_VIEWBOX = '13.0883,52.6755,13.7611,52.3382';

  // Event log for later ad measurement. No address or email text goes into these events.
  window.bwLpEvents = window.bwLpEvents || [];
  var fired = {};
  function track(name, props) {
    var ev = { event: name, at: new Date().toISOString() };
    if (props) { for (var k in props) { if (Object.prototype.hasOwnProperty.call(props, k)) ev[k] = props[k]; } }
    window.bwLpEvents.push(ev);
    try { console.log('[bw-lp] ' + JSON.stringify(ev)); } catch (e) { /* console may be unavailable */ }
    try { window.dispatchEvent(new CustomEvent('bw-lp-event', { detail: ev })); } catch (e) { /* old browser */ }
  }
  function once(name, props) {
    if (fired[name]) return;
    fired[name] = true;
    track(name, props);
  }

  function $(id) { return ROOT.getElementById(id); }
  var el = {
    addr: $('addr'), lookupForm: $('lookup'), lookupBtn: $('lookupBtn'), lookupMsg: $('lookupMsg'),
    result: $('result'), letter: $('letter'), signup: $('signup'), email: $('email'),
    consent: $('consent'), website: $('website'), signupBtn: $('signupBtn'), signupMsg: $('signupMsg'),
    done: $('done'), doneText: $('doneText')
  };

  var geo = null;
  var lookupBusy = false;
  var signBusy = false;
  var submitted = false;
  var lastCategory = '';
  var formStartedAt = '';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  function showMsg(node, text, isErr) {
    node.textContent = text;
    node.className = 'msg' + (isErr ? ' err' : '');
  }
  function formatM(m) {
    if (m >= 1000) return (m / 1000).toFixed(1) + ' km';
    return m + ' m';
  }
  function cell(label, valueHtml) {
    return '<div class="cell"><div class="cell-label">' + esc(label) + '</div>' +
      '<div class="cell-value">' + valueHtml + '</div></div>';
  }

  // Geography and classification: the same polygons, wall line, 25 m on-the-Wall rule and
  // checkpoint lookup as east-west-1989/index.html. The map and tour links are left out.
  function pointIn(pt, fc) {
    var feats = fc.features || [{ geometry: fc.geometry || fc, properties: {} }];
    for (var i = 0; i < feats.length; i++) {
      var feat = feats[i].type === 'Feature'
        ? feats[i]
        : { type: 'Feature', geometry: feats[i], properties: {} };
      if (BWGEO.pointInFeature(pt, feat)) return true;
    }
    return false;
  }
  function nearest(pt, list) {
    var best = null, bestDist = Infinity;
    for (var i = 0; i < list.length; i++) {
      var d = BWGEO.haversine(pt, [list[i].lng, list[i].lat]);
      if (d < bestDist) { bestDist = d; best = list[i]; }
    }
    return { landmark: best, distance: bestDist };
  }
  function distanceToWall(pt) {
    var w = geo.wall;
    var geom = w.type === 'FeatureCollection' ? w.features[0].geometry : (w.geometry || w);
    var lines = geom.type === 'MultiLineString' ? geom.coordinates : [geom.coordinates];
    return BWGEO.nearestOnLines(pt, lines).dist;
  }

  function analyze(lat, lng) {
    var pt = [lng, lat];
    var wallDist = distanceToWall(pt);
    var onWall = wallDist <= 25;
    var inStrip = pointIn(pt, geo.strip);
    var inWest = pointIn(pt, geo.west);
    var inEast = pointIn(pt, geo.east);
    var category;
    if (onWall) category = 'wall';
    else if (inStrip) category = 'strip';
    else if (inWest) category = 'west';
    else if (inEast) category = 'east';
    else category = 'outside';

    if (category === 'outside') {
      return {
        category: category,
        title: 'Outside historical Berlin',
        sub: '',
        cells: '',
        body: 'This address is outside the historical Berlin city boundary. The Wall surrounded West Berlin only, and the land around it was East German countryside.'
      };
    }

    var nc = nearest(pt, geo.landmarks.checkpoints);
    var cells = cell('Distance to the Wall', esc(formatM(Math.round(wallDist))))
      + cell('Nearest checkpoint', esc(nc.landmark.name + ' (' + formatM(Math.round(nc.distance)) + ')'));

    var heads = {
      west: ['West Berlin', 'Allied sector'],
      east: ['East Berlin', 'Capital of the GDR'],
      wall: ['On the Wall itself', 'Border fortification zone'],
      strip: ['The Death Strip', 'No man\'s land']
    };
    var bodies = {
      west: 'In 1989 this address was in the Allied sector of West Berlin. The Wall surrounded it, but East German authority did not reach here.',
      east: 'In 1989 this address was in East Berlin, capital of the German Democratic Republic. Leaving for the West needed a permit and a checkpoint crossing. The nearest checkpoint is listed above.',
      wall: 'This spot is where the Wall ran in 1989. The fortification here was 3.6 meters of concrete on the West side, plus a patrolled corridor up to 100 meters wide on the East side, with watchtowers, anti-vehicle trenches, signal fences and floodlights. Anyone caught inside this zone could be shot on sight.',
      strip: 'In 1989 this address sat inside the Mauerstreifen, the patrolled corridor between the inner and outer Wall. Civilians could not enter. Border guards had standing orders to use lethal force on anyone trying to cross.'
    };
    return {
      category: category,
      title: heads[category][0],
      sub: heads[category][1],
      cells: cells,
      body: bodies[category]
    };
  }

  // Short label for what the geocoder matched, e.g. "Bernauer Straße 10, Oranienburger Vorstadt, Berlin".
  // The city comes from the result, because the search box also reaches into Brandenburg towns.
  function matchedLabel(hit) {
    var a = hit.address || {};
    if (a.road) {
      var street = a.road + (a.house_number ? ' ' + a.house_number : '');
      var district = a.suburb || a.city_district || a.neighbourhood || '';
      var city = a.city || a.town || a.village || a.municipality || '';
      return [street, district, city].filter(Boolean).join(', ');
    }
    return String(hit.display_name || '').split(',').map(function (s) { return s.trim(); }).slice(0, 3).join(', ');
  }

  function renderResult(out, hit, lat, lng) {
    var parts = matchedLabel(hit);
    var exact = !!((hit.address || {}).house_number) || hit.addresstype === 'building' || hit.addresstype === 'house' || hit.type === 'house' || hit.type === 'building';
    var coarse = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    var hint = coarse
      ? 'Use two fingers to move or zoom the map. One finger scrolls the page.'
      : 'Drag to move the map. The scroll wheel scrolls the page, it does not zoom.';
    var mapSlot = '<div class="map-wrap">' +
      '<div class="lp-map" id="lp-map" role="img" aria-label="Map: the matched address and the nearest point of the 1989 Wall"></div>' +
      '<p class="map-hint">' + esc(hint) + ' Map data: &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors.</p>' +
      '</div>';
    var html = '<div class="res-head ' + out.category + '">' +
      '<span class="kicker">Your location in 1989</span>' +
      '<div class="res-title">' + esc(out.title) + '</div>' +
      (out.sub ? '<div class="res-sub">' + esc(out.sub) + '</div>' : '') +
      '</div>' +
      '<div class="res-body">' +
      mapSlot +
      '<p class="matched">Matched address: ' + esc(parts) + '</p>' +
      (exact ? '' : '<p class="matched">This match is the street, not the exact house. Check the result before you rely on it.</p>') +
      (out.cells ? '<div class="cells">' + out.cells + '</div>' : '') +
      '<p class="ctx">' + esc(out.body) + '</p>' +
      '<p class="note">The result uses the matched address point, which can be a few meters off. A spot that close to a border can change side.</p>' +
      '</div>';
    el.result.innerHTML = html;
    el.result.hidden = false;

    var box = ROOT.getElementById('lp-map');
    ensureLeaflet().then(function (L) {
      mountMap(L, box, lat, lng);
    }).catch(function (err) {
      console.error('[bw-lp] map failed', err && err.stack);
      if (box && box.isConnected) {
        box.parentNode.innerHTML = '<p class="map-fail">The map did not load. The result still holds.</p>';
      }
    });
  }

  function mountMap(L, box, lat, lng) {
    if (!box || !box.isConnected) return;
    if (mapInst) { mapInst.remove(); mapInst = null; }
    var coarse = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    var map = L.map(box, {
      center: [52.520, 13.405],
      zoom: 11,
      minZoom: 10,
      maxZoom: 16,
      maxBounds: L.latLngBounds([52.30, 12.95], [52.72, 13.80]),
      maxBoundsViscosity: 0.7,
      scrollWheelZoom: false,
      // On touch screens one finger scrolls the page. Two fingers pinch and move the map (touchZoom).
      dragging: !coarse,
      touchZoom: true,
      boxZoom: false,
      keyboard: false,
      attributionControl: true
    });
    mapInst = map;
    L.tileLayer(TILE_URL, {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Overlays and styling as in east-west-1989/index.html.
    L.geoJSON(geo.east, { style: { fillColor: '#E63946', fillOpacity: 0.08, stroke: false, interactive: false } }).addTo(map);
    L.geoJSON(geo.west, { style: { fillColor: '#185FA5', fillOpacity: 0.08, stroke: false, interactive: false } }).addTo(map);
    L.geoJSON(geo.strip, { style: { fillColor: '#000000', fillOpacity: 0.18, color: '#444', weight: 0.5, dashArray: '2,2', interactive: false } }).addTo(map);
    L.geoJSON(wallFeature(), { style: { color: '#E63946', weight: 2.5, dashArray: '5,3', interactive: false } }).addTo(map);
    geo.landmarks.checkpoints.forEach(function (c) {
      L.circleMarker([c.lat, c.lng], { radius: 5, fillColor: '#1B5E20', fillOpacity: 1, color: '#FFFFFF', weight: 2, interactive: false }).addTo(map);
    });

    // The matched point (the tool's pin style) and the nearest Wall point, both kept in view.
    var wall = nearestWallPoint(lat, lng);
    L.circleMarker([lat, lng], { radius: 7, fillColor: '#FFE600', fillOpacity: 1, color: '#1B5E20', weight: 2, interactive: false }).addTo(map);
    map.fitBounds(L.latLngBounds([[lat, lng], [wall.lat, wall.lng]]), { padding: [28, 28], maxZoom: 16 });
    window.bwLpMap = map;
    window.bwLpMapFit = { point: [lat, lng], wall: [wall.lat, wall.lng] };
    setTimeout(function () { map.invalidateSize(); }, 150);
  }

  function revealLetter() {
    if (submitted) return;
    el.letter.hidden = false;
    formStartedAt = new Date().toISOString();
  }

  var LEAFLET_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
  var LEAFLET_JS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
  var LEAFLET_SRI = 'sha384-NElt3Op+9NBMCYaef5HxeJmU4Xeard/Lku8ek6hoPTvYkQPh3zLIrJP7KiRocsxO';
  var TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  var engine = null;
  var leaflet = null;
  var mapInst = null;

  function loadScript(src, sri) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      if (sri) { s.integrity = sri; s.crossOrigin = 'anonymous'; s.referrerPolicy = 'no-referrer'; }
      s.onload = resolve;
      s.onerror = function () { reject(new Error('load ' + src)); };
      document.head.appendChild(s);
    });
  }

  // The geography files. Loaded on the first lookup, not on page load.
  function ensureEngine() {
    if (!engine) {
      engine = Promise.resolve().then(function () {
        var names = ['west-berlin', 'east-berlin', 'death-strip', 'wall-line'];
        var reqs = names.map(function (n) {
          return fetch(DATA_BASE + n + '.geojson').then(function (r) {
            if (!r.ok) throw new Error(n);
            return r.json();
          });
        });
        reqs.push(fetch(DATA_BASE + 'landmarks.json').then(function (r) {
          if (!r.ok) throw new Error('landmarks');
          return r.json();
        }));
        return Promise.all(reqs);
      }).then(function (j) {
        geo = { west: j[0], east: j[1], strip: j[2], wall: j[3], landmarks: j[4] };
        return true;
      }).catch(function (err) {
        engine = null;
        throw err;
      });
    }
    return engine;
  }

  // Leaflet, loaded only after the first result is on screen.
  function ensureLeaflet() {
    if (window.L) return Promise.resolve(window.L);
    if (!leaflet) {
      var css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = LEAFLET_CSS;
      ROOT.appendChild(css);
      leaflet = loadScript(LEAFLET_JS, LEAFLET_SRI).then(function () {
        return window.L;
      }).catch(function (err) {
        leaflet = null;
        throw err;
      });
    }
    return leaflet;
  }

  function wallFeature() {
    var w = geo.wall;
    return w.type === 'FeatureCollection' ? w : { type: 'Feature', geometry: w, properties: {} };
  }

  // The point on the 1989 Wall line closest to the matched address.
  function nearestWallPoint(lat, lng) {
    var pt = [lng, lat];
    var w = geo.wall;
    var geom = w.type === 'FeatureCollection' ? w.features[0].geometry : (w.geometry || w);
    var lines = geom.type === 'MultiLineString' ? geom.coordinates : [geom.coordinates];
    var near = BWGEO.nearestOnLines(pt, lines);
    return { lat: near.point[1], lng: near.point[0] };
  }

  el.addr.addEventListener('focus', function () { once('tool_started', {}); });

  el.lookupForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (lookupBusy) return;
    var text = el.addr.value.replace(/\s+/g, ' ').trim();
    if (!text) {
      showMsg(el.lookupMsg, 'Type a Berlin street and house number, for example Bernauer Straße 10.', true);
      return;
    }
    once('tool_started', {});
    lookupBusy = true;
    el.lookupBtn.disabled = true;
    showMsg(el.lookupMsg, 'Looking up the address.', false);

    var q = /berlin/i.test(text) ? text : text + ', Berlin';
    var url = GEOCODER + '?format=jsonv2&limit=1&countrycodes=de&bounded=1&viewbox=' + BERLIN_VIEWBOX +
      '&accept-language=en&addressdetails=1&q=' + encodeURIComponent(q);
    var geocode = fetch(url).then(function (r) {
      if (!r.ok) throw new Error('geocode ' + r.status);
      return r.json();
    });

    Promise.all([ensureEngine(), geocode]).then(function (vals) {
      var hits = vals[1];
      lookupBusy = false;
      el.lookupBtn.disabled = false;
      if (!hits || !hits.length) {
        showMsg(el.lookupMsg, 'I could not find that address in Berlin. Try the street, the house number and the district, for example Bernauer Straße 10, Mitte.', true);
        return;
      }
      var hit = hits[0];
      var lat = parseFloat(hit.lat);
      var lng = parseFloat(hit.lon);
      if (!isFinite(lat) || !isFinite(lng)) throw new Error('bad coordinates');
      var out = analyze(lat, lng);
      showMsg(el.lookupMsg, '', false);
      renderResult(out, hit, lat, lng);
      lastCategory = out.category;
      track('result_shown', { category: out.category });
      revealLetter();
    }).catch(function () {
      lookupBusy = false;
      el.lookupBtn.disabled = false;
      showMsg(el.lookupMsg, 'The lookup did not complete. Try again in a moment.', true);
    });
  });

  el.email.addEventListener('focus', function () { once('form_started', { category: lastCategory }); });

  function readUtm() {
    var p = new URLSearchParams(window.location.search);
    return {
      source: p.get('utm_source') || '',
      medium: p.get('utm_medium') || '',
      campaign: p.get('utm_campaign') || '',
      content: p.get('utm_content') || '',
      term: p.get('utm_term') || ''
    };
  }

  el.signup.addEventListener('submit', function (event) {
    event.preventDefault();
    if (submitted || signBusy) return;
    var email = el.email.value.trim().toLowerCase();
    if (!email || email.indexOf('@') < 1) {
      showMsg(el.signupMsg, 'That email does not look right. Check it and try again.', true);
      return;
    }
    if (!el.consent.checked) {
      showMsg(el.signupMsg, 'Tick the box so I am allowed to email you.', true);
      return;
    }
    once('form_started', { category: lastCategory });
    signBusy = true;
    el.signupBtn.disabled = true;
    showMsg(el.signupMsg, 'Sending.', false);

    var body = {
      email: email,
      consent: true,
      consentVersion: CONSENT_VERSION,
      assetId: ASSET_ID,
      assetVersion: ASSET_VERSION,
      sourceSlug: 'east-or-west-1989',
      sourceUrl: window.location.href,
      pagePath: window.location.pathname,
      placement: 'east_west_lp',
      variant: 'lp_v1',
      utm: readUtm(),
      analyticsConsentAtSubmit: false,
      screenWidth: Number(window.innerWidth || 0),
      screenHeight: Number(window.innerHeight || 0),
      website: String(el.website.value || ''),
      startedAt: formStartedAt || new Date().toISOString(),
      submittedAt: new Date().toISOString()
    };

    fetch(LETTER_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) {
      if (!r.ok) throw new Error('submit ' + r.status);
      return r.json().catch(function () { return {}; });
    }).then(function () {
      submitted = true;
      track('form_submitted', { category: lastCategory });
      el.signup.hidden = true;
      el.doneText.innerHTML = 'I have sent one email to <strong>' + esc(email) +
        '</strong>. Click the link in it to confirm, and the next letter reaches you on Monday morning. ' +
        'If it is not there in a minute, look in the promotions or spam folder.';
      el.done.hidden = false;
    }).catch(function () {
      signBusy = false;
      el.signupBtn.disabled = false;
      showMsg(el.signupMsg, 'That did not go through. Try again in a moment.', true);
    });
  });

}

  function start() {
    var host = document.getElementById('bw-ew-lp');
    if (!host) {
      host = document.createElement('div');
      host.id = 'bw-ew-lp';
      // Outside the Wix container, which the loader hides on this page. The LP must not sit inside it.
      var container = document.getElementById('SITE_CONTAINER');
      if (container && container.parentNode) container.parentNode.insertBefore(host, container.nextSibling);
      else document.body.appendChild(host);
    }
    host.style.display = 'block';
    var root = host.shadowRoot || host.attachShadow({ mode: 'open' });
    var fonts = document.createElement('link');
    fonts.rel = 'stylesheet';
    fonts.href = FONTS;
    root.appendChild(fonts);
    var style = document.createElement('style');
    style.textContent = STYLE;
    root.appendChild(style);
    var wrap = document.createElement('div');
    wrap.innerHTML = MARKUP;
    while (wrap.firstChild) root.appendChild(wrap.firstChild);
    root.querySelectorAll('img').forEach(function (img) {
      img.src = new URL(img.getAttribute('src'), BASE).href;
    });
    boot(root);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
