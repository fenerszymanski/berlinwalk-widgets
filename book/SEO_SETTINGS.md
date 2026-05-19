# `/book-berlin-walking-tour/berlin-free-walking-tour-tip-based` — Wix Studio SEO Settings

Paste these into the Wix Bookings service page's SEO panel
(Wix Studio → Pages → Bookings Service Page → SEO).

The service page is dynamic. The slug below targets only the
`berlin-free-walking-tour-tip-based` service, not the global Bookings template.

## Basics

### Page Title

```text
Book Your Free Berlin Walking Tour · BerlinWalk
```

### Meta Description

```text
Reserve a spot on a free, tip-based Berlin walking tour. Meet at the World Clock on Alexanderplatz and walk Berlin's historic centre with a local guide.
```

### OG image

```text
https://static.wixstatic.com/media/5a08a3_ac78d5df37b2486ab6662cf3872ea9a6~mv2.jpg/v1/fill/w_1200,h_1200,al_t,q_85/file.jpg
```

## Advanced SEO - Additional Tags

```html
<link rel="canonical" href="https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based" />
<meta property="og:type" content="website" />
<meta property="og:title" content="Book Your Free Berlin Walking Tour" />
<meta property="og:description" content="Reserve a spot on a free, tip-based Berlin walking tour. Meet at the World Clock on Alexanderplatz and walk Berlin's historic centre with a local guide." />
<meta property="og:url" content="https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based" />
<meta property="og:image" content="https://static.wixstatic.com/media/5a08a3_ac78d5df37b2486ab6662cf3872ea9a6~mv2.jpg/v1/fill/w_1200,h_1200,al_t,q_85/file.jpg" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Book Your Free Berlin Walking Tour" />
<meta name="twitter:description" content="Reserve a spot on a free, tip-based Berlin walking tour. Meet at the World Clock on Alexanderplatz and walk Berlin's historic centre with a local guide." />
<meta name="twitter:image" content="https://static.wixstatic.com/media/5a08a3_ac78d5df37b2486ab6662cf3872ea9a6~mv2.jpg/v1/fill/w_1200,h_1200,al_t,q_85/file.jpg" />
```

## Advanced SEO - Structured Data

```json
{"@context":"https://schema.org","@type":"TouristTrip","name":"Berlin Free Walking Tour (Tip Based)","description":"A free, tip-based 2-hour walking tour of Berlin's historic centre — Alexanderplatz, medieval Berlin, Nikolaiviertel, Museum Island, and the hidden corners around Hackescher Markt.","url":"https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based","image":"https://static.wixstatic.com/media/5a08a3_ac78d5df37b2486ab6662cf3872ea9a6~mv2.jpg/v1/fill/w_1200,h_1200,al_t,q_85/file.jpg","inLanguage":"en","touristType":"first-time visitors, history lovers, solo travellers","provider":{"@type":"TravelAgency","name":"BerlinWalk","url":"https://www.berlinwalk.com/"},"itinerary":{"@type":"ItemList","itemListElement":[{"@type":"ListItem","position":1,"name":"Alexanderplatz"},{"@type":"ListItem","position":2,"name":"Marienkirche & medieval Berlin"},{"@type":"ListItem","position":3,"name":"Nikolaiviertel"},{"@type":"ListItem","position":4,"name":"Museum Island"},{"@type":"ListItem","position":5,"name":"Hackescher Markt"}]},"offers":{"@type":"Offer","price":"0","priceCurrency":"EUR","availability":"https://schema.org/InStock","url":"https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based","description":"Free to book, tip-based at the end."}}
```

## Page placement notes (Wix Studio)

The booking page is rebuilt as two custom elements with the Wix Bookings
widget sandwiched between them. Section order top to bottom:

1. `<bw-book-hero>` Custom Element — hero, tour key facts, "At a glance" card, primary "Pick your date ↓" CTA which anchors to `#book`.
2. Wix Bookings service widget (date picker · time slots · checkout) — Wix-native. Leave it in its existing position from the legacy page.
3. `<bw-book-details>` Custom Element — what you get, route preview, meeting point teaser, free/tip-based explainer, FAQ, ending CTA back to top.

The `#book` anchor sits at the bottom edge of `<bw-book-hero>`, so the
"Pick your date ↓" CTA scrolls directly to the booking widget.
