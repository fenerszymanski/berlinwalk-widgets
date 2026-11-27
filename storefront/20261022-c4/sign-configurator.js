// Berlin street sign with your name: product page configurator (27 Nov 2026, not live; release steps in
// output/production/berlin-sign-20261127/RELEASE_CHECKLIST_TR.md). Same contract as calendar-configurator.js:
// storefront-element.js renders signBody(), then calls mountSign(host, state, api) with
// api = {german, busy(), available(), track(step, details), add(fields)}; add() puts the line in the Wix cart with
// customTextFields = encodeSign(...) (sign-encoding.js). The preview is drawn in the browser with Wobby (sign-preview.js).
import {SIGN_FIELDS, SIGN_LIMITS as L, SIGN_PRODUCT_ID, encodeSign, decodeSign, normaliseSign, cleanSignText, SignError} from './sign-encoding.js';
import {drawScene, signLayout, FONT} from './sign-preview.js';
export {decodeSign, SIGN_FIELDS};
export const SIGN_ID = SIGN_PRODUCT_ID;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

// German page text. Keys are the English strings (same shape as ys-de.js calendarText).
const DE = new Map(Object.entries({
  'PERSONALISED BERLIN STREET SIGN · 45 x 30 CM': 'BERLINER STRASSENSCHILD MIT DEINEM NAMEN · 45 x 30 CM',
  'Your name on a Berlin street sign': 'Dein Name als Berliner Straßenschild',
  'White aluminium, black letters, and the plaque below for your story.': 'Weißes Aluminium, schwarze Schrift, darunter die Legendentafel für eure Geschichte.',
  'What is it for?': 'Wofür ist es?', 'Moving in': 'Umzug', 'Farewell': 'Abschied', 'Wedding': 'Hochzeit', 'Citizenship': 'Einbürgerung',
  'New baby': 'Geburt', 'Birthday': 'Geburtstag',
  'Pick one and I fill in an example. You can change every word.': 'Wähl einen Anlass, ich trage ein Beispiel ein. Jedes Wort kannst du ändern.',
  'The sign': 'Das Schild', 'Name on the sign': 'Name auf dem Schild', 'Add a street word': 'Straßenwort anhängen',
  'Ortsteil (the small line at the top)': 'Ortsteil (die kleine Zeile oben)', 'Leave it empty for no line.': 'Leer lassen für keine Zeile.',
  'Bottom left': 'Unten links', 'Bottom right': 'Unten rechts', 'Arrow': 'Pfeil', 'no arrow': 'kein Pfeil', '← left': '← links', 'right →': 'rechts →',
  'The plaque below': 'Die Tafel darunter', 'Up to three lines, like the plaques under Berlin street signs that say who the street is named after. Leave all three empty for a sign without the plaque.':
    'Bis zu drei Zeilen, wie die Legendentafeln unter Berliner Straßenschildern. Alle drei leer lassen für ein Schild ohne Tafel.',
  'Line': 'Zeile', 'Your sign': 'Dein Schild', 'Add to cart': 'In den Warenkorb', 'View cart': 'Zum Warenkorb', 'Added to your cart': 'Im Warenkorb',
  'On the wall': 'An der Wand', 'Close up': 'Nah', 'Illustrated preview': 'Gezeichnete Vorschau',
  'Product examples': 'Produktbeispiele', 'Example image': 'Beispielbild',
  'Styling example · AI visualization': 'Gestaltungsbeispiel · KI-Visualisierung',
  'Drawn to scale: 45.7 x 30.5 cm.': 'Maßstabsgetreu gezeichnet: 45,7 x 30,5 cm.',
  'Type the name for your sign.': 'Schreib den Namen für dein Schild.',
  'The name is too long for the sign. Shorten it or leave out the street word.': 'Der Name ist zu lang für das Schild. Kürz ihn oder lass das Straßenwort weg.',
  'The two bottom corners are too long together. Shorten one of them.': 'Die beiden unteren Ecken sind zusammen zu lang. Kürz eine davon.',
  'A plaque line is too long. Shorten it.': 'Eine Zeile der Tafel ist zu lang. Kürz sie.',
  'This sign cannot print: {chars}': 'Das kann das Schild nicht drucken: {chars}',
  'Too long: {field}': 'Zu lang: {field}', 'The preview is loading…': 'Die Vorschau lädt…',
  'This sign is not on sale yet.': 'Dieses Schild ist noch nicht im Verkauf.',
  'Example name in grey. Type yours.': 'Beispielname in Grau. Schreib deinen.',
  '45.7 x 30.5 cm, 3 mm white aluminium panel. Orders to Germany and Austria are printed in Germany.': '45,7 x 30,5 cm, 3 mm weiße Aluminiumplatte. Bestellungen nach Deutschland und Österreich werden in Deutschland gedruckt.',
  'Made for your indoor wall: a gift in the style of a Berlin street sign, not an official sign.': 'Für die Wand drinnen: ein Geschenk im Stil eines Berliner Straßenschilds, kein amtliches Schild.',
  'I check every sign by eye before it goes to print.': 'Ich schaue mir jedes Schild an, bevor es in den Druck geht.',
  'Letters, numbers and the usual punctuation, with German, Turkish, Polish and other European accents. No emoji.': 'Buchstaben, Zahlen und die übliche Zeichensetzung, mit deutschen, türkischen, polnischen und anderen europäischen Akzenten. Keine Emoji.',
  'What you get': 'Was du bekommst', 'name': 'Name', 'Ortsteil': 'Ortsteil', 'bottom left': 'unten links', 'bottom right': 'unten rechts', 'plaque line': 'Tafelzeile',
  'Street sign 45 x 30 cm': 'Straßenschild 45 x 30 cm', 'Sign details need checking.': 'Die Schilddaten müssen geprüft werden.'
}));
export const signText = (s, german) => german ? (DE.get(s) || s) : s;

const Y = new Date().getFullYear();
// Occasion examples. Name examples are only shown in grey in the preview (the buyer must type a name); corners and plaque
// lines are filled in as real values. {Y} = this year.
const OCCASIONS = {
  move: {label: 'Moving in', name: 'Clara-Müller-Weg', ortsteil: 'Prenzlauer Berg',
    en: {left: ['since {Y}', 'right'], right: ['10437 Berlin', 'none'], caption: ['Our home since {Y}', 'First flat of our own', 'Back building, 4th floor']},
    de: {left: ['seit {Y}', 'right'], right: ['10437 Berlin', 'none'], caption: ['Hier wohnen wir seit {Y}', 'Die erste eigene Wohnung', 'Hinterhaus, 4. Stock']}},
  farewell: {label: 'Farewell', name: 'Emma-Clarke-Straße', ortsteil: 'Neukölln',
    en: {left: ['Leeds 2017', 'left'], right: ['{Y} See you again', 'right'], caption: ['Nine Berlin years, one Kiez', 'Thank you for everything', 'Come back soon']},
    de: {left: ['Ankunft 2017', 'left'], right: ['{Y} Bis bald', 'right'], caption: ['Neun Berliner Jahre, ein Kiez', 'Danke für alles', 'Komm bald wieder']}},
  wedding: {label: 'Wedding', name: 'Lena-und-Tim-Allee', ortsteil: 'Schöneberg',
    en: {left: ['', 'none'], right: ['12.06.{Y}', 'none'], caption: ['Married on 12 June {Y}', 'at the Standesamt Schöneberg', 'Our first flat together: Akazienstraße']},
    de: {left: ['', 'none'], right: ['12.06.{Y}', 'none'], caption: ['Verheiratet am 12. Juni {Y}', 'im Standesamt Schöneberg', 'Erste gemeinsame Wohnung: Akazienstraße']}},
  citizenship: {label: 'Citizenship', name: 'Aylin-Demir-Ufer', ortsteil: 'Kreuzberg',
    en: {left: ['Izmir 2014', 'left'], right: ['Berlin {Y}', 'right'], caption: ['Came to Berlin in 2014', 'German citizen since {Y}', 'Welcome home']},
    de: {left: ['Izmir 2014', 'left'], right: ['Berlin {Y}', 'right'], caption: ['Nach Berlin gekommen 2014', 'Deutsche Staatsbürgerin seit {Y}', 'Willkommen zu Hause']}},
  birth: {label: 'New baby', name: 'Mila-Sophie-Gasse', ortsteil: 'Pankow',
    en: {left: ['', 'none'], right: ['03.03.{Y}', 'none'], caption: ['Born on 3 March {Y} in Pankow', '51 cm · 3,420 g', 'A Berliner from day one']},
    de: {left: ['', 'none'], right: ['03.03.{Y}', 'none'], caption: ['Geboren am 3. März {Y} in Pankow', '51 cm · 3.420 g', 'Berlinerin von Anfang an']}},
  birthday: {label: 'Birthday', name: 'Opa-Horst-Platz', ortsteil: 'Wedding',
    en: {left: ['1946', 'left'], right: ['{Y}', 'right'], caption: ['Born in 1946 in Wedding', '80 years of Berlin', 'The family card champion']},
    de: {left: ['1946', 'left'], right: ['{Y}', 'right'], caption: ['Geboren 1946 im Wedding', '80 Jahre Berlin', 'Skatmeister der Familie']}}
};
const fill = v => String(v).replace(/\{Y\}/g, Y);
const STREET_WORDS = ['Straße', 'Weg', 'Platz', 'Allee', 'Ufer', 'Gasse', 'Damm'];
const ORTSTEILE = ['Mitte', 'Moabit', 'Wedding', 'Gesundbrunnen', 'Tiergarten', 'Hansaviertel', 'Prenzlauer Berg', 'Pankow', 'Weißensee', 'Friedrichshain', 'Kreuzberg',
  'Neukölln', 'Britz', 'Rudow', 'Schöneberg', 'Friedenau', 'Tempelhof', 'Mariendorf', 'Lichtenrade', 'Charlottenburg', 'Wilmersdorf', 'Westend', 'Grunewald',
  'Steglitz', 'Lichterfelde', 'Zehlendorf', 'Dahlem', 'Wannsee', 'Spandau', 'Reinickendorf', 'Tegel', 'Frohnau', 'Lichtenberg', 'Karlshorst', 'Friedrichsfelde',
  'Marzahn', 'Hellersdorf', 'Köpenick', 'Adlershof', 'Friedrichshagen', 'Alt-Treptow', 'Plänterwald', 'Baumschulenweg', 'Niederschönhausen', 'Buch'];

export function signSpec(s) {
  return {lang: s.lang, occasion: s.occasion || 'other', name: s.name, ortsteil: s.ortsteil, left: {...s.left}, right: {...s.right}, caption: [...s.caption]};
}
// Ready = encodes and fits the sign at the page's (slightly strict) measure. Needs the font loaded.
export function signCheck(s) {
  if (!cleanSignText(s.name)) return {ok: false, why: 'Type the name for your sign.'};
  let f;
  try { f = normaliseSign(signSpec(s)); encodeSign(f); } catch (e) {
    if (!(e instanceof SignError)) throw e;
    if (e.code === 'CHARS') return {ok: false, why: 'This sign cannot print: {chars}', chars: e.detail, field: e.field};
    return {ok: false, why: 'Too long: {field}', field: e.field};
  }
  if (!s.fontReady) return {ok: false, why: 'The preview is loading…', wait: true};
  const errors = signLayout(f).errors;
  if (errors.includes('name')) return {ok: false, why: 'The name is too long for the sign. Shorten it or leave out the street word.', field: 'name'};
  if (errors.includes('corners')) return {ok: false, why: 'The two bottom corners are too long together. Shorten one of them.', field: 'left.text'};
  if (errors.includes('caption')) return {ok: false, why: 'A plaque line is too long. Shorten it.', field: 'caption.1'};
  return {ok: true, fields: encodeSign(f)};
}
export const signReady = s => signCheck(s).ok;
export function signSummary(fields, german) {
  try { const d = decodeSign(fields); return [signText('Street sign 45 x 30 cm', german), d.ortsteil && `Ortsteil ${d.ortsteil}`].filter(Boolean).join(' · '); }
  catch { return signText('Sign details need checking.', german); }
}
// Cart / order line details (storefront-element.js lineCustom()).
export function signLineHtml(fields, german) {
  try {
    const d = decodeSign(fields), corner = c => (c.arrow === 'left' ? '← ' : '') + c.text + (c.arrow === 'right' ? ' →' : '');
    return [`<p class="meta bw-raw"><strong>${esc(d.name)}</strong></p>`, ...[d.ortsteil && 'Ortsteil ' + d.ortsteil, [corner(d.left), corner(d.right)].filter(x => x.trim()).join(' · '), ...d.caption].filter(Boolean).map(x => `<p class="meta bw-raw">${esc(x)}</p>`)].join('');
  } catch { return `<p class="meta">${esc(signText('Sign details need checking.', german))}</p>`; }
}

const CSS = `.sg-wrap{padding-block:28px 40px}.sg-layout{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:8px 48px;align-items:start}
.sg-heading{grid-column:2}.sg-kicker{font:500 11px/1.6 var(--mono,monospace);letter-spacing:.08em;color:var(--muted,#5a6455);margin:0 0 6px}
.sg-heading h1{font-family:var(--head,var(--serif,serif));font-weight:400;font-size:clamp(34px,4vw,50px);line-height:1.05;margin:0 0 10px}
.sg-heading .lead{margin:0 0 10px;font-size:17px;line-height:1.45}.sg-price{font-size:24px;font-weight:500;color:var(--green,#123d18)}
.sg-preview{grid-column:1;grid-row:1/span 6;position:sticky;top:12px}.sg-stage{background:#e4dfd4;border-radius:6px;overflow:hidden}
.sg-stage canvas{display:block;width:100%;height:auto}.sg-views{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;align-items:center}
.sg-stage .sg-photo{display:block;width:100%;aspect-ratio:16/11;object-fit:contain}
.sg-stage [hidden]{display:none}.sg-photos{display:flex;gap:8px;margin-top:10px}
.sg-photos button{padding:2px;border:2px solid transparent;border-radius:6px;background:transparent}
.sg-photos button[aria-pressed=true]{border-color:var(--green,#123d18)}
.sg-photos img{display:block;width:60px;height:60px;border-radius:3px}
.sg-photo-note{font-size:12px;color:var(--muted,#5a6455);margin:6px 0 0}
.sg-views button{min-height:40px;border:1.5px solid var(--green,#123d18);background:transparent;border-radius:30px;padding:6px 14px;font-size:13px;font-weight:600}
.sg-views button[aria-pressed=true]{background:var(--green,#123d18);color:var(--cream,#fafaf5)}.sg-note{font-size:12px;color:var(--muted,#5a6455);margin:6px 0 0}
.sg-step{grid-column:2;border-top:1px solid var(--line,#e2e2da);padding-top:18px;margin-top:10px}
.sg-step h2{font-size:22px;margin:0 0 10px;display:flex;align-items:center;gap:10px}.sg-num{display:inline-flex;width:28px;height:28px;border-radius:50%;background:var(--green,#123d18);color:var(--cream,#fafaf5);font:600 14px/28px sans-serif;justify-content:center}
.sg-help{font-size:14px;color:var(--muted,#5a6455);margin:0 0 10px}
.sg-occasions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.sg-occasions button{min-height:46px;border:1.5px solid var(--line,#d8d8cf);background:#fff;border-radius:10px;font-size:14px;font-weight:600}
.sg-occasions button[aria-checked=true]{border-color:var(--green,#123d18);box-shadow:inset 0 0 0 1px var(--green,#123d18);background:#f2f5ec}
.sg-field{display:block;margin:0 0 12px;font-size:14px;font-weight:600}.sg-field input,.sg-field select{display:block;width:100%;min-height:48px;margin-top:5px;border:1.5px solid var(--line,#d8d8cf);border-radius:10px;background:#fff;padding:10px 12px;font-size:16px;font-weight:400;color:var(--ink,#2b3128)}
.sg-field input[aria-invalid=true]{border-color:#b3402a}.sg-count{float:right;font:400 12px/1.8 var(--mono,monospace);color:#4a5346}
.sg-chips{display:flex;flex-wrap:wrap;gap:6px;margin:-4px 0 14px}.sg-chips span{font-size:12px;color:var(--muted,#5a6455);width:100%}
.sg-chips button{min-height:36px;border:1px solid #c9ccc2;border-radius:20px;background:transparent;padding:4px 12px;font-size:13px}
.sg-corners{display:grid;grid-template-columns:1fr;gap:0}.sg-corner{margin-bottom:12px}.sg-corner .sg-field{margin:0}.sg-row{display:flex;gap:8px;margin-top:5px}.sg-row input,.sg-row select{min-height:48px;border:1.5px solid var(--line,#d8d8cf);border-radius:10px;background:#fff;font-size:16px;color:var(--ink,#2b3128)}.sg-row input{flex:1;min-width:0;padding:10px 12px}.sg-row input[aria-invalid=true]{border-color:#b3402a}.sg-row select{flex:0 0 auto;padding:8px 10px;font-size:15px}
.sg-why{font-size:14px;min-height:1.4em;margin:8px 0;color:var(--muted,#5a6455)}.sg-why.is-error{color:#8a2f1c}
.sg-buy .primary{width:100%}.sg-points{font-size:14px;line-height:1.55;padding-left:18px;margin:14px 0 0}.sg-points li{margin-bottom:6px}
.sg-summary{display:flex;justify-content:space-between;gap:12px;font-size:15px;margin:0 0 6px}.sg-summary>span:last-child{white-space:nowrap}.sg-added{font-size:14px;margin:8px 0}
.sg-mini{display:none}
@media(max-width:899px){.sg-layout{display:block}.sg-preview{position:static}.sg-heading{margin-bottom:12px}.sg-occasions{grid-template-columns:repeat(2,minmax(0,1fr))}.sg-note{display:none}
.sg-mini{display:block;position:sticky;top:0;z-index:3;margin:0 -16px;padding:6px 16px;background:#fafaf5;border-bottom:1px solid var(--line,#e2e2da);box-shadow:0 8px 14px -12px #123d1855;visibility:hidden;height:0;overflow:hidden}.sg-mini.is-on{visibility:visible;height:auto;margin-bottom:10px}
.sg-mini canvas{display:block;width:min(48vw,190px);height:auto;margin:0 auto}.sg-field input,.sg-row input{scroll-margin-top:160px}}`;

export function signBody({german, price, priceHtml, legal = '', photos = []}) {
  const t = s => esc(signText(s, german));
  if (german) price = String(price).replace(/^€([0-9]+)\.([0-9]{2})$/, '$1,$2 €');
  const input = (id, label, key, max, extra = '') => `<label class="sg-field" for="${id}">${t(label)}<span class="sg-count" data-sg-count="${key}"></span><input id="${id}" data-sg="${key}" maxlength="${max + 8}" autocomplete="off" spellcheck="false" ${extra}></label>`;
  const corner = side => `<div class="sg-corner"><label class="sg-field" for="sg-${side}">${t(side === 'left' ? 'Bottom left' : 'Bottom right')}<span class="sg-count" data-sg-count="${side}"></span></label><div class="sg-row"><input id="sg-${side}" data-sg="${side}" maxlength="${L.corner + 8}" autocomplete="off" spellcheck="false"><select aria-label="${t('Arrow')} · ${t(side === 'left' ? 'Bottom left' : 'Bottom right')}" data-sg-arrow="${side}"><option value="none">${t('no arrow')}</option><option value="left">${t('← left')}</option><option value="right">${t('right →')}</option></select></div></div>`;
  return `<div class="wrap sg-wrap bw-raw" lang="${german ? 'de' : 'en'}" data-sign-host><style>${CSS}</style><div class="sg-layout">
<div class="sg-heading"><p class="sg-kicker">${t('PERSONALISED BERLIN STREET SIGN · 45 x 30 CM')}</p><h1>${t('Your name on a Berlin street sign')}</h1><p class="lead">${t('White aluminium, black letters, and the plaque below for your story.')}</p><span class="sg-price">${priceHtml || esc(price)}</span></div>
<div class="sg-mini" data-sg-mini aria-hidden="true"><canvas data-sg-mini-canvas width="780" height="530"></canvas></div><section class="sg-preview" aria-label="${t('Illustrated preview')}"><div class="sg-stage"><canvas data-sg-canvas width="1600" height="1100" role="img" aria-label="${t('Illustrated preview')}"></canvas>${photos.length ? '<img class="sg-photo" data-sg-photo alt="" hidden>' : ''}</div>
<div class="sg-views"><button type="button" data-sg-view="wall" aria-pressed="true">${t('On the wall')}</button><button type="button" data-sg-view="close" aria-pressed="false">${t('Close up')}</button><span class="sg-note" data-sg-example hidden>${t('Example name in grey. Type yours.')}</span></div>
<p class="sg-note" data-sg-preview-note>${t('Illustrated preview')} · ${t('Drawn to scale: 45.7 x 30.5 cm.')}</p>
${photos.length ? `<div class="sg-photos" role="group" aria-label="${t('Product examples')}">${photos.map(({src,alt}, i) => `<button type="button" data-sg-photo-alt="${esc(alt)}" aria-label="${t('Example image')} ${i + 1}" aria-pressed="false"><img src="${esc(src)}" alt="" width="60" height="60" loading="lazy" decoding="async"></button>`).join('')}</div><p class="sg-photo-note" data-sg-photo-note hidden>${t('Styling example · AI visualization')}</p>` : ''}</section>
<section class="sg-step"><h2><span class="sg-num">1</span>${t('What is it for?')}</h2><p class="sg-help">${t('Pick one and I fill in an example. You can change every word.')}</p><div class="sg-occasions" role="radiogroup" aria-label="${t('What is it for?')}">${Object.entries(OCCASIONS).map(([k, o]) => `<button type="button" role="radio" aria-checked="false" data-sg-occasion="${k}">${t(o.label)}</button>`).join('')}</div></section>
<section class="sg-step"><h2><span class="sg-num">2</span>${t('The sign')}</h2>${input('sg-name', 'Name on the sign', 'name', L.name)}<div class="sg-chips"><span>${t('Add a street word')}</span>${STREET_WORDS.map(w => `<button type="button" data-sg-word="${w}">-${w}</button>`).join('')}</div>
${input('sg-ortsteil', 'Ortsteil (the small line at the top)', 'ortsteil', L.ortsteil, 'list="sg-ortsteile"')}<datalist id="sg-ortsteile">${ORTSTEILE.map(o => `<option value="${esc(o)}">`).join('')}</datalist><p class="sg-help">${t('Leave it empty for no line.')}</p>
<div class="sg-corners">${corner('left')}${corner('right')}</div></section>
<section class="sg-step"><h2><span class="sg-num">3</span>${t('The plaque below')}</h2><p class="sg-help">${t('Up to three lines, like the plaques under Berlin street signs that say who the street is named after. Leave all three empty for a sign without the plaque.')}</p>${[0, 1, 2].map(i => input('sg-c' + i, signText('Line', german) + ' ' + (i + 1), 'c' + i, L.captionLine)).join('')}</section>
<section class="sg-step sg-buy"><h2><span class="sg-num">4</span>${t('Your sign')}</h2><p class="sg-summary"><span data-sg-summary></span><span>${priceHtml || esc(price)}</span></p><p class="sg-why" data-sg-why role="status"></p>
<button class="primary" type="button" data-sg-add disabled>${t('Add to cart')}</button><p class="sg-added" data-sg-added role="status"></p><a class="outline" data-sg-cart href="${german ? '/de' : ''}/cart-page" hidden>${t('View cart')}</a>
<ul class="sg-points"><li>${t('45.7 x 30.5 cm, 3 mm white aluminium panel. Orders to Germany and Austria are printed in Germany.')}</li><li>${t('Made for your indoor wall: a gift in the style of a Berlin street sign, not an official sign.')}</li><li>${t('I check every sign by eye before it goes to print.')}</li><li>${t('Letters, numbers and the usual punctuation, with German, Turkish, Polish and other European accents. No emoji.')}</li></ul>${legal}</section>
</div></div>`;
}

export function mountSign(host, s, api) {
  const german = !!api.german, t = x => signText(x, german), $ = q => host.querySelector(q);
  const photo = $('[data-sg-photo]'), photoButtons = [...host.querySelectorAll('[data-sg-photo-alt]')];
  let selectedPhoto = null;
  let disposed = false, frame = 0;
  s.lang ??= german ? 'de' : 'en';
  s.left ??= {text: '', arrow: 'none'}; s.right ??= {text: '', arrow: 'none'}; s.caption ??= ['', '', '']; s.name ??= ''; s.ortsteil ??= '';
  s.touched ??= {}; s.view ??= matchMedia('(max-width:899px)').matches ? 'close' : 'wall';
  const keys = ['name', 'ortsteil', 'left', 'right', 'c0', 'c1', 'c2'];
  const get = k => k === 'left' || k === 'right' ? s[k].text : k[0] === 'c' && k.length === 2 ? s.caption[Number(k[1])] : s[k];
  const set = (k, v) => { if (k === 'left' || k === 'right') s[k].text = v; else if (k[0] === 'c' && k.length === 2) s.caption[Number(k[1])] = v; else s[k] = v; };
  const max = {name: L.name, ortsteil: L.ortsteil, left: L.corner, right: L.corner, c0: L.captionLine, c1: L.captionLine, c2: L.captionLine};
  function occasion(k, force = false) {
    const o = OCCASIONS[k], ex = o[s.lang] || o.en;
    s.occasion = k;
    if (force || !s.touched.ortsteil) s.ortsteil = o.ortsteil;
    for (const side of ['left', 'right']) if (force || !s.touched[side]) s[side] = {text: fill(ex[side][0]), arrow: ex[side][1]};
    ex.caption.forEach((line, i) => { if (force || !s.touched['c' + i]) s.caption[i] = fill(line); });
  }
  if (!s.occasion) occasion('move');
  function fields() {
    for (const k of keys) $(`[data-sg="${k}"]`).value = get(k);
    for (const side of ['left', 'right']) $(`[data-sg-arrow="${side}"]`).value = s[side].arrow;
  }
  function refresh() {
    if (disposed) return;
    const c = signCheck(s), canAdd = c.ok && api.available() && !api.busy();
    $('[data-sg-add]').disabled = !canAdd;
    const why = !c.ok ? t(c.why).replace('{chars}', c.chars || '').replace('{field}', t({name: 'name', ortsteil: 'Ortsteil', 'left.text': 'bottom left', 'right.text': 'bottom right'}[c.field] || 'plaque line')) : api.available() ? '' : t('This sign is not on sale yet.');
    const box = $('[data-sg-why]'); box.textContent = why; box.classList.toggle('is-error', !c.ok && !c.wait && c.why !== 'Type the name for your sign.');
    host.querySelectorAll('[data-sg-occasion]').forEach(b => b.setAttribute('aria-checked', String(b.dataset.sgOccasion === s.occasion)));
    host.querySelectorAll('[data-sg-view]').forEach(b => b.setAttribute('aria-pressed', String(!selectedPhoto && b.dataset.sgView === s.view)));
    for (const k of keys) {
      const v = cleanSignText(get(k)), el = $(`[data-sg="${k}"]`);
      $(`[data-sg-count="${k}"]`).textContent = `${v.length}/${max[k]}`;
      const bad = !c.ok && !c.wait && (c.field === (k === 'left' || k === 'right' ? k + '.text' : k[0] === 'c' && k.length === 2 ? 'caption.' + (Number(k[1]) + 1) : k) || (c.field === 'caption.1' && c.why.startsWith('A plaque') && k[0] === 'c'));
      el.setAttribute('aria-invalid', String(!!bad && (k !== 'name' || !!cleanSignText(s.name))));
    }
    const shown = cleanSignText(s.name) || OCCASIONS[s.occasion]?.name || '';
    $('[data-sg-summary]').textContent = [t('Street sign 45 x 30 cm'), shown].filter(Boolean).join(' · ');
    $('[data-sg-example]').hidden = !!selectedPhoto || !!cleanSignText(s.name);
  }
  function draw() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      if (disposed) return;
      let f;
      const example = !cleanSignText(s.name), spec = {...signSpec(s), name: example ? OCCASIONS[s.occasion]?.name || 'Dein-Name-Straße' : s.name};
      try { f = normaliseSign(spec); } catch {   // draw what can be drawn while a field is still wrong
        const safe = v => [...cleanSignText(v)].filter(ch => !/[|~<>]/.test(ch)).join('');
        f = {name: safe(spec.name) || ' ', ortsteil: safe(spec.ortsteil).slice(0, L.ortsteil), left: {text: safe(s.left.text).slice(0, L.corner), arrow: s.left.arrow}, right: {text: safe(s.right.text).slice(0, L.corner), arrow: s.right.arrow}, caption: s.caption.map(safe).filter(Boolean).slice(0, 3)};
      }
      drawScene($('[data-sg-canvas]'), f, {view: s.view, exampleName: example, labels: german ? ['45,7 cm', '30,5 cm'] : ['45.7 cm', '30.5 cm']});
      if ($('[data-sg-mini]').classList.contains('is-on')) drawScene($('[data-sg-mini-canvas]'), f, {view: 'mini', exampleName: example});
    });
  }
  const update = () => { refresh(); draw(); };
  function showPhoto(button = null) {
    if (!photo || button === selectedPhoto) return;
    selectedPhoto = button;
    if (button) {
      photo.src = button.querySelector('img').src;
      photo.alt = button.dataset.sgPhotoAlt;
    }
    photo.hidden = !button;
    $('[data-sg-canvas]').hidden = !!button;
    $('[data-sg-preview-note]').hidden = !!button;
    $('[data-sg-photo-note]').hidden = !button;
    photoButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  }
  const edit = () => { showPhoto(); update(); };
  fields();
  // The store re-renders the page after an add: keep the confirmation and the cart link until the buyer edits the sign again.
  if (s.added) { $('[data-sg-added]').textContent = t('Added to your cart'); $('[data-sg-cart]').hidden = false; }
  host.querySelectorAll('[data-sg]').forEach(el => el.addEventListener('input', () => { const k = el.dataset.sg; set(k, el.value); s.touched[k] = true; s.added = false; $('[data-sg-added]').textContent = ''; edit(); }));
  host.querySelectorAll('[data-sg-arrow]').forEach(el => el.addEventListener('change', () => { s[el.dataset.sgArrow].arrow = el.value; s.touched[el.dataset.sgArrow] = true; edit(); }));
  host.querySelectorAll('[data-sg-occasion]').forEach(b => b.addEventListener('click', () => { occasion(b.dataset.sgOccasion); fields(); edit(); api.track?.('sign-occasion', {occasion: s.occasion}); }));
  host.querySelectorAll('[data-sg-view]').forEach(b => b.addEventListener('click', () => { s.view = b.dataset.sgView; edit(); }));
  photoButtons.forEach(b => b.addEventListener('click', () => { showPhoto(b); refresh(); }));
  host.querySelectorAll('[data-sg-word]').forEach(b => b.addEventListener('click', () => {
    const base = cleanSignText(s.name).replace(new RegExp(`[- ](${STREET_WORDS.join('|')})$`, 'i'), '').replace(/ /g, '-');
    if (!base) { $('[data-sg="name"]').focus(); return; }
    s.name = `${base}-${b.dataset.sgWord}`; s.touched.name = true; $('[data-sg="name"]').value = s.name; edit();
  }));
  $('[data-sg-add]').addEventListener('click', async () => {
    const c = signCheck(s);
    if (!c.ok || !api.available() || api.busy()) return update();
    $('[data-sg-add]').disabled = true;
    try { await api.add(c.fields); s.added = true; $('[data-sg-added]').textContent = t('Added to your cart'); $('[data-sg-cart]').hidden = false; api.track?.('sign-add', {occasion: s.occasion}); }
    catch (e) { $('[data-sg-why]').textContent = String(e?.message || e); $('[data-sg-why]').classList.add('is-error'); }
    finally { refresh(); }
  });
  // Wobby must be loaded before the page measures anything: storefront-element.js declares the font, api.fontUrl is a fallback.
  (async () => {
    try {
      if (api.fontUrl && ![...document.fonts].some(f => f.family.replace(/"/g, '') === FONT && f.status === 'loaded')) { const face = new FontFace(FONT, `url("${api.fontUrl}")`, {weight: '400'}); document.fonts.add(await face.load()); }
      await document.fonts.load(`400 100px ${FONT}`, 'ÄÖÜß');
      s.fontReady = [...document.fonts].some(f => f.family.replace(/["']/g, '') === FONT && f.status === 'loaded' && f.weight !== '700');
    } catch { s.fontReady = false; }
    update();
  })();
  update();
  api.track?.('sign-view');
  // Phone: once the large preview has scrolled away, a small sticky copy keeps the sign in view while the buyer types.
  const io = typeof IntersectionObserver === 'function' ? new IntersectionObserver(([e]) => { const on = !e.isIntersecting && e.boundingClientRect.top < 0; if ($('[data-sg-mini]').classList.toggle('is-on', on) && on) draw(); }, {threshold: 0}) : null;
  io?.observe($('.sg-stage'));
  return () => { disposed = true; io?.disconnect(); cancelAnimationFrame(frame); };
}
