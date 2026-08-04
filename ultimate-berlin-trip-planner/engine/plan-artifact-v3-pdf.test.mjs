import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const V3 = require('./plan-artifact-v3.js');
const PdfV3 = require('./plan-artifact-v3-pdf.js');

function artifactSource(dayCount = 3) {
  const days = Array.from({ length: dayCount }, (_, index) => ({
    dayNumber: index + 1,
    dateKey: `2026-08-${String(index + 3).padStart(2, '0')}`,
    title: index === 0 ? 'Arrival and first Berlin orientation' : `Berlin day ${index + 1}`,
    theme: index === 0 ? 'Arrival day' : 'Historic centre',
    area: index === 0 ? 'Mitte / Alexanderplatz' : 'Mitte',
    movement: index === 0 ? 'Train + walk' : 'Walk',
    photo: { src: 'assets/day-art/day-oil-history.webp', alt: 'Berlin historic centre' },
    route: {
      label: `Open Day ${index + 1} route`,
      url: `https://www.google.com/maps/dir/?api=1&destination=Berlin&day=${index + 1}`,
      travelMode: 'walking',
      totalDistanceKm: 3.1,
      longestSegmentKm: 1.2,
      placeIds: ['alexanderplatz', 'museum-island'],
    },
    anchors: [{ placeId: 'alexanderplatz', label: 'Alexanderplatz', area: 'Mitte' }],
    blocks: [
      {
        time: 'Morning',
        window: '09:30-10:45',
        title: 'Alexanderplatz',
        copy: 'Start at the World Clock and look around the square.',
        primaryPlace: {
          placeId: 'alexanderplatz',
          label: 'Alexanderplatz map',
          url: 'https://www.google.com/maps/search/?api=1&query=Alexanderplatz+Berlin',
        },
      },
      {
        time: 'Late morning',
        window: '11:00-12:30',
        title: 'Museum Island',
        copy: 'Cross the Spree and keep the museums together in one compact section.',
        transferFromPrevious: {
          fromPlaceId: 'alexanderplatz',
          fromLabel: 'Alexanderplatz',
          toPlaceId: 'museum-island',
          toLabel: 'Museum Island',
          mode: 'walking',
          minutes: 14,
          bufferMinutes: 4,
          totalMinutes: 18,
          instruction: 'Walk west along Karl-Liebknecht-Strasse, cross the Spree and continue to Museum Island.',
          url: 'https://www.google.com/maps/dir/?api=1&origin=Alexanderplatz+Berlin&destination=Museum+Island+Berlin&travelmode=walking',
        },
        primaryPlace: {
          placeId: 'museum-island',
          label: 'Museum Island map',
          url: 'https://www.google.com/maps/search/?api=1&query=Museum+Island+Berlin',
        },
      },
    ],
    planB: 'If rain is steady, shorten the square and use the covered courtyards at Hackescher Markt.',
    decision: 'This day stays in Mitte to avoid a cross-city transfer.',
    opening: { status: 'Open in the planned window', warning: { detail: 'Check the official museum slot on the day.' } },
    reservation: index === 1 ? {
      required: true,
      label: 'Official museum reservation',
      url: 'https://www.smb.museum/en/plan-your-visit/',
      source: 'official',
      checkedAt: '2026-07-20T05:00:00.000Z',
    } : null,
    risks: [],
  }));
  return {
    engineVersion: 'test-engine-v3',
    createdAt: '2026-07-20T05:00:00.000Z',
    quality: { status: 'pass', validatorVersion: 'test-v1' },
    input: {
      arrivalDate: '2026-08-03',
      tripLength: dayCount,
      arrivalTime: 'morning',
      arrivalPoint: 'ber',
      stayArea: 'mitte',
      interests: ['history'],
      mustHandle: ['rain'],
      labels: { stayArea: 'Mitte / Alexanderplatz', pace: 'Balanced' },
    },
    decisionReceipt: {
      headline: `I have shaped your ${dayCount} Berlin days`,
      guideNote: 'I kept the arrival day light after BER.',
      reasons: ['BER arrival keeps Day 1 compact.', 'The historic centre stays in one continuous area.'],
    },
    trip: {
      title: `Your ${dayCount}-day Berlin plan`,
      summary: 'A compact plan built around real Berlin places and direct map links.',
      displayDate: '3 August 2026',
      dateRange: '3-5 August 2026',
      stayArea: 'Mitte / Alexanderplatz',
      pace: 'Balanced',
      ticket: 'Use an ABC ticket from BER, then switch to the zone that fits the remaining days.',
      tourFit: 'The historic centre day leaves space for the BerlinWalk free walking tour.',
    },
    days,
    beforeYouGo: [
      { title: 'BER ticket', detail: 'Buy an ABC ticket before the platform.', url: 'https://www.bvg.de/en/subscriptions-and-tickets/all-tickets' },
    ],
    carryPack: [
      { title: 'Daily routes', detail: 'Open the saved Google Maps links.', url: 'https://www.google.com/maps' },
    ],
    delivery: { browser: true, pdf: true, rendererVersion: 'artifact-v3-test' },
  };
}

function weatherSource(dayCount = 3) {
  return {
    generatedAt: '2026-07-20T05:30:00.000Z',
    days: Array.from({ length: dayCount }, (_, index) => ({
      dateKey: `2026-08-${String(index + 3).padStart(2, '0')}`,
      kind: index < 2 ? 'live' : 'typical',
      isForecast: index < 2,
      source: index < 2 ? 'open-meteo' : 'berlin-monthly-climate',
      checkedAt: index < 2 ? '2026-07-20T05:30:00.000Z' : '',
      reason: index < 2 ? 'inside_live_window' : 'outside_live_window',
      highC: index < 2 ? 24 : 23,
      lowC: 15,
      rainProbability: index < 2 ? 20 : null,
      title: index < 2 ? 'Bright intervals' : 'Typical August conditions',
      cue: index < 2 ? 'Carry a light rain layer.' : 'This is not a forecast.',
    })),
  };
}

class FakePdf {
  constructor() {
    this.pages = 1;
    this.currentPage = 1;
    this.links = [];
    this.linkRects = [];
    this.textCalls = [];
    this.shapes = [];
    this.images = [];
    this.savedAs = '';
    this.textWithLinkCalls = 0;
    this.fontSize = 0;
    this.language = '';
    this.viewerPreferenceValues = null;
    this.metadataValues = [];
    this.outlineItems = [];
    this.outline = {
      add: (_parent, title, options) => {
        this.outlineItems.push({ title, options });
        return { title, options };
      },
    };
    this.internal = {
      pageSize: {
        getWidth: () => 595.28,
        getHeight: () => 841.89,
      },
    };
  }

  addPage() { this.pages += 1; this.currentPage = this.pages; return this; }
  deletePage(page) { if (page > 1 && page <= this.pages) this.pages -= 1; return this; }
  getNumberOfPages() { return this.pages; }
  setPage(page) { this.currentPage = page; return this; }
  setFont() { return this; }
  setFontSize(size) { this.fontSize = Number(size) || 0; return this; }
  setTextColor() { return this; }
  setFillColor() { return this; }
  setDrawColor() { return this; }
  setLineWidth() { return this; }
  setProperties(value) { this.properties = value; return this; }
  setLanguage(value) { this.language = value; return this; }
  viewerPreferences(value) { this.viewerPreferenceValues = value; return this; }
  addMetadata(value, namespace) { this.metadataValues.push({ value, namespace }); return this; }
  rect(x, y, width, height) { this.shapes.push({ page: this.currentPage, x, y, width, height }); return this; }
  roundedRect(x, y, width, height) { this.shapes.push({ page: this.currentPage, x, y, width, height }); return this; }
  line() { return this; }
  circle() { return this; }
  addImage(data, format, x, y, width, height) {
    this.images.push({ page: this.currentPage, data, format, x, y, width, height });
    return this;
  }
  getTextWidth(value) { return String(value || '').length * 4; }
  splitTextToSize(value, width) {
    const text = String(value || '');
    const limit = Math.max(1, Math.floor(Number(width || 1) / 4));
    const words = text.split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';
    words.forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (candidate.length > limit && line) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    });
    if (line || !lines.length) lines.push(line);
    return lines;
  }
  text(value, x, y) {
    this.textCalls.push({ page: this.currentPage, value, x, y, fontSize: this.fontSize });
    return this;
  }
  textWithLink(value, x, y, options) {
    this.textWithLinkCalls += 1;
    this.text(value, x, y);
    this.links.push(options.url);
    return this;
  }
  link(x, y, width, height, options) {
    this.links.push(options.url);
    this.linkRects.push({ x, y, width, height });
    return this;
  }
  save(name) { this.savedAs = name; return this; }
}

test('creates a complete ordered page sequence with continuation capacity for every trip length', () => {
  for (let count = 1; count <= 7; count += 1) {
    const plan = PdfV3.createPagePlan(artifactSource(count), weatherSource(count));
    assert.equal(plan.pageCount, plan.pages.length);
    assert.equal(plan.pages[0].type, 'cover');
    assert.equal(plan.pages[1].type, 'overview');
    assert.ok(plan.pages.some((page) => page.type === 'overview-days'));
    assert.ok(plan.pages.some((page) => page.type === 'overview-notes'));
    assert.ok(plan.pages.filter((page) => page.type === 'day').length >= count);
    assert.ok(plan.pages.some((page) => page.type === 'weather-plan-b'));
    assert.equal(plan.pages.at(-1).type, 'carry-support');
    assert.deepEqual(PdfV3.validatePagePlan(plan), []);
  }
});

test('page planning is deterministic for the same artifact and weather overlay', () => {
  const first = PdfV3.createPagePlan(artifactSource(3), weatherSource(3));
  const second = PdfV3.createPagePlan(artifactSource(3), weatherSource(3));
  assert.deepEqual(second, first);
  assert.equal(first.fileName, 'berlinwalk-plan-2026-08-03-3-days.pdf');
  assert.equal(PdfV3.createPagePlan(artifactSource(1), weatherSource(1)).fileName, 'berlinwalk-plan-2026-08-03-1-day.pdf');
});

test('weather page keeps forecast and typical-condition truth labels separate', () => {
  const plan = PdfV3.createPagePlan(artifactSource(3), weatherSource(3));
  const page = plan.pages.find((item) => item.type === 'weather-plan-b');
  assert.equal(page.mode, 'mixed');
  assert.equal(page.days[0].weatherKind, 'live');
  assert.match(page.days[0].weather, /^Live forecast from Open-Meteo, checked /);
  assert.equal(page.days[2].weatherKind, 'typical');
  assert.match(page.days[2].weather, /^Typical August conditions, not a forecast:/);
  assert.doesNotMatch(page.days[2].weather, /Typical August conditions[^.]*\. Typical August conditions/i);
  assert.match(page.days[0].planB, /Hackescher Markt/);
  assert.match(page.days[1].opening, /Open in the planned window/);
  assert.match(page.days[1].opening, /Check the official museum slot on the day/);
  assert.match(page.days[1].opening, /Book or check: Official museum reservation/);
  assert.doesNotMatch(page.days[1].opening, /Planning note|\[object Object\]|\.\./);
  assert.match(page.checkedAt, /20 Jul 2026/);
  assert.equal(page.source, 'open-meteo');
});

test('PDF day pages use real ranges and preserve browser, PDF and email route order', () => {
  const source = artifactSource(3);
  const artifact = V3.normalizeArtifact(source);
  const parity = V3.deliverySnapshot(artifact);
  assert.deepEqual(parity.browser, parity.pdf);
  assert.deepEqual(parity.browser, parity.email);
  assert.deepEqual(parity.browser[0].routePlaceIds, ['alexanderplatz', 'museum-island']);
  assert.equal(parity.browser[0].decision, artifact.days[0].decision);
  assert.equal(parity.browser[0].blocks[0].detail, artifact.days[0].blocks[0].detail);
  assert.deepEqual(
    parity.browser[0].blocks.map((block) => block.placeIds),
    [['alexanderplatz'], ['museum-island']],
  );
  assert.equal(parity.browser[0].blocks[0].links[0].placeId, 'alexanderplatz');

  const plan = PdfV3.createPagePlan(artifact, weatherSource(3));
  const dayPages = plan.pages.filter((page) => page.type === 'day');
  assert.equal(dayPages[0].blocks[0].time, '09:30-10:45');
  assert.equal(dayPages[0].blocks[1].time, '11:00-12:30');
  assert.deepEqual(
    dayPages.map((day) => ({
      dayNumber: day.dayNumber,
      title: day.title,
      routeUrl: day.route.url,
      blocks: day.blocks.map((block, index) => ({
        order: index + 1,
        window: block.window || block.time,
        title: block.title,
        placeId: block.placeId,
      })),
    })),
    plan.deliverySnapshot.map((day) => ({
      dayNumber: day.dayNumber,
      title: day.title,
      routeUrl: day.routeUrl,
      blocks: day.blocks.map(({ order, window, title, placeId }) => ({ order, window, title, placeId })),
    })),
  );
});

test('Plan B remains a separate weather-page field and offline language is honest', () => {
  const plan = PdfV3.createPagePlan(artifactSource(1), weatherSource(1));
  const dayPage = plan.pages.find((page) => page.type === 'day');
  const weatherPage = plan.pages.find((page) => page.type === 'weather-plan-b');
  assert.equal(dayPage.blocks.some((block) => /plan b/i.test(block.title)), false);
  assert.match(weatherPage.days[0].planB, /Hackescher Markt/);

  const rendered = PdfV3.renderPagePlan(FakePdf, plan, { save: false });
  const text = rendered.doc.textCalls.flatMap((call) => Array.isArray(call.value) ? call.value : [call.value]).join(' ');
  assert.match(text, /plan works offline/i);
  assert.match(text, /map links still need data/i);
});

test('only approved real HTTPS URLs enter the page plan', () => {
  assert.equal(PdfV3.validateExternalUrl('#'), false);
  assert.equal(PdfV3.validateExternalUrl('javascript:alert(1)'), false);
  assert.equal(PdfV3.validateExternalUrl('https://example.com/placeholder'), false);
  assert.equal(PdfV3.validateExternalUrl('http://www.berlinwalk.com/'), false);
  assert.equal(PdfV3.validateExternalUrl('https://www.google.com/maps'), true);
  assert.equal(PdfV3.validateExternalUrl('https://www.berlinwalk.com/'), true);

  const plan = PdfV3.createPagePlan(artifactSource(3), weatherSource(3));
  assert.ok(plan.links.length >= 7);
  plan.links.forEach((link) => {
    assert.equal(PdfV3.validateExternalUrl(link.url), true);
    assert.notEqual(link.url, '#');
    assert.doesNotMatch(link.url, /placeholder/i);
  });
});

test('unsafe mandatory routes are rejected before PDF rendering', () => {
  const source = artifactSource(1);
  source.days[0].route.url = 'https://example.com/placeholder';
  assert.throws(() => PdfV3.createPagePlan(source, weatherSource(1)), /day_route_1|valid HTTPS route URL/);
});

test('renders exact pages from both a jsPDF constructor and a fresh instance', () => {
  const source = artifactSource(5);
  const weather = weatherSource(5);
  const fromConstructor = PdfV3.renderPdf(FakePdf, source, weather, { save: false });
  assert.equal(fromConstructor.pageCount, fromConstructor.pagePlan.pageCount);
  assert.equal(fromConstructor.doc.getNumberOfPages(), fromConstructor.pagePlan.pageCount);
  assert.equal(fromConstructor.doc.links.every(PdfV3.validateExternalUrl), true);
  assert.equal(fromConstructor.doc.textWithLinkCalls, 0);
  assert.equal(fromConstructor.doc.linkRects.every((rect) => rect.height > 0), true);

  const instance = new FakePdf();
  const view = V3.createViewModel(source, weather);
  const fromInstance = PdfV3.renderPdf(instance, view, { save: true, fileName: 'berlinwalk-test-plan.pdf' });
  assert.equal(fromInstance.pageCount, fromInstance.pagePlan.pageCount);
  assert.equal(instance.savedAs, 'berlinwalk-test-plan.pdf');
});

test('cover uses the supplied original BerlinWalk logo asset', () => {
  const plan = PdfV3.createPagePlan(artifactSource(1), weatherSource(1));
  const logoDataUrl = 'data:image/png;base64,BERLINWALK_LOGO_TEST';
  const rendered = PdfV3.renderPagePlan(FakePdf, plan, { save: false, logoDataUrl });
  assert.equal(rendered.doc.images.length, 1);
  assert.equal(rendered.doc.images[0].page, 1);
  assert.equal(rendered.doc.images[0].data, logoDataUrl);
  assert.equal(rendered.doc.images[0].format, 'PNG');
  assert.ok(rendered.doc.images[0].width / rendered.doc.images[0].height > 4.7);
  const coverText = rendered.doc.textCalls
    .filter((call) => call.page === 1)
    .flatMap((call) => Array.isArray(call.value) ? call.value : [call.value])
    .join(' ');
  assert.doesNotMatch(coverText, /\bBW\b/);
  assert.match(coverText, /PERSONAL TRIP PLAN/);
});

test('cover accepts the approved Berlin photo separately from the original logo', () => {
  const plan = PdfV3.createPagePlan(artifactSource(1), weatherSource(1));
  const rendered = PdfV3.renderPagePlan(FakePdf, plan, {
    save: false,
    logoDataUrl: 'data:image/png;base64,BERLINWALK_WORDMARK_TEST',
    coverImageDataUrl: 'data:image/jpeg;base64,BERLIN_HERO_TEST',
  });
  assert.equal(rendered.doc.images.length, 2);
  assert.equal(rendered.doc.images[0].format, 'PNG');
  assert.equal(rendered.doc.images[1].format, 'JPEG');
});

test('sets English document metadata, viewer preferences and page-order bookmarks', () => {
  const source = artifactSource(3);
  source.trip.title = 'Berlin & Potsdam plan';
  const result = PdfV3.renderPdf(FakePdf, source, weatherSource(3), { save: false });
  assert.equal(result.doc.language, 'en-GB');
  assert.equal(result.doc.viewerPreferenceValues.DisplayDocTitle, true);
  assert.equal(result.doc.viewerPreferenceValues.Direction, 'L2R');
  assert.equal(result.doc.metadataValues.length, 1);
  assert.match(result.doc.metadataValues[0].value, /<dc:language>en-GB<\/dc:language>/);
  assert.match(result.doc.metadataValues[0].value, /Berlin &amp; Potsdam plan/);
  assert.equal(result.doc.outlineItems.length, result.pageCount);
  assert.equal(result.accessibility.language, 'en-GB');
  assert.equal(result.accessibility.bookmarkCount, result.pageCount);
  assert.equal(result.accessibility.tagged, false);
  assert.match(result.accessibility.limitation, /does not expose a tagged-PDF structure-tree API/);
});

test('PDF labels keep readable spacing and the final header stays on one line', () => {
  const plan = PdfV3.createPagePlan(artifactSource(3), weatherSource(3));
  const rendered = PdfV3.renderPagePlan(FakePdf, plan, { save: false });
  const text = rendered.doc.textCalls
    .flatMap((call) => Array.isArray(call.value) ? call.value : [call.value])
    .join(' ');
  assert.match(text, /Map: Open/);
  assert.doesNotMatch(text, /Map:Open/);
  assert.match(text, /Use your plan on your phone or as a PDF/);
  assert.match(text, /Walk west along Karl-Liebknecht-Strasse/);
  assert.match(text, /Open this walk in Google Maps/);
});

test('PDF renders all three meal categories without adding the alternatives to the route', () => {
  const source = artifactSource(1);
  const day = source.days[0];
  day.route.placeIds.push('lunch-anchor');
  day.blocks.push({
    time: 'Lunch',
    window: '13:00-14:00',
    title: 'Lunch near Museum Island',
    copy: 'Choose one of these three lunch options.',
    placeId: 'lunch-anchor',
    placeIds: ['lunch-anchor', 'meal-local', 'meal-plant', 'meal-cafe'],
    links: [
      { kind: 'meal_option', placeId: 'meal-local', label: 'German: Venue One', url: 'https://www.google.com/maps/search/?api=1&query=Venue+One+Berlin' },
      { kind: 'meal_option', placeId: 'meal-plant', label: 'Vegetarian: Venue Two', url: 'https://www.google.com/maps/search/?api=1&query=Venue+Two+Berlin' },
      { kind: 'meal_option', placeId: 'meal-cafe', label: 'Cafe: Venue Three', url: 'https://www.google.com/maps/search/?api=1&query=Venue+Three+Berlin' },
    ],
    transferFromPrevious: {
      fromPlaceId: 'museum-island',
      fromLabel: 'Museum Island',
      toPlaceId: 'lunch-anchor',
      toLabel: 'Lunch near Museum Island',
      mode: 'walking',
      minutes: 8,
      bufferMinutes: 5,
      totalMinutes: 13,
      instruction: 'Walk from Museum Island to your lunch stop.',
      url: 'https://www.google.com/maps/dir/?api=1&origin=Museum+Island+Berlin&destination=Lunch+Berlin&travelmode=walking',
    },
  });
  const artifact = V3.normalizeArtifact(source);
  const plan = PdfV3.createPagePlan(artifact, weatherSource(1));
  const rendered = PdfV3.renderPagePlan(FakePdf, plan, { save: false });
  const text = rendered.doc.textCalls
    .flatMap((call) => Array.isArray(call.value) ? call.value : [call.value])
    .join(' ');
  assert.match(text, /Option 1:/);
  assert.match(text, /Option 2:/);
  assert.match(text, /Option 3:/);
  assert.match(text, /German: Venue One/);
  assert.match(text, /Vegetarian: Venue Two/);
  assert.match(text, /Cafe: Venue Three/);
  assert.deepEqual(artifact.days[0].route.placeIds, ['alexanderplatz', 'museum-island', 'lunch-anchor']);
});

test('PDF draws travel guidance before the destination activity', () => {
  const plan = PdfV3.createPagePlan(artifactSource(1), weatherSource(1));
  const dayPage = plan.pages.find((page) => page.type === 'day' && page.blocks.some((block) => block.title === 'Museum Island'));
  assert.ok(dayPage);
  const rendered = PdfV3.renderPagePlan(FakePdf, plan, { save: false });
  const calls = rendered.doc.textCalls.filter((call) => call.page === dayPage.pageNumber);
  const valueOf = (call) => (Array.isArray(call.value) ? call.value.join(' ') : String(call.value || '')).trim();
  const travelIndex = calls.findIndex((call) => valueOf(call) === 'TRAVEL FROM THE PREVIOUS STOP');
  const activityIndex = calls.findIndex((call) => valueOf(call) === 'Museum Island');
  assert.ok(travelIndex >= 0);
  assert.ok(activityIndex >= 0);
  assert.ok(travelIndex < activityIndex);
  assert.ok(calls[travelIndex].y < calls[activityIndex].y);
});

test('never adds ellipses and never renders helper copy below 9.5pt', () => {
  const source = artifactSource(7);
  source.days.forEach((day) => {
    day.planB = 'If the weather changes, visit the covered courtyards at Hackescher Markt, check the official opening time and keep the outdoor stops for later.';
  });
  const result = PdfV3.renderPdf(FakePdf, source, weatherSource(7), { save: false });
  const text = result.doc.textCalls
    .flatMap((call) => Array.isArray(call.value) ? call.value : [call.value])
    .join(' ');
  assert.doesNotMatch(text, /\.\.\./);
  assert.match(text, /covered courtyards at Hackescher Markt/);
  assert.equal(result.doc.textCalls.every((call) => call.fontSize >= PdfV3.MIN_HELPER_FONT_SIZE), true);
});

test('renderer keeps all drawing inside the A4 content boundary and uses ASCII hyphens', () => {
  const source = artifactSource(7);
  source.days[0].title = 'Arrival orientation — first look at Mitte';
  source.days[1].area = 'Bernauer Straße → Friedrichshain';
  const result = PdfV3.renderPdf(FakePdf, source, weatherSource(7), { save: false });
  const yValues = result.doc.textCalls.map((call) => call.y).filter(Number.isFinite);
  assert.ok(Math.max(...yValues) <= 817);
  assert.ok(Math.min(...yValues) >= 0);
  const allText = JSON.stringify(result.pagePlan);
  assert.doesNotMatch(allText, /[\u2010-\u2015\u2212]/);
  assert.match(allText, /Arrival orientation - first look at Mitte/);
  assert.doesNotMatch(allText, /\u2192/);
  assert.match(allText, /Bernauer Straße -> Friedrichshain/);
});

test('dense seven-day input adds continuation pages instead of shrinking route copy', () => {
  const source = artifactSource(7);
  source.days.forEach((day) => {
    day.title = 'One connected Berlin layer';
    day.route.placeIds = ['alexanderplatz'];
    day.blocks = Array.from({ length: 12 }, (_, index) => ({
      time: `${String(8 + index).padStart(2, '0')}:00`,
      window: `${String(8 + index).padStart(2, '0')}:00-${String(9 + index).padStart(2, '0')}:00`,
      title: `Berlin stop ${index + 1}`,
      copy: 'A deliberately long practical description that must be clipped inside the fixed daily timeline row without creating another PDF page.',
      primaryPlace: {
        placeId: 'alexanderplatz',
        label: `Stop ${index + 1} map`,
        url: `https://www.google.com/maps/search/?api=1&query=Berlin+stop+${index + 1}`,
      },
    }));
  });
  source.beforeYouGo = Array.from({ length: 12 }, (_, index) => ({
    title: `Before item ${index + 1}`,
    detail: 'A compact preparation action.',
  }));
  source.carryPack = Array.from({ length: 12 }, (_, index) => ({
    title: `Carry item ${index + 1}`,
    detail: 'A compact offline action.',
  }));

  const result = PdfV3.renderPdf(FakePdf, source, weatherSource(7), { save: false });
  assert.ok(result.pageCount > 25);
  assert.ok(result.pagePlan.dayPageCount > 21);
  const routeTitles = result.doc.textCalls.filter((call) => {
    const value = Array.isArray(call.value) ? call.value.join(' ') : String(call.value || '');
    return /^Berlin stop \d+/.test(value);
  });
  const routeDetails = result.doc.textCalls.filter((call) => {
    const value = Array.isArray(call.value) ? call.value.join(' ') : String(call.value || '');
    return /deliberately long practical description/.test(value);
  });
  assert.equal(routeTitles.length, 84);
  assert.equal(routeDetails.length, 84);
  assert.equal(routeTitles.every((call) => call.fontSize >= 12.5), true);
  assert.equal(routeDetails.every((call) => call.fontSize >= 10.5), true);
  result.doc.shapes.forEach((shape) => {
    assert.ok(shape.x >= 0);
    assert.ok(shape.y >= 0);
    assert.ok(shape.x + shape.width <= 595.28 + 0.01);
    assert.ok(shape.y + shape.height <= 841.89 + 0.01);
  });
  const yValues = result.doc.textCalls.map((call) => call.y).filter(Number.isFinite);
  assert.ok(Math.max(...yValues) <= 817);
});

test('transfer-heavy days split early enough for real browser font metrics', () => {
  const source = artifactSource(1);
  const placeIds = Array.from({ length: 5 }, (_, index) => `route-stop-${index + 1}`);
  source.days[0].route.placeIds = placeIds.slice();
  source.days[0].anchors = placeIds.map((placeId, index) => ({
    placeId,
    label: `Route stop ${index + 1}`,
    area: 'Berlin',
  }));
  source.days[0].blocks = placeIds.map((placeId, index) => ({
    time: index === 0 ? 'Arrival' : `Stop ${index + 1}`,
    window: `${String(9 + index * 2).padStart(2, '0')}:00-${String(10 + index * 2).padStart(2, '0')}:30`,
    title: index === 2 ? 'Topography of Terror and Brandenburg Gate' : `Berlin route stop ${index + 1}`,
    copy: 'Visit this stop, read the practical note and leave enough time before the next part of the route.',
    primaryPlace: {
      placeId,
      label: `Route stop ${index + 1} map`,
      url: `https://www.google.com/maps/search/?api=1&query=Berlin+route+stop+${index + 1}`,
    },
    transferFromPrevious: index === 0 ? null : {
      fromPlaceId: placeIds[index - 1],
      fromLabel: `Route stop ${index}`,
      toPlaceId: placeId,
      toLabel: `Route stop ${index + 1}`,
      mode: index === 2 ? 'transit' : 'walking',
      minutes: index === 2 ? 24 : 14,
      bufferMinutes: 6,
      totalMinutes: index === 2 ? 30 : 20,
      instruction: index === 2
        ? 'Use public transport to the next stop. Check the live connection before leaving and allow time to find the correct platform.'
        : 'Walk to the next stop and follow the saved map link at street level.',
      url: `https://www.google.com/maps/dir/?api=1&origin=Berlin+route+stop+${index}&destination=Berlin+route+stop+${index + 1}`,
    },
  }));

  const pagePlan = PdfV3.createPagePlan(source, weatherSource(1));
  const dayPages = pagePlan.pages.filter((page) => page.type === 'day');
  assert.ok(dayPages.length >= 3);
  assert.equal(dayPages.flatMap((page) => page.blocks).length, 5);
  assert.ok(dayPages.every((page) => page.blocks.length <= 2));
  assert.doesNotThrow(() => PdfV3.renderPagePlan(FakePdf, pagePlan, { save: false }));
});

test('long carry packs reserve space for section labels and the support card', () => {
  const source = artifactSource(6);
  source.beforeYouGo = Array.from({ length: 4 }, (_, index) => ({
    title: `Preparation item ${index + 1}`,
    detail: 'Check this practical item before leaving the hotel and keep the current information saved on your phone.',
    url: `https://www.berlinwalk.com/?before=${index + 1}`,
  }));
  source.carryPack = Array.from({ length: 8 }, (_, index) => ({
    title: index < 6 ? `Day ${index + 1} route` : `Phone item ${index + 1}`,
    detail: 'Keep this route or practical note on your phone. The PDF text works offline, but live map links still need data.',
    url: `https://www.google.com/maps/search/?api=1&query=Berlin+carry+item+${index + 1}`,
  }));

  const pagePlan = PdfV3.createPagePlan(source, weatherSource(6));
  const carryPages = pagePlan.pages.filter((page) => page.type === 'carry-support');
  assert.ok(carryPages.length >= 2);
  assert.equal(carryPages.at(-1).isLastPart, true);
  assert.equal(carryPages.flatMap((page) => page.items).length, 12);
  assert.doesNotThrow(() => PdfV3.renderPagePlan(FakePdf, pagePlan, { save: false }));
});
