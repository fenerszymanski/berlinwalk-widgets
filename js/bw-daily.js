(() => {
  const DAY_FORMATTER = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const PARTS_FORMATTER = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });

  function berlinDate(value = Date.now()) {
    return DAY_FORMATTER.format(typeof value === 'number' ? new Date(value) : value);
  }

  function berlinParts(value = Date.now()) {
    const parts = PARTS_FORMATTER.formatToParts(typeof value === 'number' ? new Date(value) : value);
    const out = {};
    parts.forEach((part) => {
      if (part.type !== 'literal') out[part.type] = part.value;
    });
    return {
      year: Number(out.year),
      month: Number(out.month),
      day: Number(out.day),
      hour: Number(out.hour),
      minute: Number(out.minute),
      second: Number(out.second),
    };
  }

  function berlinMidnightCountdownMs(value = Date.now()) {
    const now = berlinParts(value);
    const berlinNowMs = Date.UTC(now.year, now.month - 1, now.day, now.hour, now.minute, now.second);
    const nextMidnightMs = Date.UTC(now.year, now.month - 1, now.day + 1, 0, 0, 0);
    return Math.max(0, nextMidnightMs - berlinNowMs);
  }

  function formatCountdown(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  function countdown(el, { label = 'Next set in', tickMs = 1000 } = {}) {
    if (!el) return { stop() {} };
    let timer = null;

    const paint = () => {
      el.textContent = `${label} ${formatCountdown(berlinMidnightCountdownMs())}`;
    };

    paint();
    timer = window.setInterval(paint, tickMs);
    return {
      stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }
    };
  }

  function readJson(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
    return value;
  }

  function previousBerlinDate(dayKey) {
    const [year, month, day] = String(dayKey || '').split('-').map(Number);
    if (!year || !month || !day) return '';
    const date = new Date(Date.UTC(year, month - 1, day - 1));
    return berlinDate(date);
  }

  function dayDistance(from, to) {
    if (!from || !to) return Number.POSITIVE_INFINITY;
    const start = Date.parse(`${from}T00:00:00Z`);
    const end = Date.parse(`${to}T00:00:00Z`);
    if (!Number.isFinite(start) || !Number.isFinite(end)) return Number.POSITIVE_INFINITY;
    return Math.round((end - start) / 86400000);
  }

  function streak(namespace) {
    const key = `bw_${namespace}_streak`;
    const empty = {
      lastPlayed: '',
      current: 0,
      max: 0,
      history: [],
    };

    const load = () => {
      const state = readJson(key, empty);
      return {
        lastPlayed: state.lastPlayed || '',
        current: Number(state.current || 0),
        max: Number(state.max || 0),
        history: Array.isArray(state.history) ? state.history.slice(0, 180) : [],
      };
    };

    const save = (state) => writeJson(key, state);

    return {
      read() {
        return load();
      },
      touch(dayKey = berlinDate(), detail = {}) {
        const state = load();
        if (state.lastPlayed === dayKey) return state;
        const diff = dayDistance(state.lastPlayed, dayKey);
        const current = diff === 1 ? state.current + 1 : 1;
        const next = {
          lastPlayed: dayKey,
          current,
          max: Math.max(state.max, current),
          history: [{ dayKey, ...detail }, ...state.history].slice(0, 180),
        };
        save(next);
        return next;
      },
      reset() {
        save(empty);
        return load();
      }
    };
  }

  function hash(value) {
    let out = 0;
    String(value || '').split('').forEach((char) => {
      out = ((out << 5) - out + char.charCodeAt(0)) | 0;
    });
    return Math.abs(out);
  }

  function resolveScheduleEntry(schedule, dayKey, fallbackPool) {
    const direct = schedule && schedule[dayKey];
    if (direct) {
      if (Array.isArray(direct)) return { ids: direct };
      if (direct && Array.isArray(direct.ids)) return direct;
    }
    if (!Array.isArray(fallbackPool) || !fallbackPool.length) {
      return { ids: [] };
    }
    const size = Math.min(3, fallbackPool.length);
    const seed = hash(dayKey);
    const ids = [];
    for (let i = 0; i < size; i += 1) {
      ids.push(fallbackPool[(seed + i) % fallbackPool.length]);
    }
    return { ids, theme: 'Fallback set', teaser: 'Tomorrow shifts to another Berlin layer.' };
  }

  async function scheduleLoad(url, { dayKey = berlinDate(), fallbackPool = [] } = {}) {
    let schedule = null;
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) schedule = await response.json();
    } catch {}
    return {
      dayKey,
      schedule: schedule || {},
      entry: resolveScheduleEntry(schedule || {}, dayKey, fallbackPool),
    };
  }

  window.BerlinWalkDaily = {
    berlinDate,
    berlinParts,
    berlinMidnightCountdownMs,
    countdown,
    streak,
    scheduleLoad,
    readJson,
    writeJson,
    previousBerlinDate,
    dayDistance,
  };
})();
