import type { UserRole } from "../services/firestore";

export interface StoredUser {
  uid: string;
  email: string;
  username: string;
  role: UserRole;
}

export function getStoredUser(): StoredUser | null {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
}

export function setStoredUser(user: StoredUser) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearStoredUser() {
  localStorage.removeItem("user");
}

export function isSuperAdmin(): boolean {
  return getStoredUser()?.role === "SUPER_ADMIN";
}

export function isAdmin(): boolean {
  const role = getStoredUser()?.role;
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function isAuthenticated(): boolean {
  return !!getStoredUser();
}
