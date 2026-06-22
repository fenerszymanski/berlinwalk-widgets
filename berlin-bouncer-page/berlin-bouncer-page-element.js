const SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
const BASE_URL = SCRIPT_URL 
  ? new URL('../', SCRIPT_URL).toString() 
  : 'https://fenerszymanski.github.io/berlinwalk-widgets/';

class BwBerlinBouncerPage extends HTMLElement {
  connectedCallback() {
    this._ensureFont();
    this._render();
    this._bind();
  }

  _ensureFont() {
    if (document.querySelector('link[data-bw-bouncer-page-font]')) return;
    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;600;700&display=swap';
    font.dataset.bwBouncerPageFont = 'true';
    document.head.appendChild(font);
  }

  _render() {
    this.innerHTML = `
      <style>
        bw-berlin-bouncer-page {
          --bw-dark: #070707;
          --bw-neon: #E6FF00;
          --bw-neon-dim: rgba(230, 255, 0, 0.2);
          --bw-gray: #888888;
          --bw-white: #FFFFFF;
          display: block;
          font-family: 'Chakra Petch', sans-serif;
          background: var(--bw-dark);
          color: var(--bw-white);
        }

        bw-berlin-bouncer-page *,
        bw-berlin-bouncer-page *::before,
        bw-berlin-bouncer-page *::after {
          box-sizing: border-box;
        }

        .bw-bouncer-layout {
          display: grid;
          grid-template-columns: 1fr 440px;
          grid-template-areas: 
            "content game"
            "cta game";
          gap: 40px 60px;
          max-width: 1200px;
          margin: 0 auto;
          align-items: center;
          padding: 40px 20px;
        }

        .bw-bouncer-content {
          grid-area: content;
        }

        .bw-bouncer-eyebrow {
          color: var(--bw-neon);
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 24px;
          display: inline-block;
          border: 1px solid var(--bw-neon);
          padding: 6px 12px;
          border-radius: 4px;
        }

        .bw-bouncer-content h1 {
          font-size: clamp(48px, 6vw, 96px);
          font-weight: 900;
          line-height: 0.9;
          margin: 0 0 24px 0;
          text-transform: uppercase;
          letter-spacing: -2px;
        }

        .bw-bouncer-content h1 span {
          color: var(--bw-gray);
          display: block;
        }

        .bw-bouncer-content p {
          color: var(--bw-gray);
          font-size: clamp(16px, 1.5vw, 20px);
          line-height: 1.6;
          margin: 0 0 40px 0;
          max-width: 500px;
        }

        .bw-bouncer-feature-list {
          list-style: none;
          padding: 0;
          margin: 0 0 40px 0;
        }

        .bw-bouncer-feature-list li {
          font-size: 16px;
          color: var(--bw-white);
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bw-bouncer-feature-list li::before {
          content: "●";
          color: var(--bw-neon);
          font-size: 12px;
        }

        .bw-bouncer-tour-cta {
          grid-area: cta;
          background: #111;
          padding: 24px;
          border-radius: 16px;
          border-left: 4px solid var(--bw-neon);
          align-self: start;
        }
        
        .bw-bouncer-tour-cta h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
        }
        
        .bw-bouncer-tour-cta p {
          font-size: 14px;
          margin: 0 0 16px 0;
        }
        
        .bw-bouncer-tour-cta a {
          color: var(--bw-dark);
          background: var(--bw-neon);
          text-decoration: none;
          padding: 12px 20px;
          border-radius: 6px;
          font-weight: 800;
          font-size: 14px;
          text-transform: uppercase;
          display: inline-block;
          transition: background 0.2s, transform 0.2s;
        }

        .bw-bouncer-tour-cta a:hover {
          background: #CCFF00;
          transform: translateY(-2px);
        }

        .bw-bouncer-device {
          position: relative;
          width: 100%;
          max-width: 440px;
          height: 800px;
          margin: 0 auto;
          background: #111;
          border-radius: 40px;
          box-shadow: 0 0 0 10px #222, 0 30px 80px rgba(0,0,0,0.8), 0 0 100px var(--bw-neon-dim);
          overflow: hidden;
          isolation: isolate;
        }

        .bw-bouncer-device iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }

        /* Mobile Layout */
        @media (max-width: 960px) {
          .bw-bouncer-layout {
            grid-template-columns: 1fr;
            grid-template-areas: 
              "content"
              "game"
              "cta";
            padding: 20px;
            gap: 40px;
          }
          
          .bw-bouncer-content {
            padding-right: 0;
            text-align: center;
          }
          
          .bw-bouncer-content p, 
          .bw-bouncer-feature-list {
            margin-left: auto;
            margin-right: auto;
            text-align: left;
            max-width: 400px;
          }

          .bw-bouncer-tour-cta {
            text-align: left;
          }

          .bw-bouncer-device {
            height: 700px;
            border-radius: 20px;
            box-shadow: 0 0 0 6px #222, 0 20px 40px rgba(0,0,0,0.8);
          }
        }
      </style>

      <main class="bw-bouncer-layout">
        
        <div class="bw-bouncer-content">
          <div class="bw-bouncer-eyebrow">Playable Now</div>
          <h1>Can You Get <span>Into Berghain?</span></h1>
          <p>The world's strictest door policy meets a 5-second pressure cooker. Test your Berlin clubbing instincts.</p>
          
          <ul class="bw-bouncer-feature-list">
            <li>Choose your outfit wisely</li>
            <li>Answer under extreme time pressure</li>
            <li>Face the legendary bouncers</li>
            <li>See how you rank globally</li>
          </ul>
        </div>

        <div class="bw-bouncer-device" id="bouncer-game">
          <iframe 
            src="${new URL('berlin-bouncer/index.html?attribution=none', BASE_URL).toString()}" 
            allow="autoplay; clipboard-write; shared-storage"
            title="Berlin Bouncer Simulator">
          </iframe>
        </div>

        <div class="bw-bouncer-tour-cta">
          <h3>Survived the door?</h3>
          <p>Now survive the city. Join my tip-based walking tour to connect the places and history that make Berlin start to click.</p>
          <a href="https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based">Book the Walking Tour</a>
        </div>

      </main>
    `;
  }

  _bind() {
    // any extra binds
  }
}

if (!customElements.get('bw-berlin-bouncer-page')) {
  customElements.define('bw-berlin-bouncer-page', BwBerlinBouncerPage);
}
