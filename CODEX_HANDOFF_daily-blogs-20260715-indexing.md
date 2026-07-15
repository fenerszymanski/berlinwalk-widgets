# Codex handoff — daily blog indexing retry (2026-07-15)

Two daily-blog posts were published on 2026-07-15 (Yusuf approved) and are live:

- https://www.berlinwalk.com/post/german-numbers-for-tourists-berlin (post id `f2fb355e-32d6-4bdd-be84-48a1a48f45a2`)
- https://www.berlinwalk.com/post/berlin-natural-history-museum (post id `f2542ff8-42e0-45cb-b6e1-5ce2b47fca95`)

Both live pages QA'd clean: 200, self-canonical, robots `index, follow, max-image-preview:large`, og:image, BlogPosting + FAQPage, widget/QS/FAQ embeds. `/blog` regenerated to 216 posts and verified on GitHub Pages.

## Search Console status

- `german-numbers-for-tourists-berlin` — **Indexing requested** (added to priority crawl queue) via URL Inspection.
- `berlin-natural-history-museum` — **NOT requested yet: "Quota exceeded"**. The property hit Google's daily Request-Indexing cap (many URLs were submitted earlier today). 

## TODO (tomorrow, after quota resets)

In Search Console (`sc-domain:berlinwalk.com`) → URL inspection, inspect
`https://www.berlinwalk.com/post/berlin-natural-history-museum` and click
**Request indexing**. Record whether it returns `Indexing requested` or hits
quota again.
