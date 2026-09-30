import { createContext, useCallback, useContext, useEffect, useState } from "react";

export const DEFAULT_LINES_OF_BUSINESS = [
  "Medicare Advantage",
  "Medicare Supplement",
  "Medicaid",
  "Commercial",
  "Individual & Family Plans",
  "Employer Group",
  "Dental & Vision",
  "Pharmacy & Part D",
  "Dual Eligible (D-SNP)",
  "Provider Relations",
  "Sales & Distribution",
  "Operations & Back Office",
];

const STORAGE_KEY = "embark:lines-of-business";

type Ctx = {
  lines: string[];
  add: (name: string) => void;
  rename: (index: number, name: string) => void;
  remove: (index: number) => void;
};

const LinesOfBusinessContext = createContext<Ctx>({
  lines: DEFAULT_LINES_OF_BUSINESS,
  add: () => {},
  rename: () => {},
  remove: () => {},
});

export function LinesOfBusinessProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<string[]>(() => {
    if (typeof window === "undefined") return DEFAULT_LINES_OF_BUSINESS;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_LINES_OF_BUSINESS;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as string[];
      return DEFAULT_LINES_OF_BUSINESS;
    } catch {
      return DEFAULT_LINES_OF_BUSINESS;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignore
    }
  }, [lines]);

  const add = useCallback((name: string) => {
    setLines((prev) => [...prev, name]);
  }, []);

  const rename = useCallback((index: number, name: string) => {
    setLines((prev) => prev.map((l, i) => (i === index ? name : l)));
  }, []);

  const remove = useCallback((index: number) => {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  }, []);

  return (
    <LinesOfBusinessContext.Provider value={{ lines, add, rename, remove }}>
      {children}
    </LinesOfBusinessContext.Provider>
  );
}

export const useLinesOfBusiness = () => useContext(LinesOfBusinessContext);
