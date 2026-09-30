import { useEffect, useState } from "react";

export type PersonaId = "david" | "sophia";

export type Persona = {
  id: PersonaId;
  name: string;
  firstName: string;
  initials: string;
  title: string;
  email: string;
};

export const PERSONAS: Record<PersonaId, Persona> = {
  david: {
    id: "david",
    name: "David Lin",
    firstName: "David",
    initials: "DL",
    title: "Executive Leadership, North America",
    email: "david.lin@company.com",
  },
  sophia: {
    id: "sophia",
    name: "Sophia Kim",
    firstName: "Sophia",
    initials: "SK",
    title: "Director, Data Operations",
    email: "sophia.kim@company.com",
  },
};

const STORAGE_KEY = "prototype-persona";

export function getStoredPersonaId(): PersonaId {
  if (typeof window === "undefined") return "david";
  const v = sessionStorage.getItem(STORAGE_KEY);
  return v === "sophia" ? "sophia" : "david";
}

export function setStoredPersonaId(id: PersonaId) {
  sessionStorage.setItem(STORAGE_KEY, id);
  window.dispatchEvent(new Event("persona-change"));
}

export function usePersona() {
  const [id, setId] = useState<PersonaId>(getStoredPersonaId);

  useEffect(() => {
    const handler = () => setId(getStoredPersonaId());
    window.addEventListener("persona-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("persona-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return {
    persona: PERSONAS[id],
    setPersona: (next: PersonaId) => {
      setStoredPersonaId(next);
      setId(next);
    },
  };
}
