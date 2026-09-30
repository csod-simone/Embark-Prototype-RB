import { FormEvent, useState } from "react";

const USERNAME = "rathbones-user";
const PASSWORD = "newPassword@123";
const STORAGE_KEY = "embark:rathbones-signed-in";

export function isPrototypeSignedIn(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markPrototypeSignedIn(): void {
  sessionStorage.setItem(STORAGE_KEY, "1");
}

export default function Login({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (username.trim().length === 0 || password.length === 0) {
      setError("Enter your username and password.");
      return;
    }
    if (username.trim() !== USERNAME || password !== PASSWORD) {
      setError("The username or password is incorrect.");
      return;
    }
    markPrototypeSignedIn();
    onSuccess();
  };

  return (
    <div className="min-h-screen w-full bg-[#070b16] flex items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-[420px] rounded-xl border border-[#1a2744] bg-[#0c1428] px-8 py-9"
      >
        <h1 className="text-[28px] font-semibold leading-tight text-white">Rathbones</h1>
        <p className="mt-2 text-[15px] text-[#8ea0bf]">
          Enter your username and password to continue.
        </p>

        <label className="mt-7 block text-sm font-medium text-white" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
            setError("");
          }}
          className="mt-2 h-11 w-full rounded-md border border-[#243556] bg-[#09101f] px-3 text-sm text-white outline-none focus:border-[#2f6fed]"
        />

        <label className="mt-5 block text-sm font-medium text-white" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setError("");
          }}
          className="mt-2 h-11 w-full rounded-md border border-[#243556] bg-[#09101f] px-3 text-sm text-white outline-none focus:border-[#2f6fed]"
        />

        {error && (
          <p className="mt-4 text-sm text-[#f0a8a8]" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="mt-6 h-11 w-full rounded-md bg-[#2f6fed] text-sm font-semibold text-white hover:bg-[#3d7af5]"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
