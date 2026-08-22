#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const apply = process.argv.includes('--apply');

const DATA = {
  'film-festivals-berlin-autumn': {
    quick: {
      title: 'Berlin Film Festivals in Autumn 2026 - Quick Summary',
      icon: '🎬',
      kicker: 'BERLINWALK.COM • BERLIN EVENTS',
      items: [
        '**Six festival windows are confirmed for autumn 2026:** Fantasy Filmfest 2 to 9 September, Festival of Animation Berlin 8 to 11 October, Ukrainian Film Festival 14 to 18 October, INTERFILM and Italian Film Festival 10 to 15 November, and Punkfilmfest 3 to 6 December.',
        '**A festival name does not answer the language question.** Check the exact screening page for spoken language, subtitles, OV or OmU labels, and any advertised introduction or Q&A.',
        '**Choose one specific session before building the evening around it.** The title, cinema, start time and ticket page matter more than a broad festival description.',
        '**Let the cinema set the geography.** Keep the meal, walk and live journey in the same part of Berlin as the screening instead of crossing the city for a vague plan.',
        '**If the language information is missing, wait or ask the venue before paying.** One screening never creates a festival-wide promise.'
      ]
    },
    faq: {
      title: 'Berlin Film Festivals in Autumn 2026 - FAQ',
      subtitle: 'Dates, screening languages and how to choose one cinema night.',
      items: [
        { q: 'Which Berlin film festivals run in autumn 2026?', a: 'This guide tracks six confirmed windows: Fantasy Filmfest from 2 to 9 September, Festival of Animation Berlin from 8 to 11 October, Ukrainian Film Festival from 14 to 18 October, INTERFILM and Italian Film Festival from 10 to 15 November, and Punkfilmfest from 3 to 6 December.' },
        { q: 'Can I assume Berlin film-festival screenings are in English?', a: 'No. A festival can be international without offering one consistent spoken or subtitle language. Read the individual screening listing before booking.' },
        { q: 'What should I check on a festival screening page?', a: 'Check the film title, venue, exact start time, spoken language, subtitle information, ticket terms and any advertised introduction or Q&A. Reopen the page on the day in case details change.' },
        { q: 'What do OV and OmU mean on Berlin cinema listings?', a: 'They are labels you may see on individual German cinema listings, but the exact language and subtitle information on that screening page is the important part. Do not make the decision from an abbreviation alone.' },
        { q: 'How should I plan a Berlin cinema evening?', a: 'Choose one confirmed screening, save its address, check the live route on the day and keep the rest of the evening in the same area. A cinema night does not need a citywide itinerary around it.' }
      ]
    }
  },
  'giant-kite-festival-berlin': {
    quick: {
      title: 'Berlin Giant Kite Festival 2026 - Quick Summary',
      icon: '🪁',
      kicker: 'BERLINWALK.COM • BERLIN EVENTS',
      items: [
        '**The 13th STADT UND LAND Giant Kite Festival is on Saturday 12 September 2026, 11:00 to 20:00, at Tempelhofer Feld.** Admission is free.',
        '**The organiser expects giant kites up to 50 metres and invites visitors to bring their own kites.** Treat it as the main part of the afternoon, not a quick photo stop.',
        '**Choose an entrance from your actual direction of travel.** Published approaches include Columbiadamm, Herrfurthstrasse, Oderstrasse and the Paradestrasse side.',
        '**Do not make S+U Tempelhof the default meeting point.** The organiser expects temporary closures around S+U Tempelhof, Tempelhofer Damm and nearby motorway exits from roughly 12:00 to 19:00.',
        '**Check the organiser and a live route shortly before leaving.** Event-day access can change, and bicycle parking is listed at the entrances.'
      ]
    },
    faq: {
      title: 'Berlin Giant Kite Festival 2026 - FAQ',
      subtitle: 'The date, free entry and how to approach Tempelhofer Feld sensibly.',
      items: [
        { q: 'When is the Giant Kite Festival in Berlin in 2026?', a: 'The 13th STADT UND LAND Giant Kite Festival is on Saturday 12 September 2026, from 11:00 to 20:00 at Tempelhofer Feld.' },
        { q: 'Is the Giant Kite Festival free?', a: 'Yes. The organiser lists free admission for the 2026 event.' },
        { q: 'Can visitors bring their own kite?', a: 'Yes. The organiser says visitors are invited to bring and fly their own kites alongside the organised programme. Check the current event guidance before you go.' },
        { q: 'Which entrance should I use for the Giant Kite Festival?', a: "Choose from the organiser's event-day approach information based on where you are travelling from. The field has several access points, so one static meeting pin is not a reliable answer for everyone." },
        { q: 'Should I meet at S+U Tempelhof for the festival?', a: 'No. The organiser expects temporary closures around S+U Tempelhof, Tempelhofer Damm and nearby motorway exits from roughly 12:00 to 19:00. Check the current organiser notice and a live route before leaving.' }
      ]
    }
  },
  'ice-hockey-basketball-berlin': {
    quick: {
      title: 'Ice Hockey and Basketball at Uber Arena - Quick Summary',
      icon: '🏒',
      kicker: 'BERLINWALK.COM • BERLIN EVENTS',
      items: [
        '**Eisbären Berlin play Straubing Tigers at 19:30 on Thursday 17 September.** Check the official seller for the live price, seat category, fee and availability.',
        '**ALBA BERLIN play NINERS Chemnitz at 20:00 on Friday 18 September.** Choose the sport first, then read the current ticket page.',
        '**Neither fixture is sold as an English-language experience.** A Berlin team and an international arena do not guarantee English announcements, screens or commentary.',
        '**Uber Arena is at Uber Platz in Friedrichshain.** Keep the rest of the evening nearby, then use a live BVG or VBB check for the actual journey.',
        '**Leave any after-game plan flexible.** The live game length and return route are not fixed promises.'
      ]
    },
    faq: {
      title: 'Ice Hockey and Basketball at Uber Arena - FAQ',
      subtitle: 'Two confirmed September fixtures, ticket checks and a practical Friedrichshain evening.',
      items: [
        { q: 'Which Uber Arena games are confirmed for 17 and 18 September 2026?', a: 'Eisbären Berlin play Straubing Tigers at 19:30 on Thursday 17 September. ALBA BERLIN play NINERS Chemnitz at 20:00 on Friday 18 September.' },
        { q: 'How should I check Eisbären and ALBA ticket prices?', a: "Read the official seller's current price, seat category, fee and availability details before paying. Those live terms can change and the fixture listing alone does not settle the final ticket cost." },
        { q: 'Which game should I choose in Berlin?', a: 'Choose hockey for the rink atmosphere and basketball for the faster court rhythm. The right choice is the sport you actually want to watch and the ticket category that fits your evening.' },
        { q: 'Are Uber Arena sports games in English?', a: 'Do not assume so. The official fixture listings do not promise English-language announcements, screen content, service or commentary.' },
        { q: 'How should I plan the journey home after an Uber Arena game?', a: 'Use the live BVG or VBB route on the day and keep the after-game plan optional. A game can run differently from the starting time on the fixture page.' }
      ]
    }
  },
  'pyronale-berlin': {
    quick: {
      title: 'Pyronale Berlin 2026 - Quick Summary',
      icon: '🎆',
      kicker: 'BERLINWALK.COM • BERLIN EVENTS',
      items: [
        '**Pyronale takes place on Friday 25 and Saturday 26 September 2026 at the Maifeld beside Olympiastadion Berlin.** It is the 20th edition with six international teams.',
        '**The current programme schedules its first named team for 21:00.** Check the exact date, ticket and programme before buying.',
        '**General entry is exclusively through the South Gate.** The organiser says the East Gate is not an entry point for this edition.',
        '**Treat the fireworks as the one fixed evening commitment.** The exact exit time and journey home can change, so avoid stacking a second late plan after it.',
        '**If Sunday matters, keep it movable.** A train, museum slot or early start needs room around a late Maifeld evening.'
      ]
    },
    faq: {
      title: 'Pyronale Berlin 2026 - FAQ',
      subtitle: 'Dates, South Gate entry and a realistic Maifeld weekend.',
      items: [
        { q: 'When is Pyronale Berlin 2026?', a: 'Pyronale takes place on Friday 25 and Saturday 26 September 2026 at the Maifeld beside Olympiastadion Berlin.' },
        { q: 'Where do Pyronale ticket holders enter?', a: 'The organiser says general entry for both nights is exclusively through the South Gate. It says the East Gate is not an entry point for this edition.' },
        { q: 'What time does Pyronale start?', a: "The current detailed programme schedules its first named team for 21:00. Recheck the organiser's visitor information and your actual ticket on the day." },
        { q: 'Should I choose Friday or Saturday for Pyronale?', a: 'Compare the current programme, ticket category and the next morning in your own trip. Three teams are scheduled on each event day, so one date is not automatically better for every visitor.' },
        { q: 'Can I make a fixed early plan after Pyronale?', a: 'Keep the later night and the following morning flexible if possible. The programme gives a scheduled start, but it does not create a guaranteed departure time or journey home.' }
      ]
    }
  },
  'tag-der-clubkultur-berlin': {
    quick: {
      title: 'TAG DER CLUBKULTUR Berlin 2026 - Quick Summary',
      icon: '🎛️',
      kicker: 'BERLINWALK.COM • BERLIN EVENTS',
      items: [
        '**TAG DER CLUBKULTUR runs from 3 to 11 October 2026.** It is the seventh edition and its 2026 theme is STAY CORE.',
        '**The programme lists more than 100 events and a culture prize for 32 clubs and collectives.** It includes club nights, open-airs, concerts, performances, exhibitions, workshops, talks and film screenings.',
        '**Choose a format before choosing a venue.** A talk, a concert, an open-air event and a late club night have different access and energy demands.',
        '**The individual event page is the authority.** Check the exact date, venue, ticket or reservation status, door rules and accessibility before going.',
        '**Plan one neighbourhood and one realistic route home.** A festival title does not guarantee easy entry or make distant venues feel close after midnight.'
      ]
    },
    faq: {
      title: 'TAG DER CLUBKULTUR Berlin 2026 - FAQ',
      subtitle: 'How to choose one real event from Berlin club culture week.',
      items: [
        { q: 'When is TAG DER CLUBKULTUR Berlin 2026?', a: 'The 2026 festival runs from 3 to 11 October. It is the seventh edition and uses the theme STAY CORE.' },
        { q: 'Is TAG DER CLUBKULTUR only about late club nights?', a: 'No. The official programme includes club nights, open-airs, concerts, performances, exhibitions, workshops, talks and film screenings. Check the individual listing for the actual format.' },
        { q: 'Do I need a ticket for TAG DER CLUBKULTUR?', a: 'It depends on the individual event. Check the live listing for tickets, reservations, guest-list rules, access conditions and venue updates.' },
        { q: 'Does the festival make Berlin club entry easier?', a: 'Do not assume that it does. Each venue can have its own entry, capacity, age, bag and accessibility rules.' },
        { q: 'What is the easiest way to plan a TAG DER CLUBKULTUR evening?', a: 'Choose one format, save one first-choice event and one nearby backup, then use a live route planner for the confirmed venue. Avoid trying to rescue a night with several distant venues.' }
      ]
    }
  },
  'berlin-food-week': {
    quick: {
      title: 'Berlin Food Week 2026 - Quick Summary',
      icon: '🍴',
      kicker: 'BERLINWALK.COM • BERLIN EVENTS',
      items: [
        '**Berlin Food Week runs from 5 to 11 October 2026.** It is a festival of separate listings, not one single public venue or ticket.',
        '**House of Food is a clear free-entry public anchor at BIKINI BERLIN on 9 and 10 October, 10:00 to 20:00.** Check the current official page for any entry condition tied to a particular activity.',
        '**Read the access label with the same care as the date and address.** An event can have free entry, require a reservation, be ticketed, be invitation-only or still need detail checking.',
        '**Berlin Food Night on 5 October is invitation-only.** Its Longevity topic belongs to that one strategy dialogue and does not define the whole festival.',
        '**Keep the day local to the event you can genuinely enter.** A City West afternoon around BIKINI BERLIN is more useful than a citywide food checklist.'
      ]
    },
    faq: {
      title: 'Berlin Food Week 2026 - FAQ',
      subtitle: 'What is public, what needs a booking and how to keep the day realistic.',
      items: [
        { q: 'When is Berlin Food Week 2026?', a: 'Berlin Food Week runs from 5 to 11 October 2026.' },
        { q: 'What is House of Food at Berlin Food Week?', a: 'House of Food is a listed public market at BIKINI BERLIN on 9 and 10 October, from 10:00 to 20:00. The organiser lists free entry and describes food products, tasting, shopping and producers on site. Free entry identifies a public anchor, so check the current official page for any entry condition tied to a particular activity.' },
        { q: 'Is every Berlin Food Week event open to the public?', a: "No. Read each listing's access conditions. Events may have free entry, require a reservation, be ticketed, be invitation-only or need a fresh detail check." },
        { q: 'Can I attend Berlin Food Night?', a: 'The official listing describes Berlin Food Night on 5 October as an invitation-only strategy dialogue at AchtBerlin. Do not plan it as a general visitor event without the required invitation.' },
        { q: 'Where should I plan the rest of a House of Food day?', a: 'Keep it in City West. BIKINI BERLIN fits naturally with Breitscheidplatz, Kurfürstendamm and the Kaiser Wilhelm Memorial Church, then a nearby dinner.' }
      ]
    }
  },
  'jazzfest-berlin': {
    quick: {
      title: 'Jazzfest Berlin 2026 - Quick Summary',
      icon: '🎷',
      kicker: 'BERLINWALK.COM • BERLIN EVENTS',
      items: [
        '**Jazzfest Berlin runs from 29 October to 1 November 2026.** The official page names the Haus der Berliner Festspiele and other venues.',
        '**The full 2026 programme is due in September.** The dates are firm enough for a trip plan, but not for choosing an artist, room, ticket or route yet.',
        '**Do not copy a route from an earlier edition.** Each current listing needs its own date, venue, access and journey check.',
        '**Choose one performance once the programme is live.** One artist or format that genuinely interests you is a better evening than a rushed collection of guesses.',
        '**Let the confirmed venue lead the surrounding plan.** Pick one nearby meal and a live journey, then keep the rest of Berlin simple.'
      ]
    },
    faq: {
      title: 'Jazzfest Berlin 2026 - FAQ',
      subtitle: 'What is confirmed now and what needs the September programme.',
      items: [
        { q: 'When is Jazzfest Berlin 2026?', a: 'Jazzfest Berlin runs from 29 October to 1 November 2026.' },
        { q: 'Where does Jazzfest Berlin take place?', a: 'The official 2026 page names the Haus der Berliner Festspiele and other venues. Use the individual event listing once the programme is published for the exact location.' },
        { q: 'When will the Jazzfest Berlin programme be published?', a: "The official information says the full programme is due in September. Return to the festival's current page for artists, rooms, tickets and event details." },
        { q: 'Can I plan a Jazzfest route from a previous year?', a: 'No. Earlier editions do not prove the 2026 artist, venue, format, ticket route or travel plan. Start again from the live 2026 listing.' },
        { q: 'What is the best first Jazzfest choice for a visitor?', a: 'Wait for the programme, then choose one artist or format you genuinely want to hear. Check its venue, access conditions and live journey before building the rest of the evening around it.' }
      ]
    }
  },
  'berlin-science-week': {
    quick: {
      title: 'Berlin Science Week 2026 - Quick Summary',
      icon: '🔬',
      kicker: 'BERLINWALK.COM • BERLIN EVENTS',
      items: [
        '**Berlin Science Week runs from 1 to 10 November 2026 under the theme In Touch.** More than 200 organisations and institutions take part, and the festival describes hundreds of free events.',
        '**HKW is the 2026 Festival Centre.** The programme itself is citywide, so a familiar central hub does not make every event a short walk away.',
        '**Choose one subject or format before searching the schedule.** A talk, workshop, exhibition or performance can make a better day than a long unfiltered list.',
        '**Use the individual event page for language, registration, accessibility, venue and access.** The festival-level description cannot answer those details for every listing.',
        '**Keep Falling Walls separate.** Its Science Summit runs from 6 to 9 November, overlapping the week but using its own programme and access information.'
      ]
    },
    faq: {
      title: 'Berlin Science Week 2026 - FAQ',
      subtitle: 'Dates, HKW and how to use the programme without guessing.',
      items: [
        { q: 'When is Berlin Science Week 2026?', a: 'Berlin Science Week runs from 1 to 10 November 2026.' },
        { q: 'What is the theme of Berlin Science Week 2026?', a: 'The 2026 theme is In Touch. The official information frames it around the personal side of science, the people behind research and the connections it creates.' },
        { q: 'Where is the Berlin Science Week Festival Centre?', a: 'The 2026 Festival Centre is the Haus der Kulturen der Welt, known as HKW. Individual events can still take place elsewhere in Berlin.' },
        { q: 'Are Berlin Science Week events free or in English?', a: 'The festival describes hundreds of free events, but each event page is the source for its exact access condition, language, registration and accessibility details. Do not make a festival-wide assumption.' },
        { q: 'Is Falling Walls part of Berlin Science Week?', a: 'Falling Walls has its own Science Summit from 6 to 9 November. The dates overlap, but each programme and access page should be checked independently.' }
      ]
    }
  },
  'berlin-freedom-week': {
    quick: {
      title: 'Berlin Freedom Week 2026 - Quick Summary',
      icon: '🕊️',
      kicker: 'BERLINWALK.COM • BERLIN HISTORY',
      items: [
        '**Berlin Freedom Week runs from 7 to 14 November 2026.** Its Freedom Conference is confirmed for 10 November.',
        '**Keep 9 November grounded in real Berlin history.** A Wall-history visit can be meaningful without claiming a 2026 ceremony, time, language or access detail that has not been published.',
        '**The Berlin Wall Memorial at Bernauer Strasse is the stronger history companion.** It is not the same as tracing the Wall line on my historic-centre walking tour.',
        '**Use the official Week programme for specific events.** Programme information can still develop, so a date alone is not a booking instruction.',
        '**Give the history visit its own part of the day.** The free walking tour starts at Alexanderplatz, lasts about 2 hours and explores the historic centre of former East Berlin.'
      ]
    },
    faq: {
      title: 'Berlin Freedom Week 2026 - FAQ',
      subtitle: 'What is confirmed for the week and how to avoid turning missing programme details into promises.',
      items: [
        { q: 'When is Berlin Freedom Week 2026?', a: 'Berlin Freedom Week runs from 7 to 14 November 2026.' },
        { q: 'When is the Freedom Conference in 2026?', a: 'The Freedom Conference is confirmed for 10 November 2026. Check the official programme for its current venue, access and registration details.' },
        { q: 'What should I do in Berlin on 9 November 2026?', a: 'Choose a real history site and check the live official programme before adding a special event to your day. Do not assume a ceremony, time, language or access rule until the responsible organiser publishes it.' },
        { q: 'Can I combine Berlin Freedom Week with the BerlinWalk tour?', a: 'Yes, if you give them separate blocks. The free walking tour starts at Alexanderplatz and explores the historic centre of former East Berlin in about 2 hours. It does not trace the Berlin Wall line or replace a Wall memorial visit.' },
        { q: 'Which Berlin Wall site is useful for a November history visit?', a: 'The Berlin Wall Memorial on Bernauer Strasse is a strong choice for Wall history. Use its current visitor information and the official Freedom Week programme to decide whether a special 2026 event is confirmed.' }
      ]
    }
  },
  'christmas-garden-berlin': {
    quick: {
      title: 'Christmas Garden Berlin 2026 - Quick Summary',
      icon: '✨',
      kicker: 'BERLINWALK.COM • BERLIN EVENTS',
      items: [
        '**Christmas Garden Berlin runs from 18 November 2026 to 10 January 2027 at the Berlin Botanical Garden.** It is a timed light trail, not a Christmas market.',
        '**The published closed nights are 23, 24 and 30 November; 7, 24 and 31 December; and 4 and 5 January.** Check the live ticket calendar before paying.',
        '**On the normal schedule, last entry is listed at 19:20 and the final trail start at 19:45.** Friday and Saturday evenings from 18 December to 2 January have later listed final times.',
        '**Choose the ticket time first, then work backwards from your actual departure area.** A live route check matters more than a fixed city-centre travel estimate.',
        '**Treat availability, weather and access as day-of checks.** A listed schedule is not a promise that a specific time slot is still on sale.'
      ]
    },
    faq: {
      title: 'Christmas Garden Berlin 2026 - FAQ',
      subtitle: 'Dates, closed nights and how to plan a timed Botanical Garden visit.',
      items: [
        { q: 'When is Christmas Garden Berlin 2026?', a: 'Christmas Garden Berlin runs from 18 November 2026 to 10 January 2027 at the Berlin Botanical Garden.' },
        { q: 'Which nights is Christmas Garden Berlin closed?', a: 'The published closed nights are 23, 24 and 30 November; 7, 24 and 31 December; and 4 and 5 January. Recheck the live ticket calendar before paying.' },
        { q: 'What is the last entry time for Christmas Garden Berlin?', a: 'The normal published schedule lists last entry at 19:20 and the final trail start at 19:45. On Fridays and Saturdays from 18 December to 2 January, the listed final times are later: 20:20 for entry and 20:45 for the trail start.' },
        { q: 'How should I choose a Christmas Garden ticket time?', a: 'Choose a listed ticket time, then check the live route from your real starting point. Do not treat the schedule as a fixed central-Berlin departure or return promise.' },
        { q: 'Is Christmas Garden Berlin a Christmas market?', a: 'No. It is a timed light trail at the Berlin Botanical Garden. Plan it as its own evening experience and keep the exact ticket, weather and route checks separate.' }
      ]
    }
  },
  'berlin-christmas-events-beyond-markets': {
    quick: {
      title: 'Berlin at Christmas Beyond the Markets - Quick Summary',
      icon: '❄️',
      kicker: 'BERLINWALK.COM • BERLIN EVENTS',
      items: [
        '**This guide uses four verified non-market winter runs:** Christmas at the Tierpark, Original Berliner Weihnachtscircus, Roncalli Weihnachtscircus and the Louis Lewandowski Festival.',
        '**The confirmed planning window runs from 20 November 2026 to 9 January 2027.** Each event has its own last date and its own ticket or access terms.',
        '**Christmas at the Tierpark runs 20 November to 9 January.** Original Berliner Weihnachtscircus runs 11 December to 3 January, and Roncalli runs 17 December to 3 January.',
        "**The Louis Lewandowski Festival runs 17 to 20 December.** Its individual concert locations, times and access conditions need the organiser's live schedule.",
        '**Choose one venue and one actual date.** The run windows show what may fit your stay, but only the organiser can confirm an exact session.'
      ]
    },
    faq: {
      title: 'Berlin at Christmas Beyond the Markets - FAQ',
      subtitle: 'Four verified winter events, their run windows and the ticket checks that still matter.',
      items: [
        { q: 'What can I do in Berlin at Christmas besides markets?', a: 'This guide tracks four verified non-market options: Christmas at the Tierpark, Original Berliner Weihnachtscircus at Olympiastadion, Roncalli Weihnachtscircus at Tempodrom and the Louis Lewandowski Festival.' },
        { q: 'Which Berlin winter event runs into January 2027?', a: 'Christmas at the Tierpark runs from 20 November 2026 to 9 January 2027. The two circuses in this guide run until 3 January, while the Louis Lewandowski Festival ends on 20 December.' },
        { q: 'Are these four events covered by one Christmas ticket?', a: "These are separate organisers. Check each organiser's current session, ticket and access terms before buying." },
        { q: 'Which event is best for a winter light walk?', a: 'Christmas at the Tierpark is the light-walk choice in this guide. It is at Tierpark Berlin in Lichtenberg and its run window is 20 November to 9 January.' },
        { q: 'How should I plan a Berlin Christmas event around my travel dates?', a: 'Use the confirmed run window to identify events that may fit, then check the exact performance or concert date, venue, ticket type and live journey with the responsible organiser.' }
      ]
    }
  }
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  const temp = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  fs.renameSync(temp, file);
}

function faqConfig(value) {
  return { title: value.title, subtitle: value.subtitle, items: value.items };
}

function faqShard(slug, config) {
  return {
    version: 1,
    slug,
    key: slug,
    config,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: config.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  };
}

const quickPath = path.join(ROOT, 'quick-summary', 'data.json');
const faqPath = path.join(ROOT, 'faq', 'data.json');
const quick = readJson(quickPath);
const faq = readJson(faqPath);
const planned = Object.entries(DATA);

for (const [slug, value] of planned) {
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug), `Invalid slug: ${slug}`);
  assert(value.quick.items.length >= 4, `${slug}: quick summary needs at least four items`);
  assert(value.faq.items.length >= 5, `${slug}: FAQ needs at least five items`);
  if (quick[slug]) assert(quick[slug].title === value.quick.title, `${slug}: existing Quick Summary entry belongs to another package`);
  if (faq[slug]) assert(faq[slug].title === value.faq.title, `${slug}: existing FAQ entry belongs to another package`);
}

for (const [slug, value] of planned) {
  quick[slug] = value.quick;
  faq[slug] = faqConfig(value.faq);
}

if (!apply) {
  for (const [slug] of planned) console.log(`CREATE ${slug}: quick-summary + FAQ aggregate and shards`);
  console.log('Dry run only. Re-run with --apply to write the local data package.');
  process.exit(0);
}

writeJson(quickPath, quick);
writeJson(faqPath, faq);
for (const [slug, value] of planned) {
  writeJson(path.join(ROOT, 'quick-summary', 'data', `${slug}.json`), value.quick);
  writeJson(path.join(ROOT, 'faq', 'data', `${slug}.json`), faqShard(slug, faqConfig(value.faq)));
}
console.log(`Applied Quick Summary and FAQ data for ${planned.length} event posts.`);
