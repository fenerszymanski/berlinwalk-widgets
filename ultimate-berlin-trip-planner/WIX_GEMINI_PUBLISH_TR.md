# Ultimate Planner Gemini Canliya Alma

Bu dosya sadece son Wix adimi icin kisa checklist. Kod tarafinda local gate
temiz: `149 pass, 1 warn, 0 block`. Kalan uyari, Wix'te `tripPlannerAi`
endpoint'i henuz publish edilmedigi icin var.

## 0. Durum

- Local `GEMINI_API_KEY` Keychain'de mevcut.
- Velo prepublish gate: `12/12 pass`.
- `TripPlannerLeads` collection hazir.
- Triggered Email IDs hazir.
- Ultimate homepage shortcut'ta degil; public release ayri adim.
- AI modeli default olarak `gemini-2.5-flash`; cevap `maxOutputTokens: 1200`
  ve `thinkingBudget: 0` ile sinirli. Beklenen maliyet dusuk: normal
  planner unlock'lari icin kabaca cent'in altinda, 1.000 unlock icin yaklasik
  birkac dolar bandi. Trafik buyumeden once resmi Gemini pricing tekrar
  kontrol edilmeli.

## 1. Wix Secrets

Wix Studio'da:

1. Developer Tools / Secrets Manager bolumunu ac.
2. Yeni secret ekle.
3. Name alanina tam olarak sunu yaz:

   ```text
   GEMINI_API_KEY
   ```

4. Value alanina local Keychain'deki Gemini API key'i koy.
5. Kaydet.

Not: Fallback isimler kodda var ama production icin tercih edilen isim
`GEMINI_API_KEY`.

## 2. Velo Kodunu Paste Et

Local dosyayi ac:

```text
ultimate-berlin-trip-planner/velo/install-kit.html
```

Wix Developer Tools'ta:

1. `Backend/tripPlannerFunnel.js` dosyasini guncelle.
2. `Backend/http-functions.js` icine `tripPlannerLead`, `tripPlannerAi`, ve
   `tripPlannerBooking` handlerlarini merge et.
3. `jobs.config` icindeki hourly job'u merge et.
4. Kaydet.
5. Wix siteyi publish et.

Booked path icin yeni email automation kurma. Book eden kisi zaten mevcut
booking email sequence'a giriyor; Ultimate sadece kendi future reminder'larini
durduruyor.

## 3. Publish Sonrasi Once AI-Only Test

Terminalde `berlinwalk-widgets/` icinden:

```bash
source ../scripts/load-api-keys.sh
node ultimate-berlin-trip-planner/launch-remote-preflight.mjs
node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --ai-only
node ultimate-berlin-trip-planner/launch-audit.mjs
```

Beklenen:

- `tripPlannerAi OPTIONS` artik `204`.
- `--ai-only` lead yaratmadan ve instant email gondermeden `ok: true` doner.
- `enhancement.localRead` gelir.

## 4. Sonra Full Smoke

Gercek test inbox ile:

```bash
node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email YOUR_TEST_EMAIL@example.com --ai
node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email YOUR_TEST_EMAIL@example.com --booking
node ultimate-berlin-trip-planner/build-launch-status-report.mjs
```

Beklenen:

- Lead kaydi olusur.
- Instant plan email gelir.
- AI paneli fail-soft kalir: hata olursa deterministic plan/PDF/print yine acik.
- Booking smoke future Ultimate sales reminder'larini suppress eder.

## 5. Public Release Ayri

Bu testlerden sonra bile Ultimate'i public shortcutlara hemen koyma. Public
release icin once:

```bash
node ultimate-berlin-trip-planner/release-visibility.mjs
```

dry-run sonucunu oku. Sonra gerekirse `--write` ile tools visibility acilir.
