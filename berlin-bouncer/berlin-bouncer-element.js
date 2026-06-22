class BwBerlinBouncerElement extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        bw-berlin-bouncer {
          display: block;
          width: 100%;
          height: 100vh;
          max-height: 850px;
          background: #000; /* Prevent white flashes during load */
        }
        bw-berlin-bouncer iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }
      </style>
      <!-- Loads the standalone game hosted on GitHub Pages -->
      <iframe 
        src="https://fenerszymanski.github.io/berlinwalk-widgets/berlin-bouncer/index.html" 
        allow="autoplay; clipboard-write; shared-storage"
        title="Berlin Bouncer Simulator">
      </iframe>
    `;
  }
}

if (!customElements.get('bw-berlin-bouncer')) {
  customElements.define('bw-berlin-bouncer', BwBerlinBouncerElement);
}
