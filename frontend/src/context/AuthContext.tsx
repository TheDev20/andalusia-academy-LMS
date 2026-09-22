import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface User {
  email: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<AuthResponse>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    setLoading(true);

    try {
      // Temporary authentication logic
      // Replace this with your API call later.
      void password;

      const userData: User = {
        email,
        name: email.split('@')[0],
      };

      setUser(userData);

      return {
        success: true,
      };
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Login failed';

      return {
        success: false,
        error: message,
      };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    setLoading(true);

    try {
      // Temporary signup logic
      // Replace this with your API call later.
      void password;

      const userData: User = {
        name,
        email,
      };

      setUser(userData);

      return {
        success: true,
      };
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Signup failed';

      return {
        success: false,
        error: message,
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside an AuthProvider'
    );
  }

  return context;
}

export { AuthProvider, useAuth };
export default AuthProvider;