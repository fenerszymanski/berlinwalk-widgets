const BW_ABOUT_PROFILE_IMAGE_URL = 'https://static.wixstatic.com/media/5a08a3_ac78d5df37b2486ab6662cf3872ea9a6~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg';
const BW_ABOUT_GROUP_IMAGE_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/05-1200w.webp';
const BW_ABOUT_BOOKING_URL = 'https://www.walkofberlin.com/book-berlin-walking-tour/berlin-then-and-now';

class BWAboutCompanyElement extends HTMLElement {
  connectedCallback() {
    this._render();
    this._bindEvents();
  }

  _bindEvents() {
    const faqBtns = this.querySelectorAll('.bw-faq-btn');
    faqBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !expanded);
        const content = btn.nextElementSibling;
        content.hidden = expanded;
      });
    });
  }

  _render() {
    this.innerHTML = `
      <style>
        bw-about-company {
          display: block;
          width: 100%;
        }

        .bw-about {
          --green: #1B5E20;
          --green-dark: #102414;
          --yellow: #FFE600;
          --lime: #7CB342;
          --light-green: #C5E1A5;
          --cream: #FAFAF5;
          --text: #212121;
          --muted: #4E5A4E;
          --serif: Merriweather, Georgia, serif;
          background: var(--cream);
          color: var(--text);
          font-family: Montserrat, Arial, sans-serif;
          margin: 0;
          max-width: 100%;
          overflow-x: hidden;
        }

        .bw-about *,
        .bw-about *::before,
        .bw-about *::after { box-sizing: border-box; }
        .bw-about h1, .bw-about h2, .bw-about h3, .bw-about p { margin-top: 0; }
        .bw-about a { color: inherit; }

        .bw-about-inner {
          margin: 0 auto;
          max-width: 1024px;
          padding: 64px 24px;
          width: 100%;
        }

        .bw-about-hero {
          text-align: center;
          margin-bottom: 72px;
        }

        .bw-about-kicker {
          color: var(--green);
          display: inline-block;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin-bottom: 16px;
          text-transform: uppercase;
        }

        .bw-about-hero h1 {
          color: var(--green);
          font-size: 48px;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 24px;
        }

        .bw-about-hero p {
          color: var(--muted);
          font-family: var(--serif);
          font-size: 18px;
          line-height: 1.6;
          margin: 0 auto;
          max-width: 640px;
        }

        .bw-about-grid {
          display: grid;
          gap: 56px;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          margin-bottom: 80px;
        }

        .bw-about-grid.reverse {
          direction: rtl;
        }
        .bw-about-grid.reverse > * {
          direction: ltr;
        }

        .bw-about-image {
          border-radius: 12px;
          box-shadow: 0 16px 34px rgba(0, 0, 0, 0.1);
          width: 100%;
          aspect-ratio: 4/5;
          object-fit: cover;
          display: block;
        }
        
        .bw-about-image.landscape {
          aspect-ratio: 4/3;
        }

        .bw-about-copy h2 {
          color: var(--green);
          font-size: 32px;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 18px;
        }

        .bw-about-copy p {
          color: var(--muted);
          font-size: 16px;
          line-height: 1.65;
          margin-bottom: 16px;
        }

        .bw-about-btn {
          background: var(--yellow);
          border-radius: 8px;
          color: var(--green-dark) !important;
          display: inline-block;
          font-size: 15px;
          font-weight: 800;
          margin-top: 4px;
          padding: 14px 22px;
          text-decoration: none;
        }

        .bw-about-btn:hover,
        .bw-about-btn:focus-visible {
          background: #F5DC00;
        }

        .bw-about-faq-section {
          background: #FFFFFF;
          border-radius: 12px;
          border: 1px solid var(--light-green);
          padding: 48px 40px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }

        .bw-about-faq-section h2 {
          color: var(--green);
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 32px;
          text-align: center;
        }

        .bw-faq-item {
          border-bottom: 1px solid #EAF2DC;
        }
        .bw-faq-item:last-child {
          border-bottom: none;
        }

        .bw-faq-btn {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          padding: 24px 0;
          font-family: inherit;
          font-size: 18px;
          font-weight: 800;
          color: var(--green);
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .bw-faq-btn::after {
          content: '+';
          font-size: 24px;
          color: var(--lime);
          transition: transform 0.2s ease;
        }
        .bw-faq-btn[aria-expanded="true"]::after {
          transform: rotate(45deg);
        }

        .bw-faq-content {
          padding: 0 0 24px 0;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .bw-about-hero h1 { font-size: 36px; }
          .bw-about-grid { grid-template-columns: 1fr; gap: 32px; }
          .bw-about-grid.reverse { direction: ltr; }
          .bw-about-image { aspect-ratio: 16/9; }
          .bw-about-faq-section { padding: 32px 20px; }
        }
      </style>

      <main class="bw-about">
        <div class="bw-about-inner">
          
          <header class="bw-about-hero">
            <span class="bw-about-kicker">Company Profile</span>
            <h1>About BerlinWalk</h1>
            <p>An independent Berlin walking tour and audio walks, run by me, Yusuf. I show you the city through the places that changed and what they looked like before.</p>
          </header>

          <section class="bw-about-grid">
            <img class="bw-about-image" src="${BW_ABOUT_PROFILE_IMAGE_URL}" alt="Yusuf, founder of BerlinWalk" loading="eager">
            <div class="bw-about-copy">
              <h2>Founded by Yusuf</h2>
              <p>BerlinWalk is an independent local project I created and run myself. I started it because I did not want people to experience Berlin as a dry checklist of historical dates.</p>
              <p>My goal is to give clear context, connect the dots between different eras, and give you a human sense of the city. When you walk with me, you get the person who built the route, not a corporate script.</p>
            </div>
          </section>

          <section class="bw-about-grid reverse">
            <img class="bw-about-image landscape" src="${BW_ABOUT_GROUP_IMAGE_URL}" alt="BerlinWalk group tour" loading="lazy">
            <div class="bw-about-copy">
              <h2>Berlin Then and Now</h2>
              <p>Berlin's old city did not survive. I walk you through where it stood and hold up an archive photo of the same place at every stop.</p>
              <p>We start at 12:30 at the World Clock on Alexanderplatz and end at Hackescher Markt: 11 stops covering 16 places, about 3 km, about 2.5 hours. It costs €25 per person and the group is never bigger than 10. A walk needs at least 2 guests: if you are the only guest two hours before the start, I cancel the walk, refund you in full and give you one of my audio walks for free.</p>
              <a class="bw-about-btn" href="${BW_ABOUT_BOOKING_URL}">See dates and book</a>
            </div>
          </section>

          <section class="bw-about-faq-section">
            <h2>Frequently Asked Questions</h2>

            <div class="bw-faq-item">
              <button class="bw-faq-btn" aria-expanded="false">Is Walk of Berlin the same as BerlinWalk?</button>
              <div class="bw-faq-content" hidden>
                <p>Yes. BerlinWalk is now Walk of Berlin. It is still me, Yusuf, guiding the walk, recording the audio walks and writing the weekly letter. Old berlinwalk.com links still bring you here.</p>
              </div>
            </div>

            <div class="bw-faq-item">
              <button class="bw-faq-btn" aria-expanded="false">Is BerlinWalk the same as Original Berlin Walks?</button>
              <div class="bw-faq-content" hidden>
                <p><strong>No.</strong> BerlinWalk is an independent walking tour that I founded and run myself. It is <strong>not affiliated with the older company "Original Berlin Walks"</strong> or any large international tour network. When you book, you book with me.</p>
              </div>
            </div>

            <div class="bw-faq-item">
              <button class="bw-faq-btn" aria-expanded="false">How much does it cost?</button>
              <div class="bw-faq-content" hidden>
                <p>€25 per person, paid when you book. That is the same price on every site that sells it. For your own group I run private walks: €249 for up to 6 people or €299 for up to 10.</p>
              </div>
            </div>

            <div class="bw-faq-item">
              <button class="bw-faq-btn" aria-expanded="false">Can I cancel or change my date?</button>
              <div class="bw-faq-content" hidden>
                <p>Yes. Cancel up to 24 hours before the start and you get a full refund, or move to another date if there is space. Later than that I cannot refund. If I have to cancel, for weather or anything else, you get your money back in full.</p>
              </div>
            </div>
            
          </section>

        </div>
      </main>
    `;
  }
}

if (!customElements.get('bw-about-company')) {
  customElements.define('bw-about-company', BWAboutCompanyElement);
}
