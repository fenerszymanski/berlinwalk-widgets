// Berlin street sign with your name (45 x 30 cm aluminium, Gelato metallic white), 27 Nov 2026.
// Wix gives a product at most two custom text fields:
//   1 "Name on the sign" (32)                    the name exactly as printed, readable in the Wix order and the cart
//   2 "Sign details (set by the preview)" (500)  S1|lang|occasion|ortsteil|leftArrow|left|rightArrow|right|c1|c2|c3~crc32
// The CRC32 (UTF-8, same as calendar-encoding.js) covers the name AND the record, so a hand-typed or cut field is caught
// before printing. Text rules are the print generator's (content/products/berlin-sign/make_sign.py clean()): NFC, typographic
// dashes and quotes turned plain, spaces collapsed, Wobby covers Latin-1 + Latin Extended-A only. The decoder for the fulfil job
// is content/products/berlin-sign/sign_fields.py; tests: tests/sign-encoding.test.mjs (also runs the Python side).
export const SIGN_PRODUCT_ID = '47769d05-a3fa-4e22-8b0b-ae9cd3cc67e3';   // Wix product, created hidden on 27 Nov 2026 (custom text fields added in the dashboard)
export const SIGN_FIELDS = Object.freeze({name: 'Name on the sign', details: 'Sign details (set by the preview)'});
export const SIGN_LIMITS = Object.freeze({name: 32, ortsteil: 28, corner: 24, captionLine: 46, captionLines: 3, nameField: 32, detailsField: 500});
export const SIGN_OCCASIONS = Object.freeze(['move', 'farewell', 'wedding', 'citizenship', 'birth', 'birthday', 'other']);
export const SIGN_GELATO_UID = 'metallic_12x18-inch-300x450-mm_3-mm_4-0_hor';
const ARROWS = Object.freeze({none: 'n', left: 'l', right: 'r'});
const ARROW_OF = Object.freeze({n: 'none', l: 'left', r: 'right'});
const SWAP = {'\u2013': '-', '\u2014': '-', '\u2010': '-', '\u2011': '-', '\u201e': '"', '\u201c': '"', '\u201d': '"',
  '\u201a': "'", '\u2018': "'", '\u2019': "'", '\u00a0': ' ', '\u2026': '...', '\u2192': '', '\u2190': ''};

export class SignError extends Error {
  constructor(field, code, detail = '') { super(`SIGN_${code}`); this.field = field; this.code = code; this.detail = detail; }
}

// Same steps as make_sign.py clean(), in the same order.
export function cleanSignText(value) {
  let s = String(value ?? '').normalize('NFC');
  s = [...s].map(c => SWAP[c] ?? c).join('');
  return s.split(/[\t\n\v\f\r \u0085\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\u001c-\u001f]+/).filter(Boolean).join(' ');
}
// Characters the sign cannot print or the record cannot carry. Same lists as make_sign.py: measured on Wobby-Regular.otf on
// 27 Nov 2026, these symbols have no glyph (they would print as an empty box). | and ~ (the record's separators) are among them.
export const SIGN_NO_GLYPH = new Set('$<=>[\\]^_`{|}~\u00a2\u00a3\u00a4\u00a5\u00a6\u00a7\u00a8\u00a9\u00aa\u00ac\u00ad\u00ae\u00af\u00b1\u00b2\u00b3\u00b4\u00b5\u00b6\u00b8\u00b9\u00ba\u00bc\u00bd\u00be\u00d7\u00f7\u0138\u0149\u014a\u014b\u017f');
const SIGN_EXTRA = new Set([0x1e9e, 0x218, 0x219, 0x21a, 0x21b, 0x20ac]);   // capital sharp s, Romanian S/T comma, euro sign
export const signPrintable = c => { const n = c.codePointAt(0); return ((n >= 0x20 && n <= 0x7e) || (n >= 0xa0 && n <= 0x17f) || SIGN_EXTRA.has(n)) && !SIGN_NO_GLYPH.has(c); };
export function badSignChars(s) {
  return [...new Set([...s].filter(c => !signPrintable(c)))];
}
export function checkSignText(value, field, max, required = false) {
  const s = cleanSignText(value);
  if (required && !s) throw new SignError(field, 'EMPTY');
  if (s.length > max) throw new SignError(field, 'TOO_LONG', `${s.length}/${max}`);
  const bad = badSignChars(s);
  if (bad.length) throw new SignError(field, 'CHARS', bad.join(' '));
  return s;
}
export function signChecksum(value) {
  let c = 0xffffffff;
  for (const b of new TextEncoder().encode(value)) { c ^= b; for (let i = 0; i < 8; i++) c = (c >>> 1) ^ ((c & 1) ? 0xedb88320 : 0); }
  return ((c ^ 0xffffffff) >>> 0).toString(16).padStart(8, '0');
}
const corner = (c, side) => {
  const v = typeof c === 'string' ? {text: c} : (c || {});
  const arrow = String(v.arrow || 'none').toLowerCase();
  if (!Object.hasOwn(ARROWS, arrow)) throw new SignError(side + '.arrow', 'ARROW');
  return {text: checkSignText(v.text, side + '.text', SIGN_LIMITS.corner), arrow};
};
// The sign in the shape make_sign.py reads, cleaned and checked. Throws SignError.
export function normaliseSign(spec) {
  const lang = spec.lang === 'de' ? 'de' : spec.lang === 'en' || spec.lang == null ? 'en' : null;
  if (!lang) throw new SignError('lang', 'LANG');
  const occasion = spec.occasion || 'other';
  if (!SIGN_OCCASIONS.includes(occasion)) throw new SignError('occasion', 'OCCASION');
  const raw = Array.isArray(spec.caption) ? spec.caption : typeof spec.caption === 'string' ? spec.caption.split('\n') : [];
  const caption = raw.map((x, i) => checkSignText(x, `caption.${i + 1}`, SIGN_LIMITS.captionLine)).filter(Boolean);
  if (caption.length > SIGN_LIMITS.captionLines) throw new SignError('caption', 'LINES', `${caption.length}/${SIGN_LIMITS.captionLines}`);
  return {lang, occasion, name: checkSignText(spec.name, 'name', SIGN_LIMITS.name, true), ortsteil: checkSignText(spec.ortsteil, 'ortsteil', SIGN_LIMITS.ortsteil),
    left: corner(spec.left, 'left'), right: corner(spec.right, 'right'), caption};
}
export function encodeSign(spec) {
  const f = normaliseSign(spec), c = [...f.caption, '', '', ''].slice(0, 3);
  const record = ['S1', f.lang, f.occasion, f.ortsteil, ARROWS[f.left.arrow], f.left.text, ARROWS[f.right.arrow], f.right.text, ...c].join('|');
  const details = record + '~' + signChecksum(f.name + '\n' + record);
  if (f.name.length > SIGN_LIMITS.nameField) throw new SignError('name', 'FIELD_FULL');
  if (details.length > SIGN_LIMITS.detailsField) throw new SignError('details', 'FIELD_FULL');
  return {[SIGN_FIELDS.name]: f.name, [SIGN_FIELDS.details]: details};
}
export function decodeSign(fields) {
  const name = String(fields?.[SIGN_FIELDS.name] ?? ''), details = String(fields?.[SIGN_FIELDS.details] ?? '');
  const cut = details.lastIndexOf('~'), record = cut < 0 ? '' : details.slice(0, cut), crc = cut < 0 ? '' : details.slice(cut + 1);
  const p = record.split('|');
  if (p.length !== 11 || p[0] !== 'S1' || !/^[0-9a-f]{8}$/.test(crc)) throw new SignError('details', 'RECORD');
  if (signChecksum(name + '\n' + record) !== crc) throw new SignError('details', 'CHECKSUM');
  if (!ARROW_OF[p[4]] || !ARROW_OF[p[6]]) throw new SignError('details', 'RECORD');
  const spec = {lang: p[1], occasion: p[2], name, ortsteil: p[3], left: {text: p[5], arrow: ARROW_OF[p[4]]}, right: {text: p[7], arrow: ARROW_OF[p[6]]}, caption: p.slice(8).filter(Boolean)};
  const again = encodeSign(spec);   // the record must already be in its clean, canonical form
  if (again[SIGN_FIELDS.name] !== name || again[SIGN_FIELDS.details] !== details) throw new SignError('details', 'NOT_CANONICAL');
  return normaliseSign(spec);
}
