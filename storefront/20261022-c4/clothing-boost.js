// Clothing product page boost (Yusuf approved 21 Nov 2026, items 1 to 4 of the Meta ad review; receipt output/store/clothing-page-boost-20261121/RESULT_TR.md).
// Pure helpers for design2.js, kept free of the element so tests can import them:
//  1. pageMedia: when the colour on the page has a photo of a person wearing the garment, that photo is the first picture and the garment preview (and the
//     print close-up, where a product has one) move to the thumbnails. Products or colours without such a photo are drawn exactly as before.
//  2. offerLineHtml: the approved Black Week sentence next to the price (black-week.js holds the words and the date gate).
//  3. pickSecondItems / secondItemsHtml: up to three other items from the same Black Week collection, each a plain link to its product page.
//  4. sizeChartFor / sizeGuideHtml: an expandable size guide with the manufacturer chart of the garment blank.
import {BLACK_WEEK,blackWeekActive} from './black-week.js?v=bf-hero-20261127-v1';

// 1. Person photos. Every file below was checked by short-lived look agents on 21 Nov 2026 (contact sheets of all 144 apparel gallery photos, yes/no per
// tile; a Sonnet look judged the five borderline ones). The number ranks a photo as a first picture: +2 when the print is readable, +1 when the photo is
// portrait or square (a 3:2 landscape photo floats smaller in the 3:4 stage), on a base of 1; so 4 = readable print and portrait or square, 1 = small print
// and landscape. Photos with a visible flaw or a print too small for a first picture are left out and stay in the thumbnails only. A photo that names another
// colour (modelColor) is never used for a colour it does not show. New gallery photos need a look and a line here before they can lead.
export const PERSON_PHOTOS = Object.freeze({
 'berlin-cliches-20261117/expanded-colors/doner-bear-queue-hoodie--sand--yusuf.png':2,'berlin-cliches-20261117/expanded-colors/mit-karte-bitte-classic-t-shirt--navy--yusuf.png':2,'berlin-cliches-20261117/expanded-colors/pfand-you-deserve-better-classic-t-shirt--military-green--yusuf.png':2,'gallery-0049c96efceec5242d1cc9c0.jpg':4,
 'gallery-0439169743a5133bc7e7e0b2.jpg':4,'gallery-04bf850346a726a0476829ce.jpg':4,'gallery-05528294c4ff8b41326bcfaf.jpg':2,'gallery-05834cda11e404e1e401d391.jpg':3,
 'gallery-0aa8e5634e15767ec137e725.jpg':4,'gallery-0bd83f410c04635cfc173fd2.jpg':3,'gallery-0ce0ebd09a3ece52b8004513.jpg':4,'gallery-0d6da20844ef0e4ba6d2441e.jpg':4,
 'gallery-0e57abc60420850e4b1736a6.jpg':4,'gallery-109e5762751fb43c2df80a91.jpg':4,'gallery-11c19a80928cbb97ebdd7160.jpg':4,'gallery-12d24faed6c69372e74414bb.jpg':3,
 'gallery-14bd35d9da96d5e18bbbae4a.jpg':4,'gallery-17e9f056052e8811dd0c012c.jpg':4,'gallery-1da82aab0ba808a1afd9ccf7.jpg':4,'gallery-1e03d9670ae1a15395af964b.jpg':4,
 'gallery-1faa5f0be9082e99e1374a3e.jpg':3,'gallery-229ce8bfe7ea670a412f3ced.jpg':4,'gallery-235e3e7b025549f007b04135.jpg':4,'gallery-2a9d53b26d71672736c63cc9.jpg':2,
 'gallery-2bae9368e1fdab577c927beb.jpg':4,'gallery-2c1d9405df09dd706be8f4cd.jpg':4,'gallery-2e2333dd163202e794b62547.jpg':4,'gallery-2e479a0f41ba1cd3c58270cf.jpg':2,
 'gallery-2eaaa33d40f1501f46b564fe.jpg':3,'gallery-30f29ccae677671de8ff4e85.jpg':2,'gallery-314efc8907e771e596c4a9ef.jpg':4,'gallery-334372f41bf32c6fb2dfd9a0.jpg':2,
 'gallery-361a7d9bd30bdd8475ed607d.jpg':4,'gallery-383faf272ae66638cfe7b065.jpg':4,'gallery-3875370ce8b4e3593f15908d.jpg':4,'gallery-3a2c6b303d4be9308591f5af.jpg':4,
 'gallery-3add76945263834d718f0775.jpg':1,'gallery-3eea36320baa33d0813e237c.jpg':4,'gallery-42cd2b2f61908b7ebbd27d6d.jpg':4,'gallery-43b846fbcf40eb75ae83e449.jpg':4,
 'gallery-43d988667f7aa3d0667d46e8.jpg':4,'gallery-44972506d5c3ed820d36bf02.jpg':4,'gallery-44bbc9bcbff1056e325e8b73.jpg':4,'gallery-456a446f427e9565b447ca52.jpg':3,
 'gallery-4df4be8ddab7f0bf36f1915e.jpg':3,'gallery-4f8ce255d7863e260d009cc0.jpg':2,'gallery-50830dacc18165570ea01a6c.jpg':2,'gallery-516a2e46269aafd7e2cd286e.jpg':4,
 'gallery-52ee008206180f2562e38357.jpg':4,'gallery-545a041df4d0fb066999bf27.jpg':4,'gallery-55491292632f6939465fefd4.jpg':2,'gallery-56ea1d4b4b69e9cbe70ea70b.jpg':1,
 'gallery-5865403d4c48568ffd961306.jpg':2,'gallery-5896c32da9032e7d83b6f73a.jpg':4,'gallery-5aa386d5f32f0ecf2ceeca90.jpg':2,'gallery-5f2a52979708482a343bbc35.jpg':4,
 'gallery-61b0e1ee3d36ba4d5b92dab7.jpg':4,'gallery-6329f5858ff95a036d89c94f.jpg':4,'gallery-63f0eec79971352a504a29eb.jpg':4,'gallery-65c0242104adb4ac4a0c3a54.jpg':4,
 'gallery-6c5770b6568247a49550b74a.jpg':3,'gallery-6d48a3a469a57aaeea794fcb.jpg':4,'gallery-6e85a8eaed487a452e22029b.jpg':2,'gallery-74c7245f1d7e53b82200b55d.jpg':2,
 'gallery-7714de047e874b8fb8cc173a.jpg':2,'gallery-7acff05c1aa38584b8e671f9.jpg':4,'gallery-7b7e7be691d57bee9dd84831.jpg':4,'gallery-7ddf23ac0f981d569b0a1221.jpg':4,
 'gallery-7f1ed981cc34c0da0806d785.jpg':4,'gallery-801ec1f0a40bc95537aa7553.jpg':2,'gallery-811dbe293346c8e8f9ee059e.jpg':2,'gallery-8383824a2f5b8d27ee62eaf4.jpg':4,
 'gallery-8461964acb677710bab22e57.jpg':4,'gallery-866a18925495fa53e56a2f3a.jpg':4,'gallery-867146fc8ce16816f65f0d11.jpg':2,'gallery-8b2ea30b5ccd49dadc643bb7.jpg':4,
 'gallery-8bc4e7f3d2503761bbb6dc09.jpg':4,'gallery-91dbabd2c82d75cc84991043.jpg':4,'gallery-9459685edbf1f21f8e7928ce.jpg':4,'gallery-9502bba5caecb1628384b763.jpg':4,
 'gallery-986dd273f3791d77b72c3982.jpg':4,'gallery-991f7bc9da1fe985050c5bad.jpg':3,'gallery-9937f54e475edbdcefc9e945.jpg':4,'gallery-a10f758a25f61089bbc8ffb5.jpg':3,
 'gallery-a16617ff21a980d17a6d994b.jpg':2,'gallery-a1ab17574807a66959cb81cb.jpg':4,'gallery-a2271307eb48225fa24abde6.jpg':2,'gallery-a3f8b692ecdbfbf5c28a7b6c.jpg':2,
 'gallery-a6a1d584b3e67c910520ebb4.jpg':4,'gallery-a6be952f0834d7687893f992.jpg':3,'gallery-a7a5ceb520562b75e9a67969.jpg':4,'gallery-aa8b926699f6a37f22babbc4.jpg':4,
 'gallery-abecfe6ceeee709ad34a6e61.jpg':4,'gallery-aca844e414f61144e9361377.jpg':2,'gallery-b2e99899bd6b711ce71a462e.jpg':2,'gallery-b38a1864dd3dcc4faa77fc06.jpg':3,
 'gallery-b4645b24269e087a2e5fb053.jpg':4,'gallery-b53227f1af876ebfa59977c7.jpg':4,'gallery-b692e62fc47f4c1b4184ab02.jpg':4,'gallery-b841ecd6ceef4de4211d6e31.jpg':2,
 'gallery-bad38d0d9448ef02b6b9f1dc.jpg':4,'gallery-be6d443d7965f88febc2d8fb.jpg':4,'gallery-bf3f6b752f453ea7ead75dd6.jpg':3,'gallery-bf7b867212ce756d97d3e0e4.jpg':4,
 'gallery-c1fc4a12cb724bc9bcf5046b.jpg':2,'gallery-c3f175cea6bc42ad281be570.jpg':2,'gallery-c419b1b711ce5b96a0bfc711.jpg':3,'gallery-c442cbffd20710cd7b427d17.jpg':4,
 'gallery-c55f785f5279d476c40bf3d3.jpg':4,'gallery-c816b9464ac90bdeb52e2f20.jpg':4,'gallery-cb737278dcea89b39beb2663.jpg':4,'gallery-cd1649c15770b8edfdf9bbe1.jpg':4,
 'gallery-cd7e431e3be6bf1b81f52aaf.jpg':4,'gallery-cea22eafb09ba979dc77a18c.jpg':2,'gallery-cf695988ed5a4feb27d57863.jpg':4,'gallery-db4d1284a9f969dc651890f6.jpg':4,
 'gallery-dc95a079fe6d059308fb62e5.jpg':4,'gallery-de3c712a5df57dd590f02c22.jpg':3,'gallery-de4035d25a260dedf5c96ff2.jpg':4,'gallery-dec1c578216172692655c0a7.jpg':3,
 'gallery-e118ebe7a594dbc321856123.jpg':4,'gallery-e126b8ab75d9e18e4528164a.jpg':3,'gallery-e192ec6996bf383cdc4a0349.jpg':4,'gallery-ee9ba8dbf56158827c12690d.jpg':4,
 'gallery-eea8a15de3a3ecd1f70ee02f.jpg':4,'gallery-f1c6911458d37970957156f5.jpg':4,'gallery-f33a4fa615f3d7262aecb1e0.jpg':2,'gallery-f471013834209b8efb710b93.jpg':4,
 'gallery-f65cc3e16f4982b13e481ce1.jpg':4,'gallery-fa564aa3bfa503acc8bb120e.jpg':4,'gallery-fb23dcfb7c0702e5a3e9a505.jpg':4,'gallery-fb544115d348950a9ba1cbe6.jpg':4,
 'gallery-fb7594c94be0555d75340335.jpg':2,'gallery-ff56041a62e2af206d2100ca.jpg':3,'gallery-ff9fb4fc4483f7ee0d146cb8.jpg':4,
 // 24 Nov 2026: seven street-model photos were replaced by one photo per Gelato variant (commit 9269eec3), plus the Späti Classic Black photo of the same day.
 // Haiku look of all eight: a person wears the shirt, the colour matches, no flaw; the print is readable on six, and on the two A Window in Berlin photos the
 // building reads but the thin title does not, so those rank lower. All are 4:5 portrait.
 'gallery-c4e3c3fd11e548a5291bd36b-1250px-q76.jpg':4,'gallery-0e2abd148110a3946b19440d-1250px-q76.jpg':4,'gallery-59cdf79a1c5be62ead457b67-1250px-q76.jpg':4,'gallery-5d68c53327e23d660504d3cb-1250px-q76.jpg':4,
 'gallery-de7c5869c62cdacd984d11dc-1250px-q76.jpg':4,'gallery-d90cb0d95246568fe8776ba2-1250px-q76.jpg':4,'gallery-6ada493e7daf52e676280b45-1250px-q76.jpg':2,'gallery-0583cc1d4c9fca4d845dc711-1250px-q76.jpg':2
});
export function personFirst(media, color = media?.color) {
  const pool = (media?.gallery || []).filter(item => PERSON_PHOTOS[item?.image] && (!item.modelColor || item.modelColor === color));
  return pool.reduce((best, item) => (!best || PERSON_PHOTOS[item.image] > PERSON_PHOTOS[best.image] ? item : best), null);
}
// media = layer.apparelMedia(product, color). Returns the first picture and the gallery behind it, in the order the thumbnails use.
export function pageMedia(media, color = media?.color, garmentFirst = false) {
  if (!media?.lead) return null;
  const person = personFirst(media, color), garment = media.printDetail ? [media.printDetail, media.lead] : [media.lead];
  if (garmentFirst) {
    const paired = person ? media.gallery.filter(item => item.pairedWith === person.image) : [];
    const models = person ? [person, ...paired, ...media.gallery.filter(item => item !== person && !paired.includes(item))] : media.gallery;
    return {first: media.lead, gallery: [...models, ...(media.printDetail ? [media.printDetail] : [])], person: null};
  }
  if (!person) return {first: media.printDetail || media.lead, gallery: media.printDetail ? [media.lead, ...media.gallery] : media.gallery, person: null};
  const paired = media.gallery.filter(item => item.pairedWith === person.image);
  return {first: person, gallery: [...paired, ...garment, ...media.gallery.filter(item => item !== person && !paired.includes(item))], person};
}

// 2. Offer line. The sentence is BLACK_WEEK.copy.<lang>.title, unchanged; the chunks that must not break stay in one piece (same technique as the hero).
export function offerLineHtml({de = false, esc, now} = {}) {
  if (!blackWeekActive(now)) return '';
  const c = BLACK_WEEK.copy[de ? 'de' : 'en'];
  const text = c.keep.reduce((html, chunk) => html.replace(esc(chunk), `<span class="bw-offer-nb">${esc(chunk)}</span>`), esc(c.title));
  // 27 Nov 2026 (Yusuf: the sentence stood on the poster list next to digital files without saying which offer it was): the line names
  // Black Week and its scope (printed posters, T-shirts, hoodies), so it never reads as if digital files were included.
  const scope = de ? 'Gedruckte Poster, T-Shirts und Hoodies.' : 'Printed posters, T-shirts and hoodies.';
  return `<p class="bw-offer bw-raw" data-bw-offer data-bw-until="${esc(BLACK_WEEK.until)}"><b class="bw-offer-name">${esc(c.name)}:</b> ${text}<small class="bw-offer-note">${esc(scope + ' ' + c.note)}</small></p>`;
}
export const SECOND_HEADING = Object.freeze({en: 'You might also like', de: 'Das könnte dir auch gefallen'});
export function secondHeading({de = false, now} = {}) {
  return blackWeekActive(now) ? BLACK_WEEK.copy[de ? 'de' : 'en'].title : SECOND_HEADING[de ? 'de' : 'en'];
}
// The same sentence with its unbreakable chunks (as in the hero), or the neutral heading as plain text.
const headingHtml = ({de, esc, now}) => {
  if (!blackWeekActive(now)) return esc(SECOND_HEADING[de ? 'de' : 'en']);
  const c = BLACK_WEEK.copy[de ? 'de' : 'en'];
  return c.keep.reduce((html, chunk) => html.replace(esc(chunk), `<span class="bw-offer-nb">${esc(chunk)}</span>`), esc(c.title));
};

// 3. Second items. candidates = cards already filtered for stock and collection, in the order of preference; one card per design.
export function pickSecondItems(candidates, {limit = 3, perKind = 2} = {}) {
  const seen = new Set(), kinds = {}, picked = [];
  for (const card of candidates) {
    const key = card?.designKey || card?.id;
    if (!card || !key || seen.has(key) || (kinds[card.kind] || 0) >= perKind) continue;
    seen.add(key); kinds[card.kind] = (kinds[card.kind] || 0) + 1; picked.push(card);
    if (picked.length === limit) break;
  }
  return picked.length >= 2 ? picked : [];
}
// card = {href, name, kind: 'hoodie' | 'tee' | 'poster', tile: html of the picture link}
export function secondItemsHtml({de = false, esc, cards, now} = {}) {
  if (!cards?.length) return '';
  const kind = {hoodie: 'Hoodie', tee: de ? 'T-Shirt' : 'T-shirt', poster: 'Poster'};
  const items = cards.map(card => `<article class="bw-pick" data-bw-pick>${card.tile}<a class="bw-pick-name" href="${esc(card.href)}">${esc(card.name)}</a><span class="bw-pick-kind">${esc(kind[card.kind] || '')}</span></article>`).join('');
  return `<section class="bw-picks bw-raw" data-bw-picks aria-labelledby="bw-picks-h"><h2 id="bw-picks-h">${headingHtml({de, esc, now})}</h2>${blackWeekActive(now)?`<p class="bw-offer-note">${esc(BLACK_WEEK.copy[de ? 'de' : 'en'].note)}</p>`:''}<div class="bw-pick-grid">${items}</div></section>`;
}

// 4. Size guide. Numbers are the manufacturers' published charts converted from inches to cm at one decimal (Gildan 64000 spec sheet, Bella+Canvas 3001,
// Gildan SF500 spec sheet), which Gelato's own garment data confirms within its stated 2.5 cm tolerance; receipt output/store/clothing-page-boost-20261121/size-guides/.
// Rows are [size, body length, half chest]: length from the highest shoulder point to the hem, chest as the width across the chest, laid flat.
export const SIZE_CHARTS = Object.freeze({
  'classic-tee': Object.freeze({kind: 'tee', rows: Object.freeze([["S",71.1,45.7],["M",73.7,50.8],["L",76.2,55.9],["XL",78.7,61.0],["2XL",81.3,66.0],["3XL",83.8,71.1]])}),
  'premium-tee': Object.freeze({kind: 'tee', rows: Object.freeze([["S",71.1,45.7],["M",73.7,50.8],["L",76.2,55.9],["XL",78.7,61.0],["2XL",81.3,66.0],["3XL",83.8,71.1]])}),
  'hoodie-sf500': Object.freeze({kind: 'hoodie', rows: Object.freeze([["S",71.1,50.8],["M",73.7,55.9],["L",76.2,61.0],["XL",78.7,66.0],["2XL",81.3,71.1],["3XL",83.8,76.2]])})
});
export function sizeChartFor(product) {
  if (product?.group !== 'apparel' || typeof product.id !== 'string') return null;
  const key = /-classic$/.test(product.id) ? 'classic-tee' : /-premium$/.test(product.id) ? 'premium-tee' : /-sf500$/.test(product.id) ? 'hoodie-sf500' : '';
  return key ? {id: key, ...SIZE_CHARTS[key]} : null;
}
const SIZE_TEXT = Object.freeze({
  en: {title: 'Size guide', size: 'Size', length: 'Length (cm)', chest: 'Chest width (cm)', tee: 'T-shirt', hoodie: 'hoodie',
    note: kind => `Measured flat, in cm. Length runs from the highest point of the shoulder to the hem. Chest width is straight across the chest, so double it for the full chest. Lay a ${kind} that fits you on a table and compare. Measurements can vary by up to 2.5 cm.`},
  de: {title: 'Größentabelle', size: 'Größe', length: 'Länge (cm)', chest: 'Brustbreite (cm)', tee: 'T-Shirt', hoodie: 'Hoodie',
    note: kind => `Flach gemessen, in cm. Die Länge reicht vom höchsten Punkt der Schulter bis zum Saum. Die Brustbreite wird quer über der Brust gemessen, für den ganzen Brustumfang verdoppeln. Lege ein ${kind}, das dir passt, flach hin und vergleiche. Die Maße können um bis zu 2,5 cm abweichen.`}
});
export function sizeGuideHtml({product, de = false, esc} = {}) {
  const chart = sizeChartFor(product);
  if (!chart) return '';
  const t = SIZE_TEXT[de ? 'de' : 'en'], num = value => de ? value.toFixed(1).replace('.', ',') : value.toFixed(1);
  const rows = chart.rows.map(([size, length, chest]) => `<tr><th scope="row">${esc(size)}</th><td>${num(length)}</td><td>${num(chest)}</td></tr>`).join('');
  return `<details class="bw-size-guide bw-raw" data-size-guide="${esc(chart.id)}"><summary>${esc(t.title)}</summary><div class="bw-size-body"><table><caption class="sr-only">${esc(t.title)}</caption><thead><tr><th scope="col">${esc(t.size)}</th><th scope="col">${esc(t.length)}</th><th scope="col">${esc(t.chest)}</th></tr></thead><tbody>${rows}</tbody></table><p>${esc(t.note(t[chart.kind]))}</p></div></details>`;
}

// A page that stays open across the end of Black Week draws itself again one moment after 30 Nov 23:59:59 so the offer line and the heading change without a reload.
export function armBlackWeekEnd(owner, now = Date.now()) {
  clearTimeout(owner.bwEndTimer);
  const left = Date.parse(BLACK_WEEK.until) - now;
  if (left > 0 && left < 2 ** 31 - 1) owner.bwEndTimer = setTimeout(() => {owner.bwEndTimer = null; if (owner.isConnected) owner.render();}, left + 300);
}
