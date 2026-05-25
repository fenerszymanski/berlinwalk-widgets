# Berlin in 12 Minutes — Yusuf'un yapması gerekenler

Audio tour widget hazır, ses dosyası eksik. Aşağıdaki adımlar tek seferlik;
sonraki kayıtlarda sadece adım 4 + 6 tekrarlanır.

---

## 1. Voice sample kaydet (5 dakika)

ElevenLabs voice clone için **2-3 dakikalık temiz İngilizce konuşma** lazım.
Telefon yeterli, ama:

- Sessiz oda
- Telefonu ağzına 15-20 cm mesafede tut
- Doğal ritmle konuş, "okuyor" gibi değil
- Tour anlatır gibi anlat (örnek: bir Berlin durağını açıkla)
- Yankı yok, fan/klima kapalı
- M4A veya WAV kaydet (telefon Sesli Notlar app'i tamam)

Çıktı: `~/Documents/yusuf-voice-sample.m4a` (veya istediğin path)

---

## 2. ElevenLabs voice clone (10 dakika)

1. `https://elevenlabs.io/app/voice-lab` → hesap aç (Creator plan $5/ay ile başla, voice clone + 30k karakter dahil)
2. **Add Voice → Instant Voice Clone**
3. Sample dosyasını upload et
4. Voice adı: `Yusuf BerlinWalk`
5. Description: `Berlin walking guide, English, calm storyteller`
6. Klonlama 1-2 dakika sürer
7. Voice card açıldığında **... menüsü → Copy Voice ID** (örn. `21m00Tcm4TlvDq8ikWAM`)

Aynı sayfadan **Profile → API Keys → New API Key** al, kopyala.

---

## 3. Keychain'e key + voice_id ekle

Workspace root'ta:

```bash
cd "/Users/yusufucuz/Documents/New project"
scripts/setup-api-keys.sh
```

Eski key'leri boş bırak (mevcutları korumak için). Yeni iki promptu doldur:
- `ElevenLabs API key (for voice clone audio gen):` → API key
- `ElevenLabs voice ID (the cloned Yusuf voice):` → voice_id

---

## 4. Script'i kontrol et / düzenle

`berlinwalk-widgets/audio-tour/script.md` aç. 10 chapter, ~12 dakika.
Beğenmediğin cümleyi düzenle, **chapter heading + id satırlarına dokunma**
(parser onlara göre çalışıyor).

---

## 5. ffmpeg yükle (tek sefer)

```bash
brew install ffmpeg
```

Stitching için lazım. Yüklüyse `ffmpeg -version` ile kontrol et.

---

## 6. Ses üret

```bash
cd "/Users/yusufucuz/Documents/New project"
source scripts/load-api-keys.sh
node scripts/generate-audio-tour.mjs
```

Beklenen output:
```
[audio-tour] parsed 10 chapters from script.md
[audio-tour] [1/10] generating welcome (618 chars)...
[audio-tour] [1/10] saved output/audio/chapters/01-welcome.mp3 (...)
...
[audio-tour] stitching 10 chapters → output/audio/berlin-12-min.mp3
[audio-tour] final file: output/audio/berlin-12-min.mp3 (~7 MB)
```

Süre: ~3-5 dakika. Cost: ~7-9k karakter × $0.0003/karakter ≈ $2-3.

**Tek chapter beğenilmediyse:**
```bash
node scripts/generate-audio-tour.mjs --chapter tv-tower
node scripts/generate-audio-tour.mjs --stitch-only
```

---

## 7. Wix Media'ya yükle

1. `open output/audio/berlin-12-min.mp3` ile aç, baştan sona dinle
2. Wix Studio → Media Manager → Upload → MP3 dosyasını sürükle
3. Yüklenen dosyaya sağ tık → **Get URL** → kopyala
   (Örn: `https://static.wixstatic.com/mp3/5a08a3_xxxxxx.mp3`)

---

## 8. Widget'a public URL'i yansıt

Wix Studio'da homepage + `/the-guide` sayfasına Custom Code (Settings →
Custom Code → Body end → All Pages değil sadece o sayfa) ile şu snippet'i koy:

```html
<bw-audio-tour audio-src="https://static.wixstatic.com/mp3/5a08a3_xxxxxx.mp3"></bw-audio-tour>
<script src="https://fenerszymanski.github.io/berlinwalk-widgets/audio-tour/audio-tour-element.js"></script>
```

(URL'i kendi Wix Media linkinle değiştir.)

---

## 9. Berlinwalk-widgets push

GitHub Desktop → Push origin. GitHub Pages 5-15 dakikada deploy eder.

---

## 10. BerlinTools sayfası live (`/tools/free-berlin-audio-tour`)

Push deploy olunca:

```bash
cd "/Users/yusufucuz/Documents/New project"
source scripts/load-api-keys.sh
node insert-free-berlin-audio-tour.js
```

Tek sefer çalıştır. `/tools/free-berlin-audio-tour` 1-2 dakika içinde live.

---

## Test checklist (deploy sonrası)

- [ ] `/tools/free-berlin-audio-tour` açılıyor, audio player render oluyor
- [ ] Play button çalışıyor, ses geliyor
- [ ] Chapter'a tıklayınca o noktaya atlıyor
- [ ] Mobile'da chapter listesi stack oluyor
- [ ] Homepage embed çalışıyor (audio-src attribute geçti mi?)
- [ ] /the-guide embed çalışıyor
- [ ] Network tab'de MP3 fetch 200 (404 değil)

---

## Maintenance

- Script güncellersen: `node scripts/generate-audio-tour.mjs --force`
  ve yeni MP3'ü Wix Media'ya overwrite et (aynı URL, no widget değişikliği).
- ElevenLabs plan limit'i aşarsan voice clone restore edilir, tekrar üretmek
  için aynı voice_id'yi kullanabilirsin (silmediysen).
