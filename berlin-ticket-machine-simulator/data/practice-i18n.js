/* Machine-screen translations. Fares remain exclusively in fares.js. */
(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.BTM_PRACTICE_I18N = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  return {
    en: {
      label: 'English', ticketsLabel: 'Tickets', transport: 'public transport', changeLanguage: 'Change language',
      scope: 'Your choice changes the machine screens. The guide beside the machine and Challenge stay in English.',
      startEyebrow: 'BVG / VBB Ticket Machine', startTitle: 'Touch the screen to begin',
      startHelp: 'Tap to wake the screen. A real machine may show an advert while idle.', start: 'Touch to start',
      languageStep: 'Step 1 · Choose language', languageTitle: 'Choose the machine language',
      ticketsStep: 'Step 2 · Choose your ticket', confirmStep: 'Step 3 · Confirm',
      back: 'Back', pay: 'Pay', paymentStep: 'Step 4 · Payment', paymentTitle: 'How do you want to pay?',
      cash: 'Cash / coins', card: 'Card / phone', print: 'Print ticket',
      paymentHelp: 'Practise choosing cash or card. This simulator takes no payment and does not issue a travel ticket.',
      cashHelp: 'Coins from 5 cents to 2 euros and notes of 5, 10 or 20 euros. Change is limited. On the real machine, insert money after confirming your ticket.',
      cardHelp: 'Insert or tap your girocard, Visa or Mastercard, or use a supported phone wallet. Enter your PIN if asked. Available methods can vary by machine.',
      doneStep: 'Done · One last thing', validateTitle: 'Validate before you board',
      validateHelp: 'If your paper ticket is not already validated, stamp it before boarding. Look for the small yellow or red validator on the platform marked “Bitte hier entwerten”.',
      stamp: 'Stamp it', restart: 'Start over', validated: 'VALIDATED',
      stampedTitle: 'Validated. Now you can board.',
      stampedHelp: 'The stamp prints the date, time and station. The ticket’s validity has now started. On a real platform, look for the validator on a pole or wall near the stairs, before you enter the train.',
      cashSlot: 'Coin & note slot', cashSlotHelp: '5c–2€ coins, 5/10/20€ notes. Change is limited.',
      cardSlot: 'Card reader', cardSlotHelp: 'Insert or tap; enter your PIN if asked.',
      tickets: {
        kurz: { name: 'Short-trip ticket', pick: '3 U-/S-Bahn stops or 6 bus/tram stops.', summary: 'Up to 3 U-/S-Bahn stops with changes, or 6 bus/tram stops without changing. No return or round trip. Reduced fare (children 6–14): {reduced} €.' },
        single_ab: { name: 'Single ticket AB', pick: 'One normal trip inside the city.', summary: 'One journey in one direction across zones A and B, valid for 120 minutes with changes. No return or round trip. Reduced fare (children 6–14): {reduced} €.' },
        single_abc: { name: 'Single ticket ABC', pick: 'One trip to or from BER airport or Potsdam.', summary: 'One journey in zones A, B and C, including BER airport and Potsdam. Valid for 120 minutes in one direction, with changes; no return or round trip. Reduced fare (children 6–14): {reduced} €.' },
        day_ab: { name: '24-hour ticket AB', pick: 'A full day of city sightseeing.', summary: 'Unlimited trips in zones A and B for 24 hours from validation. Covers one adult and up to three children aged 6–14. Reduced fare: {reduced} €.' },
        day_abc: { name: '24-hour ticket ABC', pick: 'A day of travel including BER airport or Potsdam.', summary: 'Unlimited trips in zones A, B and C for 24 hours from validation, including BER airport and Potsdam. Covers one adult and up to three children aged 6–14. Reduced fare: {reduced} €.' }
      }
    },
    de: {
      label: 'Deutsch', ticketsLabel: 'Fahrscheine', transport: 'öffentlicher Nahverkehr', changeLanguage: 'Sprache ändern',
      scope: 'Die Auswahl ändert die Sprache der Automatenbildschirme. Der Ratgeber neben dem Automaten und die Challenge bleiben auf Englisch.',
      startEyebrow: 'BVG / VBB Fahrkartenautomat', startTitle: 'Zum Starten den Bildschirm berühren',
      startHelp: 'Tippen Sie auf den Bildschirm. Ein echter Automat zeigt im Ruhezustand möglicherweise Werbung.', start: 'Zum Starten berühren',
      languageStep: 'Schritt 1 · Sprache wählen', languageTitle: 'Sprache des Automaten wählen',
      ticketsStep: 'Schritt 2 · Fahrkarte wählen', confirmStep: 'Schritt 3 · Bestätigen',
      back: 'Zurück', pay: 'Bezahlen', paymentStep: 'Schritt 4 · Bezahlung', paymentTitle: 'Wie möchten Sie bezahlen?',
      cash: 'Bargeld / Münzen', card: 'Karte / Smartphone', print: 'Fahrkarte drucken',
      paymentHelp: 'Üben Sie die Auswahl zwischen Bargeld und Karte. Dieser Simulator nimmt keine Zahlung entgegen und stellt keine gültige Fahrkarte aus.',
      cashHelp: 'Münzen von 5 Cent bis 2 Euro sowie Scheine zu 5, 10 oder 20 Euro. Wechselgeld ist begrenzt. Am echten Automaten werfen Sie das Geld nach der Bestätigung Ihrer Fahrkarte ein.',
      cardHelp: 'Stecken Sie Ihre girocard, Visa oder Mastercard ein oder halten Sie die Karte beziehungsweise ein unterstütztes Smartphone an das Lesegerät. Geben Sie bei Aufforderung die PIN ein. Die verfügbaren Zahlungsarten können je nach Automat abweichen.',
      doneStep: 'Fertig · Noch ein Schritt', validateTitle: 'Vor der Fahrt entwerten',
      validateHelp: 'Falls Ihre Papierfahrkarte noch nicht entwertet ist, stempeln Sie sie vor dem Einsteigen ab. Suchen Sie auf dem Bahnsteig nach dem kleinen gelben oder roten Entwerter mit der Aufschrift „Bitte hier entwerten“.',
      stamp: 'Entwerten', restart: 'Neu beginnen', validated: 'ENTWERTET',
      stampedTitle: 'Entwertet. Jetzt können Sie einsteigen.',
      stampedHelp: 'Der Stempel druckt Datum, Uhrzeit und Station auf die Fahrkarte. Die Gültigkeitsdauer hat jetzt begonnen. Auf dem echten Bahnsteig finden Sie den Entwerter an einer Säule oder Wand nahe der Treppe, bevor Sie in den Zug steigen.',
      cashSlot: 'Münz- und Scheineinwurf', cashSlotHelp: 'Münzen: 5 Cent–2 Euro. Scheine: 5/10/20 Euro. Wechselgeld ist begrenzt.',
      cardSlot: 'Kartenlesegerät', cardSlotHelp: 'Einstecken oder kontaktlos auflegen; bei Aufforderung PIN eingeben.',
      tickets: {
        kurz: { name: 'Kurzstrecke', pick: '3 U-/S-Bahn-Stationen oder 6 Bus-/Tram-Haltestellen.', summary: 'Bis zu 3 Stationen mit U-/S-Bahn mit Umsteigen oder 6 Haltestellen mit Bus/Tram ohne Umsteigen. Keine Rück- oder Rundfahrt. Ermäßigt (Kinder 6–14): {reduced} €.' },
        single_ab: { name: 'Einzelfahrausweis AB', pick: 'Eine normale Fahrt innerhalb Berlins.', summary: 'Eine Fahrt in eine Richtung in den Tarifbereichen A und B, 120 Minuten gültig; Umsteigen ist erlaubt. Keine Rück- oder Rundfahrt. Ermäßigt (Kinder 6–14): {reduced} €.' },
        single_abc: { name: 'Einzelfahrausweis ABC', pick: 'Eine Fahrt zum oder vom Flughafen BER oder nach Potsdam.', summary: 'Eine Fahrt in den Tarifbereichen A, B und C, einschließlich Flughafen BER und Potsdam. 120 Minuten in eine Richtung gültig; Umsteigen ist erlaubt. Keine Rück- oder Rundfahrt. Ermäßigt (Kinder 6–14): {reduced} €.' },
        day_ab: { name: '24-Stunden-Karte AB', pick: 'Ein ganzer Tag mit Fahrten innerhalb Berlins.', summary: 'Beliebig viele Fahrten in den Tarifbereichen A und B für 24 Stunden ab Entwertung. Gilt für einen Erwachsenen und bis zu drei Kinder von 6 bis 14 Jahren. Ermäßigt: {reduced} €.' },
        day_abc: { name: '24-Stunden-Karte ABC', pick: 'Ein Reisetag einschließlich Flughafen BER oder Potsdam.', summary: 'Beliebig viele Fahrten in den Tarifbereichen A, B und C für 24 Stunden ab Entwertung, einschließlich Flughafen BER und Potsdam. Gilt für einen Erwachsenen und bis zu drei Kinder von 6 bis 14 Jahren. Ermäßigt: {reduced} €.' }
      }
    },
    fr: {
      label: 'Français', ticketsLabel: 'Billets', transport: 'transports en commun', changeLanguage: 'Changer de langue',
      scope: 'Votre choix change la langue des écrans du distributeur. Le guide à côté du distributeur et le défi restent en anglais.',
      startEyebrow: 'Distributeur de billets BVG / VBB', startTitle: 'Touchez l’écran pour commencer',
      startHelp: 'Touchez l’écran pour le réveiller. Un vrai distributeur peut afficher une publicité lorsqu’il est en veille.', start: 'Touchez pour commencer',
      languageStep: 'Étape 1 · Choisir la langue', languageTitle: 'Choisissez la langue du distributeur',
      ticketsStep: 'Étape 2 · Choisir votre billet', confirmStep: 'Étape 3 · Confirmer',
      back: 'Retour', pay: 'Payer', paymentStep: 'Étape 4 · Paiement', paymentTitle: 'Comment souhaitez-vous payer ?',
      cash: 'Espèces / pièces', card: 'Carte / téléphone', print: 'Imprimer le billet',
      paymentHelp: 'Entraînez-vous à choisir entre espèces et carte. Ce simulateur ne prélève aucun paiement et ne délivre pas de titre de transport valable.',
      cashHelp: 'Pièces de 5 centimes à 2 euros et billets de 5, 10 ou 20 euros. La monnaie disponible est limitée. Sur le vrai distributeur, insérez l’argent après avoir confirmé votre billet.',
      cardHelp: 'Insérez ou approchez votre girocard, Visa ou Mastercard, ou utilisez un portefeuille mobile compatible. Saisissez votre code PIN si demandé. Les moyens de paiement peuvent varier selon le distributeur.',
      doneStep: 'Terminé · Une dernière étape', validateTitle: 'Validez avant de monter',
      validateHelp: 'Si votre billet papier n’est pas déjà validé, compostez-le avant de monter. Cherchez le petit composteur jaune ou rouge sur le quai, portant la mention « Bitte hier entwerten ».',
      stamp: 'Composter', restart: 'Recommencer', validated: 'VALIDÉ',
      stampedTitle: 'Billet validé. Vous pouvez monter.',
      stampedHelp: 'Le composteur imprime la date, l’heure et la station. La durée de validité commence maintenant. Sur un vrai quai, cherchez le composteur sur un poteau ou un mur près des escaliers, avant de monter dans le train.',
      cashSlot: 'Fente pour pièces et billets', cashSlotHelp: 'Pièces : 5 c–2 €. Billets : 5/10/20 €. Monnaie limitée.',
      cardSlot: 'Lecteur de carte', cardSlotHelp: 'Insérez ou approchez la carte ; saisissez le code PIN si demandé.',
      tickets: {
        kurz: { name: 'Billet court trajet', pick: '3 arrêts de U-Bahn/S-Bahn ou 6 arrêts de bus/tram.', summary: 'Jusqu’à 3 arrêts de U-Bahn/S-Bahn avec correspondances, ou 6 arrêts de bus/tram sans correspondance. Ni retour ni trajet circulaire. Tarif réduit (enfants de 6 à 14 ans) : {reduced} €.' },
        single_ab: { name: 'Billet simple AB', pick: 'Un trajet normal dans Berlin.', summary: 'Un trajet dans un seul sens dans les zones A et B, valable 120 minutes avec correspondances. Ni retour ni trajet circulaire. Tarif réduit (enfants de 6 à 14 ans) : {reduced} €.' },
        single_abc: { name: 'Billet simple ABC', pick: 'Un trajet vers ou depuis l’aéroport BER ou Potsdam.', summary: 'Un trajet dans les zones A, B et C, y compris l’aéroport BER et Potsdam. Valable 120 minutes dans un seul sens, avec correspondances ; ni retour ni trajet circulaire. Tarif réduit (enfants de 6 à 14 ans) : {reduced} €.' },
        day_ab: { name: 'Billet 24 heures AB', pick: 'Une journée de visites dans Berlin.', summary: 'Trajets illimités dans les zones A et B pendant 24 heures à compter de la validation. Couvre un adulte et jusqu’à trois enfants de 6 à 14 ans. Tarif réduit : {reduced} €.' },
        day_abc: { name: 'Billet 24 heures ABC', pick: 'Une journée incluant l’aéroport BER ou Potsdam.', summary: 'Trajets illimités dans les zones A, B et C pendant 24 heures à compter de la validation, y compris l’aéroport BER et Potsdam. Couvre un adulte et jusqu’à trois enfants de 6 à 14 ans. Tarif réduit : {reduced} €.' }
      }
    },
    tr: {
      label: 'Türkçe', ticketsLabel: 'Biletler', transport: 'toplu taşıma', changeLanguage: 'Dili değiştir',
      scope: 'Seçiminiz bilet makinesinin ekran dilini değiştirir. Makinenin yanındaki rehber ve Challenge bölümü İngilizce kalır.',
      startEyebrow: 'BVG / VBB Bilet Makinesi', startTitle: 'Başlamak için ekrana dokunun',
      startHelp: 'Ekranı uyandırmak için dokunun. Gerçek makine bekleme sırasında reklam gösterebilir.', start: 'Başlamak için dokunun',
      languageStep: 'Adım 1 · Dil seçin', languageTitle: 'Bilet makinesinin dilini seçin',
      ticketsStep: 'Adım 2 · Biletinizi seçin', confirmStep: 'Adım 3 · Onaylayın',
      back: 'Geri', pay: 'Öde', paymentStep: 'Adım 4 · Ödeme', paymentTitle: 'Nasıl ödemek istersiniz?',
      cash: 'Nakit / bozuk para', card: 'Kart / telefon', print: 'Bileti yazdır',
      paymentHelp: 'Nakit veya kart seçimini deneyin. Bu simülatör ödeme almaz ve yolculukta geçerli bir bilet vermez.',
      cashHelp: '5 sent–2 avro madeni para ve 5, 10 veya 20 avroluk banknotlar. Para üstü sınırlıdır. Gerçek makinede bileti onayladıktan sonra parayı yerleştirin.',
      cardHelp: 'girocard, Visa veya Mastercard kartınızı takın ya da temassız okutun; desteklenen telefon cüzdanını da kullanabilirsiniz. İstenirse PIN kodunuzu girin. Ödeme yöntemleri makineye göre değişebilir.',
      doneStep: 'Tamam · Son bir adım', validateTitle: 'Binmeden önce damgalayın',
      validateHelp: 'Kâğıt biletiniz henüz onaylanmamışsa binmeden önce damgalayın. Peronda “Bitte hier entwerten” yazan küçük sarı veya kırmızı damgalama kutusunu bulun.',
      stamp: 'Damgala', restart: 'Baştan başla', validated: 'ONAYLANDI',
      stampedTitle: 'Onaylandı. Artık binebilirsiniz.',
      stampedHelp: 'Damga bilete tarih, saat ve istasyon bilgisini basar. Biletin geçerlilik süresi şimdi başladı. Gerçek peronda damgalama kutusunu trene binmeden önce, merdiven yakınındaki direk veya duvarda arayın.',
      cashSlot: 'Madeni para ve banknot girişi', cashSlotHelp: 'Madeni para: 5 sent–2 avro. Banknot: 5/10/20 avro. Para üstü sınırlı.',
      cardSlot: 'Kart okuyucu', cardSlotHelp: 'Takın veya temassız okutun; istenirse PIN girin.',
      tickets: {
        kurz: { name: 'Kısa mesafe bileti', pick: 'U-/S-Bahn ile 3, otobüs/tramvay ile 6 durak.', summary: 'U-/S-Bahn ile aktarmalı en fazla 3 durak veya otobüs/tramvay ile aktarmasız en fazla 6 durak. Dönüş ve dairesel yolculuk yapılamaz. İndirimli ücret (6–14 yaş): {reduced} €.' },
        single_ab: { name: 'Tek yön bilet AB', pick: 'Berlin içinde normal bir yolculuk.', summary: 'A ve B bölgelerinde tek yönde bir yolculuk; aktarmalarla birlikte 120 dakika geçerli. Dönüş ve dairesel yolculuk yapılamaz. İndirimli ücret (6–14 yaş): {reduced} €.' },
        single_abc: { name: 'Tek yön bilet ABC', pick: 'BER Havalimanı veya Potsdam’a gidiş ya da dönüş.', summary: 'BER Havalimanı ve Potsdam dahil A, B ve C bölgelerinde bir yolculuk. Aktarmalı, tek yönde 120 dakika geçerli; dönüş ve dairesel yolculuk yapılamaz. İndirimli ücret (6–14 yaş): {reduced} €.' },
        day_ab: { name: '24 saatlik bilet AB', pick: 'Berlin içinde gün boyu gezi.', summary: 'Damgalamadan itibaren 24 saat boyunca A ve B bölgelerinde sınırsız yolculuk. Bir yetişkin ile 6–14 yaş arası en fazla üç çocuğu kapsar. İndirimli ücret: {reduced} €.' },
        day_abc: { name: '24 saatlik bilet ABC', pick: 'BER Havalimanı veya Potsdam dahil bir günlük gezi.', summary: 'Damgalamadan itibaren 24 saat boyunca BER Havalimanı ve Potsdam dahil A, B ve C bölgelerinde sınırsız yolculuk. Bir yetişkin ile 6–14 yaş arası en fazla üç çocuğu kapsar. İndirimli ücret: {reduced} €.' }
      }
    },
    es: {
      label: 'Español', ticketsLabel: 'Billetes', transport: 'transporte público', changeLanguage: 'Cambiar idioma',
      scope: 'Tu elección cambia el idioma de las pantallas de la máquina. La guía junto a la máquina y el reto siguen en inglés.',
      startEyebrow: 'Máquina de billetes BVG / VBB', startTitle: 'Toca la pantalla para empezar',
      startHelp: 'Toca la pantalla para activarla. Una máquina real puede mostrar publicidad mientras está en reposo.', start: 'Toca para empezar',
      languageStep: 'Paso 1 · Elige el idioma', languageTitle: 'Elige el idioma de la máquina',
      ticketsStep: 'Paso 2 · Elige tu billete', confirmStep: 'Paso 3 · Confirma',
      back: 'Atrás', pay: 'Pagar', paymentStep: 'Paso 4 · Pago', paymentTitle: '¿Cómo quieres pagar?',
      cash: 'Efectivo / monedas', card: 'Tarjeta / teléfono', print: 'Imprimir billete',
      paymentHelp: 'Practica la elección entre efectivo y tarjeta. Este simulador no cobra ni emite un billete válido para viajar.',
      cashHelp: 'Monedas de 5 céntimos a 2 euros y billetes de 5, 10 o 20 euros. El cambio es limitado. En la máquina real, introduce el dinero después de confirmar el billete.',
      cardHelp: 'Introduce o acerca tu girocard, Visa o Mastercard, o usa una cartera móvil compatible. Introduce el PIN si se solicita. Los métodos disponibles pueden variar según la máquina.',
      doneStep: 'Listo · Un último paso', validateTitle: 'Valida antes de subir',
      validateHelp: 'Si tu billete de papel aún no está validado, séllalo antes de subir. Busca la pequeña validadora amarilla o roja del andén con el texto «Bitte hier entwerten».',
      stamp: 'Validar', restart: 'Empezar de nuevo', validated: 'VALIDADO',
      stampedTitle: 'Validado. Ya puedes subir.',
      stampedHelp: 'El sello imprime la fecha, la hora y la estación. El periodo de validez acaba de empezar. En un andén real, busca la validadora en un poste o una pared cerca de las escaleras, antes de subir al tren.',
      cashSlot: 'Ranura para monedas y billetes', cashSlotHelp: 'Monedas: 5 c–2 €. Billetes: 5/10/20 €. Cambio limitado.',
      cardSlot: 'Lector de tarjetas', cardSlotHelp: 'Introduce o acerca la tarjeta; escribe el PIN si se solicita.',
      tickets: {
        kurz: { name: 'Billete de trayecto corto', pick: '3 paradas de U-/S-Bahn o 6 de autobús/tranvía.', summary: 'Hasta 3 paradas de U-/S-Bahn con transbordos, o 6 de autobús/tranvía sin transbordos. No permite volver ni hacer un recorrido circular. Tarifa reducida (niños de 6–14 años): {reduced} €.' },
        single_ab: { name: 'Billete sencillo AB', pick: 'Un trayecto normal dentro de Berlín.', summary: 'Un viaje en una sola dirección por las zonas A y B, válido durante 120 minutos con transbordos. No permite volver ni hacer un recorrido circular. Tarifa reducida (niños de 6–14 años): {reduced} €.' },
        single_abc: { name: 'Billete sencillo ABC', pick: 'Un trayecto hacia o desde el aeropuerto BER o Potsdam.', summary: 'Un viaje por las zonas A, B y C, incluidos el aeropuerto BER y Potsdam. Válido durante 120 minutos en una sola dirección, con transbordos; no permite volver ni hacer un recorrido circular. Tarifa reducida (niños de 6–14 años): {reduced} €.' },
        day_ab: { name: 'Billete de 24 horas AB', pick: 'Un día completo de visitas por Berlín.', summary: 'Viajes ilimitados por las zonas A y B durante 24 horas desde la validación. Cubre a un adulto y hasta tres niños de 6–14 años. Tarifa reducida: {reduced} €.' },
        day_abc: { name: 'Billete de 24 horas ABC', pick: 'Un día de viajes que incluye el aeropuerto BER o Potsdam.', summary: 'Viajes ilimitados por las zonas A, B y C durante 24 horas desde la validación, incluidos el aeropuerto BER y Potsdam. Cubre a un adulto y hasta tres niños de 6–14 años. Tarifa reducida: {reduced} €.' }
      }
    }
  };
});
