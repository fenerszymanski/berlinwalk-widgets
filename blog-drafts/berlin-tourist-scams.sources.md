# Berlin Tourist Scams Research Notes

Package date: 2026-06-28 Europe/Berlin

## Primary/current sources used

- Berlin.de: Avoiding Street Scammers and Con Artists
  - URL: https://www.berlin.de/en/tourism/travel-information/2771003-2862820-avoiding-street-scammers.en.html
  - Live check: HTTP 200 on 2026-06-28.
  - Used for: street games, petition/clipboard style approaches, counterfeit/free-gift pressure framing.

- Berlin.de: Pickpockets in Berlin: How to Protect Yourself
  - URL: https://www.berlin.de/en/tourism/travel-information/2832639-2862820-pickpockets.en.html
  - Live check: HTTP 200 on 2026-06-28.
  - Used for: crowded places, public transport, events, bags, phones, wallets, quick card/SIM blocking after theft.

- Berlin.de: Safety: Beware of Fake Police Officers
  - URL: https://www.berlin.de/en/tourism/travel-information/3933750-2862820-safety-beware-of-fake-police-officers.en.html
  - Live check: HTTP 200 on 2026-06-28.
  - Used for: wallet/cash/card pressure, asking for police ID, calling 110 if unsure.

- Berlin.de: Police
  - URL: https://www.berlin.de/en/tourism/travel-information/1749512-2862820-police.en.html
  - Live check: HTTP 200 on 2026-06-28.
  - Used for: official police contact context and emergency-number framing.

- BVG: Ticket control
  - URL: https://www.bvg.de/en/subscriptions-and-tickets/ticket-control
  - Live check: HTTP 200 on 2026-06-28.
  - Used for: ticket-inspection verification route. The post avoids stale/deep fare-evasion links because several candidate URLs returned 404.

- Visa: Dynamic Currency Conversion
  - URL: https://www.visa.com/en-us/personal/travel/dynamic-currency-conversion
  - Live check: HTTP 200 on 2026-06-28.
  - Used for: DCC/payment-screen caution. The body keeps the claim practical and non-bank-specific.

## Link rejections during QA

- Old Berlin.de street-scam URL ending `avoid-street-scammers.en.html`: HTTP 410.
- Old Berlin.de fake-police URL ending `fake-police-officers.en.html`: HTTP 410.
- Old Berlin.de taxi URL ending `taxis.en.html`: HTTP 410.
- BVG deep fare-evasion candidate URLs: HTTP 404 except the broader ticket-control page.
- European Consumer Centre currency-conversion candidate URLs tested during this run: HTTP 404.

## Internal link candidates used

- Berlin ticket validation guide: https://www.berlinwalk.com/post/do-you-really-need-to-validate-your-ticket-on-berlin-trains
- Berlin taxi guide: https://www.berlinwalk.com/post/taxi-in-berlin
- Credit cards in Berlin guide: https://www.berlinwalk.com/post/can-you-use-credit-cards-in-berlin-a-tourist-s-guide-to-paying-in-germany
- Lost property in Berlin guide: https://www.berlinwalk.com/post/lost-property-berlin
- Berlin safety guide: https://www.berlinwalk.com/post/is-berlin-safe-for-solo-travelers-an-honest-local-perspective
- New tool path: https://www.berlinwalk.com/tools/berlin-street-sense-drill
