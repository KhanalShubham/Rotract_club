import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getStoredUser } from "../utils/auth";
import type { UserRole } from "../services/firestore";

interface RequireAuthProps {
  children: ReactNode;
}

interface RequireRoleProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export function RequireAuth({ children }: RequireAuthProps) {
  const user = getStoredUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export function RequireRole({ children, allowedRoles }: RequireRoleProps) {
  const user = getStoredUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
