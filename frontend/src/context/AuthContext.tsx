import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../types/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("access_token"),
  );
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user_profile");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("access_token", newToken);
    localStorage.setItem("user_profile", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_profile");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
