import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useOrganisation, type OrgId } from "@/hooks/use-organisation";
import {
  DEFAULT_EXPERIENCE_CONTENT,
  normaliseWelcome,
  useExperienceContent,
  type WelcomeContent,
} from "@/hooks/use-experience-content";

type CohortWelcomeMap = Record<string, WelcomeContent>;

const storageKey = (org: OrgId) => `embark:cohort-welcome:v1:${org}`;

function read(org: OrgId): CohortWelcomeMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(storageKey(org));
    if (!raw) return {};
    return JSON.parse(raw) as CohortWelcomeMap;
  } catch {
    return {};
  }
}

type Ctx = {
  /** Welcome content configured for a cohort, falling back to the default content. */
  welcomeFor: (cohortId?: string | null) => WelcomeContent;
  saveWelcomeFor: (cohortId: string, next: WelcomeContent) => void;
};

const CohortWelcomeContext = createContext<Ctx>({
  welcomeFor: () => DEFAULT_EXPERIENCE_CONTENT.welcome,
  saveWelcomeFor: () => {},
});

export function CohortWelcomeProvider({ children }: { children: ReactNode }) {
  const { org } = useOrganisation();
  const { welcome: fallback } = useExperienceContent();
  const [map, setMap] = useState<CohortWelcomeMap>(() => read(org));

  useEffect(() => {
    setMap(read(org));
  }, [org]);

  const welcomeFor = useCallback(
    (cohortId?: string | null) => {
      const stored = cohortId ? map[cohortId] : undefined;
      return stored ? normaliseWelcome(stored, fallback) : fallback;
    },
    [map, fallback],
  );

  const saveWelcomeFor = useCallback(
    (cohortId: string, next: WelcomeContent) => {
      setMap((prev) => {
        const updated = { ...prev, [cohortId]: next };
        try {
          window.localStorage.setItem(storageKey(org), JSON.stringify(updated));
        } catch {
          /* storage unavailable */
        }
        return updated;
      });
    },
    [org],
  );

  const value = useMemo<Ctx>(
    () => ({ welcomeFor, saveWelcomeFor }),
    [welcomeFor, saveWelcomeFor],
  );

  return (
    <CohortWelcomeContext.Provider value={value}>{children}</CohortWelcomeContext.Provider>
  );
}

export const useCohortWelcome = () => useContext(CohortWelcomeContext);
