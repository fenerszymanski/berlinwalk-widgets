// Design 2 UI dictionary, shared by the renderer and its coverage test.
export const DESIGN2_TEXT = Object.freeze({
  "Berlin T-shirts": "Berlin T-Shirts",
 "Free":"Kostenlos",
 "In English":"Auf Englisch",
 "All in English":"Alle auf Englisch",
 "My audio walks, guides and virtual tours are available in English.":"Meine Audiotouren, Guides und virtuellen Touren gibt es auf Englisch.",
  "No physical product is shipped. Your code and a printable card arrive by email, normally within the hour and no later than 24 hours after payment. You retain the 14-day consumer withdrawal right while the code is unused.": "Es wird kein physischer Artikel versendet. Dein Code und eine druckbare Karte kommen per E-Mail, normalerweise innerhalb einer Stunde und spätestens 24 Stunden nach der Zahlung. Solange der Code unbenutzt ist, bleibt dein 14-tägiges Verbraucher-Widerrufsrecht bestehen.",
  "Find your Berlin.": "Finde dein Berlin.",
  "Shop the prints": "Poster entdecken",
  "Looking for a Christmas gift? Start here.": "Suchst du ein Weihnachtsgeschenk? Fang hier an.",
  "Search posters, districts…": "Poster, Bezirke und Motive suchen…",
  "All products": "Alle Produkte",
  "Search posters…": "Poster suchen…",
  "My picks": "Meine Auswahl",
  "Similar designs": "Ähnliche Motive",
  "Made to hang together": "Passt gut zusammen",
  "Styling example · Frames not included": "Stylingbeispiel · Rahmen nicht enthalten",
  "Printed poster": "Gedrucktes Poster",
  "Digital file": "Digitale Datei",
  "Printed / Digital": "Gedruckt / Digital",
  "Browse categories": "Kategorien entdecken",
  "Search the store": "Im Shop suchen",
  "Close search": "Suche schließen",
  "Search": "Suchen",
  "Store home": "Shop-Startseite",
  "Cart": "Warenkorb",
  "Store categories": "Shop-Kategorien",
  "Search results": "Suchergebnisse",
  "No results found.": "Keine Ergebnisse gefunden.",
  "Try one of these categories.": "Entdecke eine dieser Kategorien.",
  "All": "Alle",
  "Printed": "Gedruckt",
  "Digital": "Digital",
  "Format": "Format",
  "Collections": "Kollektionen",
  "Everyday": "Berliner Alltag",
  "Landmarks": "Wahrzeichen",
  "Berlin Stories": "Berliner Geschichten",
  "Districts": "Bezirke",
  "Find your street": "Finde deine Straße",
  "Make your calendar": "Gestalte deinen Kalender",
  "Personal Berlin gifts": "Persönliche Berlin-Geschenke",
  "Explore Berlin": "Berlin entdecken",
  "Posters": "Poster",
  "Gifts": "Geschenke",
  "All posters": "Alle Poster",
  "Sets": "Sets",
  "Print at home": "Zum Selbstdrucken",
  "Your street in 1928": "Deine Straße 1928",
  "Dein Berlin 2027 · personalised calendar": "Dein Berlin 2027 · persönlicher Kalender",
  "Dein Berlin 2027": "Dein Berlin 2027",
  "Berlin 2027 wall calendar": "Berlin Wandkalender 2027",
  "Personal newspapers": "Persönliche Zeitungen",
  "1928 gift voucher": "1928-Gutschein",
  "Audio walks": "Audiotouren",
  "Trip Planner": "Reiseplaner",
  "Guides & photo missions": "Guides & Foto-Missionen",
  "Virtual tours & Night In": "Virtuelle Touren & Night In",
  "View all": "Alle ansehen",
  "View design": "Motiv ansehen",
  "Available products": "Verfügbare Produkte",
  "Show all products": "Alle Produkte anzeigen",
  "Search for a Berlin place or theme.": "Suche nach einem Berliner Ort oder Motiv.",
  "Free delivery to Germany, the EU, the UK and the US. Usually 3 to 5 working days in Germany, 4 to 9 elsewhere. Frame not included.": "Kostenloser Versand nach Deutschland, in die EU, nach Großbritannien und in die USA. In Deutschland meist 3 bis 5 Werktage, sonst 4 bis 9. Rahmen nicht enthalten.",
  "Two Berlin prints in oak frames above a cabinet.": "Zwei Berlin-Poster in Eichenrahmen über einer Kommode.",
  "Size": "Größe",
  "Paper": "Papier",
  "Add to cart": "In den Warenkorb",
  "Berlin address": "Berliner Adresse",
  "1928 digital file": "1928 als digitale Datei",
  "Gift a digital file": "Digitale Datei verschenken",
  "Explore all audio walks & guides": "Alle Audiotouren und Guides entdecken",
  "All audio walks": "Alle Audiotouren",
  "All guides": "Alle Guides",
  "All gifts": "Alle Geschenke",
  "All Everyday posters": "Alle Poster zum Berliner Alltag",
  "All Landmarks posters": "Alle Wahrzeichen-Poster",
  "All Berlin Stories posters": "Alle Poster mit Berliner Geschichten",
  "All Districts posters": "Alle Bezirks-Poster",
  "All poster sets": "Alle Poster-Sets"
});
// German layer for the 1928 page (30 Oct 2026, press launch). Loaded with ?lang=de (a /de/ page gets it too). It rewrites visible text inside the
// storefront's shadow root and never touches cart, price or order logic, so a miss simply leaves that string in English.
// Legal notices stay in their reviewed English wording; only their heading says so.
// Wix's German pages live under /de/ (only while German is visible); the path checks below read the page path without it.
const pagePath = () => decodeURIComponent(location.pathname).replace(/^\/de(?=\/|$)/, '');
const PRODUCT_PATH = '/product-page/your-berlin-street-in-1928-personalised-aerial-print-30-x-40-cm';
const TEXT = new Map(Object.entries({
  "Color": "Farbe",
  "Natural": "Natur",
  "Black": "Schwarz",
  "CLASSIC UNISEX T-SHIRT · FRONT PRINT": "CLASSIC UNISEX-T-SHIRT · FRONTDRUCK",
  "PREMIUM UNISEX T-SHIRT · FRONT PRINT": "PREMIUM UNISEX-T-SHIRT · FRONTDRUCK",
  "Black Friday prices cannot be combined with a code. Remove the code from your cart, then check delivery again.": "Black-Friday-Preise sind nicht mit einem Code kombinierbar. Entferne den Code aus deinem Warenkorb und prüfe den Versand erneut.",
  "Your Berlin places": "Deine Berliner Orte",
  "Made to order · see each product for delivery destinations": "Auf Bestellung gefertigt · Versandziele stehen beim jeweiligen Produkt",
  "Dein Berlin 2027": "Dein Berlin 2027",
  "A wall calendar of your Berlin places, from above in 1928 and today.": "Ein Wandkalender mit deinen Berliner Orten, von oben 1928 und heute.",
  "Add one to twelve places. Months without a place of yours show a well-known Berlin place I picked.": "Füge einen bis zwölf Orte hinzu. Monate ohne eigenen Ort zeigen einen bekannten Berliner Ort, den ich ausgesucht habe.",
  "A3 portrait, 29.7 x 42 cm, 250 g silk paper, wire bound at the top with a hook. Cover, then January to December 2027.": "A3 Hochformat, 29,7 x 42 cm, 250 g seidenmatt gestrichenes Papier, oben Drahtbindung mit Aufhänger. Deckblatt, dann Januar bis Dezember 2027.",
  "With the Berlin public holidays.": "Mit den Berliner Feiertagen.",
  "Your house number is never printed.": "Deine Hausnummer wird nie gedruckt.",
  "Free delivery to Germany, the EU and the UK. Germany 5 to 8 working days, most of the EU and the UK 6 to 12. Exact days at checkout.": "Kostenloser Versand nach Deutschland, in die EU und nach Großbritannien. Deutschland 5 bis 8 Werktage, der Großteil der EU und UK 6 bis 12. Die genauen Tage siehst du an der Kasse.",
  "For Christmas: order by 10 December (Germany) or 4 December (EU, UK).": "Für Weihnachten: bis 10. Dezember (Deutschland) oder 4. Dezember (EU, UK) bestellen.",
  "Calendar language": "Sprache im Kalender",
  "Preview": "Vorschau",
  "PERSONALISED WALL CALENDAR · A3 · 2027": "PERSONALISIERTER WANDKALENDER · A3 · 2027",
  "Free delivery to Germany, the EU and the UK.": "Kostenloser Versand nach Deutschland, in die EU und nach Großbritannien.",
  "Street, square or building": "Straße, Platz oder Gebäude",
  "Your first place becomes January. Try your street, your old school or the place where you met.": "Dein erster Ort wird der Januar. Probier deine Straße, deine alte Schule oder den Ort, an dem ihr euch kennengelernt habt.",
  "{count} of 12": "{count} von 12",
  "Cover and language": "Deckblatt und Sprache",
  "Your calendar": "Dein Kalender",
  "Change place": "Ort ändern",
  "Search a new place for {month}.": "Suche einen neuen Ort für {month}.",
  "This is an example. Add your first place and it appears here.": "Das ist ein Beispiel. Füge deinen ersten Ort hinzu, dann erscheint er hier.",
  "Previous page": "Vorherige Seite",
  "Next page": "Nächste Seite",
  "My pick": "Meine Auswahl",
  "Your place": "Dein Ort",
  "What you get": "Das bekommst du",
  "Show {month} in the preview": "{month} in der Vorschau zeigen",
  "Your line on the cover": "Deine Zeile auf dem Deckblatt",
  "Find a place in Berlin": "Finde einen Ort in Berlin",
  "Your places": "Deine Orte",
  "Add another place": "Weiteren Ort hinzufügen",
  "Cover": "Deckblatt",
  "Filler place": "Ergänzter Ort",
  "Edit": "Bearbeiten",
  "Move up": "Nach oben",
  "Move down": "Nach unten",
  "The calendar does not count towards the multi-print saving.": "Der Kalender zählt nicht zum Mengenrabatt für Drucke.",
  "The character limit is reached. Shorten a title, area or cover line before adding another place.": "Die Zeichengrenze ist erreicht. Kürze einen Titel, einen Bezirk oder die Deckblattzeile, bevor du einen weiteren Ort hinzufügst.",
  "Twelve places are added. You can edit or reorder them.": "Zwölf Orte sind hinzugefügt. Du kannst sie bearbeiten oder umordnen.",
  "Add at least one place to continue.": "Füge mindestens einen Ort hinzu, um weiterzumachen.",
  "Check the text and character limits.": "Prüfe den Text und die Zeichengrenzen.",
  "There is no 1928 aerial photo for this spot": "Für diesen Ort gibt es kein Luftbild von 1928",
  "1928 aerial photo found": "Luftbild von 1928 gefunden",
  "Checking the aerial photos…": "Die Luftbilder werden geprüft…",
  "The aerial photo could not load. Search for the place again to retry.": "Das Luftbild konnte nicht geladen werden. Suche den Ort erneut, um es noch einmal zu versuchen.",
  "Searching…": "Suche läuft…",
  "Tap your place:": "Tippe auf deinen Ort:",
  "Illustrated preview": "Gezeichnete Vorschau",
  "Preview all twelve months before adding to cart.": "Sieh dir vor dem Kauf alle zwölf Monate an.",
  "Click or tap either photo to move the cross for this place.": "Klicke oder tippe auf eines der Fotos, um das Kreuz für diesen Ort zu verschieben.",
  "Wall calendar 2027": "Wandkalender 2027",
  "{count} of your places": "{count} deiner Orte",
  "German": "Deutsch",
  "English": "Englisch",
  "Calendar details need checking.": "Die Kalenderangaben müssen geprüft werden.",
  "Address search by Photon and OpenStreetMap contributors. Aerial photographs: Geoportal Berlin, dl-de/zero-2.0.": "Adresssuche von Photon und OpenStreetMap-Mitwirkenden. Luftbilder: Geoportal Berlin, dl-de/zero-2.0.",
  'All products': 'Alle Produkte', 'Posters': 'Poster', 'All posters': 'Alle Poster', 'Personalised prints': 'Personalisierte Drucke', 'Personalised': 'Personalisiert',
  '2027 Wall Calendar': 'Wandkalender 2027', '2027 Calendars': 'Kalender 2027', 'All 2027 calendars': 'Alle Kalender 2027', 'Two A3 wall calendars for 2027 · your own places, or one Berlin district a month · made to order': 'Zwei A3-Wandkalender für 2027 · deine eigenen Orte oder ein Berliner Bezirk pro Monat · auf Bestellung gefertigt', 'Audio walks': 'Audio-Spaziergänge', 'Guides': 'Reiseführer', 'Store': 'Shop', 'Cart': 'Warenkorb',
  'Your Berlin Street in 1928': 'Deine Berliner Straße um 1928', '/ Your Berlin Street in 1928': '/ Deine Berliner Straße um 1928',
  "Your home · c. 1928 and today": "Dein Zuhause · um 1928 und heute",
  'PERSONALISED PRINT · 30 × 40 OR 45 × 60 CM': 'PERSONALISIERTER DRUCK · 30 × 40 ODER 45 × 60 CM',
  "The home you live in now, or one you left years ago, seen from above in 1928 and today.": "Gib die Adresse deines Zuhauses ein, heute oder von früher, und sieh es kostenlos von oben, um 1928 und heute. Als Poster bestellen kannst du es, musst du aber nicht.",
  "Find your home in 1928": "Finde dein Zuhause um 1928", 'Search': 'Suchen',
  "Type the address of a home, yours now or one from years ago, then tap it. The preview is free.": "Gib die Adresse eines Zuhauses ein, heute oder von früher, und tippe sie an. Die Vorschau ist kostenlos.",
  'Tap your place to put it on the poster:': 'Tippe auf deinen Ort, um ihn aufs Poster zu setzen:', 'Tap your place…': 'Tippe auf deinen Ort…',
  'Matching places': 'Passende Orte', 'Keep typing (at least 3 letters).': 'Schreib weiter (mindestens 3 Buchstaben).',
  'Nothing found in Berlin. Check the spelling, or try the street name with a house number.': 'In Berlin nichts gefunden. Prüfe die Schreibweise oder versuche es mit Straße und Hausnummer.',
  'The address search did not answer. Try again in a moment.': 'Die Adresssuche antwortet gerade nicht. Versuche es gleich noch einmal.',
  'Tap one of the places under the search box.': 'Tippe auf einen der Orte unter dem Suchfeld.',
  'Same ground, same scale.': 'Gleicher Ausschnitt, gleicher Maßstab.',
  'Add to cart': 'In den Warenkorb', 'Yes, add to cart': 'Ja, in den Warenkorb', 'It is blank': 'Das Bild ist leer',
  'Change size, paper or text': 'Größe, Papier oder Text ändern', 'Change format or text': 'Format oder Text ändern',
  'Quick check before it goes in your cart:': 'Kurzer Check, bevor es in den Warenkorb geht:',
  'can you see the 1928 aerial photo in the top picture? Nothing is ordered yet. If it is blank white, the 1928 survey did not reach that spot (far eastern edge of Berlin).': 'Siehst du das Luftbild von 1928 im oberen Bild? Noch ist nichts bestellt. Ist es weiß, reichte die Befliegung nicht bis zu dieser Stelle (äußerster Ostrand Berlins).',
  'The 1928 survey did not reach that spot, so I cannot print it. Try a place nearby, or tap the photo to move the cross.': 'Die Befliegung von 1928 reichte nicht bis hierher, deshalb kann ich das nicht drucken. Versuche einen Ort in der Nähe oder tippe aufs Foto, um das Kreuz zu verschieben.',
  'Search for your address to continue.': 'Suche deine Adresse, um weiterzumachen.', 'Check the 1928 photo': 'Prüfe das Foto von 1928', 'I can see the 1928 photo': 'Ich sehe das Foto von 1928',
  'Fill in the title and area lines to continue.': 'Fülle Titel und Bezirkszeile aus, um weiterzumachen.', 'Currently unavailable': 'Derzeit nicht verfügbar',
  'Free delivery to Germany, the EU, the UK and the US': 'Kostenloser Versand nach Deutschland, in die EU, nach UK und in die USA',
  'Printed in Europe': 'Gedruckt in Europa', 'Misprinted or damaged? Reprinted free': 'Fehldruck oder beschädigt? Kostenloser Neudruck', 'Secure checkout': 'Sichere Bezahlung',
  'Sent by email within 24 hours': 'Per E-Mail innerhalb von 24 Stunden', 'JPG and PDF, 45 x 60 cm at 300 ppi': 'JPG und PDF, 45 x 60 cm mit 300 ppi', 'Something wrong with the file? I fix it': 'Stimmt etwas mit der Datei nicht? Ich korrigiere es',
  'Not ready yet?': 'Noch nicht so weit?', 'Send this preview to your inbox and come back to it later.': 'Schick dir diese Vorschau per E-Mail und komm später darauf zurück.',
  'Your email': 'Deine E-Mail', 'Send it to me': 'Schick sie mir', 'Send again': 'Noch einmal senden', 'Please enter a valid email address.': 'Bitte gib eine gültige E-Mail-Adresse ein.',
  'Also send me a few emails about my street print, and Walk of Berlin Weekly, the Monday letter about Berlin. I can unsubscribe from any email with one click. Read the': 'Schick mir auch ein paar E-Mails zu meinem Straßen-Druck und Walk of Berlin Weekly, den Montagsbrief über Berlin. Ich kann mich in jeder E-Mail mit einem Klick abmelden. Lies die',
  'Privacy Policy': 'Datenschutzerklärung', 'Leave the box unticked and I send this one email and nothing else.': 'Lässt du das Feld leer, schicke ich nur diese eine E-Mail und sonst nichts.',
  'Sent. Check your inbox in a minute (and the spam folder).': 'Gesendet. Schau gleich in dein Postfach (und in den Spam-Ordner).',
  'Sent. Two emails are on their way: your preview, and one asking you to confirm the extra emails.': 'Gesendet. Zwei E-Mails sind unterwegs: deine Vorschau und eine Bitte, die weiteren E-Mails zu bestätigen.',
  'Sent. You already confirmed my emails, so nothing more to do. Check your inbox in a minute.': 'Gesendet. Du hast meine E-Mails schon bestätigt. Schau gleich in dein Postfach.',
  'I could not send it just now. Please try again in a minute, or write to info@walkofberlin.com.': 'Das hat gerade nicht geklappt. Versuche es gleich noch einmal oder schreibe an info@walkofberlin.com.',
  'Too many tries from here. Please wait a few minutes and try again.': 'Zu viele Versuche. Warte bitte ein paar Minuten.',
  'That did not work. Check the email address and that a spot is picked, then try again.': 'Das hat nicht geklappt. Prüfe die E-Mail-Adresse und ob ein Ort gewählt ist.',
  'Your preview is on its way. I could not start the extra emails just now, so tick the box and send again later if you still want them.': 'Deine Vorschau ist unterwegs. Die weiteren E-Mails konnte ich gerade nicht starten. Wenn du sie willst, sende später noch einmal mit Häkchen.',
  'I could not reopen your saved preview. The link may be older than 30 days, so search your address to start again.': 'Ich konnte deine Vorschau nicht wieder öffnen. Der Link ist vielleicht älter als 30 Tage. Suche deine Adresse einfach neu.',
  'What you get': 'Was du bekommst', 'Printed poster': 'Gedrucktes Poster', 'Digital file': 'Digitale Datei', 'Digital file · JPG + PDF': 'Digitale Datei · JPG + PDF', 'Digital file · JPG + PDF · 45 x 60 cm at 300 ppi': 'Digitale Datei · JPG + PDF · 45 x 60 cm mit 300 ppi',
  'Size and paper': 'Größe und Papier', 'Size': 'Größe', 'Paper': 'Papier', 'Colour': 'Farbe', '1928 & today': '1928 und heute', 'Blue': 'Blau', 'Dark': 'Dunkel', 'Layout': 'Anordnung', 'Then & now': 'Damals und heute', '1928 only': 'Nur 1928', 'Sepia': 'Sepia', 'Black & white': 'Schwarzweiß', 'Cream': 'Creme', 'Blueprint': 'Blaupause', 'Charcoal': 'Anthrazit', 'Text on the print': 'Text auf dem Druck', 'Title on the print': 'Titel auf dem Druck', 'Area line': 'Bezirkszeile', 'Your line on the print (optional)': 'Deine Zeile auf dem Druck (optional)', 'Your words on the print (optional)': 'Deine Worte auf dem Druck (optional)', 'Your words': 'Deine Worte', 'The house number is never printed.': 'Die Hausnummer wird nie gedruckt.',
  'Your digital file': 'Deine digitale Datei', 'Prints cleanly at 30 x 40 cm too. Nothing is shipped, so it works anywhere.': 'Lässt sich auch sauber in 30 x 40 cm drucken. Es wird nichts verschickt, das funktioniert also überall.',
  'No address? Give a voucher.': 'Keine Adresse? Verschenke einen Gutschein.', 'Poster gift': 'Poster-Gutschein', 'Digital gift': 'Datei-Gutschein', 'Add gift to cart': 'Gutschein in den Warenkorb', 'Added. Opening your cart…': 'Hinzugefügt. Warenkorb wird geöffnet…', 'Choose a gift': 'Wähle einen Gutschein',
  'A bigger size or another paper: the recipient pays only the difference at checkout. Code and printable card by email, normally within the hour and no later than 24 hours. Valid until 31 December of the third year after purchase.': 'Größeres Format oder anderes Papier: Die beschenkte Person zahlt nur die Differenz. Code und druckbare Karte kommen per E-Mail, meist innerhalb einer Stunde, spätestens nach 24 Stunden. Gültig bis zum 31. Dezember des dritten Jahres nach dem Kauf.',
  'Secure card checkout': 'Sichere Kartenzahlung', '+ more cards': '+ weitere Karten',
  'Arrives in 3 to 5 working days in Germany, 4 to 9 elsewhere. Frame not included.': 'Kommt in Deutschland in 3 bis 5 Werktagen, anderswo in 4 bis 9. Ohne Rahmen.',
  'Free delivery to Germany, the EU, the UK and the US. Usually 3 to 5 working days in Germany, 4 to 9 elsewhere. Frame not included.': 'Kostenloser Versand nach Deutschland, in die EU, nach UK und in die USA. Meist 3 bis 5 Werktage in Deutschland, anderswo 4 bis 9. Ohne Rahmen.',
  'Made for you, so no returns for a change of mind. Faulty prints replaced free.': 'Für dich angefertigt, daher kein Widerruf. Fehlerhafte Drucke werden kostenlos ersetzt.',
  'Digital file: you keep the 14-day withdrawal right.': 'Digitale Datei: Du behältst das 14-tägige Widerrufsrecht.', 'Terms': 'Bedingungen',
  "Made by me, Yusuf, from Berlin's own aerial photos.": 'Von mir, Yusuf, aus Berlins eigenen Luftbildern gemacht.', 'What my guests say': 'Was meine Gäste sagen',
  'The story behind this print': 'Die Geschichte dahinter', 'About this digital file': 'Über diese digitale Datei',
  "Type the address of your home, now or from years ago, and see it from above in 1928, the way a survey plane photographed it, with the same spot today below it. Most Berlin Altbau blocks were already standing, so you can often find your own courtyard. If your house is newer, you see what stood there before it.": "Gib die Adresse deines Zuhauses ein, heute oder von früher, und sieh es um 1928 von oben, so wie es ein Vermessungsflugzeug fotografiert hat, und darunter dieselbe Stelle heute. Die meisten Berliner Altbauten standen schon, oft findest du sogar deinen eigenen Hinterhof. Ist dein Haus jünger, siehst du, was vorher dort stand.",
  "The print carries your street, district and map coordinates, plus your own words if you like, for example \"Home since 2014\" or \"Where I grew up · 1979–1991\".": "Auf dem Druck stehen Straße, Bezirk und Koordinaten, auf Wunsch auch deine eigenen Worte, zum Beispiel „Zuhause seit 2014“ oder „Hier bin ich aufgewachsen · 1979–1991“.",
  "The digital version of my print: your Berlin home in the 1928 aerial photograph, with the same spot today below it, at the same scale, and your title, area line and coordinates.": "Die digitale Version meines Drucks: dein Berliner Zuhause im Luftbild um 1928, darunter dieselbe Stelle heute im gleichen Maßstab, dazu Titel, Bezirkszeile und Koordinaten.",
  'Questions': 'Fragen', 'Something else? Write to': 'Noch etwas? Schreib an', '. I reply within a day.': '. Ich antworte innerhalb eines Tages.',
  'Which paper should I pick?': 'Welches Papier soll ich nehmen?',
  'Classic Matte (170 g) is the lightest and cheapest, Premium Matte (200 g) is smoother and whiter, Museum-Quality Matte (250 g) is archival and warm off-white. The semi-gloss papers have a soft sheen. For an old photograph I like matte best.': 'Classic Matte (170 g) ist am leichtesten und günstigsten, Premium Matte (200 g) glatter und weißer, Museum-Quality Matte (250 g) archivfest und warm-weiß. Die Semi-Gloss-Papiere glänzen leicht. Für ein altes Foto mag ich matt am liebsten.',
  'Is a frame included?': 'Ist ein Rahmen dabei?',
  'What if the 1928 photo is blank at my spot?': 'Was, wenn das Foto von 1928 an meiner Stelle leer ist?', "The 1928 survey did not cover every corner of today's Berlin. The preview shows exactly what I print: if the top photo is blank, pick a place nearby.": 'Die Befliegung von 1928 deckte nicht jede Ecke des heutigen Berlins ab. Die Vorschau zeigt genau, was ich drucke. Ist das obere Foto leer, wähle einen Ort in der Nähe.',
  'Can I change the text after I order?': 'Kann ich den Text nach der Bestellung ändern?', 'Yes, until it goes to print. Write to me with your order number and the new text.': 'Ja, bis es in den Druck geht. Schreib mir deine Bestellnummer und den neuen Text.',
  'Where do you deliver, and how long does it take?': 'Wohin lieferst du, und wie lange dauert es?', 'Can I return it?': 'Kann ich es zurückgeben?',
  'The poster is made for you, so there are no returns for a change of mind. If it arrives misprinted or damaged, I reprint it free. The digital file keeps the 14-day withdrawal right.': 'Das Poster wird für dich angefertigt, daher gibt es keinen Widerruf. Kommt es fehlerhaft oder beschädigt an, drucke ich es kostenlos neu. Für die digitale Datei gilt das 14-tägige Widerrufsrecht.',
  'Delivery & returns': 'Versand und Rückgabe',
  'Digital file: made from your spot and sent by email within 24 hours, nothing is shipped.': 'Digitale Datei: wird für deinen Ort erstellt und innerhalb von 24 Stunden per E-Mail geschickt, es wird nichts verschickt.',
  'The Store Terms and the Withdrawal notices are linked on this page.': 'Die AGB und die Widerrufsbelehrungen sind auf dieser Seite verlinkt.',
  'Withdrawal notice, terms and legal information': 'Widerrufsbelehrung, AGB und rechtliche Informationen',
}));
TEXT.set('The poster ships free to Germany, the other EU countries, the UK and the US: usually 3 to 5 working days to Germany, 4 to 7 to most of the EU, the UK and the US, and 6 to 9 to Bulgaria, Estonia, Finland, Greece, Ireland, Latvia, Lithuania, Portugal and Romania. Checkout shows the time for your country. The digital file comes by email within 24 hours, anywhere.', 'Das Poster wird kostenlos nach Deutschland, in die übrige EU, nach UK und in die USA geschickt: meist 3 bis 5 Werktage nach Deutschland, 4 bis 7 in die meisten EU-Länder, nach UK und in die USA, 6 bis 9 nach Bulgarien, Estland, Finnland, Griechenland, Irland, Lettland, Litauen, Portugal und Rumänien. An der Kasse siehst du die Zeit für dein Land. Die digitale Datei kommt überallhin innerhalb von 24 Stunden per E-Mail.');
TEXT.set('Printed poster: made to order from your address and printed for you. Free delivery to Germany (usually 3 to 5 working days), most of the EU, the United Kingdom and the United States (4 to 7), and Bulgaria, Estonia, Finland, Greece, Ireland, Latvia, Lithuania, Portugal and Romania (6 to 9).', 'Gedrucktes Poster: wird nach deiner Adresse für dich angefertigt. Kostenloser Versand nach Deutschland (meist 3 bis 5 Werktage), in die meisten EU-Länder, nach UK und in die USA (4 bis 7) sowie nach Bulgarien, Estland, Finnland, Griechenland, Irland, Lettland, Litauen, Portugal und Rumänien (6 bis 9).');
// Standard poster copy (5 Nov 2026). Berolina keeps its existing page unchanged.
const POSTER_TEXT = new Map(Object.entries({
  'Printed to order by Gelato': 'Auf Bestellung von Gelato gedruckt',
  '14-day right of withdrawal for consumers': '14-tägiges Widerrufsrecht für Verbraucher',
  'Made by me, Yusuf.': 'Von mir gestaltet, Yusuf.',
  '170 g matte paper.': 'Mattes Papier, 170 g.',
  '200 g matte paper.': 'Mattes Papier, 200 g.',
  '250 g matte paper.': 'Mattes Papier, 250 g.',
  '170 g paper with a soft sheen.': 'Papier mit leichtem Glanz, 170 g.',
  '200 g paper with a soft sheen.': 'Papier mit leichtem Glanz, 200 g.',
  'What sizes and paper are available?': 'Welche Größen und Papiere gibt es?',
  'No, this is an unframed poster. Frames, furniture and decor in room visualisations are not included.': 'Nein, das Poster kommt ohne Rahmen. Rahmen, Möbel und Dekoration in den Raumvisualisierungen sind nicht enthalten.',
  'Can I return it? What if it is faulty?': 'Kann ich es zurückgeben? Was ist bei einem Mangel?',
  'As a consumer, you have a 14-day right of withdrawal. You pay the return postage for a change of mind.': 'Als Verbraucher hast du ein 14-tägiges Widerrufsrecht. Die Rücksendekosten bei einem Widerruf trägst du.',
  'If your print arrives faulty, damaged or different from your order, write to': 'Kommt dein Druck fehlerhaft oder beschädigt an oder entspricht er nicht deiner Bestellung, schreibe an',
  '. Your statutory rights apply. See the': '. Deine gesetzlichen Rechte gelten. Alle Einzelheiten stehen in den',
  'and': 'und',
  'for the full details.': '.',
  'The poster ships free to Germany, the other EU countries, the UK and the US: usually 3 to 5 working days to Germany, 4 to 7 to most of the EU, the UK and the US, and 6 to 9 to Bulgaria, Estonia, Finland, Greece, Ireland, Latvia, Lithuania, Portugal and Romania. Checkout shows the time for your country.': 'Das Poster wird kostenlos nach Deutschland, in die anderen EU-Länder, nach UK und in die USA versandt: meist 3 bis 5 Werktage nach Deutschland, 4 bis 7 in die meisten EU-Länder, nach UK und in die USA sowie 6 bis 9 nach Bulgarien, Estland, Finnland, Griechenland, Irland, Lettland, Litauen, Portugal und Rumänien. Im Checkout siehst du die Zeit für dein Land.',
  'The poster ships free to Germany, the other EU countries, the UK and the US: usually 3 to 5 working days to Germany, 4 to 7 to most of the EU, the UK and the US, and 6 to 9 to Bulgaria, Estonia, Finland, Greece, Ireland, Latvia, Lithuania, Portugal and Romania. Checkout shows the time for your country. Frame not included.': 'Das Poster wird kostenlos nach Deutschland, in die anderen EU-Länder, nach UK und in die USA versandt: meist 3 bis 5 Werktage nach Deutschland, 4 bis 7 in die meisten EU-Länder, nach UK und in die USA sowie 6 bis 9 nach Bulgarien, Estland, Finnland, Griechenland, Irland, Lettland, Litauen, Portugal und Rumänien. Im Checkout siehst du die Zeit für dein Land. Ohne Rahmen.'
}));
const PATTERNS = [
  [/^Available sizes: (.+)\.$/, 'Verfügbare Größen: $1.'],
  [/^Paper: (.+)\.$/, 'Papier: $1.'],
  [/^Available papers: (.+)\. Choose a size in the menu to see its available papers\.$/, 'Verfügbare Papiere: $1. Wähle im Menü eine Größe, um die dafür verfügbaren Papiere zu sehen.'],
  [/^Unframed · (.+)$/, 'Ohne Rahmen · $1'],
  [/^Cart \((\d+)\)$/, 'Warenkorb ($1)'], [/^Add to cart · (.+)$/, 'In den Warenkorb · $1'], [/^Yes, add to cart · (.+)$/, 'Ja, in den Warenkorb · $1'],
  [/^Example poster, (.+)\. Search an address to see your home\.$/, 'Beispielposter, $1. Suche eine Adresse, um dein Zuhause zu sehen.'],
  [/^Example file\. Search an address to see your home\.$/, 'Beispieldatei. Suche eine Adresse, um dein Zuhause zu sehen.'],
  [/^Example poster, (.+)\. Search an address to see your home, then add your own words\.$/, 'Beispielposter, $1. Suche eine Adresse, um dein Zuhause zu sehen, und schreib deine eigenen Worte dazu.'],
  [/^Example file\. Search an address to see your home, then add your own words\.$/, 'Beispieldatei. Suche eine Adresse, um dein Zuhause zu sehen, und schreib deine eigenen Worte dazu.'],
  [/^Your poster, ([^:]+): 1928 above, today below, same ground and scale\. Tap either photo to move the cross\.$/, 'Dein Poster, $1: oben um 1928, unten heute, gleicher Ausschnitt und Maßstab. Tippe auf ein Foto, um das Kreuz zu verschieben.'],
  [/^Your poster, (.+)$/, 'Dein Poster, $1'], [/^Personalised print · (.+)$/, 'Personalisierter Druck · $1'],
  [/^From (€[\d.,]+) · printed and posted to you, free delivery$/, 'Ab $1 · gedruckt und kostenlos zu dir geschickt'],
  [/^(€[\d.,]+) · JPG \+ PDF by email, print it yourself$/, '$1 · JPG + PDF per E-Mail, zum Selberdrucken'],
  [/^Poster gift (€[\d.,]+) · Digital gift (€[\d.,]+)$/, 'Poster-Gutschein $1 · Datei-Gutschein $2'],
  [/^(€[\d.,]+) · a 30 × 40 cm Classic Matte poster, delivery included$/, '$1 · ein Poster 30 × 40 cm Classic Matte, Versand inklusive'],
  [/^(€[\d.,]+) · the printable file$/, '$1 · die Datei zum Selberdrucken'],
  [/^From (€[\d.,]+)$/, 'Ab $1'],
];
const ATTRS = new Map(Object.entries({
  'e.g. Chamissoplatz': 'z. B. Chamissoplatz', 'you@example.com': 'E-Mail-Adresse', 'Address or place in Berlin': 'Adresse oder Ort in Berlin',
  'Why you can buy with confidence': 'Darauf kannst du dich verlassen', 'Example print: Chamissoplatz in 1928 and today': 'Beispieldruck: Chamissoplatz um 1928 und heute',
  "Aerial photograph of your home in 1928, with a cross on your building": "Luftbild deines Zuhauses um 1928, mit einem Kreuz auf deinem Gebäude",
  'Aerial photograph of the same spot today, same ground and scale, with a cross on the same spot': 'Luftbild derselben Stelle heute, gleicher Ausschnitt und Maßstab, mit einem Kreuz an derselben Stelle',
  'Withdrawal notice and terms': 'Widerruf und Bedingungen',
  'Home since 2014': 'Zuhause seit 2014',
}));
TEXT.set("How many homes?","Wie viele Adressen?");
ATTRS.set("How many homes?","Wie viele Adressen?");
TEXT.set("One home","1 Adresse");
ATTRS.set("One home","1 Adresse");
TEXT.set("2 homes","2 Adressen");
ATTRS.set("2 homes","2 Adressen");
TEXT.set("3 homes","3 Adressen");
ATTRS.set("3 homes","3 Adressen");
TEXT.set("Put the homes of your Berlin life on one print: your first flat, the one you live in now, your parents' house. Each one in 1928 and today.","Alle Adressen deines Berliner Lebens auf einem Druck: die erste Wohnung, die heutige, das Haus deiner Eltern. Jede um 1928 und heute.");
ATTRS.set("Put the homes of your Berlin life on one print: your first flat, the one you live in now, your parents' house. Each one in 1928 and today.","Alle Adressen deines Berliner Lebens auf einem Druck: die erste Wohnung, die heutige, das Haus deiner Eltern. Jede um 1928 und heute.");
TEXT.set("Home 1","Adresse 1");
ATTRS.set("Home 1","Adresse 1");
TEXT.set("Home 2","Adresse 2");
ATTRS.set("Home 2","Adresse 2");
TEXT.set("Home 3","Adresse 3");
ATTRS.set("Home 3","Adresse 3");
TEXT.set("Years or words for this home (optional)","Jahre oder Worte zu dieser Adresse (optional)");
ATTRS.set("Years or words for this home (optional)","Jahre oder Worte zu dieser Adresse (optional)");
TEXT.set("2009–2014","2009–2014");
ATTRS.set("2009–2014","2009–2014");
TEXT.set("Heading on the print","Überschrift auf dem Druck");
ATTRS.set("Heading on the print","Überschrift auf dem Druck");
TEXT.set("OUR BERLIN HOMES","UNSERE BERLINER ADRESSEN");
ATTRS.set("OUR BERLIN HOMES","UNSERE BERLINER ADRESSEN");
TEXT.set("or MY BERLIN HOMES, or a family name","oder MEINE BERLINER ADRESSEN, oder ein Familienname");
ATTRS.set("or MY BERLIN HOMES, or a family name","oder MEINE BERLINER ADRESSEN, oder ein Familienname");
TEXT.set("Add the next home to continue.","Füge die nächste Adresse hinzu, um weiterzumachen.");
ATTRS.set("Add the next home to continue.","Füge die nächste Adresse hinzu, um weiterzumachen.");
TEXT.set("A gift idea: the homes of your parents' Berlin years.","Geschenkidee: die Berliner Adressen deiner Eltern.");
ATTRS.set("A gift idea: the homes of your parents' Berlin years.","Geschenkidee: die Berliner Adressen deiner Eltern.");
TEXT.set("Can I put more than one home on the print?","Kann ich mehrere Adressen auf einen Druck bringen?");
ATTRS.set("Can I put more than one home on the print?","Kann ich mehrere Adressen auf einen Druck bringen?");
TEXT.set("Yes, two or three. Each home gets its 1928 photo and today's photo at the same scale, with its street, district and your own words. The heading at the bottom is yours too.","Ja, zwei oder drei. Jede Adresse bekommt ihr Foto von 1928 und das von heute im gleichen Maßstab, mit Straße, Bezirk und deinen Worten. Die Überschrift unten bestimmst du auch.");
ATTRS.set("Yes, two or three. Each home gets its 1928 photo and today's photo at the same scale, with its street, district and your own words. The heading at the bottom is yours too.","Ja, zwei oder drei. Jede Adresse bekommt ihr Foto von 1928 und das von heute im gleichen Maßstab, mit Straße, Bezirk und deinen Worten. Die Überschrift unten bestimmst du auch.");
TEXT.set("Home since 2014","Zuhause seit 2014");
ATTRS.set("Home since 2014","Zuhause seit 2014");
TEXT.set("e.g. Chamissoplatz","z. B. Chamissoplatz");
ATTRS.set("e.g. Chamissoplatz","z. B. Chamissoplatz");
TEXT.set("Homes","Adressen");
ATTRS.set("Homes","Adressen");
TEXT.set("Your Berlin home as a JPG and PDF. Nothing is shipped.","Dein Berliner Zuhause als JPG und PDF. Kein Versand.");
ATTRS.set("Your Berlin home as a JPG and PDF. Nothing is shipped.","Dein Berliner Zuhause als JPG und PDF. Kein Versand.");
TEXT.set("Each home in 1928 and today. Tap either photo to move the cross.","Jede Adresse um 1928 und heute. Tippe auf ein Foto, um das Kreuz zu verschieben.");
ATTRS.set("Each home in 1928 and today. Tap either photo to move the cross.","Jede Adresse um 1928 und heute. Tippe auf ein Foto, um das Kreuz zu verschieben.");
TEXT.set("There is no 1928 aerial photo for this spot","Für diese Stelle gibt es kein Luftbild von 1928");
ATTRS.set("There is no 1928 aerial photo for this spot","Für diese Stelle gibt es kein Luftbild von 1928");
TEXT.set("Checking the aerial photos…","Die Luftbilder werden geprüft…");
ATTRS.set("Checking the aerial photos…","Die Luftbilder werden geprüft…");
TEXT.set("Check the text and character limits.","Prüfe die Texte und Zeichenlimits.");
ATTRS.set("Check the text and character limits.","Prüfe die Texte und Zeichenlimits.");
TEXT.set("The aerial photo could not load. Search for the place again to retry.","Das Luftbild konnte nicht geladen werden. Suche den Ort erneut.");
// Photo status lines (aerial-source.js, 10 Nov 2026). The loading and retry lines had no German before.
for (const [en, de] of [
  ['Loading the 1928 photo…', 'Das Foto von 1928 wird geladen…'],
  ['Loading the current photo…', 'Das heutige Foto wird geladen…'],
  ['Retrying the 1928 photo…', 'Das Foto von 1928 wird erneut geladen…'],
  ['Retrying the current photo…', 'Das heutige Foto wird erneut geladen…'],
  ["The 1928 photo is not coming through: Berlin's aerial photo service is down right now. I keep trying here. You can also send this spot to your inbox and look again later.",
    'Das Foto von 1928 kommt gerade nicht an: Der Luftbild-Dienst der Stadt Berlin ist im Moment gestört. Ich versuche es hier weiter. Du kannst dir diese Stelle auch per E-Mail schicken und später noch einmal ansehen.'],
  ["The current photo is not coming through: Berlin's aerial photo service is down right now. I keep trying here. You can also send this spot to your inbox and look again later.",
    'Das heutige Foto kommt gerade nicht an: Der Luftbild-Dienst der Stadt Berlin ist im Moment gestört. Ich versuche es hier weiter. Du kannst dir diese Stelle auch per E-Mail schicken und später noch einmal ansehen.'],
  ["The 1928 photo could not load: Berlin's aerial photo service is still down. Search for the place again later, or send this spot to your inbox.",
    'Das Foto von 1928 konnte nicht geladen werden: Der Luftbild-Dienst der Stadt Berlin ist noch gestört. Suche den Ort später noch einmal oder schick dir diese Stelle per E-Mail.'],
  ["The current photo could not load: Berlin's aerial photo service is still down. Search for the place again later, or send this spot to your inbox.",
    'Das heutige Foto konnte nicht geladen werden: Der Luftbild-Dienst der Stadt Berlin ist noch gestört. Suche den Ort später noch einmal oder schick dir diese Stelle per E-Mail.'],
]) TEXT.set(en, de);
ATTRS.set("The aerial photo could not load. Search for the place again to retry.","Das Luftbild konnte nicht geladen werden. Suche den Ort erneut.");
for (const [en,de] of [['1928 & today','1928 und heute'],['Blue','Blau'],['Dark','Dunkel'],['Colour','Farbe'],['Then & now','Damals und heute'],['1928 only','Nur 1928'],['Black & white','Schwarzweiß'],['Cream','Creme'],['Blueprint','Blaupause'],['Charcoal','Anthrazit']]) ATTRS.set(en,de);
TEXT.set('Your Berlin Homes in 1928','Deine Berliner Adressen um 1928');
TEXT.set('Each home in 1928 and today. Click either photo to move the cross.','Jede Adresse um 1928 und heute. Klicke auf ein Foto, um das Kreuz zu verschieben.');
PATTERNS.unshift(
  [/^Your poster, ([^:]+): 1928 above, today below, same ground and scale\. Click either photo to move the cross\.$/, 'Dein Poster, $1: oben um 1928, unten heute, gleicher Ausschnitt und Maßstab. Klicke auf ein Foto, um das Kreuz zu verschieben.'],
  [/^Your digital file: 1928 above, today below, same ground and scale\. (Click|Tap) either photo to move the cross\.$/, (_, verb) => 'Deine digitale Datei: oben um 1928, unten heute, gleicher Ausschnitt und Maßstab. '+(verb==='Click'?'Klicke':'Tippe')+' auf ein Foto, um das Kreuz zu verschieben.']
);
// 1928 multi-buy (9 Nov 2026).
for (const [en, de] of [
  ['More homes, less each', 'Mehr Adressen, weniger pro Druck'], ['2 prints', '2 Drucke'], ['3 prints', '3 Drucke'], ['4 or more', 'ab 4'],
  ['5% off', '5 % Rabatt'], ['10% off', '10 % Rabatt'], ['15% off', '15 % Rabatt'],
  ['Mix posters and digital files. The discount comes off automatically.', 'Poster und digitale Dateien lassen sich mischen. Der Rabatt wird automatisch abgezogen.'],
  ['Add one more address and save 5% on both.', 'Noch eine Adresse dazu, und du sparst 5 % auf beide.'],
  ['You save 5% now. Add a third and save 10%.', 'Du sparst jetzt 5 %. Mit einer dritten Adresse sind es 10 %.'],
  ['You save 10% now. A fourth makes it 15%.', 'Du sparst jetzt 10 %. Mit einer vierten sind es 15 %.'],
  ['You save 15% on all of them.', 'Du sparst 15 % auf alle.'],
]) TEXT.set(en, de);
PATTERNS.unshift(
  [/^In your cart: 1 print$/, 'Im Warenkorb: 1 Druck'],
  [/^In your cart: (\d+) prints$/, 'Im Warenkorb: $1 Drucke'],
  [/^In your cart: (.+)$/, 'Im Warenkorb: $1']
);
// Cart page and side cart (9 Nov 2026): every string the 1928 flow touches. The legal acknowledgement and the full notices under Details stay in
// their reviewed English wording; the withdraw button is already bilingual. A buyer headed to the German checkout gets German legal text written
// by storefront-element.js itself (legalBox, lineNotice; marked bw-raw, so it is skipped here).
const CART_TEXT = {
 "+ Add another address": "+ Weitere Adresse hinzufügen",
 "Want them on one print?": "Lieber alle auf einem Druck?",
 "Homes print": "Mit 2 oder 3 Adressen",
 "puts 2 or 3 addresses together.": "landen sie zusammen auf einem Druck.",
 "Your cart": "Dein Warenkorb",
 "Shipped to you": "Wird verschickt",
 "Sent by email": "Per E-Mail",
 "Delivery type to confirm": "Lieferart noch offen",
 "Your Berlin Street in 1928, Digital File": "Deine Berliner Straße um 1928, digitale Datei",
 "Your Berlin Homes in 1928": "Deine Berliner Adressen um 1928",
 "Your address:": "Deine Adresse:",
 "On the print:": "Auf dem Druck:",
 "Colour:": "Farbe:",
 "Your words:": "Deine Worte:",
 "Print details need checking.": "Die Druckdaten müssen geprüft werden.",
 "Remove": "Entfernen",
 "Manage this item in the original cart.": "Diesen Artikel verwaltest du im ursprünglichen Warenkorb.",
 "Personalised physical product": "Personalisiertes Produkt",
 "Personalised digital file": "Personalisierte digitale Datei",
 "Digital gift voucher": "Digitaler Geschenkgutschein",
 "Printable digital product": "Digitales Produkt zum Ausdrucken",
 "Made for you, so the 14-day withdrawal right does not apply. Faulty prints are covered.": "Für dich angefertigt, daher gilt das 14-tägige Widerrufsrecht nicht. Bei fehlerhaften Drucken bleiben deine Rechte bestehen.",
 "Details": "Details (auf Englisch)",
 "Promo code": "Gutscheincode",
 "You can enter a promo code in checkout.": "Einen Gutscheincode gibst du an der Kasse ein.",
 "Order summary": "Bestellübersicht",
 "Subtotal": "Zwischensumme",
 "Discount": "Rabatt",
 "Delivery": "Versand",
 "Tax": "Steuer",
 "Included tax": "Enthaltene Steuer",
 "Estimated total": "Voraussichtliche Summe",
 "Delivery destination": "Lieferziel",
 "Billing destination for tax": "Rechnungsland für die Steuer",
 "Country": "Land",
 "Choose a country": "Land wählen",
 "Germany": "Deutschland",
 "Austria": "Österreich",
 "France": "Frankreich",
 "Netherlands": "Niederlande",
 "United Kingdom": "Vereinigtes Königreich",
 "United States": "USA",
 "Another destination": "Anderes Ziel",
 "Postal code": "Postleitzahl",
 "Postcode": "Postleitzahl",
 "ZIP code": "ZIP-Code",
 "For another destination,": "Für ein anderes Ziel",
 "continue in the original cart": "mach im ursprünglichen Warenkorb weiter",
 "to check the available delivery options.": "und prüfe dort die Versandoptionen.",
 "Refresh your cart to continue.": "Lade deinen Warenkorb neu, um fortzufahren.",
 "Open the original cart to continue.": "Öffne den ursprünglichen Warenkorb, um fortzufahren.",
 "Continue in the original cart for this destination.": "Für dieses Ziel geht es im ursprünglichen Warenkorb weiter.",
 "Add your country and postal code to continue.": "Gib Land und Postleitzahl ein, um fortzufahren.",
 "Enter your full postal code to continue.": "Gib die vollständige Postleitzahl ein, um fortzufahren.",
 "Add your postal code to continue.": "Gib deine Postleitzahl ein, um fortzufahren.",
 "Check your postal code to continue.": "Prüfe deine Postleitzahl, um fortzufahren.",
 "Delivery could not be checked.": "Der Versand konnte nicht geprüft werden.",
 "Checking tax…": "Steuer wird geprüft…",
 "Checking delivery…": "Versand wird geprüft…",
 "Updating your cart…": "Dein Warenkorb wird aktualisiert…",
 "No delivery method for this address.": "Für diese Adresse gibt es keine Versandart.",
 "Choose a delivery method to continue.": "Wähle eine Versandart, um fortzufahren.",
 "Check delivery to continue.": "Prüfe den Versand, um fortzufahren.",
 "Check your postal code and try again.": "Prüfe deine Postleitzahl und versuche es noch einmal.",
 "The shop is temporarily unavailable.": "Der Shop ist gerade nicht erreichbar.",
 "Your cart changed. Check delivery again.": "Dein Warenkorb hat sich geändert. Prüfe den Versand noch einmal.",
 "Tax could not be checked for this country.": "Die Steuer für dieses Land konnte nicht geprüft werden.",
 "Delivery could not be checked for this address.": "Der Versand an diese Adresse konnte nicht geprüft werden.",
 "Delivery method": "Versandart",
 "Try again": "Noch einmal versuchen",
 "Open the original cart": "Ursprünglichen Warenkorb öffnen",
 "Open original cart": "Ursprünglichen Warenkorb öffnen",
 "No delivery method was returned for this address. Check the postal code or open the original cart.": "Für diese Adresse kam keine Versandart zurück. Prüfe die Postleitzahl oder öffne den ursprünglichen Warenkorb.",
 "Check tax": "Steuer prüfen",
 "Check delivery": "Versand prüfen",
 "Continue to checkout": "Weiter zur Kasse",
 "Final tax is confirmed in checkout.": "Die endgültige Steuer wird an der Kasse bestätigt.",
 "Final delivery and tax are confirmed in checkout.": "Versand und Steuer werden an der Kasse bestätigt.",
 "The checkout page is in English.": "Die Kasse selbst ist auf Englisch.",
 "Continue shopping": "Weiter einkaufen",
 "Tax checked. You can continue to checkout.": "Steuer geprüft. Du kannst zur Kasse gehen.",
 "Delivery confirmed. You can continue to checkout.": "Versand bestätigt. Du kannst zur Kasse gehen.",
 "Store Terms": "Shop-Bedingungen (auf Englisch)",
 "Withdrawal notices and model form": "Widerrufshinweise und Muster-Widerrufsformular (auf Englisch)",
 "Your cart is empty.": "Dein Warenkorb ist leer.",
 "Explore Berlin prints, or listen to a city walk.": "Entdecke Berlin-Drucke oder hör dir einen Stadtspaziergang an.",
 "Browse the shop": "Zum Shop",
 "Your cart could not be read.": "Dein Warenkorb konnte nicht gelesen werden.",
 "The original cart remains available.": "Der ursprüngliche Warenkorb bleibt erreichbar.",
 "Delivery requirements have not been confirmed. Continue in the original cart.": "Die Versandangaben sind noch nicht bestätigt. Mach im ursprünglichen Warenkorb weiter.",
 "Refresh cart": "Warenkorb neu laden",
 "View cart": "Warenkorb ansehen",
 "Added to your cart": "Im Warenkorb",
 "Nothing is shipped. Tax is confirmed after your billing country is entered.": "Es wird nichts verschickt. Die Steuer wird bestätigt, sobald du dein Rechnungsland eingibst.",
 "Delivery and tax are confirmed after your destination is entered.": "Versand und Steuer werden bestätigt, sobald du dein Lieferziel eingibst."
};
for (const [en, de] of Object.entries(CART_TEXT)) TEXT.set(en, de);
for (const [en, de] of [['Close cart', 'Warenkorb schließen'], ['Shopping cart', 'Warenkorb'], ['Decrease quantity', 'Menge verringern'], ['Increase quantity', 'Menge erhöhen'], ['Delivery method', 'Versandart']]) ATTRS.set(en, de);
for (const [en, de] of [
  ['Layout:', 'Anordnung:'], ['PHYSICAL', 'DRUCK'], ['DIGITAL', 'DIGITAL'],
  ['Digital file made from your spot: a JPG and a PDF, sent by email within 24 hours of payment. Nothing is shipped. You can keep the files for your permitted personal use. You retain the 14-day consumer withdrawal right.',
   'Digitale Datei von deinem Ort: ein JPG und ein PDF, per E-Mail innerhalb von 24 Stunden nach der Zahlung. Es wird nichts verschickt. Du darfst die Dateien für deinen erlaubten persönlichen Gebrauch behalten. Dein 14-tägiges Widerrufsrecht als Verbraucher bleibt bestehen.'],
  ['Withdraw from contract (Vertrag widerrufen)', 'Vertrag widerrufen (Withdraw from contract)'],
  ['Multi-print saving', 'Mengenrabatt'], ["Can't be combined with other codes.", 'Nicht mit anderen Codes kombinierbar.'],
  ['Your code is used instead of the multi-print saving.', 'Dein Code gilt statt des Mengenrabatts.'],
  ["Saving with more prints can't be combined with other codes.", 'Der Rabatt für mehrere Drucke lässt sich nicht mit anderen Codes kombinieren.'],
  ['A code you enter there replaces the multi-print saving.', 'Ein Code, den du dort eingibst, ersetzt den Mengenrabatt.'],
]) TEXT.set(en, de);
PATTERNS.unshift(
  [/^(.+ · \d+ ?x ?\d+ cm) · Unframed$/, '$1 · Ohne Rahmen'],
  [/^All (\d+) personalised gifts →$/, 'Alle $1 personalisierten Geschenke →'],
  [/^All (\d+) posters →$/, 'Alle $1 Poster →'],
  [/^(\d+) available$/, '$1 verfügbar'],
  [/^AUDIO WALKS · (\d+) PRODUCTS$/, 'AUDIO-SPAZIERGÄNGE · $1 PRODUKTE · ENGLISCH'],
  [/^\((\d+) items?\)$/, '($1 Artikel)'],
  [/^Cart \((\d+|—)\)$/, 'Warenkorb ($1)'],
  [/^Quantity: (\d+)$/, 'Menge: $1'],
  [/^(€\d+(?:[.,]\d{2})?) each$/, '$1 pro Stück']
);
// Shop words on the other product pages (digital printables, audio walks), German pages only (11 Nov 2026). Product stories stay as written.
for (const [en, de] of [
  ['Berlin Everyday', 'Berliner Alltag'], ['Landmarks', 'Wahrzeichen'], ['Berlin Stories', 'Berliner Geschichten'], ['Districts', 'Bezirke'],
  ['Printable sets', 'Sets zum Ausdrucken'], ['Personal newspapers', 'Persönliche Zeitungen'],
  ['Printed to order and shipped', 'Auf Bestellung gedruckt und verschickt'], ['Download it and print it yourself', 'Herunterladen und selbst ausdrucken'],
  ['DIGITAL DOWNLOAD · 30 × 40 CM', 'DIGITALER DOWNLOAD · 30 × 40 CM'],
  ['Digital download · 1 JPEG print file and a printing guide. No physical item.', 'Digitaler Download · 1 JPEG-Druckdatei und eine Druckanleitung. Kein physischer Artikel.'],
  ['About this download', 'Über diesen Download'], ['File formats and printing', 'Dateiformate und Druck'], ['Personal use licence', 'Lizenz für den privaten Gebrauch'],
  ['You may print this artwork for personal use. Do not resell, share or redistribute the files.', 'Du darfst dieses Motiv für den privaten Gebrauch ausdrucken. Die Dateien dürfen nicht weiterverkauft, geteilt oder weitergegeben werden.'],
  ['No physical item, frame or decor is supplied. Personal use only; do not resell or redistribute the files.', 'Es wird kein physischer Artikel, kein Rahmen und keine Deko geliefert. Nur für den privaten Gebrauch; die Dateien dürfen nicht weiterverkauft oder weitergegeben werden.'],
  ['Download & returns', 'Download und Rückgabe'], ['Image credits', 'Bildnachweise'], ['Visual credits and sources', 'Bildnachweise und Quellen'],
  ['More from the shop', 'Mehr aus dem Shop'], ['SEE DETAILS →', 'DETAILS ANSEHEN →'], ['Not confirmed', 'Noch nicht bestätigt'],
]) if (!TEXT.has(en)) TEXT.set(en, de);
// 11 Kasım 2026: yeni biçimlerin bütün görünür metin ve etiketleri.
const MOUNTED_TEXT = {
  "200 g matte paper, smooth and white. My pick.": "Mattes Papier, 200 g, glatt und weiß. Meine Wahl.",
  "Poster": "Poster",
  "Framed": "Gerahmt",
  "Canvas": "Leinwand",
  "Frame": "Rahmen",
  "Black": "Schwarz",
  "White": "Weiß",
  "Natural wood": "Naturholz",
  "Fine Art": "Fine Art",
  "Framed print": "Gerahmter Druck",
  "Canvas print": "Leinwanddruck",
  "Size, frame and paper": "Größe, Rahmen und Papier",
  "Change options or text": "Optionen oder Text ändern",
  "Wooden frame with acrylic glass. Hanging kit included.": "Holzrahmen mit Acrylglas. Aufhänger inklusive.",
  "Fine Art paper, printed with 12 inks for deeper tones.": "Fine-Art-Papier, mit 12 Farben gedruckt, für tiefere Töne.",
  "On canvas, stretched over a 2 cm wooden frame. Ready to hang.": "Auf Leinwand, über einen 2 cm Holzrahmen gespannt. Fertig zum Aufhängen.",
  "Free delivery. Germany 5 to 8 working days, most of the EU and the UK 6 to 12, US 8 to 14. Exact days at checkout.": "Kostenloser Versand. Deutschland 5 bis 8 Werktage, fast die ganze EU und UK 6 bis 12, USA 8 bis 14. Genaue Tage an der Kasse.",
  "For Christmas: order framed or canvas by 8 December (Germany), 4 December (most of the EU, UK) or 1 December (US).": "Für Weihnachten: gerahmt oder auf Leinwand bis 8. Dezember (Deutschland), 4. Dezember (fast die ganze EU, UK) oder 1. Dezember (USA) bestellen.",
  "Framed and canvas prints do not count.": "Gerahmte Drucke und Leinwände zählen nicht mit.",
  "Framed and canvas prints do not count towards the multi-print saving.": "Gerahmte Drucke und Leinwände zählen nicht für den Mengenrabatt.",
  "Posters and digital files only. Framed and canvas prints do not count.": "Nur Poster und digitale Dateien. Gerahmte Drucke und Leinwände zählen nicht mit.",
  "Example rooms. Your print shows the address you choose.": "Beispielräume. Dein Druck zeigt die Adresse, die du auswählst.",
  "Framed print in an example room": "Gerahmter Druck in einem Beispielraum",
  "Framed prints at 30 x 40 cm and 45 x 60 cm side by side": "Gerahmte Drucke in 30 x 40 cm und 45 x 60 cm nebeneinander",
  "Framed print in a black frame above a desk: Arkonaplatz in 1928 and today": "Gerahmter Druck mit schwarzem Rahmen über einem Schreibtisch: Arkonaplatz um 1928 und heute",
  "Illustrated preview. Your print shows the address you choose.": "Gezeichnete Vorschau. Dein Druck zeigt die Adresse, die du auswählst.",
  "Illustrated framed print": "Gezeichnete Vorschau eines gerahmten Drucks",
  "Illustrated wooden frame corner": "Gezeichnete Vorschau der Holzrahmenecke",
  "Illustrated canvas front": "Gezeichnete Vorschau der Leinwand von vorn",
  "Illustrated canvas with a 2 cm edge": "Gezeichnete Vorschau der Leinwand mit 2 cm Kante",
  "Illustrated framed print: Chamissoplatz in 1928 and today": "Gezeichnete Vorschau: Chamissoplatz um 1928 und heute im Rahmen",
  "Illustrated canvas print: Chamissoplatz in 1928 and today": "Gezeichnete Vorschau: Chamissoplatz um 1928 und heute auf Leinwand",
  "Your Berlin Street in 1928, Framed print": "Deine Berliner Straße um 1928, gerahmt",
  "Your Berlin Street in 1928, Canvas print": "Deine Berliner Straße um 1928 auf Leinwand",
  "One Berlin address, seen from above in 1928 and today.": "Eine Berliner Adresse, um 1928 und heute von oben gesehen.",
  "Black frame": "Schwarzer Rahmen",
  "White frame": "Weißer Rahmen",
  "Natural wood frame": "Naturholzrahmen",
  "Premium Matte paper": "Premium-Matte-Papier",
  "Fine Art paper": "Fine-Art-Papier",
  "The Poster option is unframed. Framed includes a wooden frame with acrylic glass and a hanging kit. Canvas is stretched over a 2 cm wooden frame and ready to hang.": "Die Option Poster kommt ohne Rahmen. Gerahmt enthält einen Holzrahmen mit Acrylglas und Aufhänger. Die Leinwand ist über einen 2 cm Holzrahmen gespannt und fertig zum Aufhängen."
};
for(const [en,de] of Object.entries(MOUNTED_TEXT)){TEXT.set(en,de);ATTRS.set(en,de);}
PATTERNS.unshift([/^(?:Framed print|Canvas print|30 x 40 cm|45 x 60 cm) · .*(?:frame|paper|€|cm).*$/, value=>value.split(' · ').map(part=>TEXT.get(part)||part).join(' · ')]);
// German shop home and category pages (/de/..., 11 Nov 2026): shop words and short card lines. Product names stay; products in English say so.
for (const [en, de] of [
  ['Berlin posters, personalised prints, personal newspapers, audio walks and guides.', 'Berlin-Poster, personalisierte Drucke, persönliche Zeitungen, Audio-Spaziergänge und Reiseführer.'],
  ['Looking for a Christmas gift? Start here.', 'Suchst du ein Weihnachtsgeschenk? Fang hier an.'],
  ['Made to order · free delivery to Germany, the EU, the UK and the US', 'Auf Bestellung gefertigt · kostenloser Versand nach Deutschland, in die EU, nach UK und in die USA'],
  ['Your Berlin address in the 1928 aerial photographs, made into a print. Free delivery to Germany, the EU, the UK and the US.', 'Deine Berliner Adresse auf den Luftbildern von 1928, als Druck. Kostenloser Versand nach Deutschland, in die EU, nach UK und in die USA.'],
  ['Choose options', 'Optionen wählen'],
  ['Eight printed pages about one day in one person’s life · free delivery to Germany, the EU, the UK and the US', 'Acht gedruckte Seiten über einen Tag im Leben eines Menschen · kostenloser Versand nach Deutschland, in die EU, nach UK und in die USA'],
  ['PERSONAL NEWSPAPER · 8 PAGES', 'PERSÖNLICHE ZEITUNG · 8 SEITEN'], ['MAKE THEIR EDITION →', 'AUSGABE GESTALTEN →'],
  ['Their birthday', 'Zum Geburtstag'], ['Their wedding', 'Zur Hochzeit'], ['The day they came to Berlin', 'Der Tag, an dem sie nach Berlin kamen'], ['For someone leaving Berlin', 'Für alle, die Berlin verlassen'],
  ['Each artwork as a printed poster or a file you print yourself', 'Jedes Motiv als gedrucktes Poster oder als Datei zum Selbstdrucken'],
  ['Open spaces', 'Freiflächen'], ['Urban details', 'Stadtdetails'],
  ['Physical A3 wall calendar · 12 Berlin districts · printed to order', 'Gedruckter A3-Wandkalender · 12 Berliner Bezirke · auf Bestellung gedruckt'],
  ['Berlin 2027 Wall Calendar', 'Berlin Wandkalender 2027'], ['12 districts · A3', '12 Bezirke · A3'],
  ['Four self-guided walks, one at a time, or three as a bundle', 'Vier Spaziergänge auf eigene Faust (auf Englisch), einzeln oder drei im Paket'],
  ['Browse all audio walks →', 'Alle Audio-Spaziergänge ansehen →'],
  ['AUDIO WALK · SELF-GUIDED', 'AUDIO-SPAZIERGANG · ENGLISCH'],
  ['A trip plan, digital guides, virtual tours and an evening at home', 'Ein Reiseplan, digitale Guides, virtuelle Touren und ein Abend zu Hause (auf Englisch)'],
  ['TRIP PLAN · WEB AND PDF', 'REISEPLAN · WEB UND PDF · ENGLISCH'], ['1 to 7 days', '1 bis 7 Tage'],
  ['DIGITAL PLAN · PDF', 'DIGITALER PLAN · PDF · ENGLISCH'], ['Your first hours in Berlin', 'Deine ersten Stunden in Berlin'],
  ['DIGITAL GUIDE · 15 PAGES', 'DIGITALER GUIDE · 15 SEITEN · ENGLISCH'], ['15 must-see places', '15 Orte, die du sehen solltest'],
  ['DIGITAL GUIDE', 'DIGITALER GUIDE · ENGLISCH'], ['Photo walks across the city', 'Foto-Spaziergänge durch die Stadt'],
  ['VIRTUAL TOUR · VIDEO', 'VIRTUELLE TOUR · VIDEO · ENGLISCH'], ['Watch from home', 'Von zu Hause ansehen'],
  ['EVENING AT HOME', 'ABEND ZU HAUSE · ENGLISCH'],
  ['WALL CALENDAR · A3', 'WANDKALENDER · A3'], ['Unframed', 'Ohne Rahmen'], ['1 available', '1 verfügbar'],
]) if (!TEXT.has(en)) TEXT.set(en, de);
// Yalnız görünen metin; form değerleri, varyantlar ve sepet kaydı değişmez.
const germanMoney = text => text.replace(/€(\d+(?:[.,]\d{2})?)/g, (_, number) => number.replace('.', ',')+' €');
// Short cart words that could also appear elsewhere on a product page: translated only on the cart page and in the side cart.
const CART_ONLY = new Set(['Details', 'Delivery', 'Tax', 'Subtotal', 'Remove', 'Discount', 'Country']);
const translate = (value, node) => {
  const key = value.replace(/\s+/g, ' ').trim();
  if (!key) return null;
  if (CART_ONLY.has(key) && !pagePath().startsWith('/cart-page') && !node?.parentElement?.closest('dialog')) return null;
  if (TEXT.has(key)) return value.replace(value.trim(), germanMoney(TEXT.get(key)));
  if (!pagePath().startsWith(PRODUCT_PATH) && !pagePath().startsWith('/cart-page') && POSTER_TEXT.has(key)) return value.replace(value.trim(), POSTER_TEXT.get(key));
  for (const [pattern, to] of PATTERNS) if (pattern.test(key)) return value.replace(value.trim(), germanMoney(key.replace(pattern, to)));
  const formatted=germanMoney(value);
  return formatted!==value?formatted:null;
};
const skip = node => ['STYLE', 'SCRIPT', 'TEXTAREA'].includes(node.parentElement?.tagName) || (node.parentElement?.tagName === 'OPTION' && !node.parentElement.closest('[data-address-form]')) || !!node.parentElement?.closest('.homes-type,.bw-raw');
// On Wix's German pages every store link stays German: /category/..., /product-page/... and /cart-page get the /de prefix (11 Nov 2026).
const DE_PAGE = /^\/de(?:\/|$)/.test(decodeURIComponent(location.pathname));
const STORE_LINK = /^\/(?:category|product-page|cart-page|store)(?:\/|$)/;
function deLinks(root) {
  if (!DE_PAGE) return;
  root.querySelectorAll('a[href]').forEach(a => {
    if (a.closest('.lang-switch')) return;
    try {
      const u = new URL(a.getAttribute('href'), location.href);
      if (!/(^|\.)walkofberlin\.com$/.test(u.hostname) || !STORE_LINK.test(u.pathname)) return;
      u.hostname = 'www.walkofberlin.com'; u.pathname = '/de' + u.pathname; u.searchParams.delete('lang');
      if (a.getAttribute('href') !== u.href) a.setAttribute('href', u.href);
    } catch (e) {}
  });
}
function sweep(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (skip(node)) continue;
    const next = translate(node.nodeValue, node);
    if (next && next !== node.nodeValue) node.nodeValue = next;
  }
  root.querySelectorAll('[placeholder],[aria-label],[alt],[title]').forEach(element => {
    for (const name of ['placeholder', 'aria-label', 'alt', 'title']) {
      const next = ATTRS.get(element.getAttribute(name));
      if (next) element.setAttribute(name, next);
    }
  });
  deLinks(root);
}
// The rest of the shop's English text (product stories, notes, image descriptions) lives in data/de-store.json, built from a crawl
// of every German store page (11 Nov 2026). Names, credits and links are not in it and stay as written.
let storeDe = null;
const loadStoreDe = () => storeDe || (storeDe = fetch(new URL('data/de-store.json' + new URL(import.meta.url).search, import.meta.url))
  .then(r => r.ok ? r.json() : {}).then(map => { for (const [k, v] of Object.entries(map || {})) { if (!v) continue; const attr = k.match(/^@(?:aria-label|alt|placeholder|title): ([\s\S]*)$/); if (attr) { if (!ATTRS.has(attr[1])) ATTRS.set(attr[1], v); } else if (!TEXT.has(k)) TEXT.set(k, v); } })
  .catch(() => {}));
// Wix can replace the element while the page settles, so the watch rebinds to whichever shadow root is current.
function start() {
  const ysPage = pagePath().startsWith(PRODUCT_PATH), cartPage = pagePath().startsWith('/cart-page');
  // Wix's German product pages (/de/...) get the shop's own words in German on every product, not only posters (11 Nov 2026).
  const dePage = /^\/de(?:\/|$)/.test(decodeURIComponent(location.pathname));
  if (!ysPage && !cartPage && !dePage && !pagePath().startsWith('/product-page/')) return;
  if (ysPage) document.title = 'Deine Berliner Straße um 1928 | Walk of Berlin';
  if (cartPage) document.title = 'Warenkorb | Walk of Berlin';
  let bound = null;
  const bind = () => {
    const host = document.querySelector('bw-storefront');
    if (!host?.shadowRoot || host.shadowRoot === bound) return;
    if (!ysPage && !cartPage && !dePage && !host.shadowRoot.querySelector('.poster-faq')) return;
    bound = host.shadowRoot;
    host.lang = 'de';
    const root = bound;
    new MutationObserver(() => sweep(root)).observe(root, { subtree: true, childList: true, characterData: true });
    sweep(root);
    loadStoreDe().then(() => sweep(root));
  };
  bind();
  setInterval(bind, 300);
}
export const calendarText=(s,german)=>german?(TEXT.get(s)||s):s;
if(new URLSearchParams(location.search).get('lang')==='de'||/^\/de(?:\/|$)/.test(location.pathname)||(/^\/cart-page/.test(location.pathname)&&(()=>{try{const k=JSON.parse(sessionStorage.getItem('bwYsLastChoice')||'null');return k?.lang==='de'&&Date.now()-Number(k.at)<864e5}catch{return false}})()))start();

// The gated Design 2 renderer has its dictionary before first paint. Translate
// synchronously in that render task, rather than waiting for the legacy watcher.
let design2Dictionary;
export function translateDesign2(root,map) {
 if(map!==design2Dictionary){design2Dictionary=map;for(const [k,v] of Object.entries(map||{})){if(!v||k.startsWith('design2:'))continue;const attr=k.match(/^@(?:aria-label|alt|placeholder|title): ([\s\S]*)$/);if(attr){if(!ATTRS.has(attr[1]))ATTRS.set(attr[1],v);}else if(!TEXT.has(k))TEXT.set(k,v);}}
 sweep(root);
}
