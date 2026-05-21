const BW_BLOG_GUIDE_NOTE_BASE_URL = (() => {
  const script = document.currentScript;
  return script && script.src ? script.src : window.location.href;
})();

const BW_BLOG_GUIDE_NOTE_IMAGE_URL = new URL('./yusuf-tour-note.jpg', BW_BLOG_GUIDE_NOTE_BASE_URL).href;
const BW_BLOG_GUIDE_NOTE_GUIDE_URL = 'https://www.berlinwalk.com/the-guide';
const BW_BLOG_GUIDE_NOTE_BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';

class BWBlogGuideNoteElement extends HTMLElement {
  connectedCallback() {
    this._render();
  }

  _render() {
    this.innerHTML = `
      <style>
        bw-blog-guide-note {
          display: block;
          width: 100%;
        }

        .bw-blog-guide-note {
          --green: #1B5E20;
          --green-dark: #124516;
          --yellow: #FFE600;
          --light-green: #C5E1A5;
          --cream: #FAFAF5;
          --text: #212121;
          --muted: #4E5A4E;
          --border: #DDE9D2;
          --serif: Merriweather, Georgia, serif;
          color: var(--text);
          font-family: Montserrat, Arial, sans-serif;
          max-width: 100%;
          width: 100%;
        }

        @media (max-width: 760px) {
          bw-blog-guide-note {
            display: none !important;
          }
        }

        .bw-blog-guide-note *,
        .bw-blog-guide-note *::before,
        .bw-blog-guide-note *::after {
          box-sizing: border-box;
        }

        .bw-blog-guide-note a {
          color: inherit;
        }

        .bw-blog-guide-note p,
        .bw-blog-guide-note figure {
          margin-top: 0;
        }

        .bw-blog-guide-note .bw-note-card {
          background: #FFFFFF;
          border: 1px solid var(--border);
          border-radius: 8px;
          box-shadow: 0 18px 44px rgba(27, 94, 32, 0.12);
          margin: 0 auto;
          max-width: 390px;
          overflow: hidden;
          position: relative;
        }

        .bw-blog-guide-note .bw-note-card::before {
          background: var(--yellow);
          content: "";
          display: block;
          height: 5px;
          width: 100%;
        }

        .bw-blog-guide-note .bw-note-photo {
          margin: 0;
          padding: 22px 22px 0;
          position: relative;
        }

        .bw-blog-guide-note .bw-note-photo-frame {
          border-radius: 8px;
          display: block;
          overflow: hidden;
          position: relative;
        }

        .bw-blog-guide-note .bw-note-photo-frame::after {
          background: linear-gradient(180deg, transparent 48%, rgba(16, 36, 20, 0.36));
          bottom: 0;
          content: "";
          left: 0;
          pointer-events: none;
          position: absolute;
          right: 0;
          top: 0;
        }

        .bw-blog-guide-note .bw-note-photo img {
          aspect-ratio: 3 / 2;
          display: block;
          height: auto;
          object-fit: cover;
          object-position: center 42%;
          width: 100%;
        }

        .bw-blog-guide-note .bw-note-photo-tag {
          background: var(--yellow);
          border-radius: 999px;
          bottom: 14px;
          color: var(--green);
          font-size: 10px;
          font-weight: 900;
          left: 40px;
          letter-spacing: 1.2px;
          padding: 8px 11px;
          position: absolute;
          text-transform: uppercase;
          z-index: 2;
        }

        .bw-blog-guide-note .bw-note-copy {
          padding: 24px 28px 26px;
        }

        .bw-blog-guide-note .bw-note-kicker {
          color: var(--muted);
          display: block;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.8px;
          line-height: 1.25;
          margin-bottom: 16px;
          text-transform: uppercase;
        }

        .bw-blog-guide-note .bw-note-title {
          color: var(--green);
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1.12;
          margin: 0 0 18px;
        }

        .bw-blog-guide-note .bw-note-body {
          color: var(--muted);
          font-family: var(--serif);
          font-size: 16px;
          font-weight: 700;
          line-height: 1.58;
          margin-bottom: 24px;
        }

        .bw-blog-guide-note .bw-note-actions {
          align-items: stretch;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .bw-blog-guide-note .bw-note-btn {
          align-items: center;
          border-radius: 999px;
          display: inline-flex;
          font-size: 12px;
          font-weight: 900;
          justify-content: center;
          letter-spacing: 0.8px;
          min-height: 42px;
          text-decoration: none;
          text-transform: uppercase;
          transition: background 160ms ease, color 160ms ease, transform 160ms ease;
          width: 100%;
          white-space: nowrap;
        }

        .bw-blog-guide-note .bw-note-btn-primary {
          background: var(--green);
          color: #FFFFFF;
          padding: 0 25px;
        }

        .bw-blog-guide-note .bw-note-btn-primary:hover,
        .bw-blog-guide-note .bw-note-btn-primary:focus-visible {
          background: var(--green-dark);
          transform: translateY(-1px);
        }

        .bw-blog-guide-note .bw-note-btn-link {
          border: 1px solid var(--light-green);
          border-radius: 999px;
          color: var(--green);
          gap: 8px;
          min-height: 42px;
          padding: 0 18px;
        }

        .bw-blog-guide-note .bw-note-btn-link span:last-child {
          align-items: center;
          border: 1px solid rgba(27, 94, 32, 0.14);
          border-radius: 999px;
          display: inline-flex;
          height: 28px;
          justify-content: center;
          width: 28px;
        }

        .bw-blog-guide-note .bw-note-btn-link:hover,
        .bw-blog-guide-note .bw-note-btn-link:focus-visible {
          color: var(--green-dark);
          transform: translateY(-1px);
        }

        .bw-blog-guide-note .bw-note-btn:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.9);
          outline-offset: 3px;
        }

        @media (max-width: 760px) {
          .bw-blog-guide-note {
            display: none !important;
          }
        }
      </style>

      <aside class="bw-blog-guide-note" aria-label="A note from Yusuf">
        <article class="bw-note-card">
          <figure class="bw-note-photo">
            <span class="bw-note-photo-frame">
              <img src="${BW_BLOG_GUIDE_NOTE_IMAGE_URL}" alt="Yusuf Ucuz guiding a BerlinWalk tour with historical photos" loading="lazy" decoding="async">
            </span>
            <figcaption class="bw-note-photo-tag">The guide</figcaption>
          </figure>

          <div class="bw-note-copy">
            <span class="bw-note-kicker">A note from Yusuf</span>
            <h2 class="bw-note-title">Berlin should click, not just be checked off.</h2>
            <p class="bw-note-body">I write these guides for visitors who want Berlin to make sense: the practical details, the history under your feet, and the small things most visitors walk past.</p>

            <div class="bw-note-actions" aria-label="Guide links">
              <a class="bw-note-btn bw-note-btn-primary" href="${BW_BLOG_GUIDE_NOTE_GUIDE_URL}">Meet Yusuf</a>
              <a class="bw-note-btn bw-note-btn-link" href="${BW_BLOG_GUIDE_NOTE_BOOKING_URL}">
                <span>Book the walk</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </article>
      </aside>
    `;
  }
}

if (!customElements.get('bw-blog-guide-note')) {
  customElements.define('bw-blog-guide-note', BWBlogGuideNoteElement);
}
