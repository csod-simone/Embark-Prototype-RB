import { createContext, useContext } from "react";

interface CornerstoneIntegrationContextType {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
}

const CornerstoneIntegrationContext = createContext<CornerstoneIntegrationContextType>({
  enabled: false,
  setEnabled: () => {},
});

/** Rathbones admins manage content in Embark. External Learn lock is not in pilot scope. */
export function CornerstoneIntegrationProvider({ children }: { children: React.ReactNode }) {
  return (
    <CornerstoneIntegrationContext.Provider value={{ enabled: false, setEnabled: () => {} }}>
      {children}
    </CornerstoneIntegrationContext.Provider>
  );
}

export const useCornerstoneIntegration = () => useContext(CornerstoneIntegrationContext);
