/*
 * Official related-reading scope for Berlin History Story V2.
 *
 * The read-only live graph check at 2026-09-01T13:29:26.734Z confirmed that
 * each of these published posts had zero inbound links from other published
 * posts. Re-run scripts/check-history-story-related-links.mjs before changing
 * this local list or any future distribution pin.
 */
(function () {
  'use strict';

  var entries = [
    ["beautiful-u-bahn-stations-berlin", "The Most Beautiful U-Bahn Stations in Berlin: Which Ones Are Worth Getting Off At"],
    ["berlin-brutalist-architecture", "Berlin Brutalist Architecture: Four Concrete Buildings Worth a Detour"],
    ["berlin-cemeteries", "Berlin Cemeteries: How to Pick the One That Fits Your Day"],
    ["berlin-courtyards-hoefe", "The Hidden Courtyards of Berlin: A Walk Through the Höfe Around Hackescher Markt"],
    ["berlin-wall-in-mitte-city-centre", "The Berlin Wall in Mitte: Where the Line Crosses the Centre"],
    ["berlin-wall-map-overlay-where-you-are-standing", "Berlin Wall Map Overlay: How to Read Where You Are Standing"],
    ["berliner-unterwelten", "Berliner Unterwelten: How to Actually Get Into Berlin's Bunker Tours"],
    ["deutsches-technikmuseum-berlin", "Deutsches Technikmuseum Berlin: The Giant Museum With a Plane on the Roof"],
    ["free-berlin-memorials", "Free Berlin Memorials: Four Powerful Places That Are Easy to Visit"],
    ["gemaldegalerie-berlin", "Gemäldegalerie Berlin: The Old Masters Gallery Most Visitors Miss"],
    ["jewish-museum-berlin-guide", "Jewish Museum Berlin: Free Entry, How Long and What to See"],
    ["koepenick-berlin", "Köpenick Berlin: The Palace, the Lake and the Fake Captain Who Fooled Prussia"],
    ["oberbaumbruecke-berlin", "The Oberbaumbrücke: Berlin's Prettiest Bridge and the Border That Ran Through It"],
    ["stasi-museum-berlin", "Stasi Museum Berlin: The Secret Police HQ and Prison"],
    ["teufelsberg-berlin", "Teufelsberg Berlin: The Cold War Spy Station on a Man-Made Hill"],
    ["two-of-everything-in-berlin", "Two of Everything in Berlin: The East and West Twins and Which One to Visit"]
  ];

  window.BERLIN_HISTORY_STORY_RELATED_POSTS = entries.map(function (entry) {
    return {
      slug: entry[0],
      title: entry[1],
      url: 'https://www.berlinwalk.com/post/' + entry[0]
    };
  });
})();
