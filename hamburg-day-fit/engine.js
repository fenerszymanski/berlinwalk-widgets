/* hamburg-day-fit engine — pure time-budget logic, no DOM.
 *
 * A Hamburg day trip is a time problem: the headline sights are strung out
 * along the water, so the honest lesson is that you commit to one spine, not
 * all of it. This engine turns the reader's train choice into an on-the-ground
 * window, adds up the experiences they want (each cost already includes the
 * typical hop to reach it), and reports whether the day fits.
 *
 * Exposed as window.HDF = { WINDOWS, RETURNS, EXPERIENCES, compute }.
 */
(function (root) {
  // Arrival options: when the ICE realistically puts you in Hamburg.
  var LEAVE = [
    { key: 'early', label: 'First fast trains', sub: 'in Hamburg ~09:00', arrive: 9 * 60 },
    { key: 'mid', label: 'Mid-morning', sub: 'in Hamburg ~11:00', arrive: 11 * 60 },
    { key: 'late', label: 'Lazy start', sub: 'in Hamburg ~13:00', arrive: 13 * 60 },
  ];

  // Return options: when you head back to the station (train ~15 min later).
  var BACK = [
    { key: 'afternoon', label: 'Early evening train', sub: 'leave the city ~16:15', leave: 16 * 60 + 15 },
    { key: 'evening', label: 'Dinner then go', sub: 'leave the city ~18:45', leave: 18 * 60 + 45 },
    { key: 'night', label: 'Last sensible train', sub: 'leave the city ~20:45', leave: 20 * 60 + 45 },
  ];

  // Each experience's cost includes the visit plus the typical hop to reach it
  // from the harbour spine, so the numbers stay honest without a routing engine.
  var EXPERIENCES = [
    { key: 'speicherstadt', label: 'Speicherstadt canals', cost: 60, zone: 'harbour', note: 'The red-brick warehouse district, free to wander. The natural anchor of the day.' },
    { key: 'wunderland', label: 'Miniatur Wunderland', cost: 130, zone: 'harbour', book: true, note: 'Inside Speicherstadt. Book a timed slot ahead or the queue alone can eat two hours.' },
    { key: 'elbphi', label: 'Elbphilharmonie Plaza', cost: 50, zone: 'harbour', note: 'The free 37-metre viewing level. Grab the timed Plaza ticket; walk-up slots sell out.' },
    { key: 'harbour', label: 'Harbour and Landungsbrücken', cost: 90, zone: 'harbour', note: 'The floating piers, the cranes, and a short ferry or boat tour on the Elbe.' },
    { key: 'alster', label: 'Alster lakes and Rathaus', cost: 80, zone: 'centre', note: 'The city-centre lakes, Jungfernstieg and the grand town hall. A different Hamburg from the harbour.' },
    { key: 'reeperbahn', label: 'Reeperbahn by day', cost: 45, zone: 'stpauli', note: 'St. Pauli is tame in daylight. A walk-through, unless you are staying into the night.' },
    { key: 'lunch', label: 'A proper Fischbrötchen stop', cost: 40, zone: 'any', note: 'A fish roll by the water is the whole ritual. Worth building in, not skipping.' },
  ];

  var BASE = 30; // getting your bearings from Hauptbahnhof into the centre

  function byKey(list, key) {
    for (var i = 0; i < list.length; i++) if (list[i].key === key) return list[i];
    return null;
  }

  function fmt(mins) {
    var h = Math.floor(mins / 60);
    var m = mins % 60;
    if (h <= 0) return m + 'm';
    if (m === 0) return h + 'h';
    return h + 'h ' + (m < 10 ? '0' + m : m) + 'm';
  }

  // selected: array of experience keys. leaveKey / backKey pick the window.
  function compute(leaveKey, backKey, selected) {
    var leave = byKey(LEAVE, leaveKey) || LEAVE[1];
    var back = byKey(BACK, backKey) || BACK[1];
    var windowMin = back.leave - leave.arrive;

    var picks = EXPERIENCES.filter(function (e) { return selected.indexOf(e.key) !== -1; });
    var experienceMin = picks.reduce(function (sum, e) { return sum + e.cost; }, 0);
    var usedMin = BASE + experienceMin;
    var spareMin = windowMin - usedMin;
    var fits = spareMin >= 0;

    // Zones touched, for the honest "commit to one spine" coaching.
    var zones = {};
    picks.forEach(function (e) { if (e.zone !== 'any') zones[e.zone] = true; });
    var zoneCount = Object.keys(zones).length;

    var needBooking = picks.some(function (e) { return e.book; });

    return {
      windowMin: windowMin,
      baseMin: BASE,
      experienceMin: experienceMin,
      usedMin: usedMin,
      spareMin: spareMin,
      fits: fits,
      picks: picks,
      zoneCount: zoneCount,
      needBooking: needBooking,
      leave: leave,
      back: back,
    };
  }

  root.HDF = { LEAVE: LEAVE, BACK: BACK, EXPERIENCES: EXPERIENCES, BASE: BASE, compute: compute, fmt: fmt };
})(typeof window !== 'undefined' ? window : this);
