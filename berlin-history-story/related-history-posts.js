/*
 * Fixed handoff baseline, extracted from commit 92fdc8c7 (2026-08-22).
 *
 * It contains the exact 42 entries marked history-myths in that generated
 * snapshot. A fresh Wix API read on 2026-09-01 confirmed all 42 still have
 * identical title, slug and URL. This is not an inbound-link or orphan audit.
 */
(function () {
  'use strict';

  var entries = [
    ["bauhaus-in-berlin-modernism", "Bauhaus in Berlin: Three Places That Make Modernism Easier to Read"],
    ["travelling-alone-in-berlin-day-plan", "Travelling Alone in Berlin: Pick the Right Area for Your Solo Day"],
    ["berlin-itinerary-for-couples", "Berlin Itinerary for Couples: Build One Day Around Two Different Interests"],
    ["where-to-eat-berlin-by-neighbourhood", "Where to Eat in Berlin by Neighbourhood: A Three-Night Dinner Plan"],
    ["ifa-berlin-2026", "IFA Berlin: A Visitor Guide to Messe Berlin and the City After the Show"],
    ["berlin-wall-map-overlay-where-you-are-standing", "Berlin Wall Map Overlay: How to Read Where You Are Standing"],
    ["berlin-wall-in-mitte-city-centre", "The Berlin Wall in Mitte: Where the Line Crosses the Centre"],
    ["how-to-get-into-berghain", "How to Get Into Berghain: What You Can and Cannot Control"],
    ["brandenburg-gate-before-after", "The Brandenburg Gate, Before and After: One Landmark, Berlin’s Whole Century"],
    ["oberbaumbruecke-berlin", "The Oberbaumbrücke: Berlin's Prettiest Bridge and the Border That Ran Through It"],
    ["telling-time-in-german-berlin", "Telling Time in German: Why Halb Acht Is 7:30 and How Berlin Says the Rest"],
    ["spandau-berlin", "Spandau Berlin: The Old Town Berlin Is Not Supposed to Have"],
    ["berlin-wall-trail", "The Berlin Wall Trail: Which Section Is Actually Worth Your Time"],
    ["schoneberg-berlin", "Schöneberg Berlin: Bowie, Kennedy and the District That Whispers"],
    ["kurfurstendamm-berlin", "Kurfürstendamm Berlin: A Local Guide to City West"],
    ["berlin-ghost-stations", "Berlin Ghost Stations: The 15 Stops Trains Passed Without Stopping"],
    ["famous-movies-tv-shows-filmed-in-berlin", "Famous Movies and TV Shows Filmed in Berlin"],
    ["berlin-then-and-now", "Berlin Then and Now: How to See the City That Disappeared"],
    ["teufelsberg-berlin", "Teufelsberg Berlin: The Cold War Spy Station on a Man-Made Hill"],
    ["air-conditioning-in-berlin", "Air Conditioning in Berlin: Do Hotels Have It, and How to Stay Cool"],
    ["berlin-wall-memorial-bernauer-strasse", "Berlin Wall Memorial (Bernauer Strasse): How to Visit the Real Wall Site"],
    ["turkish-market-berlin-maybachufer", "Turkish Market Berlin: How to Visit the Maybachufer Market"],
    ["tempelhof-airport-berlin", "Tempelhof Airport Berlin: Field, Tours and What to Do"],
    ["potsdamer-platz-berlin", "Potsdamer Platz Berlin: Wall Trace, Skyline and What to See Today"],
    ["hohenzollern-berlin", "Hohenzollern Berlin: The Royal Family Behind the City's Grandest Streets"],
    ["topography-of-terror-berlin", "Topography of Terror Berlin: Free Museum, Wall Remains and How to Visit It Right"],
    ["sachsenhausen-from-berlin", "Sachsenhausen from Berlin: Train, Tickets and How to Visit Respectfully"],
    ["traenenpalast-berlin", "Tränenpalast Berlin: The Free Cold War Museum Tourists Shouldn't Skip"],
    ["charlottenburg-palace-berlin", "Charlottenburg Palace Berlin: Tickets, Gardens and What to See First"],
    ["why-is-berlin-founding-year-1237", "Why Is Berlin's Founding Year 1237? Cölln, Medieval Berlin and the City Before 1933"],
    ["east-side-gallery-berlin-guide", "East Side Gallery: Berlin's Open-Air Wall Guide"],
    ["brandenburg-gate-berlin-visitors-guide", "Brandenburg Gate Berlin: A Visitor's Guide"],
    ["nikolaiviertel-rebuilt-old-town", "Nikolaiviertel: Berlin's Rebuilt Old Town and Why It Feels So Strange"],
    ["where-was-the-berlin-wall-interactive-map", "Where Was the Berlin Wall? An Interactive Map of East and West in 1989"],
    ["the-ampelmann-how-a-traffic-light-became-berlin-s-most-beloved-symbol", "Ampelmann Berlin: The Traffic Light Man, His History, and Where to See Him"],
    ["berlin-tv-tower-construction-before-during-and-after", "Berlin TV Tower Construction: Before, During, and After"],
    ["how-berlin-was-divided-a-simple-guide-to-east-vs-west", "How Berlin Was Divided: A Simple Guide to East vs. West"],
    ["exploring-checkpoint-charlie-a-historical-journey-through-cold-war-berlin-s-iconic-border-crossing", "Checkpoint Charlie: What to See, What to Skip and Why It Still Matters"],
    ["why-berlin-s-streets-are-so-wide-it-wasn-t-always-the-plan", "Why Berlin's Streets Are So Wide (It Wasn't Always the Plan)"],
    ["did-jfk-really-call-himself-a-jelly-donut-the-ich-bin-ein-berliner-myth", "Did JFK Really Call Himself a Jelly Donut? The Ich Bin Ein Berliner Myth"],
    ["why-berlin-doesn-t-have-a-beautiful-old-town-and-why-that-s-the-point", "Why Berlin Doesn't Have a Beautiful Old Town (And Why That's the Point)"],
    ["berlin-s-lost-neighborhood-what-the-gdr-demolished-to-build-a-socialist-utopia", "Berlin's Lost Neighborhood: What the GDR Demolished to Build a Socialist Utopia"]
  ];

  window.BERLIN_HISTORY_STORY_RELATED_POSTS = entries.map(function (entry) {
    return {
      slug: entry[0],
      title: entry[1],
      url: 'https://www.berlinwalk.com/post/' + entry[0]
    };
  });
})();
