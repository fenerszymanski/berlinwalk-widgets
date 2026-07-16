# BerlinTools completion handoff — daily blog batch 2026-07-16

The four deferred BerlinTools pages and glossy icons are now wired in Wix CMS.
The Search Console indexing requests were completed separately in the UI; this
note covers the tool-page and local widget-repo work.

| Tool slug | Wix CMS item | Wix icon media | Own post |
|---|---|---|---|
| `berlin-doner-order-builder` | `7a220296-35f7-4321-a8e2-9666028e236e` | `5a08a3_bd1d96141bef43be973fd7961a5500b7~mv2.png` | `/post/how-to-order-doner-in-berlin` |
| `stasi-surveillance-scale` | `9301d985-4703-436e-afa2-a40d61c5a9d3` | `5a08a3_bbd77d18893d48189d807e5ea23082ac~mv2.png` | `/post/stasi-museum-berlin` |
| `treptower-memorial-walk` | `15791870-6c55-471f-940a-3b763670b415` | `5a08a3_efaaf3553ad54378a50c02aa13df423d~mv2.png` | `/post/treptower-park-berlin` |
| `friedrichshain-kiez-loop` | `31383c66-d696-4c20-bd8a-3f30577f0788` | `5a08a3_e41d61a8176640d7a679cda275300c51~mv2.png` | `/post/friedrichshain-berlin` |

The live Wix dynamic pages returned HTTP 200. Browser QA confirmed that each
page renders the intended GitHub Pages widget iframe, own blog link and
related-tool links. The public tool copy is English, place-first and uses
Yusuf's singular guide voice.

Local repo work:

- Added four tool records to `tools-hub/data.json`; validation passed with 135
  tools and 132 visible tools.
- Added canonical 512/160 PNGs, internal prompts/source files and both icon
  manifests.
- Added four exact post-to-own-tool mappings in
  `scripts/generate-blog-index-data.mjs`.
- Regenerated `blog-index/data.json` with `--limit 300` to 220 posts. The diff
  changes the generated timestamp and related-tool fields only; it does not
  modify published post bodies or metadata.

The changes are committed locally. Per `AGENTS.md`, GitHub Pages push is still
Yusuf's manual step; until it is pushed, the Wix pages are live but the new hub
icons and regenerated `/blog` relation data are not yet served from GitHub
Pages.
