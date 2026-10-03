import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RATHBONES_USERS } from "@/data/rathbonesTerms";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Identity = {
  id: string;
  name: string;
  role: string;
  to: string;
};

const IDENTITIES: Identity[] = [
  {
    id: "learner",
    name: RATHBONES_USERS.learner.name,
    role: "Learner",
    to: "/first-login",
  },
  {
    id: "manager",
    name: RATHBONES_USERS.manager.name,
    role: "Manager",
    to: "/manager/overview",
  },
  {
    id: "admin",
    name: RATHBONES_USERS.admin.name,
    role: "Admin",
    to: "/admin/cohorts",
  },
  {
    id: "graduating",
    name: RATHBONES_USERS.graduating.name,
    role: "Graduating",
    to: "/learner/graduating",
  },
];

function labelFor(identity: Identity): string {
  return `${identity.name} — ${identity.role}`;
}

export default function RoleSelect() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return IDENTITIES.filter((identity) => {
      const haystack = `${identity.name} ${identity.role}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [query]);

  const chosen =
    IDENTITIES.find((identity) => identity.id === selectedId) ??
    (matches.length === 1 ? matches[0] : undefined);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!chosen) return;
    navigate(chosen.to, { replace: true });
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f1ec] flex items-center justify-center px-4 py-10" data-org-raw>
      <form
        onSubmit={submit}
        className="w-full max-w-[440px] rounded-xl bg-white px-8 py-8 shadow-[0_8px_30px_rgba(28,28,28,0.06)] border border-[#eceae4]"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#5e6a7d]">Sign in</p>
        <h1 className="mt-3 text-[32px] font-semibold leading-tight text-[#1c1c1c]">Rathbones Institute</h1>
        <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.14em] text-[#8b95a1]">
          Cornerstone Workforce AI
        </p>

        <div className="my-6 border-t border-[#e6e4de]" />

        <label htmlFor="identity" className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#5e6a7d]">
          Select your identity
        </label>
        <Select value={selectedId || undefined} onValueChange={setSelectedId}>
          <SelectTrigger
            id="identity"
            className="mt-2 h-12 rounded-lg border-[#e4e0d6] bg-[#f6f4ef] px-3 text-sm text-[#3a3a3a] focus:ring-0 focus:ring-offset-0"
          >
            <SelectValue placeholder="— choose —" />
          </SelectTrigger>
          <SelectContent>
            {IDENTITIES.map((identity) => (
              <SelectItem key={identity.id} value={identity.id}>
                {labelFor(identity)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#e6e4de]" />
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#9aa3af]">Or search</span>
          <div className="h-px flex-1 bg-[#e6e4de]" />
        </div>

        <label htmlFor="identity-search" className="sr-only">
          Search by name or role
        </label>
        <input
          id="identity-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, role, or employee id..."
          className="h-11 w-full rounded-lg border border-[#e5e2dc] bg-white px-3 text-sm text-[#1c1c1c] outline-none placeholder:text-[#9aa3af] focus:border-[#c9c4b8]"
        />
        {query.trim().length > 0 && (
          <ul className="mt-2 overflow-hidden rounded-lg border border-[#e5e2dc] bg-white">
            {matches.length === 0 ? (
              <li className="px-3 py-2 text-sm text-[#8b95a1]">No matching identity</li>
            ) : (
              matches.map((identity) => (
                <li key={identity.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(identity.id);
                      setQuery("");
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-[#1c1c1c] hover:bg-[#f6f4ef]"
                  >
                    {labelFor(identity)}
                  </button>
                </li>
              ))
            )}
          </ul>
        )}

        <button
          type="submit"
          disabled={!chosen}
          className="mt-4 h-12 w-full rounded-lg bg-[#8e969f] text-sm font-medium text-white transition-colors enabled:hover:bg-[#7a828b] disabled:cursor-not-allowed"
        >
          Enter →
        </button>

        <p className="mt-4 text-center text-[13px] leading-relaxed text-[#8b95a1]">
          No password — auto-login for the demo. You’ll see the view that matches your role.
        </p>
        <div className="mt-3 flex justify-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-[#8b95a1]"
            onClick={() => {
              if (!window.confirm("Reset the demo? This clears saved progress and returns you to this screen.")) {
                return;
              }
              let signedIn: string | null = null;
              try {
                signedIn = sessionStorage.getItem("embark:rathbones-signed-in");
                localStorage.clear();
                sessionStorage.clear();
                if (signedIn) sessionStorage.setItem("embark:rathbones-signed-in", signedIn);
              } catch {
                /* storage can be blocked; still return to this screen */
              }
              window.location.assign("/");
            }}
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}
