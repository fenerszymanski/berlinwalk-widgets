# Trip Planner 3.1 release runbook

Status: approval gate 2 completed on 2026-07-21 at 09:30 CEST. The production
product and exact 30-day EUR 3.99 offer are live. Approval gate 3 is not
authorised; no Meta upload, activation, or spend change was made.

Release record: widget product commit
`69b0150318732fa783ace091e07171a2c9b5aa84`, production backend
`dpl_9qzZ8ZNU8yqrKgWQAkFvYmRhjrwm`, launch-off rollback
`dpl_GjddvExbqimnDiRSSNMUPGqLuBnq`. The active window is
`2026-07-21T07:30:00.000Z` through `2026-08-20T07:30:00.000Z`. The default
production environment flag was restored to offer-off after promotion so a
future accidental deployment fails closed to EUR 7.99; the promoted snapshot
remains offer-on for the approved window.

This runbook supersedes the paid-product, AI, and pricing instructions in the
older `LAUNCH_RUNBOOK.md` and `PLANNER_NEXT_LEVEL_PLAN.md`. Those files remain
historical context only where they conflict with this document.

## Product contract

- Customer-facing plan generation is deterministic. No Gemini, OpenAI, or
  other generative AI request may run in the customer path.
- The free preview, paid browser view, email access and PDF are views of the
  same immutable Plan Artifact V3 object.
- Main-route stops remain in their generated order. Plan B content is visibly
  separate and never inserted into the main route.
- The PDF includes real time ranges. Weather, opening-hours and offline copy
  state their data timestamp or limitation honestly.
- A paid order receives one idempotent access email. Its PII-free signed link
  opens the same plan on another device until 30 days after the original
  `paidAt` time. Reopening or re-verifying must not extend that expiry.

## Price and launch-offer contract

- Stable product key: `trip_planner_detailed`.
- Standard price: EUR 7.99 (`799` cents).
- Launch campaign: `tp_v31_launch_50`.
- Active launch checkout: EUR 7.99 subtotal, EUR 4.00 automatic discount,
  EUR 3.99 paid total.
- The server owns offer status, timestamps and money values. Query parameters,
  iframe messages and local review controls cannot activate a production offer.
- Promotion is disabled by default. It is active only when the explicit enable
  flag, valid start/end timestamps and the correct Stripe-mode coupon are all
  present.
- Checkout rejects a stale client offer and asks the interface to refresh.
- Webhook verification records and checks subtotal, discount, paid total,
  currency and offer identity. Meta Purchase uses the verified paid total,
  never the advertised or client-reported amount.
- At the exact end time the public page and checkout return to EUR 7.99. There
  is no repeating timer, fake stock limit, or hidden extension.

## Approval gate 1: local product proof

Before asking Yusuf to approve a live release, provide all of the following:

1. A payment-free local result URL showing the revised free preview and the
   complete paid-plan sample.
2. The matching generated PDF file.
3. Desktop 1280 px and mobile 390 px evidence with no horizontal overflow,
   internal scroll trap, layout shift, hidden CTA, or white text on yellow.
4. Tests for 1, 3, 5 and 7-day plans, route-order parity, explicit meal
   locations, Plan B separation, live/typical weather boundaries, cross-device
   access, offer expiry, stale-offer rejection, old EUR 7.99 orders, refunds,
   First-Day Rescue and Meta value integrity.
5. A static and runtime proof that the customer path makes zero AI requests.

Stop here and wait for Yusuf's explicit approval. Do not publish source files,
deploy the backend, create a live Stripe coupon, change Wix collection fields,
activate a promotion, or change Meta.

## Approval gate 2: production release

Completed. Schema readback, launch-off deployment, isolated Stripe test
purchase/refund, live coupon, exact-window activation, public alias readback,
live unpaid checkout smoke, desktop/mobile product QA, PDF QA, rollback capture
and cleanup all passed. The first delivery email passed SPF, DKIM and DMARC but
landed in Spam, so inbox placement remains a monitoring item.

After approval gate 1:

1. Back up the current source pins, Wix embed state, production environment
   settings and collection schema.
2. Add and read back any required admin-only `TripPlannerOrders` fields. This
   additive schema step must happen before the new backend because even a
   standard EUR 7.99 checkout writes the new pricing and entitlement snapshot.
3. Release the widget and landing source, verify GitHub Pages propagation, then
   deploy the backend with the launch offer still disabled.
4. Run the inactive-offer live smoke. The public price and checkout must remain
   EUR 7.99.
5. Run one Stripe test-mode purchase through checkout, webhook, access email,
   another-device access, PDF, refund and revoked-access paths.
6. Only after that test passes, create or verify the live fixed EUR 4.00 Stripe
   coupon and configure the exact 30-day Europe/Berlin start/end window.
7. Enable the offer, read it back from the public endpoint and repeat desktop,
   mobile and checkout QA at EUR 3.99.
8. Record the exact automatic-expiry and rollback commands. Rollback disables
   the offer first; it must not require a source redeploy to restore EUR 7.99.

## Approval gate 3: Meta preparation

Only after production product QA passes:

1. Prepare campaign copy and real brand-consistent image assets for the
   30-day offer.
2. Show the creative set to Yusuf and wait for a separate explicit approval.
3. After approval, upload to Meta with campaigns, ad sets and ads configured
   `PAUSED`.
4. Read back IDs, destination URL, UTM values, pixel binding, price copy,
   placement previews and effective status.
5. Do not activate delivery or spend. Activation is a later explicit decision.

## Measurement truth

- A sale is a canonical paid, non-refunded `TripPlannerOrders` record whose
  Stripe subtotal, discount, total and currency have passed server checks.
- Landing views, preview opens, checkout starts, Meta clicks, LPV and platform
  purchase labels are funnel signals, not sales.
- Preserve old EUR 7.99 order recognition and report both EUR 3.99 launch and
  EUR 7.99 standard orders under the single `trip_planner_detailed` product.
