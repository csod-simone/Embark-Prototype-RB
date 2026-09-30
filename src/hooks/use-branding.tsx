import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type BrandingState = {
  logoDataUrl: string;
  primaryHex: string;
  secondaryHex: string;
  tutorName: string;
};

export const DEFAULT_BRANDING: BrandingState = {
  logoDataUrl: "",
  primaryHex: "",
  secondaryHex: "",
  tutorName: "",
};

const STORAGE_KEY = "embark:branding";

export const HEX_RE = /^#?[0-9a-fA-F]{6}$/;

export const normaliseHex = (v: string) => {
  const t = v.trim();
  if (!HEX_RE.test(t)) return "";
  return t.startsWith("#") ? t.toUpperCase() : `#${t.toUpperCase()}`;
};

/** Convert #RRGGBB to the "H S% L%" triple used by the design tokens. */
export function hexToHslTriple(hex: string): string | null {
  const clean = normaliseHex(hex);
  if (!clean) return null;
  const r = parseInt(clean.slice(1, 3), 16) / 255;
  const g = parseInt(clean.slice(3, 5), 16) / 255;
  const b = parseInt(clean.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/** Readable foreground for a brand colour, using the existing black/white token values. */
function foregroundFor(hex: string): string {
  const clean = normaliseHex(hex);
  const r = parseInt(clean.slice(1, 3), 16);
  const g = parseInt(clean.slice(3, 5), 16);
  const b = parseInt(clean.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "0 0% 10%" : "0 0% 100%";
}

type Ctx = BrandingState & {
  tutorLabel: string;
  save: (next: BrandingState) => void;
};

const BrandingContext = createContext<Ctx>({
  ...DEFAULT_BRANDING,
  tutorLabel: "Sage",
  save: () => {},
});

function read(): BrandingState {
  if (typeof window === "undefined") return DEFAULT_BRANDING;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_BRANDING;
    return { ...DEFAULT_BRANDING, ...(JSON.parse(raw) as Partial<BrandingState>) };
  } catch {
    return DEFAULT_BRANDING;
  }
}

/** Replace the AI tutor name in rendered text nodes so every existing "Sage" string follows the setting. */
function useTutorRename(tutorName: string) {
  useEffect(() => {
    const name = tutorName.trim();
    if (typeof document === "undefined" || !name || name === "Sage") return;

    const swap = (text: string) => text.replace(/\bSage\b/g, name);

    const isExcluded = (el: Element | null) => Boolean(el?.closest("[data-no-tutor-rename]"));

    const walk = (root: Node) => {
      if (root instanceof Element && isExcluded(root)) return;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const pending: Text[] = [];
      let node = walker.nextNode();
      while (node) {
        const el = node.parentElement;
        if (
          el &&
          el.tagName !== "SCRIPT" &&
          el.tagName !== "STYLE" &&
          !isExcluded(el) &&
          node.nodeValue?.includes("Sage")
        ) {
          pending.push(node as Text);
        }
        node = walker.nextNode();
      }
      pending.forEach((t) => {
        t.nodeValue = swap(t.nodeValue ?? "");
      });

      if (root instanceof Element || root instanceof Document) {
        (root as Element | Document)
          .querySelectorAll("[placeholder],[aria-label],[title]")
          .forEach((el) => {
            if (isExcluded(el)) return;
            (["placeholder", "aria-label", "title"] as const).forEach((attr) => {
              const v = el.getAttribute(attr);
              if (v && v.includes("Sage")) el.setAttribute(attr, swap(v));
            });
          });
      }
    };

    walk(document.body);

    const observer = new MutationObserver((records) => {
      records.forEach((r) => {
        r.addedNodes.forEach((n) => {
          if (n.nodeType === Node.TEXT_NODE) {
            if (n.nodeValue?.includes("Sage") && !isExcluded(n.parentElement)) {
              n.nodeValue = swap(n.nodeValue);
            }
          } else if (n.nodeType === Node.ELEMENT_NODE) {
            walk(n);
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [tutorName]);
}

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BrandingState>(read);

  useEffect(() => {
    const root = document.documentElement;
    const primary = hexToHslTriple(state.primaryHex);
    if (primary) {
      root.style.setProperty("--primary", primary);
      root.style.setProperty("--primary-foreground", foregroundFor(state.primaryHex));
      root.style.setProperty("--ring", primary);
    } else {
      root.style.removeProperty("--primary");
      root.style.removeProperty("--primary-foreground");
      root.style.removeProperty("--ring");
    }
    const secondary = hexToHslTriple(state.secondaryHex);
    if (secondary) {
      root.style.setProperty("--secondary", secondary);
      root.style.setProperty("--secondary-foreground", foregroundFor(state.secondaryHex));
      root.style.setProperty("--accent", secondary);
      root.style.setProperty("--accent-foreground", foregroundFor(state.secondaryHex));
    } else {
      root.style.removeProperty("--secondary");
      root.style.removeProperty("--secondary-foreground");
      root.style.removeProperty("--accent");
      root.style.removeProperty("--accent-foreground");
    }
  }, [state.primaryHex, state.secondaryHex]);

  useTutorRename(state.tutorName);

  const save = useCallback((next: BrandingState) => {
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({ ...state, tutorLabel: state.tutorName.trim() || "Sage", save }),
    [state, save],
  );

  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>;
}

export const useBranding = () => useContext(BrandingContext);
export const useTutorName = () => useContext(BrandingContext).tutorLabel;
