import { Navigate, Outlet, useLocation } from "react-router-dom";

export function RequireAuth() {
  const location = useLocation();
  const isAuthed = typeof window !== "undefined" && sessionStorage.getItem("prototype-auth") === "true";

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
