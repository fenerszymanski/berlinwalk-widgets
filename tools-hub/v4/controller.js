export function mountCatalog(root, catalog, changed) {
const controller=new AbortController();
const listenDocument=(type, fn)=>document.addEventListener(type,fn,{signal:controller.signal});
const listenWindow=(type, fn)=>window.addEventListener(type,fn,{signal:controller.signal});

const {state, render, href} = catalog;
let current = state(location.search);

function ensureActiveCategoryVisible(prevScrollLeft = null) {
  const nav = root.querySelector('[data-category-nav]');
  if (!nav) return;

  if (typeof prevScrollLeft === 'number' && prevScrollLeft > 0) {
    nav.scrollLeft = prevScrollLeft;
  }

  if (nav.scrollWidth <= nav.clientWidth + 2) return;

  const active = nav.querySelector('a[aria-current="true"]');
  if (!active) return;

  const navRect = nav.getBoundingClientRect();
  const itemRect = active.getBoundingClientRect();
  const pad = 16;

  if (itemRect.left < navRect.left + pad) {
    nav.scrollLeft -= (navRect.left + pad) - itemRect.left;
  } else if (itemRect.right > navRect.right - pad) {
    nav.scrollLeft += itemRect.right - (navRect.right - pad);
  }
}

function closeTypePopover(restoreFocus = false) {
  const wrap = root.querySelector('[data-type-filter]');
  if (!wrap) return;
  const trigger = wrap.querySelector('[data-type-trigger]');
  const popover = wrap.querySelector('[data-type-popover]');
  if (!trigger || !popover || popover.hidden) return;
  popover.hidden = true;
  trigger.setAttribute('aria-expanded', 'false');
  wrap.classList.remove('is-open');
  if (restoreFocus) trigger.focus({ preventScroll: true });
}

function openTypePopover(focusActive = false) {
  const wrap = root.querySelector('[data-type-filter]');
  if (!wrap) return;
  const trigger = wrap.querySelector('[data-type-trigger]');
  const popover = wrap.querySelector('[data-type-popover]');
  if (!trigger || !popover) return;
  popover.hidden = false;
  trigger.setAttribute('aria-expanded', 'true');
  wrap.classList.add('is-open');
  const rect = trigger.getBoundingClientRect();
  const viewport = window.visualViewport;
  const top = viewport?.offsetTop || 0;
  const bottom = top + (viewport?.height || window.innerHeight);
  const below = bottom - rect.bottom - 12;
  const above = rect.top - top - 12;
  const opensUp = below < Math.min(popover.scrollHeight, 280) && above > below;
  wrap.classList.toggle('opens-up', opensUp);
  popover.style.maxHeight = `${Math.max(44, (opensUp ? above : below) - 6)}px`;
  if (focusActive) {
    const target = popover.querySelector('[data-type-option].is-active') || popover.querySelector('[data-type-option]');
    target?.focus({ preventScroll: true });
  }
}

function navigate(url, { focus = true, push = true, focusTypeTrigger = false } = {}) {
  const prevNav = root.querySelector('[data-category-nav]');
  const prevScrollLeft = prevNav ? prevNav.scrollLeft : null;

  document.documentElement.classList.remove('search-focused');
  if (push && url !== location.pathname + location.search) {
    history.pushState({}, '', url);
  }
  current = state(location.search);
  root.innerHTML = render(current);
  bind();
  ensureActiveCategoryVisible(prevScrollLeft);
  changed?.(current);

  if (focusTypeTrigger) {
    const trigger = root.querySelector('[data-type-trigger]');
    trigger?.focus({ preventScroll: true });
  } else if (focus) {
    const title = root.querySelector('#results-title');
    if (title) {
      title.focus({ preventScroll: true });
      title.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }
}

function bind() {
  root.querySelectorAll('[data-state]').forEach((a) =>
    a.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      const isTypeOpt = a.hasAttribute('data-type-option');
      navigate(a.getAttribute('href'), {
        focus: !isTypeOpt,
        push: true,
        focusTypeTrigger: isTypeOpt,
      });
    }),
  );

  root.querySelector('[data-type-trigger]')?.addEventListener('click', (e) => {
    e.preventDefault();
    const popover = root.querySelector('[data-type-popover]');
    if (popover && popover.hidden) {
      openTypePopover(true);
    } else {
      closeTypePopover(false);
    }
  });

  root.querySelector('#search-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get('q');
    navigate(href(current, { q: String(q || '').trim(), page: 1 }), { focus: true, push: true });
  });

  root.querySelector('.suggestion-toggle')?.addEventListener('click', (e) => {
    const open = e.currentTarget.getAttribute('aria-expanded') !== 'true';
    e.currentTarget.setAttribute('aria-expanded', String(open));
    e.currentTarget.textContent = open ? 'Show less' : 'Show 3 more';
    root.querySelector('.suggestions')?.classList.toggle('expanded', open);
  });

  root.querySelector('#search')?.addEventListener('focus', () => {
    if (matchMedia('(max-width: 700px)').matches) {
      document.documentElement.classList.add('search-focused');
      requestAnimationFrame(() =>
        root.querySelector('#search-form')?.scrollIntoView({ block: 'start', behavior: 'instant' }),
      );
    }
  });

  root.querySelector('#search')?.addEventListener('blur', () => {
    document.documentElement.classList.remove('search-focused');
  });
}

listenDocument('click', (e) => {
  const openPopover = root.querySelector('[data-type-popover]:not([hidden])');
  if (openPopover && !e.target.closest('[data-type-filter]')) {
    closeTypePopover(false);
  }
});

listenDocument('focusin', (e) => {
  if (!e.target.closest('[data-type-filter]')) closeTypePopover(false);
});

listenDocument('keydown', (e) => {
  const openPopover = root.querySelector('[data-type-popover]:not([hidden])');
  if (!openPopover) {
    const trigger = e.target.closest?.('[data-type-trigger]');
    if (trigger && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      openTypePopover(true);
    }
    return;
  }

  if (!e.target.closest('[data-type-filter]')) {
    closeTypePopover(false);
    return;
  }

  if (e.key === 'Tab') {
    closeTypePopover(true);
    return;
  }

  if (e.key === 'Escape') {
    e.preventDefault();
    closeTypePopover(true);
    return;
  }

  if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
    const opts = [...openPopover.querySelectorAll('[data-type-option]')];
    if (!opts.length) return;
    e.preventDefault();
    const idx = opts.indexOf(document.activeElement);
    let nextIdx = 0;
    if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = opts.length - 1;
    else if (e.key === 'ArrowDown') nextIdx = idx >= 0 ? (idx + 1) % opts.length : 0;
    else if (e.key === 'ArrowUp') nextIdx = idx > 0 ? idx - 1 : opts.length - 1;
    opts[nextIdx]?.focus({ preventScroll: true });
  }
});

if (!root.querySelector('h1')) {
  root.innerHTML = render(current);
}
bind();
ensureActiveCategoryVisible();

listenWindow('popstate', () => {
  navigate(location.pathname + location.search, { focus: false, push: false });
});

return ()=>{controller.abort();document.documentElement.classList.remove('search-focused');};
}
