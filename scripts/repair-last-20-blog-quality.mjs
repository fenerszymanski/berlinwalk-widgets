#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API_ROOT = 'https://www.wixapis.com';
const SITE_ID = process.env.WIX_SITE_ID || '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_OUT_DIR = path.join(REPO_ROOT, 'output', 'qa', 'blog-last20-quality-repair-20260819');
const RELEASE_VERSION = '20260819quality1';

const TARGETS = [
  {
    id: '6a041b4b-dd44-47d5-b033-de7eb5b386d6',
    slug: 'english-bookshops-in-berlin',
    title: 'English Bookshops in Berlin: Three Stops That Fit a Real Day',
    beforeHash: 'b0fc86634500401ee78a6b7d98c2b4e3ced5752fbbd226c03939f712da2f7211',
    replacements: [
      {
        old: 'Berlin has the kind of bookshop problem that sounds pleasant until you are standing outside at 4pm with one hour left, a wet tote bag and no idea whether you need a huge English shelf, a quiet café table or one specific novel. I have made that mistake before: I treated every bookshop pin as interchangeable, then spent the useful part of the afternoon crossing the city.',
        new: 'Berlin has the kind of bookshop problem that sounds pleasant until you are standing outside at 4pm with one hour left, a wet tote bag and no idea whether you need a huge English shelf, a quiet café table or one specific novel. Treating every bookshop pin as interchangeable is how that useful hour disappears into transport.',
      },
    ],
  },
  {
    id: 'fe4ca293-9682-47f0-9534-bd2128e512a9',
    slug: 'berlin-opera-for-first-time-visitors',
    title: 'Berlin Opera for First-Time Visitors: Which House Fits Your Evening?',
    beforeHash: '544e4e71cdaee243b73d69bf988308decf0742988ce33856adac45786ca67b38',
    textEdits: {
      text_73: [' if the specific production catches you and you have checked the current venue. The point is not to label one house more adventurous than another from a travel blog. The point is to read the production page, save Bismarckstraße 110 when it is the listed location, and arrive at the building the company actually names.', ' if the specific production catches you and you have checked the current venue. Do not label one house more adventurous than another from a travel blog. Read the production page, save Bismarckstraße 110 when it is the listed location, and arrive at the building the company actually names.'],
    },
  },
  {
    id: 'c326c72e-2740-44ea-bb1f-ef10821bcfe2',
    slug: 'how-to-read-a-berlin-address',
    title: 'How to Read a Berlin Address: Street Names, House Numbers and the Clues That Get You There',
    beforeHash: '35888670db1f33f56e1337414666e562ba13dca319de099cc9c54f400d47d0ff',
    replacements: [
      {
        old: 'My advice: do not copy only the street name and hope the map fills in the rest. Keep the street, number, postcode and any entrance note as one address. I have made that mistake before, usually by treating the little letter after a house number as a detail rather than the bit that gets you to the right door.',
        new: 'Do not copy only the street name and hope the map fills in the rest. Keep the street, number, postcode and any entrance note as one address. A small letter after the house number is easy to dismiss, but it can be the detail that gets you to the right door.',
      },
      {
        old: 'The point is not to make Berlin feel like a form to complete. It is to give one address enough attention that you arrive calmly, ring the right bell and have your attention left for the city around you.',
        new: 'This is not about making Berlin feel like a form to complete. Give one address enough attention that you arrive calmly, ring the right bell and still have attention left for the city around you.',
      },
    ],
  },
  {
    id: '878b087d-6366-4383-8830-d6bd38c093a9',
    slug: 'cash-only-restaurants-in-berlin',
    title: 'Cash-Only Restaurants in Berlin: A Food-Day Payment Plan for Visitors',
    beforeHash: 'a964d59094f3817264dd5ab0098e2709bbe65d3e3d5f4acce713bb2adaf25148',
    replacements: [
      {
        old: 'My advice: do not turn Berlin into a hunt for cash-only places. Treat cash as a calm backup for a food day, then ask before you commit to an order. I have made that mistake before: assuming the payment part will sort itself out because the counter feels informal. One direct question is faster than a rescue mission after the bill arrives.',
        new: 'Do not turn Berlin into a hunt for cash-only places. Treat cash as a calm backup for a food day, then ask before you commit to an order. An informal counter is not a promise that the payment part will sort itself out. One direct question is faster than a rescue mission after the bill arrives.',
      },
    ],
  },
  {
    id: '69720841-8f9b-43ad-83eb-84294a2994fe',
    slug: 'berlin-spy-museum-worth-it',
    title: 'Berlin Spy Museum: Is It Worth Your Time on a First Visit?',
    beforeHash: '16cadc622b59ca35c4519c287ca2bcc3584dc1d1cccbc5fca2980aab20a2ccd9',
    htmlEdits: [
      {
        id: 'widget_berlin_spy_museum_mission_match',
        old: 'https://fenerszymanski.github.io/berlinwalk-widgets/berlin-spy-museum-mission-match/?v=20260817sol1121',
        new: `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-spy-museum-mission-match/?v=${RELEASE_VERSION}`,
      },
    ],
  },
  {
    id: '8d2b9568-686b-4a00-93bc-a6886399293d',
    slug: 'berlin-with-parents',
    title: 'Berlin With Parents: A Calm Historic-Centre Day Without the Rushed Checklist',
    beforeHash: '05cccd7a59c87ded13c8d6de2b22df71c837bc07771aa53566de237a4c34672b',
    replacements: [
      {
        old: 'Travelling in Berlin with parents does not mean treating the city as fragile. It means choosing the part of the day that deserves their energy before Alexanderplatz, Museum Island and the Brandenburg Gate turn into a points race. I have made that mistake before: the group reaches a famous place, but nobody has the attention left to enjoy it. A calmer historic-centre day has one beginning, one meaningful stop and a clear point at which it is allowed to be finished.',
        new: 'Travelling in Berlin with parents does not mean treating the city as fragile. It means choosing the part of the day that deserves their energy before Alexanderplatz, Museum Island and the Brandenburg Gate turn into a points race. That plan fails when the group reaches a famous place but nobody has the attention left to enjoy it. A calmer historic-centre day has one beginning, one meaningful stop and a clear point at which it is allowed to be finished.',
      },
      {
        old: 'The World Time Clock at Alexanderplatz is a practical place to meet because nobody needs to hunt for a hidden entrance or understand a complicated map first. From there, take the day toward Nikolaiviertel or the Spree at an unhurried pace. The point is not to collect distance. It is to give the first hour a real Berlin scene: the square, the television tower, the older street pattern beyond it and the river nearby.',
        new: 'The World Time Clock at Alexanderplatz is a practical place to meet because nobody needs to hunt for a hidden entrance or understand a complicated map first. From there, take the day toward Nikolaiviertel or the Spree at an unhurried pace. Distance is not the goal. Give the first hour a real Berlin scene: the square, the television tower, the older street pattern beyond it and the river nearby.',
      },
    ],
  },
  {
    id: '6e78f146-56f6-48f0-b6f7-a1141f751a59',
    slug: 'berlin-landmarks-in-two-hours',
    title: 'Berlin Landmarks in 2 Hours: Choose an East or West Start',
    beforeHash: 'cf69627c8a9f9ae1f5c26edefd3bbb478f689dede8b62c7b08b141c265ff9e08',
    replacements: [
      {
        old: 'The point is not to crown one side the winner. It is to stop pretending that east and west are one quick loop.',
        new: 'There is no need to crown one side the winner. The useful decision is which side gets your two hours.',
      },
    ],
  },
  {
    id: 'ffb7dfb4-0ac1-41b1-9f13-3d53a6dec49c',
    slug: 'free-berlin-memorials',
    title: 'Free Berlin Memorials: Four Powerful Places That Are Easy to Visit',
    beforeHash: 'f2954e95419b68e880a51c312b27d348413f9dbf49f3f1cc6df3e50ff16902db',
    replacements: [
      {
        old: 'I would not begin by trying to photograph the whole field from its edge. Walk into it, notice how the ground falls and rises, and then decide whether you want the names, biographies and family stories in the Information Centre. The point is not to finish the site quickly. The point is to let the scale become personal before moving on to the institutions that made the crimes possible.',
        new: 'I would not begin by trying to photograph the whole field from its edge. Walk into it, notice how the ground falls and rises, and then decide whether you want the names, biographies and family stories in the Information Centre. Do not rush to finish the site. Let the scale become personal before moving on to the institutions that made the crimes possible.',
      },
    ],
  },
  {
    id: '9ade54d5-8e51-4cc7-9822-093d50c1c43e',
    slug: 'what-to-wear-for-a-berlin-walking-tour',
    title: 'What to Wear for a Berlin Walking Tour: Shoes, Layers and Rain',
    beforeHash: '873aa29ad59979e5680f6ab892e5ae8262b4aab15227d4ca3ab799ea9ef7b820',
    replacements: [
      {
        old: 'I have made that mistake before. My practical rule is simple: dress for the time you will spend outside, build layers you can remove, and choose shoes for the ground rather than the photograph. Berlin rewards a comfortable pair of feet much more than a perfect outfit.',
        new: 'My rule is simple: dress for the time you will spend outside, build layers you can remove, and choose shoes for the ground rather than the photograph. Berlin rewards a comfortable pair of feet much more than a perfect outfit.',
      },
    ],
  },
  {
    id: '24b7b475-bb30-4c60-84f3-4c92828b861a',
    slug: 'travelling-alone-in-berlin-day-plan',
    title: 'Travelling Alone in Berlin: Build a Day With One Good Anchor',
    nextTitle: 'Travelling Alone in Berlin: Pick the Right Area for Your Solo Day',
    nextExcerpt: 'Choose the historic centre, Tiergarten or Kreuzberg first, then build a solo Berlin day with one proper stop and a flexible finish.',
    beforeHash: '33ba3198fde2ddb5ad95a5cd2bdfcb1498d10b6d71b69ba3bac8c79c58174c51',
    textEdits: {
      text_4: ['I have made that mistake before. Berlin rewards wandering, but a day with no shape can turn into a lot of transport and very little memory. My practical answer is simple: choose one good anchor, add one nearby hinge, and let the last part of the day stay flexible.', 'Berlin rewards wandering, but a day with no shape can turn into a string of train rides between saved pins. Choose one part of Berlin first, give one real place the middle of the day, and keep the finish flexible.'],
      text_6: ['One anchor is better than ten pins', 'Choose one part of Berlin before you leave'],
      text_8: ['An anchor is the place that gives the day its mood. It is not necessarily the biggest sight. It is the place you would still be glad to have visited if the rest of the plan disappears.', 'Start with the part of the city you want to understand today. You do not need the biggest sight. You need a starting area that still feels worthwhile if the rest of the plan changes.'],
      text_23: [' start around Kottbusser Tor, follow Oranienstraße, and make Markthalle Neun the definite food hinge if its current opening hours fit your day. The point is not to collect Kreuzberg. It is to stay long enough to notice how the area changes from one street to the next.', ' start around Kottbusser Tor, follow Oranienstraße, and make Markthalle Neun the food stop if its current opening hours fit your day. Stay around Kreuzberg long enough to notice how the area changes from one street to the next.'],
      text_27: [' turns those three moods into a simple three-stop shape. It is a decision aid, not a promise about walking time, opening hours or the next train.', ' turns those three areas into a three-stop plan. It helps you choose real places; it does not promise walking time, opening hours or the next train.'],
      text_30: ['Alexanderplatz at night, where a clear landmark and several transport connections make a practical first anchor.', 'Alexanderplatz at night, where a clear landmark and several transport connections make a practical starting point.'],
      text_32: ['Build the middle around a real place', 'Give the middle of the day to one real place'],
      text_34: ['Once you have an anchor, choose one hinge. A hinge is where you stop trying to see more and give yourself a reason to stay.', 'After you choose the area, give yourself one reason to stay. Enter one museum, sit in a park or stop for food before you decide whether to move again.'],
      text_36: ['For the history shape, Museum Island is a strong hinge because the buildings, the Spree and the routes around Lustgarten give you something to look at even if you do not enter a museum. Berlin.de describes it as a central ensemble of five museums, and its visitor information lists S Hackescher Markt and U Museumsinsel among the nearby connections. Check the individual museum page before you commit to a ticket or time slot. ', 'For the history route, Museum Island works because the buildings, the Spree and the paths around Lustgarten give you something to look at even if you do not enter a museum. Berlin.de describes it as a central ensemble of five museums, and its visitor information lists S Hackescher Markt and U Museumsinsel among the nearby connections. Check the individual museum page before you commit to a ticket or time slot. '],
      text_59: ['Markthalle Neun can work as a food hinge when its current programme and opening hours fit the day. It is a place to stop, look around, and decide whether Kreuzberg still has your attention. It is not a guarantee that every stall will be open or that a specific vendor will be there.', 'Markthalle Neun can be the food stop when its current programme and opening hours fit the day. It is a place to stop, look around, and decide whether Kreuzberg still has your attention. It is not a guarantee that every stall will be open or that a specific vendor will be there.'],
      text_62: ['Markthalle Neun in Kreuzberg, a definite food hinge when the current opening information fits your day.', 'Markthalle Neun in Kreuzberg, a possible food stop when the current opening information fits your day.'],
      text_72: [" shortly before you leave each anchor. BVG's tourist information also explains that S-Bahn and U-Bahn service patterns change at night, with night buses covering some weekday gaps. That is enough reason to check the return journey before the last drink, not after it.", " shortly before you leave the place you are in. BVG's tourist information also explains that S-Bahn and U-Bahn service patterns change at night, with night buses covering some weekday gaps. That is enough reason to check the return journey before the last drink, not after it."],
      text_82: ['Sometimes the best anchor is not a place. It is two hours with a guide and other visitors, followed by the freedom to choose the rest of the day alone.', 'Sometimes the most useful first move is two hours with a guide and other visitors, followed by the freedom to choose the rest of the day alone.'],
      text_88: ['If that sounds like the right first anchor, ', 'If that sounds like the right start, '],
      text_111: ['That is the whole method. One anchor, one hinge, one honest finish. The city stays open, but your day stops asking you to make twenty decisions before lunch.', 'Choose one part of Berlin, stay for one proper stop, and finish near the area that is already working. That is enough structure to stop the day becoming twenty decisions before lunch.'],
    },
    imageAltEdits: {
      image_28: ['Alexanderplatz at night with a moving tram, a useful first anchor when you are travelling alone in Berlin', 'Alexanderplatz at night with a moving tram, a clear meeting point when you are travelling alone in Berlin'],
      image_39: ['Museum Island and Berlin Cathedral, a compact historic centre anchor for a solo afternoon', 'Museum Island and Berlin Cathedral, a compact historic-centre stop for a solo afternoon'],
      image_60: ['The interior of Markthalle Neun in Kreuzberg, a definite food hinge for a solo day', 'The interior of Markthalle Neun in Kreuzberg, a possible food stop for a solo day'],
    },
    htmlEdits: [
      { id: 'quick_summary_travelling_alone_in_berlin_day_plan', old: 'https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=travelling-alone-in-berlin-day-plan&v=20260815sol0708', new: `https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=travelling-alone-in-berlin-day-plan&v=${RELEASE_VERSION}` },
      { id: 'widget_berlin_solo_day_path', old: 'https://fenerszymanski.github.io/berlinwalk-widgets/berlin-solo-day-path/?v=20260815sol0708', new: `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-solo-day-path/?v=${RELEASE_VERSION}` },
      { id: 'faq_travelling_alone_in_berlin_day_plan', old: 'https://fenerszymanski.github.io/berlinwalk-widgets/faq/?post=travelling-alone-in-berlin-day-plan&v=20260815sol0708', new: `https://fenerszymanski.github.io/berlinwalk-widgets/faq/?post=travelling-alone-in-berlin-day-plan&v=${RELEASE_VERSION}` },
    ],
    addSoloCredits: true,
    seoProfile: 'solo',
  },
  {
    id: '37b9b005-f5a1-4eb5-951e-1cc7d19927cf',
    slug: 'private-berlin-tour-for-groups',
    title: 'Private Berlin Tour for Groups: Build the Right Berlin Day',
    nextExcerpt: "Choose between BerlinWalk's fixed public walk and a private historic-centre route whose pace and emphasis can be confirmed around your group.",
    beforeHash: '35effd30ab8aa8dbec0d7100feea0fe1a1c39200389ef9f95f3c542bd437090c',
    textEdits: {
      text_33: [' before you book. It shows the route I actually walk: eleven stops across sixteen places, from the World Clock at Alexanderplatz to Hackescher Markt, about three kilometres in about two hours. Then pick the version your group needs, and the map shows which stops keep the time and which ones I let go.', ' before you book. Choose the version that sounds like your group: a classic central walk, a slower pace, a child-friendly shape, a twentieth-century focus, more Museum Island context or a shorter highlights route. The map shows which central stopping points keep the time and which ones are reduced.'],
      text_35: ['That is the honest scope of a private walk. It is the same historic centre route on your own date, with only your group, weighted the way your group needs it. Charlottenburg Palace and the East Side Gallery belong to a separate part of your trip, not to the same two hours.', 'The tool shows the order and emphasis of one central route. It is a planning signal, not a promised final route or a turn-by-turn travel time. I still need the date, group size, preferred start and any access needs before confirming what the walk can honestly include.'],
      text_46: ['Marx and Engels Forum with the Berliner Dom in the background, a useful central hinge between several Berlin stories.', 'Marx and Engels Forum with the Berliner Dom in the background, a central place where several Berlin stories meet.'],
      text_58: ['If the group has different must-sees, make one person’s fixed booking the anchor and choose one shared hinge nearby. Do not promise four districts just because the map makes them look interesting.', 'If the group has different must-sees, start with the least flexible booking and choose one shared stop nearby. Do not promise four districts just because the map makes them look interesting.'],
      text_72: ['Museum Island is a strong central anchor when a group wants history, architecture and a route that can stay compact.', 'Museum Island works as a compact central base when a group wants history and architecture without another cross-city move.'],
    },
    htmlEdits: [
      { id: 'quick_summary_private_berlin_tour_groups', old: 'https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=private-berlin-tour-for-groups&v=20260814sol2012', new: `https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=private-berlin-tour-for-groups&v=${RELEASE_VERSION}` },
      { id: 'widget_berlin_private_route_brief', old: 'https://fenerszymanski.github.io/berlinwalk-widgets/berlin-private-route-brief/?v=20260814sol2012', new: `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-private-route-brief/?v=${RELEASE_VERSION}` },
      { id: 'faq_private_berlin_tour_groups', old: 'https://fenerszymanski.github.io/berlinwalk-widgets/faq/?post=private-berlin-tour-for-groups&v=20260814sol2012', new: `https://fenerszymanski.github.io/berlinwalk-widgets/faq/?post=private-berlin-tour-for-groups&v=${RELEASE_VERSION}` },
    ],
    seoProfile: 'private',
  },
  {
    id: '67fb7829-a9ce-4269-b1ba-7362dc4f66dc',
    slug: 'berlin-itinerary-for-couples',
    title: 'Berlin Itinerary for Couples: Build One Day Around Two Different Interests',
    nextExcerpt: 'Plan one Berlin day around two different interests: put the least flexible promise first, give each traveller one real choice and connect them with one shared pause.',
    beforeHash: 'e10b55702fd2426975817d772e6dc19c2035ad8e3807a7eb4d63b276cb73d2bd',
    textEdits: {
      text_6: ['. Give each person one must-do, choose one shared hinge between them, and let one part of Berlin own each half of the day. That produces a better Berlin itinerary for couples than a generic list of romantic places.', '. Give each person one must-do, choose one shared pause between them, and let one part of Berlin own each half of the day. That produces a better Berlin itinerary for couples than a generic list of romantic places.'],
      text_15: [". Put the stop with a fixed ticket, reservation or opening window into the day first. Then add the other person's flexible choice in the nearest sensible area. Use one cafe, park, market or riverside walk as the shared hinge.", ". Put the stop with a fixed ticket, reservation or opening window into the day first. Then add the other person's flexible choice in the nearest sensible area. Use one cafe, park, market or riverside walk as the shared pause."],
      text_27: ['Use difference as the structure. One interest takes the lead before the shared hinge. The other takes the lead after it. You still spend the day together, but nobody has to pretend that every stop was their first choice.', 'Use difference as the structure. One interest takes the lead before the shared pause. The other takes the lead after it. You still spend the day together, but nobody has to pretend that every stop was their first choice.'],
      text_40: ['Museum Island works as a fixed cultural anchor. Let the official ticket information set the time, then build the flexible part of the day around it.', 'Museum Island works as a fixed cultural stop. Let the official ticket information set the time, then build the flexible part of the day around it.'],
      text_50: ['This pairing gives the museum lover a proper visit without making the other person wait inside three collections. It also gives the non-museum half a specific place rather than “just wandering around Mitte.” If you need help choosing the indoor anchor, my ', 'This pairing gives the museum lover a proper visit without making the other person wait inside three collections. It also gives the non-museum half a specific place rather than “just wandering around Mitte.” If you need help choosing the indoor stop, my '],
      text_60: ['Markthalle Neun can be a useful food anchor, but it is not a promise of a particular event every evening. Check the ', 'Markthalle Neun can be a useful food stop, but it is not a promise of a particular event every evening. Check the '],
      text_82: ['The tool below is designed for two people sharing one phone. Traveller A privately chooses two Berlin postcards, seals the choice and passes the phone. Traveller B does the same. The reveal gives you one shared hinge and one personal stop for each person.', 'The tool below is designed for two people sharing one phone. Traveller A privately chooses two Berlin postcards, seals the choice and passes the phone. Traveller B does the same. The reveal gives you one shared stop and one personal stop for each person.'],
      text_90: ['The shared hinge should be simple enough that neither person has to research it for another hour. A coffee beside the Spree, one bridge crossing, a market lunch or a park bench can do the job. It is the seam in the day, not a third major attraction.', 'The shared pause should be simple enough that neither person has to research it for another hour. A coffee beside the Spree, one bridge crossing, a market lunch or a park bench can do the job. It connects the day without becoming a third major attraction.'],
      text_102: ['Booking two distant anchors', 'Booking two distant reservations'],
      text_107: ['A market or meal can be the shared hinge, but check the current programme before treating Markthalle Neun as a fixed event.', 'A market or meal can be the shared pause, but check the current programme before treating Markthalle Neun as a fixed event.'],
      text_119: ['Make the next move simple: each person chooses one must-do now. Put the less flexible one on the calendar, then use the Berlin Day Duet to find the hinge.', 'Make the next move simple: each person chooses one must-do now. Put the less flexible one on the calendar, then use the Berlin Day Duet to find the shared stop.'],
    },
    htmlEdits: [
      { id: 'quick_summary_berlin_itinerary_for_couples', old: 'https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=berlin-itinerary-for-couples&v=20260814sol1708', new: `https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=berlin-itinerary-for-couples&v=${RELEASE_VERSION}` },
      { id: 'widget_berlin_day_duet', old: 'https://fenerszymanski.github.io/berlinwalk-widgets/berlin-day-duet/?v=20260814sol1708', new: `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-day-duet/?v=${RELEASE_VERSION}` },
      { id: 'faq_berlin_itinerary_for_couples', old: 'https://fenerszymanski.github.io/berlinwalk-widgets/faq/?post=berlin-itinerary-for-couples&v=20260814sol1708', new: `https://fenerszymanski.github.io/berlinwalk-widgets/faq/?post=berlin-itinerary-for-couples&v=${RELEASE_VERSION}` },
    ],
    seoProfile: 'couples',
  },
  {
    id: 'b5113f3c-db07-419a-9efb-a122eabf6bac',
    slug: 'best-museums-in-berlin-first-time-visitors',
    title: 'Best Museums in Berlin for First-Time Visitors: Pick Three, Not Thirty',
    beforeHash: '57bc1447921cc7a75cdebff23cac983e46bd7445ff0d3bc67853e3b14cdf53d3',
    textEdits: {
      text_79: ['Do not add the Pergamonmuseum just because it is the name you remember from a guidebook. Its closure and reopening phases have changed the practical Museum Island decision, so check my ', 'Do not add the Pergamonmuseum just because it is the name you remember from a guidebook. It remains completely closed, and the official reopening date is 4 June 2027. Check the '],
      text_80: ['Pergamon closure guide', 'Staatliche Museen zu Berlin announcement'],
    },
    urlEdits: [
      { old: 'https://www.berlinwalk.com/post/is-the-pergamon-museum-closed-what-every-tourist-needs-to-know-in-2026', new: 'https://www.smb.museum/en/press/press-releases/detail/museumsinsel-berlin-the-pergamonmuseum-returns-reopening-462027/' },
    ],
    htmlEdits: [
      { id: 'embed_5', old: 'https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=best-museums-in-berlin-first-time-visitors&v=20260803', new: `https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=best-museums-in-berlin-first-time-visitors&v=${RELEASE_VERSION}` },
      { id: 'embed_118', old: 'https://fenerszymanski.github.io/berlinwalk-widgets/faq/?post=best-museums-in-berlin-first-time-visitors&v=20260803', new: `https://fenerszymanski.github.io/berlinwalk-widgets/faq/?post=best-museums-in-berlin-first-time-visitors&v=${RELEASE_VERSION}` },
    ],
    seoProfile: 'faq-only',
  },
];

function parseArgs(argv) {
  const args = { apply: false, publish: false, outDir: DEFAULT_OUT_DIR };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--apply') args.apply = true;
    else if (token === '--publish') args.publish = true;
    else if (token === '--out-dir') args.outDir = path.resolve(argv[++index]);
    else throw new Error(`Unknown argument: ${token}`);
  }
  if (args.publish && !args.apply) throw new Error('--publish requires --apply');
  return args;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sha256(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function authHeaders() {
  assert(process.env.WIX_API_KEY, 'Missing WIX_API_KEY. Run the root Keychain loader first.');
  return {
    Authorization: process.env.WIX_API_KEY,
    'wix-site-id': SITE_ID,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

async function requestJson(pathname, { method = 'GET', body, timeoutMs = 30_000 } = {}) {
  const response = await fetch(`${API_ROOT}${pathname}`, {
    method,
    headers: authHeaders(),
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const raw = await response.text();
  let payload = {};
  try { payload = raw ? JSON.parse(raw) : {}; } catch { payload = { raw }; }
  if (!response.ok) {
    throw new Error(`Wix ${method} ${pathname} failed (${response.status}): ${payload.message || raw.slice(0, 800)}`);
  }
  return { status: response.status, payload };
}

async function publishOnce(pathname) {
  try {
    const response = await fetch(`${API_ROOT}${pathname}`, {
      method: 'POST',
      headers: authHeaders(),
      body: '{}',
      signal: AbortSignal.timeout(30_000),
    });
    const raw = await response.text();
    let payload = {};
    try { payload = raw ? JSON.parse(raw) : {}; } catch { payload = { raw }; }
    return { transport: 'RECEIVED', status: response.status, ok: response.ok, payload };
  } catch (error) {
    return { transport: 'AMBIGUOUS', status: null, ok: false, error: String(error?.message || error) };
  }
}

async function readPair(target) {
  const [draftResult, publishedResult] = await Promise.all([
    requestJson(`/blog/v3/draft-posts/${encodeURIComponent(target.id)}?fieldsets=RICH_CONTENT`),
    requestJson(`/blog/v3/posts/${encodeURIComponent(target.id)}?fieldsets=RICH_CONTENT`),
  ]);
  return {
    draft: draftResult.payload.draftPost || draftResult.payload,
    published: publishedResult.payload.post || publishedResult.payload,
  };
}

function walk(value, visitor) {
  if (!value || typeof value !== 'object') return;
  visitor(value);
  if (Array.isArray(value)) value.forEach((item) => walk(item, visitor));
  else Object.values(value).forEach((item) => walk(item, visitor));
}

function findNode(value, id) {
  let found = null;
  walk(value, (item) => {
    if (item.id === id) {
      assert(!found, `Duplicate Ricos node id: ${id}`);
      found = item;
    }
  });
  return found;
}

function applyReplacement(richContent, edit) {
  if (edit.optionalMarkdownOnly) return 0;
  let count = 0;
  walk(richContent, (item) => {
    if (item.type === 'TEXT' && item.textData?.text === edit.old) {
      item.textData.text = edit.new;
      count += 1;
    }
  });
  assert(count === 1, `Expected one exact rich-text replacement, found ${count}: ${edit.old.slice(0, 80)}`);
  return count;
}

function applyTextEdits(richContent, edits = {}) {
  for (const [id, [oldText, newText]] of Object.entries(edits)) {
    const node = findNode(richContent, id);
    assert(node?.type === 'TEXT', `Missing TEXT node ${id}`);
    assert(node.textData?.text === oldText, `${id} old text drift`);
    node.textData.text = newText;
  }
}

function applyImageAltEdits(richContent, edits = {}) {
  for (const [id, [oldText, newText]] of Object.entries(edits)) {
    const node = findNode(richContent, id);
    assert(node?.type === 'IMAGE', `Missing IMAGE node ${id}`);
    assert(node.imageData?.altText === oldText, `${id} old alt text drift`);
    node.imageData.altText = newText;
  }
}

function applyHtmlEdits(richContent, edits = []) {
  for (const edit of edits) {
    const node = findNode(richContent, edit.id);
    assert(node?.type === 'HTML', `Missing HTML node ${edit.id}`);
    assert(node.htmlData?.url === edit.old, `${edit.id} URL drift: ${node.htmlData?.url || 'missing'}`);
    node.htmlData.url = edit.new;
  }
}

function applyUrlEdits(richContent, edits = []) {
  for (const edit of edits) {
    let count = 0;
    walk(richContent, (item) => {
      if (item?.url === edit.old) {
        item.url = edit.new;
        count += 1;
      }
    });
    assert(count === 1, `Expected one URL replacement for ${edit.old}, found ${count}`);
  }
}

function stripUnsupportedSpoilers(richContent) {
  let count = 0;
  walk(richContent, (item) => {
    if (item.type === 'HTML' && Object.prototype.hasOwnProperty.call(item.htmlData?.containerData || {}, 'spoiler')) {
      delete item.htmlData.containerData.spoiler;
      count += 1;
    }
  });
  return count;
}

function textNode(id, text, url = '') {
  return {
    type: 'TEXT',
    id,
    nodes: [],
    textData: {
      text,
      decorations: url ? [{ type: 'LINK', linkData: { link: { url, target: 'BLANK' } } }] : [],
    },
  };
}

function creditParagraph(slug, index, credit) {
  const prefix = `article_image_credits_${slug}_credit_${index}`;
  return {
    type: 'PARAGRAPH',
    id: prefix,
    nodes: [
      textNode(`${prefix}_source`, credit.label, credit.source),
      textNode(`${prefix}_by`, ` by ${credit.author}, `),
      textNode(`${prefix}_licence`, credit.licence, credit.licenceUrl),
      textNode(`${prefix}_full_stop`, '.'),
    ],
    paragraphData: { textStyle: { textAlignment: 'AUTO', lineHeight: '1.55' }, indentation: 0 },
  };
}

function soloCreditsNode() {
  const slug = 'travelling_alone_in_berlin_day_plan';
  const prefix = `article_image_credits_${slug}`;
  const credits = [
    { label: 'Alexanderplatz at night with a moving tram', author: 'domdomegg', source: 'https://commons.wikimedia.org/wiki/File:Alexanderplatz_at_night_with_blurred_moving_tram.jpg', licence: 'CC BY 4.0', licenceUrl: 'https://creativecommons.org/licenses/by/4.0/' },
    { label: 'Museum Island and Berlin Cathedral', author: 'Bassel Khabbaz', source: 'https://commons.wikimedia.org/wiki/File:Museum_Island_-_Berlin.jpg', licence: 'CC BY-SA 4.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' },
    { label: 'A path through Großer Tiergarten', author: 'Leonhard Lenz', source: 'https://commons.wikimedia.org/wiki/File:Path_in_Gro%C3%9Fer_Tiergarten_Berlin_2024-05-09_01.jpg', licence: 'CC0 1.0', licenceUrl: 'https://creativecommons.org/publicdomain/zero/1.0/' },
    { label: 'Kottbusser Tor beneath the elevated U-Bahn', author: 'GillyBerlin', source: 'https://commons.wikimedia.org/wiki/File:Kottbusser_Tor_in_Berlin_at_night.jpg', licence: 'CC BY 2.0', licenceUrl: 'https://creativecommons.org/licenses/by/2.0/' },
    { label: 'Markthalle Neun interior', author: 'Dirk Ingo Franke', source: 'https://commons.wikimedia.org/wiki/File:Markthalle_Neun_08.02.2015_16-33-23.JPG', licence: 'CC BY-SA 4.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  ];
  return {
    type: 'COLLAPSIBLE_LIST',
    id: prefix,
    nodes: [{
      type: 'COLLAPSIBLE_ITEM',
      id: `${prefix}_item`,
      nodes: [
        {
          type: 'COLLAPSIBLE_ITEM_TITLE',
          id: `${prefix}_title`,
          nodes: [{
            type: 'PARAGRAPH',
            id: `${prefix}_title_p`,
            nodes: [textNode(`${prefix}_title_text`, 'Image credits')],
            paragraphData: { textStyle: { textAlignment: 'AUTO' }, indentation: 0 },
          }],
        },
        {
          type: 'COLLAPSIBLE_ITEM_BODY',
          id: `${prefix}_body`,
          nodes: [
            {
              type: 'PARAGRAPH',
              id: `${prefix}_intro`,
              nodes: [textNode(`${prefix}_intro_text`, 'Source and licence details for the five photographs used in this article.')],
              paragraphData: { textStyle: { textAlignment: 'AUTO', lineHeight: '1.55' }, indentation: 0 },
            },
            ...credits.map((credit, index) => creditParagraph(slug, index + 1, credit)),
          ],
        },
      ],
    }],
    collapsibleListData: {
      containerData: { alignment: 'CENTER', textWrap: true },
      expandOnlyOne: false,
      initialExpandedItems: 'NONE',
      direction: 'LTR',
    },
  };
}

function replaceSoloCreditsPlaceholder(richContent) {
  const index = richContent.nodes.findIndex((node) => node.id === 'paragraph_114');
  assert(index >= 0, 'Solo article credits placeholder paragraph is missing');
  const placeholder = richContent.nodes[index];
  assert(findNode(placeholder, 'text_115')?.textData?.text === '{{article-image-credits}}', 'Solo credits placeholder drift');
  richContent.nodes.splice(index, 1, soloCreditsNode());
}

function setSeoTag(seoData, key, value) {
  let count = 0;
  for (const tag of seoData?.tags || []) {
    const tagKey = tag.type === 'title' ? 'title' : tag.props?.name || tag.props?.property || '';
    if (tagKey !== key) continue;
    if (tag.type === 'title') tag.children = value;
    else tag.props.content = value;
    count += 1;
  }
  assert(count === 1, `Expected one SEO tag ${key}, found ${count}`);
}

function updateScriptTag(seoData, schemaType, updater) {
  let count = 0;
  for (const tag of seoData?.tags || []) {
    if (tag.type !== 'script' || typeof tag.children !== 'string') continue;
    let schema;
    try { schema = JSON.parse(tag.children); } catch { continue; }
    if (schema?.['@type'] !== schemaType) continue;
    updater(schema);
    tag.children = JSON.stringify(schema);
    count += 1;
  }
  assert(count === 1, `Expected one ${schemaType} schema tag, found ${count}`);
}

function faqMainEntity(config) {
  return config.items.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  }));
}

function syncFaqSchema(post, faqData) {
  const config = faqData[post.seoSlug];
  assert(config?.items?.length, `Missing FAQ config for ${post.seoSlug}`);
  updateScriptTag(post.seoData, 'FAQPage', (schema) => { schema.mainEntity = faqMainEntity(config); });
}

function applySeoProfile(post, target, faqData) {
  if (!target.seoProfile) return;
  if (target.seoProfile === 'solo') {
    const description = 'Travelling alone in Berlin? Choose the historic centre, Tiergarten or Kreuzberg, then build a day with one proper stop and a flexible finish.';
    const socialDescription = 'Choose the historic centre, Tiergarten or Kreuzberg, then build one proper stop and a flexible finish.';
    const socialTitle = 'Travelling Alone in Berlin: Pick the Right Area';
    const alt = 'Alexanderplatz at night with a moving tram, a clear meeting point when you are travelling alone in Berlin';
    setSeoTag(post.seoData, 'title', 'Travelling Alone in Berlin: Pick the Right Area | BerlinWalk');
    setSeoTag(post.seoData, 'description', description);
    setSeoTag(post.seoData, 'og:title', socialTitle);
    setSeoTag(post.seoData, 'og:description', socialDescription);
    setSeoTag(post.seoData, 'og:image:alt', alt);
    setSeoTag(post.seoData, 'twitter:title', socialTitle);
    setSeoTag(post.seoData, 'twitter:description', socialDescription);
    setSeoTag(post.seoData, 'twitter:image:alt', alt);
    updateScriptTag(post.seoData, 'BlogPosting', (schema) => {
      schema.headline = target.nextTitle;
      schema.description = description;
    });
    syncFaqSchema(post, faqData);
  } else if (target.seoProfile === 'couples') {
    const description = 'Build a Berlin itinerary for couples with different interests by choosing one must-do each, one shared pause and two compact half-days.';
    const socialDescription = 'A practical Berlin day for two people who want different things: one fixed booking, one shared pause and a clear place for each priority.';
    setSeoTag(post.seoData, 'description', description);
    setSeoTag(post.seoData, 'og:description', socialDescription);
    setSeoTag(post.seoData, 'twitter:description', socialDescription);
    updateScriptTag(post.seoData, 'BlogPosting', (schema) => { schema.description = description; });
    syncFaqSchema(post, faqData);
  } else if (target.seoProfile === 'private') {
    const description = "Planning a private Berlin tour for groups? Compare the fixed public walk with a central route whose pace and emphasis can be confirmed around your group.";
    const socialDescription = "Compare the fixed public walk with a private historic-centre route shaped around your group's pace and priorities.";
    setSeoTag(post.seoData, 'description', description);
    setSeoTag(post.seoData, 'og:description', socialDescription);
    setSeoTag(post.seoData, 'twitter:description', socialDescription);
    updateScriptTag(post.seoData, 'BlogPosting', (schema) => { schema.description = description; });
    syncFaqSchema(post, faqData);
  } else if (target.seoProfile === 'faq-only') {
    syncFaqSchema(post, faqData);
  } else {
    throw new Error(`Unknown SEO profile: ${target.seoProfile}`);
  }
}

function richText(richContent) {
  const parts = [];
  walk(richContent, (item) => {
    if (item.type === 'TEXT' && typeof item.textData?.text === 'string') parts.push(item.textData.text);
  });
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

function richSummary(richContent) {
  const summary = { headings: 0, h1: 0, images: 0, missingAlt: 0, html: 0, spoilers: 0, credits: 0 };
  walk(richContent, (item) => {
    if (item.type === 'HEADING') {
      summary.headings += 1;
      if (Number(item.headingData?.level) === 1) summary.h1 += 1;
    }
    if (item.type === 'IMAGE') {
      summary.images += 1;
      if (!String(item.imageData?.altText || '').trim()) summary.missingAlt += 1;
    }
    if (item.type === 'HTML') {
      summary.html += 1;
      if (Object.prototype.hasOwnProperty.call(item.htmlData?.containerData || {}, 'spoiler')) summary.spoilers += 1;
    }
    if (item.type === 'COLLAPSIBLE_LIST' && item.collapsibleListData?.initialExpandedItems === 'NONE') summary.credits += 1;
  });
  return summary;
}

function transformDraft(draft, target, faqData) {
  const post = clone(draft);
  const counts = { replacements: 0, spoilersRemoved: 0 };
  for (const edit of target.replacements || []) counts.replacements += applyReplacement(post.richContent, edit);
  applyTextEdits(post.richContent, target.textEdits);
  applyImageAltEdits(post.richContent, target.imageAltEdits);
  applyHtmlEdits(post.richContent, target.htmlEdits);
  applyUrlEdits(post.richContent, target.urlEdits);
  if (target.addSoloCredits) replaceSoloCreditsPlaceholder(post.richContent);
  counts.spoilersRemoved = stripUnsupportedSpoilers(post.richContent);
  if (target.nextTitle) post.title = target.nextTitle;
  if (target.nextExcerpt) post.excerpt = target.nextExcerpt;
  applySeoProfile(post, target, faqData);
  return { post, counts };
}

function verifyIdentity(draft, published, target, { expectBefore = false, expectedPost = null } = {}) {
  assert(draft.id === target.id, `${target.slug}: draft ID mismatch`);
  assert(published.id === target.id, `${target.slug}: published ID mismatch`);
  assert(draft.seoSlug === target.slug, `${target.slug}: draft seoSlug mismatch`);
  assert(published.slug === target.slug, `${target.slug}: published slug mismatch`);
  const expectedTitle = expectBefore ? target.title : (target.nextTitle || target.title);
  assert(draft.title === expectedTitle, `${target.slug}: draft title mismatch`);
  assert(published.title === expectedTitle, `${target.slug}: published title mismatch`);
  assert(draft.status === 'PUBLISHED', `${target.slug}: draft status is ${draft.status}`);
  assert(draft.hasUnpublishedChanges === false, `${target.slug}: draft already has unpublished changes`);
  assert(sha256(draft.richContent) === sha256(published.richContent), `${target.slug}: draft/published richContent mismatch`);
  if (expectBefore) {
    assert(sha256(draft.richContent) === target.beforeHash, `${target.slug}: before hash drift (${sha256(draft.richContent)})`);
  }
  if (expectedPost) {
    assert(sha256(draft.richContent) === sha256(expectedPost.richContent), `${target.slug}: final richContent mismatch`);
    assert(JSON.stringify(draft.seoData) === JSON.stringify(expectedPost.seoData), `${target.slug}: final seoData mismatch`);
    assert(draft.excerpt === expectedPost.excerpt, `${target.slug}: final excerpt mismatch`);
  }
}

function verifyStaged(draft, target, expectedPost) {
  assert(draft.id === target.id && draft.seoSlug === target.slug, `${target.slug}: staged identity mismatch`);
  assert(draft.hasUnpublishedChanges === true, `${target.slug}: PATCH did not create unpublished changes`);
  assert(sha256(draft.richContent) === sha256(expectedPost.richContent), `${target.slug}: staged richContent mismatch`);
  assert(JSON.stringify(draft.seoData) === JSON.stringify(expectedPost.seoData), `${target.slug}: staged seoData mismatch`);
  assert(draft.title === expectedPost.title && draft.excerpt === expectedPost.excerpt, `${target.slug}: staged title/excerpt mismatch`);
}

function validateTransformed(post, target) {
  const text = richText(post.richContent);
  const summary = richSummary(post.richContent);
  assert(summary.h1 === 0, `${target.slug}: body H1 introduced`);
  assert(summary.images > 0 && summary.missingAlt === 0, `${target.slug}: missing article image alt text`);
  assert(summary.html === 3, `${target.slug}: expected 3 HTML embeds, found ${summary.html}`);
  assert(summary.spoilers === 0, `${target.slug}: unsupported spoiler data remains`);
  assert(!text.includes('{{article-image-credits}}'), `${target.slug}: unresolved article credit placeholder`);
  assert(!/I have made that mistake before/i.test(text), `${target.slug}: repetitive anecdote phrase remains`);
  assert(!/The point is not/i.test(text), `${target.slug}: repetitive antithesis phrase remains`);
  assert(!/—/.test(text), `${target.slug}: em dash remains`);
  assert(!/\b1h\s*45m\b|1\s*h(?:our)?\s*45\s*m/i.test(text), `${target.slug}: invalid tour duration remains`);
  if (['travelling-alone-in-berlin-day-plan', 'private-berlin-tour-for-groups', 'berlin-itinerary-for-couples'].includes(target.slug)) {
    assert(!/\b(?:anchor|hinge)\b/i.test(text), `${target.slug}: abstract anchor/hinge language remains`);
  }
  if (target.slug === 'private-berlin-tour-for-groups') {
    assert(!/eleven stops|sixteen places|Pergamon/i.test(text), `${target.slug}: stale route or museum claim remains`);
  }
  if (target.slug === 'travelling-alone-in-berlin-day-plan') {
    assert(summary.credits === 1, `${target.slug}: native closed image credits missing`);
  }
  if (target.slug === 'best-museums-in-berlin-first-time-visitors') {
    assert(text.includes('4 June 2027'), `${target.slug}: official Pergamon reopening date missing`);
  }
  assert(sha256(post.richContent) !== target.beforeHash, `${target.slug}: transformation produced no richContent change`);
  return { ...summary, textLength: text.length, afterHash: sha256(post.richContent) };
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function pollFinal(target, expectedPost, attempts = 12) {
  const observations = [];
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const pair = await readPair(target);
      let error = '';
      try { verifyIdentity(pair.draft, pair.published, target, { expectedPost }); } catch (caught) { error = caught.message; }
      observations.push({ attempt, at: new Date().toISOString(), draftStatus: pair.draft.status, hasUnpublishedChanges: pair.draft.hasUnpublishedChanges, draftHash: sha256(pair.draft.richContent), publishedHash: sha256(pair.published.richContent), error });
      if (!error) return { pair, observations };
    } catch (error) {
      observations.push({ attempt, at: new Date().toISOString(), error: String(error?.message || error) });
    }
    if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 2_000));
  }
  throw Object.assign(new Error(`${target.slug}: publish readback did not converge`), { observations });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const faqData = JSON.parse(await fs.readFile(path.join(REPO_ROOT, 'faq', 'data.json'), 'utf8'));
  await fs.mkdir(args.outDir, { recursive: true });

  const plans = [];
  for (const target of TARGETS) {
    const pair = await readPair(target);
    verifyIdentity(pair.draft, pair.published, target, { expectBefore: true });
    const transformed = transformDraft(pair.draft, target, faqData);
    const validation = validateTransformed(transformed.post, target);
    await writeJson(path.join(args.outDir, 'preflight', `${target.slug}.draft.json`), pair.draft);
    await writeJson(path.join(args.outDir, 'preflight', `${target.slug}.published.json`), pair.published);
    plans.push({ target, before: pair.draft, after: transformed.post, counts: transformed.counts, validation });
  }

  const planReport = {
    schemaVersion: 'berlinwalk-last20-quality-repair-1.0',
    generatedAt: new Date().toISOString(),
    mode: args.apply ? (args.publish ? 'APPLY_PUBLISH' : 'APPLY_DRAFT_ONLY') : 'DRY_RUN',
    siteId: SITE_ID,
    releaseVersion: RELEASE_VERSION,
    targetCount: plans.length,
    targets: plans.map(({ target, before, after, counts, validation }) => ({
      id: target.id,
      slug: target.slug,
      beforeTitle: before.title,
      afterTitle: after.title,
      beforeExcerpt: before.excerpt,
      afterExcerpt: after.excerpt,
      beforeHash: target.beforeHash,
      afterHash: validation.afterHash,
      counts,
      validation,
    })),
  };
  await writeJson(path.join(args.outDir, 'repair-plan.json'), planReport);

  if (!args.apply) {
    console.log(JSON.stringify(planReport, null, 2));
    return;
  }

  const results = [];
  for (const plan of plans) {
    const { target, after } = plan;
    const fresh = await readPair(target);
    verifyIdentity(fresh.draft, fresh.published, target, { expectBefore: true });
    await writeJson(path.join(args.outDir, 'rollback', `${target.slug}.draft.json`), fresh.draft);
    await writeJson(path.join(args.outDir, 'rollback', `${target.slug}.published.json`), fresh.published);

    const patchBody = {
      draftPost: {
        id: target.id,
        title: after.title,
        excerpt: after.excerpt,
        seoData: after.seoData,
        richContent: after.richContent,
      },
      fieldsets: ['RICH_CONTENT'],
    };
    const patchResult = await requestJson(`/blog/v3/draft-posts/${encodeURIComponent(target.id)}`, { method: 'PATCH', body: patchBody });
    const stagedPair = await readPair(target);
    verifyStaged(stagedPair.draft, target, after);
    await writeJson(path.join(args.outDir, 'staged', `${target.slug}.draft.json`), stagedPair.draft);

    if (!args.publish) {
      results.push({ slug: target.slug, patchHttp: patchResult.status, status: 'STAGED_UNPUBLISHED', afterHash: sha256(after.richContent) });
      continue;
    }

    const reservationPath = path.join(args.outDir, 'publish-journals', `${target.slug}.json`);
    await fs.mkdir(path.dirname(reservationPath), { recursive: true });
    const reservation = {
      schemaVersion: 1,
      targetId: target.id,
      slug: target.slug,
      publishPath: `/blog/v3/draft-posts/${encodeURIComponent(target.id)}/publish`,
      maxPostAttempts: 1,
      postAttemptCount: 1,
      reservedAt: new Date().toISOString(),
      afterHash: sha256(after.richContent),
      status: 'POST_DISPATCH_RESERVED',
    };
    await fs.writeFile(reservationPath, `${JSON.stringify(reservation, null, 2)}\n`, { flag: 'wx' });
    const publishResult = await publishOnce(reservation.publishPath);
    await writeJson(path.join(args.outDir, 'publish-responses', `${target.slug}.json`), publishResult);
    const final = await pollFinal(target, after);
    reservation.status = 'VERIFIED_PUBLISHED';
    reservation.verifiedAt = new Date().toISOString();
    reservation.publishTransport = publishResult.transport;
    reservation.publishHttp = publishResult.status;
    reservation.readback = final.observations;
    await writeJson(reservationPath, reservation);
    await writeJson(path.join(args.outDir, 'final', `${target.slug}.draft.json`), final.pair.draft);
    await writeJson(path.join(args.outDir, 'final', `${target.slug}.published.json`), final.pair.published);
    results.push({ slug: target.slug, patchHttp: patchResult.status, publishHttp: publishResult.status, publishTransport: publishResult.transport, status: 'VERIFIED_PUBLISHED', afterHash: sha256(after.richContent), lastPublishedDate: final.pair.published.lastPublishedDate });
  }

  const receipt = {
    schemaVersion: 'berlinwalk-last20-quality-repair-receipt-1.0',
    completedAt: new Date().toISOString(),
    siteId: SITE_ID,
    targetCount: results.length,
    results,
  };
  await writeJson(path.join(args.outDir, 'repair-receipt.json'), receipt);
  console.log(JSON.stringify(receipt, null, 2));
}

main().catch((error) => {
  console.error(error?.stack || String(error));
  if (error?.observations) console.error(JSON.stringify(error.observations, null, 2));
  process.exitCode = 1;
});
