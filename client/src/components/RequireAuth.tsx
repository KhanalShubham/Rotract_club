import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getStoredToken } from "../utils/auth";

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const token = getStoredToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
