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
    },
    anchors: [{ placeId: 'alexanderplatz', label: 'Alexanderplatz', area: 'Mitte' }],
    blocks: [
      {
        time: '09:30',
        title: 'Alexanderplatz',
        copy: 'Start at the World Clock and look around the square.',
        primaryPlace: {
          placeId: 'alexanderplatz',
          label: 'Alexanderplatz map',
          url: 'https://www.google.com/maps/search/?api=1&query=Alexanderplatz+Berlin',
        },
      },
      {
        time: '11:00',
        title: 'Museum Island',
        copy: 'Cross the Spree and keep the museums together in one compact section.',
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
    this.textCalls = [];
    this.shapes = [];
    this.savedAs = '';
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
  setFontSize() { return this; }
  setTextColor() { return this; }
  setFillColor() { return this; }
  setDrawColor() { return this; }
  setLineWidth() { return this; }
  setProperties(value) { this.properties = value; return this; }
  rect(x, y, width, height) { this.shapes.push({ page: this.currentPage, x, y, width, height }); return this; }
  roundedRect(x, y, width, height) { this.shapes.push({ page: this.currentPage, x, y, width, height }); return this; }
  line() { return this; }
  circle() { return this; }
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
    this.textCalls.push({ page: this.currentPage, value, x, y });
    return this;
  }
  textWithLink(value, x, y, options) {
    this.text(value, x, y);
    this.links.push(options.url);
    return this;
  }
  link(x, y, width, height, options) { this.links.push(options.url); return this; }
  save(name) { this.savedAs = name; return this; }
}

test('creates the exact N + 4 page sequence for every supported trip length', () => {
  for (let count = 1; count <= 7; count += 1) {
    const plan = PdfV3.createPagePlan(artifactSource(count), weatherSource(count));
    assert.equal(plan.pageCount, count + 4);
    assert.equal(plan.pages.length, count + 4);
    assert.deepEqual(plan.pages.map((page) => page.type), [
      'cover',
      'overview',
      ...Array.from({ length: count }, () => 'day'),
      'weather-plan-b',
      'carry-support',
    ]);
    assert.deepEqual(PdfV3.validatePagePlan(plan), []);
  }
});

test('page planning is deterministic for the same artifact and weather overlay', () => {
  const first = PdfV3.createPagePlan(artifactSource(3), weatherSource(3));
  const second = PdfV3.createPagePlan(artifactSource(3), weatherSource(3));
  assert.deepEqual(second, first);
  assert.equal(first.fileName, 'berlinwalk-plan-2026-08-03-3-days.pdf');
});

test('weather page keeps forecast and typical-condition truth labels separate', () => {
  const plan = PdfV3.createPagePlan(artifactSource(3), weatherSource(3));
  const page = plan.pages.find((item) => item.type === 'weather-plan-b');
  assert.equal(page.mode, 'mixed');
  assert.equal(page.days[0].weatherKind, 'live');
  assert.match(page.days[0].weather, /^Live forecast:/);
  assert.equal(page.days[2].weatherKind, 'typical');
  assert.match(page.days[2].weather, /^Typical conditions, not a forecast:/);
  assert.match(page.days[0].planB, /Hackescher Markt/);
  assert.match(page.days[1].opening, /Open in the planned window/);
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
  assert.equal(fromConstructor.pageCount, 9);
  assert.equal(fromConstructor.doc.getNumberOfPages(), 9);
  assert.equal(fromConstructor.doc.links.every(PdfV3.validateExternalUrl), true);

  const instance = new FakePdf();
  const view = V3.createViewModel(source, weather);
  const fromInstance = PdfV3.renderPdf(instance, view, { save: true, fileName: 'berlinwalk-test-plan.pdf' });
  assert.equal(fromInstance.pageCount, 9);
  assert.equal(instance.savedAs, 'berlinwalk-test-plan.pdf');
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

test('dense seven-day input still stays within one fixed A4 page per section', () => {
  const source = artifactSource(7);
  source.days.forEach((day) => {
    day.title = 'One connected Berlin layer';
    day.blocks = Array.from({ length: 12 }, (_, index) => ({
      time: `${String(8 + index).padStart(2, '0')}:00`,
      title: `Berlin stop ${index + 1}`,
      copy: 'A deliberately long practical description that must be clipped inside the fixed daily timeline row without creating another PDF page.',
      primaryPlace: {
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
  assert.equal(result.pageCount, 11);
  result.doc.shapes.forEach((shape) => {
    assert.ok(shape.x >= 0);
    assert.ok(shape.y >= 0);
    assert.ok(shape.x + shape.width <= 595.28 + 0.01);
    assert.ok(shape.y + shape.height <= 841.89 + 0.01);
  });
  const yValues = result.doc.textCalls.map((call) => call.y).filter(Number.isFinite);
  assert.ok(Math.max(...yValues) <= 817);
});
