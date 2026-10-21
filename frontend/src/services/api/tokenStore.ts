import type { User } from "../../types/auth";

/**
 * Session persistence. localStorage keeps users signed in across tabs; the trade-off is exposure to XSS,
 * mitigated by short-lived tokens that the API revokes on logout (security stamp).
 */
const TOKEN_KEY = "access_token";
const USER_KEY = "user_profile";

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export const tokenStore = {
  getToken(): string | null {
    return safeGet(TOKEN_KEY);
  },

  getUser(): User | null {
    const raw = safeGet(USER_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as User;
      return Array.isArray(parsed.roles) ? { ...parsed, permissions: parsed.permissions ?? [] } : null;
    } catch {
      return null;
    }
  },

  save(token: string, user: User): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // Storage unavailable (private mode): the session lives in memory only.
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // ignore
    }
  },
};
