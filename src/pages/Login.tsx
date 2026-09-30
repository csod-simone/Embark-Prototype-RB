import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import logoCSOD from "@/assets/CSOD_logo_black.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const VALID_USERNAME = "design";
const VALID_PASSWORD = "WorkforceA!";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      sessionStorage.setItem("prototype-auth", "true");
      navigate("/design-system", { replace: true });
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="flex justify-center">
          <img src={logoCSOD} alt="Cornerstone" className="h-7" />
        </div>
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Sign in</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to access the prototype</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              autoComplete="username"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">{error}</p>
          )}
          <Button type="submit" className="w-full mt-2">Sign in</Button>
        </form>
      </div>
    </div>
  );
}
