/* Berlin House History Finder: which record covers which year.
   Facts checked on 8 November 2026 against the ZLB digital collection pages,
   the Berlin service portal (Bauaktenarchiv), the Landesarchiv Berlin
   Bauaktenkartei page, Berlin Open Data (aerial photographs) and
   stolpersteine-berlin.de. */
window.HOUSE_HISTORY = {
  minYear: 1799,
  maxYear: 2026,
  lanes: [
    {
      id: 'books',
      label: 'Address books',
      color: '#1B5E20',
      spans: [[1799, 1821, 'thin'], [1822, 1943, 'full']],
      title: 'Berlin address books (ZLB, free online)',
      finds: 'Many years have a street section: under your street and house number, the owner, the property manager and every registered tenant, usually with a job title.',
      where: 'Digitale Landesbibliothek Berlin, collection "Berliner Adressbuecher". Before 1822 the volumes are irregular; from 1822 there is one a year until 1943.',
      access: 'Free, no account',
      move: 'Open the street section of one year, find your house number, then step back ten years at a time. The year your house first appears is close to the year it was finished.'
    },
    {
      id: 'westbook',
      label: 'West directory',
      color: '#5b8f3a',
      spans: [[1957, 1970, 'thin']],
      title: 'Berliner Stadtadressbuch (West Berlin only)',
      finds: 'The same idea as the old address books, with a street part, but printed only in some years and only for the western half of the city.',
      where: 'ZLB digital collection, same address book section. The digitised run ends in 1970.',
      access: 'Free, no account',
      move: 'Use it to bridge the gap after 1943 if your building is in the former West. Check which years exist before you plan around one.'
    },
    {
      id: 'phone',
      label: 'Phone books',
      color: '#8a7a3c',
      spans: [[1954, 1991, 'full']],
      title: 'Telephone directories (ZLB, free online)',
      finds: 'Names with an address, but only for people who had a phone line. West Berlin runs 1954 to 1991, East Berlin 1955 to 1989.',
      where: 'Digitale Landesbibliothek Berlin, telephone directories for Berlin-West and Berlin-Ost.',
      access: 'Free, no account',
      move: 'Search by name when you already know one, not by street. In East Berlin few private flats had a phone, so silence there proves nothing.'
    },
    {
      id: 'aerial',
      label: 'Aerial photos',
      color: '#3f6f9c',
      points: [1928, 1938, 1953, 1954],
      partial: [1959, 1969, 1989, 1992, 1995, 1997, 1998],
      spans: [[2004, 2026, 'thin']],
      title: 'Aerial photographs (Geoportal Berlin, free)',
      finds: 'Your block from above: which wings and back houses stood, which gaps came later, what the courtyard held. The 1928 set covers almost the whole city.',
      where: 'Geoportal Berlin (FIS-Broker) layers for 1928, around 1938, 1953 and 1954, more flights between 1959 and 1998 (some only for parts of the city), and a run of digital colour photos since 2004.',
      access: 'Free, open licence',
      move: 'Put the 1928 photo next to today\'s and count the wings around your courtyard. A missing side wing is often a war gap.'
    },
    {
      id: 'files',
      label: 'Building files',
      color: '#a3462e',
      spans: [[1799, 2026, 'full']],
      title: 'Building files at the district office (Bauakten)',
      finds: 'Plans, sections, facade drawings and permits from the first application onward: who built the house, when, and every later conversion.',
      where: 'The Bauaktenarchiv of your district\'s building authority (Bau- und Wohnungsaufsicht). Book an appointment first.',
      access: 'From EUR 36, about EUR 25 per file',
      move: 'This is the one record that dates the building itself. Ask your Hausverwaltung first: they often hold copies and can sign the authority you need.'
    },
    {
      id: 'lab',
      label: 'Landesarchiv',
      color: '#7d3f8c',
      spans: [[1799, 2001, 'full']],
      title: 'Building files of demolished houses (Landesarchiv Berlin)',
      finds: 'About 120,000 files, mostly for buildings that no longer exist, the oldest from around 1750. The card index is online, sorted by street and house number.',
      where: 'Landesarchiv Berlin, digitised Bauaktenkartei. Order a file by email and read it in the reading room.',
      access: 'Free to read, copies cost extra',
      move: 'Search the card under the street name that was valid back then. Many streets were renamed or renumbered.'
    },
    {
      id: 'stones',
      label: 'Stolpersteine',
      color: '#b08a1e',
      spans: [[1933, 1945, 'full']],
      title: 'Stolpersteine database',
      finds: 'People who lived at an address and were persecuted by the Nazi regime, often with a short biography. Searchable by street and district.',
      where: 'stolpersteine-berlin.de, run by the Koordinierungsstelle Stolpersteine Berlin.',
      access: 'Free',
      move: 'Search your street before you search your house. The stones in front of a building only mark the people someone has already researched.'
    }
  ]
};
