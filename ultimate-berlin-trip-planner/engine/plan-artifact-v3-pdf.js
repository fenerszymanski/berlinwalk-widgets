(function (globalScope, factory) {
  var artifactApi = globalScope && globalScope.BWPlanArtifactV3;
  if (!artifactApi && typeof module === 'object' && module.exports && typeof require === 'function') {
    artifactApi = require('./plan-artifact-v3.js');
  }
  var api = factory(artifactApi, globalScope);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (globalScope) globalScope.BWPlanArtifactPdfV3 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (ArtifactV3, RuntimeScope) {
  'use strict';

  var PDF_SCHEMA_VERSION = '3.0.0';
  var RENDERER_VERSION = 'plan-artifact-v3-pdf-3.4.1-transfer-order-p3';
  var PAGE_WIDTH = 595.28;
  var PAGE_HEIGHT = 841.89;
  var MARGIN = 40;
  var FOOTER_Y = 813;
  // The page plan is created before jsPDF is available, so these capacities
  // deliberately leave room for font-metric differences in the real browser
  // renderer. The first day page also contains weather and decision cards.
  var DAY_FIRST_PAGE_BLOCK_CAPACITY = 360;
  var DAY_CONTINUATION_BLOCK_CAPACITY = 520;
  // Continuation carry pages still need a section label and the final support
  // card. Reserving that space prevents long 5-7 day plans from failing at
  // download time after the page plan has already been created.
  var CARRY_CONTINUATION_ITEM_CAPACITY = 500;
  var MIN_HELPER_FONT_SIZE = 9.5;
  var BODY_FONT_SIZE = 10.5;
  var ACCESSIBILITY_LIMITATION = 'jsPDF 2.5.1 can set the document language, display title, reading-order bookmarks and metadata, but it does not expose a tagged-PDF structure-tree API.';
  var COLORS = {
    green: [27, 94, 32],
    darkGreen: [18, 61, 24],
    yellow: [255, 230, 0],
    lime: [124, 179, 66],
    cream: [250, 250, 245],
    soft: [242, 248, 232],
    white: [255, 255, 255],
    text: [33, 33, 33],
    muted: [78, 90, 78],
    border: [211, 226, 199],
    blue: [23, 76, 138],
    lightBlue: [234, 244, 255],
    amber: [128, 84, 0],
    lightAmber: [255, 247, 230]
  };
  var ALLOWED_URL_HOSTS = {
    'berlinwalk.com': true,
    'www.berlinwalk.com': true,
    'app.berlinwalk.com': true,
    'google.com': true,
    'www.google.com': true,
    'maps.google.com': true,
    'berlin.de': true,
    'www.berlin.de': true,
    'bvg.de': true,
    'www.bvg.de': true,
    'vbb.de': true,
    'www.vbb.de': true,
    'bundestag.de': true,
    'www.bundestag.de': true,
    'smb.museum': true,
    'www.smb.museum': true,
    'spsg.de': true,
    'www.spsg.de': true,
    'visitberlin.de': true,
    'www.visitberlin.de': true
  };

  function cleanText(value, maxLength) {
    return String(value == null ? '' : value)
      .replace(/[\u0000-\u001f\u007f]/g, ' ')
      .replace(/[\u2010-\u2015\u2212]/g, '-')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201c\u201d]/g, '"')
      .replace(/\u2022/g, '-')
      .replace(/\u2192/g, ' -> ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, maxLength || 1800);
  }

  function escapeXml(value) {
    return cleanText(value, 1200)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function validateExternalUrl(value) {
    var clean = cleanText(value, 1600);
    if (!clean || clean === '#' || clean.charAt(0) === '#') return false;
    if (/placeholder|example\.com|javascript:|data:/i.test(clean)) return false;
    try {
      var parsed = new URL(clean);
      if (parsed.protocol !== 'https:') return false;
      if (parsed.username || parsed.password) return false;
      if (!ALLOWED_URL_HOSTS[parsed.hostname.toLowerCase()]) return false;
      return true;
    } catch (error) {
      return false;
    }
  }

  function safeLink(link, fallbackLabel) {
    link = link || {};
    var href = cleanText(link.url || link.href, 1600);
    if (!validateExternalUrl(href)) return null;
    return {
      label: cleanText(link.label || link.title || fallbackLabel || 'Open official link', 160),
      url: href,
      kind: cleanText(link.kind || '', 40)
    };
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function isViewModel(value) {
    return Boolean(value && value.artifact && Array.isArray(value.days) && value.trip);
  }

  function toViewModel(source, weatherSource) {
    if (!ArtifactV3 || typeof ArtifactV3.createViewModel !== 'function') {
      throw new Error('BWPlanArtifactV3 must be loaded before BWPlanArtifactPdfV3.');
    }
    if (isViewModel(source)) {
      return ArtifactV3.createViewModel(source.artifact, source.weather || weatherSource || {});
    }
    if (source && source.artifact) {
      return ArtifactV3.createViewModel(source.artifact, source.weatherOverlay || source.weather || weatherSource || {});
    }
    return ArtifactV3.createViewModel(source, weatherSource || {});
  }

  function formatDate(value) {
    var clean = cleanText(value, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;
    var parts = clean.split('-').map(Number);
    var date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    try {
      return new Intl.DateTimeFormat('en-GB', {
        timeZone: 'UTC',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(date);
    } catch (error) {
      return clean;
    }
  }

  function formatCheckedAt(value) {
    var clean = cleanText(value, 40);
    var parsed = new Date(clean);
    if (!clean || Number.isNaN(parsed.getTime())) return '';
    try {
      return new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Berlin',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZoneName: 'short'
      }).format(parsed);
    } catch (error) {
      return clean;
    }
  }

  function weatherSummary(day) {
    var weather = day && day.weather;
    if (!weather) return 'Weather data is not available for this date yet.';
    var checked = formatCheckedAt(weather.checkedAt);
    var typicalTitle = cleanText(weather.title, 120).match(/^Typical\s+([A-Za-z]+)\s+conditions\b/i);
    var prefix = weather.kind === 'live'
      ? 'Live forecast' + (checked ? ' from Open-Meteo, checked ' + checked : ' from Open-Meteo')
      : (typicalTitle ? 'Typical ' + typicalTitle[1] + ' conditions, not a forecast' : 'Typical seasonal conditions, not a forecast');
    var measures = [];
    if (Number.isFinite(weather.highC)) measures.push('high ' + Math.round(weather.highC) + ' C');
    if (Number.isFinite(weather.lowC)) measures.push('low ' + Math.round(weather.lowC) + ' C');
    if (Number.isFinite(weather.rainProbability)) measures.push(Math.round(weather.rainProbability) + '% rain');
    // Temperatures and rain are already rendered from the structured values above.
    // Prefer the action cue here so the same numbers are not repeated in prose.
    var detail = cleanText(weather.cue, 240);
    if (weather.kind !== 'live') {
      detail = detail.replace(/\b(?:this is )?not a forecast[.!]?\s*/ig, '').trim();
    }
    return cleanText(prefix + (measures.length ? ': ' + measures.join(', ') : '') + (detail ? '. ' + detail : ''), 420);
  }

  function openingSummary(day) {
    var parts = [];
    var status = cleanText(day && day.opening && day.opening.status || '', 160);
    var statusKey = status.toLowerCase();
    if (statusKey === 'monday') parts.push('Check Monday opening hours before you leave');
    else if (statusKey === 'sunday') parts.push('Most shops are closed on Sunday. Check each stop before you leave');
    else if (statusKey === 'weekday') parts.push('Check opening hours on the official website before you leave');
    else if (status) parts.push(status);
    var warning = day && day.opening && day.opening.warning;
    var warningText = typeof warning === 'string'
      ? warning
      : warning && (warning.detail || warning.label || warning.title);
    if (warningText) parts.push(cleanText(warningText, 240));
    if (day && day.reservation && day.reservation.required) parts.push('Book or check: ' + day.reservation.label);
    if (!parts.length) parts.push('Check opening hours on the official website before you leave');
    var copy = parts.map(function (part) {
      return cleanText(part, 240).replace(/[.!?]+$/, '');
    }).filter(Boolean).join('. ');
    return cleanText(copy + '.', 500);
  }

  function dayLinks(day) {
    var links = [];
    var route = safeLink(day && day.route, 'Open the full day route');
    if (!route) throw new Error('Day ' + (day && day.dayNumber || '?') + ' has no valid HTTPS route URL.');
    links.push(route);
    (day.blocks || []).forEach(function (block) {
      var transfer = block && block.transferFromPrevious;
      var transferLink = transfer && safeLink({
        label: 'Open transfer: ' + transfer.fromLabel + ' to ' + transfer.toLabel,
        url: transfer.url,
        kind: 'transfer'
      }, 'Open transfer');
      if (transferLink && !links.some(function (item) { return item.url === transferLink.url; })) links.push(transferLink);
      var segment = block && block.transferSegment;
      var segmentLink = segment && safeLink({
        label: 'Open journey: ' + segment.fromLabel + ' to ' + segment.toLabel,
        url: segment.url,
        kind: 'transfer'
      }, 'Open journey');
      if (segmentLink && !links.some(function (item) { return item.url === segmentLink.url; })) links.push(segmentLink);
      (block.links || []).forEach(function (link) {
        var valid = safeLink(link, 'Open map');
        if (valid && !links.some(function (item) { return item.url === valid.url; })) links.push(valid);
      });
    });
    return links;
  }

  function buildCoverPage(view) {
    return {
      type: 'cover',
      title: cleanText(view.trip.title || 'Your Berlin plan', 240),
      dateRange: cleanText(view.trip.dateRange || view.trip.displayDate || '', 120),
      tripLength: view.days.length,
      stayArea: cleanText(view.trip.stayArea || view.input.labels && view.input.labels.stayArea || '', 140),
      pace: cleanText(view.trip.pace || view.input.labels && view.input.labels.pace || '', 100),
      personalisedFor: 'Made for your travel dates, Berlin base and preferred pace.',
      links: []
    };
  }

  function estimatedLineCount(value, charactersPerLine) {
    var clean = cleanText(value, 12000);
    if (!clean) return 0;
    var limit = Math.max(12, Number(charactersPerLine) || 54);
    return clean.split(/\n+/).reduce(function (total, paragraph) {
      var words = paragraph.split(/\s+/).filter(Boolean);
      var lines = 1;
      var current = 0;
      words.forEach(function (word) {
        var length = word.length;
        if (current && current + 1 + length > limit) {
          lines += 1;
          current = length;
        } else {
          current += (current ? 1 : 0) + length;
        }
        if (length > limit) lines += Math.floor(length / limit);
      });
      return total + lines;
    }, 0);
  }

  function paginateByHeight(items, capacityForPage, heightForItem) {
    var remaining = items.slice();
    var pages = [];
    while (remaining.length) {
      var capacity = typeof capacityForPage === 'function' ? capacityForPage(pages.length) : capacityForPage;
      var used = 0;
      var pageItems = [];
      while (remaining.length) {
        var height = Math.max(1, heightForItem(remaining[0], pageItems.length));
        if (pageItems.length && used + height > capacity) break;
        pageItems.push(remaining.shift());
        used += height;
        if (used >= capacity) break;
      }
      if (!pageItems.length) pageItems.push(remaining.shift());
      pages.push(pageItems);
    }
    return pages.length ? pages : [[]];
  }

  function avoidSingleItemLastPage(groups) {
    if (groups.length > 1 && groups[groups.length - 1].length === 1 && groups[groups.length - 2].length >= 3) {
      groups[groups.length - 1].unshift(groups[groups.length - 2].pop());
    }
    return groups;
  }

  function buildOverviewPages(view) {
    var rows = view.days.map(function (day) {
      var links = dayLinks(day);
      return {
        dayNumber: day.dayNumber,
        date: formatDate(day.dateKey),
        title: cleanText(day.title, 180),
        theme: cleanText(day.theme, 140),
        area: cleanText(day.area, 140),
        movement: cleanText(day.movement, 100),
        route: links[0]
      };
    });
    var narrative = [{
      title: 'Your trip',
      detail: cleanText(view.decisionReceipt.guideNote || view.trip.summary || 'Your days stay in a practical geographic order.', 1200)
    }].concat((view.decisionReceipt.reasons || []).slice(0, 8).map(function (item, index) {
      return { title: 'Decision ' + (index + 1), detail: cleanText(item, 600) };
    }));
    var narrativeGroups = paginateByHeight(narrative, 590, function (item) {
      return 34 + estimatedLineCount(item.detail, 69) * 14;
    });
    var narrativePages = narrativeGroups.map(function (items, index) {
      return {
        type: 'overview',
        title: 'Why this plan is arranged this way',
        headline: cleanText(view.decisionReceipt.headline || view.trip.title, 240),
        items: items,
        partNumber: index + 1,
        partCount: narrativeGroups.length,
        links: []
      };
    });
    var dayGroups = [];
    for (var start = 0; start < rows.length; start += 5) dayGroups.push(rows.slice(start, start + 5));
    avoidSingleItemLastPage(dayGroups);
    var dayPages = dayGroups.map(function (days, index) {
      return {
        type: 'overview-days',
        title: 'Plan at a glance',
        days: days,
        partNumber: index + 1,
        partCount: dayGroups.length,
        links: days.map(function (day) { return day.route; })
      };
    });
    return narrativePages.concat(dayPages).concat([{
      type: 'overview-notes',
      title: 'Tickets and tour timing',
      ticket: cleanText(view.trip.ticket || 'Check the ticket needed for each public-transport journey before you board.', 1200),
      tourFit: cleanText(view.trip.tourFit || 'Use the historic-centre day for the BerlinWalk free walking tour if its time fits your plan.', 1200),
      links: []
    }]);
  }

  function buildDayPage(day) {
    var links = dayLinks(day);
    return {
      type: 'day',
      title: cleanText(day.title, 180),
      dayNumber: day.dayNumber,
      date: formatDate(day.dateKey),
      theme: cleanText(day.theme, 140),
      area: cleanText(day.area, 140),
      movement: cleanText(day.movement, 100),
      decision: cleanText(day.decision, 700),
      weather: weatherSummary(day),
      route: links[0],
      blocks: (day.blocks || []).map(function (block) {
        var safeBlockLinks = (block.links || []).map(function (item) { return safeLink(item, 'Open map'); }).filter(Boolean);
        var mealLinks = safeBlockLinks.filter(function (item) { return item.kind === 'meal_option'; });
        var blockLinks = mealLinks.length ? mealLinks.slice(0, 3) : safeBlockLinks.slice(0, 1);
        var link = blockLinks[0] || null;
        var transfer = block.transferFromPrevious || null;
        var segment = block.transferSegment || null;
        function transferData(value, label) {
          if (!value) return null;
          var from = cleanText(value.fromLabel, 160);
          var to = cleanText(value.toLabel, 160);
          var descriptiveLabel = value.mode === 'walking'
            ? 'Open this walk in Google Maps'
            : 'Open this public transport route in Google Maps';
          return {
            fromPlaceId: cleanText(value.fromPlaceId, 100),
            fromLabel: from,
            toPlaceId: cleanText(value.toPlaceId, 100),
            toLabel: to,
            mode: cleanText(value.mode, 20),
            minutes: Number(value.minutes) || 0,
            bufferMinutes: Number(value.bufferMinutes) || 0,
            totalMinutes: Number(value.totalMinutes) || 0,
            instruction: cleanText(value.instruction, 360),
            link: safeLink({ label: descriptiveLabel, url: value.url, kind: 'transfer' }, descriptiveLabel)
          };
        }
        return {
          kind: cleanText(block.kind || 'activity', 20),
          mealRole: mealLinks.length ? 'meal' : '',
          time: cleanText(block.window || block.time || 'Next', 80),
          window: cleanText(block.window, 80),
          title: cleanText(block.title, 180),
          detail: cleanText(block.detail, 700),
          placeId: cleanText(block.placeId, 100),
          link: link ? Object.assign({}, link, {
            label: mealLinks.length ? cleanText(link.label, 220) : cleanText('Open map for ' + block.title, 220)
          }) : null,
          links: blockLinks.map(function (item) {
            return Object.assign({}, item, { label: cleanText(item.label, 220) });
          }),
          transfer: transferData(transfer, 'Open transfer map'),
          segment: transferData(segment, 'Open journey map')
        };
      }),
      links: links
    };
  }

  function estimatedTransferHeight(value) {
    if (!value) return 0;
    var summary = value.fromLabel + ' to ' + value.toLabel;
    return 18 + estimatedLineCount(summary, 58) * 13 + estimatedLineCount(value.instruction, 58) * 13 + (value.link ? 15 : 0);
  }

  function estimatedBlockHeight(block) {
    var height = 35;
    height += estimatedLineCount(block.title, 39) * 17;
    height += estimatedLineCount(block.detail, 58) * 14;
    height += (block.links && block.links.length ? block.links : (block.link ? [block.link] : [])).reduce(function (total, link) {
      return total + Math.max(16, estimatedLineCount(link.label, 58) * 13 + 4);
    }, 0);
    height += estimatedTransferHeight(block.segment);
    var activityHeight = Math.max(96, height + 16);
    return activityHeight + (block.transfer ? estimatedTransferHeight(block.transfer) + 8 : 0);
  }

  function buildDayPages(day) {
    var fullPage = buildDayPage(day);
    var blocks = fullPage.blocks.length ? fullPage.blocks : [];
    var groups = paginateByHeight(blocks, function (pageIndex) {
      return pageIndex === 0 ? DAY_FIRST_PAGE_BLOCK_CAPACITY : DAY_CONTINUATION_BLOCK_CAPACITY;
    }, function (block) {
      return estimatedBlockHeight(block) + 10;
    });
    var blockStart = 0;
    return groups.map(function (group, index) {
      var page = Object.assign({}, fullPage, {
        blocks: group,
        blockStart: blockStart,
        partNumber: index + 1,
        partCount: groups.length
      });
      blockStart += group.length;
      return page;
    });
  }

  function buildWeatherPages(view) {
    var rows = view.days.map(function (day) {
      var reservation = safeLink(day.reservation, day.reservation && day.reservation.label || 'Official reservation');
      return {
        dayNumber: day.dayNumber,
        date: formatDate(day.dateKey),
        title: cleanText(day.title, 180),
        weatherKind: day.weather && day.weather.kind === 'live' ? 'live' : 'typical',
        weather: weatherSummary(day),
        opening: openingSummary(day),
        planB: cleanText(day.planB, 900),
        reservation: reservation
      };
    });
    var groups = paginateByHeight(rows, 600, function (row) {
      return 54 + estimatedLineCount(row.weather, 67) * 13 + estimatedLineCount(row.opening, 67) * 13 + estimatedLineCount(row.planB, 67) * 13 + (row.reservation ? 18 : 0);
    });
    avoidSingleItemLastPage(groups);
    return groups.map(function (days, index) {
      return {
        type: 'weather-plan-b',
        title: 'Weather, openings and Plan B',
        generatedAt: cleanText(view.weather && view.weather.generatedAt, 40),
        checkedAt: formatCheckedAt(view.weather && view.weather.generatedAt),
        source: cleanText(view.weather && view.weather.source || '', 80),
        mode: cleanText(view.weather && view.weather.mode || 'typical', 20),
        days: days,
        partNumber: index + 1,
        partCount: groups.length,
        links: days.map(function (row) { return row.reservation; }).filter(Boolean)
      };
    });
  }

  function buildCarryPages(view) {
    function cards(items) {
      return (items || []).slice(0, 12).map(function (item) {
        return {
          title: cleanText(item.title, 180),
          detail: cleanText(item.detail, 600),
          link: safeLink(item.link, item.title)
        };
      });
    }
    var before = cards(view.beforeYouGo);
    var carry = cards(view.carryPack);
    var site = { label: 'berlinwalk.com', url: 'https://www.berlinwalk.com/', kind: 'support' };
    var all = before.map(function (item) { return Object.assign({ section: 'Before you go' }, item); })
      .concat(carry.map(function (item) { return Object.assign({ section: 'On your phone' }, item); }));
    var groups = paginateByHeight(all, function (pageIndex) {
      return pageIndex === 0 ? 480 : CARRY_CONTINUATION_ITEM_CAPACITY;
    }, function (item) {
      return 46 + estimatedLineCount(item.title, 64) * 14 + estimatedLineCount(item.detail, 72) * 13 + (item.link ? 16 : 0);
    });
    avoidSingleItemLastPage(groups);
    return groups.map(function (items, index) {
      return {
        type: 'carry-support',
        title: 'Save your plan on your phone and as a PDF',
        items: items,
        support: site,
        partNumber: index + 1,
        partCount: groups.length,
        isLastPart: index === groups.length - 1,
        links: items.map(function (item) { return item.link; }).filter(Boolean).concat(index === groups.length - 1 ? [site] : [])
      };
    });
  }

  function collectLinks(pagePlan) {
    var links = [];
    pagePlan.pages.forEach(function (page) {
      (page.links || []).forEach(function (link) {
        if (link && !links.some(function (item) { return item.url === link.url; })) links.push(link);
      });
    });
    return links;
  }

  function validatePagePlan(pagePlan) {
    var errors = [];
    if (!pagePlan || pagePlan.schemaVersion !== PDF_SCHEMA_VERSION) errors.push('pdf_schema_version');
    var pages = pagePlan && Array.isArray(pagePlan.pages) ? pagePlan.pages : [];
    var dayCount = pagePlan && Number(pagePlan.dayCount) || 0;
    if (pages.length < dayCount + 6) errors.push('page_count');
    if (!pages[0] || pages[0].type !== 'cover') errors.push('cover_page');
    if (!pages[1] || pages[1].type !== 'overview') errors.push('overview_page');
    if (!pages.some(function (page) { return page.type === 'overview-days'; })) errors.push('overview_days_page');
    if (!pages.some(function (page) { return page.type === 'overview-notes'; })) errors.push('overview_notes_page');
    var dayPages = pages.filter(function (page) { return page.type === 'day'; });
    if (dayPages.length < dayCount) errors.push('day_pages');
    var weatherPages = pages.filter(function (page) { return page.type === 'weather-plan-b'; });
    if (!weatherPages.length) errors.push('weather_page');
    if (weatherPages.some(function (page, index) {
      return page.partNumber !== index + 1 || page.partCount !== weatherPages.length;
    })) errors.push('weather_part_sequence');
    var carryPages = pages.filter(function (page) { return page.type === 'carry-support'; });
    if (!carryPages.length) errors.push('carry_page');
    if (carryPages.some(function (page, index) {
      return page.partNumber !== index + 1 || page.partCount !== carryPages.length;
    })) errors.push('carry_part_sequence');
    if (!pages[pages.length - 1] || pages[pages.length - 1].type !== 'carry-support') errors.push('carry_page');
    var snapshot = pagePlan && Array.isArray(pagePlan.deliverySnapshot) ? pagePlan.deliverySnapshot : [];
    if (snapshot.length !== dayCount) errors.push('delivery_snapshot_count');
    snapshot.forEach(function (expected, index) {
      var pagesForDay = dayPages.filter(function (page) { return page.dayNumber === expected.dayNumber; });
      if (!pagesForDay.length || pagesForDay.some(function (page) {
        return expected.title !== page.title || expected.routeUrl !== (page.route && page.route.url);
      })) {
        errors.push('delivery_snapshot_day_' + (index + 1));
        return;
      }
      if (pagesForDay.some(function (page, partIndex) {
        return page.partNumber !== partIndex + 1 || page.partCount !== pagesForDay.length;
      })) errors.push('day_part_sequence_' + (index + 1));
      var actualBlocks = pagesForDay.reduce(function (all, page) {
        return all.concat((page.blocks || []).map(function (block, blockIndex) {
        return {
          order: (Number(page.blockStart) || 0) + blockIndex + 1,
          kind: block.kind,
          window: block.window || block.time,
          title: block.title,
          placeId: block.placeId,
          transfer: block.transfer ? {
            fromPlaceId: block.transfer.fromPlaceId,
            toPlaceId: block.transfer.toPlaceId,
            mode: block.transfer.mode,
            totalMinutes: block.transfer.totalMinutes
          } : null,
          segment: block.segment ? {
            fromPlaceId: block.segment.fromPlaceId,
            toPlaceId: block.segment.toPlaceId,
            mode: block.segment.mode,
            totalMinutes: block.segment.totalMinutes
          } : null
        };
        }));
      }, []);
      var expectedBlocks = (expected.blocks || []).map(function (block) {
        var transfer = block.transferFromPrevious || null;
        var segment = block.transferSegment || null;
        return {
          order: block.order,
          kind: block.kind,
          window: block.window,
          title: block.title,
          placeId: block.placeId,
          transfer: transfer ? {
            fromPlaceId: transfer.fromPlaceId,
            toPlaceId: transfer.toPlaceId,
            mode: transfer.mode,
            totalMinutes: transfer.totalMinutes
          } : null,
          segment: segment ? {
            fromPlaceId: segment.fromPlaceId,
            toPlaceId: segment.toPlaceId,
            mode: segment.mode,
            totalMinutes: segment.totalMinutes
          } : null
        };
      });
      if (JSON.stringify(actualBlocks) !== JSON.stringify(expectedBlocks)) errors.push('delivery_snapshot_blocks_' + (index + 1));
    });
    pages.forEach(function (page, index) {
      if (page.pageNumber !== index + 1) errors.push('page_sequence_' + (index + 1));
      (page.links || []).forEach(function (link) {
        if (!link || !validateExternalUrl(link.url)) errors.push('unsafe_link_page_' + (index + 1));
      });
    });
    return Array.from(new Set(errors));
  }

  function fileNameFor(view) {
    var date = cleanText(view.input && view.input.arrivalDate || view.days[0] && view.days[0].dateKey || 'berlin', 10)
      .replace(/[^0-9-]/g, '');
    return 'berlinwalk-plan-' + (date || 'berlin') + '-' + view.days.length + (view.days.length === 1 ? '-day.pdf' : '-days.pdf');
  }

  function createPagePlan(source, weatherSource) {
    var view = toViewModel(source, weatherSource);
    var overviewPages = buildOverviewPages(view);
    var dayPages = view.days.reduce(function (pages, day) {
      return pages.concat(buildDayPages(day));
    }, []);
    var weatherPages = buildWeatherPages(view);
    var carryPages = buildCarryPages(view);
    var pages = [buildCoverPage(view)]
      .concat(overviewPages)
      .concat(dayPages)
      .concat(weatherPages)
      .concat(carryPages);
    pages.forEach(function (page, index) {
      page.pageNumber = index + 1;
    });
    var pagePlan = {
      schemaVersion: PDF_SCHEMA_VERSION,
      rendererVersion: RENDERER_VERSION,
      artifactSchemaVersion: cleanText(view.artifact.schemaVersion, 40),
      artifactEngineVersion: cleanText(view.artifact.engineVersion, 100),
      artifactCreatedAt: cleanText(view.artifact.createdAt, 40),
      weatherGeneratedAt: cleanText(view.weather && view.weather.generatedAt, 40),
      deliverySnapshot: ArtifactV3.deliverySnapshot(view.artifact).pdf.map(function (day) {
        return Object.assign({}, day, {
          title: cleanText(day.title, 180),
          blocks: day.blocks.map(function (block) {
            return Object.assign({}, block, {
              window: cleanText(block.window, 80),
              title: cleanText(block.title, 180),
              placeId: cleanText(block.placeId, 100)
            });
          })
        });
      }),
      dayCount: view.days.length,
      overviewPageCount: overviewPages.length,
      dayPageCount: dayPages.length,
      weatherPageCount: weatherPages.length,
      carryPageCount: carryPages.length,
      pageCount: pages.length,
      fileName: fileNameFor(view),
      pages: pages
    };
    pagePlan.links = collectLinks(pagePlan);
    var errors = validatePagePlan(pagePlan);
    if (errors.length) {
      var error = new Error('Invalid PlanArtifactV3 PDF page plan: ' + errors.join('; '));
      error.code = 'invalid_plan_artifact_v3_pdf';
      error.details = errors;
      throw error;
    }
    return pagePlan;
  }

  function makePdf(jsPdfTarget) {
    var doc;
    if (typeof jsPdfTarget === 'function') {
      doc = new jsPdfTarget({ unit: 'pt', format: 'a4', orientation: 'portrait', compress: true });
    } else {
      doc = jsPdfTarget;
    }
    if (!doc || typeof doc.addPage !== 'function' || typeof doc.text !== 'function' || !doc.internal || !doc.internal.pageSize) {
      throw new Error('A jsPDF constructor or instance is required.');
    }
    var currentPages = typeof doc.getNumberOfPages === 'function' ? doc.getNumberOfPages() : 1;
    if (currentPages > 1 && typeof doc.deletePage === 'function') {
      for (var page = currentPages; page > 1; page -= 1) doc.deletePage(page);
      currentPages = typeof doc.getNumberOfPages === 'function' ? doc.getNumberOfPages() : 1;
    }
    if (currentPages !== 1) throw new Error('The jsPDF instance must contain exactly one blank page.');
    return doc;
  }

  function setColor(doc, method, color) {
    doc[method](color[0], color[1], color[2]);
  }

  function setFont(doc, size, style, color) {
    doc.setFont('helvetica', style || 'normal');
    doc.setFontSize(size);
    setColor(doc, 'setTextColor', color || COLORS.text);
  }

  function fitLines(doc, value, width, size, style) {
    setFont(doc, size, style || 'normal', COLORS.text);
    var clean = cleanText(value, 12000);
    var lines = doc.splitTextToSize(clean, width);
    if (!Array.isArray(lines)) lines = [String(lines || '')];
    return lines.length ? lines : [''];
  }

  function drawText(doc, value, x, y, width, size, style, color, maxLines, align) {
    var lines = fitLines(doc, value, width, size, style);
    setFont(doc, size, style || 'normal', color || COLORS.text);
    var options = { lineHeightFactor: 1.25 };
    if (align) options.align = align;
    doc.text(lines, x, y, options);
    return lines.length * size * 1.25;
  }

  function textHeight(doc, value, width, size, style) {
    return fitLines(doc, value, width, size, style).length * size * 1.25;
  }

  function assertContentFits(y, label) {
    if (y > FOOTER_Y - 24) throw new Error('PDF content overflow on ' + label + ': y=' + Math.round(y) + '.');
  }

  function fillRect(doc, x, y, width, height, fillColor, radius, borderColor) {
    setColor(doc, 'setFillColor', fillColor);
    setColor(doc, 'setDrawColor', borderColor || fillColor);
    if (radius && width >= radius * 2 && height >= radius * 2 && typeof doc.roundedRect === 'function') doc.roundedRect(x, y, width, height, radius, radius, 'FD');
    else doc.rect(x, y, width, height, 'FD');
  }

  function drawLink(doc, link, x, y, width, options) {
    options = options || {};
    if (!link || !validateExternalUrl(link.url)) return 0;
    var prefix = cleanText(options.prefix || '', 60);
    var label = (prefix ? prefix + ' ' : '') + cleanText(link.label, 140);
    var size = Math.max(MIN_HELPER_FONT_SIZE, options.size || MIN_HELPER_FONT_SIZE);
    var lines = fitLines(doc, label, width, size, 'bold');
    setFont(doc, size, 'bold', options.color || COLORS.blue);
    var lineHeight = size * 1.25;
    lines.forEach(function (line, index) {
      var lineY = y + index * lineHeight;
      doc.text(line, x, lineY);
      if (typeof doc.link === 'function') {
        var measuredWidth = typeof doc.getTextWidth === 'function' ? doc.getTextWidth(line) : width;
        var linkWidth = Math.max(1, Math.min(width, Number(measuredWidth) || width));
        doc.link(x, lineY - size, linkWidth, size + 3, { url: link.url });
      }
    });
    return lines.length * lineHeight;
  }

  function drawHeader(doc, kicker, title, subtitle, options) {
    options = options || {};
    fillRect(doc, 0, 0, PAGE_WIDTH, 8, COLORS.yellow);
    setFont(doc, MIN_HELPER_FONT_SIZE, 'bold', COLORS.green);
    doc.text(cleanText(kicker, 80).toUpperCase(), MARGIN, 40);
    var titleSize = 25;
    if (options.singleLineTitle) {
      var cleanTitle = cleanText(title, 240);
      while (titleSize > 18) {
        setFont(doc, titleSize, 'bold', COLORS.darkGreen);
        if (doc.splitTextToSize(cleanTitle, PAGE_WIDTH - MARGIN * 2).length <= 1) break;
        titleSize -= 1;
      }
    }
    var titleHeight = drawText(doc, title, MARGIN, 70, PAGE_WIDTH - MARGIN * 2, titleSize, 'bold', COLORS.darkGreen);
    var bottom = 70 + titleHeight;
    if (subtitle) bottom += 8 + drawText(doc, subtitle, MARGIN, bottom + 8, PAGE_WIDTH - MARGIN * 2, BODY_FONT_SIZE, 'normal', COLORS.muted);
    return Math.max(116, bottom + 14);
  }

  function drawFooter(doc, pageNumber, pageCount) {
    setColor(doc, 'setDrawColor', COLORS.border);
    doc.line(MARGIN, FOOTER_Y - 12, PAGE_WIDTH - MARGIN, FOOTER_Y - 12);
    setFont(doc, MIN_HELPER_FONT_SIZE, 'bold', COLORS.green);
    doc.text('berlinwalk.com | @berlinwalkingtour', MARGIN, FOOTER_Y + 4);
    doc.text('Page ' + pageNumber + ' / ' + pageCount, PAGE_WIDTH - MARGIN, FOOTER_Y + 4, { align: 'right' });
  }

  function resolveCoverImage(options) {
    options = options || {};
    if (options.coverImageDataUrl) return { source: options.coverImageDataUrl, format: /image\/png/i.test(options.coverImageDataUrl) ? 'PNG' : 'JPEG' };
    if (options.coverImageElement) return { source: options.coverImageElement, format: 'JPEG' };
    var documentRef = RuntimeScope && RuntimeScope.document;
    if (!documentRef || typeof documentRef.querySelector !== 'function') return null;
    var image = documentRef.querySelector('img[src*="berlin-trip-planner-hero.jpg"]');
    if (!image || image.complete === false || !image.naturalWidth) return null;
    return { source: image, format: 'JPEG' };
  }

  function drawCover(doc, page, options) {
    options = options || {};
    fillRect(doc, 0, 0, PAGE_WIDTH, 380, COLORS.green);
    fillRect(doc, 0, 376, PAGE_WIDTH, 4, COLORS.yellow);
    if (options.logoDataUrl && typeof doc.addImage === 'function') {
      doc.addImage(options.logoDataUrl, 'PNG', MARGIN, 40, 166, 34.8);
    } else {
      setFont(doc, 18, 'bold', COLORS.yellow);
      doc.text('BerlinWalk', MARGIN, 66);
    }
    setFont(doc, 9.5, 'bold', COLORS.yellow);
    doc.text('PERSONAL TRIP PLAN', MARGIN + 184, 61);
    var coverImage = resolveCoverImage(options);
    var titleWidth = coverImage ? 315 : PAGE_WIDTH - MARGIN * 2;
    drawText(doc, page.title, MARGIN, 132, titleWidth, 30, 'bold', COLORS.white);
    if (coverImage && typeof doc.addImage === 'function') {
      fillRect(doc, PAGE_WIDTH - MARGIN - 177, 112, 181, 140, COLORS.yellow, 8, COLORS.yellow);
      doc.addImage(coverImage.source, coverImage.format, PAGE_WIDTH - MARGIN - 173, 116, 173, 132);
    }
    var facts = page.tripLength + (page.tripLength === 1 ? ' day' : ' days');
    if (page.dateRange) facts += ' | ' + page.dateRange;
    if (page.stayArea) facts += ' | Base: ' + page.stayArea;
    drawText(doc, facts, MARGIN, 300, PAGE_WIDTH - MARGIN * 2, 11, 'normal', COLORS.white);
    drawText(doc, page.personalisedFor, MARGIN, 335, PAGE_WIDTH - MARGIN * 2, BODY_FONT_SIZE, 'bold', COLORS.yellow);

    fillRect(doc, MARGIN, 410, PAGE_WIDTH - MARGIN * 2, 132, COLORS.white, 12, COLORS.border);
    setFont(doc, MIN_HELPER_FONT_SIZE, 'bold', COLORS.green);
    doc.text('HOW TO USE THIS PLAN', MARGIN + 20, 438);
    drawText(doc, 'Start with the overview. Then use one day page at a time. Each day keeps its stops, travel steps and map links together.', MARGIN + 20, 469, PAGE_WIDTH - MARGIN * 2 - 40, 13, 'bold', COLORS.darkGreen);

    fillRect(doc, MARGIN, 570, PAGE_WIDTH - MARGIN * 2, 106, COLORS.soft, 12, COLORS.border);
    setFont(doc, MIN_HELPER_FONT_SIZE, 'bold', COLORS.green);
    doc.text('THE SAME PLAN ON YOUR PHONE AND IN THIS PDF', MARGIN + 20, 598);
    fillRect(doc, MARGIN + 20, 616, 205, 42, COLORS.white, 8, COLORS.border);
    fillRect(doc, MARGIN + 238, 616, 237, 42, COLORS.white, 8, COLORS.border);
    setFont(doc, BODY_FONT_SIZE, 'bold', COLORS.darkGreen);
    doc.text('Phone: live map links', MARGIN + 33, 642);
    doc.text('PDF: saved plan works offline', MARGIN + 251, 642);

    fillRect(doc, MARGIN, 704, PAGE_WIDTH - MARGIN * 2, 76, COLORS.yellow, 10, COLORS.yellow);
    setFont(doc, MIN_HELPER_FONT_SIZE, 'bold', COLORS.darkGreen);
    doc.text('BEFORE YOU LEAVE', MARGIN + 18, 730);
    drawText(doc, 'Check live opening hours and weather. Map links still need a data connection.', MARGIN + 18, 754, PAGE_WIDTH - MARGIN * 2 - 36, BODY_FONT_SIZE, 'bold', COLORS.darkGreen);
  }

  function drawOverview(doc, page) {
    var kicker = 'Your plan';
    if (page.partCount > 1) kicker += ' - part ' + page.partNumber + ' of ' + page.partCount;
    var y = drawHeader(doc, kicker, page.title, page.headline);
    page.items.forEach(function (item, index) {
      var detailHeight = textHeight(doc, item.detail, PAGE_WIDTH - MARGIN * 2 - 32, BODY_FONT_SIZE, 'normal');
      var cardHeight = 54 + detailHeight;
      fillRect(doc, MARGIN, y, PAGE_WIDTH - MARGIN * 2, cardHeight, index === 0 ? COLORS.soft : COLORS.white, 9, COLORS.border);
      setFont(doc, MIN_HELPER_FONT_SIZE, 'bold', COLORS.green);
      doc.text(item.title.toUpperCase(), MARGIN + 16, y + 25);
      drawText(doc, item.detail, MARGIN + 16, y + 49, PAGE_WIDTH - MARGIN * 2 - 32, BODY_FONT_SIZE, 'normal', COLORS.muted);
      y += cardHeight + 10;
    });
    assertContentFits(y, 'overview');
  }

  function drawOverviewDays(doc, page) {
    var kicker = 'Daily index';
    if (page.partCount > 1) kicker += ' - part ' + page.partNumber + ' of ' + page.partCount;
    var y = drawHeader(doc, kicker, page.title, 'Open the matching route only when you are ready to travel.');
    page.days.forEach(function (day, index) {
      var titleHeight = textHeight(doc, day.title, 360, 12, 'bold');
      var facts = [day.date, day.area, day.movement].filter(Boolean).join(' | ');
      var factHeight = textHeight(doc, facts, 360, BODY_FONT_SIZE, 'normal');
      var linkHeight = textHeight(doc, 'Map: ' + day.route.label, 360, MIN_HELPER_FONT_SIZE, 'bold');
      var rowHeight = Math.max(94, 32 + titleHeight + factHeight + linkHeight);
      fillRect(doc, MARGIN, y, PAGE_WIDTH - MARGIN * 2, rowHeight, index % 2 ? COLORS.white : COLORS.soft, 9, COLORS.border);
      fillRect(doc, MARGIN, y, 58, rowHeight, index % 2 ? COLORS.green : COLORS.darkGreen, 9, index % 2 ? COLORS.green : COLORS.darkGreen);
      setFont(doc, MIN_HELPER_FONT_SIZE, 'bold', COLORS.yellow);
      doc.text('DAY', MARGIN + 29, y + 28, { align: 'center' });
      setFont(doc, 18, 'bold', COLORS.white);
      doc.text(String(day.dayNumber), MARGIN + 29, y + 54, { align: 'center' });
      var textX = MARGIN + 76;
      drawText(doc, day.title, textX, y + 26, 360, 12, 'bold', COLORS.darkGreen);
      drawText(doc, facts, textX, y + 32 + titleHeight, 360, BODY_FONT_SIZE, 'normal', COLORS.muted);
      drawLink(doc, day.route, textX, y + 38 + titleHeight + factHeight, 360, { prefix: 'Map:', size: MIN_HELPER_FONT_SIZE });
      y += rowHeight + 10;
    });
    assertContentFits(y, 'overview day index');
  }

  function drawOverviewNotes(doc, page) {
    var y = drawHeader(doc, 'Practical notes', page.title, 'Check these notes before the first relevant journey or booked activity.');
    [{ title: 'Transport ticket', detail: page.ticket, fill: COLORS.lightBlue, accent: COLORS.blue },
      { title: 'BerlinWalk tour time', detail: page.tourFit, fill: COLORS.lightAmber, accent: COLORS.amber }]
      .forEach(function (item) {
        var detailHeight = textHeight(doc, item.detail, PAGE_WIDTH - MARGIN * 2 - 36, BODY_FONT_SIZE, 'normal');
        var height = 62 + detailHeight;
        fillRect(doc, MARGIN, y, PAGE_WIDTH - MARGIN * 2, height, item.fill, 10, COLORS.border);
        setFont(doc, MIN_HELPER_FONT_SIZE, 'bold', item.accent);
        doc.text(item.title.toUpperCase(), MARGIN + 18, y + 28);
        drawText(doc, item.detail, MARGIN + 18, y + 54, PAGE_WIDTH - MARGIN * 2 - 36, BODY_FONT_SIZE, 'normal', COLORS.muted);
        y += height + 14;
      });
    assertContentFits(y, 'overview notes');
  }

  function transferCardHeight(doc, transfer) {
    if (!transfer) return 0;
    var summary = (transfer.mode === 'walking' ? 'Walk' : 'Public transport') + ': ' + transfer.minutes + ' min. Allow ' + transfer.bufferMinutes + ' extra minutes. ' + transfer.fromLabel + ' to ' + transfer.toLabel + '.';
    var height = 28 + textHeight(doc, summary, 430, 10, 'bold');
    if (transfer.instruction) height += 6 + textHeight(doc, transfer.instruction, 430, BODY_FONT_SIZE, 'normal');
    if (transfer.link) height += 7 + textHeight(doc, transfer.link.label, 430, MIN_HELPER_FONT_SIZE, 'bold');
    return height + 10;
  }

  function blockCardHeight(doc, block) {
    var height = 54;
    height += textHeight(doc, block.title, 382, 13, 'bold');
    if (block.detail) height += 8 + textHeight(doc, block.detail, 483, BODY_FONT_SIZE, 'normal');
    var links = block.links && block.links.length ? block.links : (block.link ? [block.link] : []);
    links.forEach(function (link) {
      height += 8 + textHeight(doc, link.label, 483, MIN_HELPER_FONT_SIZE, 'bold');
    });
    height += transferCardHeight(doc, block.segment);
    return Math.max(100, height + 12);
  }

  function drawTransferCard(doc, transfer, label, x, y, width) {
    if (!transfer) return 0;
    var height = transferCardHeight(doc, transfer);
    fillRect(doc, x, y, width, height, COLORS.lightBlue, 7, COLORS.border);
    setFont(doc, MIN_HELPER_FONT_SIZE, 'bold', COLORS.blue);
    doc.text(label.toUpperCase(), x + 12, y + 22);
    var summary = (transfer.mode === 'walking' ? 'Walk' : 'Public transport') + ': ' + transfer.minutes + ' min. Allow ' + transfer.bufferMinutes + ' extra minutes. ' + transfer.fromLabel + ' to ' + transfer.toLabel + '.';
    var cursor = y + 43;
    cursor += drawText(doc, summary, x + 12, cursor, width - 24, 10, 'bold', COLORS.darkGreen);
    if (transfer.instruction) {
      cursor += 6;
      cursor += drawText(doc, transfer.instruction, x + 12, cursor, width - 24, BODY_FONT_SIZE, 'normal', COLORS.muted);
    }
    if (transfer.link) {
      cursor += 7;
      drawLink(doc, transfer.link, x + 12, cursor, width - 24, { size: MIN_HELPER_FONT_SIZE });
    }
    return height;
  }

  function drawDay(doc, page) {
    var kicker = 'Day ' + page.dayNumber + ' of your plan';
    if (page.partCount > 1) kicker += ' - part ' + page.partNumber + ' of ' + page.partCount;
    var y = drawHeader(doc, kicker, page.title, [page.date, page.area, page.movement].filter(Boolean).join(' | '));
    if (page.partNumber === 1) {
      var weatherHeight = textHeight(doc, page.weather, PAGE_WIDTH - MARGIN * 2 - 28, BODY_FONT_SIZE, 'normal');
      var routeHeight = textHeight(doc, 'Daily route: ' + page.route.label, PAGE_WIDTH - MARGIN * 2 - 28, MIN_HELPER_FONT_SIZE, 'bold');
      var weatherCardHeight = 52 + weatherHeight + routeHeight;
      fillRect(doc, MARGIN, y, PAGE_WIDTH - MARGIN * 2, weatherCardHeight, COLORS.lightBlue, 9, COLORS.border);
      setFont(doc, MIN_HELPER_FONT_SIZE, 'bold', COLORS.blue);
      doc.text('WEATHER AND DAILY MAP', MARGIN + 14, y + 25);
      var weatherY = y + 48;
      weatherY += drawText(doc, page.weather, MARGIN + 14, weatherY, PAGE_WIDTH - MARGIN * 2 - 28, BODY_FONT_SIZE, 'normal', COLORS.muted);
      drawLink(doc, page.route, MARGIN + 14, weatherY + 7, PAGE_WIDTH - MARGIN * 2 - 28, { prefix: 'Daily route:', size: MIN_HELPER_FONT_SIZE });
      y += weatherCardHeight + 10;
      if (page.decision) {
        var decisionHeight = textHeight(doc, page.decision, PAGE_WIDTH - MARGIN * 2 - 28, BODY_FONT_SIZE, 'normal');
        var decisionCardHeight = 52 + decisionHeight;
        fillRect(doc, MARGIN, y, PAGE_WIDTH - MARGIN * 2, decisionCardHeight, COLORS.soft, 8, COLORS.border);
        setFont(doc, MIN_HELPER_FONT_SIZE, 'bold', COLORS.green);
        doc.text('WHY THIS DAY', MARGIN + 14, y + 25);
        drawText(doc, page.decision, MARGIN + 14, y + 49, PAGE_WIDTH - MARGIN * 2 - 28, BODY_FONT_SIZE, 'normal', COLORS.muted);
        y += decisionCardHeight + 10;
      }
    }
    page.blocks.forEach(function (block, index) {
      if (block.transfer) {
        y += drawTransferCard(doc, block.transfer, 'Travel from the previous stop', MARGIN, y, PAGE_WIDTH - MARGIN * 2) + 8;
      }
      var cardHeight = blockCardHeight(doc, block);
      fillRect(doc, MARGIN, y, PAGE_WIDTH - MARGIN * 2, cardHeight, index % 2 ? COLORS.white : COLORS.cream, 8, COLORS.border);
      fillRect(doc, MARGIN + 12, y + 12, 86, 28, block.kind === 'transfer' ? COLORS.blue : COLORS.green, 6, block.kind === 'transfer' ? COLORS.blue : COLORS.green);
      setFont(doc, MIN_HELPER_FONT_SIZE, 'bold', COLORS.yellow);
      doc.text(cleanText(block.time, 24).toUpperCase(), MARGIN + 55, y + 31, { align: 'center' });
      var cursor = y + 31;
      cursor += drawText(doc, block.title, MARGIN + 112, cursor, 382, 13, 'bold', COLORS.darkGreen);
      cursor = Math.max(cursor + 8, y + 56);
      if (block.detail) cursor += drawText(doc, block.detail, MARGIN + 16, cursor, PAGE_WIDTH - MARGIN * 2 - 32, BODY_FONT_SIZE, 'normal', COLORS.muted) + 8;
      var blockLinks = block.links && block.links.length ? block.links : (block.link ? [block.link] : []);
      blockLinks.forEach(function (link, linkIndex) {
        cursor += drawLink(doc, link, MARGIN + 16, cursor, PAGE_WIDTH - MARGIN * 2 - 32, {
          prefix: block.mealRole ? 'Option ' + (linkIndex + 1) + ':' : 'Map:',
          size: MIN_HELPER_FONT_SIZE
        }) + 8;
      });
      if (block.segment) cursor += drawTransferCard(doc, block.segment, 'Travel for this step', MARGIN + 16, cursor, PAGE_WIDTH - MARGIN * 2 - 32) + 8;
      y += cardHeight + 10;
    });
    assertContentFits(y, 'day ' + page.dayNumber + ' part ' + page.partNumber);
  }

  function drawWeatherPlanB(doc, page) {
    var truth = page.mode === 'live'
      ? 'Every row uses live forecast data where available.'
      : page.mode === 'mixed'
        ? 'Some dates use a live forecast. Later dates show typical conditions and are not forecasts.'
        : 'These are typical seasonal conditions, not a forecast.';
    var sourceLine = page.checkedAt
      ? 'Weather source checked ' + page.checkedAt + '. ' + truth
      : truth;
    var kicker = 'Practical checks';
    if (page.partCount > 1) kicker += ' - part ' + page.partNumber + ' of ' + page.partCount;
    var y = drawHeader(doc, kicker, page.title, sourceLine);
    page.days.forEach(function (day, index) {
      var contentWidth = PAGE_WIDTH - MARGIN * 2 - 92;
      var titleHeight = textHeight(doc, day.date + ' | ' + day.title, contentWidth, 11, 'bold');
      var weatherHeight = textHeight(doc, day.weather, contentWidth, BODY_FONT_SIZE, 'normal');
      var openingHeight = textHeight(doc, 'Opening: ' + day.opening, contentWidth, BODY_FONT_SIZE, 'normal');
      var planBHeight = textHeight(doc, 'Plan B: ' + day.planB, contentWidth, BODY_FONT_SIZE, 'bold');
      var reservationHeight = day.reservation ? textHeight(doc, day.reservation.label, contentWidth, MIN_HELPER_FONT_SIZE, 'bold') + 8 : 0;
      var rowHeight = 42 + titleHeight + weatherHeight + openingHeight + planBHeight + reservationHeight;
      fillRect(doc, MARGIN, y, PAGE_WIDTH - MARGIN * 2, rowHeight, index % 2 ? COLORS.white : COLORS.soft, 8, COLORS.border);
      fillRect(doc, MARGIN, y, 64, rowHeight, day.weatherKind === 'live' ? COLORS.blue : COLORS.green, 8, day.weatherKind === 'live' ? COLORS.blue : COLORS.green);
      setFont(doc, MIN_HELPER_FONT_SIZE, 'bold', COLORS.white);
      doc.text('DAY ' + day.dayNumber, MARGIN + 32, y + 28, { align: 'center' });
      doc.text(day.weatherKind === 'live' ? 'FORECAST' : 'TYPICAL', MARGIN + 32, y + 48, { align: 'center' });
      var x = MARGIN + 78;
      var cursor = y + 25;
      cursor += drawText(doc, day.date + ' | ' + day.title, x, cursor, contentWidth, 11, 'bold', COLORS.darkGreen) + 8;
      cursor += drawText(doc, day.weather, x, cursor, contentWidth, BODY_FONT_SIZE, 'normal', COLORS.muted) + 8;
      cursor += drawText(doc, 'Opening: ' + day.opening, x, cursor, contentWidth, BODY_FONT_SIZE, 'normal', COLORS.muted) + 8;
      cursor += drawText(doc, 'Plan B: ' + day.planB, x, cursor, contentWidth, BODY_FONT_SIZE, 'bold', COLORS.darkGreen);
      if (day.reservation) drawLink(doc, day.reservation, x, cursor + 8, contentWidth, { prefix: 'Official booking:', size: MIN_HELPER_FONT_SIZE });
      y += rowHeight + 10;
    });
    assertContentFits(y, 'weather and Plan B');
  }

  function drawCarry(doc, page) {
    var kicker = 'Save your plan';
    if (page.partCount > 1) kicker += ' - part ' + page.partNumber + ' of ' + page.partCount;
    var y = drawHeader(doc, kicker, 'Use your plan on your phone or as a PDF', 'The phone plan and this PDF show the same stops in the same order.');
    if (page.partNumber === 1) {
      fillRect(doc, MARGIN, y, PAGE_WIDTH - MARGIN * 2, 82, COLORS.yellow, 10, COLORS.yellow);
      setFont(doc, MIN_HELPER_FONT_SIZE, 'bold', COLORS.darkGreen);
      doc.text('SAME PLAN, TWO WAYS TO USE IT', MARGIN + 16, y + 27);
      drawText(doc, 'Phone: live map links and times. PDF: the saved plan works offline, but map links still need data.', MARGIN + 16, y + 53, PAGE_WIDTH - MARGIN * 2 - 32, BODY_FONT_SIZE, 'bold', COLORS.darkGreen);
      y += 96;
    }
    if (!page.items.length) {
      fillRect(doc, MARGIN, y, PAGE_WIDTH - MARGIN * 2, 74, COLORS.white, 8, COLORS.border);
      drawText(doc, 'No extra preparation is needed for this plan.', MARGIN + 16, y + 38, PAGE_WIDTH - MARGIN * 2 - 32, BODY_FONT_SIZE, 'normal', COLORS.muted);
      y += 86;
    }
    var previousSection = '';
    page.items.forEach(function (item) {
      if (item.section !== previousSection) {
        setFont(doc, MIN_HELPER_FONT_SIZE, 'bold', item.section === 'Before you go' ? COLORS.green : COLORS.blue);
        doc.text(item.section.toUpperCase(), MARGIN, y + 10);
        y += 26;
        previousSection = item.section;
      }
      var titleHeight = textHeight(doc, item.title, PAGE_WIDTH - MARGIN * 2 - 32, 11, 'bold');
      var detailHeight = textHeight(doc, item.detail, PAGE_WIDTH - MARGIN * 2 - 32, BODY_FONT_SIZE, 'normal');
      var linkHeight = item.link ? textHeight(doc, item.link.label, PAGE_WIDTH - MARGIN * 2 - 32, MIN_HELPER_FONT_SIZE, 'bold') + 8 : 0;
      var height = 38 + titleHeight + detailHeight + linkHeight;
      fillRect(doc, MARGIN, y, PAGE_WIDTH - MARGIN * 2, height, COLORS.white, 8, COLORS.border);
      var cursor = y + 27;
      cursor += drawText(doc, item.title, MARGIN + 16, cursor, PAGE_WIDTH - MARGIN * 2 - 32, 11, 'bold', COLORS.darkGreen) + 7;
      cursor += drawText(doc, item.detail, MARGIN + 16, cursor, PAGE_WIDTH - MARGIN * 2 - 32, BODY_FONT_SIZE, 'normal', COLORS.muted);
      if (item.link) drawLink(doc, item.link, MARGIN + 16, cursor + 8, PAGE_WIDTH - MARGIN * 2 - 32, { prefix: 'Open:', size: MIN_HELPER_FONT_SIZE });
      y += height + 10;
    });
    if (page.isLastPart) {
      var supportHeight = 78;
      fillRect(doc, MARGIN, y, PAGE_WIDTH - MARGIN * 2, supportHeight, COLORS.darkGreen, 10, COLORS.darkGreen);
      setFont(doc, MIN_HELPER_FONT_SIZE, 'bold', COLORS.yellow);
      doc.text('BERLINWALK SUPPORT', MARGIN + 16, y + 27);
      drawText(doc, 'Save the browser-plan link with this PDF. For help, visit berlinwalk.com.', MARGIN + 16, y + 52, 355, BODY_FONT_SIZE, 'normal', COLORS.white);
      drawLink(doc, page.support, PAGE_WIDTH - MARGIN - 125, y + 52, 111, { size: MIN_HELPER_FONT_SIZE, color: COLORS.yellow });
      y += supportHeight + 10;
    }
    assertContentFits(y, 'carry page');
  }

  function drawPage(doc, page, options) {
    setColor(doc, 'setFillColor', COLORS.cream);
    doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F');
    if (page.type === 'cover') drawCover(doc, page, options);
    else if (page.type === 'overview') drawOverview(doc, page);
    else if (page.type === 'overview-days') drawOverviewDays(doc, page);
    else if (page.type === 'overview-notes') drawOverviewNotes(doc, page);
    else if (page.type === 'day') drawDay(doc, page);
    else if (page.type === 'weather-plan-b') drawWeatherPlanB(doc, page);
    else if (page.type === 'carry-support') drawCarry(doc, page);
    else throw new Error('Unknown PDF page type: ' + page.type);
  }

  function renderPagePlan(jsPdfTarget, pagePlan, options) {
    options = options || {};
    var errors = validatePagePlan(pagePlan);
    if (errors.length) throw new Error('Cannot render invalid PDF page plan: ' + errors.join('; '));
    var doc = makePdf(jsPdfTarget);
    if (typeof doc.setProperties === 'function') {
      doc.setProperties({
        title: cleanText(pagePlan.pages[0].title, 200),
        subject: 'BerlinWalk personalised Berlin trip plan',
        author: 'BerlinWalk',
        creator: RENDERER_VERSION,
        keywords: 'Berlin, trip plan, itinerary'
      });
    }
    var languageApplied = false;
    if (typeof doc.setLanguage === 'function') {
      doc.setLanguage('en-GB');
      languageApplied = true;
    }
    var viewerPreferencesApplied = false;
    if (typeof doc.viewerPreferences === 'function') {
      doc.viewerPreferences({ DisplayDocTitle: true, Direction: 'L2R', PrintScaling: 'None' });
      viewerPreferencesApplied = true;
    }
    var metadataApplied = false;
    if (typeof doc.addMetadata === 'function') {
      doc.addMetadata('<rdf:Description xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:language>en-GB</dc:language><dc:title>' + escapeXml(pagePlan.pages[0].title) + '</dc:title></rdf:Description>', 'BerlinWalk');
      metadataApplied = true;
    }
    pagePlan.pages.forEach(function (page, index) {
      if (index > 0) doc.addPage('a4', 'portrait');
      drawPage(doc, page, options);
      drawFooter(doc, page.pageNumber, pagePlan.pageCount);
    });
    var bookmarkCount = 0;
    if (doc.outline && typeof doc.outline.add === 'function') {
      pagePlan.pages.forEach(function (page, index) {
        var label = page.type === 'day'
          ? 'Day ' + page.dayNumber + ': ' + page.title + (page.partCount > 1 ? ' (' + page.partNumber + '/' + page.partCount + ')' : '')
          : cleanText(page.title || page.type, 180) + (page.partCount > 1 ? ' (' + page.partNumber + '/' + page.partCount + ')' : '');
        doc.outline.add(null, label, { pageNumber: index + 1 });
        bookmarkCount += 1;
      });
    }
    var actualPages = typeof doc.getNumberOfPages === 'function' ? doc.getNumberOfPages() : pagePlan.pageCount;
    if (actualPages !== pagePlan.pageCount) {
      throw new Error('PDF page count mismatch: expected ' + pagePlan.pageCount + ', received ' + actualPages + '.');
    }
    if (options.save === true) doc.save(cleanText(options.fileName || pagePlan.fileName, 180));
    return {
      doc: doc,
      pagePlan: clone(pagePlan),
      pageCount: actualPages,
      fileName: cleanText(options.fileName || pagePlan.fileName, 180),
      accessibility: {
        language: languageApplied ? 'en-GB' : '',
        viewerPreferences: viewerPreferencesApplied,
        metadata: metadataApplied,
        readingOrder: 'Content is emitted in visual reading order with one bookmark per page.',
        bookmarkCount: bookmarkCount,
        tagged: false,
        limitation: ACCESSIBILITY_LIMITATION
      }
    };
  }

  function renderPdf(jsPdfTarget, source, weatherSource, options) {
    var weather = weatherSource;
    var settings = options || {};
    if (weatherSource && !weatherSource.days && (Object.prototype.hasOwnProperty.call(weatherSource, 'save') || weatherSource.fileName)) {
      settings = weatherSource;
      weather = null;
    }
    var pagePlan = createPagePlan(source, weather);
    return renderPagePlan(jsPdfTarget, pagePlan, settings);
  }

  return {
    PDF_SCHEMA_VERSION: PDF_SCHEMA_VERSION,
    RENDERER_VERSION: RENDERER_VERSION,
    PAGE_WIDTH: PAGE_WIDTH,
    PAGE_HEIGHT: PAGE_HEIGHT,
    MIN_HELPER_FONT_SIZE: MIN_HELPER_FONT_SIZE,
    BODY_FONT_SIZE: BODY_FONT_SIZE,
    ACCESSIBILITY_LIMITATION: ACCESSIBILITY_LIMITATION,
    cleanText: cleanText,
    validateExternalUrl: validateExternalUrl,
    createPagePlan: createPagePlan,
    validatePagePlan: validatePagePlan,
    renderPagePlan: renderPagePlan,
    renderPdf: renderPdf
  };
});
