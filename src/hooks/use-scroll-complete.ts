import { useCallback, useRef, useState } from "react";

/**
 * Tracks scroll progress of a scrollable container and reports when the
 * learner has reached the bottom of the content. Once reached, it stays
 * reached for the rest of the session.
 */
export function useScrollComplete() {
  const [pct, setPct] = useState(0);
  const [reached, setReached] = useState(false);

  const markReached = useCallback(() => {
    setReached((prev) => {
      if (prev) return prev;
      return true;
    });
  }, []);

  const onScroll = useCallback(
    (event: React.UIEvent<HTMLElement>) => {
      const el = event.currentTarget;
      const max = el.scrollHeight - el.clientHeight;
      if (max <= 0) {
        setPct(100);
        markReached();
        return;
      }
      const raw = (el.scrollTop / max) * 100;
      const atBottom = raw >= 98;
      setPct((prev) => Math.max(prev, Math.min(100, atBottom ? 100 : Math.round(raw))));
      if (atBottom) markReached();
    },
    [markReached],
  );

  return { pct: reached ? 100 : pct, reached, onScroll };
}

