/* Technikmuseum Train Builder — plan engine.
   Deterministic: selection + locomotive + weekday in, ordered visit plan out.
   Hours/prices facts checked on technikmuseum.berlin in July 2026. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.TMTrainBuilder = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {

  var ENTRY_BUFFER_MIN = 15;   // tickets, lockers, orientation
  var TRANSFER_MIN = 8;        // walk between Trebbiner Str. 9 and Möckernstr. 26

  var LOCOS = [
    { id: 'sprint', label: 'Quick visit', minutes: 120, note: 'about 2 hours' },
    { id: 'half',   label: 'Half day',    minutes: 240, note: 'about 4 hours' },
    { id: 'full',   label: 'Full day',    minutes: 360, note: 'about 6 hours' }
  ];

  // order = walking order: New Building floors first, then roundhouses and
  // park, then the walk over to the Ladestraße site.
  var WAGONS = [
    { id: 'aviation',  order: 1, site: 'main', minutes: 60, kids: 3,
      name: 'Aviation', short: 'Aviation',
      blurb: 'More than 40 aircraft plus the roof terrace under the C-47 Rosinenbomber.' },
    { id: 'shipping',  order: 2, site: 'main', minutes: 45, kids: 2,
      name: 'Shipping', short: 'Ships',
      blurb: 'Three levels of boats, with the 1840s Kaffenkahn barge and the steam tug Kurt Heinz.' },
    { id: 'computers', order: 3, site: 'main', minutes: 30, kids: 1,
      name: 'Computers and The Network', short: 'Computers',
      blurb: 'Konrad Zuse’s Z1 reconstruction and how machines learned to calculate and talk.' },
    { id: 'rail',      order: 4, site: 'main', minutes: 45, kids: 2,
      name: 'Rail roundhouses', short: 'Rail',
      blurb: 'Two real 1874 engine sheds with about 40 vehicles, from an 1865 horse tram to the 180 km/h E 19.' },
    { id: 'park',      order: 5, site: 'main', minutes: 30, kids: 2, outdoor: true,
      name: 'Museum park, mills and brewery', short: 'Park',
      blurb: 'Two windmills, a historical brewery and a forge in the old freight yard.' },
    { id: 'roads',     order: 6, site: 'lade', minutes: 40, kids: 2,
      name: 'On the Move (Ladestraße)', short: 'Cars',
      blurb: 'Cars, bikes and city traffic in eleven rooms, from a 1914 Benz to early electric cars.' },
    { id: 'spectrum',  order: 7, site: 'lade', minutes: 75, kids: 3,
      name: 'Science Center Spectrum', short: 'Spectrum',
      blurb: 'Hands-on experiment zones for light, sound, electricity and motion. Included in the same ticket.' }
  ];

  var DAYS = [
    { id: 'mon', label: 'Mon', open: false, hours: null },
    { id: 'tue', label: 'Tue', open: true, hours: '9:00–17:30' },
    { id: 'wed', label: 'Wed', open: true, hours: '9:00–17:30' },
    { id: 'thu', label: 'Thu', open: true, hours: '9:00–17:30' },
    { id: 'fri', label: 'Fri', open: true, hours: '9:00–17:30' },
    { id: 'sat', label: 'Sat', open: true, hours: '10:00–18:00' },
    { id: 'sun', label: 'Sun', open: true, hours: '10:00–18:00' }
  ];

  function wagonById(id) {
    for (var i = 0; i < WAGONS.length; i++) if (WAGONS[i].id === id) return WAGONS[i];
    return null;
  }
  function locoById(id) {
    for (var i = 0; i < LOCOS.length; i++) if (LOCOS[i].id === id) return LOCOS[i];
    return null;
  }
  function dayById(id) {
    for (var i = 0; i < DAYS.length; i++) if (DAYS[i].id === id) return DAYS[i];
    return null;
  }

  function buildPlan(input) {
    input = input || {};
    var loco = locoById(input.loco) || LOCOS[1];
    var day = dayById(input.day) || DAYS[5];
    var ids = Array.isArray(input.selected) ? input.selected : [];
    var picked = [];
    for (var i = 0; i < WAGONS.length; i++) {
      if (ids.indexOf(WAGONS[i].id) !== -1) picked.push(WAGONS[i]);
    }
    picked.sort(function (a, b) { return a.order - b.order; });

    var hasMain = picked.some(function (w) { return w.site === 'main'; });
    var hasLade = picked.some(function (w) { return w.site === 'lade'; });
    var transfer = hasMain && hasLade ? TRANSFER_MIN : 0;

    var wagonMinutes = picked.reduce(function (sum, w) { return sum + w.minutes; }, 0);
    var total = picked.length ? ENTRY_BUFFER_MIN + wagonMinutes + transfer : 0;
    var fits = total <= loco.minutes;
    var overBy = fits ? 0 : total - loco.minutes;

    // stops in walking order with site markers
    var stops = [];
    if (picked.length) {
      stops.push({ type: 'gate', site: hasMain ? 'main' : 'lade',
        label: hasMain ? 'Start at Trebbiner Straße 9 (main entrance)' : 'Start at Möckernstraße 26 (Ladestraße entrance)',
        minutes: ENTRY_BUFFER_MIN });
      picked.forEach(function (w, idx) {
        if (transfer && w.site === 'lade' && (idx === 0 || picked[idx - 1].site !== 'lade')) {
          stops.push({ type: 'walk', label: 'Walk over to Möckernstraße 26', minutes: TRANSFER_MIN });
        }
        stops.push({ type: 'hall', id: w.id, label: w.name, minutes: w.minutes, site: w.site });
      });
    }

    var warnings = [];
    if (!day.open) {
      warnings.push({ id: 'closed', level: 'stop',
        text: 'The museum is closed on Mondays. Pick another day; Tuesday mornings are usually the quietest.' });
    } else {
      warnings.push({ id: 'hours', level: 'info',
        text: 'Hours on ' + day.label + ': ' + day.hours + '. Last admission is 17:00.' });
      if (loco.id === 'full') {
        warnings.push({ id: 'early', level: 'tip',
          text: 'A full-day train needs a morning start: doors open at ' + (day.hours.indexOf('9:00') === 0 ? '9:00' : '10:00') + ' and the day ends at ' + (day.id === 'sat' || day.id === 'sun' ? '18:00' : '17:30') + '.' });
      }
      if (day.id === 'fri') {
        warnings.push({ id: 'freefriday', level: 'tip',
          text: 'On the first Friday of the month entry is free for everyone from 13:00 (book the free ticket online). Expect bigger crowds that afternoon.' });
      }
      if (picked.some(function (w) { return w.outdoor; })) {
        warnings.push({ id: 'outdoor', level: 'info',
          text: 'The museum park is open air. On a wet day swap it for an indoor hall.' });
      }
      if (ids.indexOf('spectrum') !== -1) {
        warnings.push({ id: 'oneticket', level: 'info',
          text: 'Spectrum is covered by the same day ticket, and under-18s are free (book the 0-euro ticket).' });
      }
    }

    var suggestion = null;
    if (picked.length && !fits) {
      var upgrade = null;
      for (var j = 0; j < LOCOS.length; j++) {
        if (LOCOS[j].minutes >= total) { upgrade = LOCOS[j]; break; }
      }
      var smallest = picked.slice().sort(function (a, b) { return a.minutes - b.minutes; })[0];
      suggestion = upgrade && upgrade.id !== loco.id
        ? { type: 'upgrade', locoId: upgrade.id, text: 'This train needs the ' + upgrade.label.toLowerCase() + ' locomotive (' + upgrade.note + '), or uncouple a wagon.' }
        : { type: 'drop', wagonId: smallest.id, text: 'Even a full day cannot pull this train. Uncouple something; ' + smallest.name + ' is the shortest wagon.' };
    }

    return {
      loco: loco, day: { id: day.id, label: day.label, open: day.open, hours: day.hours },
      wagons: picked.map(function (w) { return w.id; }),
      wagonMinutes: wagonMinutes,
      entryBuffer: picked.length ? ENTRY_BUFFER_MIN : 0,
      transferMinutes: transfer,
      totalMinutes: total,
      fits: fits, overBy: overBy,
      stops: stops, warnings: warnings, suggestion: suggestion
    };
  }

  return {
    buildPlan: buildPlan,
    WAGONS: WAGONS, LOCOS: LOCOS, DAYS: DAYS,
    ENTRY_BUFFER_MIN: ENTRY_BUFFER_MIN, TRANSFER_MIN: TRANSFER_MIN
  };
}));
