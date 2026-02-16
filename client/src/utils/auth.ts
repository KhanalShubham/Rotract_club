export function getStoredUser() {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
}

export function getStoredToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return !!getStoredToken();
}
