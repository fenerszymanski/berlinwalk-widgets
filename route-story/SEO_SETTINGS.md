# Wix `/berlin-walking-tour-route` SEO Settings

Use these values in **Wix Studio -> Berlin Walking Tour Route page -> SEO / Page Info / Advanced SEO**.

## Basic SEO

**URL slug**

```text
berlin-walking-tour-route
```

**SEO title**

```text
Berlin Walking Tour Route: 12 Stops Explained | BerlinWalk
```

**Meta description**

```text
Explore the 12-stop BerlinWalk route from Alexanderplatz to Hackescher Markt, built around what you understand at each stop on the free tip-based walking tour.
```

**Indexing**

```text
Let search engines index this page
```

**Canonical URL**

```text
https://www.berlinwalk.com/berlin-walking-tour-route
```

## Social Share

**Social title / OG title**

```text
Berlin Walking Tour Route: 12 Stops Explained
```

**Social description / OG description**

```text
A story map of the BerlinWalk route from the World Clock at Alexanderplatz to Hackescher Markt.
```

**Social image**

```text
https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/06-1600w.jpg
```

## Additional Meta Tags

Add these only if Wix lets you add custom meta tags on the page. Skip duplicates if Wix already creates them from the fields above.

```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://www.berlinwalk.com/berlin-walking-tour-route" />
<meta property="og:title" content="Berlin Walking Tour Route: 12 Stops Explained" />
<meta property="og:description" content="A story map of the BerlinWalk route from the World Clock at Alexanderplatz to Hackescher Markt." />
<meta property="og:image" content="https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/06-1600w.jpg" />
<meta property="og:site_name" content="BerlinWalk" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Berlin Walking Tour Route: 12 Stops Explained" />
<meta name="twitter:description" content="A story map of the BerlinWalk route from the World Clock at Alexanderplatz to Hackescher Markt." />
<meta name="twitter:image" content="https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/06-1600w.jpg" />
<link rel="canonical" href="https://www.berlinwalk.com/berlin-walking-tour-route" />
```

## Structured Data

Paste as one JSON-LD structured data entry in Wix Advanced SEO.

```json
{"@context":"https://schema.org","@type":"TouristTrip","name":"Berlin Walking Tour Route by BerlinWalk","description":"A free, tip-based 2-hour Berlin walking tour from the World Clock at Alexanderplatz to Hackescher Markt, explained as a 12-stop story map.","url":"https://www.berlinwalk.com/berlin-walking-tour-route","image":"https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/06-1600w.jpg","inLanguage":"en","touristType":"first-time visitors, history lovers, solo travellers","provider":{"@type":"TravelAgency","name":"BerlinWalk","url":"https://www.berlinwalk.com/"},"offers":{"@type":"Offer","price":"0","priceCurrency":"EUR","availability":"https://schema.org/InStock","url":"https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based","description":"Free to book, tip-based at the end."},"itinerary":{"@type":"ItemList","numberOfItems":12,"itemListElement":[{"@type":"ListItem","position":1,"name":"World Clock, Alexanderplatz","description":"The meeting point and first orientation layer of the BerlinWalk route."},{"@type":"ListItem","position":2,"name":"TV Tower","description":"East Berlin's skyline statement and the Pope's Revenge story."},{"@type":"ListItem","position":3,"name":"Rotes Rathaus","description":"Berlin's civic timeline through empire, division, and reunification."},{"@type":"ListItem","position":4,"name":"Neptune Fountain","description":"Imperial symbolism in a public square."},{"@type":"ListItem","position":5,"name":"St. Mary's Church","description":"Medieval Berlin hiding in plain sight."},{"@type":"ListItem","position":6,"name":"Marx-Engels Forum","description":"GDR memory, erased streets, and the meaning of open space."},{"@type":"ListItem","position":7,"name":"Humboldt Forum","description":"The rebuilt palace and Berlin's reconstruction debates."},{"@type":"ListItem","position":8,"name":"Lustgarten","description":"A public space that moved from royal garden to parade ground to city lawn."},{"@type":"ListItem","position":9,"name":"Berliner Dom","description":"Prussian ambition, dynastic memory, and visible scars."},{"@type":"ListItem","position":10,"name":"Altes Museum","description":"Berlin's first public museum and the civic idea behind Museum Island."},{"@type":"ListItem","position":11,"name":"Neues Museum and Alte Nationalgalerie","description":"Restoration, UNESCO Museum Island, Nefertiti, and visible repair."},{"@type":"ListItem","position":12,"name":"Hackescher Markt","description":"The tour endpoint and the natural next chapter after the walk."}]}}
```

## Wix Custom Element

```html
<bw-route-story></bw-route-story>
<script src="https://fenerszymanski.github.io/berlinwalk-widgets/route-story/route-story-element.js"></script>
```
