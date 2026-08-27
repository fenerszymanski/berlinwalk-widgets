/* BerlinTools Single Page Shell
 *
 * Shared parent-page presentation for every /tools/<slug> detail route. The
 * Wix dynamic template and the widget remain the source of truth for content,
 * data, and results. This layer only adds the shared editorial layout,
 * normalises the iframe surface contract, and hides redundant outer CTAs.
 */
(function () {
  'use strict';

  var VERSION = 'berlintools-shell-v3-20260826-global-polish';
  var ENABLE_ALL = true;
  var PILOT_SLUGS = [
    'berlin-first-day-planner',
    'transport-ticket-calculator',
    'berlin-luggage-storage'
  ];
  var HOST_REPAIR_MODE = 'pilot';
  // Keep the proven pilot selector/lifecycle. These near-native-fit routes do
  // not need the repair; all other mounted tool-detail routes use the repaired
  // host without imposing a fixed height or aspect ratio.
  var HOST_REPAIR_EXCLUSIONS = [
    'berlin-family-day-planner',
    'berlin-lost-item-router',
    'berlin-museum-three-slot-builder',
    'berlin-umweltzone-sticker-checker',
    'holocaust-memorial-visit-planner',
    'karl-marx-allee-spotter'
  ];
  var CATALOG_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/tools-hub/data.json';
  var ROUTE_RE = /^\/tools\/([^/]+)\/?$/i;
  var state = {
    slug: '',
    record: null,
    decorated: false,
    richContentDone: false,
    surfaceDone: false,
    attempt: 0,
    booted: false,
    bandMeasureQueued: false,
    bandSettleToken: 0,
    bandResizeObserver: null,
    mutationObserver: null,
    mutationObserverOptions: null,
    decorateQueued: false,
    decorating: false,
    bodyWaitQueued: false,
    bodyWaitAttempts: 0
  };

  /* Keep the live shell's four route-specific visible-copy overrides. These
   * are deliberately limited to title and lead; the new shell does not bring
   * back the old generic trust/note/steps copy. */
  var HERO_COPY_MAP = {
    'berlin-first-day-planner': {
      title: 'Plan your first 24 hours in Berlin',
      lead: 'Turn arrival time, luggage, energy and weather into a first-day route you can actually follow.'
    },
    'transport-ticket-calculator': {
      title: 'Choose the right Berlin transport ticket',
      lead: 'Compare AB and ABC options, short trips, day tickets and tourist passes before you board.'
    },
    'berlin-luggage-storage': {
      title: 'Find a practical place for your luggage in Berlin',
      lead: 'Compare central lockers, staffed storage and airport options so your route stays light.'
    },
    'berlin-tour-time-window': {
      title: 'Berlin Tour Time Window: Morning or Afternoon?',
      lead: 'Set the earliest time you can reach the World Clock and the latest time you must be free near Hackescher Markt. See whether the current 11:30 or 15:30 planning window fits without rushing the rest of your Berlin day.'
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

  var hostRepairEnabled = HOST_REPAIR_MODE === 'all' ||
    (HOST_REPAIR_MODE === 'pilot' && HOST_REPAIR_EXCLUSIONS.indexOf(state.slug) === -1);
  var html = document.documentElement;
  html.classList.add('bw-tools-shell-v2');
  html.setAttribute('data-bw-tools-shell-v2', VERSION);
  html.setAttribute('data-bw-tools-shell-v2-mode', ENABLE_ALL ? 'all' : 'pilot');
  html.setAttribute('data-bw-tools-slug', state.slug);
  html.setAttribute('data-bw-host-repair', hostRepairEnabled ? HOST_REPAIR_MODE : 'off');
  html.setAttribute('data-bw-host-repair-slug', state.slug);
  if (hostRepairEnabled) html.classList.add('bw-host-repair-' + HOST_REPAIR_MODE);

  window.BWToolsShellV2 = {
    version: VERSION,
    slug: state.slug,
    pilots: PILOT_SLUGS.slice(),
    enabled: true,
    surface: 'tool-page',
    hostRepairMode: hostRepairEnabled ? HOST_REPAIR_MODE : 'off',
    hostRepairExclusions: HOST_REPAIR_EXCLUSIONS.slice(),
    hostRepairEnabled: hostRepairEnabled
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

  function upsertMeta(attribute, key, content) {
    var selector = 'meta[' + attribute + '="' + key + '"]';
    var node = document.head.querySelector(selector);
    if (!node) {
      node = document.createElement('meta');
      node.setAttribute(attribute, key);
      document.head.appendChild(node);
    }
    node.setAttribute('content', content);
  }

  function upsertLink(rel, href) {
    var node = document.head.querySelector('link[rel="' + rel + '"]');
    if (!node) {
      node = document.createElement('link');
      node.setAttribute('rel', rel);
      document.head.appendChild(node);
    }
    node.setAttribute('href', href);
  }

  var SEO_MAP = {
    'baltic-beach-day-planner': {
      title: 'Baltic Beach Day Planner from Berlin | BerlinWalk',
      description: 'Free planner for a Baltic Sea day trip from Berlin. Compare Warnemünde, the Usedom piers and Binz on Rügen by real train times, Deutschlandticket coverage and actual beach hours.',
      image: 'https://static.wixstatic.com/media/5a08a3_51af2914e7c94b3496c32983c1fabb9d~mv2.png',
      imageAlt: 'BerlinWalk Baltic Beach Day Planner icon'
    },
    'berlin-bakery-counter': {
      title: 'Berlin Bakery Counter: Order in German | BerlinWalk',
      description: 'Free trainer for ordering at a Berlin bakery in German. Build a real order, learn the words for Schrippe, Pfannkuchen and Brezel, and rehearse the questions the counter asks back.',
      image: 'https://static.wixstatic.com/media/5a08a3_d8a7250b42544578aefc35723649019b~mv2.png',
      imageAlt: 'BerlinWalk Berlin Bakery Counter icon'
    },
    'berlin-tour-time-window': {
      title: 'Berlin Tour Time Window: Morning or Afternoon? | BerlinWalk',
      description: 'Set your real arrival at the World Clock and finish at Hackescher Markt. See whether the morning or afternoon Berlin walking-tour window fits.',
      image: 'https://static.wixstatic.com/media/5a08a3_c4b967dd5fac4ae4ba7432ffd5bfaeba~mv2.png',
      imageAlt: 'BerlinWalk Berlin Tour Time Window icon'
    }
  };

  function applyScopedSeo() {
    var record = SEO_MAP[state.slug];
    if (!record) return;
    var canonical = 'https://www.berlinwalk.com/tools/' + state.slug;
    document.title = record.title;
    upsertLink('canonical', canonical);
    upsertMeta('name', 'description', record.description);
    upsertMeta('name', 'robots', 'index, follow, max-image-preview:large');
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:title', record.title);
    upsertMeta('property', 'og:description', record.description);
    upsertMeta('property', 'og:image', record.image);
    upsertMeta('property', 'og:image:width', '512');
    upsertMeta('property', 'og:image:height', '512');
    upsertMeta('property', 'og:image:alt', record.imageAlt);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', record.title);
    upsertMeta('name', 'twitter:description', record.description);
    upsertMeta('name', 'twitter:image', record.image);
    upsertMeta('name', 'twitter:image:alt', record.imageAlt);
  }

  function catalogUrl() {
    var config = window.BWToolsShellConfig || {};
    return config.catalogUrl || CATALOG_URL;
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

  function categoryLabel(record) {
    var value = cleanText(record && (record.category || record.hubCategory));
    if (!value) return '';
    return value.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ');
  }

  function heroCopy(record) {
    var override = HERO_COPY_MAP[state.slug];
    if (override) return override;
    return {
      title: cleanText(record && record.title),
      lead: cleanText(record && record.lead)
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
    return fetch(catalogUrl(), { credentials: 'omit', cache: 'no-cache' })
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

  function setHeroText(container, selector, value) {
    if (!container || !value) return;
    var target = container.querySelector(selector);
    if (target) target.textContent = value;
    else container.textContent = value;
  }

  function alignHeroText(node) {
    if (!node || !node.style) return;
    node.style.setProperty('display', 'block', 'important');
    node.style.setProperty('align-items', 'flex-start', 'important');
    node.style.setProperty('justify-content', 'flex-start', 'important');
    node.style.setProperty('text-align', 'left', 'important');
    node.querySelectorAll('h1,h2,h3,p,span').forEach(function (child) {
      child.style.setProperty('text-align', 'left', 'important');
    });
  }

  function titleAccentMatch(title, record) {
    var source = String(title || '');
    var requested = cleanText(record && record.titleAccent);
    var tokenPattern = /\S+/g;
    var match;
    var fallback = null;
    while ((match = tokenPattern.exec(source))) {
      var raw = match[0];
      var coreMatch = raw.match(/^([^\p{L}\p{N}]*)([\p{L}\p{N}](?:[\p{L}\p{N}'’.-]*[\p{L}\p{N}])?)([^\p{L}\p{N}]*)$/u);
      if (!coreMatch) continue;
      var start = match.index + coreMatch[1].length;
      var value = coreMatch[2];
      var candidate = { start: start, end: start + value.length, value: value };
      fallback = candidate;
      if (requested && value.toLowerCase() === requested.toLowerCase()) return candidate;
    }
    return fallback;
  }

  function setHeroTitle(container, title, record) {
    if (!container || !title) return;
    var target = container.querySelector('h1,h2,h3,[data-hook="text"]') || container;
    target.textContent = '';
    var accent = titleAccentMatch(title, record);
    if (!accent) {
      target.textContent = title;
      return;
    }
    if (accent.start > 0) target.appendChild(document.createTextNode(title.slice(0, accent.start)));
    var accentNode = makeNode('span', 'bw-tools-shell-v2-title-accent', accent.value);
    accentNode.setAttribute('data-bw-shell-v2-title-accent', '1');
    target.appendChild(accentNode);
    if (accent.end < title.length) target.appendChild(document.createTextNode(title.slice(accent.end)));
  }

  /* Preserve the established visible-copy contract: the four explicit routes
   * use their exact overrides and every other route uses catalog title/lead. */
  function ensureHeroCopy(heading, lead) {
    var copy = heroCopy(state.record);
    setHeroTitle(heading, copy.title, state.record);
    setHeroText(lead, 'p,[data-hook="text"]', copy.lead);
    alignHeroText(heading);
    alignHeroText(lead);
  }

  function injectHeroMeta(hero, heading) {
    if (!hero || !heading || !heading.parentNode) return;
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
  }

  /* The side rail uses only catalog-backed facts and the canonical real icon.
   * It deliberately does not repeat the page title, lead, or a sales claim. */
  function injectSummaryCard(hero, heading) {
    if (!hero || !heading || !heading.parentNode || !state.record) return;
    var card = hero.querySelector('[data-bw-shell-v2-summary]');
    if (!card) {
      card = makeNode('aside', 'bw-tools-shell-v2-summary');
      card.setAttribute('data-bw-shell-v2-summary', '1');
      heading.parentNode.appendChild(card);
    }
    var image = catalogImage(state.record);
    var category = categoryLabel(state.record);
    card.innerHTML = [
      '<div class="bw-tools-shell-v2-summary-head">',
      image ? '<img class="bw-tools-shell-v2-summary-icon" src="' + escapeHtml(image) + '" alt="" aria-hidden="true">' : '',
      '<div><span class="bw-tools-shell-v2-summary-kicker">Berlin tool</span><strong>' + escapeHtml(typeLabel(state.record)) + '</strong></div>',
      '</div>',
      '<dl class="bw-tools-shell-v2-summary-facts">',
      category ? '<div><dt>Category</dt><dd>' + escapeHtml(category) + '</dd></div>' : '',
      '<div><dt>Format</dt><dd>Interactive tool</dd></div>',
      '</dl>'
    ].join('');
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

  function setShellSectionVisibility(section, visible) {
    if (!section) return;
    if (visible) {
      section.removeAttribute('data-bw-shell-v2-empty');
      if (section.getAttribute('data-bw-shell-v2-managed-display') === '1') {
        section.style.removeProperty('display');
        section.removeAttribute('data-bw-shell-v2-managed-display');
      }
      return;
    }
    section.setAttribute('data-bw-shell-v2-empty', '1');
    section.style.setProperty('display', 'none', 'important');
    section.setAttribute('data-bw-shell-v2-managed-display', '1');
  }

  function headingAnchorId(heading, index) {
    var id = heading && heading.id;
    if (id && byId(id) === heading) return id;
    var base = 'bw-tools-shell-v2-section-' + (index + 1);
    id = base;
    var suffix = 2;
    while (byId(id) && byId(id) !== heading) {
      id = base + '-' + suffix;
      suffix += 1;
    }
    heading.id = id;
    return id;
  }

  function buildOnThisPage(bodySection, body, root) {
    if (!bodySection || !body || !root) return false;
    var bodyContainer = body.parentNode;
    if (!bodyContainer) return false;
    var introSection = byId('comp-mozmt2at');
    var introContainer = introSection && (introSection.querySelector('[data-testid="responsive-container-content"]') ||
      introSection.querySelector('.comp-mozmt2at-container'));
    var introContent = introContainer && (introContainer.querySelector('#comp-mozmtefi') || introContainer.firstElementChild);
    var container = introContainer || bodyContainer;
    var anchor = introContainer ? introContent : body;
    var headings = Array.prototype.slice.call(root.querySelectorAll('h2,h3')).filter(function (heading) {
      return Boolean(cleanText(heading.textContent));
    });
    if (!headings.length) {
      document.querySelectorAll('[data-bw-shell-v2-toc]').forEach(function (emptyToc) { emptyToc.remove(); });
      if (introSection) introSection.removeAttribute('data-bw-shell-v2-toc-host');
      bodySection.removeAttribute('data-bw-shell-v2-toc-in-body');
      bodySection.removeAttribute('data-bw-shell-v2-body-follow-rail');
      bodySection.setAttribute('data-bw-shell-v2-no-toc', '1');
      return false;
    }

    var items = headings.map(function (heading, index) {
      heading.classList.add('bw-tools-shell-v2-section-heading');
      heading.setAttribute('data-bw-shell-v2-section', (index + 1 < 10 ? '0' : '') + (index + 1));
      return {
        heading: heading,
        id: headingAnchorId(heading, index),
        label: cleanText(heading.textContent),
        number: (index + 1 < 10 ? '0' : '') + (index + 1)
      };
    });
    var signature = items.map(function (item) { return item.id + ':' + item.label; }).join('|');
    var toc = document.querySelector('[data-bw-shell-v2-toc]');
    if (!toc) {
      toc = makeNode('nav', 'bw-tools-shell-v2-toc');
      toc.setAttribute('data-bw-shell-v2-toc', '1');
      toc.setAttribute('aria-label', 'On this page');
    }
    if (toc.parentNode !== container) container.insertBefore(toc, anchor || null);
    if (toc.getAttribute('data-bw-shell-v2-toc-signature') !== signature) {
      toc.innerHTML = '';
      toc.appendChild(makeNode('p', 'bw-tools-shell-v2-toc-label', 'ON THIS PAGE'));
      var list = makeNode('ol', 'bw-tools-shell-v2-toc-list');
      items.forEach(function (item) {
        var listItem = makeNode('li');
        var link = makeNode('a');
        link.href = '#' + item.id;
        link.appendChild(makeNode('span', 'bw-tools-shell-v2-toc-number', item.number));
        link.appendChild(makeNode('span', 'bw-tools-shell-v2-toc-text', item.label));
        listItem.appendChild(link);
        list.appendChild(listItem);
      });
      toc.appendChild(list);
      toc.setAttribute('data-bw-shell-v2-toc-signature', signature);
    }
    if (introContainer) {
      introSection.setAttribute('data-bw-shell-v2-toc-host', '1');
      bodySection.removeAttribute('data-bw-shell-v2-toc-in-body');
      bodySection.setAttribute('data-bw-shell-v2-body-follow-rail', '1');
    } else {
      bodySection.setAttribute('data-bw-shell-v2-toc-in-body', '1');
      bodySection.removeAttribute('data-bw-shell-v2-body-follow-rail');
      if (introSection) introSection.removeAttribute('data-bw-shell-v2-toc-host');
    }
    bodySection.removeAttribute('data-bw-shell-v2-no-toc');
    return true;
  }

  function decorateAdvice(root) {
    if (!root) return;
    Array.prototype.slice.call(root.querySelectorAll('p,blockquote,aside,[data-bw-advice],[data-marker]')).forEach(function (block) {
      var marker = block.hasAttribute('data-bw-advice') || block.hasAttribute('data-marker') ||
        /^(my move|my advice)\b/i.test(cleanText(block.textContent));
      if (!marker) return;
      block.classList.add('bw-tools-shell-v2-advice');
      block.setAttribute('data-bw-shell-v2-advice', '1');
    });
  }

  function toolSlugFromHref(href) {
    if (!href) return '';
    try {
      var url = new URL(href, window.location.href);
      var match = url.pathname.match(/^\/tools\/([^/]+)\/?$/i);
      return match ? decodeURIComponent(match[1]).toLowerCase() : '';
    } catch (e) {
      return '';
    }
  }

  function managedRelatedCard(card, visible) {
    if (!card) return;
    if (visible) {
      card.removeAttribute('data-bw-shell-v2-related-hidden');
      if (card.getAttribute('data-bw-shell-v2-managed-display') === '1') {
        card.style.removeProperty('display');
        card.removeAttribute('data-bw-shell-v2-managed-display');
      }
      return;
    }
    card.setAttribute('data-bw-shell-v2-related-hidden', '1');
    card.style.setProperty('display', 'none', 'important');
    card.setAttribute('data-bw-shell-v2-managed-display', '1');
  }

  function decorateRelatedTools(section) {
    if (!section) return false;
    var container = section.querySelector('[data-testid="responsive-container-content"]') ||
      section.querySelector('.comp-mozp1zlv-container') || section;
    container.setAttribute('data-bw-shell-v2-related-container', '1');
    var heading = container.querySelector('#comp-mozpfm6g');
    var cards = Array.prototype.slice.call(container.children).filter(function (node) {
      return node !== heading &&
        !node.hasAttribute('data-bw-shell-v2-related-all') &&
        node.querySelector && node.querySelector('a[href]');
    });
    var validCards = [];
    cards.forEach(function (card) {
      var link = card.querySelector('a[href]');
      var href = link && link.getAttribute('href');
      var slug = toolSlugFromHref(href);
      var titleNode = card.querySelector('h2,h3,h4,[data-hook="text"]');
      var title = cleanText(titleNode && titleNode.textContent) || cleanText(link && link.textContent);
      var valid = Boolean(slug && slug !== state.slug && title && !/^open tool/i.test(title));
      Array.prototype.slice.call(card.querySelectorAll(
        '[data-bw-shell-v2-related-title], [data-bw-shell-v2-related-kicker], ' +
        '[data-bw-shell-v2-related-action], [data-bw-shell-v2-related-action-wrap]'
      )).forEach(function (node) {
        node.removeAttribute('data-bw-shell-v2-related-title');
        node.removeAttribute('data-bw-shell-v2-related-kicker');
        node.removeAttribute('data-bw-shell-v2-related-action');
        node.removeAttribute('data-bw-shell-v2-related-action-wrap');
      });
      if (valid) {
        card.setAttribute('data-bw-shell-v2-related-card', '1');
        if (link.parentNode === card) {
          card.setAttribute('data-bw-shell-v2-related-direct-link', '1');
        } else {
          card.removeAttribute('data-bw-shell-v2-related-direct-link');
          link.setAttribute('data-bw-shell-v2-related-action', '1');
          var actionWrap = link.parentNode;
          while (actionWrap && actionWrap.parentNode && actionWrap.parentNode !== card) {
            actionWrap = actionWrap.parentNode;
          }
          if (actionWrap && actionWrap !== card) {
            actionWrap.setAttribute('data-bw-shell-v2-related-action-wrap', '1');
          }
        }
        if (titleNode && titleNode !== link) {
          titleNode.setAttribute('data-bw-shell-v2-related-title', '1');
          var titleHost = titleNode.closest('[data-testid="richTextElement"]');
          if (titleHost) {
            var labelNodes = Array.prototype.slice.call(titleHost.querySelectorAll('span,p'));
            labelNodes.some(function (node) {
              if (node === titleNode || node.contains(titleNode) || titleNode.contains(node)) return false;
              if (!cleanText(node.textContent)) return false;
              node.setAttribute('data-bw-shell-v2-related-kicker', '1');
              return true;
            });
          }
        }
        validCards.push(card);
      } else {
        card.removeAttribute('data-bw-shell-v2-related-card');
        card.removeAttribute('data-bw-shell-v2-related-direct-link');
      }
      managedRelatedCard(card, valid);
    });

    if (!validCards.length) {
      setShellSectionVisibility(section, false);
      return false;
    }

    if (!heading) {
      heading = makeNode('h2', 'bw-tools-shell-v2-related-heading', 'More Berlin tools to try next');
      heading.id = 'comp-mozpfm6g';
      container.insertBefore(heading, container.firstElementChild || null);
    } else {
      var headingText = heading.querySelector('h2,h3,h4,[data-hook="text"]');
      if (headingText) headingText.textContent = 'More Berlin tools to try next';
      else heading.textContent = 'More Berlin tools to try next';
    }
    var allToolsLink = container.querySelector('[data-bw-shell-v2-related-all]');
    if (!allToolsLink) {
      allToolsLink = makeNode('a', 'bw-tools-shell-v2-related-all', 'See all Berlin tools');
      allToolsLink.setAttribute('data-bw-shell-v2-related-all', '1');
      heading.insertAdjacentElement('afterend', allToolsLink);
    }
    allToolsLink.href = '/berlin-tools';
    section.setAttribute('data-bw-shell-v2-related-ready', '1');
    setShellSectionVisibility(section, true);
    return true;
  }

  function decorateNativeTourCta(section) {
    if (!section) return false;
    var link = section.querySelector('a[href]');
    var visible = Boolean(link && cleanText(section.textContent));
    if (!visible) {
      setShellSectionVisibility(section, false);
      return false;
    }
    section.classList.add('bw-tools-shell-v2-tour-band');
    section.setAttribute('data-bw-shell-v2-tour-band', '1');
    section.removeAttribute('data-bw-tools-shell-v2-hidden');
    setShellSectionVisibility(section, true);
    return true;
  }

  /* The approved editorial layout has two visual treatments for the same
   * native tour CTA: a compact context card in the desktop rail and the
   * full-width end-of-article band. Derive both presentations from the one
   * hydrated native section so Wix/CMS remains the source of truth. */
  function decorateTourRail(nativeCta) {
    var introSection = byId('comp-mozmt2at');
    var toc = introSection && introSection.querySelector('[data-bw-shell-v2-toc]');
    var existing = introSection && introSection.querySelector('[data-bw-shell-v2-tour-rail]');
    if (!nativeCta || !toc) {
      if (existing) existing.remove();
      return false;
    }

    var headingNode = nativeCta.querySelector('h1,h2,h3,h4,h5,h6,[data-hook="heading"]') ||
      nativeCta.querySelector('[data-hook="text"]');
    var paragraphNode = nativeCta.querySelector('p');
    var actionNode = nativeCta.querySelector('a[href]');
    var heading = cleanText(headingNode && headingNode.textContent);
    var description = cleanText(paragraphNode && paragraphNode.textContent);
    var actionHref = actionNode && actionNode.getAttribute('href');
    if (!heading || !description || !actionHref) {
      if (existing) existing.remove();
      return false;
    }

    var rail = existing || makeNode('aside', 'bw-tools-shell-v2-tour-rail');
    rail.setAttribute('data-bw-shell-v2-tour-rail', '1');
    rail.setAttribute('data-bw-shell-v2-tour-source', 'comp-mozmgdoo');
    rail.setAttribute('aria-label', 'Berlin walking tour information');
    rail.innerHTML = '';
    rail.appendChild(makeNode('p', 'bw-tools-shell-v2-tour-rail-eyebrow', 'WHILE YOU ARE IN BERLIN'));
    rail.appendChild(makeNode('strong', 'bw-tools-shell-v2-tour-rail-title', 'See the centre with me'));
    rail.appendChild(makeNode('p', 'bw-tools-shell-v2-tour-rail-copy', 'About 2 hours, tip-based, starting at the World Clock.'));
    var action = makeNode('a', 'bw-tools-shell-v2-tour-rail-link', 'RESERVE A SPOT');
    action.href = actionHref;
    action.setAttribute('data-bw-shell-v2-tour-rail-link', '1');
    if (actionNode.getAttribute('target')) action.target = actionNode.getAttribute('target');
    if (actionNode.getAttribute('rel')) action.rel = actionNode.getAttribute('rel');
    rail.appendChild(action);
    if (rail.parentNode !== toc) toc.appendChild(rail);
    return true;
  }

  function hasMeaningfulOptionalSource(value) {
    var source = cleanText(value);
    return Boolean(source && !/^about:blank(?:[?#].*)?$/i.test(source));
  }

  function hasMeaningfulOptionalMedia(node) {
    if (!node) return false;
    var tagName = String(node.tagName || '').toLowerCase();
    if (tagName === 'svg') return true;
    return hasMeaningfulOptionalSource(node.getAttribute('href')) ||
      hasMeaningfulOptionalSource(node.getAttribute('src')) ||
      hasMeaningfulOptionalSource(node.getAttribute('data-src')) ||
      hasMeaningfulOptionalSource(node.getAttribute('srcdoc'));
  }

  function sectionHasMeaningfulContent(section) {
    if (!section) return false;
    if (cleanText(section.textContent)) return true;
    var media = section.querySelectorAll('iframe,a[href],img,video,svg');
    for (var i = 0; i < media.length; i += 1) {
      if (hasMeaningfulOptionalMedia(media[i])) return true;
    }
    return false;
  }

  function optionalSectionVisibilitySettled(section) {
    if (!section) return true;
    var hasContent = sectionHasMeaningfulContent(section);
    var markedEmpty = hasShellAttribute(section, 'data-bw-shell-v2-empty', '1');
    return hasContent ? !markedEmpty : markedEmpty;
  }

  function collapseEmptyOptionalSection(section) {
    if (!section) return false;
    var hasContent = sectionHasMeaningfulContent(section);
    setShellSectionVisibility(section, hasContent);
    return hasContent;
  }

  function arrangeLowerSections(nativeCta, related) {
    if (!nativeCta || !related || nativeCta.parentNode !== related.parentNode) return;
    if (nativeCta.compareDocumentPosition(related) & Node.DOCUMENT_POSITION_FOLLOWING) return;
    related.parentNode.insertBefore(nativeCta, related);
  }

  function decorateLowerArchitecture() {
    var introSection = byId('comp-mozmt2at');
    var bodySection = byId('comp-mozn18up');
    var body = byId('comp-mozn27df');
    var secondarySection = byId('comp-moznh5yl');
    var readNextSection = byId('comp-moznzyer');
    var nativeCta = byId('comp-mozmgdoo');
    var related = byId('comp-mozp1zlv');

    if (introSection) {
      introSection.classList.add('bw-tools-shell-v2-intro');
      var introContent = introSection.querySelector('#comp-mozmtefi,[data-hook="rich-content"]');
      setShellSectionVisibility(introSection, Boolean(introContent && cleanText(introContent.textContent)));
    }
    if (bodySection && body) {
      bodySection.classList.add('bw-tools-shell-v2-body');
      if (state.richContentDone) setShellSectionVisibility(bodySection, Boolean(cleanText(body.textContent)));
    } else if (bodySection && !body) {
      setShellSectionVisibility(bodySection, false);
    }
    if (secondarySection) {
      secondarySection.classList.add('bw-tools-shell-v2-secondary-widget');
      collapseEmptyOptionalSection(secondarySection);
    }
    if (readNextSection) {
      /* The post bridge is not part of the tool-page reading path. Keep the
       * native section recoverable, but do not let it add a second article CTA. */
      readNextSection.setAttribute('data-bw-shell-v2-redundant', '1');
      setShellSectionVisibility(readNextSection, false);
    }
    var ctaVisible = decorateNativeTourCta(nativeCta);
    decorateTourRail(nativeCta && ctaVisible ? nativeCta : null);
    var relatedVisible = decorateRelatedTools(related);
    arrangeLowerSections(nativeCta && ctaVisible ? nativeCta : null, related && relatedVisible ? related : null);
    ['comp-mozmvz1o', 'comp-mozmhgtg'].forEach(function (id) {
      collapseEmptyOptionalSection(byId(id));
    });
    return true;
  }

  /* Editorial styling is applied to native rich-content nodes only. The
   * headings become a navigation rail, while their CMS text stays untouched. */
  function decorateRichContent() {
    var body = byId('comp-mozn27df');
    var bodySection = byId('comp-mozn18up');
    if (!body) return !bodySection;
    var root = richRoot(body);
    if (!root) return false;
    if (!cleanText(root.textContent) && !root.querySelector('h2,h3')) return false;
    root.classList.add('bw-tools-shell-v2-rich-content');
    root.setAttribute('data-bw-shell-v2-rich-content', '1');
    buildOnThisPage(bodySection, body, root);
    decorateAdvice(root);
    state.richContentDone = true;
    return true;
  }

  function appendToolPageSurface(src) {
    if (!src) return '';
    try {
      var url = new URL(src, window.location.href);
      if (url.searchParams.get('surface') === 'tool-page') return url.toString();
      url.searchParams.set('surface', 'tool-page');
      return url.toString();
    } catch (e) {
      return src + (src.indexOf('?') === -1 ? '?' : '&') + 'surface=tool-page';
    }
  }

  function normalizeWidgetSurface(widget) {
    if (!widget) return false;
    var iframe = widget.querySelector('iframe');
    if (!iframe) return false;
    var source = iframe.getAttribute('src') || '';
    if (!source) return false;
    var next = appendToolPageSurface(source);
    if (next && next !== source) iframe.setAttribute('src', next);
    iframe.setAttribute('data-bw-tool-page-surface', '1');
    return true;
  }

  /* Add one compact parent-level entry bar before the private iframe shell.
   * It names the tool type/category only; the hero remains the sole title and
   * the child iframe keeps its own resize and interaction contract. */
  function injectToolEntry(widget) {
    if (!widget) return false;
    var iframe = widget.querySelector('iframe');
    if (!iframe) return false;
    var entry = widget.querySelector('[data-bw-shell-v2-tool-entry]');
    if (!entry) {
      entry = makeNode('div', 'bw-tools-shell-v2-tool-entry');
      entry.setAttribute('data-bw-shell-v2-tool-entry', '1');
      entry.setAttribute('role', 'group');
      entry.setAttribute('aria-label', 'Tool entry');
      entry.appendChild(makeNode('span', 'bw-tools-shell-v2-tool-entry-kicker', 'START HERE'));
      entry.appendChild(makeNode('span', 'bw-tools-shell-v2-tool-entry-chip'));
      widget.insertBefore(entry, widget.firstElementChild || iframe);
    }
    var chip = entry.querySelector('.bw-tools-shell-v2-tool-entry-chip');
    if (chip) chip.textContent = categoryLabel(state.record) || typeLabel(state.record);
    return true;
  }

  /* Derive the dark band from the actual primary widget start, not its
   * content height. The card can therefore grow through the cream page while
   * long catalog copy still keeps the dark band behind all hero text. */
  function updateEditorialBand() {
    var hero = byId('comp-mozc935g3');
    var widget = byId('comp-mozco5et');
    if (!hero || !widget || typeof hero.getBoundingClientRect !== 'function' ||
        typeof widget.getBoundingClientRect !== 'function') return false;
    var heroRect = hero.getBoundingClientRect();
    var widgetRect = widget.getBoundingClientRect();
    if (!heroRect || !widgetRect || !heroRect.width || !widgetRect.width) return false;
    var widgetTop = widgetRect.top - heroRect.top;
    if (!isFinite(widgetTop)) return false;
    var overlap = (window.innerWidth || heroRect.width) <= 899 ? 80 : 96;
    var bandHeight = Math.ceil(Math.max(0, widgetTop) + overlap);
    if (!bandHeight) return false;
    var nextBandHeight = bandHeight + 'px';
    var currentBandHeight = hero.style && typeof hero.style.getPropertyValue === 'function'
      ? hero.style.getPropertyValue('--bw-shell-band-height') : '';
    if (currentBandHeight !== nextBandHeight) {
      hero.style.setProperty('--bw-shell-band-height', nextBandHeight, 'important');
    }
    if (hero.getAttribute('data-bw-shell-band-height') !== String(bandHeight)) {
      hero.setAttribute('data-bw-shell-band-height', String(bandHeight));
    }
    return true;
  }

  function scheduleEditorialBandMeasure() {
    if (state.bandMeasureQueued) return;
    state.bandMeasureQueued = true;
    var run = function () {
      state.bandMeasureQueued = false;
      updateEditorialBand();
    };
    if (typeof window.requestAnimationFrame === 'function') window.requestAnimationFrame(run);
    else window.setTimeout(run, 0);
  }

  function settleEditorialBand() {
    var token = ++state.bandSettleToken;
    scheduleEditorialBandMeasure();
    [100, 350, 800].forEach(function (delay) {
      window.setTimeout(function () {
        if (token === state.bandSettleToken) scheduleEditorialBandMeasure();
      }, delay);
    });
  }

  /* Observe only the copy/metadata rows that determine the widget's top. Do
   * not observe the widget or its wrappers: iframe height messages must never
   * feed back into band sizing. */
  function observeEditorialBandInputs(heading, lead, secondary, hero) {
    if (typeof ResizeObserver !== 'function') return;
    if (!state.bandResizeObserver) {
      try {
        state.bandResizeObserver = new ResizeObserver(function () {
          scheduleEditorialBandMeasure();
        });
      } catch (e) {
        state.bandResizeObserver = null;
        return;
      }
    }
    [heading, lead, secondary, hero && hero.querySelector('[data-bw-shell-v2-hero-meta]'),
      hero && hero.querySelector('[data-bw-shell-v2-summary]')].forEach(function (node) {
      if (!node) return;
      try { state.bandResizeObserver.observe(node); } catch (e) {}
    });
  }

  function hasShellClass(node, className) {
    return Boolean(node && node.classList && typeof node.classList.contains === 'function' &&
      node.classList.contains(className));
  }

  function hasShellAttribute(node, attribute, value) {
    return Boolean(node && typeof node.getAttribute === 'function' &&
      node.getAttribute(attribute) === value);
  }

  function shellQuery(node, selector) {
    return node && typeof node.querySelector === 'function' ? node.querySelector(selector) : null;
  }

  function shellQueryAll(node, selector) {
    return node && typeof node.querySelectorAll === 'function' ? node.querySelectorAll(selector) : [];
  }

  function titleMarkersPresent(heading) {
    if (!heading) return false;
    var target = shellQuery(heading, 'h1,h2,h3,[data-hook="text"]') || heading;
    var expectedTitle = heroCopy(state.record).title;
    if (!expectedTitle) return true;
    var accent = titleAccentMatch(expectedTitle, state.record);
    var accentNodes = shellQueryAll(target, '[data-bw-shell-v2-title-accent]');
    return cleanText(target.textContent) === cleanText(expectedTitle) &&
      accentNodes.length === 1 &&
      (!accent || cleanText(accentNodes[0].textContent) === cleanText(accent.value));
  }

  function richContentMarkersPresent() {
    var bodySection = byId('comp-mozn18up');
    if (!bodySection) return true;
    var body = byId('comp-mozn27df');
    if (!body && hasShellAttribute(bodySection, 'data-bw-shell-v2-empty', '1')) return true;
    if (!body) return false;
    var root = richRoot(body);
    if (!root) return false;
    var headings = Array.prototype.slice.call(shellQueryAll(root, 'h2,h3')).filter(function (heading) {
      return Boolean(cleanText(heading.textContent));
    });
    if (!cleanText(root.textContent) && !headings.length) {
      return hasShellAttribute(bodySection, 'data-bw-shell-v2-empty', '1');
    }
    if (!hasShellAttribute(root, 'data-bw-shell-v2-rich-content', '1')) return false;
    if (!headings.length) return hasShellAttribute(bodySection, 'data-bw-shell-v2-no-toc', '1');
    var toc = document.querySelector('[data-bw-shell-v2-toc]');
    if (!toc || !hasShellAttribute(toc, 'data-bw-shell-v2-toc', '1')) return false;
    var tocLinks = Array.prototype.slice.call(shellQueryAll(toc, '.bw-tools-shell-v2-toc-list a'));
    if (tocLinks.length !== headings.length) return false;
    for (var i = 0; i < headings.length; i += 1) {
      var tocText = shellQuery(tocLinks[i], '.bw-tools-shell-v2-toc-text');
      if (!tocText || cleanText(tocText.textContent) !== cleanText(headings[i].textContent)) return false;
    }
    var introSection = byId('comp-mozmt2at');
    return hasShellAttribute(bodySection, 'data-bw-shell-v2-toc-in-body', '1') ||
      hasShellAttribute(bodySection, 'data-bw-shell-v2-body-follow-rail', '1') ||
      hasShellAttribute(introSection, 'data-bw-shell-v2-toc-host', '1');
  }

  /* State booleans describe what a previous pass saw; Wix can replace those
   * nodes without touching this closure. Gate retries on the live marker set
   * so a remount restores the presentation instead of trusting stale flags. */
  function requiredShellMarkersPresent() {
    var hero = byId('comp-mozc935g3');
    var heading = byId('comp-mozch2i3');
    var widget = byId('comp-mozco5et');
    if (!hero || !heading || !widget) return false;
    if (!hasShellAttribute(hero, 'data-bw-shell-v2-role', 'hero') ||
        !hasShellClass(hero, 'bw-tools-shell-v2-hero') ||
        !hasShellAttribute(heading, 'data-bw-shell-v2-role', 'heading') ||
        !hasShellClass(heading, 'bw-tools-shell-v2-heading') ||
        !hasShellAttribute(widget, 'data-bw-shell-v2-role', 'primary-widget') ||
        !hasShellClass(widget, 'bw-tools-shell-v2-widget')) return false;

    var meta = shellQuery(hero, '[data-bw-shell-v2-hero-meta]');
    var breadcrumb = shellQuery(meta, '[data-bw-shell-v2-breadcrumb]');
    var type = shellQuery(meta, '[data-bw-shell-v2-type]');
    if (!meta || !breadcrumb || !type || cleanText(breadcrumb.textContent) !== 'Berlin tools' ||
        cleanText(type.textContent) !== typeLabel(state.record)) return false;

    var summary = shellQuery(hero, '[data-bw-shell-v2-summary]');
    if (state.record && (!summary || !cleanText(summary.textContent))) return false;
    if (!titleMarkersPresent(heading)) return false;

    var iframe = shellQuery(widget, 'iframe');
    var source = iframe && iframe.getAttribute('src');
    if (!iframe || !hasShellAttribute(iframe, 'data-bw-tool-page-surface', '1') ||
        !/(?:\?|&)surface=tool-page(?:[&#]|$)/.test(source || '')) return false;

    var entry = shellQuery(widget, '[data-bw-shell-v2-tool-entry]');
    var entryKicker = shellQuery(entry, '.bw-tools-shell-v2-tool-entry-kicker');
    var entryChip = shellQuery(entry, '.bw-tools-shell-v2-tool-entry-chip');
    if (!entry || !entryKicker || !entryChip || cleanText(entryKicker.textContent) !== 'START HERE' ||
        cleanText(entryChip.textContent) !== (categoryLabel(state.record) || typeLabel(state.record))) return false;

    var secondarySection = byId('comp-moznh5yl');
    if (!optionalSectionVisibilitySettled(secondarySection)) return false;

    var nativeCta = byId('comp-mozmgdoo');
    if (nativeCta && shellQuery(nativeCta, 'a[href]') && cleanText(nativeCta.textContent) &&
        !hasShellAttribute(nativeCta, 'data-bw-shell-v2-tour-band', '1')) return false;
    var toc = document.querySelector('[data-bw-shell-v2-toc]');
    if (nativeCta && toc && shellQuery(nativeCta, 'a[href]') && cleanText(nativeCta.textContent) &&
        !shellQuery(toc, '[data-bw-shell-v2-tour-rail]')) return false;
    return richContentMarkersPresent();
  }

  function decorationNeeded() {
    return !requiredShellMarkersPresent();
  }

  /* Wix hydrates the dynamic template in childList bursts. Never run the
   * full decorator synchronously from that observer: decoration itself writes
   * into the observed subtree (H1, summary, TOC and native section markers),
   * which can otherwise create an unbounded microtask loop while a required
   * node is still settling. */
  function scheduleDecorate(delay) {
    if (state.decorateQueued || state.attempt >= 40 || !decorationNeeded()) return;
    state.decorateQueued = true;
    window.setTimeout(function () {
      state.decorateQueued = false;
      if (state.attempt >= 40 || !decorationNeeded()) return;
      decorate();
    }, Math.max(0, Number(delay) || 0));
  }

  /* A dynamically injected Wix head script can execute before <body> exists.
   * Keep boot pending until the body is available, but bound the retry so a
   * malformed host cannot create an endless timer loop. */
  function scheduleStartUntilBody() {
    if (state.bodyWaitQueued || (state.bodyWaitAttempts || 0) >= 40) return;
    state.bodyWaitQueued = true;
    state.bodyWaitAttempts = (state.bodyWaitAttempts || 0) + 1;
    window.setTimeout(function () {
      state.bodyWaitQueued = false;
      if (!state.booted) start();
    }, 50);
  }

  var SHELL_MUTATION_ROOT_IDS = [
    'comp-mozc935g3',
    'comp-mozmt2at',
    'comp-mozn18up',
    'comp-moznh5yl',
    'comp-mozmgdoo',
    'comp-mozp1zlv'
  ];

  function shellMutationAncestorRelevant(node) {
    var current = node;
    while (current) {
      if (SHELL_MUTATION_ROOT_IDS.indexOf(String(current.id || '')) !== -1) return true;
      current = current.parentElement || current.parentNode || null;
    }
    return false;
  }

  function shellMutationSubtreeRelevant(node) {
    if (!node) return false;
    if (shellMutationAncestorRelevant(node)) return true;
    if (typeof node.querySelector !== 'function') return false;
    for (var i = 0; i < SHELL_MUTATION_ROOT_IDS.length; i += 1) {
      try {
        if (node.querySelector('#' + SHELL_MUTATION_ROOT_IDS[i])) return true;
      } catch (e) {}
    }
    return false;
  }

  /* Body-wide observation is needed for Wix remounts, but header/footer and
   * analytics mutations must not reset the bounded hydration budget. A body
   * target alone is intentionally insufficient; added/removed subtrees are
   * inspected for a shell root instead. */
  function shellMutationRelevant(records) {
    if (!records || !records.length) return false;
    for (var i = 0; i < records.length; i += 1) {
      var record = records[i];
      if (!record) continue;
      if (shellMutationAncestorRelevant(record.target)) return true;
      var added = record.addedNodes || [];
      var removed = record.removedNodes || [];
      for (var j = 0; j < added.length; j += 1) {
        if (shellMutationSubtreeRelevant(added[j])) return true;
      }
      for (var k = 0; k < removed.length; k += 1) {
        if (shellMutationSubtreeRelevant(removed[k])) return true;
      }
    }
    return false;
  }

  function decorateOuterShell() {
    var hero = byId('comp-mozc935g3');
    var heading = byId('comp-mozch2i3');
    var lead = byId('comp-mozck6is');
    var secondary = byId('comp-mozcllqt');
    var widget = byId('comp-mozco5et');
    var introSection = byId('comp-mozmt2at');
    var bodySection = byId('comp-mozn18up');
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

    ensureHeroCopy(heading, lead);
    injectHeroMeta(hero, heading);
    injectSummaryCard(hero, heading);
    injectToolEntry(widget);
    state.surfaceDone = normalizeWidgetSurface(widget) || state.surfaceDone;
    observeEditorialBandInputs(heading, lead, secondary, hero);
    scheduleEditorialBandMeasure();
    return true;
  }

  function hideDuplicateCtas() {
    ['bw-desktop-cta', 'bw-sticky-cta', 'bw-exit-intent-popup'].forEach(function (id) {
      var node = byId(id);
      if (node) node.setAttribute('data-bw-tools-shell-v2-hidden', '1');
    });
    document.querySelectorAll('.bw-tool-bridge, .bw-tour-cta-row').forEach(function (node) {
      if (node.closest && node.closest('#comp-mozmgdoo')) return;
      node.setAttribute('data-bw-tools-shell-v2-hidden', '1');
    });
  }

  function decorate() {
    if (state.decorating) return;
    state.decorating = true;
    var observer = state.mutationObserver;
    if (observer) observer.disconnect();
    try {
      applyScopedSeo();
      state.decorated = decorateOuterShell() || state.decorated;
      state.richContentDone = decorateRichContent() || state.richContentDone;
      decorateLowerArchitecture();
      hideDuplicateCtas();
      state.attempt += 1;
      if (state.attempt < 40 && decorationNeeded()) {
        window.setTimeout(decorate, 250);
      }
    } finally {
      if (observer && document.body && state.mutationObserverOptions) {
        observer.takeRecords();
        observer.observe(document.body, state.mutationObserverOptions);
      }
      state.decorating = false;
    }
  }

  function applyCatalog(record) {
    state.record = record || state.record;
    if (state.decorating) scheduleDecorate(0);
    else decorate();
    settleEditorialBand();
  }

  function start() {
    if (state.booted) return;
    if (!document.body) {
      scheduleStartUntilBody();
      return false;
    }
    state.booted = true;
    applyScopedSeo();
    decorate();
    settleEditorialBand();
    fetchCatalog().then(function (record) {
      applyCatalog(record);
    });
    window.setTimeout(decorate, 500);
    window.setTimeout(decorate, 1500);
    window.setTimeout(decorate, 3000);
    window.addEventListener('resize', scheduleEditorialBandMeasure, { passive: true });
    if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === 'function') {
      document.fonts.ready.then(settleEditorialBand, function () {});
    }
    if (typeof MutationObserver === 'function' && document.body) {
      var observerOptions = { childList: true, subtree: true };
      var observer = new MutationObserver(function (records) {
        if (state.decorating || !records || !records.length) return;
        if (!shellMutationRelevant(records)) return;
        /* A later Wix remount is a new hydration cycle. The old bounded
         * budget must not make recovery impossible after it was exhausted. */
        if (state.attempt >= 40) state.attempt = 0;
        if (decorationNeeded()) scheduleDecorate(50);
      });
      state.mutationObserver = observer;
      state.mutationObserverOptions = observerOptions;
      observer.observe(document.body, observerOptions);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
  window.setTimeout(start, 0);
})();
