import { useState } from "react";
import type { BandLabel } from "@/data/mockData";

export function useCohortFilters() {
  const [band, setBand] = useState<BandLabel | null>(null);
  return {
    band,
    setBand,
    clear: () => setBand(null),
  };
}