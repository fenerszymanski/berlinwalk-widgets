# Visual Sources - Berlin Last Day

Date: 2026-07-02

No paid image/video generation API was used. No AI-generated article visuals were used. Two built-in Codex image generation outputs were used only for the post-specific widget hero and BerlinTools icon, with prompts saved in the related widget/icon source folders.

## Final Selected Article Images

### 1. Cover - Berlin Hauptbahnhof exterior

- Local raw: `assets/raw/01-hauptbahnhof-last-day-cover.jpg`
- Local optimized: `assets/optimized/01-berlin-last-day-hauptbahnhof-cover.jpg`
- Source: Wikimedia Commons, `File:Berlin Hauptbahnhof 2015.jpg`
- URL: https://commons.wikimedia.org/wiki/File:Berlin_Hauptbahnhof_2015.jpg
- Author: Perituss
- License: CC0 1.0
- Role: Featured/cover image and first body image.
- Alt text: `Berlin Hauptbahnhof exterior with the DB sign, a practical final-day departure anchor for Berlin tourists.`
- Visual rationale: Strongest last-day cover because it shows a real, recognizable departure point without making the article feel like only an airport guide.
- Quality notes: Accepted. Clean, bright, topic-specific, and readable at blog-card size.

### 2. Suitcases at Berlin Hauptbahnhof

- Local raw: `assets/raw/02-hauptbahnhof-suitcases.jpg`
- Local optimized: `assets/optimized/02-berlin-last-day-suitcases.jpg`
- Source: Wikimedia Commons, `File:Berlin hauptbahnhof drei rollkoffer 15.04.2011 15-07-46.JPG`
- URL: https://commons.wikimedia.org/wiki/File:Berlin_hauptbahnhof_drei_rollkoffer_15.04.2011_15-07-46.JPG
- Author: Dirk Ingo Franke
- License: CC BY 3.0
- Role: Inline image for luggage-first planning.
- Alt text: `Rolling suitcases at Berlin Hauptbahnhof, showing why tourists should solve luggage before sightseeing on the last day.`
- Visual rationale: Directly illustrates the core last-day problem: luggage changes what is realistic.
- Quality notes: Accepted as a practical support image. Not scenic, but very relevant and clear.

### 3. Berlin Hauptbahnhof interior

- Local raw: `assets/raw/03-hauptbahnhof-interior.jpg`
- Local optimized: `assets/optimized/03-berlin-last-day-hauptbahnhof-interior.jpg`
- Source: Wikimedia Commons, `File:Interior of Berlin Hauptbahnhof - DSC09579.JPG`
- URL: https://commons.wikimedia.org/wiki/File:Interior_of_Berlin_Hauptbahnhof_-_DSC09579.JPG
- Author: Daderot
- License: CC0 1.0
- Role: Inline image for train-departure buffer and station orientation.
- Alt text: `Interior levels and platforms inside Berlin Hauptbahnhof, useful for planning a calm final train buffer.`
- Visual rationale: Shows the station complexity better than an exterior-only set.
- Quality notes: Accepted. Slightly utilitarian, but accurate and useful.

### 4. BER Terminal 1 check-in hall

- Local raw: `assets/raw/04-ber-terminal-1-check-in.jpg`
- Local optimized: `assets/optimized/04-berlin-last-day-ber-check-in.jpg`
- Source: Wikimedia Commons, `File:Berlin brandenburg airport terminal 1 check in.jpg`
- URL: https://commons.wikimedia.org/wiki/File:Berlin_brandenburg_airport_terminal_1_check_in.jpg
- Author: Alexander Migl
- License: CC BY-SA 3.0 DE
- Role: Inline image for checked-bag and airport-process buffer.
- Alt text: `Check-in counters and queue lanes inside Terminal 1 at Berlin Brandenburg Airport.`
- Visual rationale: Clear airport process image that supports the buffer recommendation.
- Quality notes: Accepted. Bright, real and BER-specific.

### 5. BER airport rail station

- Local raw: `assets/raw/05-ber-airport-station.jpg`
- Local optimized: `assets/optimized/05-berlin-last-day-ber-station.jpg`
- Source: Wikimedia Commons, `File:BfFlughafenBER-S Bahnsteig.jpg`
- URL: https://commons.wikimedia.org/wiki/File:BfFlughafenBER-S_Bahnsteig.jpg
- Author: Tbachner
- License: CC BY-SA 4.0
- Role: Inline image for airport rail timing.
- Alt text: `S-Bahn platform at Flughafen BER station underneath Berlin Brandenburg Airport.`
- Visual rationale: Reinforces that the airport train station is under Terminal 1 and still needs walking time.
- Quality notes: Accepted as support image only. Darker than the others but accurate and useful.

## Contact Sheet

- Local QA contact sheet: `contact-sheet.jpg`
- Visual gate result: passed. The cover is the strongest general last-day signal; the support set covers luggage, rail, airport check-in, and airport train timing without generic stock.

## Widget Visual Refresh

- 2026-07-02 feedback pass: the widget path cards now reuse the five optimized article images as local widget assets:
  - `berlin-last-day-buffer-planner/assets/step-bags.jpg`
  - `berlin-last-day-buffer-planner/assets/step-central.jpg`
  - `berlin-last-day-buffer-planner/assets/step-train.jpg`
  - `berlin-last-day-buffer-planner/assets/step-airport.jpg`
  - `berlin-last-day-buffer-planner/assets/step-gate.jpg`
- These are derived from the already accepted article images listed above; no new AI generation or paid image/video API was used for this refresh.
- Because the widget now displays CC BY / CC BY-SA images directly, a compact public photo-credit line was added inside the widget.

### Widget hero

- Source output copied from built-in Codex image generation:
  - Original: `/Users/yusufucuz/.codex/generated_images/019f2434-f535-7520-9984-925172242519/ig_0cb92d5ada0333f5016a46b6c6e444819a8765f8ace8fe4d86.png`
  - Workspace source: `berlin-last-day-buffer-planner/assets/hero-source-codex-imagegen.png`
  - Optimized: `berlin-last-day-buffer-planner/assets/berlin-last-day-buffer-hero.jpg`
- Prompt saved in `berlin-last-day-buffer-planner/assets/PROMPT.md`.

### BerlinTools icon

- Source output copied from built-in Codex image generation:
  - Original: `/Users/yusufucuz/.codex/generated_images/019f2434-f535-7520-9984-925172242519/ig_0cb92d5ada0333f5016a46b6f8f144819ab3961e3e06325191.png`
  - Workspace source: `tools-home/icons/_src/chatgpt-standard-20260612/berlin-last-day-buffer-planner/codex-imagegen-icon.png`
  - Canonical 512: `tools-home/icons/berlin-last-day-buffer-planner.png`
  - Canonical 160: `tools-home/icons/berlin-last-day-buffer-planner-160.png`
- Prompt saved in `tools-home/icons/_src/chatgpt-standard-20260612/berlin-last-day-buffer-planner/PROMPT.md`.
