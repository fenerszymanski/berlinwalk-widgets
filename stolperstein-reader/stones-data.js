/*
 * Stolperstein Reader — inscription data.
 * All three inscriptions are transcribed verbatim from the stone photographs
 * on the official Berlin database (stolpersteine-berlin.de):
 *   Lina Friedemann      https://www.stolpersteine-berlin.de/biografie/2013
 *   Anita Bukofzer       https://www.stolpersteine-berlin.de/biografie/82
 *   Hertha Witkowski     https://www.stolpersteine-berlin.de/biografie/5186
 * Do not edit inscription lines without re-checking the photos.
 */
window.__SR_STONES__ = [
  {
    tabLabel: 'LINA FRIEDEMANN',
    tabSub: 'Kreuzberg · Berlin’s first stone',
    lines: [
      { de: 'HIER WOHNTE', en: 'Here lived',
        why: 'Almost every stone opens this way. It ties the person to the exact door you are standing at: not a symbol, an address. <b>This was her home.</b> Variants exist for schools and workplaces (HIER LERNTE, HIER ARBEITETE), but on a normal street it is HIER WOHNTE.' },
      { de: 'LINA FRIEDEMANN', en: 'The name', name: true,
        why: 'The name is the whole point of the project. Lina Friedemann trained as a housekeeper, came to Berlin in 1891 and raised her nephew in Kreuzberg. Her stone at Oranienstraße 158 was <b>the first one laid in Berlin</b>, on 2 May 1996, before the city had even approved the project.' },
      { de: 'JG. 1875', en: 'Jahrgang: born in 1875',
        why: 'JG. is short for <b>Jahrgang</b>, the year of birth. The stones use it instead of GEBOREN partly to save space: every letter is stamped by hand into a 96 mm plate, so the formula is compact by design.' },
      { de: 'DEPORTIERT', en: 'Deported',
        why: 'The fate lines start here. On Berlin stones DEPORTIERT is usually followed by a date and a destination, and each of those was a real train from a real Berlin station.' },
      { de: 'AM 15.8.1942', en: 'On 15 August 1942',
        why: 'The exact date matters. German records of the deportations survived, so most stones can name the day a life in Berlin ended. Lina was 66 years old.' },
      { de: 'NACH RIGA', en: 'To Riga',
        why: 'The destination. Riga, Minsk, Łódź, Theresienstadt, Auschwitz: the place names on stones map the deportation system. Lina Friedemann was murdered in Riga three days after this train left Berlin. Early stones like hers often end with the deportation line; newer stones usually add the fate explicitly.' },
    ],
    closing: 'That is the full stone. Six short lines, and you can now read every early Berlin stone you pass.',
  },
  {
    tabLabel: 'ANITA BUKOFZER',
    tabSub: 'Mitte · Hackesche Höfe',
    lines: [
      { de: 'HIER WOHNTE', en: 'Here lived',
        why: 'This stone lies at Rosenthaler Straße 40/41, the address of the Hackesche Höfe. Thousands of people walk over it every day on their way into the courtyards. That placement is deliberate: the memorial sits exactly where life happens.' },
      { de: 'ANITA BUKOFZER', en: 'The name', name: true,
        why: 'Anita was a child. She lived here with her parents Hermann and Margarete in a three-room flat. One stone always stands for <b>one person</b>, which is why families appear as rows of stones side by side.' },
      { de: 'JG. 1930', en: 'Born in 1930',
        why: 'Do the arithmetic against the date below and the stone tells you she was twelve. The stones never say “child”; they let the two numbers say it.' },
      { de: 'DEPORTIERT 1943', en: 'Deported in 1943',
        why: 'On 12 January 1943 the whole family was put on the so-called 26th Osttransport from Berlin. When the exact day is not stamped, the year still anchors the event.' },
      { de: 'ERMORDET IN', en: 'Murdered in',
        why: 'The project uses plain words on purpose. Not “perished”, not “died”: <b>ERMORDET, murdered</b>. The language refuses the soft version of what happened.' },
      { de: 'AUSCHWITZ', en: 'Auschwitz',
        why: 'The final line is the place. Anita Bukofzer was murdered in Auschwitz with her family, a few weeks short of her thirteenth birthday. Her stone was laid in June 2004, and the foot traffic of the Hackesche Höfe has been polishing it ever since.' },
    ],
    closing: 'Next time you walk into the Hackesche Höfe, you will know whose doorstep it is.',
  },
  {
    tabLabel: 'HERTHA WITKOWSKI',
    tabSub: 'Moabit · a different fate line',
    lines: [
      { de: 'HIER WOHNTE', en: 'Here lived',
        why: 'Jagowstraße 44, Moabit. A quiet residential street, which is where most of Berlin’s more than 11,000 stones actually are: not at the famous sights, but in front of ordinary front doors.' },
      { de: 'HERTHA WITKOWSKI', en: 'The name', name: true,
        why: 'Hertha Witkowski was born in Kolberg in 1886 and lived in Moabit. Her stone was laid in November 2013, seventy years after her death, because a stone only exists once someone researches a life and sponsors it.' },
      { de: 'GEB. REPPEN', en: 'Née Reppen',
        why: 'GEB. is short for <b>geborene</b>, the birth name. It is there so the person can be found in records under both names. When you see GEB. on a stone, you are looking at a married woman’s two identities held together.' },
      { de: 'JG. 1886', en: 'Born in 1886',
        why: 'Jahrgang again: the same compact formula on every stone, which is exactly why learning it once works everywhere, from Berlin to the 30 other countries the project has reached.' },
      { de: 'GEDEMÜTIGT / ENTRECHTET', en: 'Humiliated / stripped of rights',
        why: 'Some stones name what happened <b>before</b> the end: years of humiliation and the legal removal of rights. These two words compress a decade of escalating persecution into one stamped line.' },
      { de: 'FLUCHT IN DEN TOD', en: 'Fled into death',
        why: 'This is the project’s chosen wording when a person took their own life under persecution. It frames the death as an escape forced by the persecutors rather than a free choice. Hertha died on 14 January 1943, in the same weeks Berlin’s deportation trains were running to Auschwitz.' },
      { de: '14.1.1943', en: '14 January 1943',
        why: 'The date closes the stone. Once you can read this one, the harder vocabulary on other stones (below the widget you will find the full list) stops being a wall of foreign capital letters and becomes what it is: a life, compressed.' },
    ],
    closing: 'Three stones, three different endings. That is the range of what the pavement is telling you.',
  },
];

window.__SR_VOCAB__ = [
  { de: 'JG.', en: 'Jahrgang: born in the year' },
  { de: 'GEB.', en: 'geborene: née, birth name of a married woman' },
  { de: 'DEPORTIERT', en: 'deported, usually with date and destination' },
  { de: 'ERMORDET', en: 'murdered' },
  { de: 'TOT', en: 'dead, often with a date and place' },
  { de: 'FLUCHT', en: 'fled, escaped abroad' },
  { de: 'FLUCHT IN DEN TOD', en: 'took their own life under persecution' },
  { de: 'GEDEMÜTIGT / ENTRECHTET', en: 'humiliated / stripped of rights' },
  { de: 'VERHAFTET', en: 'arrested' },
  { de: 'INTERNIERT', en: 'interned, held in a camp' },
  { de: 'ÜBERLEBT', en: 'survived' },
  { de: 'TODESMARSCH', en: 'death march' },
  { de: 'THERESIENSTADT / RIGA / AUSCHWITZ …', en: 'destination of the deportation train' },
  { de: 'HIER LERNTE / ARBEITETE / WIRKTE', en: 'here studied / worked / was active (schools, workplaces)' },
];
