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
      action: 'Open the map search and choose a place that is open now.'
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
    eberswalder_food_search: {
      name: 'Food near Eberswalder Strasse',
      fact: 'Eberswalder Strasse has food options beside Kulturbrauerei and Kastanienallee.',
      action: 'Open the map search and choose a place that is open now.'
    },
    museum_island_food_search: {
      name: 'Food near Museum Island',
      fact: 'Museum Island has food options close to Berlin Cathedral and Hackescher Markt.',
      action: 'Open the map search and choose a place that is open now.'
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
      fact: 'Gendarmenmarkt has restaurants close to the square and the central route.',
      action: 'Open the map search and choose a place that is open now.'
    },
    hackescher_food_search: {
      name: 'Food near Hackescher Markt',
      fact: 'Hackescher Markt has several restaurants close to the BerlinWalk finish and Museum Island.',
      action: 'Choose one of the listed options and check today\'s opening hours.'
    },
    savigny_food_search: {
      name: 'Food near Savignyplatz',
      fact: 'Savignyplatz has restaurants around the square and the railway arches.',
      action: 'Choose one of the listed options and check today\'s opening hours.'
    },
    charlottenburg_palace_food_search: {
      name: 'Food near Charlottenburg Palace',
      fact: 'The restaurant options sit close to the palace and Luisenplatz.',
      action: 'Choose one of the listed options and check today\'s opening hours.'
    },
    east_side_food_search: {
      name: 'Food near Oberbaum Bridge',
      fact: 'The restaurant options sit on either side of Oberbaum Bridge.',
      action: 'Choose one of the listed options and check today\'s opening hours.'
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
      fact: 'Central Potsdam has restaurants between Potsdam Hbf and Sanssouci.',
      action: 'Open the map search and choose a place that is open now.'
    },
    alter_stadtwaechter: {
      name: 'Alter Stadtwächter',
      fact: 'Alter Stadtwächter serves German food beside Potsdam\'s Brandenburg Gate.',
      action: 'Choose it for lunch from Wednesday to Sunday and check today\'s kitchen hours.'
    },
    das_wiener_potsdam: {
      name: 'Das Wiener',
      fact: 'Das Wiener is a cafe and restaurant on Luisenplatz in Potsdam.',
      action: 'Choose it for a lighter lunch, coffee or cake before Sanssouci.'
    },
    matador_potsdam: {
      name: 'Matador',
      fact: 'Matador serves burgers, pizza, salads and grilled dishes beside Potsdam\'s Brandenburg Gate.',
      action: 'Choose it for a casual lunch after 12:00.'
    },
    contadino_potsdam: {
      name: 'Ristorante Contadino',
      fact: 'Ristorante Contadino serves Italian food on Luisenplatz in Potsdam.',
      action: 'Choose it for pizza or pasta before the walk to Sanssouci.'
    },
    lietzensee_food_search: {
      name: 'Food near Lietzensee',
      fact: 'The streets beside Lietzensee have food options between the palace and Savignyplatz.',
      action: 'Open the map search and choose a place that is open now.'
    },
    berlin_hbf_food_search: {
      name: 'Food near Berlin Hbf',
      fact: 'The area around Berlin Hbf has restaurants beside the station.',
      action: 'Open the map search and choose a place that is open now.'
    },
    tempelhof_food_search: {
      name: 'Food around Mehringdamm',
      fact: 'Mehringdamm has food counters and restaurants between Tempelhofer Feld and Viktoriapark.',
      action: 'Open the map search and choose a place that is open now.'
    },
    bergmannkiez_food_search: {
      name: 'Food around Bergmannkiez',
      fact: 'Bergmannkiez has restaurants beside Viktoriapark and Marheineke Markthalle.',
      action: 'Open the map search and choose a place that is open now.'
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
    hummus_friends: {
      name: 'Hummus & Friends',
      fact: 'Hummus & Friends serves vegetarian hummus dishes west of Hackescher Markt.',
      action: 'Choose it for a plant-friendly sit-down meal.'
    },
    peter_pane_hackescher: {
      name: 'Peter Pane Hackescher Markt',
      fact: 'Peter Pane serves burgers directly at Hackescher Markt.',
      action: 'Choose it for a casual meal with vegan and vegetarian choices.'
    },
    augustiner_gendarmenmarkt: {
      name: 'Augustiner am Gendarmenmarkt',
      fact: 'Augustiner serves Bavarian food beside Gendarmenmarkt.',
      action: 'Choose it for a German sit-down meal.'
    },
    chupenga_gendarmenmarkt: {
      name: 'Chupenga Gendarmenmarkt',
      fact: 'Chupenga serves Mexican bowls beside Gendarmenmarkt on weekdays.',
      action: 'Choose it for a quicker plant-friendly meal.'
    },
    gendarmerie_restaurant: {
      name: 'Restaurant Gendarmerie',
      fact: 'Restaurant Gendarmerie serves modern European food at the north edge of Gendarmenmarkt.',
      action: 'Choose it for a longer sit-down meal.'
    },
    lebenswelten_bistro: {
      name: 'Lebenswelten Bistro',
      fact: 'Lebenswelten Bistro serves bowls and hot food inside the Humboldt Forum.',
      action: 'Use it for lunch without an exhibition ticket.'
    },
    baret_restaurant: {
      name: 'Baret',
      fact: 'Baret is the rooftop restaurant at the Humboldt Forum.',
      action: 'Reserve if you want the rooftop meal without waiting for access.'
    },
    cafe_nikolaikirche: {
      name: 'Café & Crêperie an der Nikolaikirche',
      fact: 'This café serves soups and savoury crêpes in Nikolaiviertel.',
      action: 'Allow 7 to 10 minutes to walk there from Museum Island.'
    },
    doenerbse: {
      name: 'Dönerbse',
      fact: 'Dönerbse serves chickpea döner at Eberswalder Straße.',
      action: 'Choose it for a quick vegan-capable meal.'
    },
    w_der_imbiss: {
      name: 'W-Der Imbiss',
      fact: 'W-Der Imbiss serves international vegetarian-friendly food on Kastanienallee.',
      action: 'Allow a short walk south from Eberswalder Straße.'
    },
    flying_monkey: {
      name: 'Flying Monkey',
      fact: 'Flying Monkey serves Chinese food close to Eberswalder Straße.',
      action: 'Choose it for a sit-down meal with vegan dishes.'
    },
    trattoria_cinque: {
      name: 'Trattoria Cinque',
      fact: 'Trattoria Cinque serves Italian food directly on Boxhagener Platz.',
      action: 'Choose it for pizza or pasta.'
    },
    zensation: {
      name: 'Zensation',
      fact: 'Zensation serves modern Asian food near Boxhagener Platz.',
      action: 'Choose it for a sit-down meal a short walk from the square.'
    },
    kurhaus_korsakow: {
      name: 'Kurhaus Korsakow',
      fact: 'Kurhaus Korsakow serves German food on Boxhagener Platz.',
      action: 'Use it for dinner, or for lunch on weekends.'
    },
    maison_umami: {
      name: 'Maison Umami',
      fact: 'Maison Umami serves Asian-fusion food near Oberbaum Bridge.',
      action: 'Choose it for a sit-down meal with plant-friendly dishes.'
    },
    mina_ristorante: {
      name: 'MINA Ristorante',
      fact: 'MINA serves Italian and Levantine food beside East Side Gallery.',
      action: 'Choose it for a longer dinner.'
    },
    kouzina_savignyplatz: {
      name: 'Kouzina',
      fact: 'Kouzina serves Greek food directly at Savignyplatz.',
      action: 'Choose it for lunch or dinner on the square.'
    },
    hado_savignyplatz: {
      name: 'HADO',
      fact: 'HADO serves Vietnamese food and sushi on Savignyplatz.',
      action: 'Choose it for a plant-friendly Asian meal.'
    },
    andalucia_savignyplatz: {
      name: 'AndaLucia',
      fact: 'AndaLucia serves Spanish tapas and paella on Savignyplatz.',
      action: 'Choose it for dinner.'
    },
    peter_pane_charlottenburg: {
      name: 'Peter Pane Charlottenburg',
      fact: 'Peter Pane serves burgers south-east of Savignyplatz.',
      action: 'Choose it for a casual meal with vegan and vegetarian choices.'
    },
    luisenbraeu: {
      name: 'Luisenbräu by Lemke',
      fact: 'Luisenbräu serves German food opposite Charlottenburg Palace.',
      action: 'Choose it for the shortest palace lunch detour.'
    },
    samowar_restaurant: {
      name: 'Restaurant Samowar',
      fact: 'Restaurant Samowar serves Russian and Eastern European food beside Charlottenburg Palace.',
      action: 'Choose it from Tuesday to Sunday.'
    },
    opera_italiana: {
      name: 'Opera Italiana',
      fact: 'Opera Italiana serves Italian food opposite Charlottenburg Palace.',
      action: 'Choose it for pizza or pasta before the next stop.'
    },
    schloss_cafe_charlottenburg: {
      name: 'Schloss Café Charlottenburg',
      fact: 'Schloss Café serves Mediterranean dishes west of Charlottenburg Palace.',
      action: 'Use it for weekday lunch or dinner.'
    },
    umami_xberg: {
      name: 'Umami X-Berg',
      fact: 'Umami X-Berg serves Asian-fusion food on Bergmannstraße.',
      action: 'Choose it for a sit-down meal with plant-friendly dishes.'
    },
    austria_bergmann: {
      name: 'Austria',
      fact: 'Austria serves Austrian food in Bergmannkiez.',
      action: 'Choose it for a local-style dinner.'
    },
    good_morning_vietnam_vegan: {
      name: 'Good Morning Vietnam Vegan',
      fact: 'Good Morning Vietnam Vegan serves fully vegan Vietnamese food on Bergmannstraße.',
      action: 'Choose it for lunch or dinner in Bergmannkiez.'
    },
    kumpel_keule: {
      name: 'Kumpel & Keule',
      fact: 'Kumpel & Keule runs a butcher and grill counter inside Markthalle Neun.',
      action: 'Choose it for a quick local lunch from Monday to Saturday.'
    },
    mani_in_pasta: {
      name: 'Mani in Pasta',
      fact: 'Mani in Pasta serves Sicilian pasta inside Markthalle Neun.',
      action: 'Choose it for lunch from Monday to Saturday.'
    },
    meze_feinkost: {
      name: 'Meze Feinkost',
      fact: 'Meze Feinkost serves Anatolian dishes inside Markthalle Neun.',
      action: 'Choose it for a vegetarian-friendly lunch from Monday to Saturday.'
    },
    max_und_moritz: {
      name: 'Max und Moritz',
      fact: 'Max und Moritz serves Berlin and German food on Oranienstraße.',
      action: 'Choose it for dinner in a historic dining room.'
    },
    santa_maria_oranien: {
      name: 'Santa Maria',
      fact: 'Santa Maria serves Mexican food on Oranienstraße.',
      action: 'Choose it for a casual dinner from Monday to Saturday.'
    },
    ora_berlin: {
      name: 'ORA',
      fact: 'ORA serves modern European food in a former pharmacy on Oranienplatz.',
      action: 'Choose it for a slower dinner from Tuesday to Saturday.'
    },
    orania_restaurant: {
      name: 'Orania.Restaurant',
      fact: 'Orania.Restaurant serves contemporary food on Oranienplatz.',
      action: 'Choose it for the higher-price dinner option.'
    },
    curry_36_hbf: {
      name: 'Curry 36 Berlin Hbf',
      fact: 'Curry 36 serves currywurst inside Berlin Hbf.',
      action: 'Choose it for the quickest Berlin-style meal after the train.'
    },
    dean_david_hbf: {
      name: 'dean&david Berlin Hbf Express',
      fact: 'dean&david serves salads, bowls and sandwiches at Berlin Hbf.',
      action: 'Choose it for a lighter meal without leaving the station.'
    },
    zollpackhof: {
      name: 'Zollpackhof',
      fact: 'Zollpackhof serves German food beside the Spree near Berlin Hbf.',
      action: 'Allow 8 to 10 minutes to walk there from the station.'
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
    'route windows',
    'route proof',
    'trip shape',
    'stored itinerary',
    'context anchor',
    'trip spine',
    'route shape',
    'guardrail',
    'live guardrails',
    'locked itinerary',
    'same stored plan',
    'take an abc train',
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
    hackescher_markt_market: true,
    hummus_friends: true,
    peter_pane_hackescher: true,
    augustiner_gendarmenmarkt: true,
    chupenga_gendarmenmarkt: true,
    gendarmerie_restaurant: true,
    lebenswelten_bistro: true,
    baret_restaurant: true,
    cafe_nikolaikirche: true,
    doenerbse: true,
    w_der_imbiss: true,
    flying_monkey: true,
    trattoria_cinque: true,
    zensation: true,
    kurhaus_korsakow: true,
    maison_umami: true,
    mina_ristorante: true,
    kouzina_savignyplatz: true,
    hado_savignyplatz: true,
    andalucia_savignyplatz: true,
    peter_pane_charlottenburg: true,
    luisenbraeu: true,
    samowar_restaurant: true,
    opera_italiana: true,
    schloss_cafe_charlottenburg: true,
    umami_xberg: true,
    austria_bergmann: true,
    good_morning_vietnam_vegan: true,
    kumpel_keule: true,
    mani_in_pasta: true,
    meze_feinkost: true,
    max_und_moritz: true,
    santa_maria_oranien: true,
    ora_berlin: true,
    orania_restaurant: true,
    curry_36_hbf: true,
    dean_david_hbf: true,
    zollpackhof: true,
    alter_stadtwaechter: true,
    das_wiener_potsdam: true,
    matador_potsdam: true,
    contadino_potsdam: true
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
      if (has(ids, 'topography_terror')) return 'BerlinWalk tour and 20th-century history';
      if (has(ids, 'museum_island')) return 'BerlinWalk tour and a museum visit';
      if (has(ids, 'wall_memorial')) return 'BerlinWalk tour and divided-city history';
      return 'BerlinWalk tour and central Berlin';
    }
    if (has(ids, 'wall_memorial') && has(ids, 'east_side_gallery')) return 'Berlin Wall history';
    if (has(ids, 'charlottenburg_palace')) return 'Royal Berlin and former West Berlin';
    if (has(ids, 'markthalle_neun') && has(ids, 'oranienstrasse')) return 'A market and main street in Kreuzberg';
    if (has(ids, 'sanssouci')) return 'Prussian palaces in Potsdam';
    if (has(ids, 'tempelhofer_feld')) return 'Parks in Tempelhof and Kreuzberg';
    if (has(ids, 'museum_island')) return 'Five museums beside the Spree';
    if (has(ids, 'holocaust_memorial') && has(ids, 'gendarmenmarkt')) return 'Three layers of central Berlin';
    if (has(ids, 'brandenburg_gate') || has(ids, 'topography_terror')) return '20th-century history in central Berlin';
    if (has(ids, 'kulturbrauerei') || has(ids, 'kastanienallee') || has(ids, 'prater_biergarten')) return 'Prenzlauer Berg courtyards and local streets';
    if (has(ids, 'savignyplatz') || has(ids, 'lietzensee')) return 'Former West Berlin at a slower pace';
    if (has(ids, 'raw_gelande') || has(ids, 'simon_dach_strasse')) return 'Friedrichshain in the evening';
    var planKey = text(options.planKey).toLowerCase();
    if (planKey === 'wall') return 'Berlin Wall history';
    if (planKey === 'museums') return 'Museums beside the Spree';
    if (planKey === 'food') return 'A market and main street in Kreuzberg';
    if (planKey === 'free') return 'Free history and open spaces';
    if (planKey === 'nightlife') return 'An evening in Friedrichshain';
    if (planKey === 'local') return 'Former West Berlin at a slower pace';
    if (planKey === 'potsdam') return 'Prussian palaces in Potsdam';
    if (planKey === 'history') return 'Central Berlin and 20th-century history';
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
      var arrivalPoint = text(options.arrivalPoint, 'ber').toLowerCase();
      var arrivalTime = text(options.arrivalTime).toLowerCase();
      var firstMove = '';
      if (arrivalPoint === 'hbf') {
        firstMove = 'Go from Berlin Hbf to your stay in ' + area + '. Leave your bags.';
      } else if (arrivalPoint === 'hotel') {
        firstMove = 'Leave your bags at your hotel or apartment in ' + area + '.';
      } else if (arrivalPoint === 'alex') {
        firstMove = 'Start at Alexanderplatz. Leave your bags at your stay in ' + area + ' first if you have them.';
      } else if (arrivalPoint === 'car') {
        firstMove = 'Park near your stay in ' + area + '. Leave your bags. Use public transport or walk after that.';
      } else if (arrivalPoint === 'ber') {
        firstMove = 'Take the train from BER to ' + area + '. Leave your bags.';
      } else {
        firstMove = 'Go from your arrival point to your stay in ' + area + '. Leave your bags.';
      }
      if (arrivalTime === 'evening') return firstMove + ' Eat near your stay. Start sightseeing tomorrow.';
      if (arrivalTime === 'afternoon') return firstMove + ' Keep the first walk close to your stay.';
      return firstMove + ' Start sightseeing after that.';
    }
    if (options.hasTour) {
      if (has(ids, 'topography_terror')) return 'Start with the BerlinWalk tour in the historic centre. Then visit Topography of Terror at the former Gestapo and SS headquarters site.';
      if (has(ids, 'museum_island')) return 'Start with the BerlinWalk tour in the historic centre. After lunch, choose one Museum Island museum for the main indoor visit.';
      return 'Start at the World Clock for the two-hour BerlinWalk tour. Arrive 10 minutes early.';
    }
    if (has(ids, 'wall_memorial') && has(ids, 'east_side_gallery')) {
      return 'This day shows the Wall in two different places. Bernauer Straße explains how the border worked. East Side Gallery shows what happened to a surviving section after 1989. Finish by crossing Oberbaum Bridge.';
    }
    if (has(ids, 'charlottenburg_palace')) {
      return 'These stops stay in former West Berlin. Charlottenburg Palace shows Berlin\'s royal past. Lietzensee gives you a quieter break before Savignyplatz.';
    }
    if (has(ids, 'markthalle_neun') && has(ids, 'oranienstrasse')) {
      return 'This day stays in Kreuzberg. Markthalle Neun is a market hall from 1891. Eat there or choose one of the nearby options. Then walk along Oranienstraße.';
    }
    if (has(ids, 'sanssouci')) {
      return 'Potsdam needs most of a day because the train, old centre, palace and park are separate parts of the visit. Walk from Alter Markt toward Sanssouci. Book the palace time before you leave Berlin.';
    }
    if (has(ids, 'tempelhofer_feld')) {
      return 'This day stays in south Berlin. Walk on a former airport runway at Tempelhofer Feld. Then continue to Viktoriapark and Bergmannkiez.';
    }
    if (has(ids, 'museum_island')) {
      return 'Museum Island has five museums and Berlin Cathedral. They are all close together beside the Spree. Choose one museum. Do not try to visit all five in one day.';
    }
    if (has(ids, 'brandenburg_gate') && has(ids, 'topography_terror')) {
      return 'Brandenburg Gate and Topography of Terror are close enough for one central history day. Start at the Gate. Then visit the former Gestapo and SS headquarters site.';
    }
    if (has(ids, 'holocaust_memorial') && has(ids, 'gendarmenmarkt')) {
      return 'These stops show three different parts of central Berlin. Start at the Holocaust Memorial. Have lunch near Gendarmenmarkt. Finish in Nikolaiviertel beside the Spree.';
    }
    if (has(ids, 'topography_terror')) return 'Make Topography of Terror the main history stop. It stands on the former Gestapo and SS headquarters site. Use the map for the next stop.';
    if (has(ids, 'brandenburg_gate')) return 'Start at Brandenburg Gate while the area is quieter. Continue through the listed central stops in order.';
    var names = namesFor(ids).slice(0, 2);
    if (names.length === 2) return 'Go to ' + names[0] + ' first. Continue to ' + names[1] + ' after that.';
    if (names.length === 1) return 'Go to ' + names[0] + '. Follow the map link for the next step.';
    return 'Keep this day in ' + area + '. Follow the stops in the order shown.';
  }

  function mealCopy(options) {
    options = options || {};
    var ids = unique(options.placeIds);
    var meal = options.meal === 'dinner' ? 'dinner' : 'lunch';
    if (ids.length === 1 && /_food_search$/.test(ids[0])) {
      var searchItem = PLACE_GUIDANCE[ids[0]];
      var searchFact = searchItem
        ? searchItem.fact
        : 'This map search covers food options near ' + text(options.area, 'the route') + '.';
      return searchFact + ' Open the map search and choose a place that is open now.';
    }
    if (ids.length === 1) return placeName(ids[0]) + ' is a suggested ' + meal + ' option. Check today\'s opening hours and availability before you go.';
    var names = namesFor(ids).slice(0, 3);
    if (names.length === 3) return 'Choose one of these ' + meal + ' options: ' + names[0] + ', ' + names[1] + ' or ' + names[2] + '. Check today\'s opening hours before you go.';
    if (names.length === 2) return names[0] + ' and ' + names[1] + ' are suggested ' + meal + ' options. Check which one is open before you go.';
    return 'Open the map and choose a ' + meal + ' stop that is open near ' + text(options.area, 'today\'s route') + '.';
  }

  function blockTitle(options) {
    options = options || {};
    var time = text(options.time).toLowerCase();
    var ids = unique(options.placeIds).filter(function (placeId) { return placeId !== 'arrival_transfer'; });
    var area = text(options.area, 'the route');
    var routePlaceId = text(options.routePlaceId || ids[0]);
    var searchMealLocations = {
      oranienstrasse_food_search: 'on Oranienstraße',
      potsdam_food_search: 'near Potsdam Brandenburg Gate',
      friedrichshain_food_search: 'around Boxhagener Platz',
      eberswalder_food_search: 'near Eberswalder Strasse',
      museum_island_food_search: 'near Museum Island',
      gendarmenmarkt_food_search: 'near Gendarmenmarkt',
      hackescher_food_search: 'near Hackescher Markt',
      savigny_food_search: 'near Savignyplatz',
      charlottenburg_palace_food_search: 'near Charlottenburg Palace',
      east_side_food_search: 'near Oberbaum Bridge',
      lietzensee_food_search: 'near Lietzensee',
      berlin_hbf_food_search: 'near Berlin Hbf',
      tempelhof_food_search: 'near Mehringdamm',
      bergmannkiez_food_search: 'in Bergmannkiez'
    };
    if (options.kind === 'transfer') return text(options.fallback, namesFor(ids).join(' to ') || 'Travel to the next stop');
    if (time === 'arrival') return options.arrivalPoint === 'ber' ? 'Train from BER and leave your bags' : 'Go to your stay and leave your bags';
    if (options.isTour) return 'BerlinWalk from the World Clock';
    if (/^(break|pause|nearby option)$/.test(time)) return text(options.fallback, 'Take a short break');
    var centralQuickMeal = ids.length > 0 && ids.every(function (placeId) {
      return ['curry_61', 'monsieur_vuong', 'shiso_burger', 'yamyam'].indexOf(placeId) !== -1;
    });
    if (time === 'lunch') return searchMealLocations[routePlaceId]
      ? 'Lunch ' + searchMealLocations[routePlaceId]
      : (centralQuickMeal ? 'Lunch near Hackescher Markt' : 'Lunch near ' + area);
    if (/^(evening|dinner|later)$/.test(time)) return searchMealLocations[routePlaceId]
      ? 'Dinner ' + searchMealLocations[routePlaceId]
      : (centralQuickMeal ? 'Dinner near Hackescher Markt' : 'Dinner near ' + area);
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
    if (/^(break|pause|nearby option)$/.test(time)) return text(options.fallback, 'Take a short break near this stop.');
    if (time === 'lunch') return mealCopy({ meal: 'lunch', placeIds: ids, area: options.area });
    if (/^(evening|dinner|later)$/.test(time)) return mealCopy({ meal: 'dinner', placeIds: ids, area: options.area });
    if (ids.length) return ids.slice(0, 2).map(function (placeId) { return placeCopy(placeId, '', options.area); }).join(' ');
    if (/pause|break|nearby/.test(time)) return 'Take a short break near ' + text(options.area, 'this area') + '. Skip it if you are tired.';
    return text(options.fallback, 'Follow the map link for this stop.');
  }

  function planB(options) {
    options = options || {};
    var ids = unique(options.placeIds);
    var area = text(options.area, 'this part of Berlin');
    var arrivalTime = text(options.arrivalTime).toLowerCase();
    if (options.hasOpeningWarning) return 'Check the official opening page before you leave. If the indoor stop is closed, skip it and shorten the route around ' + area + '.';
    if (Number(options.dayNumber) === 1) {
      var hasSightseeingStop = ids.some(function (placeId) {
        return !NAMED_FOOD_PLACES[placeId] && !/_food_search$/.test(placeId);
      });
      if (has(ids, 'topography_terror')) return 'If rain is steady, spend more time inside Topography of Terror. Skip the outdoor stops and check the official opening hours before you leave.';
      if (has(ids, 'markthalle_neun')) return 'If rain is steady, spend more time inside Markthalle Neun. Skip the extra outdoor walk.';
      if (arrivalTime === 'evening') return 'If rain is steady, eat near your stay in ' + area + '. Skip the extra walk.';
      if (!hasSightseeingStop) return 'If rain is steady after check-in, eat near your stay in ' + area + ' and end the day there.';
      return 'If rain is steady after check-in, eat near your stay in ' + area + '. Skip the outdoor loop.';
    }
    if (has(ids, 'wall_memorial') && has(ids, 'east_side_gallery')) return 'If rain is steady, shorten Bernauer Straße and visit Tränenpalast. Go to East Side Gallery only when the rain stops.';
    if (has(ids, 'east_side_gallery') && has(ids, 'oberbaum_bridge')) return 'If rain is steady, shorten East Side Gallery. Cross Oberbaum Bridge and end the sightseeing part of the day in Kreuzberg.';
    if (has(ids, 'charlottenburg_palace')) return 'If rain is steady, check Charlottenburg Palace\'s official opening hours. If it is open, spend more time inside and skip Lietzensee.';
    if (has(ids, 'markthalle_neun')) return 'If rain is steady, visit Berlinische Galerie and eat at Markthalle Neun. Walk Oranienstraße only when the rain stops.';
    if (has(ids, 'sanssouci')) return 'If rain is steady, shorten Sanssouci Park and return to Berlin after the palace.';
    if (has(ids, 'tempelhofer_feld')) return 'If rain is steady, skip Tempelhofer Feld. Take a long indoor cafe break around Bergmannstraße and check what is open before leaving.';
    if (has(ids, 'museum_island')) return 'If rain is steady, visit one open Museum Island museum. Skip the outdoor river walk.';
    if (has(ids, 'holocaust_memorial') && has(ids, 'gendarmenmarkt')) return 'If rain is steady, visit Topography of Terror after checking its official opening details. Return to Gendarmenmarkt only when the rain eases.';
    if (has(ids, 'topography_terror')) return 'If rain is steady, spend more time inside Topography of Terror. Skip the outdoor memorial walk.';
    return 'If rain is steady, skip the longest outdoor stop. Stay near ' + area + ' and check official opening hours before you choose an indoor visit.';
  }

  function bannedPhrases(value) {
    var haystack = text(value).toLowerCase();
    return BANNED_PHRASES.filter(function (phrase) { return haystack.indexOf(phrase) !== -1; });
  }

  return {
    VERSION: '1.3.1',
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
