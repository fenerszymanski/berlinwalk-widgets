/* BerlinTools Single Page Shell V2
 *
 * Parent-page runtime for /tools/<slug>. The Wix dynamic template remains the
 * source of truth for content and iframe URLs; this layer only adds shared
 * presentation, removes duplicate conversion surfaces, and progressively
 * enhances the existing rich content when its DOM is stable enough to do so.
 */
(function () {
  'use strict';

  var VERSION = 'berlintools-shell-v2-20260710a';
  var ENABLE_ALL = false;
  var PILOT_SLUGS = [
    'berlin-first-day-planner',
    'transport-ticket-calculator',
    'berlin-luggage-storage'
  ];
  var CATALOG_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/tools-hub/data.json';
  var ROUTE_RE = /^\/tools\/([^/]+)\/?$/i;
  var state = {
    slug: '',
    record: null,
    decorated: false,
    richContentDone: false,
    attempt: 0,
    booted: false
  };

  var COPY_MAP = {
    'berlin-first-day-planner': {
      title: 'Plan your first 24 hours in Berlin',
      lead: 'Turn arrival time, luggage, energy and weather into a first-day route you can actually follow.',
      trust: 'Free to use · No sign-up · Live weather · Built for Berlin',
      note: 'Start with the practical decision in front of you, then let the city open up around it.',
      summaryKicker: 'First-day planner',
      summaryTitle: 'A calmer arrival',
      steps: [
        'Choose when and where you start',
        'Match the day to your energy and bags',
        'Get weather, transport and a route'
      ]
    },
    'transport-ticket-calculator': {
      title: 'Choose the right Berlin transport ticket',
      lead: 'Compare AB and ABC options, short trips, day tickets and tourist passes before you board.',
      trust: 'Free to use · No sign-up · AB / ABC ticket logic',
      note: 'Start with zones and duration, then choose the ticket that fits your day.',
      summaryKicker: 'Transport calculator',
      summaryTitle: 'No ticket guesswork',
      steps: [
        'Set your route and travel zone',
        'Compare the ticket types that fit',
        'Leave with one clear recommendation'
      ]
    },
    'berlin-luggage-storage': {
      title: 'Find a practical place for your luggage in Berlin',
      lead: 'Compare central lockers, staffed storage and airport options so your route stays light.',
      trust: 'Free to use · No sign-up · Central Berlin map',
      note: 'Choose the station or pickup point that keeps the rest of your route simple.',
      summaryKicker: 'Luggage map',
      summaryTitle: 'Keep Berlin walkable',
      steps: [
        'Pick the area you are heading to',
        'Compare lockers and staffed options',
        'Drop the bags and keep moving'
      ]
    }
  };

  function normalizedPath() {
    return String(window.location.pathname || '').toLowerCase().replace(/\/{2,}/g, '/');
  }

  function routeSlug() {
    var match = normalizedPath().match(ROUTE_RE);
    return match ? decodeURIComponent(match[1]).toLowerCase() : '';
  }

  state.slug = routeSlug();
  if (!state.slug) return;

  var preview = false;
  try {
    preview = new URLSearchParams(window.location.search).get('bw-shell-preview') === '1';
  } catch (e) {}
  if (!ENABLE_ALL && PILOT_SLUGS.indexOf(state.slug) === -1 && !preview) return;

  var html = document.documentElement;
  html.classList.add('bw-tools-shell-v2');
  html.setAttribute('data-bw-tools-shell-v2', VERSION);
  html.setAttribute('data-bw-tools-shell-v2-mode', ENABLE_ALL ? 'all' : 'pilot');
  html.setAttribute('data-bw-tools-slug', state.slug);

  window.BWToolsShellV2 = {
    version: VERSION,
    slug: state.slug,
    pilots: PILOT_SLUGS.slice(),
    enabled: true
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function cleanText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function appendAfter(node, added) {
    if (!node || !node.parentNode || !added) return false;
    node.parentNode.insertBefore(added, node.nextSibling);
    return true;
  }

  function makeNode(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function clearSectionSizing(node) {
    if (!node || !node.style) return;
    ['height', 'min-height', 'margin-top', 'padding-top'].forEach(function (property) {
      node.style.removeProperty(property);
    });
  }

  function catalogImage(record) {
    var image = record && record.image;
    if (!image) return '';
    if (/^https?:\/\//i.test(image)) return image;
    return 'https://fenerszymanski.github.io/berlinwalk-widgets/' + String(image).replace(/^\//, '');
  }

  function typeLabel(record) {
    return cleanText(record && (record.type || record.hubCategory || record.category)) || 'Berlin tool';
  }

  function copyForRecord(record) {
    return COPY_MAP[state.slug] || {
      title: cleanText(record && record.title) || 'A clearer way to plan Berlin',
      lead: cleanText(record && record.lead) || 'Use a practical Berlin tool built for the decision in front of you.',
      trust: 'Free to use · No sign-up · Built for Berlin',
      note: 'Make one good decision first, then keep the rest of the day simple.',
      summaryKicker: typeLabel(record),
      summaryTitle: 'A clearer next step',
      steps: ['Choose what matters today', 'Use Berlin rules, not guesswork', 'Leave with a plan you can follow']
    };
  }

  function catalogRecord(data) {
    var tools = data && Array.isArray(data.tools) ? data.tools : [];
    for (var i = 0; i < tools.length; i += 1) {
      if (String(tools[i].slug || '').toLowerCase() === state.slug) return tools[i];
    }
    return null;
  }

  function fetchCatalog() {
    if (typeof fetch !== 'function') return Promise.resolve(null);
    return fetch(CATALOG_URL, { credentials: 'omit', cache: 'no-cache' })
      .then(function (response) {
        if (!response || !response.ok) throw new Error('tools catalog unavailable');
        return response.json();
      })
      .then(function (data) {
        state.record = catalogRecord(data);
        return state.record;
      })
      .catch(function () {
        state.record = null;
        return null;
      });
  }

  function injectHeroMeta(hero, heading, lead) {
    if (!hero || !heading) return;
    var meta = hero.querySelector('[data-bw-shell-v2-hero-meta]');
    if (!meta) {
      meta = makeNode('div', 'bw-tools-shell-v2-hero-meta');
      meta.setAttribute('data-bw-shell-v2-hero-meta', '1');
      heading.parentNode.insertBefore(meta, heading);
    }

    var breadcrumb = meta.querySelector('[data-bw-shell-v2-breadcrumb]');
    if (!breadcrumb) {
      breadcrumb = makeNode('a', 'bw-tools-shell-v2-breadcrumb', 'Berlin tools');
      breadcrumb.href = '/berlin-tools';
      breadcrumb.setAttribute('data-bw-shell-v2-breadcrumb', '1');
      meta.appendChild(breadcrumb);
    }

    var chip = meta.querySelector('[data-bw-shell-v2-type]');
    if (!chip) {
      chip = makeNode('span', 'bw-tools-shell-v2-type');
      chip.setAttribute('data-bw-shell-v2-type', '1');
      meta.appendChild(chip);
    }
    chip.textContent = typeLabel(state.record);

    var image = catalogImage(state.record);
    var oldImage = meta.querySelector('[data-bw-shell-v2-icon]');
    if (image) {
      if (!oldImage) {
        oldImage = document.createElement('img');
        oldImage.className = 'bw-tools-shell-v2-icon';
        oldImage.alt = '';
        oldImage.setAttribute('aria-hidden', 'true');
        oldImage.setAttribute('data-bw-shell-v2-icon', '1');
        meta.insertBefore(oldImage, breadcrumb);
      }
      oldImage.src = image;
    } else if (oldImage) {
      oldImage.remove();
    }

    var trust = hero.querySelector('[data-bw-shell-v2-trust]');
    if (!trust && lead) {
      trust = makeNode('p', 'bw-tools-shell-v2-trust', 'Free to use · No sign-up · Works in your browser');
      trust.setAttribute('data-bw-shell-v2-trust', '1');
      appendAfter(lead, trust);
    }
    if (trust) trust.textContent = copyForRecord(state.record).trust;
  }

  function setRichText(container, selector, value) {
    if (!container || !value) return;
    var target = container.querySelector(selector);
    if (target) target.textContent = value;
    else container.textContent = value;
  }

  function injectHeroCopy(heading, lead) {
    var copy = copyForRecord(state.record);
    setRichText(heading, 'h1,h2,h3,[data-hook="text"]', copy.title);
    setRichText(lead, 'p,[data-hook="text"]', copy.lead);
    [heading, lead].forEach(function (node) {
      if (!node || !node.style) return;
      node.style.setProperty('display', 'block', 'important');
      node.style.setProperty('align-items', 'flex-start', 'important');
      node.style.setProperty('justify-content', 'flex-start', 'important');
      node.style.setProperty('text-align', 'left', 'important');
      node.querySelectorAll('h1,h2,h3,p,span').forEach(function (child) {
        child.style.setProperty('text-align', 'left', 'important');
      });
    });
  }

  function injectEditorialNote(hero, lead) {
    if (!hero || !lead) return;
    var note = hero.querySelector('[data-bw-shell-v2-editorial-note]');
    if (!note) {
      note = makeNode('p', 'bw-tools-shell-v2-editorial-note');
      note.setAttribute('data-bw-shell-v2-editorial-note', '1');
      var mark = makeNode('span', 'bw-tools-shell-v2-editorial-mark', '✓');
      var copy = makeNode('span', 'bw-tools-shell-v2-editorial-copy');
      note.appendChild(mark);
      note.appendChild(copy);
      appendAfter(lead, note);
    }
    var copyNode = note.querySelector('.bw-tools-shell-v2-editorial-copy');
    if (copyNode) copyNode.textContent = copyForRecord(state.record).note;
  }

  function injectSummaryCard(hero, heading) {
    if (!hero || !heading || !heading.parentNode) return;
    var card = hero.querySelector('[data-bw-shell-v2-summary]');
    if (!card) {
      card = makeNode('aside', 'bw-tools-shell-v2-summary');
      card.setAttribute('data-bw-shell-v2-summary', '1');
      heading.parentNode.appendChild(card);
    }
    var copy = copyForRecord(state.record);
    var image = catalogImage(state.record);
    card.innerHTML = [
      '<div class="bw-tools-shell-v2-summary-head">',
      image ? '<img class="bw-tools-shell-v2-summary-icon" src="' + escapeHtml(image) + '" alt="" aria-hidden="true">' : '',
      '<div><span class="bw-tools-shell-v2-summary-kicker">' + escapeHtml(copy.summaryKicker) + '</span><strong>' + escapeHtml(copy.summaryTitle) + '</strong></div>',
      '</div>',
      '<ol class="bw-tools-shell-v2-summary-steps">',
      copy.steps.map(function (step, index) {
        return '<li><span class="bw-tools-shell-v2-summary-number">' + (index + 1) + '</span><span>' + escapeHtml(step) + '</span></li>';
      }).join(''),
      '</ol>'
    ].join('');
  }

  function setHeroOrder(hero, heading, lead, widget, secondary) {
    if (!hero) return;
    var order = [
      ['[data-bw-shell-v2-hero-meta]', 1],
      [heading, 2],
      [lead, 3],
      ['[data-bw-shell-v2-trust]', 4],
      ['[data-bw-shell-v2-editorial-note]', 5],
      ['[data-bw-shell-v2-summary]', 6],
      [secondary, 7],
      [widget, 8]
    ];
    order.forEach(function (entry) {
      var node = typeof entry[0] === 'string' ? hero.querySelector(entry[0]) : entry[0];
      if (node && node.style) node.style.setProperty('order', String(entry[1]), 'important');
    });
  }

  function injectLocalNote(introSection, intro, secondary) {
    if (!introSection || !secondary) return;
    var secondaryText = cleanText(secondary.textContent);
    if (!secondaryText) return;
    if (cleanText(intro && intro.textContent) === secondaryText) return;

    secondary.setAttribute('data-bw-shell-v2-secondary', '1');
    secondary.classList.add('bw-tools-shell-v2-secondary-source');

    var note = introSection.querySelector('[data-bw-shell-v2-local-note]');
    if (!note) {
      note = makeNode('section', 'bw-tools-shell-v2-local-note');
      note.setAttribute('data-bw-shell-v2-local-note', '1');
      var label = makeNode('span', 'bw-tools-shell-v2-local-note-label', 'Local guide note');
      var copy = makeNode('p', '', secondaryText);
      note.appendChild(label);
      note.appendChild(copy);
      introSection.insertBefore(note, introSection.firstChild || null);
    } else {
      var copyNode = note.querySelector('p');
      if (copyNode) copyNode.textContent = secondaryText;
    }
  }

  function decorateOuterShell() {
    var hero = byId('comp-mozc935g3');
    var heading = byId('comp-mozch2i3');
    var lead = byId('comp-mozck6is');
    var secondary = byId('comp-mozcllqt');
    var widget = byId('comp-mozco5et');
    var introSection = byId('comp-mozmt2at');
    var intro = byId('comp-mozmtefi');
    var bodySection = byId('comp-mozn18up');
    var body = byId('comp-mozn27df');
    var secondarySection = byId('comp-moznh5yl');
    var nativeCta = byId('comp-mozmgdoo');
    var related = byId('comp-mozp1zlv');

    if (!hero || !heading || !widget) return false;
    [hero, heading, lead, secondary, introSection, bodySection, secondarySection, related, nativeCta].forEach(clearSectionSizing);
    [hero, introSection, bodySection, related].forEach(function (section) {
      if (!section) return;
      clearSectionSizing(section.querySelector('[data-testid="responsive-container-content"]'));
    });
    hero.classList.add('bw-tools-shell-v2-hero');
    hero.setAttribute('data-bw-shell-v2-role', 'hero');
    heading.classList.add('bw-tools-shell-v2-heading');
    heading.setAttribute('data-bw-shell-v2-role', 'heading');
    if (lead) {
      lead.classList.add('bw-tools-shell-v2-lead');
      lead.setAttribute('data-bw-shell-v2-role', 'lead');
    }
    widget.classList.add('bw-tools-shell-v2-widget');
    widget.setAttribute('data-bw-shell-v2-role', 'primary-widget');
    if (introSection) introSection.classList.add('bw-tools-shell-v2-intro');
    if (bodySection) bodySection.classList.add('bw-tools-shell-v2-body');
    if (secondarySection) secondarySection.classList.add('bw-tools-shell-v2-secondary-widget');
    if (nativeCta) nativeCta.classList.add('bw-tools-shell-v2-native-cta');
    if (related) related.classList.add('bw-tools-shell-v2-related');
    if (secondary) secondary.classList.add('bw-tools-shell-v2-secondary-copy');

    injectHeroCopy(heading, lead);
    injectHeroMeta(hero, heading, lead);
    injectEditorialNote(hero, lead);
    injectSummaryCard(hero, heading);
    setHeroOrder(hero, heading, lead, widget, secondary);
    injectLocalNote(introSection, intro, secondary);
    return Boolean(body);
  }

  function richRoot(container) {
    if (!container) return null;
    var selectors = [
      '[data-hook="rich-content"]',
      '.wix-rich-content',
      '.ricos-wrapper',
      '.public-DraftEditor-content'
    ];
    for (var i = 0; i < selectors.length; i += 1) {
      var match = container.querySelector(selectors[i]);
      if (match) return match;
    }
    return container;
  }

  function groupRichContent() {
    if (state.richContentDone) return;
    var body = byId('comp-mozn27df');
    var root = richRoot(body);
    if (!root) return;
    var headings = Array.prototype.slice.call(root.querySelectorAll('h2,h3'));
    if (headings.length < 2) return;
    var parent = headings[0].parentElement;
    if (!parent || headings.some(function (heading) { return heading.parentElement !== parent; })) return;

    var directChildren = Array.prototype.slice.call(parent.children);
    if (!headings.every(function (heading) { return directChildren.indexOf(heading) !== -1; })) return;

    headings.forEach(function (heading, index) {
      var details = document.createElement('details');
      details.className = 'bw-tools-shell-v2-accordion';
      details.setAttribute('data-bw-shell-v2-accordion', '1');
      if (heading.id) details.id = heading.id;
      var summary = document.createElement('summary');
      summary.innerHTML = heading.innerHTML;
      details.appendChild(summary);
      parent.insertBefore(details, heading);
      heading.remove();

      var nextHeading = headings[index + 1];
      var cursor = details.nextSibling;
      while (cursor && cursor !== nextHeading) {
        var next = cursor.nextSibling;
        details.appendChild(cursor);
        cursor = next;
      }
    });
    state.richContentDone = true;
  }

  function hideDuplicateCtas() {
    var ids = ['bw-desktop-cta', 'bw-sticky-cta', 'bw-exit-intent-popup', 'comp-mozmgdoo'];
    ids.forEach(function (id) {
      var node = byId(id);
      if (node) node.setAttribute('data-bw-tools-shell-v2-hidden', '1');
    });
  }

  function decorate() {
    state.decorated = decorateOuterShell() || state.decorated;
    groupRichContent();
    hideDuplicateCtas();
    state.attempt += 1;
    if (state.attempt < 40 && (!state.decorated || !state.richContentDone)) {
      window.setTimeout(decorate, 250);
    }
  }

  function applyCatalog(record) {
    state.record = record || state.record;
    decorateOuterShell();
  }

  function start() {
    if (state.booted) return;
    state.booted = true;
    decorate();
    fetchCatalog().then(function (record) {
      applyCatalog(record);
      decorate();
    });
    window.setTimeout(decorate, 500);
    window.setTimeout(decorate, 1500);
    window.setTimeout(decorate, 3000);
    if (typeof MutationObserver === 'function' && document.body) {
      var observer = new MutationObserver(function () {
        if (!state.decorated || !document.querySelector('[data-bw-shell-v2-summary]')) decorate();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
  window.setTimeout(start, 0);
})();
