# Quick-summary swap status — 2026-04-29

22 posts in /quick-summary/data.json. Status of each post on Wix:

## ✓ Migrated (using new ?post=slug URL)
| data slug | post slug |
|---|---|
| pergamon-closed | is-the-pergamon-museum-closed-what-every-tourist-needs-to-know-in-2026 |
| museum-pass | berlin-museum-pass-vs-single-tickets-which-one-saves-you-money |
| 5-best-doner | 5-best-döner-kebab-spots-in-berlin-you-need-to-try-in-2026 |
| airport-to-alex | how-to-get-from-berlin-airport-to-alexanderplatz-the-easy-way |
| validate-ticket | do-you-really-need-to-validate-your-ticket-on-berlin-trains |
| tap-water | is-tap-water-safe-to-drink-in-berlin-what-tourists-should-know |
| popes-revenge | the-pope-s-revenge-how-east-germany-s-tv-tower-backfired |
| why-berliners-rude | why-berliners-aren-t-rude-they-re-just-honest |
| berliner-dom | 7-things-most-tourists-dont-know-about-the-berliner-dom |
| alex-mistakes | 5-mistakes-tourists-make-at-alexanderplatz |

## ✗ Legacy (still needs swap)
| data slug | post slug | embed URL to use |
|---|---|---|
| berlin-food | what-to-eat-in-berlin-12-must-try-local-foods | https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=berlin-food |
| best-time | what-s-the-best-time-to-visit-berlin-a-month-by-month-guide | https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=best-time |
| transport | berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus | https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=transport |
| where-to-stay | where-to-stay-in-berlin-best-neighborhoods-for-every-type-of-tourist | https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=where-to-stay |
| climate | average-temperature-in-berlin-by-month-a-complete-climate-guide | https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=climate |
| german-phrases | 50-essential-german-phrases-every-tourist-should-know-before-visiting-berlin | https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=german-phrases |
| safety | is-berlin-safe-to-visit-an-honest-2026-guide | https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=safety |
| drinking-water | where-to-find-free-drinking-water-in-berlin | https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=drinking-water |
| welcomecard | is-the-berlin-welcomecard-worth-it-in-2026-an-honest-breakdown | https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=welcomecard |
| sunday-shops | are-shops-open-on-sunday-in-berlin-what-you-need-to-know | https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=sunday-shops |

## ⚠ Both / Mismatch / None (review)
| data slug | post slug | issue |
|---|---|---|
| 12-stops | 12-stops-through-berlin-s-ancient-core-what-you-ll-see-on-our-free-walking-tour | BOTH — has migrated `quick-summary/?post=12-stops` widget AND a leftover legacy `LISTEN TO SUMMARY` audio bar embed still present. Delete the old audio-bar HTML node to clean up. |
| gift-guide | what-to-buy-in-berlin-12-souvenir-and-gift-ideas-worth-taking-home | MISMATCH — embed uses the new GitHub Pages widget URL but with the older inline-data format (`quick-summary/?title=...&kicker=...&i1=...&audio=...`) instead of the new `?post=gift-guide` lookup. Swap to https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=gift-guide so the widget reads from data.json. |

## Summary counts
- Migrated: 10
- Legacy: 10
- Anomalies: 2

## New post embeds (post-migration)
- berlin-in-the-rain: rain-outfit widget embedded ✓ (https://fenerszymanski.github.io/berlinwalk-widgets/rain-outfit/)
- east-west-1989: built 2026-05-05, awaiting blog post (https://fenerszymanski.github.io/berlinwalk-widgets/east-west-1989/) — DO NOT embed in any existing post
