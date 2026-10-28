// Gift vouchers for "Your Berlin Street in 1928" (27 Oct 2026). Pure helpers: which gift products the catalogue read carries, whether the entry may show,
// and the markup of the small "Give it as a gift" row on the 1928 page. The storefront element wires the clicks (data-action gift-toggle / gift-pick / gift-add).
// The two gifts are ordinary Wix digital products; nothing here changes the 1928 print flow, its prices or its data.

// ONE SWITCH. true: the entry only shows when the page address has ?gift=1 (or #gift), until the Store Terms addition is published.
// false: the entry is on for everybody (still hidden whenever the catalogue read does not carry the gift products).
export const GIFT_REQUIRES_URL_FLAG = false;   // opened for everybody 27 Oct 2026 after the redeem test and Store Terms 7a (Yusuf: "sonra herkese aç")

export const GIFT_IDS = Object.freeze({poster: '63dbf359-73aa-4053-049d-f07048f1bc3d', digital: 'f06ca073-474d-887d-9e7a-9d110c5ebb31'});
export const GIFT_KINDS = Object.freeze(['poster', 'digital']);
export const isGiftId = id => GIFT_KINDS.some(kind => GIFT_IDS[kind] === id);
export const giftKindOf = id => GIFT_KINDS.find(kind => GIFT_IDS[kind] === id) || null;

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

// Gate: pure, takes the address parts so tests can call it without a browser.
export function giftGateOpen(search = (typeof location !== 'undefined' ? location.search : ''), hash = (typeof location !== 'undefined' ? location.hash : '')) {
  if (!GIFT_REQUIRES_URL_FLAG) return true;
  try {if (new URLSearchParams(search).get('gift') === '1') return true;} catch (e) { /* malformed query: treat as closed */ }
  return String(hash || '').replace(/^#/, '').toLowerCase() === 'gift';
}

// The gifts the catalogue read really carries: in stock, a valid price, and a presentation entry (name, line texts) in data/presentation.json.
// Anything missing leaves the list empty, so a hidden or sold-out Wix product never produces a button.
export function giftOffers(catalogue, presentation, formatMoney) {
  const rows = Array.isArray(catalogue?.products) ? catalogue.products : [], meta = Array.isArray(presentation) ? presentation : [];
  return GIFT_KINDS.map(kind => {
    const row = rows.find(item => item.productId === GIFT_IDS[kind]), info = meta.find(item => item.wixProductId === GIFT_IDS[kind] && item.enabled !== false);
    const price = row?.discountedPrice ?? row?.price;
    if (!row || !info || row.inStock !== true || row.visible === false || !Number.isFinite(price) || price < 0) return null;
    const label = row.formattedDiscountedPrice || row.formattedPrice || formatMoney(row.currency, price);
    if (!label) return null;
    return {kind, id: row.productId, price, priceLabel: label, row, info};
  }).filter(Boolean);
}

const GIFT_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="8.5" width="17" height="11" rx="1.5"/><path d="M12 8.5v11M3.5 13h17"/><path d="M12 8.5C10.6 5 7 4.6 7 6.7c0 1.3 2.4 1.8 5 1.8zM12 8.5c1.4-3.5 5-3.9 5-1.8 0 1.3-2.4 1.8-5 1.8z"/></svg>';
const CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5"/></svg>';

// state: {open, kind, redirecting}. Returns '' when there is nothing to show.
export function giftHtml(offers, state = {}) {
  if (!offers?.length) return '';
  const picked = offers.find(offer => offer.kind === state.kind) || offers[0];
  const prices = offers.map(offer => `${esc(offer.info.giftLabel || offer.kind)} ${esc(offer.priceLabel)}`).join(' · ');
  const choices = offers.map(offer => `<button type="button" role="radio" class="ys-size ys-gift-choice" data-action="gift-pick" data-gift-kind="${esc(offer.kind)}" aria-checked="${offer === picked}">${esc(offer.info.giftLabel)}<small>${esc(offer.priceLabel)} · ${esc(offer.info.giftCovers)}</small></button>`).join('');
  return `<div class="ys-gift" data-ys-gift>
    <button type="button" class="ys-gift-toggle" data-action="gift-toggle" aria-expanded="${!!state.open}" aria-controls="ys-gift-panel">${GIFT_ICON}<span class="ys-gift-head"><strong>No address? Give a voucher.</strong><small>${prices}</small></span>${CHEVRON}</button>
    <div class="ys-gift-panel" id="ys-gift-panel" data-ys-gift-panel ${state.open ? '' : 'hidden'}>
      <div class="ys-sizes ys-gift-choices" role="radiogroup" aria-label="Choose a gift">${choices}</div>
      <p class="ys-gift-how">A bigger size or another paper: the recipient pays only the difference at checkout. Code and printable card by email, normally within the hour and no later than 24 hours. Valid three years.</p>
      <button type="button" class="primary ys-gift-add" data-action="gift-add" data-gift-kind="${esc(picked.kind)}" ${state.redirecting ? 'disabled' : ''}>${state.redirecting ? 'Added. Opening your cart…' : 'Add gift to cart'}</button>
    </div>
  </div>`;
}

// Cart line for a gift: friendly title, a type line from the presentation entry, thumbnail (the Wix main image if the catalogue read has one, else the local card picture).
export function giftLineInfo(line, offers, presentation, assetUrl, wixImage) {
  const kind = giftKindOf(line?.productId);
  if (!kind) return null;
  const info = (Array.isArray(presentation) ? presentation : []).find(item => item.wixProductId === GIFT_IDS[kind]) || {};
  const offer = (offers || []).find(item => item.kind === kind);
  const remote = wixImage ? wixImage(offer?.row?.mainMedia) : '';
  return {kind, name: info.name || 'Gift voucher: Your Berlin Street in 1928', typeLine: info.typeLine || '', note: info.giftNote || 'Code and printable card by email, normally within the hour',
    image: remote && remote !== '#' ? remote : info.image ? assetUrl('assets/' + info.image) : ''};
}
