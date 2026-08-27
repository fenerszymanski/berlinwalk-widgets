export function createMissionRunner({ registry, store, announce, toast, audio, onRender, root }) {
  let active = null;
  let sequence = 0;

  function destroy() {
    if (!active) return;
    active.controller.abort();
    active.timers.forEach((timer) => window.clearTimeout(timer));
    active.timers.clear();
    active.module?.destroy?.();
    active = null;
  }

  function open(missionId, mode = "play") {
    const definition = registry.find((item) => item.id === missionId);
    if (!definition) return null;
    destroy();
    const state = store.getState();
    const session = {
      sessionId: ++sequence,
      runId: state.runId,
      missionId,
      mode,
      controller: new AbortController(),
    };
    const timers = new Set();
    const guard = () => Boolean(active && active.session.sessionId === session.sessionId && active.session.runId === session.runId && store.getState().runId === session.runId && active.session.missionId === session.missionId && !session.controller.signal.aborted);
    const schedule = (callback, delay = 0) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        if (guard()) callback();
      }, delay);
      timers.add(timer);
      return timer;
    };
    const context = { definition, session, store, announce, toast, audio, schedule, guard, onRender, root, signal: session.controller.signal };
    const module = definition.factory(context);
    active = { session, controller: session.controller, timers, module };
    module.mount?.();
    module.render?.(store.getState());
    return { ...session, destroy };
  }

  return { open, destroy, getActive: () => active?.session || null, getModule: () => active?.module || null };
}
