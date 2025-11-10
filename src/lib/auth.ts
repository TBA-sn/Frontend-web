const KEY = "dkmv_auth_token";

export function setAuthToken(token: string) {
  localStorage.setItem(KEY, token.trim());
}
export function getAuthToken(): string | null {
  return localStorage.getItem(KEY);
}
export function clearAuthToken() {
  localStorage.removeItem(KEY);
}
export function authHeader(): Record<string, string> {
  const t = getAuthToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}
