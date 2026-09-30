import { createContext, useContext, useEffect } from "react";

export type Brand = "default" | "rathbones";

interface BrandContextType {
  brand: Brand;
  setBrand: (b: Brand) => void;
}

const BrandContext = createContext<BrandContextType>({
  brand: "default",
  setBrand: () => {},
});

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const brand: Brand = "rathbones";

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-brand", brand);
    localStorage.setItem("brand", brand);
  }, [brand]);

  return (
    <BrandContext.Provider value={{ brand, setBrand: () => {} }}>
      {children}
    </BrandContext.Provider>
  );
}

export const useBrand = () => useContext(BrandContext);