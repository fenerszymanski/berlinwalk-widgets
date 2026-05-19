class BWStatsElement extends HTMLElement {
  connectedCallback() {
    this.setAttribute('aria-hidden', 'true');
    this.innerHTML = `
      <style>
        bw-stats {
          display: none !important;
        }
      </style>
    `;
  }
}

if (!customElements.get('bw-stats')) {
  customElements.define('bw-stats', BWStatsElement);
}
