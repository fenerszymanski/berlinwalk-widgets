const layers = {
  1894: {
    title: '1894 · A southern gateway',
    label: '1894 · Gateway',
    image: 'assets/1894-hallesches-tor.jpg',
    alt: 'A busy 1894 view through Hallesches Tor toward Belle-Alliance-Platz, with the Peace Column at its centre',
    width: 1800,
    height: 1331,
    badge: 'ANCHOR + AXIS',
    viewpoint: '<strong>Viewpoint:</strong> looking north through Hallesches Tor. Do not align the gatehouses with the current photograph.',
    evidence: [
      ['01 · SURVIVES', 'The Peace Column', 'The winged figure marks the centre across the oldest and newest views.'],
      ['02 · DISAPPEARS', 'The gatehouses', 'The monumental southern entrance frames 1894 but does not return after the war.'],
      ['03 · CHANGES', 'The size of the room', 'The postwar inner ring preserves a circle while making the public space smaller.']
    ]
  },
  1957: {
    title: '1957 · The cleared ground',
    label: '1957 · Cleared',
    image: 'assets/1957-destroyed-mehringplatz.jpg',
    alt: 'The cleared Mehringplatz seen from Hallesches Tor station in July 1957',
    width: 1157,
    height: 746,
    badge: 'GAP + AXIS',
    viewpoint: '<strong>Viewpoint:</strong> from the elevated Hallesches Tor station. The open ground is evidence, not an original park.',
    evidence: [
      ['01 · SURVIVES', 'The direction north', 'The central route remains legible even after the old building edges have gone.'],
      ['02 · DISAPPEARS', 'The urban room', 'Cleared ground replaces the dense prewar square during the 1950s.'],
      ['03 · REVEALS', 'A missing stage', 'The empty site separates wartime destruction from the later planning decision.']
    ]
  },
  1974: {
    title: '1974 · A new circle takes shape',
    label: '1974 · Rebuilding',
    image: 'assets/1974-mehringplatz-construction.jpg',
    alt: 'New postwar ring buildings under construction at Mehringplatz in January 1974',
    width: 1800,
    height: 1038,
    badge: 'PLAN + SCALE',
    viewpoint: '<strong>Viewpoint:</strong> through a window during construction. This frame documents the new ring, not the historic axis.',
    evidence: [
      ['01 · RETURNS', 'The circular idea', 'Postwar planning reuses the Rondell as an organising form.'],
      ['02 · CHANGES', 'The building edge', 'Homes and shops form a new inner ring at a different diameter.'],
      ['03 · ADDS', 'A modern neighbourhood', 'The scheme is contemporary housing, not a replica of Belle-Alliance-Platz.']
    ]
  },
  2024: {
    title: '2024 · The inherited circle',
    label: '2024 · Today',
    image: 'assets/2024-mehringplatz.jpg',
    alt: 'Mehringplatz in 2024, with the Peace Column between the postwar inner-ring buildings',
    width: 1800,
    height: 1200,
    badge: 'ANCHOR + SCALE',
    viewpoint: '<strong>Viewpoint:</strong> from the southern side of the pedestrian square, looking north. The old gatehouses are gone.',
    evidence: [
      ['01 · SURVIVES', 'The Peace Column', 'The column still marks the centre and connects the present view to the old square.'],
      ['02 · CONTINUES', 'The northward axis', 'The opening behind the column leads into Friedrichstraße.'],
      ['03 · TRANSLATES', 'The historic circle', 'The postwar ring remembers the old geometry without rebuilding the old facades.']
    ]
  }
};

const tabs = [...document.querySelectorAll('[role="tab"][data-year]')];
const comparisonSelect = document.querySelector('#comparison-year');
const panel = document.querySelector('#layer-panel');
const status = document.querySelector('#viewer-status');
const evidenceGrid = document.querySelector('#evidence-grid');
let primaryYear = '1894';
let referenceYear = '2024';

function renderPhoto(prefix, layer) {
  const title = document.querySelector(`#${prefix}-title`);
  const image = document.querySelector(`#${prefix}-image`);
  const badge = document.querySelector(`#${prefix}-badge`);
  const viewpoint = document.querySelector(`#${prefix}-viewpoint`);

  title.textContent = layer.title;
  image.src = layer.image;
  image.alt = layer.alt;
  image.width = layer.width;
  image.height = layer.height;
  badge.textContent = layer.badge;
  viewpoint.innerHTML = layer.viewpoint;
}

function renderEvidence(layer) {
  evidenceGrid.replaceChildren(...layer.evidence.map(([kicker, title, text]) => {
    const article = document.createElement('article');
    const span = document.createElement('span');
    const heading = document.createElement('h3');
    const paragraph = document.createElement('p');
    span.textContent = kicker;
    heading.textContent = title;
    paragraph.textContent = text;
    article.append(span, heading, paragraph);
    return article;
  }));
}

function updateComparisonOptions() {
  [...comparisonSelect.options].forEach((option) => {
    option.disabled = option.value === primaryYear;
  });

  if (referenceYear === primaryYear) {
    referenceYear = primaryYear === '2024' ? '1894' : '2024';
    comparisonSelect.value = referenceYear;
  }
}

function setPrimaryYear(year, announce = true) {
  primaryYear = year;
  tabs.forEach((tab) => {
    const selected = tab.dataset.year === year;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  const activeTab = tabs.find((tab) => tab.dataset.year === year);
  panel.setAttribute('aria-labelledby', activeTab.id);
  updateComparisonOptions();
  renderPhoto('primary', layers[primaryYear]);
  renderPhoto('reference', layers[referenceYear]);
  renderEvidence(layers[primaryYear]);

  if (announce) {
    status.textContent = `${layers[primaryYear].label} selected. Compared with ${layers[referenceYear].label}.`;
  }
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => setPrimaryYear(tab.dataset.year));
  tab.addEventListener('keydown', (event) => {
    let nextIndex = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;
    if (nextIndex === index) return;
    event.preventDefault();
    tabs[nextIndex].focus();
    setPrimaryYear(tabs[nextIndex].dataset.year);
  });
});

comparisonSelect.addEventListener('change', () => {
  referenceYear = comparisonSelect.value;
  renderPhoto('reference', layers[referenceYear]);
  status.textContent = `${layers[primaryYear].label} is now compared with ${layers[referenceYear].label}.`;
});

const creditsButton = document.querySelector('#credits-button');
const creditsDialog = document.querySelector('#credits-dialog');
const creditsBackdrop = document.querySelector('#credits-backdrop');
const creditsClose = document.querySelector('#credits-close');
let returnFocus = null;

function openCredits() {
  returnFocus = document.activeElement;
  creditsDialog.hidden = false;
  creditsBackdrop.hidden = false;
  creditsButton.setAttribute('aria-expanded', 'true');
  creditsClose.focus();
}

function closeCredits() {
  creditsDialog.hidden = true;
  creditsBackdrop.hidden = true;
  creditsButton.setAttribute('aria-expanded', 'false');
  if (returnFocus) returnFocus.focus();
}

creditsButton.addEventListener('click', openCredits);
creditsClose.addEventListener('click', closeCredits);
creditsBackdrop.addEventListener('click', closeCredits);

document.addEventListener('keydown', (event) => {
  if (creditsDialog.hidden) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    closeCredits();
    return;
  }

  if (event.key === 'Tab') {
    const focusable = [...creditsDialog.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

setPrimaryYear(primaryYear, false);

let lastReportedHeight = 0;

function reportHeight() {
  const height = Math.ceil(document.documentElement.scrollHeight);
  if (Math.abs(height - lastReportedHeight) < 3) return;
  lastReportedHeight = height;
  window.parent.postMessage({
    type: 'bw:mehringplatz-resize',
    height
  }, '*');
}

window.addEventListener('load', reportHeight);
window.addEventListener('resize', reportHeight);
