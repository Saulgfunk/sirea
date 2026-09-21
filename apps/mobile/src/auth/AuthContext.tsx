import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { ApiError, getToken, setToken } from '../api/client';
import { sireaApi } from '../api/sirea';
import type { AuthResponse } from '../api/types';

type AuthState = {
  user: AuthResponse['user'] | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getToken().then(async (token) => {
      if (token) {
        try {
          setUser(await sireaApi.auth.me());
        } catch (err) {
          // expired/invalid token — clear it and fall through to logged-out
          if (err instanceof ApiError && err.status === 401) await setToken(null);
        }
      }
      setLoading(false);
    });
  }, []);

  async function login(email: string, password: string) {
    const res = await sireaApi.auth.login({ email, password });
    await setToken(res.token);
    setUser(res.user);
  }

  async function signup(email: string, password: string, displayName: string) {
    const res = await sireaApi.auth.signup({ email, password, displayName });
    await setToken(res.token);
    setUser(res.user);
  }

  async function logout() {
    await setToken(null);
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
