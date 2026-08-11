const FOCUSABLE = [
  "button:not([disabled]):not([hidden])",
  "a[href]:not([hidden])",
  "input:not([disabled]):not([hidden])",
  "select:not([disabled]):not([hidden])",
  "textarea:not([disabled]):not([hidden])",
  "[tabindex]:not([tabindex=\"-1\"]):not([hidden])",
].join(",");

function getFocusable(root) {
  return [...root.querySelectorAll(FOCUSABLE)].filter((element) => {
    const style = window.getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden" && element.getClientRects().length > 0;
  });
}

let managerInThread = null;

export class DialogManager {
  constructor({ backgroundNodes = [] } = {}) {
    this.backgroundNodes = backgroundNodes;
    this.active = null;
    this.previousBackground = [];
    this.abortController = new AbortController();
    document.addEventListener("keydown", (event) => this.onKeydown(event), { signal: this.abortController.signal });
    document.addEventListener("click", (event) => this.onDocumentClick(event), { signal: this.abortController.signal });
  }

  getRoot(id) { return typeof id === "string" ? document.getElementById(id) : id; }

  focusables(root = this.active?.root) { return root ? getFocusable(root) : []; }

  setBackground(open) {
    if (open) {
      this.previousBackground = this.backgroundNodes.map((node) => ({ node, inert: Boolean(node.inert), ariaHidden: node.getAttribute("aria-hidden") }));
      this.previousBackground.forEach(({ node }) => { node.inert = true; node.setAttribute("aria-hidden", "true"); });
    } else {
      this.previousBackground.forEach(({ node, inert, ariaHidden }) => {
        node.inert = inert;
        if (ariaHidden === null) node.removeAttribute("aria-hidden");
        else node.setAttribute("aria-hidden", ariaHidden);
      });
      this.previousBackground = [];
    }
  }

  open(id, trigger = document.activeElement, onOpen = null) {
    const root = this.getRoot(id);
    if (!root) return false;
    if (this.active) this.close({ restoreFocus: false });
    root.tabIndex = -1;
    root.hidden = false;
    root.setAttribute("aria-hidden", "false");
    this.setBackground(true);
    this.active = { id: root.id, root, trigger: trigger && trigger !== document.body ? trigger : null };
    managerInThread = this;
    onOpen?.(root);
    window.requestAnimationFrame(() => {
      if (!this.active || this.active.root !== root) return;
      (this.focusables(root)[0] || root).focus({ preventScroll: true });
    });
    return true;
  }

  close({ restoreFocus = true } = {}) {
    if (!this.active) return false;
    const { root, trigger } = this.active;
    root.hidden = true;
    root.setAttribute("aria-hidden", "true");
    this.setBackground(false);
    this.active = null;
    if (managerInThread === this) managerInThread = null;
    if (restoreFocus && trigger && document.contains(trigger)) trigger.focus({ preventScroll: true });
    return true;
  }

  onDocumentClick(event) {
    if (!this.active) return;
    if (event.target === this.active.root || event.target.closest?.("[data-dialog-close]")) this.close();
  }

  onKeydown(event) {
    if (!this.active) return;
    if (event.key === "Escape") {
      event.preventDefault();
      this.close();
      return;
    }
    if (event.key !== "Tab") return;
    const candidates = this.focusables();
    if (!candidates.length) {
      event.preventDefault();
      this.active.root.focus({ preventScroll: true });
      return;
    }
    if (candidates.length === 1) {
      event.preventDefault();
      candidates[0].focus({ preventScroll: true });
      return;
    }
    const first = candidates[0];
    const last = candidates[candidates.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  }

  isOpen(id) { return Boolean(this.active && (!id || this.active.id === id)); }
  getActiveId() { return this.active?.id || null; }
  getTrigger() { return this.active?.trigger || null; }
  getFocusableCount(id = null) { return this.focusables(id ? this.getRoot(id) : undefined).length; }
  destroy() { this.close({ restoreFocus: false }); this.abortController.abort(); }
}

export function createDialogManager(options) {
  return new DialogManager(options);
}

export function getActiveDialogManager() {
  return managerInThread;
}
