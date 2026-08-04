# Trip Planner V3.2 completion plan

This is the only active completion map for the Trip Planner product. `P` means
product work. `M` means Meta preparation. The older release runbook remains a
technical reference, but its gate numbers must not be called product phases.

## Fixed decisions

- Checkout stays open. No new planned traffic or ads start before P7.
- The current EUR 3.99 offer keeps its existing end date: 20 August 2026.
- The paused Meta campaign and ad-set shell stays paused. No ad may deliver or
  spend without a later explicit approval.
- Runtime AI stays disabled in the customer path.
- The BerlinWalk logo appears in the PDF only and has no `.com` suffix.

## Product phases

| Phase | Requirement | Current state |
|---|---|---|
| P0 | Safety lock and truthful offer state | Complete |
| P1 | Route order, transfers, time windows, meal and Plan B integrity | Complete locally; automated and human regression passed |
| P2 | One active web day, direct navigation and readable mobile typography | Complete locally; 390 px and 1280 px regression passed |
| P3 | Readable, branded, unclipped PDF with honest offline/weather notes | Complete locally; real jsPDF bounds and reading order passed |
| P4 | Plain English across form, preview, web plan, PDF, checkout and email | Complete locally; final public-copy leaks removed |
| P5 | Risk-based automated matrix plus 12 human-review cases | Complete locally: 88/88 engine tests, 127/127 server tests, 72/72 scenarios, 448/448 pairwise, 504/504 calendar scenarios, 7,056/7,056 meal blocks and 12/12 human cases |
| P6 | Three explicit Yusuf approval gates | Gate 1 revision technically passed; Yusuf content approval pending |
| P7 | Production release, live readback and terminal QA | Not started |

## P6 approval gates

Work must stop at each gate until Yusuf approves it.

1. Content: Day 3, Day 4 and the Potsdam day.
2. Design: one complete web day, the PDF cover and one complete PDF day.
3. Release: scenario report, purchase, email/cross-device access, PDF, refund
   and entitlement-revoke proof.

Current Gate 1 revision evidence and the final summary are in
`output/qa/trip-planner-v32-meal-revision-20260722/`. The exact review artifact,
mobile/desktop renders and complete 31-page PDF are under its `evidence/`
directory. The independent 12-scenario evidence is under
`human-review-final-assets/`.

## Meta phases

| Phase | Requirement | Current state |
|---|---|---|
| M0 | A2, B1 and C1 directions approved | Complete |
| M1 | Campaign and ad-set shell paused with zero delivery | Hold |
| M2 | Build three paused ads after P7 | Not started |
| M3 | Activation and budget decision | Requires separate Yusuf approval |

## Completion rule

No product phase is complete because one narrow test passes. Completion needs
the code change, the matching contract test, a rendered artifact or browser
proof, and a clean regression run covering that phase.
