# Ultimate Planner Wix Email Kurulumu

Bu dosya sadece launch icin ic operasyon notu. Public siteye konmayacak.

Amaç: Wix'te 5 Triggered Email template olusturmak, her birinin message ID'sini almak ve `tripPlannerFunnel.js` icindeki `TODO_TRIP_PLANNER_*` placeholder'larini guvenli sekilde degistirmek.

Not: Book eden kisiler icin yeni bir Ultimate email sequence olusturmuyoruz. Sitedeki mevcut booking email sequence zaten otomatik devreye giriyor. Ultimate sadece booking oncesi planner/sales maillerini gonderir; booking yakalaninca kendi future reminder'larini durdurur.

## Simdi Yapilacak Tek Is

Once su dosyayi ac:

```text
ultimate-berlin-trip-planner/email/paste-ready/copy-kit.html
```

Local server aciksa direkt adres:

```text
http://127.0.0.1:8765/ultimate-berlin-trip-planner/email/paste-ready/copy-kit.html
```

Bu sayfa senin ana panelin. Her email icin Subject, Preheader, HTML body,
ilerleme checkbox'lari ve message ID alani var. Sayfa browser'da ilerlemeyi
lokal olarak hatirlar.

## Wix'te Her Template Icin Ayni Sirayi Uygula

1. Wix Dashboard -> Developer Tools -> Triggered Emails bolumune git.
2. Yeni bir Triggered Email template olustur. Automation/workflow olusturma; bu 5 template'i Velo message ID ile gonderecek.
3. `copy-kit.html` icindeki `Copy name` butonuyla template adini kopyala ve Wix'te template adi olarak kullan.
4. `copy-kit.html` icinden Subject'i kopyala ve Wix'e yapistir.
5. Preheader varsa kopyala ve Wix'e yapistir.
6. Wix email editor'de HTML/custom body alanini ac.
7. `copy-kit.html` icinden sadece HTML body block'u kopyala.
8. Wix'e yapistir.
9. Template'i kaydet.
10. Wix editor URL'sini kopyala.
11. URL'yi `copy-kit.html` icindeki ilgili message ID alanina yapistir.
12. O template'in checkbox'larini isaretle. Ustteki panel `Valid IDs 5/5`
    olana kadar devam et.

Not: Message ID genelde Wix URL'sinde sunun icindedir:

```text
/automations/edit/{MESSAGE_ID}/content/en
```

URL'nin tamamini yapistirabilirsin. Apply script ID'yi URL'den kendi cikarir.

## Template Sirasi

Bu sirayla git. Sadece planner/sales path var. Booked path yok; onu mevcut booking sequence yonetiyor.

| # | Wix template name | Branch | Stage | Placeholder | HTML file |
|---|---|---|---|---|---|
| 1 | Ultimate Planner - Sales - Instant Plan | Sales | Instant | `TODO_TRIP_PLANNER_INSTANT` | `e0-instant-plan.html` |
| 2 | Ultimate Planner - Sales - 7 Days Before | Sales | 7 days before | `TODO_TRIP_PLANNER_MINUS_7` | `e1-seven-days-before.html` |
| 3 | Ultimate Planner - Sales - 3 Days Before | Sales | 3 days before | `TODO_TRIP_PLANNER_MINUS_3` | `e2-three-days-before.html` |
| 4 | Ultimate Planner - Sales - 1 Day Before | Sales | 1 day before | `TODO_TRIP_PLANNER_MINUS_1` | `e3-one-day-before.html` |
| 5 | Ultimate Planner - Sales - Arrival Day | Sales | Arrival day | `TODO_TRIP_PLANNER_DAY_OF` | `e4-arrival-day.html` |

## JSON Dosyasini Olustur

En kolay yol: 5 Wix editor URL'sini template sirasiyla alt alta topla,
`copy-kit.html` icindeki `Bulk paste Wix URLs or IDs` kutusuna yapistir ve
`Apply bulk IDs` butonuna bas. Sayfa 5 URL'yi ilgili alanlara dagitir.

Sonra JSON builder'i kullan. URL yapistirdiysen sayfa JSON icin message ID'yi
otomatik ayiklar. Duplicate veya placeholder kalirsa ust panel uyarir.

Kaydedilecek dosya:

```text
ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json
```

Bu dosya git'e girmeyecek. Sadece lokal launch dosyasi.

Eger copy kit dosyayi normal sekilde Mac `Downloads` klasorune indirdiyse,
elle tasimak yerine su import helper'i kullan:

```bash
node ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs
node ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs --write
```

Ilk komut dry-run'dir. Ikinci komut 5 ID'yi validate eder, normalize eder ve
repo icindeki dogru `message-ids.local.json` dosyasina yazar. Eski lokal ID
dosyasi varsa backup alir.

En kisa launch yolu:

```bash
node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads
source ../scripts/load-api-keys.sh
node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads --write
```

Ilk komut sadece kontrol eder. Ikinci komut ID dosyasini import eder, Velo
placeholder'larini degistirir, install kit/status/control dosyalarini yeniler,
pre-publish gate'i ve launch audit'i calistirir.

JSON dosyasi `Downloads` disinda bir yerdeyse:

```bash
node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-from /path/to/message-ids.local.json --write
```

Alternatif terminal yolu: 5 Wix editor URL'sini sirayla kopyaladiysan bir txt
dosyasina alt alta koyup su helper ile JSON urettirebilirsin:

```bash
node ultimate-berlin-trip-planner/velo/build-message-ids-from-paste.mjs --from /path/to/raw-urls.txt
node ultimate-berlin-trip-planner/velo/build-message-ids-from-paste.mjs --from /path/to/raw-urls.txt --write
```

Mac clipboard'dan direkt kullanmak istersen:

```bash
pbpaste | node ultimate-berlin-trip-planner/velo/build-message-ids-from-paste.mjs --write
```

## Sonra Komutlari Calistir

`berlinwalk-widgets/` klasorunden:

```bash
node ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json
```

Bu ilk komut dosyayi degistirmez. Eksik, placeholder kalan veya duplicate ID
varsa tek tek gosterir.

Temizse:

```bash
node ultimate-berlin-trip-planner/velo/apply-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json
```

Dry-run temizse:

```bash
node ultimate-berlin-trip-planner/velo/apply-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json --write
```

Bu write komutu `tripPlannerFunnel.js` degismeden once otomatik lokal backup
alir. Backup dosyasi su klasore yazilir:

```text
output/qa/ultimate-trip-planner-email-id-apply/
```

Son apply kontrolu:

```bash
node ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json --require-applied
```

Sonra:

```bash
node ultimate-berlin-trip-planner/build-launch-status-report.mjs
node ultimate-berlin-trip-planner/launch-audit.mjs
```

Beklenen sonuc: `Triggered Email message IDs are pasted` artik BLOCK olmamali.

## Dikkat

- Booked path icin Ultimate template olusturma. Booked guest hazirligini mevcut booking email sequence yapiyor.
- `tripPlannerBooking` endpoint'i sadece lead'i booked isaretleyip future Ultimate reminder'larini durdurmak icin var.
- Bu email ID isi bitmeden Velo publish, CMS insert, visibility release ve blog publish yapma.
