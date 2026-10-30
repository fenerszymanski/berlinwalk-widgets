// German layer for the 1928 page (30 Oct 2026, press launch). Loaded only with ?lang=de. It rewrites visible text inside the
// storefront's shadow root and never touches cart, price or order logic, so a miss simply leaves that string in English.
// Legal notices stay in their reviewed English wording; only their heading says so.
const PRODUCT_PATH = '/product-page/your-berlin-street-in-1928-personalised-aerial-print-30-x-40-cm';
const TEXT = new Map(Object.entries({
  'All products': 'Alle Produkte', 'Posters': 'Poster', 'All posters': 'Alle Poster', 'Personalised prints': 'Personalisierte Drucke',
  '2027 Wall Calendar': 'Wandkalender 2027', 'Audio walks': 'Audio-Spaziergänge', 'Guides': 'Reiseführer', 'Store': 'Shop', 'Cart': 'Warenkorb',
  'Your Berlin Street in 1928': 'Deine Berliner Straße um 1928', '/ Your Berlin Street in 1928': '/ Deine Berliner Straße um 1928',
  'Your own address · c. 1928 and today': 'Deine Adresse · um 1928 und heute',
  'PERSONALISED PRINT · 30 × 40 OR 45 × 60 CM': 'PERSONALISIERTER DRUCK · 30 × 40 ODER 45 × 60 CM',
  'A personalised print of your Berlin street.': 'Gib deine Adresse ein und sieh deine Straße kostenlos aus der Luft, um 1928 und heute. Als Poster bestellen kannst du sie, musst du aber nicht.',
  'Find your street in 1928': 'Finde deine Straße um 1928', 'Search': 'Suchen',
  'Search your address to see the print I can make for you, then tap it.': 'Suche deine Adresse und tippe sie an. Die Vorschau ist kostenlos.',
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
  'Size and paper': 'Größe und Papier', 'Size': 'Größe', 'Paper': 'Papier', 'Text on the print': 'Text auf dem Druck', 'Title on the print': 'Titel auf dem Druck', 'Area line': 'Bezirkszeile', 'Your line on the print (optional)': 'Deine Zeile auf dem Druck (optional)', 'The house number is never printed.': 'Die Hausnummer wird nie gedruckt.',
  'Your digital file': 'Deine digitale Datei', 'Prints cleanly at 30 x 40 cm too. Nothing is shipped, so it works anywhere.': 'Lässt sich auch sauber in 30 x 40 cm drucken. Es wird nichts verschickt, das funktioniert also überall.',
  'No address? Give a voucher.': 'Keine Adresse? Verschenke einen Gutschein.', 'Poster gift': 'Poster-Gutschein', 'Digital gift': 'Datei-Gutschein', 'Add gift to cart': 'Gutschein in den Warenkorb', 'Added. Opening your cart…': 'Hinzugefügt. Warenkorb wird geöffnet…', 'Choose a gift': 'Wähle einen Gutschein',
  'A bigger size or another paper: the recipient pays only the difference at checkout. Code and printable card by email, normally within the hour and no later than 24 hours. Valid until 31 December of the third year after purchase.': 'Größeres Format oder anderes Papier: Die beschenkte Person zahlt nur die Differenz. Code und druckbare Karte kommen per E-Mail, meist innerhalb einer Stunde, spätestens nach 24 Stunden. Gültig bis zum 31. Dezember des dritten Jahres nach dem Kauf.',
  'Secure card checkout': 'Sichere Kartenzahlung', '+ more cards': '+ weitere Karten',
  'Arrives in 3 to 5 working days in Germany, 4 to 9 elsewhere. Frame not included.': 'Kommt in Deutschland in 3 bis 5 Werktagen, anderswo in 4 bis 9. Ohne Rahmen.',
  'Made for you, so no returns for a change of mind. Faulty prints replaced free.': 'Für dich angefertigt, daher kein Widerruf. Fehlerhafte Drucke werden kostenlos ersetzt.',
  'Digital file: you keep the 14-day withdrawal right.': 'Digitale Datei: Du behältst das 14-tägige Widerrufsrecht.', 'Terms': 'Bedingungen',
  "Made by me, Yusuf, from Berlin's own aerial photos.": 'Von mir, Yusuf, aus Berlins eigenen Luftbildern gemacht.', 'What my guests say': 'Was meine Gäste sagen',
  'The story behind this print': 'Die Geschichte dahinter', 'About this digital file': 'Über diese digitale Datei',
  'Type your address and see your street from above in 1928, the way a survey plane photographed it, with the same spot today below it. Most Berlin Altbau blocks were already standing, so you can often find your own courtyard. If your house is newer, you see what stood there before it.': 'Gib deine Adresse ein und sieh deine Straße um 1928 von oben, so wie sie ein Vermessungsflugzeug fotografiert hat, und darunter dieselbe Stelle heute. Die meisten Berliner Altbauten standen schon, oft findest du sogar deinen eigenen Hinterhof. Ist dein Haus jünger, siehst du, was vorher dort stand.',
  'The print carries your street, district, map coordinates and an optional line of your own.': 'Auf dem Druck stehen Straße, Bezirk, Koordinaten und auf Wunsch eine eigene Zeile.',
  'Questions': 'Fragen', 'Something else? Write to': 'Noch etwas? Schreib an', '. I reply within a day.': '. Ich antworte innerhalb eines Tages.',
  'Which paper should I pick?': 'Welches Papier soll ich nehmen?',
  'Classic Matte (170 g) is the lightest and cheapest, Premium Matte (200 g) is smoother and whiter, Museum-Quality Matte (250 g) is archival and warm off-white. The semi-gloss papers have a soft sheen. For an old photograph I like matte best.': 'Classic Matte (170 g) ist am leichtesten und günstigsten, Premium Matte (200 g) glatter und weißer, Museum-Quality Matte (250 g) archivfest und warm-weiß. Die Semi-Gloss-Papiere glänzen leicht. Für ein altes Foto mag ich matt am liebsten.',
  'Is a frame included?': 'Ist ein Rahmen dabei?', 'No, the poster is unframed. 30 x 40 cm is a standard frame size, so a ready-made frame fits.': 'Nein, das Poster kommt ohne Rahmen. 30 x 40 cm ist ein Standardformat, ein fertiger Rahmen passt.',
  'What if the 1928 photo is blank at my spot?': 'Was, wenn das Foto von 1928 an meiner Stelle leer ist?', "The 1928 survey did not cover every corner of today's Berlin. The preview shows exactly what I print: if the top photo is blank, pick a place nearby.": 'Die Befliegung von 1928 deckte nicht jede Ecke des heutigen Berlins ab. Die Vorschau zeigt genau, was ich drucke. Ist das obere Foto leer, wähle einen Ort in der Nähe.',
  'Can I change the text after I order?': 'Kann ich den Text nach der Bestellung ändern?', 'Yes, until it goes to print. Write to me with your order number and the new text.': 'Ja, bis es in den Druck geht. Schreib mir deine Bestellnummer und den neuen Text.',
  'Where do you deliver, and how long does it take?': 'Wohin lieferst du, und wie lange dauert es?', 'Can I return it?': 'Kann ich es zurückgeben?',
  'The poster is made for you, so there are no returns for a change of mind. If it arrives misprinted or damaged, I reprint it free. The digital file keeps the 14-day withdrawal right.': 'Das Poster wird für dich angefertigt, daher gibt es keinen Widerruf. Kommt es fehlerhaft oder beschädigt an, drucke ich es kostenlos neu. Für die digitale Datei gilt das 14-tägige Widerrufsrecht.',
  'Delivery & returns': 'Versand und Rückgabe',
  'Digital file: made from your spot and sent by email within 24 hours, nothing is shipped.': 'Digitale Datei: wird für deinen Ort erstellt und innerhalb von 24 Stunden per E-Mail geschickt, es wird nichts verschickt.',
  'The Store Terms and the Withdrawal notices are linked on this page.': 'Die Shop-Bedingungen und Widerrufshinweise sind auf dieser Seite verlinkt (auf Englisch).',
  'Withdrawal notice, terms and legal information': 'Widerruf, Bedingungen und Rechtliches (auf Englisch)',
}));
TEXT.set('The poster ships free to Germany, the other EU countries, the UK and the US: usually 3 to 5 working days to Germany, 4 to 7 to most of the EU, the UK and the US, and 6 to 9 to Bulgaria, Estonia, Finland, Greece, Ireland, Latvia, Lithuania, Portugal and Romania. Checkout shows the time for your country. The digital file comes by email within 24 hours, anywhere.', 'Das Poster wird kostenlos nach Deutschland, in die übrige EU, nach UK und in die USA geschickt: meist 3 bis 5 Werktage nach Deutschland, 4 bis 7 in die meisten EU-Länder, nach UK und in die USA, 6 bis 9 nach Bulgarien, Estland, Finnland, Griechenland, Irland, Lettland, Litauen, Portugal und Rumänien. An der Kasse siehst du die Zeit für dein Land. Die digitale Datei kommt überallhin innerhalb von 24 Stunden per E-Mail.');
TEXT.set('Printed poster: made to order from your address and printed for you. Free delivery to Germany (usually 3 to 5 working days), most of the EU, the United Kingdom and the United States (4 to 7), and Bulgaria, Estonia, Finland, Greece, Ireland, Latvia, Lithuania, Portugal and Romania (6 to 9).', 'Gedrucktes Poster: wird nach deiner Adresse für dich angefertigt. Kostenloser Versand nach Deutschland (meist 3 bis 5 Werktage), in die meisten EU-Länder, nach UK und in die USA (4 bis 7) sowie nach Bulgarien, Estland, Finnland, Griechenland, Irland, Lettland, Litauen, Portugal und Rumänien (6 bis 9).');
const PATTERNS = [
  [/^Cart \((\d+)\)$/, 'Warenkorb ($1)'], [/^Add to cart · (.+)$/, 'In den Warenkorb · $1'], [/^Yes, add to cart · (.+)$/, 'Ja, in den Warenkorb · $1'],
  [/^Example poster, (.+)\. Search an address to see your street\.$/, 'Beispielposter, $1. Suche eine Adresse, um deine Straße zu sehen.'],
  [/^Example file\. Search an address to see your street\.$/, 'Beispieldatei. Suche eine Adresse, um deine Straße zu sehen.'],
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
  'e.g. Potsdamer Platz': 'z. B. Potsdamer Platz', 'you@example.com': 'E-Mail-Adresse', 'Address or place in Berlin': 'Adresse oder Ort in Berlin',
  'Why you can buy with confidence': 'Darauf kannst du dich verlassen', 'Example print: Potsdamer Platz in 1928 and today': 'Beispieldruck: Potsdamer Platz um 1928 und heute',
  'Aerial photograph of your spot in 1928, with a cross on your building': 'Luftbild deiner Stelle um 1928, mit einem Kreuz auf deinem Gebäude',
  'Aerial photograph of the same spot today, same ground and scale, with a cross on the same spot': 'Luftbild derselben Stelle heute, gleicher Ausschnitt und Maßstab, mit einem Kreuz an derselben Stelle',
  'Withdrawal notice and terms': 'Widerruf und Bedingungen',
}));
const translate = value => {
  const key = value.replace(/\s+/g, ' ').trim();
  if (!key) return null;
  if (TEXT.has(key)) return value.replace(value.trim(), TEXT.get(key));
  for (const [pattern, to] of PATTERNS) if (pattern.test(key)) return value.replace(value.trim(), key.replace(pattern, to));
  return null;
};
const skip = node => ['STYLE', 'SCRIPT', 'TEXTAREA', 'OPTION'].includes(node.parentElement?.tagName);
function sweep(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (skip(node)) continue;
    const next = translate(node.nodeValue);
    if (next && next !== node.nodeValue) node.nodeValue = next;
  }
  root.querySelectorAll('[placeholder],[aria-label],[alt],[title]').forEach(element => {
    for (const name of ['placeholder', 'aria-label', 'alt', 'title']) {
      const next = ATTRS.get(element.getAttribute(name));
      if (next) element.setAttribute(name, next);
    }
  });
}
function start() {
  if (!decodeURIComponent(location.pathname).startsWith(PRODUCT_PATH)) return;
  const host = document.querySelector('bw-storefront');
  if (!host?.shadowRoot) { setTimeout(start, 200); return; }
  host.lang = 'de';
  document.title = 'Deine Berliner Straße um 1928 | Walk of Berlin';
  const run = () => sweep(host.shadowRoot);   // translated text matches nothing, so its own mutations end here
  new MutationObserver(run).observe(host.shadowRoot, { subtree: true, childList: true, characterData: true });
  run();
}
start();
