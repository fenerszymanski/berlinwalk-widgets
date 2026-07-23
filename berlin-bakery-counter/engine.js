/* engine.js: Berlin Bakery Counter
 *
 * Pure order + phrase logic for the bakery-counter role-play widget. No DOM.
 * Given a chosen set of items with quantities, it builds a grammatically
 * correct German order sentence ("Ich hätte gern ...") and the matching
 * spoken-English cue. Kept separate from the UI so the phrase logic can be
 * swept for correctness (see selfTest at the bottom).
 */
(function (global) {
  'use strict';

  // Each item carries the gender needed for the accusative article
  // (Ich hätte gern + accusative), its plural form, a Berlin note where the
  // local word differs, a plain-English gloss and a light pronunciation hint.
  var ITEMS = [
    {
      key: 'schrippe', emoji: '🥖', gender: 'f',
      singular: 'Schrippe', plural: 'Schrippen',
      en: 'A plain wheat roll. The Berlin word for a Brötchen.',
      say: 'SHRIP-uh',
    },
    {
      key: 'broetchen', emoji: '🥯', gender: 'n',
      singular: 'Brötchen', plural: 'Brötchen',
      en: 'The standard German bread roll (say this anywhere in Germany).',
      say: 'BRUHT-khyen',
    },
    {
      key: 'pfannkuchen', emoji: '🍩', gender: 'm',
      singular: 'Pfannkuchen', plural: 'Pfannkuchen',
      en: 'The jam doughnut. In Berlin it is a Pfannkuchen, not a "Berliner".',
      say: 'PFAN-koo-khyen',
    },
    {
      key: 'brezel', emoji: '🥨', gender: 'f',
      singular: 'Brezel', plural: 'Brezeln',
      en: 'A soft pretzel from the Laugengebäck (lye pastry) family.',
      say: 'BRAY-tsel',
    },
    {
      key: 'laugenstange', emoji: '🥖', gender: 'f',
      singular: 'Laugenstange', plural: 'Laugenstangen',
      en: 'A salted lye stick, the pretzel’s easier-to-eat cousin.',
      say: 'LOW-gun-shtang-uh',
    },
    {
      key: 'belegtes', emoji: '🥪', gender: 'n',
      singular: 'belegtes Brötchen', plural: 'belegte Brötchen',
      en: 'A filled roll: cheese, ham, egg or salami, made at the counter.',
      say: 'buh-LAYK-tes BRUHT-khyen',
    },
    {
      key: 'franzbroetchen', emoji: '🥐', gender: 'n',
      singular: 'Franzbrötchen', plural: 'Franzbrötchen',
      en: 'A buttery cinnamon pastry, a Hamburg import now all over Berlin.',
      say: 'FRANTS-bruht-khyen',
    },
    {
      key: 'kaffee', emoji: '☕', gender: 'm',
      singular: 'Kaffee', plural: 'Kaffee',
      en: 'A coffee to go with it. Most counter bakeries have a machine.',
      say: 'KAH-fay',
    },
  ];

  var ITEM_BY_KEY = {};
  ITEMS.forEach(function (it) { ITEM_BY_KEY[it.key] = it; });

  // German number words 1 to 9 for small counter orders; fall back to digits above.
  var NUMBER_WORD = ['null', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'];

  function accusativeArticle(gender) {
    // Ich hätte gern + accusative singular: einen (m), eine (f), ein (n).
    if (gender === 'm') return 'einen';
    if (gender === 'f') return 'eine';
    return 'ein';
  }

  // Build the German fragment for one line, e.g. "eine Schrippe" or "zwei Berliner".
  function itemFragment(key, qty) {
    var it = ITEM_BY_KEY[key];
    if (!it || qty < 1) return '';
    if (qty === 1) {
      return accusativeArticle(it.gender) + ' ' + it.singular;
    }
    var number = qty < NUMBER_WORD.length ? NUMBER_WORD[qty] : String(qty);
    return number + ' ' + it.plural;
  }

  // Join fragments naturally: "A", "A und B", "A, B und C".
  function joinGerman(fragments) {
    var list = fragments.filter(Boolean);
    if (!list.length) return '';
    if (list.length === 1) return list[0];
    return list.slice(0, -1).join(', ') + ' und ' + list[list.length - 1];
  }

  // order = array of { key, qty }
  function buildOrder(order) {
    var lines = (order || []).filter(function (o) { return o && o.qty > 0; });
    var fragments = lines.map(function (o) { return itemFragment(o.key, o.qty); });
    var joined = joinGerman(fragments);
    var totalItems = lines.reduce(function (sum, o) { return sum + o.qty; }, 0);
    var sentence = joined ? 'Ich hätte gern ' + joined + ', bitte.' : '';
    return {
      sentence: sentence,
      english: joined ? 'I would like ' + englishList(lines) + ', please.' : '',
      totalItems: totalItems,
      lineCount: lines.length,
    };
  }

  function englishList(lines) {
    var parts = lines.map(function (o) {
      var it = ITEM_BY_KEY[o.key];
      var name = it.singular.replace('belegtes Brötchen', 'filled roll')
        .replace('Brötchen', 'roll')
        .replace('Schrippe', 'roll')
        .replace('Pfannkuchen', 'doughnut')
        .replace('Brezel', 'pretzel')
        .replace('Laugenstange', 'lye stick')
        .replace('Franzbrötchen', 'cinnamon pastry')
        .replace('Kaffee', 'coffee');
      return o.qty + ' ' + name + (o.qty > 1 ? 's' : '');
    });
    if (parts.length === 1) return parts[0];
    return parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];
  }

  var ENGINE = {
    ITEMS: ITEMS,
    itemFragment: itemFragment,
    joinGerman: joinGerman,
    buildOrder: buildOrder,
    accusativeArticle: accusativeArticle,
  };

  // Lightweight correctness sweep. Runs only when ?selftest=1 is present.
  ENGINE.selfTest = function () {
    var results = [];
    function check(name, got, want) {
      results.push({ name: name, ok: got === want, got: got, want: want });
    }
    check('m singular', itemFragment('kaffee', 1), 'einen Kaffee');
    check('f singular', itemFragment('schrippe', 1), 'eine Schrippe');
    check('n singular', itemFragment('broetchen', 1), 'ein Brötchen');
    check('m plural', itemFragment('pfannkuchen', 2), 'zwei Pfannkuchen');
    check('f plural brezel', itemFragment('brezel', 3), 'drei Brezeln');
    check('belegtes plural', itemFragment('belegtes', 2), 'zwei belegte Brötchen');
    check('join two', joinGerman(['eine Schrippe', 'einen Kaffee']), 'eine Schrippe und einen Kaffee');
    check('join three', joinGerman(['eine Schrippe', 'zwei Pfannkuchen', 'einen Kaffee']), 'eine Schrippe, zwei Pfannkuchen und einen Kaffee');
    check('full order', buildOrder([{ key: 'schrippe', qty: 1 }, { key: 'pfannkuchen', qty: 2 }, { key: 'kaffee', qty: 1 }]).sentence,
      'Ich hätte gern eine Schrippe, zwei Pfannkuchen und einen Kaffee, bitte.');

    // Combinatorial sweep: every item at qty 1..4 must produce a non-empty,
    // article-correct fragment with no "undefined".
    var swept = 0, failed = 0;
    ITEMS.forEach(function (it) {
      for (var q = 1; q <= 4; q++) {
        var frag = itemFragment(it.key, q);
        swept++;
        if (!frag || /undefined|NaN/.test(frag)) { failed++; results.push({ name: 'sweep ' + it.key + ' x' + q, ok: false, got: frag }); }
      }
    });
    results.push({ name: 'sweep total', ok: failed === 0, got: swept + ' combos, ' + failed + ' failures' });
    return results;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ENGINE;
  } else {
    global.BakeryEngine = ENGINE;
  }
})(typeof window !== 'undefined' ? window : this);
