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
  var RENDERER_VERSION = 'plan-artifact-v3-pdf-1.0.0';
  var PAGE_WIDTH = 595.28;
  var PAGE_HEIGHT = 841.89;
  var MARGIN = 40;
  var FOOTER_Y = 813;
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

  function weatherSummary(day) {
    var weather = day && day.weather;
    if (!weather) return 'Weather data is not available for this date yet.';
    var prefix = weather.kind === 'live' ? 'Live forecast' : 'Typical conditions, not a forecast';
    var measures = [];
    if (Number.isFinite(weather.highC)) measures.push('high ' + Math.round(weather.highC) + ' C');
    if (Number.isFinite(weather.lowC)) measures.push('low ' + Math.round(weather.lowC) + ' C');
    if (Number.isFinite(weather.rainProbability)) measures.push(Math.round(weather.rainProbability) + '% rain');
    var detail = cleanText(weather.title || weather.cue, 240);
    return cleanText(prefix + (measures.length ? ': ' + measures.join(', ') : '') + (detail ? '. ' + detail : ''), 420);
  }

  function openingSummary(day) {
    var parts = [];
    if (day && day.opening && day.opening.status) parts.push(day.opening.status);
    if (day && day.opening && day.opening.warning) parts.push(day.opening.warning);
    if (day && day.reservation && day.reservation.required) parts.push('Reservation required: ' + day.reservation.label);
    if (!parts.length) parts.push('Check official opening hours before leaving your hotel.');
    return cleanText(parts.join('. '), 500);
  }

  function dayLinks(day) {
    var links = [];
    var route = safeLink(day && day.route, 'Open the full day route');
    if (!route) throw new Error('Day ' + (day && day.dayNumber || '?') + ' has no valid HTTPS route URL.');
    links.push(route);
    (day.blocks || []).forEach(function (block) {
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
        return {
          time: cleanText(block.time || block.window || 'Next', 80),
          window: cleanText(block.window, 80),
          title: cleanText(block.title, 180),
          detail: cleanText(block.detail, 700),
          link: link
        };
      }),
      links: links
    };
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
      title: 'One plan on your phone and on paper',
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
    if (pages.length !== dayCount + 4) errors.push('page_count');
    if (!pages[0] || pages[0].type !== 'cover') errors.push('cover_page');
    if (!pages[1] || pages[1].type !== 'overview') errors.push('overview_page');
    var dayPages = pages.filter(function (page) { return page.type === 'day'; });
    if (dayPages.length !== dayCount) errors.push('day_pages');
    if (!pages[dayCount + 2] || pages[dayCount + 2].type !== 'weather-plan-b') errors.push('weather_page');
    if (!pages[dayCount + 3] || pages[dayCount + 3].type !== 'carry-support') errors.push('carry_page');
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
    return 'berlinwalk-plan-' + (date || 'berlin') + '-' + view.days.length + '-days.pdf';
  }

  function createPagePlan(source, weatherSource) {
    var view = toViewModel(source, weatherSource);
    var pages = [buildCoverPage(view), buildOverviewPage(view)]
      .concat(view.days.map(buildDayPage))
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
      dayCount: view.days.length,
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
    var label = cleanText(options.prefix || '', 60) + cleanText(link.label, 140);
    var size = options.size || 7.5;
    var lines = fitLines(doc, label, width, size, 'bold', 1);
    setFont(doc, size, 'bold', options.color || COLORS.blue);
    if (typeof doc.textWithLink === 'function') doc.textWithLink(lines[0], x, y, { url: link.url });
    else doc.text(lines[0], x, y);
  }

  function drawHeader(doc, kicker, title, subtitle) {
    fillRect(doc, 0, 0, PAGE_WIDTH, 8, COLORS.yellow);
    setFont(doc, 8, 'bold', COLORS.green);
    doc.text(cleanText(kicker, 80).toUpperCase(), MARGIN, 40);
    drawText(doc, title, MARGIN, 68, PAGE_WIDTH - MARGIN * 2, 23, 'bold', COLORS.darkGreen, 2);
    if (subtitle) drawText(doc, subtitle, MARGIN, 98, PAGE_WIDTH - MARGIN * 2, 8.5, 'normal', COLORS.muted, 2);
  }

  function drawFooter(doc, pageNumber, pageCount) {
    setColor(doc, 'setDrawColor', COLORS.border);
    doc.line(MARGIN, FOOTER_Y - 12, PAGE_WIDTH - MARGIN, FOOTER_Y - 12);
    setFont(doc, 7.5, 'bold', COLORS.green);
    doc.text('berlinwalk.com | @berlinwalkingtour', MARGIN, FOOTER_Y + 4);
    doc.text('Page ' + pageNumber + ' / ' + pageCount, PAGE_WIDTH - MARGIN, FOOTER_Y + 4, { align: 'right' });
  }

  function drawCover(doc, page) {
    fillRect(doc, 0, 0, PAGE_WIDTH, 255, COLORS.green);
    fillRect(doc, 0, 251, PAGE_WIDTH, 4, COLORS.yellow);
    fillRect(doc, MARGIN, 34, 52, 52, COLORS.yellow, 26, COLORS.yellow);
    setFont(doc, 18, 'bold', COLORS.darkGreen);
    doc.text('BW', MARGIN + 26, 68, { align: 'center' });
    setFont(doc, 9, 'bold', COLORS.yellow);
    doc.text('BERLINWALK PERSONAL TRIP PLAN', MARGIN + 68, 48);
    drawText(doc, page.title, MARGIN, 118, PAGE_WIDTH - MARGIN * 2, 29, 'bold', COLORS.white, 2);
    var facts = page.tripLength + (page.tripLength === 1 ? ' day' : ' days');
    if (page.dateRange) facts += ' | ' + page.dateRange;
    if (page.stayArea) facts += ' | Base: ' + page.stayArea;
    drawText(doc, facts, MARGIN, 203, PAGE_WIDTH - MARGIN * 2, 10, 'normal', COLORS.white, 2);

    fillRect(doc, MARGIN, 286, PAGE_WIDTH - MARGIN * 2, 210, COLORS.white, 12, COLORS.border);
    setFont(doc, 8, 'bold', COLORS.green);
    doc.text('WHY THIS PLAN FITS', MARGIN + 20, 316);
    drawText(doc, page.guideNote || page.summary, MARGIN + 20, 352, PAGE_WIDTH - MARGIN * 2 - 40, 13, 'bold', COLORS.darkGreen, 5);
    var compact = page.summary && page.summary !== page.guideNote ? page.summary : '';
    if (compact) drawText(doc, compact, MARGIN + 20, 438, PAGE_WIDTH - MARGIN * 2 - 40, 9, 'normal', COLORS.muted, 3);

    fillRect(doc, MARGIN, 526, PAGE_WIDTH - MARGIN * 2, 100, COLORS.soft, 12, COLORS.border);
    setFont(doc, 9, 'bold', COLORS.green);
    doc.text('SAME PLAN, TWO WAYS TO USE IT', MARGIN + 20, 555);
    fillRect(doc, MARGIN + 20, 572, 205, 36, COLORS.white, 8, COLORS.border);
    fillRect(doc, MARGIN + 238, 572, 237, 36, COLORS.white, 8, COLORS.border);
    setFont(doc, 9, 'bold', COLORS.darkGreen);
    doc.text('Phone plan: maps and daily timing', MARGIN + 33, 594);
    doc.text('PDF plan: printable and offline', MARGIN + 251, 594);

    fillRect(doc, MARGIN, 660, PAGE_WIDTH - MARGIN * 2, 78, COLORS.yellow, 10, COLORS.yellow);
    setFont(doc, 8, 'bold', COLORS.darkGreen);
    doc.text('START HERE', MARGIN + 18, 684);
    drawText(doc, 'Read the overview, then use one day page at a time. Weather, opening checks and every Plan B are grouped near the end.', MARGIN + 18, 705, PAGE_WIDTH - MARGIN * 2 - 36, 10, 'bold', COLORS.darkGreen, 3);
  }

  function drawOverview(doc, page) {
    drawHeader(doc, 'Your route logic', page.title, page.headline);
    fillRect(doc, MARGIN, 122, PAGE_WIDTH - MARGIN * 2, 94, COLORS.soft, 10, COLORS.border);
    setFont(doc, 8, 'bold', COLORS.green);
    doc.text('WHY THESE DAYS ARE IN THIS ORDER', MARGIN + 16, 145);
    var reasons = page.reasons.length ? page.reasons : ['The route keeps each day geographically focused.'];
    reasons.slice(0, 4).forEach(function (reason, index) {
      setFont(doc, 7.8, 'bold', COLORS.darkGreen);
      doc.text(String(index + 1), MARGIN + 18, 168 + index * 12);
      drawText(doc, reason, MARGIN + 34, 168 + index * 12, PAGE_WIDTH - MARGIN * 2 - 50, 7.8, 'normal', COLORS.muted, 1);
    });

    var top = 232;
    var gap = 7;
    var available = 408;
    var rowHeight = Math.min(53, Math.floor((available - Math.max(0, page.days.length - 1) * gap) / page.days.length));
    page.days.forEach(function (day, index) {
      var y = top + index * (rowHeight + gap);
      fillRect(doc, MARGIN, y, PAGE_WIDTH - MARGIN * 2, rowHeight, COLORS.white, 8, COLORS.border);
      fillRect(doc, MARGIN, y, 46, rowHeight, index % 2 ? COLORS.green : COLORS.darkGreen, 8, index % 2 ? COLORS.green : COLORS.darkGreen);
      setFont(doc, 7, 'bold', COLORS.yellow);
      doc.text('DAY', MARGIN + 23, y + 17, { align: 'center' });
      setFont(doc, 13, 'bold', COLORS.white);
      doc.text(String(day.dayNumber), MARGIN + 23, y + 35, { align: 'center' });
      drawText(doc, day.title, MARGIN + 60, y + 17, 244, 8.8, 'bold', COLORS.darkGreen, 1);
      drawText(doc, [day.date, day.area, day.movement].filter(Boolean).join(' | '), MARGIN + 60, y + 34, 290, 7, 'normal', COLORS.muted, 1);
      drawLink(doc, day.route, PAGE_WIDTH - MARGIN - 118, y + rowHeight / 2 + 3, 104, { prefix: 'Map: ', size: 7.2 });
    });

    var noteY = 660;
    var colWidth = (PAGE_WIDTH - MARGIN * 2 - 10) / 2;
    fillRect(doc, MARGIN, noteY, colWidth, 112, COLORS.lightBlue, 9, COLORS.border);
    fillRect(doc, MARGIN + colWidth + 10, noteY, colWidth, 112, COLORS.lightAmber, 9, COLORS.border);
    setFont(doc, 8, 'bold', COLORS.blue);
    doc.text('TRANSPORT NOTE', MARGIN + 14, noteY + 23);
    drawText(doc, page.ticket || 'Use the ticket note shown in your phone plan before the first ride.', MARGIN + 14, noteY + 45, colWidth - 28, 8, 'normal', COLORS.muted, 4);
    setFont(doc, 8, 'bold', COLORS.amber);
    doc.text('TOUR FIT', MARGIN + colWidth + 24, noteY + 23);
    drawText(doc, page.tourFit || 'The plan keeps the historic centre together without forcing a cross-city detour.', MARGIN + colWidth + 24, noteY + 45, colWidth - 28, 8, 'normal', COLORS.muted, 4);
  }

  function drawDay(doc, page) {
    drawHeader(doc, 'Day ' + page.dayNumber + ' of your plan', page.title, [page.date, page.area, page.movement].filter(Boolean).join(' | '));
    fillRect(doc, MARGIN, 122, PAGE_WIDTH - MARGIN * 2, 58, COLORS.lightBlue, 9, COLORS.border);
    setFont(doc, 7.5, 'bold', COLORS.blue);
    doc.text('WEATHER READ', MARGIN + 14, 143);
    drawText(doc, page.weather, MARGIN + 14, 162, PAGE_WIDTH - MARGIN * 2 - 148, 7.7, 'normal', COLORS.muted, 2);
    drawLink(doc, page.route, PAGE_WIDTH - MARGIN - 126, 151, 112, { prefix: 'Route: ', size: 7.2 });

    if (page.decision) {
      fillRect(doc, MARGIN, 190, PAGE_WIDTH - MARGIN * 2, 42, COLORS.soft, 8, COLORS.border);
      setFont(doc, 7, 'bold', COLORS.green);
      doc.text('DAY LOGIC', MARGIN + 12, 207);
      drawText(doc, page.decision, MARGIN + 86, 207, PAGE_WIDTH - MARGIN * 2 - 98, 7.6, 'normal', COLORS.muted, 2);
    }

    var startY = page.decision ? 246 : 200;
    var endY = 777;
    var blocks = page.blocks;
    var gap = blocks.length > 8 ? 3 : 6;
    var available = endY - startY - Math.max(0, blocks.length - 1) * gap;
    var rowHeight = Math.max(38, Math.min(90, Math.floor(available / Math.max(1, blocks.length))));
    var detailLines = rowHeight >= 72 ? 3 : (rowHeight >= 52 ? 2 : 1);
    blocks.forEach(function (block, index) {
      var y = startY + index * (rowHeight + gap);
      fillRect(doc, MARGIN, y, PAGE_WIDTH - MARGIN * 2, rowHeight, index % 2 ? COLORS.white : COLORS.cream, 8, COLORS.border);
      fillRect(doc, MARGIN + 10, y + 9, 66, Math.min(28, rowHeight - 16), COLORS.green, 6, COLORS.green);
      setFont(doc, 7.2, 'bold', COLORS.yellow);
      doc.text(cleanText(block.time, 20).toUpperCase(), MARGIN + 43, y + Math.min(27, rowHeight / 2 + 3), { align: 'center' });
      var textX = MARGIN + 90;
      drawText(doc, block.title, textX, y + 18, 275, 8.4, 'bold', COLORS.darkGreen, 1);
      if (block.detail) drawText(doc, block.detail, textX, y + 34, 340, 7.2, 'normal', COLORS.muted, detailLines);
      if (block.link && rowHeight >= 48) drawLink(doc, block.link, PAGE_WIDTH - MARGIN - 116, y + 18, 102, { prefix: 'Map: ', size: 6.8 });
    });
  }

  function drawWeatherPlanB(doc, page) {
    var truth = page.mode === 'live'
      ? 'Every row uses live forecast data where available.'
      : page.mode === 'mixed'
        ? 'Some dates use a live forecast. Later dates show typical conditions and are not forecasts.'
        : 'These are typical seasonal conditions, not a forecast.';
    drawHeader(doc, 'Practical checks', page.title, truth);
    var top = 128;
    var gap = 7;
    var available = 642;
    var rowHeight = Math.min(86, Math.floor((available - Math.max(0, page.days.length - 1) * gap) / page.days.length));
    var planLines = rowHeight >= 78 ? 2 : 1;
    page.days.forEach(function (day, index) {
      var y = top + index * (rowHeight + gap);
      fillRect(doc, MARGIN, y, PAGE_WIDTH - MARGIN * 2, rowHeight, COLORS.white, 8, COLORS.border);
      fillRect(doc, MARGIN, y, 50, rowHeight, day.weatherKind === 'live' ? COLORS.blue : COLORS.green, 8, day.weatherKind === 'live' ? COLORS.blue : COLORS.green);
      setFont(doc, 7, 'bold', COLORS.white);
      doc.text('DAY ' + day.dayNumber, MARGIN + 25, y + 21, { align: 'center' });
      setFont(doc, 6.5, 'bold', COLORS.white);
      doc.text(day.weatherKind === 'live' ? 'FORECAST' : 'TYPICAL', MARGIN + 25, y + 38, { align: 'center' });
      var x = MARGIN + 64;
      drawText(doc, day.date + ' | ' + day.title, x, y + 17, 360, 7.8, 'bold', COLORS.darkGreen, 1);
      drawText(doc, day.weather, x, y + 32, 330, 6.8, 'normal', COLORS.muted, 1);
      drawText(doc, 'Opening: ' + day.opening, x, y + 46, 390, 6.8, 'normal', COLORS.muted, 1);
      drawText(doc, 'Plan B: ' + day.planB, x, y + 61, 410, 6.8, 'bold', COLORS.darkGreen, planLines);
      if (day.reservation) drawLink(doc, day.reservation, PAGE_WIDTH - MARGIN - 100, y + 17, 86, { size: 6.6 });
    });
  }

  function drawCardColumn(doc, title, items, x, y, width, height, accent) {
    setFont(doc, 9, 'bold', accent);
    doc.text(title.toUpperCase(), x, y);
    var top = y + 18;
    var gap = 5;
    var count = Math.max(1, items.length);
    var cardHeight = Math.max(32, Math.min(52, Math.floor((height - 18 - Math.max(0, count - 1) * gap) / count)));
    items.forEach(function (item, index) {
      var cardY = top + index * (cardHeight + gap);
      fillRect(doc, x, cardY, width, cardHeight, COLORS.white, 7, COLORS.border);
      fillRect(doc, x, cardY, 5, cardHeight, accent, 3, accent);
      drawText(doc, item.title, x + 14, cardY + 16, width - 28, 7.7, 'bold', COLORS.darkGreen, 1);
      if (cardHeight >= 44) drawText(doc, item.detail, x + 14, cardY + 31, width - 28, 6.8, 'normal', COLORS.muted, 1);
      if (item.link) drawLink(doc, item.link, x + width - 82, cardY + cardHeight - 8, 68, { size: 6.2 });
    });
    if (!items.length) {
      fillRect(doc, x, top, width, 54, COLORS.white, 7, COLORS.border);
      drawText(doc, 'No extra action is needed here.', x + 14, top + 28, width - 28, 7.5, 'normal', COLORS.muted, 1);
    }
  }

  function drawCarry(doc, page) {
    drawHeader(doc, 'Save and carry', page.title, 'The browser plan and this PDF use the same locked itinerary.');
    fillRect(doc, MARGIN, 122, PAGE_WIDTH - MARGIN * 2, 70, COLORS.yellow, 10, COLORS.yellow);
    setFont(doc, 8, 'bold', COLORS.darkGreen);
    doc.text('SAME PLAN, TWO WAYS TO USE IT', MARGIN + 16, 146);
    drawText(doc, 'Phone: live map links and quick actions. PDF: a clean offline copy you can print or save.', MARGIN + 16, 170, PAGE_WIDTH - MARGIN * 2 - 32, 10, 'bold', COLORS.darkGreen, 2);

    var gap = 12;
    var width = (PAGE_WIDTH - MARGIN * 2 - gap) / 2;
    drawCardColumn(doc, 'Before you go', page.beforeYouGo, MARGIN, 225, width, 450, COLORS.green);
    drawCardColumn(doc, 'Carry pack', page.carryPack, MARGIN + width + gap, 225, width, 450, COLORS.blue);

    fillRect(doc, MARGIN, 706, PAGE_WIDTH - MARGIN * 2, 66, COLORS.darkGreen, 10, COLORS.darkGreen);
    setFont(doc, 8, 'bold', COLORS.yellow);
    doc.text('BERLINWALK SUPPORT', MARGIN + 16, 730);
    drawText(doc, 'Keep the exact plan link with this PDF. For BerlinWalk information, use the official website.', MARGIN + 16, 751, 370, 8, 'normal', COLORS.white, 2);
    drawLink(doc, page.support, PAGE_WIDTH - MARGIN - 116, 745, 102, { size: 8, color: COLORS.yellow });
  }

  function drawPage(doc, page) {
    setColor(doc, 'setFillColor', COLORS.cream);
    doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F');
    if (page.type === 'cover') drawCover(doc, page);
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
      drawPage(doc, page);
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
