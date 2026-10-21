import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { User } from "../types/auth";
import { tokenStore } from "../services/api/tokenStore";
import { SESSION_EXPIRED_EVENT } from "../services/api/httpClient";
import { authApi } from "../services/api/authApi";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  /** Stores a session returned by login/register/change-password. */
  login: (token: string, user: User) => void;
  /** Revokes the session server-side (best effort) and clears it locally. */
  logout: () => Promise<void>;
  hasRole: (...roles: string[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => tokenStore.getToken());
  const [user, setUser] = useState<User | null>(() => tokenStore.getUser());

  const clearSession = useCallback(() => {
    tokenStore.clear();
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback((newToken: string, newUser: User) => {
    tokenStore.save(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (tokenStore.getToken()) await authApi.logout();
    } catch {
      // The token may already be revoked or expired; the local session is cleared regardless.
    } finally {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    window.addEventListener(SESSION_EXPIRED_EVENT, clearSession);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, clearSession);
  }, [clearSession]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      login,
      logout,
      hasRole: (...roles) => !!user && user.roles.some((r) => roles.includes(r)),
      hasPermission: (permission) => !!user && user.permissions.includes(permission),
    }),
    [user, token, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

/** Where a user lands after signing in, by their most privileged role. */
export function homePathFor(user: User | null): string {
  if (!user) return "/";
  if (user.roles.includes("Admin")) return "/admin";
  if (user.roles.includes("Instructor")) return "/instructor";
  if (user.roles.includes("ContentManager")) return "/admin";
  return "/dashboard";
}
