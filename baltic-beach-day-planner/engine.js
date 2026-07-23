/* Baltic Beach Day Planner engine.
   Typical summer Saturday pattern, checked against the DB planner in July 2026.
   Times are minutes after midnight; returns arriving past midnight use >1440. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.BWBalticEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  function hm(text) {
    const [h, m] = text.split(':').map(Number);
    return h * 60 + m;
  }
  function fmt(min) {
    const m = ((min % 1440) + 1440) % 1440;
    return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
  }
  function leg(dep, arr, label, chg, dticket) {
    const d = hm(dep);
    let a = hm(arr);
    if (a < d) a += 1440;
    return { dep: d, arr: a, label, chg, dticket };
  }

  const DESTINATIONS = [
    {
      key: 'warnemuende',
      name: 'Warnemünde',
      strap: 'Rostock’s beach village. Widest sand, 1898 lighthouse, fish rolls on the Alter Strom.',
      walk: 8,
      walkNote: 'about 8 minutes from platform to sand',
      out: [
        leg('05:46', '08:58', 'RE5 + RE50 + S1, change Neustrelitz and Rostock', 2, true),
        leg('06:46', '09:58', 'RE5 to Rostock, then S-Bahn S1', 1, true),
        leg('08:15', '10:48', 'IC to Rostock, then S-Bahn S1', 1, false),
        leg('08:46', '11:58', 'RE5 to Rostock, then S-Bahn S1', 1, true),
        leg('10:46', '13:58', 'RE5 to Rostock, then S-Bahn S1', 1, true),
      ],
      ret: [
        leg('15:49', '18:59', 'S2 + IC via Oranienburg + S-Bahn', 3, false),
        leg('15:59', '19:11', 'S1 to Rostock, then RE5', 1, true),
        leg('16:59', '20:11', 'S1 + RE50 + RE5 via Neustrelitz', 2, true),
        leg('17:59', '21:11', 'S1 to Rostock, then RE5', 1, true),
        leg('19:03', '22:19', 'S1 + RE50 + RE5 via Neustrelitz', 2, true),
        leg('20:03', '23:19', 'S1 to Rostock, then RE5', 1, true),
        leg('21:03', '00:19', 'S1 + RE50 + RE5, the last sane train', 2, true),
      ],
    },
    {
      key: 'heringsdorf',
      name: 'Heringsdorf + Ahlbeck',
      strap: 'Usedom’s imperial resorts. The 508 m pier, the 1898 Ahlbeck pier, a walk to Poland.',
      walk: 12,
      walkNote: 'about 12 minutes from station to pier and sand',
      out: [
        leg('05:22', '09:25', 'RE3 to Züssow, then RB23 resort railway', 1, true),
        leg('06:23', '10:05', 'RE3 + RE30 + bus mv81 via Anklam', 2, true),
        leg('07:22', '11:25', 'RE3 to Züssow, then RB23 resort railway', 1, true),
        leg('08:58', '12:25', 'ICE to Züssow, then RB23 resort railway', 1, false),
      ],
      ret: [
        leg('15:33', '19:01', 'RB23, then ICE from Züssow', 1, false),
        leg('16:33', '20:29', 'RB23, then RE3 from Züssow', 1, true),
        leg('17:33', '21:29', 'RB23 + RE30 + RE3 via Angermünde', 2, true),
        leg('18:33', '22:39', 'RB23 + RE3 + S-Bahn into Berlin', 2, true),
        leg('19:33', '23:33', 'RB23 + RE30 + RE3, the last sane train', 2, true),
      ],
    },
    {
      key: 'binz',
      name: 'Binz on Rügen',
      strap: 'The grand one: Kurhaus, villas, Rügen behind it. Right at the day-trip limit.',
      walk: 15,
      walkNote: 'about 15 minutes from station to beach',
      out: [
        leg('05:46', '09:54', 'RE5 to Stralsund, then RE9', 2, true),
        leg('06:46', '10:56', 'RE5 + RE51 + RE9 via Neustrelitz', 2, true),
        leg('07:46', '11:54', 'RE5 to Stralsund, then RE9', 2, true),
        leg('08:15', '12:12', 'Direct IC from Berlin Hbf', 0, false),
      ],
      ret: [
        leg('15:59', '20:11', 'RE9 to Stralsund, then RE5', 2, true),
        leg('17:04', '21:29', 'RE9 + RE30 + RE3 via Angermünde', 2, true),
        leg('17:59', '22:19', 'RE9 + RE5 + S-Bahn into Berlin', 3, true),
        leg('18:59', '23:33', 'RE9 + RE30 + RE3 via Angermünde', 3, true),
        leg('19:59', '00:19', 'RE9 + RE5 + S-Bahn, the last sane train', 3, true),
      ],
    },
  ];

  function allowed(option, ticketMode) {
    return ticketMode === 'any' || option.dticket;
  }

  function plan(dest, leaveAfter, backBy, ticketMode) {
    const out = dest.out.find((o) => allowed(o, ticketMode) && o.dep >= leaveAfter) || null;
    const rets = dest.ret.filter((r) => allowed(r, ticketMode) && r.arr <= backBy);
    const ret = rets.length ? rets[rets.length - 1] : null;
    if (!out || !ret || ret.dep <= out.arr) {
      return { dest, out, ret: out && ret && ret.dep <= out.arr ? ret : ret, beachMin: 0, feasible: false };
    }
    const beachStart = out.arr + dest.walk;
    const beachEnd = ret.dep - dest.walk;
    const beachMin = Math.max(0, beachEnd - beachStart);
    return { dest, out, ret, beachStart, beachEnd, beachMin, feasible: beachMin > 0 };
  }

  function verdict(result) {
    if (!result.feasible) return { tier: 'no', text: 'No workable window. Leave earlier or loosen the return.' };
    const h = result.beachMin / 60;
    if (h >= 5) return { tier: 'great', text: 'A real sea day.' };
    if (h >= 3) return { tier: 'ok', text: 'Solid. Swim, eat, walk one pier.' };
    if (h >= 1.5) return { tier: 'tight', text: 'Tight. One swim and one fish roll.' };
    return { tier: 'no', text: 'Not worth the rails today. Consider an overnight.' };
  }

  function race(leaveAfter, backBy, ticketMode) {
    const results = DESTINATIONS.map((d) => plan(d, leaveAfter, backBy, ticketMode));
    let winner = null;
    for (const r of results) {
      if (r.feasible && (!winner || r.beachMin > winner.beachMin)) winner = r;
    }
    return { results, winnerKey: winner ? winner.dest.key : null };
  }

  return { DESTINATIONS, hm, fmt, plan, verdict, race };
});
