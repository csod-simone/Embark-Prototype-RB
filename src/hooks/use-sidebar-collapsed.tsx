import { useEffect, useState } from "react";

const STORAGE_KEY = "sidebar-collapsed";
const EVENT = "sidebar-collapsed-change";

function read(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function useSidebarCollapsed() {
  const [collapsed, setCollapsedState] = useState<boolean>(read);

  useEffect(() => {
    const handler = (e: Event) => {
      const next = (e as CustomEvent<boolean>).detail;
      setCollapsedState(next);
    };
    window.addEventListener(EVENT, handler as EventListener);
    return () => window.removeEventListener(EVENT, handler as EventListener);
  }, []);

  const setCollapsed = (next: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent(EVENT, { detail: next }));
    setCollapsedState(next);
  };

  return { collapsed, setCollapsed, toggle: () => setCollapsed(!collapsed) };
}
