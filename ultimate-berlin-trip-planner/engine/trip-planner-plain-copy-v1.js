(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.BWTripPlannerPlainCopyV1 = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var PLACE_GUIDANCE = {
    world_clock: {
      name: 'World Clock',
      fact: 'The World Clock is a 1969 GDR landmark on Alexanderplatz.',
      action: 'Meet beside it and arrive 10 minutes early.'
    },
    alexanderplatz: {
      name: 'Alexanderplatz',
      fact: 'Alexanderplatz is a major transport hub and a large GDR-era city square.',
      action: 'Find the World Clock and TV Tower, then check the station entrances.'
    },
    museum_island: {
      name: 'Museum Island',
      fact: 'Museum Island has five major museums beside the Spree.',
      action: 'Choose one museum and check its opening time before you leave.'
    },
    hackescher_markt: {
      name: 'Hackescher Markt',
      fact: 'Hackescher Markt is a busy square near the Spree and Museum Island.',
      action: 'Walk through Hackesche Höfe or stop here for lunch.'
    },
    wall_memorial: {
      name: 'Berlin Wall Memorial',
      fact: 'The Berlin Wall Memorial shows the full border system at Bernauer Straße.',
      action: 'Start at the visitor centre and walk to the viewing platform.'
    },
    east_side_gallery: {
      name: 'East Side Gallery',
      fact: 'East Side Gallery is a surviving section of the Wall painted after 1989.',
      action: 'Walk one section slowly and read the mural captions.'
    },
    oberbaum_bridge: {
      name: 'Oberbaum Bridge',
      fact: 'Oberbaum Bridge links Friedrichshain and Kreuzberg across the Spree.',
      action: 'Cross it on foot and look back toward East Side Gallery.'
    },
    markthalle_neun: {
      name: 'Markthalle Neun',
      fact: 'Markthalle Neun is a covered market hall from 1891.',
      action: 'Walk through the hall and choose lunch from an open stall.'
    },
    brandenburg_gate: {
      name: 'Brandenburg Gate',
      fact: 'Brandenburg Gate stood beside the closed border during the division of Berlin.',
      action: 'Walk through the gate and look across Pariser Platz.'
    },
    holocaust_memorial: {
      name: 'Holocaust Memorial',
      fact: 'The Memorial to the Murdered Jews of Europe has 2,711 concrete slabs.',
      action: 'Walk through it quietly and give the site enough time.'
    },
    reichstag: {
      name: 'Reichstag',
      fact: 'The Reichstag is Germany\'s parliament building.',
      action: 'Book the dome in advance or walk around the building from outside.'
    },
    gendarmenmarkt: {
      name: 'Gendarmenmarkt',
      fact: 'Gendarmenmarkt is a historic square with two cathedrals and the Konzerthaus.',
      action: 'Walk across the square and compare the three main buildings.'
    },
    nikolaiviertel: {
      name: 'Nikolaiviertel',
      fact: 'Nikolaiviertel is a rebuilt historic quarter beside the Spree.',
      action: 'Walk the small streets and finish at the river.'
    },
    berlin_cathedral: {
      name: 'Berlin Cathedral',
      fact: 'Berlin Cathedral stands beside Museum Island and the Lustgarten.',
      action: 'See it from the lawn or check the entry time before going inside.'
    },
    berlin_hbf: {
      name: 'Berlin Hbf',
      fact: 'Berlin Hbf is Berlin\'s main station for regional trains.',
      action: 'Check the live platform before boarding for Potsdam.'
    },
    hackesche_hofe: {
      name: 'Hackesche Höfe',
      fact: 'Hackesche Höfe is a group of eight connected courtyards.',
      action: 'Walk through the first courtyards and look at the tiled facade.'
    },
    kastanienallee: {
      name: 'Kastanienallee',
      fact: 'Kastanienallee is a Prenzlauer Berg street with cafes and small shops.',
      action: 'Walk one section and stop where you want coffee.'
    },
    topography_terror: {
      name: 'Topography of Terror',
      fact: 'Topography of Terror stands on the former Gestapo and SS headquarters site.',
      action: 'Read the free outdoor timeline, then go inside if you want more detail.'
    },
    tiergarten: {
      name: 'Tiergarten',
      fact: 'Tiergarten is Berlin\'s large central park.',
      action: 'Choose one path through the park instead of trying to cross all of it.'
    },
    victory_column: {
      name: 'Victory Column',
      fact: 'The Victory Column stands in the centre of Tiergarten.',
      action: 'Climb it for the view or see it from the park if you do not want the stairs.'
    },
    tempelhofer_feld: {
      name: 'Tempelhofer Feld',
      fact: 'Tempelhofer Feld is a former city airport that is now a public park.',
      action: 'Walk or cycle on a runway and look back at the terminal.'
    },
    viktoriapark: {
      name: 'Viktoriapark',
      fact: 'Viktoriapark rises above Kreuzberg around the National Monument.',
      action: 'Walk to the terrace for the view, then go down toward Bergmannkiez.'
    },
    treptower_park: {
      name: 'Treptower Park',
      fact: 'Treptower Park runs beside the Spree and contains the Soviet War Memorial.',
      action: 'Walk by the river and give the memorial a separate stop.'
    },
    raw_gelande: {
      name: 'RAW-Gelände',
      fact: 'RAW-Gelände is a former railway yard with street art, bars and clubs.',
      action: 'Walk through the site before choosing one place for the evening.'
    },
    oranienstrasse: {
      name: 'Oranienstraße',
      fact: 'Oranienstraße is one of Kreuzberg\'s main streets.',
      action: 'Walk one section between Görlitzer Bahnhof and Moritzplatz.'
    },
    oranienstrasse_food_search: {
      name: 'Food on Oranienstraße',
      fact: 'Oranienstraße has restaurants between Görlitzer Bahnhof and Moritzplatz.',
      action: 'Open the map search and choose dinner on this street.'
    },
    simon_dach_strasse: {
      name: 'Simon-Dach-Straße',
      fact: 'Simon-Dach-Straße is a busy Friedrichshain street with bars and cafes.',
      action: 'Choose one bar and save your route home before you order.'
    },
    kulturbrauerei: {
      name: 'Kulturbrauerei',
      fact: 'Kulturbrauerei is a former brewery complex in Prenzlauer Berg.',
      action: 'Walk through the courtyards and check what is open that day.'
    },
    savignyplatz: {
      name: 'Savignyplatz',
      fact: 'Savignyplatz was a cafe and literary centre of former West Berlin.',
      action: 'Walk around the square and the nearby railway arches.'
    },
    lietzensee: {
      name: 'Lietzensee',
      fact: 'Lietzensee is a residential lake in Charlottenburg.',
      action: 'Walk the east bank for the clearest view across the water.'
    },
    sanssouci: {
      name: 'Sanssouci Palace',
      fact: 'Sanssouci was Frederick the Great\'s summer palace.',
      action: 'Book a fixed palace entry time, then treat the park as a separate stop.'
    },
    sanssouci_park: {
      name: 'Sanssouci Park',
      fact: 'Sanssouci Park connects the vineyard terraces and the royal gardens.',
      action: 'Walk one section after the palace instead of trying to cover the whole park.'
    },
    potsdam_hbf: {
      name: 'Potsdam Hbf',
      fact: 'Potsdam Hbf is the main station for the old centre and Sanssouci.',
      action: 'Leave the station by tram or bus and continue toward the palace park.'
    },
    potsdam_old_market: {
      name: 'Alter Markt',
      fact: 'Alter Markt is Potsdam\'s historic centre beside St Nicholas Church.',
      action: 'Walk here from the station before continuing west.'
    },
    potsdam_brandenburg_gate: {
      name: 'Potsdam Brandenburg Gate',
      fact: 'Potsdam\'s Brandenburg Gate stands between the old centre and Sanssouci.',
      action: 'Pass it on the walk toward the palace area.'
    },
    charlottenburg_palace: {
      name: 'Charlottenburg Palace',
      fact: 'Charlottenburg Palace is Berlin\'s largest palace complex.',
      action: 'Walk through the courtyard and formal garden even if you skip the rooms.'
    },
    monsieur_vuong: {
      name: 'Monsieur Vuong',
      fact: 'Monsieur Vuong serves Vietnamese dishes near Hackescher Markt.',
      action: 'Stop here for a quick sit-down meal in Mitte.'
    },
    claerchens_ballhaus: {
      name: 'Clärchens Ballhaus',
      fact: 'Clärchens Ballhaus is a historic ballroom on Auguststraße.',
      action: 'Go for dinner or a drink if you want to finish in Mitte.'
    },
    maximilians: {
      name: 'Maximilians',
      fact: 'Maximilians is a Bavarian restaurant near Friedrichstraße.',
      action: 'Choose it for a full sit-down meal after the central route.'
    },
    hofbraeu_wirtshaus: {
      name: 'Hofbräu Wirtshaus',
      fact: 'Hofbräu Wirtshaus is a large Bavarian-style restaurant beside Alexanderplatz.',
      action: 'Choose it when you want dinner close to the station.'
    },
    prater_biergarten: {
      name: 'Prater Biergarten',
      fact: 'Prater is Berlin\'s oldest beer garden.',
      action: 'Go in warm weather for a drink and a simple meal.'
    },
    konnopkes_imbiss: {
      name: 'Konnopke\'s Imbiss',
      fact: 'Konnopke\'s is a currywurst stand under the U-Bahn in Prenzlauer Berg.',
      action: 'Order at the counter and eat outside.'
    },
    vegan_1990: {
      name: '1990 Vegan Living',
      fact: '1990 Vegan Living serves Vietnamese vegan dishes near Boxhagener Platz.',
      action: 'Share a few small plates for lunch.'
    },
    friedrichshain_food_search: {
      name: 'Food around Boxhagener Platz',
      fact: 'Boxhagener Platz has many food options close to the Friedrichshain part of the route.',
      action: 'Open the map search and choose a place that is open now.'
    },
    gendarmenmarkt_food_search: {
      name: 'Food near Gendarmenmarkt',
      fact: 'This search stays beside the next central-Berlin stop.',
      action: 'Open the map search and choose a place that is open now.'
    },
    burgermeister_schlesi: {
      name: 'Burgermeister',
      fact: 'Burgermeister sits below the U-Bahn at Schlesisches Tor.',
      action: 'Expect a queue and eat before or after Oberbaum Bridge.'
    },
    dicke_wirtin: {
      name: 'Dicke Wirtin',
      fact: 'Dicke Wirtin is a traditional Berlin pub near Savignyplatz.',
      action: 'Stop here for a German lunch.'
    },
    schwarzes_cafe: {
      name: 'Schwarzes Café',
      fact: 'Schwarzes Café is a long-running Charlottenburg cafe near Savignyplatz.',
      action: 'Choose it for dinner or a late coffee.'
    },
    mustafas_kebap: {
      name: 'Mustafa\'s Gemüse Kebap',
      fact: 'Mustafa\'s Gemüse Kebap is at Mehringdamm.',
      action: 'Go only if you are willing to wait in the queue.'
    },
    curry_36: {
      name: 'Curry 36',
      fact: 'Curry 36 is a currywurst counter at Mehringdamm.',
      action: 'Order at the counter and eat outside.'
    },
    scheers_schnitzel: {
      name: 'Scheer\'s Schnitzel',
      fact: 'Scheer\'s Schnitzel is near Oberbaum Bridge.',
      action: 'Stop here for a quick meal before crossing the Spree.'
    },
    potsdam_food_search: {
      name: 'Food in central Potsdam',
      fact: 'Central Potsdam is on the way between the station and Sanssouci.',
      action: 'Open the map search and choose lunch before entering the palace park.'
    },
    lietzensee_food_search: {
      name: 'Food near Lietzensee',
      fact: 'The streets beside Lietzensee have food options between the palace and Savignyplatz.',
      action: 'Open the map search and choose a place that is open now.'
    },
    berlin_hbf_food_search: {
      name: 'Food near Berlin Hbf',
      fact: 'The area around Berlin Hbf gives you a practical dinner stop after the Potsdam return train.',
      action: 'Open the map search and choose a place that is open now.'
    },
    tempelhof_food_search: {
      name: 'Food around Mehringdamm',
      fact: 'Mehringdamm is between Tempelhofer Feld and Viktoriapark.',
      action: 'Choose one nearby counter or restaurant for lunch.'
    },
    bergmannkiez_food_search: {
      name: 'Food around Bergmannkiez',
      fact: 'Bergmannkiez has restaurants beside Viktoriapark and Marheineke Markthalle.',
      action: 'Choose dinner here after the park.'
    },
    shiso_burger: {
      name: 'Shiso Burger',
      fact: 'Shiso Burger serves burgers near Hackescher Markt.',
      action: 'Stop here for a quick lunch in Mitte.'
    },
    yamyam: {
      name: 'YamYam',
      fact: 'YamYam is a Korean deli in Mitte.',
      action: 'Order bibimbap or a quick Korean meal.'
    },
    curry_61: {
      name: 'Curry 61',
      fact: 'Curry 61 is a currywurst counter near Hackescher Markt.',
      action: 'Stop here for a fast Berlin lunch.'
    },
    hackescher_markt_market: {
      name: 'Hackescher Markt Weekly Market',
      fact: 'The Hackescher Markt market runs on Thursdays and Saturdays.',
      action: 'Check that it is open before choosing lunch from a stall.'
    }
  };

  var BANNED_PHRASES = [
    'get central without over-solving berlin',
    'over-solving',
    'route proof',
    'trip shape',
    'stored itinerary',
    'context anchor',
    'trip spine',
    'route shape',
    'guardrail',
    'locked itinerary',
    'orientation move',
    'not by checklist',
    'breathing room',
    'main stop',
    'selected stop',
    'selected option',
    'clear dinner choice',
    'keeps the day',
    'keep the day',
    'keeps the evening simple',
    'calm finish',
    'easy finish',
    'one clear anchor',
    'make the day easier',
    'same neighborhood',
    'same neighbourhood',
    'here before continuing',
    'stay west',
    'stay east'
  ];

  var NAMED_FOOD_PLACES = {
    monsieur_vuong: true,
    claerchens_ballhaus: true,
    maximilians: true,
    hofbraeu_wirtshaus: true,
    prater_biergarten: true,
    konnopkes_imbiss: true,
    vegan_1990: true,
    burgermeister_schlesi: true,
    dicke_wirtin: true,
    schwarzes_cafe: true,
    mustafas_kebap: true,
    curry_36: true,
    scheers_schnitzel: true,
    shiso_burger: true,
    yamyam: true,
    curry_61: true,
    hackescher_markt_market: true
  };

  function list(value) {
    return Array.isArray(value) ? value.filter(Boolean) : [];
  }

  function unique(value) {
    var seen = {};
    return list(value).filter(function (item) {
      var key = String(item || '');
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function text(value, fallback) {
    var output = String(value || fallback || '')
      .replace(/[–—]/g, '-')
      .replace(/\s+/g, ' ')
      .trim();
    return output;
  }

  function has(ids, placeId) {
    return ids.indexOf(placeId) !== -1;
  }

  function placeName(placeId, fallback) {
    var item = PLACE_GUIDANCE[placeId];
    return item ? item.name : text(fallback, 'Berlin stop');
  }

  function placeCopy(placeId, fallbackName, fallbackArea) {
    var item = PLACE_GUIDANCE[placeId];
    if (item && NAMED_FOOD_PLACES[placeId]) {
      return item.fact + ' Check today\'s opening hours and availability before you go.';
    }
    if (item) return item.fact + ' ' + item.action;
    var name = text(fallbackName, 'This stop');
    var area = text(fallbackArea, 'Berlin');
    return name + ' is in ' + area + '. Open the map and go there.';
  }

  function namesFor(ids) {
    return unique(ids).map(function (placeId) { return placeName(placeId); });
  }

  function dayTitle(options) {
    options = options || {};
    var ids = unique(options.placeIds);
    var area = text(options.area, 'Berlin');
    if (Number(options.dayNumber) === 1) return area.indexOf('Mitte') !== -1 ? 'Arrival in Mitte' : 'Arrival in ' + area;
    if (options.hasTour) {
      if (has(ids, 'topography_terror')) return 'BerlinWalk tour and Topography of Terror';
      if (has(ids, 'museum_island')) return 'BerlinWalk tour and Museum Island';
      if (has(ids, 'wall_memorial')) return 'BerlinWalk tour and the Berlin Wall Memorial';
      return 'BerlinWalk tour and central Berlin';
    }
    if (has(ids, 'wall_memorial') && has(ids, 'east_side_gallery')) return 'Berlin Wall history';
    if (has(ids, 'charlottenburg_palace')) return 'Royal Berlin and former West Berlin';
    if (has(ids, 'markthalle_neun') && has(ids, 'oranienstrasse')) return 'A market and main street in Kreuzberg';
    if (has(ids, 'sanssouci')) return 'Prussian palaces in Potsdam';
    if (has(ids, 'tempelhofer_feld')) return 'Parks in Tempelhof and Kreuzberg';
    if (has(ids, 'museum_island')) return 'Museum Island and the Spree';
    if (has(ids, 'holocaust_memorial') && has(ids, 'gendarmenmarkt')) return 'Three layers of central Berlin';
    if (has(ids, 'brandenburg_gate') || has(ids, 'topography_terror')) return 'Brandenburg Gate and 20th-century history';
    if (has(ids, 'savignyplatz') || has(ids, 'lietzensee')) return 'Savignyplatz and Lietzensee';
    if (has(ids, 'raw_gelande') || has(ids, 'simon_dach_strasse')) return 'Friedrichshain in the evening';
    var names = namesFor(ids).slice(0, 2);
    if (names.length === 2) return names[0] + ' and ' + names[1];
    if (names.length === 1) return names[0];
    return area;
  }

  function dayDecision(options) {
    options = options || {};
    var ids = unique(options.placeIds);
    var area = text(options.area, 'Berlin');
    if (Number(options.dayNumber) === 1) {
      return 'Take the train from BER to ' + area + '. Leave your bags. Start sightseeing after that.';
    }
    if (options.hasTour) {
      if (has(ids, 'topography_terror')) return 'The BerlinWalk tour explains the historic centre. Topography of Terror shows the former Gestapo and SS headquarters site.';
      if (has(ids, 'museum_island')) return 'The BerlinWalk tour explains the historic centre. Visit one Museum Island museum after lunch.';
      return 'Meet at the World Clock 10 minutes early. The two-hour tour explains the historic centre.';
    }
    if (has(ids, 'wall_memorial') && has(ids, 'east_side_gallery')) {
      return 'Bernauer Straße shows how the border worked. East Side Gallery shows a surviving Wall section after 1989. Cross Oberbaum Bridge at the end.';
    }
    if (has(ids, 'charlottenburg_palace')) {
      return 'Charlottenburg shows Berlin\'s royal past and the centre of former West Berlin. Visit the palace first. Continue to Lietzensee, then finish at Savignyplatz.';
    }
    if (has(ids, 'markthalle_neun') && has(ids, 'oranienstrasse')) {
      return 'Markthalle Neun is a market hall from 1891. Eat in the hall. Then walk along Oranienstraße.';
    }
    if (has(ids, 'sanssouci')) {
      return 'The Prussian kings built palaces in Potsdam. Take the train to Potsdam Hbf. Use the booked palace time first, then walk through Sanssouci Park as a separate stop.';
    }
    if (has(ids, 'tempelhofer_feld')) {
      return 'Tempelhofer Feld is a former airport that is now a public park. Walk on a runway. Then go to Viktoriapark and Bergmannkiez.';
    }
    if (has(ids, 'museum_island')) {
      return 'Museum Island has five major museums beside the Spree. Choose one museum and check its opening time before you leave.';
    }
    if (has(ids, 'brandenburg_gate') || has(ids, 'topography_terror')) {
      return 'Start at Brandenburg Gate. Then visit Topography of Terror for the 20th-century history.';
    }
    var names = namesFor(ids).slice(0, 2);
    if (names.length === 2) return 'Go to ' + names[0] + ' first. Continue to ' + names[1] + ' after that.';
    if (names.length === 1) return 'Go to ' + names[0] + '. Follow the map link for the next step.';
    return 'Follow the stops in the order shown for ' + area + '.';
  }

  function mealCopy(options) {
    options = options || {};
    var ids = unique(options.placeIds);
    var meal = options.meal === 'dinner' ? 'dinner' : 'lunch';
    if (ids.length === 1 && /_food_search$/.test(ids[0])) return placeCopy(ids[0], '', options.area);
    if (ids.length === 1) return placeName(ids[0]) + ' is a suggested ' + meal + ' option. Check today\'s opening hours and availability before you go.';
    var names = namesFor(ids).slice(0, 2);
    if (names.length === 2) return names[0] + ' and ' + names[1] + ' are suggested ' + meal + ' options. Check which one is open before you go.';
    return 'Open the map and choose a ' + meal + ' stop that is open near ' + text(options.area, 'today\'s route') + '.';
  }

  function blockTitle(options) {
    options = options || {};
    var time = text(options.time).toLowerCase();
    var ids = unique(options.placeIds).filter(function (placeId) { return placeId !== 'arrival_transfer'; });
    var area = text(options.area, 'the route');
    var searchMealLocations = {
      oranienstrasse_food_search: 'on Oranienstraße',
      potsdam_food_search: 'in central Potsdam',
      friedrichshain_food_search: 'around Boxhagener Platz',
      gendarmenmarkt_food_search: 'near Gendarmenmarkt',
      lietzensee_food_search: 'near Lietzensee',
      berlin_hbf_food_search: 'near Berlin Hbf',
      tempelhof_food_search: 'near Mehringdamm',
      bergmannkiez_food_search: 'in Bergmannkiez'
    };
    if (options.kind === 'transfer') return text(options.fallback, namesFor(ids).join(' to ') || 'Travel to the next stop');
    if (time === 'arrival') return options.arrivalPoint === 'ber' ? 'Train from BER and leave your bags' : 'Go to your stay and leave your bags';
    if (options.isTour) return 'BerlinWalk from the World Clock';
    if (time === 'lunch') return ids.length === 1
      ? 'Lunch ' + (searchMealLocations[ids[0]] || (/_food_search$/.test(ids[0]) ? ('near ' + text(options.area, 'the route')) : ('option: ' + placeName(ids[0]))))
      : 'Lunch near ' + area;
    if (/^(evening|dinner|later)$/.test(time)) return ids.length === 1
      ? 'Dinner ' + (searchMealLocations[ids[0]] || (/_food_search$/.test(ids[0]) ? ('near ' + text(options.area, 'the route')) : ('option: ' + placeName(ids[0]))))
      : 'Dinner near ' + area;
    var names = namesFor(ids).slice(0, 3);
    if (names.length === 1) return names[0];
    if (names.length === 2) return names[0] + ' and ' + names[1];
    if (names.length === 3) return names[0] + ', ' + names[1] + ' and ' + names[2];
    return text(options.fallback, 'Next stop');
  }

  function blockCopy(options) {
    options = options || {};
    var time = text(options.time).toLowerCase();
    var ids = unique(options.placeIds).filter(function (placeId) { return placeId !== 'arrival_transfer'; });
    if (options.kind === 'transfer') return text(options.fallback, 'Use the route link and check the live departure before you leave.');
    if (time === 'arrival') return text(options.arrivalCopy, 'Go to your stay and leave your bags before sightseeing.');
    if (options.isTour) return 'Meet at the World Clock 10 minutes early. The BerlinWalk tour takes about two hours.';
    if (time === 'lunch') return mealCopy({ meal: 'lunch', placeIds: ids, area: options.area });
    if (/^(evening|dinner|later)$/.test(time)) return mealCopy({ meal: 'dinner', placeIds: ids, area: options.area });
    if (ids.length) return ids.slice(0, 2).map(function (placeId) { return placeCopy(placeId, '', options.area); }).join(' ');
    if (/pause|break|nearby/.test(time)) return 'Take a short break near ' + text(options.area, 'this area') + '. Skip it if you are tired.';
    return text(options.fallback, 'Follow the map link for this stop.');
  }

  function planB(options) {
    options = options || {};
    var ids = unique(options.placeIds);
    if (options.hasOpeningWarning) return 'Check the official opening page before you leave. If the indoor stop is closed, go to the listed indoor backup.';
    if (Number(options.dayNumber) === 1) return 'If rain is steady after check-in, go to the Humboldt Forum. Skip the outdoor Alexanderplatz loop.';
    if (has(ids, 'wall_memorial') && has(ids, 'east_side_gallery')) return 'If rain is steady, shorten Bernauer Straße and visit Tränenpalast. Go to East Side Gallery only when the rain stops.';
    if (has(ids, 'charlottenburg_palace')) return 'If rain is steady, visit Charlottenburg Palace and Museum Berggruen. Skip Lietzensee.';
    if (has(ids, 'markthalle_neun')) return 'If rain is steady, visit Berlinische Galerie and eat at Markthalle Neun. Walk Oranienstraße only when the rain stops.';
    if (has(ids, 'sanssouci')) return 'If rain is steady, shorten Sanssouci Park. Choose an indoor museum in central Potsdam only after checking its official opening hours.';
    if (has(ids, 'tempelhofer_feld')) return 'If rain is steady, skip Tempelhofer Feld. Take a long indoor cafe break around Bergmannstraße and check what is open before leaving.';
    if (has(ids, 'museum_island')) return 'If rain is steady, visit one open Museum Island museum. Skip the outdoor river walk.';
    if (has(ids, 'holocaust_memorial') && has(ids, 'gendarmenmarkt')) return 'If rain is steady, visit Topography of Terror after checking its official opening details. Return to Gendarmenmarkt only when the rain eases.';
    if (has(ids, 'topography_terror')) return 'If rain is steady, spend more time inside Topography of Terror. Skip the outdoor memorial walk.';
    return 'If rain is steady, use the listed indoor backup. Skip the longest outdoor stop.';
  }

  function bannedPhrases(value) {
    var haystack = text(value).toLowerCase();
    return BANNED_PHRASES.filter(function (phrase) { return haystack.indexOf(phrase) !== -1; });
  }

  return {
    VERSION: '1.0.0',
    PLACE_GUIDANCE: PLACE_GUIDANCE,
    BANNED_PHRASES: BANNED_PHRASES.slice(),
    placeName: placeName,
    placeCopy: placeCopy,
    dayTitle: dayTitle,
    dayDecision: dayDecision,
    mealCopy: mealCopy,
    blockTitle: blockTitle,
    blockCopy: blockCopy,
    planB: planB,
    bannedPhrases: bannedPhrases
  };
});
