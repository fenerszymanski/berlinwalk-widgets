(function (globalScope, factory) {
  var artifactApi = globalScope && globalScope.BWPlanArtifactV3;
  if (!artifactApi && typeof module === 'object' && module.exports && typeof require === 'function') {
    artifactApi = require('./plan-artifact-v3.js');
  }
  var api = factory(artifactApi);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (globalScope) globalScope.BWPlanArtifactPdfV3 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (ArtifactV3) {
  'use strict';

  var PDF_SCHEMA_VERSION = '3.0.0';
  var RENDERER_VERSION = 'plan-artifact-v3-pdf-3.4.0-readable-routes';
  var PAGE_WIDTH = 595.28;
  var PAGE_HEIGHT = 841.89;
  var MARGIN = 40;
  var FOOTER_Y = 813;
  var MAX_DAY_BLOCKS_PER_PAGE = 5;
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
      guideNote: cleanText(view.decisionReceipt.guideNote || view.trip.summary, 1000),
      summary: cleanText(view.trip.summary, 1000),
      links: []
    };
  }

  function buildOverviewPage(view) {
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
    return {
      type: 'overview',
      title: 'Plan at a glance',
      headline: cleanText(view.decisionReceipt.headline || view.trip.title, 240),
      reasons: (view.decisionReceipt.reasons || []).slice(0, 6).map(function (item) { return cleanText(item, 300); }),
      ticket: cleanText(view.trip.ticket, 500),
      tourFit: cleanText(view.trip.tourFit, 500),
      days: rows,
      links: rows.map(function (row) { return row.route; })
    };
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
        var link = (block.links || []).map(function (item) { return safeLink(item, 'Open map'); }).filter(Boolean)[0] || null;
        var transfer = block.transferFromPrevious || null;
        var segment = block.transferSegment || null;
        function transferData(value, label) {
          if (!value) return null;
          return {
            fromPlaceId: cleanText(value.fromPlaceId, 100),
            fromLabel: cleanText(value.fromLabel, 160),
            toPlaceId: cleanText(value.toPlaceId, 100),
            toLabel: cleanText(value.toLabel, 160),
            mode: cleanText(value.mode, 20),
            minutes: Number(value.minutes) || 0,
            bufferMinutes: Number(value.bufferMinutes) || 0,
            totalMinutes: Number(value.totalMinutes) || 0,
            instruction: cleanText(value.instruction, 360),
            link: safeLink({ label: label, url: value.url, kind: 'transfer' }, label)
          };
        }
        return {
          kind: cleanText(block.kind || 'activity', 20),
          time: cleanText(block.window || block.time || 'Next', 80),
          window: cleanText(block.window, 80),
          title: cleanText(block.title, 180),
          detail: cleanText(block.detail, 700),
          placeId: cleanText(block.placeId, 100),
          link: link,
          transfer: transferData(transfer, 'Open transfer'),
          segment: transferData(segment, 'Open journey')
        };
      }),
      links: links
    };
  }

  function buildDayPages(day) {
    var fullPage = buildDayPage(day);
    var blocks = fullPage.blocks.length ? fullPage.blocks : [];
    var partCount = Math.max(1, Math.ceil(blocks.length / MAX_DAY_BLOCKS_PER_PAGE));
    var blocksPerPart = Math.max(1, Math.ceil(blocks.length / partCount));
    return Array.from({ length: partCount }, function (_, index) {
      var blockStart = index * blocksPerPart;
      return Object.assign({}, fullPage, {
        blocks: blocks.slice(blockStart, blockStart + blocksPerPart),
        blockStart: blockStart,
        partNumber: index + 1,
        partCount: partCount
      });
    });
  }

  function buildWeatherPage(view) {
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
    return {
      type: 'weather-plan-b',
      title: 'Weather, openings and Plan B',
      generatedAt: cleanText(view.weather && view.weather.generatedAt, 40),
      checkedAt: formatCheckedAt(view.weather && view.weather.generatedAt),
      source: cleanText(view.weather && view.weather.source || '', 80),
      mode: cleanText(view.weather && view.weather.mode || 'typical', 20),
      days: rows,
      links: rows.map(function (row) { return row.reservation; }).filter(Boolean)
    };
  }

  function buildCarryPage(view) {
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
    return {
      type: 'carry-support',
      title: 'Save your plan on your phone and as a PDF',
      beforeYouGo: before,
      carryPack: carry,
      support: site,
      links: before.concat(carry).map(function (item) { return item.link; }).filter(Boolean).concat([site])
    };
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
    if (pages.length < dayCount + 4) errors.push('page_count');
    if (!pages[0] || pages[0].type !== 'cover') errors.push('cover_page');
    if (!pages[1] || pages[1].type !== 'overview') errors.push('overview_page');
    var dayPages = pages.filter(function (page) { return page.type === 'day'; });
    if (dayPages.length < dayCount) errors.push('day_pages');
    if (!pages[pages.length - 2] || pages[pages.length - 2].type !== 'weather-plan-b') errors.push('weather_page');
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
    var dayPages = view.days.reduce(function (pages, day) {
      return pages.concat(buildDayPages(day));
    }, []);
    var pages = [buildCoverPage(view), buildOverviewPage(view)]
      .concat(dayPages)
      .concat([buildWeatherPage(view), buildCarryPage(view)]);
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
      dayPageCount: dayPages.length,
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

  function fitLines(doc, value, width, size, style, maxLines) {
    setFont(doc, size, style || 'normal', COLORS.text);
    var clean = cleanText(value, 2400);
    var lines = doc.splitTextToSize(clean, width);
    if (!Array.isArray(lines)) lines = [String(lines || '')];
    if (lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      var last = cleanText(lines[lines.length - 1], 500);
      lines[lines.length - 1] = last.replace(/[. ]+$/, '') + '...';
    }
    return lines.length ? lines : [''];
  }

  function drawText(doc, value, x, y, width, size, style, color, maxLines, align) {
    var lines = fitLines(doc, value, width, size, style, maxLines || 2);
    setFont(doc, size, style || 'normal', color || COLORS.text);
    var options = align ? { align: align } : undefined;
    doc.text(lines, x, y, options);
    return lines.length * (size + 3);
  }

  function fillRect(doc, x, y, width, height, fillColor, radius, borderColor) {
    setColor(doc, 'setFillColor', fillColor);
    setColor(doc, 'setDrawColor', borderColor || fillColor);
    if (radius && width >= radius * 2 && height >= radius * 2 && typeof doc.roundedRect === 'function') doc.roundedRect(x, y, width, height, radius, radius, 'FD');
    else doc.rect(x, y, width, height, 'FD');
  }

  function drawLink(doc, link, x, y, width, options) {
    options = options || {};
    if (!link || !validateExternalUrl(link.url)) return;
    var prefix = cleanText(options.prefix || '', 60);
    var label = (prefix ? prefix + ' ' : '') + cleanText(link.label, 140);
    var size = options.size || 7.5;
    var lines = fitLines(doc, label, width, size, 'bold', 1);
    setFont(doc, size, 'bold', options.color || COLORS.blue);
    doc.text(lines[0], x, y);
    if (typeof doc.link === 'function') {
      var measuredWidth = typeof doc.getTextWidth === 'function' ? doc.getTextWidth(lines[0]) : width;
      var linkWidth = Math.max(1, Math.min(width, Number(measuredWidth) || width));
      // Use jsPDF's standard top-left link box. Negative-height rectangles can
      // turn into opaque annotation bands in PDFium on link-heavy pages.
      doc.link(x, y - size, linkWidth, size + 3, { url: link.url });
    }
  }

  function drawHeader(doc, kicker, title, subtitle, options) {
    options = options || {};
    fillRect(doc, 0, 0, PAGE_WIDTH, 8, COLORS.yellow);
    setFont(doc, 9, 'bold', COLORS.green);
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
    drawText(doc, title, MARGIN, 70, PAGE_WIDTH - MARGIN * 2, titleSize, 'bold', COLORS.darkGreen, options.singleLineTitle ? 1 : 2);
    if (subtitle) drawText(doc, subtitle, MARGIN, 102, PAGE_WIDTH - MARGIN * 2, 10, 'normal', COLORS.muted, 2);
  }

  function drawFooter(doc, pageNumber, pageCount) {
    setColor(doc, 'setDrawColor', COLORS.border);
    doc.line(MARGIN, FOOTER_Y - 12, PAGE_WIDTH - MARGIN, FOOTER_Y - 12);
    setFont(doc, 8.2, 'bold', COLORS.green);
    doc.text('berlinwalk.com | @berlinwalkingtour', MARGIN, FOOTER_Y + 4);
    doc.text('Page ' + pageNumber + ' / ' + pageCount, PAGE_WIDTH - MARGIN, FOOTER_Y + 4, { align: 'right' });
  }

  function drawCover(doc, page, options) {
    options = options || {};
    fillRect(doc, 0, 0, PAGE_WIDTH, 272, COLORS.green);
    fillRect(doc, 0, 268, PAGE_WIDTH, 4, COLORS.yellow);
    if (options.logoDataUrl && typeof doc.addImage === 'function') {
      doc.addImage(options.logoDataUrl, 'PNG', MARGIN, 40, 166, 34.8);
    } else {
      setFont(doc, 18, 'bold', COLORS.yellow);
      doc.text('BerlinWalk', MARGIN, 66);
    }
    setFont(doc, 9.5, 'bold', COLORS.yellow);
    doc.text('PERSONAL TRIP PLAN', MARGIN + 184, 61);
    drawText(doc, page.title, MARGIN, 134, PAGE_WIDTH - MARGIN * 2, 31, 'bold', COLORS.white, 2);
    var facts = page.tripLength + (page.tripLength === 1 ? ' day' : ' days');
    if (page.dateRange) facts += ' | ' + page.dateRange;
    if (page.stayArea) facts += ' | Base: ' + page.stayArea;
    drawText(doc, facts, MARGIN, 224, PAGE_WIDTH - MARGIN * 2, 11, 'normal', COLORS.white, 2);

    fillRect(doc, MARGIN, 304, PAGE_WIDTH - MARGIN * 2, 190, COLORS.white, 12, COLORS.border);
    setFont(doc, 9, 'bold', COLORS.green);
    doc.text('HOW TO USE THIS PLAN', MARGIN + 20, 333);
    drawText(doc, page.guideNote || page.summary, MARGIN + 20, 367, PAGE_WIDTH - MARGIN * 2 - 40, 15, 'bold', COLORS.darkGreen, 4);
    var compact = page.summary && page.summary !== page.guideNote ? page.summary : '';
    if (compact) drawText(doc, compact, MARGIN + 20, 444, PAGE_WIDTH - MARGIN * 2 - 40, 10.2, 'normal', COLORS.muted, 3);

    fillRect(doc, MARGIN, 522, PAGE_WIDTH - MARGIN * 2, 104, COLORS.soft, 12, COLORS.border);
    setFont(doc, 9, 'bold', COLORS.green);
    doc.text('USE THE SAME PLAN ON YOUR PHONE OR AS A PDF', MARGIN + 20, 552);
    fillRect(doc, MARGIN + 20, 570, 205, 40, COLORS.white, 8, COLORS.border);
    fillRect(doc, MARGIN + 238, 570, 237, 40, COLORS.white, 8, COLORS.border);
    setFont(doc, 10.2, 'bold', COLORS.darkGreen);
    doc.text('Phone: maps and times', MARGIN + 33, 595);
    doc.text('PDF: your plan works offline', MARGIN + 251, 595);

    fillRect(doc, MARGIN, 658, PAGE_WIDTH - MARGIN * 2, 92, COLORS.yellow, 10, COLORS.yellow);
    setFont(doc, 9, 'bold', COLORS.darkGreen);
    doc.text('START HERE', MARGIN + 18, 684);
    drawText(doc, 'Read the overview first. Then use one day page at a time. Weather, opening checks and Plan B are near the end.', MARGIN + 18, 708, PAGE_WIDTH - MARGIN * 2 - 36, 11.5, 'bold', COLORS.darkGreen, 3);
  }

  function drawOverview(doc, page) {
    drawHeader(doc, 'Your plan', page.title, page.headline);
    fillRect(doc, MARGIN, 126, PAGE_WIDTH - MARGIN * 2, 110, COLORS.soft, 10, COLORS.border);
    setFont(doc, 9.2, 'bold', COLORS.green);
    doc.text('WHY THIS ORDER', MARGIN + 16, 151);
    var reasons = page.reasons.length ? page.reasons : ['Each day covers one part of Berlin.'];
    reasons.slice(0, 4).forEach(function (reason, index) {
      setFont(doc, 9.2, 'bold', COLORS.darkGreen);
      doc.text(String(index + 1), MARGIN + 18, 177 + index * 15);
      drawText(doc, reason, MARGIN + 36, 177 + index * 15, PAGE_WIDTH - MARGIN * 2 - 52, 9.2, 'normal', COLORS.muted, 1);
    });

    var top = 252;
    var gap = 6;
    var available = 394;
    var rowHeight = Math.min(52, Math.floor((available - Math.max(0, page.days.length - 1) * gap) / page.days.length));
    page.days.forEach(function (day, index) {
      var y = top + index * (rowHeight + gap);
      fillRect(doc, MARGIN, y, PAGE_WIDTH - MARGIN * 2, rowHeight, COLORS.white, 8, COLORS.border);
      fillRect(doc, MARGIN, y, 46, rowHeight, index % 2 ? COLORS.green : COLORS.darkGreen, 8, index % 2 ? COLORS.green : COLORS.darkGreen);
      setFont(doc, 8.2, 'bold', COLORS.yellow);
      doc.text('DAY', MARGIN + 23, y + 17, { align: 'center' });
      setFont(doc, 14.5, 'bold', COLORS.white);
      doc.text(String(day.dayNumber), MARGIN + 23, y + 36, { align: 'center' });
      drawText(doc, day.title, MARGIN + 60, y + 18, 252, 10.8, 'bold', COLORS.darkGreen, 1);
      drawText(doc, [day.date, day.area, day.movement].filter(Boolean).join(' | '), MARGIN + 60, y + 37, 305, 8.8, 'normal', COLORS.muted, 1);
      drawLink(doc, day.route, PAGE_WIDTH - MARGIN - 118, y + rowHeight / 2 + 3, 104, { prefix: 'Map: ', size: 8.2 });
    });

    var noteY = 668;
    var colWidth = (PAGE_WIDTH - MARGIN * 2 - 10) / 2;
    fillRect(doc, MARGIN, noteY, colWidth, 112, COLORS.lightBlue, 9, COLORS.border);
    fillRect(doc, MARGIN + colWidth + 10, noteY, colWidth, 112, COLORS.lightAmber, 9, COLORS.border);
    setFont(doc, 9, 'bold', COLORS.blue);
    doc.text('TRANSPORT NOTE', MARGIN + 14, noteY + 23);
    drawText(doc, page.ticket || 'Use the ticket note shown in your phone plan before the first ride.', MARGIN + 14, noteY + 47, colWidth - 28, 8.8, 'normal', COLORS.muted, 4);
    setFont(doc, 9, 'bold', COLORS.amber);
    doc.text('TOUR TIME', MARGIN + colWidth + 24, noteY + 23);
    drawText(doc, page.tourFit || 'Visit the historic centre on one day. This avoids an extra trip across Berlin.', MARGIN + colWidth + 24, noteY + 47, colWidth - 28, 8.8, 'normal', COLORS.muted, 4);
  }

  function drawDay(doc, page) {
    var kicker = 'Day ' + page.dayNumber + ' of your plan';
    if (page.partCount > 1) kicker += ' - part ' + page.partNumber + ' of ' + page.partCount;
    drawHeader(doc, kicker, page.title, [page.date, page.area, page.movement].filter(Boolean).join(' | '), { singleLineTitle: true });
    fillRect(doc, MARGIN, 126, PAGE_WIDTH - MARGIN * 2, 66, COLORS.lightBlue, 9, COLORS.border);
    setFont(doc, 8.5, 'bold', COLORS.blue);
    doc.text('WEATHER', MARGIN + 14, 149);
    drawText(doc, page.weather, MARGIN + 14, 171, PAGE_WIDTH - MARGIN * 2 - 154, 9, 'normal', COLORS.muted, 2);
    drawLink(doc, page.route, PAGE_WIDTH - MARGIN - 132, 158, 118, { prefix: 'Route: ', size: 8 });

    if (page.decision) {
      fillRect(doc, MARGIN, 202, PAGE_WIDTH - MARGIN * 2, 50, COLORS.soft, 8, COLORS.border);
      setFont(doc, 8.2, 'bold', COLORS.green);
      doc.text('WHY THIS DAY', MARGIN + 12, 222);
      drawText(doc, page.decision, MARGIN + 92, 222, PAGE_WIDTH - MARGIN * 2 - 106, 9, 'normal', COLORS.muted, 2);
    }

    var startY = page.decision ? 266 : 208;
    var endY = 777;
    var blocks = page.blocks;
    var gap = 8;
    var available = endY - startY - Math.max(0, blocks.length - 1) * gap;
    var rowHeight = Math.max(78, Math.min(150, Math.floor(available / Math.max(1, blocks.length))));
    var timeSize = 9.2;
    var titleSize = 12.5;
    var detailSize = 10.5;
    var linkSize = 8.4;
    var transferSize = 8.3;
    blocks.forEach(function (block, index) {
      var y = startY + index * (rowHeight + gap);
      fillRect(doc, MARGIN, y, PAGE_WIDTH - MARGIN * 2, rowHeight, index % 2 ? COLORS.white : COLORS.cream, 8, COLORS.border);
      fillRect(doc, MARGIN + 10, y + 9, 66, Math.min(28, rowHeight - 16), block.kind === 'transfer' ? COLORS.blue : COLORS.green, 6, block.kind === 'transfer' ? COLORS.blue : COLORS.green);
      setFont(doc, timeSize, 'bold', COLORS.yellow);
      doc.text(cleanText(block.time, 20).toUpperCase(), MARGIN + 43, y + Math.min(27, rowHeight / 2 + 3), { align: 'center' });
      var textX = MARGIN + 90;
      var titleHeight = drawText(doc, block.title, textX, y + 20, 278, titleSize, 'bold', COLORS.darkGreen, 2);
      var titleLineCount = Math.max(1, Math.round(titleHeight / (titleSize + 3)));
      var blockDetailLines = block.transfer && block.segment
        ? (rowHeight >= 120 ? 2 : 1)
        : (rowHeight >= 120 ? 4 : (titleLineCount === 1 && rowHeight >= 92 ? 3 : 2));
      if (block.detail) drawText(doc, block.detail, textX, y + 23 + titleHeight, 340, detailSize, 'normal', COLORS.muted, blockDetailLines);
      if (block.link && rowHeight >= 48) drawLink(doc, block.link, PAGE_WIDTH - MARGIN - 116, y + 19, 102, { prefix: 'Map: ', size: linkSize });
      var primaryTransfer = block.segment || block.transfer;
      if (primaryTransfer && rowHeight >= 58) {
        var transferMode = primaryTransfer.mode === 'walking' ? 'WALK' : 'TRANSIT';
        var transferPrefix = block.segment ? 'JOURNEY' : 'TRAVEL';
        var transferText = transferPrefix + ': ' + transferMode + ' ' + primaryTransfer.minutes + ' MIN + ' + primaryTransfer.bufferMinutes + ' MIN BUFFER | ' + primaryTransfer.fromLabel + ' -> ' + primaryTransfer.toLabel;
        drawText(doc, transferText, textX, y + rowHeight - 11, 330, transferSize, 'bold', COLORS.blue, 1);
        if (primaryTransfer.link) drawLink(doc, primaryTransfer.link, PAGE_WIDTH - MARGIN - 92, y + rowHeight - 11, 78, { prefix: '', size: 8, color: COLORS.blue });
      }
      if (block.segment && block.transfer && rowHeight >= 68) {
        var accessMode = block.transfer.mode === 'walking' ? 'WALK' : 'TRANSIT';
        var accessText = 'GET THERE: ' + accessMode + ' ' + block.transfer.minutes + ' MIN + ' + block.transfer.bufferMinutes + ' MIN BUFFER | ' + block.transfer.fromLabel + ' -> ' + block.transfer.toLabel;
        drawText(doc, accessText, textX, y + rowHeight - 25, 408, 8.1, 'bold', COLORS.blue, 1);
      }
    });
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
    drawHeader(doc, 'Practical checks', page.title, sourceLine);
    var top = 130;
    var gap = 7;
    var available = 638;
    var rowHeight = Math.min(88, Math.floor((available - Math.max(0, page.days.length - 1) * gap) / page.days.length));
    var planLines = rowHeight >= 78 ? 2 : 1;
    page.days.forEach(function (day, index) {
      var y = top + index * (rowHeight + gap);
      fillRect(doc, MARGIN, y, PAGE_WIDTH - MARGIN * 2, rowHeight, COLORS.white, 8, COLORS.border);
      fillRect(doc, MARGIN, y, 50, rowHeight, day.weatherKind === 'live' ? COLORS.blue : COLORS.green, 8, day.weatherKind === 'live' ? COLORS.blue : COLORS.green);
      setFont(doc, 8.2, 'bold', COLORS.white);
      doc.text('DAY ' + day.dayNumber, MARGIN + 25, y + 21, { align: 'center' });
      setFont(doc, 8, 'bold', COLORS.white);
      doc.text(day.weatherKind === 'live' ? 'FORECAST' : 'TYPICAL', MARGIN + 25, y + 38, { align: 'center' });
      var x = MARGIN + 64;
      drawText(doc, day.date + ' | ' + day.title, x, y + 18, 360, 9.2, 'bold', COLORS.darkGreen, 1);
      drawText(doc, day.weather, x, y + 35, 330, 8.5, 'normal', COLORS.muted, 1);
      drawText(doc, 'Opening: ' + day.opening, x, y + 52, 390, 8.5, 'normal', COLORS.muted, 1);
      drawText(doc, 'Plan B: ' + day.planB, x, y + 69, 410, 8.8, 'bold', COLORS.darkGreen, planLines);
      if (day.reservation) drawLink(doc, day.reservation, PAGE_WIDTH - MARGIN - 100, y + 18, 86, { size: 8 });
    });
  }

  function drawCardColumn(doc, title, items, x, y, width, height, accent) {
    setFont(doc, 10, 'bold', accent);
    doc.text(title.toUpperCase(), x, y);
    var top = y + 18;
    var gap = 5;
    var count = Math.max(1, items.length);
    var cardHeight = Math.max(32, Math.min(52, Math.floor((height - 18 - Math.max(0, count - 1) * gap) / count)));
    items.forEach(function (item, index) {
      var cardY = top + index * (cardHeight + gap);
      fillRect(doc, x, cardY, width, cardHeight, COLORS.white, 7, COLORS.border);
      fillRect(doc, x, cardY, 5, cardHeight, accent, 3, accent);
      drawText(doc, item.title, x + 14, cardY + 17, width - 28, items.length > 8 ? 8.5 : 9.6, 'bold', COLORS.darkGreen, 1);
      if (cardHeight >= 40) {
        drawText(doc, item.detail, x + 14, cardY + 34, item.link ? width - 110 : width - 28, items.length > 8 ? 8 : 8.7, 'normal', COLORS.muted, 1);
      }
      if (item.link) drawLink(doc, item.link, x + width - 82, cardY + cardHeight - 9, 68, { size: 8 });
    });
    if (!items.length) {
      fillRect(doc, x, top, width, 54, COLORS.white, 7, COLORS.border);
      drawText(doc, 'No extra action is needed here.', x + 14, top + 30, width - 28, 8.5, 'normal', COLORS.muted, 1);
    }
  }

  function drawCarry(doc, page) {
    drawHeader(doc, 'Save your plan', 'Use your plan on your phone or as a PDF', 'The phone plan and this PDF show the same stops in the same order.', { singleLineTitle: true });
    fillRect(doc, MARGIN, 122, PAGE_WIDTH - MARGIN * 2, 70, COLORS.yellow, 10, COLORS.yellow);
    setFont(doc, 9, 'bold', COLORS.darkGreen);
    doc.text('SAME PLAN, TWO WAYS TO USE IT', MARGIN + 16, 146);
    drawText(doc, 'Phone: map links and times. PDF: the plan works offline; map links still need data.', MARGIN + 16, 171, PAGE_WIDTH - MARGIN * 2 - 32, 11, 'bold', COLORS.darkGreen, 2);

    var gap = 12;
    var width = (PAGE_WIDTH - MARGIN * 2 - gap) / 2;
    drawCardColumn(doc, 'Before you go', page.beforeYouGo, MARGIN, 225, width, 450, COLORS.green);
    drawCardColumn(doc, 'On your phone', page.carryPack, MARGIN + width + gap, 225, width, 450, COLORS.blue);

    fillRect(doc, MARGIN, 706, PAGE_WIDTH - MARGIN * 2, 66, COLORS.darkGreen, 10, COLORS.darkGreen);
    setFont(doc, 9, 'bold', COLORS.yellow);
    doc.text('BERLINWALK SUPPORT', MARGIN + 16, 730);
    drawText(doc, 'Keep the exact plan link with this PDF. For BerlinWalk information, use the official website.', MARGIN + 16, 752, 370, 9, 'normal', COLORS.white, 2);
    drawLink(doc, page.support, PAGE_WIDTH - MARGIN - 116, 746, 102, { size: 8.5, color: COLORS.yellow });
  }

  function drawPage(doc, page, options) {
    setColor(doc, 'setFillColor', COLORS.cream);
    doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F');
    if (page.type === 'cover') drawCover(doc, page, options);
    else if (page.type === 'overview') drawOverview(doc, page);
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
    pagePlan.pages.forEach(function (page, index) {
      if (index > 0) doc.addPage('a4', 'portrait');
      drawPage(doc, page, options);
      drawFooter(doc, page.pageNumber, pagePlan.pageCount);
    });
    var actualPages = typeof doc.getNumberOfPages === 'function' ? doc.getNumberOfPages() : pagePlan.pageCount;
    if (actualPages !== pagePlan.pageCount) {
      throw new Error('PDF page count mismatch: expected ' + pagePlan.pageCount + ', received ' + actualPages + '.');
    }
    if (options.save === true) doc.save(cleanText(options.fileName || pagePlan.fileName, 180));
    return {
      doc: doc,
      pagePlan: clone(pagePlan),
      pageCount: actualPages,
      fileName: cleanText(options.fileName || pagePlan.fileName, 180)
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
    cleanText: cleanText,
    validateExternalUrl: validateExternalUrl,
    createPagePlan: createPagePlan,
    validatePagePlan: validatePagePlan,
    renderPagePlan: renderPagePlan,
    renderPdf: renderPdf
  };
});
