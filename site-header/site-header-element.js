const BW_HEADER_SCRIPT_URL = (document.currentScript && document.currentScript.src) || 'https://fenerszymanski.github.io/berlinwalk-widgets/site-header/site-header-element.js';
const BW_HEADER_LOGO_URL = new URL('../assets/berlinwalk-wordmark-green.png', BW_HEADER_SCRIPT_URL).href;
const BW_HEADER_BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
const BW_HEADER_LINKS = {
  home: 'https://www.berlinwalk.com/',
  route: 'https://www.berlinwalk.com/berlin-walking-tour-route',
  guide: 'https://www.berlinwalk.com/the-guide',
  reviews: 'https://www.berlinwalk.com/reviews',
  meetingPoint: 'https://www.berlinwalk.com/meeting-point',
  plan: 'https://www.berlinwalk.com/berlin-tools',
  planner: 'https://www.berlinwalk.com/berlin-trip-planner',
  audioTours: 'https://www.berlinwalk.com/audio-tours',
  photoMissions: 'https://www.berlinwalk.com/products/hidden-berlin-photo-missions',
  games: 'https://www.berlinwalk.com/games',
  blog: 'https://www.berlinwalk.com/blog',
  firstDayRescue: 'https://www.berlinwalk.com/products/berlin-first-day-rescue-plan'
};

const BW_HEADER_INSTANCES = new Set();
let BW_HEADER_ACTIVE_INSTANCE = null;
let BW_HEADER_RECONCILE_FRAME = 0;
let BW_HEADER_INSTANCE_SEQUENCE = 0;
let BW_HEADER_SCROLL_LOCK_OWNER = null;

function bwHeaderVisibilityScore(instance) {
  if (!instance || !instance.isConnected) return 0;
  let node = instance;
  let depth = 0;
  while (node && node.nodeType === 1 && depth < 12) {
    const style = window.getComputedStyle(node);
    if (
      node.hidden ||
      node.getAttribute('aria-hidden') === 'true' ||
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      Number.parseFloat(style.opacity || '1') === 0
    ) return 0;
    node = node.parentElement;
    depth++;
  }
  const rect = instance.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return 0;
  return rect.width * rect.height;
}

function bwHeaderReconcile() {
  BW_HEADER_RECONCILE_FRAME = 0;
  const candidates = Array.from(BW_HEADER_INSTANCES)
    .map((instance) => ({ instance, score: bwHeaderVisibilityScore(instance) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);
  let next = candidates[0]?.instance || null;
  const activeCandidate = candidates.find(({ instance }) => instance === BW_HEADER_ACTIVE_INSTANCE);
  if (activeCandidate && activeCandidate.score >= (candidates[0]?.score || 0) * 0.99) {
    next = BW_HEADER_ACTIVE_INSTANCE;
  }
  if (next === BW_HEADER_ACTIVE_INSTANCE) {
    if (next && !next._runtimeActive) next._activateRuntime();
    return;
  }
  const previous = BW_HEADER_ACTIVE_INSTANCE;
  BW_HEADER_ACTIVE_INSTANCE = next;
  if (previous) previous._deactivateRuntime();
  if (next) next._activateRuntime();
}

function bwHeaderScheduleReconcile() {
  if (BW_HEADER_RECONCILE_FRAME) return;
  BW_HEADER_RECONCILE_FRAME = window.requestAnimationFrame(bwHeaderReconcile);
}

class BWHeaderElement extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;
    this._connected = true;
    this._instanceId = `bw-header-instance-${++BW_HEADER_INSTANCE_SEQUENCE}`;
    this._mobileMenuId = `${this._instanceId}-mobile-menu`;
    this._tourMenuId = `${this._instanceId}-tour-menu`;
    this._productsMenuId = `${this._instanceId}-products-menu`;
    this._render();
    BW_HEADER_INSTANCES.add(this);
    this._visibilityChangeHandler = bwHeaderScheduleReconcile;
    window.addEventListener('resize', this._visibilityChangeHandler, { passive: true });
    if ('ResizeObserver' in window) {
      this._visibilityObserver = new ResizeObserver(this._visibilityChangeHandler);
      this._visibilityTargets = [];
      let node = this;
      let depth = 0;
      while (node && node.nodeType === 1 && depth < 8) {
        this._visibilityObserver.observe(node);
        this._visibilityTargets.push(node);
        node = node.parentElement;
        depth++;
      }
    }
    bwHeaderScheduleReconcile();
  }

  disconnectedCallback() {
    this._connected = false;
    if (this._visibilityObserver) this._visibilityObserver.disconnect();
    if (this._visibilityChangeHandler) window.removeEventListener('resize', this._visibilityChangeHandler);
    this._visibilityObserver = null;
    this._visibilityTargets = null;
    this._visibilityChangeHandler = null;
    BW_HEADER_INSTANCES.delete(this);
    if (BW_HEADER_ACTIVE_INSTANCE === this) BW_HEADER_ACTIVE_INSTANCE = null;
    this._deactivateRuntime();
    bwHeaderScheduleReconcile();
  }

  _activateRuntime() {
    if (this._runtimeActive || !this.isConnected || BW_HEADER_ACTIVE_INSTANCE !== this) return;
    if (this._needsRuntimeRender) {
      this._render();
      this._needsRuntimeRender = false;
    }
    this._runtimeActive = true;
    this._setupScroll();
    this._setupMobile();
    this._setupDropdown();
    this._setupViewportMode();
  }

  _deactivateRuntime() {
    if (!this._runtimeActive) return;
    this._runtimeActive = false;
    if (this._setMobileOpen) this._setMobileOpen(false);
    if (this._scrollTargets && this._scrollHandler) {
      this._scrollTargets.forEach((target) => {
        if (target && target.removeEventListener) target.removeEventListener('scroll', this._scrollHandler);
      });
    }
    if (this._scrollIntentTargets && this._scrollIntentHandler) {
      this._scrollIntentTargets.forEach((target) => {
        if (target && target.removeEventListener) target.removeEventListener('wheel', this._scrollIntentHandler);
        if (target && target.removeEventListener) target.removeEventListener('touchmove', this._scrollIntentHandler);
        if (target && target.removeEventListener) target.removeEventListener('keydown', this._scrollIntentHandler);
      });
    }
    this._setHeaderHidden(false);
    if (this._keyHandler) document.removeEventListener('keydown', this._keyHandler);
    if (this._dropdownKeyHandler) document.removeEventListener('keydown', this._dropdownKeyHandler);
    if (this._docClickHandler) document.removeEventListener('click', this._docClickHandler);
    if (this._dropdownReposition) {
      window.removeEventListener('resize', this._dropdownReposition);
      window.removeEventListener('scroll', this._dropdownReposition);
    }
    if (this._viewportModeHandler) window.removeEventListener('resize', this._viewportModeHandler);
    if (this._dropdownContexts) {
      this._dropdownContexts.forEach((context) => {
        if (context.cancelClose) context.cancelClose();
      });
    }
    if (this._mobileOverlay && this._mobileOverlay.parentNode === document.body) {
      document.body.removeChild(this._mobileOverlay);
    }
    if (this._dropdownMenus) {
      this._dropdownMenus.forEach((menu) => {
        if (menu && menu.parentNode === document.body) document.body.removeChild(menu);
      });
    } else if (this._dropdownMenu && this._dropdownMenu.parentNode === document.body) {
      document.body.removeChild(this._dropdownMenu);
    }
    if (BW_HEADER_SCROLL_LOCK_OWNER === this) {
      BW_HEADER_SCROLL_LOCK_OWNER = null;
      document.body.style.overflow = '';
    }
    this._keyHandler = null;
    this._dropdownKeyHandler = null;
    this._docClickHandler = null;
    this._dropdownReposition = null;
    this._viewportModeHandler = null;
    this._dropdownContexts = null;
    this._dropdownMenus = null;
    this._mobileOverlay = null;
    this._setMobileOpen = null;
    this._closeDropdowns = null;
    this._scrollTargets = null;
    this._scrollHandler = null;
    this._needsRuntimeRender = this.isConnected;
  }

  _isEffectivelyHidden() {
    let node = this;
    while (node && node.nodeType === 1) {
      const style = window.getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden') return true;
      node = node.parentElement;
    }
    return false;
  }

  _setupScroll() {
    const header = this.querySelector('.bw-header-wrap');
    const progress = this.querySelector('.bw-header-progress-bar');
    if (!header) return;
    this._headerShell = this._findHeaderShell();
    this._lastScrollY = this._getScrollY();
    this._setHeaderHidden(false);
    let ticking = false;
    const update = () => {
      const y = this._getScrollY();
      header.classList.remove('bw-header-shrunk');
      if (progress) {
        const docH = (document.documentElement.scrollHeight || 0) - (window.innerHeight || 0);
        const pct = docH > 0 ? Math.max(0, Math.min(100, (y / docH) * 100)) : 0;
        progress.style.width = pct + '%';
      }
      this._setHeaderHidden(false);
      this._lastScrollY = y;
      ticking = false;
    };
    this._scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    this._scrollTargets = [
      window,
      document,
      document.documentElement,
      document.body,
      document.scrollingElement
    ].filter((target, index, list) => target && list.indexOf(target) === index);
    this._scrollTargets.forEach((target) => target.addEventListener('scroll', this._scrollHandler, { passive: true }));
    update();
  }

  _getScrollY() {
    const doc = document.documentElement;
    const body = document.body;
    const scrolling = document.scrollingElement;
    return Math.max(
      window.scrollY || 0,
      window.pageYOffset || 0,
      scrolling ? scrolling.scrollTop || 0 : 0,
      doc ? doc.scrollTop || 0 : 0,
      body ? body.scrollTop || 0 : 0
    );
  }

  _findHeaderShell() {
    let node = this.parentElement;
    let depth = 0;
    let shell = null;
    while (node && node !== document.body && depth < 10) {
      const className = typeof node.className === 'string' ? node.className : '';
      if (className.includes('wixui-header') || node.tagName.toLowerCase() === 'header') {
        shell = node;
      }
      node = node.parentElement;
      depth++;
    }
    return shell;
  }

  _setHeaderHidden(hidden) {
    const target = this._headerShell || this;
    if (!target) return;
    this._headerHidden = false;
    target.style.setProperty('transition', 'none', 'important');
    target.style.setProperty('will-change', 'auto', 'important');
    target.style.setProperty('transform', 'translateY(0)', 'important');
    target.style.setProperty('pointer-events', 'auto', 'important');
  }

  _setupMobile() {
    const btn = this.querySelector('.bw-header-hamburger');
    const overlay = this.querySelector('.bw-header-mobile');
    if (!btn || !overlay) return;

    // Portal the overlay to <body> to escape ancestor transform/sticky
    // contexts (Wix header wrapper uses transforms). Without this,
    // position:fixed becomes effectively position:absolute inside the
    // Wix header and the overlay gets clipped to the header height.
    if (overlay.parentNode !== document.body) {
      document.body.appendChild(overlay);
    }
    this._mobileOverlay = overlay;

    const closeBtn = overlay.querySelector('.bw-header-mobile-close');
    const mobileSections = Array.from(overlay.querySelectorAll('details.bw-header-mobile-section'));
    mobileSections.forEach((section) => {
      const summary = section.querySelector('summary');
      if (!summary) return;
      summary.addEventListener('click', () => {
        mobileSections.forEach((other) => {
          if (other !== section) other.open = false;
        });
      });
    });
    const setOpen = (open) => {
      if (open && (!this._runtimeActive || BW_HEADER_ACTIVE_INSTANCE !== this)) return;
      overlay.classList.toggle('bw-header-mobile-open', open);
      btn.classList.toggle('bw-header-hamburger-open', open);
      btn.setAttribute('aria-expanded', String(open));
      overlay.setAttribute('aria-hidden', String(!open));
      if (!open) mobileSections.forEach((section) => { section.open = false; });
      if (open) {
        if (BW_HEADER_SCROLL_LOCK_OWNER && BW_HEADER_SCROLL_LOCK_OWNER !== this) {
          BW_HEADER_SCROLL_LOCK_OWNER._setMobileOpen?.(false);
        }
        BW_HEADER_SCROLL_LOCK_OWNER = this;
        document.body.style.overflow = 'hidden';
      } else if (BW_HEADER_SCROLL_LOCK_OWNER === this) {
        BW_HEADER_SCROLL_LOCK_OWNER = null;
        document.body.style.overflow = '';
      }
    };
    this._setMobileOpen = setOpen;
    btn.addEventListener('click', () => setOpen(!overlay.classList.contains('bw-header-mobile-open')));
    if (closeBtn) closeBtn.addEventListener('click', () => {
      setOpen(false);
      btn.focus();
    });
    overlay.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        setOpen(false);
        btn.focus();
      }
    });
    this._keyHandler = (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('bw-header-mobile-open')) {
        e.preventDefault();
        setOpen(false);
        btn.focus();
      }
    };
    document.addEventListener('keydown', this._keyHandler);
  }

  _setupViewportMode() {
    this._mobileMode = window.innerWidth <= 980;
    this._viewportModeHandler = () => {
      if (!this._runtimeActive) return;
      const nextMobileMode = window.innerWidth <= 980;
      if (nextMobileMode === this._mobileMode) return;
      this._mobileMode = nextMobileMode;
      if (this._closeDropdowns) this._closeDropdowns();
      if (this._setMobileOpen) this._setMobileOpen(false);
    };
    window.addEventListener('resize', this._viewportModeHandler, { passive: true });
  }

  _setupDropdown() {
    const dropdowns = Array.from(this.querySelectorAll('.bw-header-dropdown'));
    if (!dropdowns.length) return;

    const contexts = [];
    this._dropdownMenus = [];

    const closeAll = (except) => {
      contexts.forEach((context) => {
        if (context !== except) {
          context.cancelClose();
          context.setOpen(false);
        }
      });
    };

    dropdowns.forEach((wrap) => {
      const trigger = wrap.querySelector('.bw-header-dropdown-trigger');
      const menu = wrap.querySelector('.bw-header-submenu');
      if (!trigger || !menu) return;

      // Portal each dropdown to <body> for the same transform-ancestor reason.
      if (menu.parentNode !== document.body) {
        document.body.appendChild(menu);
      }
      this._dropdownMenus.push(menu);

      const positionMenu = () => {
        const rect = trigger.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const viewportW = window.innerWidth || document.documentElement.clientWidth;
        let left = cx - menuRect.width / 2;
        if (left < 12) left = 12;
        if (left + menuRect.width > viewportW - 12) left = viewportW - 12 - menuRect.width;
        menu.style.top = (rect.bottom + 10) + 'px';
        menu.style.left = left + 'px';
      };
      const setOpen = (open) => {
        wrap.classList.toggle('bw-header-dropdown-open', open);
        menu.classList.toggle('bw-header-submenu-open', open);
        trigger.setAttribute('aria-expanded', String(open));
        if (open) positionMenu();
      };
      let closeTimer = null;
      let openedByHover = false;
      const cancelClose = () => {
        if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
      };
      const scheduleClose = () => {
        cancelClose();
        closeTimer = setTimeout(() => setOpen(false), 220);
      };
      const context = { wrap, trigger, menu, positionMenu, setOpen, cancelClose };
      contexts.push(context);

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        cancelClose();
        closeAll(context);
        const isPointerClick = e.detail > 0;
        const isOpen = wrap.classList.contains('bw-header-dropdown-open');
        if (isPointerClick && openedByHover && isOpen) {
          openedByHover = false;
          setOpen(true);
        } else {
          openedByHover = false;
          setOpen(!isOpen);
        }
      });
      wrap.addEventListener('mouseenter', () => {
        cancelClose();
        closeAll(context);
        if (!wrap.classList.contains('bw-header-dropdown-open')) openedByHover = true;
        setOpen(true);
      });
      wrap.addEventListener('mouseleave', scheduleClose);
      menu.addEventListener('mouseenter', cancelClose);
      menu.addEventListener('mouseleave', scheduleClose);
      menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeAll()));
      if (trigger.getBoundingClientRect().width > 0) positionMenu();
    });

    this._dropdownContexts = contexts;
    this._closeDropdowns = () => closeAll();
    this._docClickHandler = (e) => {
      const insideDropdown = contexts.some((context) => context.wrap.contains(e.target) || context.menu.contains(e.target));
      if (!insideDropdown) closeAll();
    };
    document.addEventListener('click', this._docClickHandler);
    this._dropdownKeyHandler = (event) => {
      if (event.key !== 'Escape') return;
      const openContext = contexts.find((context) => context.wrap.classList.contains('bw-header-dropdown-open'));
      if (!openContext) return;
      event.preventDefault();
      closeAll();
      openContext.trigger.focus();
    };
    document.addEventListener('keydown', this._dropdownKeyHandler);
    this._dropdownReposition = () => {
      contexts.forEach((context) => {
        if (context.wrap.classList.contains('bw-header-dropdown-open')) context.positionMenu();
      });
    };
    window.addEventListener('resize', this._dropdownReposition);
    window.addEventListener('scroll', this._dropdownReposition, { passive: true });
  }

  _render() {
    this.innerHTML = `
      <style>
        bw-site-header {
          display: block;
          width: 100%;
        }

        .bw-header-wrap {
          --green: #1B5E20;
          --green-dark: #102414;
          --yellow: #FFE600;
          --lime: #7CB342;
          --light-green: #C5E1A5;
          --cream: #FAFAF5;
          --text: #212121;
          --muted: #4E5A4E;
          background: #FFFFFF;
          color: var(--text);
          font-family: Montserrat, Arial, sans-serif;
          margin: 0;
          position: relative;
          width: 100%;
          z-index: 100;
        }

        .bw-header-wrap *,
        .bw-header-wrap *::before,
        .bw-header-wrap *::after {
          box-sizing: border-box;
        }

        .bw-header-wrap a {
          color: inherit;
          text-decoration: none;
        }

        .bw-header-inner {
          margin: 0 auto;
          max-width: 1280px;
          padding: 0 24px;
          width: 100%;
        }

        /* Top mini-bar */
        .bw-header-top {
          background: var(--green);
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.6px;
          line-height: 1;
          overflow: hidden;
          transition: max-height 220ms ease, opacity 180ms ease;
          max-height: 36px;
          opacity: 1;
        }

        .bw-header-top-items {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 6px 18px;
          justify-content: center;
          padding: 11px 0;
        }

        .bw-header-top-item {
          align-items: center;
          display: inline-flex;
          gap: 6px;
        }

        .bw-header-top-star {
          color: var(--yellow);
          font-size: 13px;
          line-height: 1;
        }

        .bw-header-top-sep {
          color: rgba(255, 255, 255, 0.35);
          font-size: 10px;
        }

        /* Main bar */
        .bw-header {
          background: #FFFFFF;
          border-bottom: 1px solid transparent;
          transition: padding 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
        }

        .bw-header-main {
          align-items: center;
          display: flex;
          gap: 24px;
          justify-content: space-between;
          padding: 30px 24px;
          transition: padding 200ms ease;
        }

        .bw-header-logo {
          align-items: center;
          display: inline-flex;
          flex: 0 0 auto;
        }

        .bw-header-logo img {
          display: block;
          height: 40px;
          transition: height 200ms ease;
          width: auto;
        }

        .bw-header-nav {
          flex: 1 1 auto;
        }

        .bw-header-nav-list {
          align-items: center;
          display: flex;
          gap: 4px;
          justify-content: center;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .bw-header-nav a,
        .bw-header-dropdown-trigger {
          background: none;
          border: 0;
          border-radius: 8px;
          color: var(--green);
          cursor: pointer;
          font-family: inherit;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1.2px;
          line-height: 1;
          padding: 12px 14px;
          text-transform: uppercase;
          transition: background 140ms ease, color 140ms ease;
        }

        .bw-header-nav a:hover,
        .bw-header-nav a:focus-visible,
        .bw-header-dropdown-trigger:hover,
        .bw-header-dropdown-trigger:focus-visible {
          background: var(--cream);
          outline: none;
        }

        .bw-header-wrap .bw-badge-new,
        .bw-header-mobile .bw-badge-new {
          background: var(--yellow);
          color: var(--green-dark);
          font-size: 8px;
          font-weight: 900;
          padding: 2px 5px;
          border-radius: 999px;
          margin-left: 6px;
          display: inline-flex;
          align-items: center;
          vertical-align: middle;
          letter-spacing: 0.6px;
          line-height: 1;
          text-transform: uppercase;
        }

        .bw-header-mobile .bw-badge-new {
          font-size: 9px;
          letter-spacing: 0.7px;
          margin-left: 8px;
          padding: 3px 7px;
          transform: translateY(-3px);
        }

        .bw-header-submenu .bw-badge-new {
          background: var(--yellow);
          color: var(--green-dark);
          font-size: 8px;
          font-weight: 900;
          padding: 2px 6px;
          border-radius: 999px;
          margin-left: 8px;
          display: inline-flex;
          align-items: center;
          vertical-align: middle;
          letter-spacing: 0.6px;
          line-height: 1;
          text-transform: uppercase;
        }

        .bw-header-dropdown {
          position: relative;
        }

        .bw-header-dropdown-trigger {
          align-items: center;
          display: inline-flex;
          gap: 4px;
        }

        .bw-header-dropdown-trigger .bw-header-caret {
          font-size: 10px;
          line-height: 1;
          transition: transform 160ms ease;
        }

        .bw-header-dropdown-open .bw-header-dropdown-trigger .bw-header-caret {
          transform: rotate(180deg);
        }

        .bw-header-submenu {
          --green: #1B5E20;
          --green-dark: #102414;
          --yellow: #FFE600;
          --light-green: #C5E1A5;
          --cream: #FAFAF5;
          background: #FFFFFF;
          border: 1px solid var(--light-green);
          border-radius: 10px;
          box-shadow: 0 18px 44px rgba(27, 94, 32, 0.16);
          font-family: Montserrat, Arial, sans-serif;
          left: 0;
          list-style: none;
          margin: 0;
          min-width: 240px;
          opacity: 0;
          padding: 10px;
          pointer-events: none;
          position: fixed;
          top: 0;
          transform: translateY(-4px);
          transition: opacity 160ms ease, transform 160ms ease;
          visibility: hidden;
          z-index: 2147483647;
        }
        .bw-header-submenu * { box-sizing: border-box; }
        .bw-header-submenu a {
          color: inherit;
          text-decoration: none;
        }

        .bw-header-submenu.bw-header-submenu-open {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
          visibility: visible;
        }

        .bw-header-submenu a {
          border-radius: 6px;
          color: var(--green);
          display: block;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.4px;
          line-height: 1.3;
          padding: 12px 14px;
          text-transform: none;
        }

        .bw-header-submenu a:hover,
        .bw-header-submenu a:focus-visible {
          background: var(--cream);
          color: var(--green-dark);
        }

        .bw-header-cta {
          align-items: center;
          display: flex;
          flex: 0 0 auto;
          gap: 12px;
        }

        .bw-header-book {
          align-items: center;
          background: var(--yellow);
          border-radius: 999px;
          color: var(--green);
          display: inline-flex;
          font-size: 13px;
          font-weight: 800;
          justify-content: center;
          letter-spacing: 1px;
          line-height: 1;
          min-height: 44px;
          padding: 12px 22px;
          text-transform: uppercase;
          transition: background 160ms ease, color 160ms ease, transform 160ms ease;
        }

        .bw-header-book:hover,
        .bw-header-book:focus-visible {
          background: #fff04a;
          color: var(--green-dark);
          outline: none;
          transform: translateY(-1px);
        }

        .bw-header-hamburger {
          background: none;
          border: 0;
          cursor: pointer;
          display: none;
          flex-direction: column;
          gap: 5px;
          height: 40px;
          justify-content: center;
          padding: 8px;
          width: 40px;
        }

        .bw-header-hamburger span {
          background: var(--green);
          border-radius: 2px;
          display: block;
          height: 2.5px;
          transition: transform 200ms ease, opacity 160ms ease;
          width: 24px;
        }

        .bw-header-hamburger-open span:nth-child(1) {
          transform: translateY(7.5px) rotate(45deg);
        }
        .bw-header-hamburger-open span:nth-child(2) {
          opacity: 0;
        }
        .bw-header-hamburger-open span:nth-child(3) {
          transform: translateY(-7.5px) rotate(-45deg);
        }

        /* Scroll progress */
        .bw-header-progress {
          background: rgba(27, 94, 32, 0.06);
          height: 2px;
          position: relative;
          width: 100%;
        }

        .bw-header-progress-bar {
          background: linear-gradient(90deg, var(--green), var(--lime), var(--yellow));
          height: 100%;
          transition: width 80ms linear;
          width: 0%;
        }

        /* Shrunk state */
        .bw-header-shrunk .bw-header-top {
          max-height: 0;
          opacity: 0;
        }

        .bw-header-shrunk .bw-header {
          box-shadow: none;
        }

        .bw-header-shrunk .bw-header-main {
          padding: 8px 24px;
        }

        .bw-header-shrunk .bw-header-logo img {
          height: 32px;
        }

        .bw-header-shrunk .bw-header-book {
          min-height: 38px;
          padding: 10px 18px;
        }

        /* Focus styles */
        .bw-header-wrap a:focus-visible,
        .bw-header-wrap button:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.9);
          outline-offset: 2px;
        }

        /* Mobile overlay */
        .bw-header-mobile {
          --green: #1B5E20;
          --green-dark: #102414;
          --yellow: #FFE600;
          --light-green: #C5E1A5;
          --cream: #FAFAF5;
          background: rgba(16, 36, 20, 0.92);
          font-family: Montserrat, Arial, sans-serif;
          inset: 0;
          opacity: 0;
          pointer-events: none;
          position: fixed;
          transition: opacity 220ms ease;
          z-index: 2147483646;
        }
        .bw-header-mobile * { box-sizing: border-box; }
        .bw-header-mobile a {
          color: inherit;
          text-decoration: none;
        }

        .bw-header-mobile-open {
          opacity: 1;
          pointer-events: auto;
        }

        .bw-header-mobile-inner {
          background: var(--green);
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          height: 100%;
          margin-left: auto;
          max-width: 420px;
          padding: 20px 24px 24px;
          transform: translateX(100%);
          transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
          width: 100%;
        }

        .bw-header-mobile-open .bw-header-mobile-inner {
          transform: translateX(0);
        }

        .bw-header-mobile-head {
          align-items: center;
          display: flex;
          justify-content: space-between;
          margin-bottom: 28px;
        }

        .bw-header-mobile-head img {
          background: #FFFFFF;
          border-radius: 6px;
          display: block;
          height: 34px;
          padding: 5px 9px;
          width: auto;
        }

        .bw-header-mobile-close {
          background: none;
          border: 0;
          color: #FFFFFF;
          cursor: pointer;
          font-size: 32px;
          height: 44px;
          line-height: 1;
          padding: 0;
          width: 44px;
        }

        .bw-header-mobile-nav {
          display: flex;
          flex: 1 1 auto;
          flex-direction: column;
          gap: 4px;
          overflow-y: auto;
        }

        .bw-header-mobile-nav a {
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          color: #FFFFFF;
          display: block;
          font-size: 19px;
          font-weight: 800;
          letter-spacing: 0.4px;
          line-height: 1.2;
          padding: 14px 0;
          text-transform: none;
        }

        .bw-header-mobile-nav a:hover {
          color: var(--yellow);
        }

        .bw-header-mobile-section-label {
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          color: #FFFFFF;
          cursor: pointer;
          font-size: 19px;
          font-weight: 800;
          letter-spacing: 0.4px;
          line-height: 1.2;
          padding: 14px 0;
          text-transform: none;
        }

        .bw-header-mobile-section-label::marker {
          color: var(--yellow);
          font-size: 13px;
        }

        .bw-header-mobile-section[open] .bw-header-mobile-section-label {
          color: var(--yellow);
        }

        .bw-header-mobile-section a {
          font-size: 16px;
          padding: 11px 0 11px 18px;
        }

        .bw-header-mobile-cta {
          margin-top: 22px;
        }

        .bw-header-mobile-cta .bw-header-book {
          background: var(--yellow);
          color: var(--green);
          font-size: 14px;
          min-height: 52px;
          width: 100%;
        }

        .bw-header-mobile-cta .bw-header-book:hover {
          background: #fff04a;
        }

        .bw-header-mobile-trust {
          color: rgba(255, 255, 255, 0.7);
          font-family: Merriweather, Georgia, serif;
          font-size: 13px;
          line-height: 1.5;
          margin: 14px 0 0;
          text-align: center;
        }

        .bw-header-mobile-trust strong {
          color: var(--yellow);
          font-family: Montserrat, Arial, sans-serif;
          font-weight: 800;
        }

        /* Compact breakpoint */
        @media (max-width: 980px) {
          .bw-header-top {
            display: none !important;
          }
          .bw-header-nav {
            display: none !important;
          }
          .bw-header-cta .bw-header-book {
            display: none !important;
          }
          .bw-header-hamburger {
            display: flex !important;
          }
          .bw-header {
            background: #FFFFFF !important;
          }
          .bw-header-main {
            align-items: center !important;
            background: #FFFFFF !important;
            display: flex !important;
            flex-direction: row !important;
            gap: 12px;
            justify-content: space-between !important;
            min-height: 90px;
            padding: 10px 18px !important;
          }
          .bw-header-logo {
            display: inline-flex !important;
            flex: 0 0 auto;
          }
          .bw-header-logo img {
            display: block !important;
            height: 36px !important;
            max-width: 200px;
            width: auto !important;
          }
          .bw-header-cta {
            display: flex !important;
            flex: 0 0 auto;
          }
          .bw-header-shrunk .bw-header-main {
            min-height: 56px;
            padding: 8px 18px !important;
          }
          .bw-header-shrunk .bw-header-logo img {
            height: 30px !important;
          }
        }
      </style>

      <div class="bw-header-wrap">
        <div class="bw-header-top" aria-hidden="false">
          <div class="bw-header-inner">
            <div class="bw-header-top-items">
              <span class="bw-header-top-item">
                <span class="bw-header-top-star" aria-hidden="true">★</span>
                <span>9.8 / 10 on FreeTour</span>
              </span>
              <span class="bw-header-top-sep" aria-hidden="true">•</span>
              <span class="bw-header-top-item">Free · Tip-based</span>
              <span class="bw-header-top-sep bw-header-top-item-hide-sm" aria-hidden="true">•</span>
              <span class="bw-header-top-item bw-header-top-item-hide-sm">Tue-Sat 11:30 &amp; 15:30 · World Clock</span>
            </div>
          </div>
        </div>

        <header class="bw-header" role="banner">
          <div class="bw-header-inner bw-header-main">
            <a class="bw-header-logo" href="${BW_HEADER_LINKS.home}" aria-label="BerlinWalk home">
              <img src="${BW_HEADER_LOGO_URL}" alt="BerlinWalk" width="897" height="188" loading="eager" decoding="async">
            </a>

            <nav class="bw-header-nav" aria-label="Primary">
              <ul class="bw-header-nav-list">
                <li class="bw-header-dropdown">
                  <button class="bw-header-dropdown-trigger" type="button" aria-expanded="false" aria-controls="${this._tourMenuId}">
                    Tour <span class="bw-header-caret" aria-hidden="true">⌄</span>
                  </button>
                  <ul id="${this._tourMenuId}" class="bw-header-submenu">
                    <li><a href="${BW_HEADER_LINKS.route}">Tour Route</a></li>
                    <li><a href="${BW_HEADER_LINKS.meetingPoint}">Meeting Point</a></li>
                    <li><a href="${BW_HEADER_LINKS.reviews}">Reviews</a></li>
                    <li><a href="${BW_HEADER_LINKS.guide}">The Guide</a></li>
                  </ul>
                </li>
                <li class="bw-header-dropdown">
                  <button class="bw-header-dropdown-trigger" type="button" aria-expanded="false" aria-controls="${this._productsMenuId}">
                    Products <span class="bw-header-caret" aria-hidden="true">⌄</span>
                  </button>
                  <ul id="${this._productsMenuId}" class="bw-header-submenu">
                    <li><a href="${BW_HEADER_LINKS.planner}">Berlin Trip Planner</a></li>
                    <li><a href="${BW_HEADER_LINKS.audioTours}">Audio Tours</a></li>
                    <li><a href="${BW_HEADER_LINKS.firstDayRescue}">First-Day Rescue Plan</a></li>
                    <li><a href="${BW_HEADER_LINKS.photoMissions}">Photo Missions</a></li>
                  </ul>
                </li>
                <li><a href="${BW_HEADER_LINKS.games}">Games</a></li>
                <li><a href="${BW_HEADER_LINKS.blog}">Blog</a></li>
                <li><a href="${BW_HEADER_LINKS.plan}">Berlin Hacks</a></li>
              </ul>
            </nav>

            <div class="bw-header-cta">
              <a class="bw-header-book" href="${BW_HEADER_BOOKING_URL}">Book Now</a>
              <button class="bw-header-hamburger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="${this._mobileMenuId}">
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>

          <div class="bw-header-progress" aria-hidden="true">
            <div class="bw-header-progress-bar"></div>
          </div>
        </header>

        <div id="${this._mobileMenuId}" class="bw-header-mobile" aria-hidden="true" aria-label="Mobile menu">
          <div class="bw-header-mobile-inner">
            <div class="bw-header-mobile-head">
              <img src="${BW_HEADER_LOGO_URL}" alt="BerlinWalk" width="897" height="188">
              <button class="bw-header-mobile-close" type="button" aria-label="Close menu">×</button>
            </div>

            <nav class="bw-header-mobile-nav" aria-label="Mobile primary">
              <details class="bw-header-mobile-section">
                <summary class="bw-header-mobile-section-label">Tour</summary>
                <a href="${BW_HEADER_LINKS.route}">Tour Route</a>
                <a href="${BW_HEADER_LINKS.meetingPoint}">Meeting Point</a>
                <a href="${BW_HEADER_LINKS.reviews}">Reviews</a>
                <a href="${BW_HEADER_LINKS.guide}">The Guide</a>
              </details>

              <details class="bw-header-mobile-section">
                <summary class="bw-header-mobile-section-label">Products</summary>
                <a href="${BW_HEADER_LINKS.planner}">Berlin Trip Planner</a>
                <a href="${BW_HEADER_LINKS.audioTours}">Audio Tours</a>
                <a href="${BW_HEADER_LINKS.firstDayRescue}">First-Day Rescue Plan</a>
                <a href="${BW_HEADER_LINKS.photoMissions}">Photo Missions</a>
              </details>

              <a href="${BW_HEADER_LINKS.games}">Games</a>
              <a href="${BW_HEADER_LINKS.blog}">Blog</a>
              <a href="${BW_HEADER_LINKS.plan}">Berlin Hacks</a>
            </nav>

            <div class="bw-header-mobile-cta">
              <a class="bw-header-book" href="${BW_HEADER_BOOKING_URL}">Book Your Free Tour</a>
              <p class="bw-header-mobile-trust"><span aria-hidden="true">★ </span><strong>9.8 / 10</strong> on FreeTour · Tue-Sat 11:30 &amp; 15:30 · World Clock</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

if (!customElements.get('bw-site-header')) {
  customElements.define('bw-site-header', BWHeaderElement);
}
