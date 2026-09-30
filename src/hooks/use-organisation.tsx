import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type OrgId = "nexus" | "cvs" | "rathbones";

const STORAGE_KEY = "embark.organisation";

type Ctx = { org: OrgId; setOrg: (org: OrgId) => void };

const OrganisationContext = createContext<Ctx>({ org: "rathbones", setOrg: () => {} });

function readStored(): OrgId {
  return "rathbones";
}

export function OrganisationProvider({ children }: { children: ReactNode }) {
  const [org, setOrgState] = useState<OrgId>(readStored);

  const setOrg = useCallback((_next: OrgId) => {
    setOrgState("rathbones");
    try {
      window.localStorage.setItem(STORAGE_KEY, "rathbones");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.org = org;
  }, [org]);

  const value = useMemo(() => ({ org, setOrg }), [org, setOrg]);
  return <OrganisationContext.Provider value={value}>{children}</OrganisationContext.Provider>;
}

export function useOrganisation() {
  return useContext(OrganisationContext);
}

export const ORG_LABEL: Record<OrgId, string> = {
  nexus: "Nexus",
  cvs: "CVS Health",
  rathbones: "Rathbones Institute",
};

export const ORG_ORDER: OrgId[] = ["nexus", "rathbones", "cvs"];
