/* history-lead-magnet-element.js
 * <bw-history-lead-magnet mode="inline|full">
 *
 * A consent-first Berlin history story sampler. The element uses light DOM,
 * never stores analytics state before analytics consent, and renders licensed
 * images only when assets-manifest.json explicitly marks a complete pair as
 * approved.
 */
(function () {
  'use strict';

  var TAG = 'bw-history-lead-magnet';
  var API_BASE_DEFAULT = 'https://app.berlinwalk.com/api/history-lead';
  var BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
  var PRIVACY_URL_DEFAULT = 'https://www.berlinwalk.com/privacy-policy';
  var CONSENT_VERSION = 'history-series-v2-2026-07-17';
  var EXPERIMENT_DEFAULT = 'history_story_lead_v1';
  var EXPERIMENT_STORAGE_KEY = 'bwHistoryLeadExperiment.v1';
  var DIRECT_ASSIGNMENT_STORAGE_KEY = 'bwHistoryLeadDirectAssignment.v1';
  var DIRECT_ACQUISITION_COHORT = 'direct_landing';
  var INLINE_ACQUISITION_COHORT = 'blog_history_inline';
  var DIRECT_PLACEMENT = 'history_landing_full';
  var INLINE_PLACEMENT = 'blog_inline_booking_slot';
  var PRIVACY_LINK_COPY = 'Read the Privacy Policy.';
  var SERIES_CONSENT_COPY = 'Email me Story 2 now and Story 3 about 48 hours later. These two emails include Berlin history and may also include information about BerlinWalk walking tours. I can unsubscribe at any time. Read the Privacy Policy.';
  var directMemoryAssignmentId = '';
  var ALLOWED_LICENSES = {
    'Public Domain': true,
    'CC0 1.0': true,
    'CC BY 3.0': true,
    'CC BY 4.0': true,
    'CC BY-SA 3.0': true,
    'CC BY-SA 4.0': true
  };
  var EVENT_NAMES = {
    bw_history_lead_experiment_view: true,
    bw_history_lead_story_open: true,
    bw_history_lead_gate_view: true,
    bw_history_lead_form_start: true,
    bw_history_lead_submit: true,
    bw_history_lead_doi_confirmed: true,
    bw_history_lead_story_access: true,
    bw_history_lead_tour_click: true,
    bw_history_control_booking_click: true
  };

  var scriptUrl = (function () {
    try {
      return document.currentScript && document.currentScript.src
        ? new URL(document.currentScript.src, window.location.href)
        : new URL('history-lead-magnet-element.js', window.location.href);
    } catch (err) {
      return null;
    }
  })();
  var assetManifestUrl = scriptUrl
    ? new URL('assets-manifest.json', scriptUrl).toString()
    : 'assets-manifest.json';

  var STORIES = {
    monbijou: {
      number: 1,
      eyebrow: 'Story 1 of 3',
      title: 'Monbijou Palace became a park',
      period: 'A royal residence, a wartime ruin, a public lawn',
      sourceLabel: 'Berlin.de, Monbijoupark history',
      sourceUrl: 'https://www.berlin.de/en/parks-and-gardens/5802991-4407152-monbijoupark.en.html',
      paragraphs: [
        'Monbijoupark looks like an obvious patch of green beside Museum Island. It is not. A rococo palace once occupied this ground, with formal gardens and rooms where a Prussian queen once lived. Bombing destroyed Schloss Monbijou during the Second World War, and Berlin created a public park on the site around 1960. The change is bigger than one lost building: a royal residence became roughly four hectares of open city space, with lawns, old trees, a children\'s pool and the Spree beside it.',
        'My advice: enter from the corner of Oranienburger Straße and Monbijoustraße. Stop near the shallow bowl fountain and look across the lawn toward the TV Tower. The palace is gone, so there is no surviving façade to find. The open ground is the clue. Compare the archive photograph with the width of the park and imagine the palace occupying the space where people now sit, play and cross toward the river.'
      ]
    },
    bethlehem: {
      number: 2,
      eyebrow: 'Story 2 of 3',
      title: 'A church survives as a line in the city',
      period: 'Bethlehemskirche to Bethlehemkirchplatz',
      sourceLabel: 'visitBerlin, Bethlehemkirchplatz and Memorias Urbanas',
      sourceUrl: 'https://www.visitberlin.de/en/bethlehemkirchplatz-sculpture-memorias-urbanas',
      secondarySourceLabel: 'Landesdenkmalamt Berlin, Böhmische Kirche',
      secondarySourceUrl: 'https://denkmaldatenbank.berlin.de/daobj.php?obj_dok_nr=09010170',
      paragraphs: [
        'Bethlehemkirchplatz is easy to pass because the church is missing. The Bohemian Church was built from 1735 to 1737 for a community of about 500 Protestant emigrants from Bohemia. It was destroyed during the Second World War. The remaining walls were blown up and cleared in 1963, close to the Berlin Wall. An archaeological investigation followed in 1994.',
        'Berlin did not rebuild the church. Instead, coloured stones mark its footprint in the pavement, while Juan Garaizabal\'s steel and light sculpture traces the vanished building above the square. That makes this one of the clearest places in Berlin to read architecture without a building.',
        'My advice: stand inside the stone outline rather than viewing it only from the pavement. First look down for the ground plan, then look up through the steel frame. The two layers give you the church\'s width and height without pretending the original survived.'
      ]
    },
    engelbecken: {
      number: 3,
      eyebrow: 'Story 3 of 3',
      title: 'A canal became a garden, then water again',
      period: 'Luisenstadt Canal to Engelbecken',
      sourceLabel: 'Landesdenkmalamt Berlin and Bezirksamt Mitte',
      sourceUrl: 'https://denkmaldatenbank.berlin.de/daobj.php?obj_dok_nr=09010197',
      secondarySourceLabel: 'Bezirksamt Mitte, water conservation at Engelbecken',
      secondarySourceUrl: 'https://www.berlin.de/ba-mitte/politik-und-verwaltung/aemter/umwelt-und-naturschutzamt/naturschutz/gewaesserschutz-am-engelbecken-1096016.php',
      paragraphs: [
        'Engelbecken has changed function more than once. The Luisenstadt Canal was built between 1848 and 1852 as a connection between the Spree and the Landwehr Canal. It widened here into a basin. Berlin filled the canal from 1926 to 1929 and turned the old channel into gardens. War damage and the Berlin Wall later destroyed much of that landscape, and the basin disappeared beneath the border strip.',
        'From 1990, surviving walls, steps, paths and fountain elements were uncovered. The protected landscape was then reconstructed section by section. Linden rows along the canal returned in 1991, the evergreen garden in 1993 and the rose garden in 1995.',
        'My advice: stand at the southern end of Engelbecken and face St Michael\'s Church. The long, straight view is not accidental. Water, lawns, trees and the church still follow the old canal axis, so the shape of the vanished waterway remains visible without a map.'
      ]
    }
  };

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function safeUrl(value) {
    try {
      var url = new URL(String(value || ''), window.location.href);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
      return url.origin + url.pathname;
    } catch (err) {
      return '';
    }
  }

  function cleanAttribution(value) {
    var cleaned = String(value || '').trim().slice(0, 180);
    return /@|%40/i.test(cleaned) ? '' : cleaned;
  }

  function currentConsentPolicy() {
    try {
      var manager = window.consentPolicyManager;
      var current = manager && typeof manager.getCurrentConsentPolicy === 'function'
        ? manager.getCurrentConsentPolicy()
        : null;
      current = current && (current.policy || current);
      if (current && Object.keys(current).length) return current;
    } catch (err) {}
    try {
      var match = document.cookie.match(/(?:^|;\s*)consent-policy=([^;]+)/);
      return match ? JSON.parse(decodeURIComponent(match[1])) : {};
    } catch (err) {
      return {};
    }
  }

  function analyticsAllowed() {
    var policy = currentConsentPolicy();
    return policy.analytics === true || policy.anl === true || policy.anl === 1;
  }

  function validAssignmentId(value) {
    value = String(value || '');
    return /^hwa_[a-f0-9]{32}$/i.test(value) ? value : '';
  }

  function randomAssignmentId() {
    try {
      if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
        var values = new Uint32Array(4);
        window.crypto.getRandomValues(values);
        return 'hwa_' + Array.prototype.map.call(values, function (value) {
          return Number(value).toString(16).padStart(8, '0');
        }).join('');
      }
    } catch (err) {}
    var fallback = '';
    for (var i = 0; i < 4; i++) fallback += Math.floor(Math.random() * 4294967296).toString(16).padStart(8, '0');
    return 'hwa_' + fallback;
  }

  function storedAssignmentId(key) {
    if (!analyticsAllowed()) return '';
    try {
      var raw = window.localStorage.getItem(key);
      var parsed = raw ? JSON.parse(raw) : null;
      return validAssignmentId(parsed && parsed.assignmentId);
    } catch (err) {
      return '';
    }
  }

  function directAssignmentId() {
    if (!analyticsAllowed()) return '';
    if (!directMemoryAssignmentId) directMemoryAssignmentId = storedAssignmentId(DIRECT_ASSIGNMENT_STORAGE_KEY);
    if (!directMemoryAssignmentId) directMemoryAssignmentId = randomAssignmentId();
    try {
      window.localStorage.setItem(DIRECT_ASSIGNMENT_STORAGE_KEY, JSON.stringify({
        assignmentId: directMemoryAssignmentId,
        assignedAt: new Date().toISOString()
      }));
    } catch (err) {}
    return directMemoryAssignmentId;
  }

  function acquisitionCohort(element) {
    var explicit = cleanAttribution(element.getAttribute('acquisition-cohort'));
    if (explicit) return explicit;
    return element._mode() === 'full' ? DIRECT_ACQUISITION_COHORT : INLINE_ACQUISITION_COHORT;
  }

  function placement(element) {
    var explicit = cleanAttribution(element.getAttribute('placement'));
    if (explicit) return explicit;
    return element._mode() === 'full' ? DIRECT_PLACEMENT : INLINE_PLACEMENT;
  }

  function assignmentId(element) {
    if (!analyticsAllowed()) return '';
    var explicit = validAssignmentId(element.getAttribute('assignment-id'));
    if (explicit) return explicit;
    var value = element._mode() === 'inline'
      ? storedAssignmentId(EXPERIMENT_STORAGE_KEY)
      : directAssignmentId();
    if (value) element.setAttribute('assignment-id', value);
    return value;
  }

  function trackingMetadata(element) {
    return {
      acquisitionCohort: acquisitionCohort(element),
      placement: placement(element),
      assignmentId: assignmentId(element),
      analyticsConsentAtSubmit: analyticsAllowed()
    };
  }

  function renderSeriesConsentCopy(privacyUrl) {
    var prefix = SERIES_CONSENT_COPY.slice(0, -PRIVACY_LINK_COPY.length);
    return escapeHtml(prefix) + '<a href="' + escapeHtml(privacyUrl) + '" target="_top">' + escapeHtml(PRIVACY_LINK_COPY) + '</a>';
  }

  function getUtm() {
    var params = new URLSearchParams(window.location.search || '');
    return {
      source: cleanAttribution(params.get('utm_source')),
      medium: cleanAttribution(params.get('utm_medium')),
      campaign: cleanAttribution(params.get('utm_campaign')),
      content: cleanAttribution(params.get('utm_content')),
      term: cleanAttribution(params.get('utm_term')),
      id: cleanAttribution(params.get('utm_id'))
    };
  }

  function sourceSlug() {
    var parts = String(window.location.pathname || '').split('/').filter(Boolean);
    try { return decodeURIComponent(parts[parts.length - 1] || 'berlin-before-and-now'); }
    catch (err) { return parts[parts.length - 1] || 'berlin-before-and-now'; }
  }

  function bookingHref(mode) {
    var url = new URL(BOOKING_URL);
    url.searchParams.set('utm_source', 'berlinwalk');
    url.searchParams.set('utm_medium', 'lead_magnet');
    url.searchParams.set('utm_campaign', 'history_sampler_v1');
    url.searchParams.set('utm_content', mode === 'inline' ? 'inline_secondary_booking' : 'story_page_booking');
    return url.toString();
  }

  function requestedStory(element) {
    var raw = element.getAttribute('story') || '';
    if (!raw) {
      try { raw = new URLSearchParams(window.location.search || '').get('story') || ''; }
      catch (err) {}
    }
    if (raw === '2' || raw === 'bethlehem') return 'bethlehem';
    if (raw === '3' || raw === 'engelbecken') return 'engelbecken';
    return 'monbijou';
  }

  function validAssetPair(entry) {
    if (!entry || entry.approved !== true || !entry.archive || !entry.current) return false;
    var pair = [entry.archive, entry.current];
    return pair.every(function (asset) {
      return Boolean(
        asset.src && asset.alt && asset.creator && asset.sourceName && asset.sourcePage &&
        ALLOWED_LICENSES[asset.license]
      );
    });
  }

  function resolveAssetSrc(src) {
    try { return new URL(src, assetManifestUrl).toString(); }
    catch (err) { return ''; }
  }

  class BWHistoryLeadMagnet extends HTMLElement {
    constructor() {
      super();
      this._startedAt = new Date().toISOString();
      this._manifest = null;
      this._tracked = {};
      this._pendingTracking = {};
      this._formStarted = false;
      this._submitting = false;
      this._connected = false;
      this._accessStory = 'monbijou';
      this._accessDeniedStory = '';
      this._onConsentChange = this._flushPendingTracking.bind(this);
    }

    connectedCallback() {
      if (this._connected) return;
      this._connected = true;
      this.classList.add('bw-history-lead-host');
      this.setAttribute('data-bw-history-lead-ready', 'loading');
      this.innerHTML = '<div class="bw-history-lead__loading" role="status">Loading the Berlin story...</div>';
      this._installConsentListeners();
      Promise.all([this._loadManifest(), this._resolveStoryAccess()]).then(function () {
        this._render();
      }.bind(this)).catch(function () {
        this.setAttribute('data-bw-history-lead-ready', 'error');
        this.innerHTML = '<div class="bw-history-lead__loading" role="alert">The Berlin story could not load. Please try again.</div>';
        try {
          this.dispatchEvent(new CustomEvent('bw-history-lead-error', { bubbles: true }));
        } catch (err) {}
      }.bind(this));
    }

    disconnectedCallback() {
      this._removeConsentListeners();
      this._connected = false;
    }

    _installConsentListeners() {
      ['consentPolicyChanged', 'consentPolicyInitialized', 'ucConsentEvent'].forEach(function (name) {
        window.addEventListener(name, this._onConsentChange);
        document.addEventListener(name, this._onConsentChange);
      }, this);
    }

    _removeConsentListeners() {
      ['consentPolicyChanged', 'consentPolicyInitialized', 'ucConsentEvent'].forEach(function (name) {
        window.removeEventListener(name, this._onConsentChange);
        document.removeEventListener(name, this._onConsentChange);
      }, this);
    }

    _loadManifest() {
      if (window.BW_HISTORY_LEAD_ASSET_MANIFEST) {
        this._manifest = window.BW_HISTORY_LEAD_ASSET_MANIFEST;
        return Promise.resolve();
      }
      return fetch(assetManifestUrl, { cache: 'no-cache' })
        .then(function (response) {
          if (!response.ok) throw new Error('Asset manifest unavailable');
          return response.json();
        })
        .then(function (manifest) { this._manifest = manifest; }.bind(this))
        .catch(function () { this._manifest = { stories: {} }; }.bind(this));
    }

    _mode() {
      return this.getAttribute('mode') === 'inline' ? 'inline' : 'full';
    }

    _storyAsset(storyId) {
      return this._manifest && this._manifest.stories && this._manifest.stories[storyId] || null;
    }

    _resolveStoryAccess() {
      if (this._mode() !== 'full') return Promise.resolve();
      var requested = requestedStory(this);
      if (requested === 'monbijou') return Promise.resolve();
      var storyNumber = requested === 'bethlehem' ? '2' : '3';
      var url = new URL(this._apiUrl('access'));
      url.searchParams.set('story', storyNumber);
      return fetch(url.toString(), {
        method: 'GET',
        credentials: 'include',
        headers: { accept: 'application/json' },
        cache: 'no-store'
      }).then(function (response) {
        if (!response.ok) throw new Error('Story access required');
        return response.json();
      }).then(function (payload) {
        if (!payload || payload.access !== true || Number(payload.level || 0) < Number(storyNumber)) {
          throw new Error('Story access required');
        }
        this._accessStory = requested;
      }.bind(this)).catch(function () {
        this._accessStory = 'monbijou';
        this._accessDeniedStory = requested;
      }.bind(this));
    }

    _render() {
      var mode = this._mode();
      var storyId = mode === 'inline' ? 'monbijou' : this._accessStory;
      var story = STORIES[storyId];
      if (mode === 'full') this._ensureNoIndex();

      this.innerHTML = [
        '<style>', this._styles(), '</style>',
        '<section class="bw-history-lead bw-history-lead--' + mode + '" aria-labelledby="bw-history-lead-title-' + storyId + '">',
        mode === 'full' ? this._renderFullIntro(storyId) : '',
        this._renderStory(storyId, story, mode),
        storyId === 'monbijou' ? this._renderGate(mode) : this._renderNextStep(storyId),
        this._renderCredits(storyId, story),
        '</section>'
      ].join('');

      this.setAttribute('data-bw-history-lead-ready', 'true');
      this.setAttribute('data-bw-history-story', storyId);
      this.setAttribute('data-bw-history-access', this._accessDeniedStory ? 'denied' : 'granted');
      this._bind(storyId, mode);
      this._queueTrack('bw_history_lead_story_open', storyId);
      if (storyId === 'monbijou') this._queueTrack('bw_history_lead_gate_view', storyId);
      else {
        if (storyId === 'bethlehem' && /[?&]status=confirmed(?:&|$)/.test(window.location.search || '')) {
          this._queueTrack('bw_history_lead_doi_confirmed', storyId);
        }
        this._queueTrack('bw_history_lead_story_access', storyId);
      }
    }

    _renderFullIntro(storyId) {
      if (storyId !== 'monbijou') {
        var confirmed = storyId === 'bethlehem' && /[?&]status=confirmed(?:&|$)/.test(window.location.search || '');
        return [
          '<header class="bw-history-lead__hero bw-history-lead__hero--compact">',
          '<p class="bw-history-lead__series">Berlin Before &amp; Now</p>',
          confirmed ? '<p class="bw-history-lead__confirmed" role="status">Email confirmed. Story 2 is open.</p>' : '',
          '</header>'
        ].join('');
      }
      return [
        this._accessDeniedStory ? '<p class="bw-history-lead__access-note" role="status">This story opens from your confirmation or story email. Check your inbox, then use the link I sent you.</p>' : '',
        '<header class="bw-history-lead__hero">',
        '<p class="bw-history-lead__series">A free three-part Berlin story</p>',
        '<h1 id="bw-history-lead-title-monbijou">Berlin Before &amp; Now: 3 Places Hiding Another City</h1>',
        '<p>Berlin often keeps its earlier city in lawns, paving lines and lowered ground. Start with one complete story here. The next two arrive by email after you confirm.</p>',
        '</header>'
      ].join('');
    }

    _renderStory(storyId, story, mode) {
      var headingId = 'bw-history-lead-title-' + storyId;
      var headingTag = mode === 'full' && storyId === 'monbijou' ? 'h2' : (mode === 'full' ? 'h1' : 'h2');
      return [
        '<article class="bw-history-lead__story">',
        '<div class="bw-history-lead__story-head">',
        '<div><p class="bw-history-lead__eyebrow">' + escapeHtml(story.eyebrow) + '</p>',
        '<' + headingTag + (mode === 'full' && storyId === 'monbijou' ? '' : ' id="' + headingId + '"') + '>' + escapeHtml(story.title) + '</' + headingTag + '>',
        '<p class="bw-history-lead__period">' + escapeHtml(story.period) + '</p></div>',
        '<span class="bw-history-lead__number" aria-hidden="true">0' + story.number + '</span>',
        '</div>',
        this._renderComparison(storyId),
        '<div class="bw-history-lead__copy">',
        story.paragraphs.map(function (paragraph) { return '<p>' + escapeHtml(paragraph) + '</p>'; }).join(''),
        '</div>',
        '</article>'
      ].join('');
    }

    _renderComparison(storyId) {
      var assets = this._storyAsset(storyId);
      if (!validAssetPair(assets)) {
        return [
          '<div class="bw-history-lead__photo-pending" data-bw-photo-pending role="note">',
          '<span aria-hidden="true">Before / now</span>',
          '<strong>The photo comparison is not available yet</strong>',
          '<small>The complete written story is ready below.</small>',
          '</div>'
        ].join('');
      }
      var reduced = false;
      try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
      catch (err) {}
      if (reduced) {
        return [
          '<div class="bw-history-lead__stacked" data-bw-comparison="' + storyId + '">',
          this._renderFigure(assets.archive, 'Before'),
          this._renderFigure(assets.current, 'Now'),
          '</div>'
        ].join('');
      }
      return [
        '<div class="bw-history-lead__compare" data-bw-comparison="' + storyId + '" style="--bw-compare:50%">',
        '<div class="bw-history-lead__compare-frame">',
        '<img src="' + escapeHtml(resolveAssetSrc(assets.archive.src)) + '" alt="' + escapeHtml(assets.archive.alt) + '" loading="lazy" data-bw-history-image>',
        '<div class="bw-history-lead__compare-now">',
        '<img src="' + escapeHtml(resolveAssetSrc(assets.current.src)) + '" alt="' + escapeHtml(assets.current.alt) + '" loading="lazy" data-bw-history-image>',
        '</div>',
        '<span class="bw-history-lead__compare-label bw-history-lead__compare-label--before">Before</span>',
        '<span class="bw-history-lead__compare-label bw-history-lead__compare-label--now">Now</span>',
        '<span class="bw-history-lead__compare-line" aria-hidden="true"></span>',
        '</div>',
        '<label class="bw-history-lead__range-label" for="bw-history-range-' + storyId + '">Drag to compare the archival and current photographs</label>',
        '<input id="bw-history-range-' + storyId + '" class="bw-history-lead__range" type="range" min="0" max="100" value="50" aria-valuetext="50% of the current photograph visible" data-bw-history-range>',
        '</div>'
      ].join('');
    }

    _renderFigure(asset, label) {
      return [
        '<figure><img src="' + escapeHtml(resolveAssetSrc(asset.src)) + '" alt="' + escapeHtml(asset.alt) + '" loading="lazy" data-bw-history-image>',
        '<figcaption>' + escapeHtml(label) + '</figcaption></figure>'
      ].join('');
    }

    _renderGate(mode) {
      var privacyUrl = this.getAttribute('privacy-url') || PRIVACY_URL_DEFAULT;
      return [
        '<div class="bw-history-lead__gate">',
        '<div class="bw-history-lead__gate-copy">',
        '<p class="bw-history-lead__eyebrow">Continue the series</p>',
        '<h3>Open the second place</h3>',
        '<p>Bethlehemkirchplatz looks almost empty until you know how to read the church that disappeared from it.</p>',
        '</div>',
        '<form class="bw-history-lead__form" data-bw-history-form novalidate>',
        '<label class="bw-history-lead__email-label" for="bw-history-email-' + mode + '">Email address</label>',
        '<div class="bw-history-lead__email-row">',
        '<input id="bw-history-email-' + mode + '" name="email" type="email" inputmode="email" autocomplete="email" placeholder="you@example.com" required data-bw-history-email>',
        '<button type="submit" data-bw-history-submit>Send me Story 2</button>',
        '</div>',
        '<div class="bw-history-lead__honeypot" aria-hidden="true"><label>Website<input name="website" type="text" tabindex="-1" autocomplete="off"></label></div>',
        '<label class="bw-history-lead__consent">',
        '<input name="consent" type="checkbox" required data-bw-history-consent>',
        '<span>' + renderSeriesConsentCopy(privacyUrl) + '</span>',
        '</label>',
        '<p class="bw-history-lead__status" role="status" aria-live="polite" data-bw-history-status></p>',
        '</form>',
        '</div>',
        this._renderBookingBridge(mode)
      ].join('');
    }

    _renderBookingBridge(mode) {
      return [
        '<aside class="bw-history-lead__tour">',
        '<div><strong>Want more Berlin history in person?</strong>',
        '<span>Join my free walking tour from Alexanderplatz.</span></div>',
        '<a href="' + escapeHtml(bookingHref(mode)) + '" target="_top" data-bw-history-tour>Check the next tour</a>',
        '</aside>'
      ].join('');
    }

    _renderNextStep(storyId) {
      if (storyId === 'bethlehem') {
        return [
          '<aside class="bw-history-lead__next">',
          '<p><strong>Story 3 arrives about two days after confirmation.</strong> It follows the old Luisenstadt Canal down to Engelbecken.</p>',
          '</aside>',
          this._renderBookingBridge('full')
        ].join('');
      }
      return [
        '<aside class="bw-history-lead__next"><p><strong>You have reached the third place.</strong> Look for the lowered ground when you visit Engelbecken. It is the canal line still shaping the park.</p></aside>',
        this._renderBookingBridge('full')
      ].join('');
    }

    _renderCredits(storyId, story) {
      var assets = this._storyAsset(storyId);
      var imageCredits = '';
      if (validAssetPair(assets)) {
        imageCredits = [assets.archive, assets.current].map(function (asset) {
          var licence = asset.licenseUrl
            ? '<a href="' + escapeHtml(asset.licenseUrl) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(asset.license) + '</a>'
            : escapeHtml(asset.license);
          return '<li><a href="' + escapeHtml(asset.sourcePage) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(asset.sourceName) + '</a>' +
            (asset.creator ? ', ' + escapeHtml(asset.creator) : '') + '. ' + licence +
            (asset.changes ? '. ' + escapeHtml(asset.changes) : '') + '</li>';
        }).join('');
      }
      return [
        '<details class="bw-history-lead__credits" data-bw-history-credits>',
        '<summary>Sources &amp; image credits</summary>',
        '<div><p><strong>Story source:</strong> <a href="' + escapeHtml(story.sourceUrl) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(story.sourceLabel) + '</a>.</p>',
        story.secondarySourceUrl ? '<p><strong>Additional source:</strong> <a href="' + escapeHtml(story.secondarySourceUrl) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(story.secondarySourceLabel) + '</a>.</p>' : '',
        imageCredits ? '<ul>' + imageCredits + '</ul>' : '<p>No comparison images are displayed for this story.</p>',
        '</div></details>'
      ].join('');
    }

    _bind(storyId, mode) {
      var range = this.querySelector('[data-bw-history-range]');
      if (range) {
        range.addEventListener('input', function () {
          var value = Math.max(0, Math.min(100, Number(range.value) || 0));
          var comparison = range.closest('[data-bw-comparison]');
          if (comparison) comparison.style.setProperty('--bw-compare', value + '%');
          range.setAttribute('aria-valuetext', value + '% of the current photograph visible');
        });
      }

      this.querySelectorAll('[data-bw-history-image]').forEach(function (image) {
        image.addEventListener('error', function () {
          var comparison = image.closest('[data-bw-comparison]');
          if (comparison) {
            comparison.innerHTML = '<div class="bw-history-lead__photo-pending" role="note"><strong>Photo comparison unavailable</strong><small>The written story is still available below.</small></div>';
          }
        }, { once: true });
      });

      var credits = this.querySelector('[data-bw-history-credits]');
      if (credits) {
        credits.addEventListener('keydown', function (event) {
          if (event.key === 'Escape' && credits.open) {
            credits.open = false;
            credits.querySelector('summary').focus();
          }
        });
      }

      var tour = this.querySelector('[data-bw-history-tour]');
      if (tour) tour.addEventListener('click', function () {
        this._queueTrack('bw_history_lead_tour_click', storyId);
      }.bind(this));

      var form = this.querySelector('[data-bw-history-form]');
      if (form) {
        form.addEventListener('focusin', function () {
          if (this._formStarted) return;
          this._formStarted = true;
          this._queueTrack('bw_history_lead_form_start', storyId);
        }.bind(this));
        form.addEventListener('submit', function (event) {
          event.preventDefault();
          this._submit(form, storyId, mode);
        }.bind(this));
      }
    }

    _submit(form, storyId, mode) {
      if (this._submitting) return;
      var email = form.querySelector('[name="email"]');
      var consent = form.querySelector('[name="consent"]');
      var status = form.querySelector('[data-bw-history-status]');
      var button = form.querySelector('[data-bw-history-submit]');
      if (!email.checkValidity()) {
        status.textContent = 'Enter a valid email address.';
        email.focus();
        return;
      }
      if (!consent.checked) {
        status.textContent = 'Tick the consent box to receive the next two stories.';
        consent.focus();
        return;
      }

      this._submitting = true;
      button.disabled = true;
      button.textContent = 'Sending...';
      status.textContent = '';
      var tracking = trackingMetadata(this);
      var body = {
        email: String(email.value || '').trim(),
        consent: true,
        consentVersion: CONSENT_VERSION,
        sourceSlug: sourceSlug(),
        sourceUrl: safeUrl(window.location.href),
        experiment: this.getAttribute('experiment') || EXPERIMENT_DEFAULT,
        variant: this.getAttribute('variant') || (mode === 'inline' ? 'variant' : 'standalone'),
        acquisitionCohort: tracking.acquisitionCohort,
        placement: tracking.placement,
        assignmentId: tracking.assignmentId,
        analyticsConsentAtSubmit: tracking.analyticsConsentAtSubmit,
        storyId: storyId,
        utm: getUtm(),
        website: String(form.querySelector('[name="website"]').value || ''),
        startedAt: this._startedAt,
        submittedAt: new Date().toISOString(),
        qa: this._isQa()
      };

      fetch(this._apiUrl('submit'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body)
      }).then(function (response) {
        if (!response.ok) throw new Error('Submit failed');
        form.classList.add('is-complete');
        email.disabled = true;
        consent.disabled = true;
        button.hidden = true;
        status.classList.add('is-success');
        status.textContent = 'Check your inbox. Click the confirmation link to open Story 2.';
        this._queueTrack('bw_history_lead_submit', storyId);
      }.bind(this)).catch(function () {
        button.disabled = false;
        button.textContent = 'Send me Story 2';
        status.textContent = 'The email could not be sent. Please try again.';
      }).finally(function () {
        this._submitting = false;
      }.bind(this));
    }

    _apiUrl(action) {
      var base = this.getAttribute('api-base') || window.BW_HISTORY_LEAD_API_BASE || API_BASE_DEFAULT;
      var url = new URL(base, window.location.href);
      url.searchParams.set('action', action);
      return url.toString();
    }

    _isQa() {
      return this.getAttribute('qa') === 'true' || /[?&]bwHistoryLead=(?:1|variant|control)(?:&|$)/.test(window.location.search || '');
    }

    _queueTrack(eventName, storyId) {
      var key = eventName + ':' + (storyId || 'none');
      if (this._tracked[key]) return;
      this._pendingTracking[key] = { eventName: eventName, storyId: storyId || '' };
      this._flushPendingTracking();
    }

    _flushPendingTracking() {
      if (!analyticsAllowed()) return;
      Object.keys(this._pendingTracking).forEach(function (key) {
        var item = this._pendingTracking[key];
        if (this._sendEvent(item.eventName, item.storyId)) {
          this._tracked[key] = true;
          delete this._pendingTracking[key];
        }
      }, this);
    }

    _sendEvent(eventName, storyId) {
      if (!EVENT_NAMES[eventName] || !analyticsAllowed()) return false;
      var tracking = trackingMetadata(this);
      var body = {
        eventName: eventName,
        occurredAt: new Date().toISOString(),
        analyticsConsent: true,
        analyticsConsentAtSubmit: tracking.analyticsConsentAtSubmit,
        sourceSlug: sourceSlug(),
        pageUrl: safeUrl(window.location.href),
        referrer: safeUrl(document.referrer),
        experiment: this.getAttribute('experiment') || EXPERIMENT_DEFAULT,
        variant: this.getAttribute('variant') || (this._mode() === 'inline' ? 'variant' : 'standalone'),
        acquisitionCohort: tracking.acquisitionCohort,
        placement: tracking.placement,
        assignmentId: tracking.assignmentId,
        storyId: storyId || '',
        utm: getUtm(),
        device: {
          width: Number(window.innerWidth || 0),
          height: Number(window.innerHeight || 0)
        },
        qa: this._isQa()
      };
      try {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: eventName,
          story_id: storyId || '',
          experiment: body.experiment,
          variant: body.variant,
          acquisition_cohort: body.acquisitionCohort,
          placement: body.placement,
          assignment_id: body.assignmentId
        });
        if (typeof window.gtag === 'function') window.gtag('event', eventName, {
          story_id: storyId || '',
          experiment: body.experiment,
          variant: body.variant,
          acquisition_cohort: body.acquisitionCohort,
          placement: body.placement,
          assignment_id: body.assignmentId
        });
        fetch(this._apiUrl('event'), {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          keepalive: true,
          body: JSON.stringify(body)
        }).catch(function () {});
        return true;
      } catch (err) {
        return false;
      }
    }

    _ensureNoIndex() {
      var robots = document.querySelector('meta[name="robots"]');
      if (!robots) {
        robots = document.createElement('meta');
        robots.setAttribute('name', 'robots');
        document.head.appendChild(robots);
      }
      robots.setAttribute('content', 'noindex,follow');
    }

    _styles() {
      return [
        '.bw-history-lead-host{display:block;max-width:100%;min-width:0}',
        '.bw-history-lead-host,.bw-history-lead-host *{box-sizing:border-box}',
        '.bw-history-lead-host [hidden]{display:none!important}',
        '.bw-history-lead__loading{border:1px solid #d5e5cf;border-radius:14px;color:#31553a;font:700 13px/1.4 Montserrat,Arial,sans-serif;margin:28px 0;padding:24px;text-align:center}',
        '.bw-history-lead__access-note{background:#fff8c7;border:1px solid #d9c400;border-radius:12px;color:#263b2b;font-size:13px;font-weight:750;line-height:1.5;margin:0 0 16px;padding:12px 14px}',
        '.bw-history-lead{--green:#1B5E20;--dark:#102414;--yellow:#FFE600;--cream:#FAFAF5;--soft:#EAF3E2;--muted:#4E5A4E;color:var(--dark);font-family:Montserrat,Arial,sans-serif;max-width:980px;margin:0 auto}',
        '.bw-history-lead--inline{background:#fff;border:1px solid #cfe4c8;border-radius:16px;box-shadow:0 10px 28px rgba(27,94,32,.09);margin:30px 0;overflow:hidden}',
        '.bw-history-lead--full{padding:42px 18px 70px}',
        '.bw-history-lead__hero{background:var(--dark);border-radius:18px;color:#fff;margin:0 0 24px;padding:clamp(28px,5vw,56px)}',
        '.bw-history-lead__hero--compact{padding:18px 24px}',
        '.bw-history-lead__hero h1{color:#fff;font-family:Merriweather,Georgia,serif;font-size:clamp(32px,6vw,62px);letter-spacing:-.035em;line-height:1.02;margin:10px 0 18px;max-width:820px}',
        '.bw-history-lead__hero>p:last-child{color:#dcebd8;font-size:17px;line-height:1.65;margin:0;max-width:700px}',
        '.bw-history-lead__series,.bw-history-lead__eyebrow{color:var(--green);font-size:11px;font-weight:900;letter-spacing:.15em;line-height:1.3;margin:0 0 8px;text-transform:uppercase}',
        '.bw-history-lead__hero .bw-history-lead__series{color:var(--yellow)}',
        '.bw-history-lead__confirmed{background:#fff;color:var(--green)!important;border-radius:8px;display:inline-block;font-size:14px!important;font-weight:800;margin:6px 0 0!important;padding:9px 12px}',
        '.bw-history-lead__story{background:#fff;min-width:0;padding:clamp(18px,4vw,38px)}',
        '.bw-history-lead--full .bw-history-lead__story{border:1px solid #d5e5cf;border-radius:18px}',
        '.bw-history-lead__story-head{align-items:flex-start;display:flex;gap:18px;justify-content:space-between;margin-bottom:20px}',
        '.bw-history-lead__story h1,.bw-history-lead__story h2{color:var(--dark)!important;font-family:Merriweather,Georgia,serif;font-size:clamp(26px,4vw,42px)!important;font-weight:800!important;letter-spacing:-.025em!important;line-height:1.1!important;margin:0 0 8px!important;text-transform:none!important}',
        '.bw-history-lead--inline .bw-history-lead__story h2{font-size:clamp(24px,4vw,34px)!important}',
        '.bw-history-lead__period{color:var(--muted)!important;font-size:13px;font-weight:700;line-height:1.4;margin:0!important}',
        '.bw-history-lead__number{color:#c5e1a5;font-family:Merriweather,Georgia,serif;font-size:42px;font-weight:900;line-height:1}',
        '.bw-history-lead__copy{display:grid;gap:13px;margin-top:22px}',
        '.bw-history-lead__copy p{color:#263b2b!important;font-size:15px!important;line-height:1.72!important;margin:0!important}',
        '.bw-history-lead__compare{margin:0;min-width:0}',
        '.bw-history-lead__compare-frame{aspect-ratio:4/3;background:#e8eee5;border-radius:12px;overflow:hidden;position:relative}',
        '.bw-history-lead__compare-frame>img,.bw-history-lead__compare-now img{height:100%!important;margin:0!important;max-width:none!important;object-fit:cover;width:100%!important}',
        '.bw-history-lead__compare-now{clip-path:inset(0 calc(100% - var(--bw-compare)) 0 0);height:100%;left:0;overflow:hidden;position:absolute;top:0;width:100%}',
        '.bw-history-lead__compare-line{background:#fff;box-shadow:0 0 0 1px rgba(16,36,20,.35);height:100%;left:var(--bw-compare);position:absolute;top:0;transform:translateX(-1px);width:2px}',
        '.bw-history-lead__compare-label{background:rgba(16,36,20,.86);border-radius:999px;color:#fff;font-size:10px;font-weight:900;letter-spacing:.08em;padding:6px 9px;position:absolute;text-transform:uppercase;top:10px}',
        '.bw-history-lead__compare-label--before{right:10px}.bw-history-lead__compare-label--now{left:10px}',
        '.bw-history-lead__range-label{color:var(--muted);display:block;font-size:11px;font-weight:700;margin:10px 0 5px}',
        '.bw-history-lead__range{accent-color:var(--green);cursor:ew-resize;margin:0;width:100%}',
        '.bw-history-lead__range:focus-visible{outline:3px solid var(--yellow);outline-offset:3px}',
        '.bw-history-lead__stacked{display:grid;gap:12px;grid-template-columns:1fr 1fr}',
        '.bw-history-lead__stacked figure{margin:0}.bw-history-lead__stacked img{aspect-ratio:4/3;border-radius:10px;height:auto;margin:0!important;object-fit:cover;width:100%}',
        '.bw-history-lead__stacked figcaption{color:var(--muted);font-size:11px;font-weight:800;margin-top:5px;text-align:center}',
        '.bw-history-lead__photo-pending{align-items:center;background:linear-gradient(135deg,#eaf3e2,#fafaf5);border:1px dashed #8db985;border-radius:12px;display:flex;flex-direction:column;justify-content:center;min-height:180px;padding:24px;text-align:center}',
        '.bw-history-lead__photo-pending span{color:var(--green);font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}',
        '.bw-history-lead__photo-pending strong{color:var(--dark);font-size:16px;margin-top:8px}',
        '.bw-history-lead__photo-pending small{color:var(--muted);font-size:12px;line-height:1.5;margin-top:5px;max-width:420px}',
        '.bw-history-lead__gate{background:var(--dark);color:#fff;display:grid;gap:24px;grid-template-columns:minmax(0,.8fr) minmax(300px,1.2fr);padding:clamp(22px,4vw,38px)}',
        '.bw-history-lead--full .bw-history-lead__gate{border-radius:18px;margin-top:20px}',
        '.bw-history-lead__gate .bw-history-lead__eyebrow{color:var(--yellow)}',
        '.bw-history-lead__gate h3{color:#fff;font-family:Merriweather,Georgia,serif;font-size:27px;line-height:1.15;margin:0 0 10px}',
        '.bw-history-lead__gate-copy>p:last-child{color:#d7e7d3;font-size:14px;line-height:1.6;margin:0}',
        '.bw-history-lead__email-label{color:#fff;display:block;font-size:12px;font-weight:800;margin-bottom:6px}',
        '.bw-history-lead__email-row{display:grid;gap:8px;grid-template-columns:minmax(0,1fr) auto}',
        '.bw-history-lead__email-row input{appearance:none;background:#fff;border:2px solid #fff;border-radius:8px;color:var(--dark);font:600 15px/1.2 Montserrat,Arial,sans-serif;min-height:48px;min-width:0;padding:0 13px;width:100%}',
        '.bw-history-lead__email-row input:focus{border-color:var(--yellow);outline:0}',
        '.bw-history-lead__email-row button{appearance:none;background:var(--yellow);border:2px solid var(--yellow);border-radius:8px;color:var(--dark)!important;cursor:pointer;font:900 14px/1.1 Montserrat,Arial,sans-serif;min-height:48px;padding:0 18px}',
        '.bw-history-lead__email-row button:hover,.bw-history-lead__email-row button:focus-visible{background:#fff36a;border-color:#fff36a;color:var(--dark)!important;outline:3px solid #fff;outline-offset:2px}',
        '.bw-history-lead__email-row button:disabled{cursor:wait;opacity:.7}',
        '.bw-history-lead__consent{align-items:flex-start;color:#d7e7d3;display:flex;font-size:11.5px;gap:9px;line-height:1.5;margin-top:11px}',
        '.bw-history-lead__consent input{accent-color:var(--yellow);flex:0 0 auto;height:18px;margin:1px 0 0;width:18px}',
        '.bw-history-lead__consent input:focus-visible{outline:3px solid var(--yellow);outline-offset:2px}',
        '.bw-history-lead__consent a{color:#fff!important;text-decoration:underline}',
        '.bw-history-lead__honeypot{height:0!important;left:-10000px!important;overflow:hidden!important;position:absolute!important;width:1px!important}',
        '.bw-history-lead__status{color:#ffd6d6;font-size:12px;font-weight:700;line-height:1.45;margin:8px 0 0;min-height:18px}',
        '.bw-history-lead__status.is-success{background:#eaf3e2;border-radius:8px;color:var(--green);font-size:13px;padding:10px 12px}',
        '.bw-history-lead__tour{align-items:center;background:var(--cream);border-top:1px solid #d5e5cf;display:flex;gap:18px;justify-content:space-between;padding:16px clamp(18px,4vw,38px)}',
        '.bw-history-lead--full .bw-history-lead__tour{border:1px solid #d5e5cf;border-radius:14px;margin-top:14px}',
        '.bw-history-lead__tour strong,.bw-history-lead__tour span{display:block}.bw-history-lead__tour strong{font-size:14px}.bw-history-lead__tour span{color:var(--muted);font-size:12px;margin-top:3px}',
        '.bw-history-lead__tour a{background:var(--green);border-radius:999px;color:#fff!important;flex:0 0 auto;font-size:13px;font-weight:900;padding:11px 16px;text-decoration:none!important}',
        '.bw-history-lead__tour a:hover,.bw-history-lead__tour a:focus-visible{outline:3px solid var(--yellow);outline-offset:2px}',
        '.bw-history-lead__next{background:#eaf3e2;border:1px solid #cfe4c8;border-radius:14px;margin-top:16px;padding:18px 20px}',
        '.bw-history-lead__next p{color:#26462d;font-size:14px;line-height:1.55;margin:0}',
        '.bw-history-lead__credits{margin:12px clamp(18px,4vw,38px) 18px;position:relative}',
        '.bw-history-lead--full .bw-history-lead__credits{margin:14px 4px 0}',
        '.bw-history-lead__credits summary{border:1px solid #bfd8b7;border-radius:999px;color:var(--green);cursor:pointer;display:inline-block;font-size:11px;font-weight:800;list-style:none;padding:7px 11px}',
        '.bw-history-lead__credits summary::-webkit-details-marker{display:none}',
        '.bw-history-lead__credits summary:focus-visible{outline:3px solid var(--yellow);outline-offset:2px}',
        '.bw-history-lead__credits>div{background:#fff;border:1px solid #d5e5cf;border-radius:10px;color:var(--muted);font-size:11px;line-height:1.5;margin-top:7px;max-width:680px;padding:12px 14px}',
        '.bw-history-lead__credits p{font-size:11px!important;line-height:1.5!important;margin:0 0 6px!important}.bw-history-lead__credits p:last-child{margin-bottom:0!important}',
        '.bw-history-lead__credits ul{margin:6px 0 0;padding-left:18px}.bw-history-lead__credits a{color:var(--green)!important}',
        '@media(max-width:700px){.bw-history-lead--full{padding:24px 10px 52px}.bw-history-lead--inline{margin:24px 0}.bw-history-lead__story{padding:20px 16px}.bw-history-lead__number{font-size:32px}.bw-history-lead__gate{grid-template-columns:1fr;padding:22px 16px}.bw-history-lead__email-row{grid-template-columns:1fr}.bw-history-lead__tour{align-items:flex-start;flex-direction:column}.bw-history-lead__tour a{text-align:center;width:100%}.bw-history-lead__stacked{grid-template-columns:1fr}}',
        '@media(prefers-reduced-motion:reduce){.bw-history-lead *{scroll-behavior:auto!important;transition:none!important}}'
      ].join('');
    }
  }

  if (!customElements.get(TAG)) customElements.define(TAG, BWHistoryLeadMagnet);
})();
