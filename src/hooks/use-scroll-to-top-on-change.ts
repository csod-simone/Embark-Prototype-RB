import { useLayoutEffect, type RefObject } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets the scroll position of a content region (and any scrollable
 * descendants) to the top whenever `key` changes, then moves focus to the
 * region so keyboard and screen-reader users start at the beginning of the
 * newly loaded content.
 */
export function useScrollToTopOnChange(
  containerRef: RefObject<HTMLElement>,
  key: string,
) {
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.scrollTop = 0;
    el.querySelectorAll<HTMLElement>("*").forEach((child) => {
      if (child.scrollTop > 0) child.scrollTop = 0;
    });
    if (typeof window !== "undefined") window.scrollTo(0, 0);

    // Keep focus inside the content region unless the learner is already
    // interacting with something in it (e.g. an answer input).
    const active = document.activeElement;
    if (!active || active === document.body || !el.contains(active)) {
      el.focus({ preventScroll: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

/**
 * Route-aware variant: resets the scroll position of a routed content region
 * whenever the location changes, then moves focus to that region so keyboard
 * and screen-reader users start at the top of the newly opened page.
 */
export function useScrollToTopOnRouteChange(containerRef: RefObject<HTMLElement>) {
  const { pathname, search } = useLocation();

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = 0;
    if (typeof window !== "undefined") window.scrollTo(0, 0);

    if (!el) return;
    const active = document.activeElement;
    if (!active || active === document.body || !el.contains(active)) {
      el.focus({ preventScroll: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search]);
}
