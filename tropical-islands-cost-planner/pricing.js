/* Tropical Islands Cost Planner — pricing engine.
   All entry prices are the official "from" prices on tropical-islands.de
   (online) and the on-site regular prices (walk-in). Final prices are
   date-based, so every figure is presented as "from €". */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.TICostPlanner = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {

  var PRICES = {
    pure: {
      online: { adult: 34.90, teen: 29.90, child: 29.90 },
      walkin: { adult: 55.90, teen: 48.50, child: 45.50 }
    },
    sauna: {
      online: { adult: 39.90, teen: 35.90, child: 32.90 },
      walkin: { adult: 65.90, teen: 54.50, child: 51.50 }
    },
    evening: {
      online: { adult: 29.90, teen: 24.90, child: 22.90 },
      walkin: null // evening walk-in prices are not published as a stable table
    }
  };
  var FAMILY = { twoPlusThree: 129.90, onePlusThree: 119.90 };
  var BB_TICKET = 36.50;      // Brandenburg-Berlin-Ticket, up to 5 people, 2026
  var PARKING_MIN = 6.00, PARKING_MAX = 8.00;

  function round2(x) { return Math.round(x * 100) / 100; }

  /* state: {adults, teens, kids, babies, layer: 'pure'|'sauna'|'evening',
             booking: 'online'|'walkin', travel: 'dticket'|'bbticket'|'car'} */
  function compute(state) {
    var layer = state.layer in PRICES ? state.layer : 'pure';
    var booking = state.booking === 'walkin' ? 'walkin' : 'online';
    if (layer === 'evening') booking = 'online'; // only online-from prices exist
    var p = PRICES[layer][booking];
    var a = Math.max(0, state.adults | 0), t = Math.max(0, state.teens | 0),
        k = Math.max(0, state.kids | 0), b = Math.max(0, state.babies | 0);
    var lines = [];
    if (a) lines.push({ label: 'Adult (18+)', qty: a, unit: p.adult, sum: round2(a * p.adult) });
    if (t) lines.push({ label: 'Teen (13–17)', qty: t, unit: p.teen, sum: round2(t * p.teen) });
    if (k) lines.push({ label: 'Child (4–12)', qty: k, unit: p.child, sum: round2(k * p.child) });
    if (b) lines.push({ label: 'Under 4', qty: b, unit: 0, sum: 0 });
    var entry = round2(lines.reduce(function (s, l) { return s + l.sum; }, 0));

    var people = a + t + k; // under-4s excluded from travel maths
    var travel = { label: '', sum: 0, note: '', range: null };
    if (state.travel === 'bbticket') {
      var tickets = Math.max(1, Math.ceil(people / 5));
      travel.label = 'Brandenburg-Berlin-Ticket' + (tickets > 1 ? ' × ' + tickets : '');
      travel.sum = round2(tickets * BB_TICKET);
      travel.note = tickets > 1
        ? 'One ticket covers up to 5 people, so your group needs ' + tickets + '.'
        : 'One flat ticket for up to 5 people, all regional trains. Weekdays it starts at 09:00.';
    } else if (state.travel === 'car') {
      travel.label = 'Parking at the dome (24h)';
      travel.range = [PARKING_MIN, PARKING_MAX];
      travel.sum = PARKING_MIN;
      travel.note = 'P1 next to the hall is €8, P2/P3 are €6. Fuel for ~120 km round trip comes on top.';
    } else {
      travel.label = 'Deutschlandticket holders';
      travel.sum = 0;
      travel.note = 'RE2/RB24 to Brand Tropical Islands are regional trains, fully covered by the €63/month Deutschlandticket.';
    }

    var total = round2(entry + travel.sum);
    var flags = [];

    if (booking === 'online' && layer !== 'evening' && PRICES[layer].walkin) {
      var wp = PRICES[layer].walkin;
      var walkinEntry = round2(a * wp.adult + t * wp.teen + k * wp.child);
      var saved = round2(walkinEntry - entry);
      if (saved > 0 && people > 0) {
        flags.push({ kind: 'save', text: 'Booking online ahead saves your group about €' + saved.toFixed(2) + ' against the walk-in counter.' });
      }
    }
    if (booking === 'walkin' && people > 0 && layer !== 'evening') {
      var op = PRICES[layer].online;
      var onlineEntry = round2(a * op.adult + t * op.teen + k * op.child);
      var extra = round2(entry - onlineEntry);
      if (extra > 0) flags.push({ kind: 'warn', text: 'Deciding at the door costs about €' + extra.toFixed(2) + ' more than booking the same day online first.' });
    }
    if (layer === 'pure' && booking === 'online') {
      if (a === 2 && k === 3 && t === 0 && FAMILY.twoPlusThree < entry) {
        flags.push({ kind: 'family', text: 'Your group matches the Family ticket (2 adults + 3 children) from €129.90 — about €' + round2(entry - FAMILY.twoPlusThree).toFixed(2) + ' less than single tickets.' });
      }
      if (a === 1 && k === 3 && t === 0 && FAMILY.onePlusThree < entry) {
        flags.push({ kind: 'family', text: 'Your group matches the single-parent Family ticket (1 adult + 3 children) from €119.90 — about €' + round2(entry - FAMILY.onePlusThree).toFixed(2) + ' less than single tickets.' });
      }
    }
    if (b > 0) flags.push({ kind: 'info', text: 'Children up to three go in free, so the youngest ' + (b === 1 ? 'traveller' : b + ' travellers') + ' cost €0 at the door.' });
    if (layer === 'evening') flags.push({ kind: 'info', text: 'Evening tickets are valid from 18:00 to 23:30 — about five and a half tropical hours, best paired with a late train back.' });
    if (layer === 'sauna') flags.push({ kind: 'info', text: 'The Sauna & Spa landscape follows German custom: it is textile-free.' });

    return { lines: lines, entry: entry, travel: travel, total: total,
             perPerson: people > 0 ? round2(total / people) : 0,
             people: people, flags: flags, booking: booking, layer: layer };
  }

  return { compute: compute, PRICES: PRICES, FAMILY: FAMILY, BB_TICKET: BB_TICKET };
}));
