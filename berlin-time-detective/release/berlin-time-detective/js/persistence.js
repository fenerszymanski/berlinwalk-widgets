import { createInitialDurable, selectDurableState, serializeDurable, validateDurable } from "./game-state.js";

export const STORAGE_KEYS = Object.freeze({
  current: "berlin-time-detective-v2-current",
  staging: "berlin-time-detective-v2-staging",
  lastGood: "berlin-time-detective-v2-last-good",
});

function safeParse(value) {
  if (!value) return null;
  try { return validateDurable(JSON.parse(value)); } catch { return null; }
}

function defaultStorage() {
  try { return globalThis.localStorage; } catch { return null; }
}

export function createPersistence({ storage = defaultStorage(), onStatus = () => {} } = {}) {
  let usable = true;
  let verifiedRevision = null;
  let verifiedSerialized = null;
  let verifiedStatePresent = false;
  let writeBlocked = false;

  function rememberVerified(durable, statePresent = true) {
    const validated = validateDurable(durable);
    if (!validated) return false;
    verifiedRevision = validated.revision;
    verifiedSerialized = serializeDurable(validated);
    verifiedStatePresent = statePresent;
    writeBlocked = false;
    return true;
  }

  function read(key) {
    if (!storage) { usable = false; return null; }
    try { return safeParse(storage?.getItem(key)); } catch (error) { usable = false; onStatus({ type: "storage-error", error }); return null; }
  }

  function write(key, value) {
    if (!storage) { usable = false; return false; }
    try { storage?.setItem(key, value); return true; } catch (error) { usable = false; onStatus({ type: "storage-error", error }); return false; }
  }

  function remove(key) {
    if (!storage) { usable = false; return; }
    try { storage?.removeItem(key); } catch (error) { usable = false; onStatus({ type: "storage-error", error }); }
  }

  function load() {
    const current = read(STORAGE_KEYS.current);
    if (current) { rememberVerified(current, true); return { durable: current, source: "current", warning: null }; }
    const lastGood = read(STORAGE_KEYS.lastGood);
    if (lastGood) { rememberVerified(lastGood, false); return { durable: lastGood, source: "last-good", warning: "The latest saved copy was unavailable. An earlier verified case copy is open." }; }
    const fresh = createInitialDurable();
    rememberVerified(fresh, false);
    const warning = usable ? null : "Saving is unavailable in this browser. The case can continue in memory, but it will not be marked saved.";
    return { durable: fresh, source: "fresh", warning };
  }

  function save(durable) {
    const candidate = durable?.view ? selectDurableState(durable) : durable;
    const validated = validateDurable(candidate);
    if (!validated) return { ok: false, reason: "invalid-state", verifiedRevision };
    const serialized = serializeDurable(validated);
    if (!serialized) return { ok: false, reason: "invalid-state", verifiedRevision };
    const current = read(STORAGE_KEYS.current);
    const currentSerialized = current ? serializeDurable(current) : null;

    // An exact readback is safe to treat as idempotent, even when another tab
    // already wrote the same durable state. A different equal-revision state
    // is a lost-update race and must fail closed.
    if (current && current.revision === validated.revision && currentSerialized === serialized) {
      rememberVerified(current, true);
      return { ok: true, reason: "already-verified", verifiedRevision: current.revision };
    }
    if (writeBlocked) return { ok: false, reason: "write-blocked", verifiedRevision };

    const expectedNextRevision = (verifiedRevision ?? 0) + 1;
    const currentMatchesBase = current
      ? current.revision === verifiedRevision && currentSerialized === verifiedSerialized
      : !verifiedStatePresent;
    if (!currentMatchesBase || validated.revision !== expectedNextRevision) {
      writeBlocked = true;
      return { ok: false, reason: "stale-or-equal-tab", verifiedRevision: current?.revision ?? verifiedRevision };
    }

    if (current && current.revision >= validated.revision) {
      const existing = serializeDurable(current);
      if (existing === serialized) return { ok: true, reason: "already-verified", verifiedRevision: current.revision };
      writeBlocked = true;
      return { ok: false, reason: "stale-or-equal-tab", verifiedRevision: current.revision };
    }
    if (!write(STORAGE_KEYS.staging, serialized)) return { ok: false, reason: "write-failed", verifiedRevision };
    const staged = read(STORAGE_KEYS.staging);
    if (!staged || staged.revision !== validated.revision || staged.runId !== validated.runId) return { ok: false, reason: "staging-readback-failed", verifiedRevision };
    const currentBeforeCommit = read(STORAGE_KEYS.current);
    const currentBeforeCommitSerialized = currentBeforeCommit ? serializeDurable(currentBeforeCommit) : null;
    const commitBaseStillMatches = currentBeforeCommit
      ? currentBeforeCommit.revision === verifiedRevision && currentBeforeCommitSerialized === verifiedSerialized
      : !verifiedStatePresent;
    if (!commitBaseStillMatches) {
      writeBlocked = true;
      return { ok: false, reason: "stale-or-equal-tab", verifiedRevision: currentBeforeCommit?.revision ?? verifiedRevision };
    }
    if (current) write(STORAGE_KEYS.lastGood, JSON.stringify(current));
    if (!write(STORAGE_KEYS.current, serialized)) return { ok: false, reason: "current-write-failed", verifiedRevision };
    const readback = read(STORAGE_KEYS.current);
    if (!readback || readback.revision !== validated.revision || readback.runId !== validated.runId) return { ok: false, reason: "current-readback-failed", verifiedRevision };
    remove(STORAGE_KEYS.staging);
    rememberVerified(readback, true);
    return { ok: true, reason: "verified", verifiedRevision };
  }

  function resetFresh() {
    const current = read(STORAGE_KEYS.current);
    const fresh = createInitialDurable();
    fresh.revision = (verifiedRevision ?? current?.revision ?? 0) + 1;
    fresh.savedAt = new Date().toISOString();
    const result = save(fresh);
    return result.ok ? fresh : null;
  }

  function acceptIncoming(durable) {
    const incoming = validateDurable(durable);
    if (!incoming) return null;
    if (verifiedRevision !== null && incoming.revision < verifiedRevision) return null;
    rememberVerified(incoming, true);
    return incoming;
  }

  return {
    load,
    save,
    resetFresh,
    read,
    acceptIncoming,
    isUsable: () => usable,
    getVerifiedRevision: () => verifiedRevision,
    isWriteBlocked: () => writeBlocked,
    handleStorageEvent(event) {
      if (!event || event.storageArea !== storage || event.key !== STORAGE_KEYS.current) return null;
      const incoming = safeParse(event.newValue);
      return incoming && (verifiedRevision === null || incoming.revision > verifiedRevision) ? acceptIncoming(incoming) : null;
    },
  };
}
