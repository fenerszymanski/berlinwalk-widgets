(function () {
  const REGISTRY = window.BerlinWalkNativeGameMount || {};
  const loaded = new WeakMap();

  function absoluteUrl(value, baseUrl) {
    if (!value || /^(data:|blob:|mailto:|tel:|#)/i.test(value)) return value;
    return new URL(value, baseUrl).toString();
  }

  function rewriteCssUrls(css, baseUrl) {
    return String(css || '').replace(/url\((['"]?)(?!data:|blob:|https?:|\/\/|#)([^'")]+)\1\)/gi, function (_, quote, raw) {
      return 'url(' + (quote || '"') + absoluteUrl(raw.trim(), baseUrl) + (quote || '"') + ')';
    });
  }

  function rewriteNodeUrls(root, baseUrl) {
    root.querySelectorAll('[src]').forEach(function (node) {
      node.setAttribute('src', absoluteUrl(node.getAttribute('src'), baseUrl));
    });
    root.querySelectorAll('[href]').forEach(function (node) {
      const href = node.getAttribute('href');
      if (href && !href.startsWith('#')) node.setAttribute('href', absoluteUrl(href, baseUrl));
    });
    root.querySelectorAll('[srcset]').forEach(function (node) {
      const srcset = node.getAttribute('srcset') || '';
      const rewritten = srcset.split(',').map(function (part) {
        const bits = part.trim().split(/\s+/);
        if (!bits[0]) return '';
        bits[0] = absoluteUrl(bits[0], baseUrl);
        return bits.join(' ');
      }).filter(Boolean).join(', ');
      node.setAttribute('srcset', rewritten);
    });
  }

  function appendStyles(shadow, doc, baseUrl) {
    doc.querySelectorAll('link[rel="stylesheet"]').forEach(function (link) {
      const clone = document.createElement('link');
      clone.rel = 'stylesheet';
      clone.href = absoluteUrl(link.getAttribute('href'), baseUrl);
      shadow.appendChild(clone);
    });
    doc.querySelectorAll('style').forEach(function (style) {
      const clone = document.createElement('style');
      clone.textContent = rewriteCssUrls(style.textContent || '', baseUrl);
      shadow.appendChild(clone);
    });
  }

  function transformBattleScript(code) {
    return code
      .replace("var root = document.getElementById('bw-berlin-battle');", "var root = __bwRoot.querySelector('#bw-berlin-battle');")
      .replace("var URL_PARAMS = new URLSearchParams(window.location.search || '');", "var URL_PARAMS = new URLSearchParams(__bwGameSearch || window.location.search || '');")
      .replace("var DATA_URL = 'data.json?v=' + encodeURIComponent(ASSET_BUILD);", "var DATA_URL = new URL('data.json?v=' + encodeURIComponent(ASSET_BUILD), __bwBaseUrl).toString();")
      .replace("return src + (src.indexOf('?') === -1 ? '?' : '&') + 'v=' + encodeURIComponent(version);", "var versioned = src + (src.indexOf('?') === -1 ? '?' : '&') + 'v=' + encodeURIComponent(version); return new URL(versioned, __bwBaseUrl).toString();")
      .replace("return new URLSearchParams(window.location.search || '').get(key) || '';", "return URL_PARAMS.get(key) || new URLSearchParams(window.location.search || '').get(key) || '';")
      .replace("if (!window.parent || window.parent === window) return;\n    [80, 280].forEach(function (delay) {", "if (!window.parent || window.parent === window) { window.dispatchEvent(new CustomEvent('bw-battle-focus-game', { detail: { reason: reason || 'topic_start', topic: state.topic ? state.topic.id : '' } })); return; }\n    [80, 280].forEach(function (delay) {");
  }

  function transformDayScript(code) {
    return code
      .replace("const screen = document.getElementById('screen');", "const screen = __bwRoot.querySelector('#screen');")
      .replace("const toast = document.getElementById('toast');", "const toast = __bwRoot.querySelector('#toast');")
      .replace("const soundToggle = document.getElementById('soundToggle');", "const soundToggle = __bwRoot.querySelector('#soundToggle');")
      .replace("const params = new URLSearchParams(window.location.search);", "const params = new URLSearchParams(__bwGameSearch || window.location.search);")
      .replace("const url = new URL(path, window.location.href);", "const url = new URL(path, __bwBaseUrl);")
      .replace("const response = await fetch(`data.json?v=${DATA_VERSION}`);", "const response = await fetch(new URL(`data.json?v=${DATA_VERSION}`, __bwBaseUrl).toString());");
  }

  function transformScript(code, kind) {
    if (kind === 'battle') return transformBattleScript(code);
    if (kind === 'day-survival') return transformDayScript(code);
    return code;
  }

  function runScript(code, mount) {
    const script = document.createElement('script');
    script.text = [
      '(function(){',
      'const __bwMount=window.__BW_NATIVE_GAME_MOUNTS&&window.__BW_NATIVE_GAME_MOUNTS.get("' + mount.id + '");',
      'if(!__bwMount||!__bwMount.root)return;',
      'const __bwRoot=__bwMount.root;',
      'const __bwBaseUrl=__bwMount.baseUrl;',
      'const __bwGameSearch=__bwMount.gameSearch;',
      code,
      '}());'
    ].join('\n');
    document.head.appendChild(script);
    script.remove();
  }

  async function mountGame(options) {
    const host = options && options.host;
    if (!host || loaded.get(host)) return;
    loaded.set(host, true);

    const gameUrl = new URL(options.url);
    const baseUrl = options.baseUrl || new URL('./', gameUrl).toString();
    const kind = options.kind || '';
    host.textContent = '';
    host.setAttribute('data-bw-native-game-state', 'loading');

    const shadow = host.shadowRoot || host.attachShadow({ mode: 'open' });
    shadow.innerHTML = '<style>:host{display:block;width:100%;min-width:0}.bw-native-loading{align-items:center;color:#1B5E20;display:grid;font-family:Montserrat,Arial,sans-serif;font-weight:800;min-height:320px;place-items:center;text-align:center}</style><div class="bw-native-loading">Loading game...</div>';

    try {
      const response = await fetch(gameUrl.toString(), { cache: 'no-store', mode: 'cors' });
      if (!response.ok) throw new Error('Game request failed');
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const body = doc.body.cloneNode(true);
      const scripts = Array.from(body.querySelectorAll('script')).map(function (script) {
        script.remove();
        return script.textContent || '';
      }).filter(Boolean);

      rewriteNodeUrls(body, baseUrl);
      shadow.innerHTML = '';
      appendStyles(shadow, doc, baseUrl);
      Array.from(body.childNodes).forEach(function (node) {
        shadow.appendChild(document.importNode(node, true));
      });

      window.__BW_NATIVE_GAME_MOUNTS = window.__BW_NATIVE_GAME_MOUNTS || new Map();
      const id = 'bwng_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
      const mount = {
        id,
        root: shadow,
        baseUrl,
        gameSearch: gameUrl.search || window.location.search || ''
      };
      window.__BW_NATIVE_GAME_MOUNTS.set(id, mount);
      scripts.forEach(function (scriptCode) {
        runScript(transformScript(scriptCode, kind), mount);
      });
      host.setAttribute('data-bw-native-game-state', 'ready');
    } catch (error) {
      host.setAttribute('data-bw-native-game-state', 'error');
      shadow.innerHTML = '<style>:host{display:block}.bw-native-error{background:#FAFAF5;border:2px solid #1B5E20;border-radius:12px;color:#1B5E20;font-family:Montserrat,Arial,sans-serif;font-weight:800;line-height:1.45;margin:12px;padding:24px;text-align:center}</style><div class="bw-native-error">The game could not load here. Please refresh this page.</div>';
      console.error('[BerlinWalk native game mount]', error);
    }
  }

  REGISTRY.mount = mountGame;
  window.BerlinWalkNativeGameMount = REGISTRY;
}());
