function scrollParent(element: HTMLElement): HTMLElement | null {
  let node = element.parentElement;
  while (node) {
    const overflow = getComputedStyle(node).overflowY;
    if (overflow === "auto" || overflow === "scroll") return node;
    node = node.parentElement;
  }
  return null;
}

/** Place the signal at the top of the page scroller, not at an arbitrary offset. */
export function scrollSignalIntoView(id: string): boolean {
  const element = document.getElementById(id);
  if (!element) return false;
  const container = scrollParent(element);
  if (!container) return false;
  // Short pages cannot move a signal to the top unless the scroller has extra room.
  container.style.paddingBottom = `${container.clientHeight}px`;
  const top =
    container.scrollTop +
    element.getBoundingClientRect().top -
    container.getBoundingClientRect().top -
    16;
  container.scrollTo({ top: Math.max(0, top), behavior: "auto" });
  return true;
}

export function clearSignalScrollPadding(): void {
  document.querySelectorAll("main").forEach((node) => {
    if (node instanceof HTMLElement) node.style.paddingBottom = "";
  });
}
