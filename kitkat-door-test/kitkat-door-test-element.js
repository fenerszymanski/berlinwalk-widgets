class BwKitkatDoorTestElement extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        bw-kitkat-door-test {
          display: block;
          width: 100%;
          height: 100vh;
          max-height: 850px;
          background: #0A0002; /* Prevent white flashes during load */
        }
        bw-kitkat-door-test iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }
      </style>
      <!-- Loads the standalone game hosted on GitHub Pages -->
      <iframe
        src="https://fenerszymanski.github.io/berlinwalk-widgets/kitkat-door-test/index.html?v=kitkat-door-test-v1-20260825"
        allow="clipboard-write"
        title="KitKat Club Door Test">
      </iframe>
    `;
  }
}

if (!customElements.get('bw-kitkat-door-test')) {
  customElements.define('bw-kitkat-door-test', BwKitkatDoorTestElement);
}
