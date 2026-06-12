"use client";

import type { AuthResult, AuthSession, AuthStatus, AuthUser, LoginCredentials, RegisterInput } from "@sdp-mvp/types";
import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  loginWithOAuth: (provider: "google" | "github") => Promise<AuthResult>;
  loginWithWallet: (address: string, signature: string) => Promise<AuthResult>;
  register: (input: RegisterInput) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_STORAGE_KEY = "sdp_auth_session";

function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    // Check expiry
    if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date()) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function setStoredSession(session: AuthSession | null) {
  if (typeof window === "undefined") return;
  if (session) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

// ─── Mock Auth Server ───

const MOCK_USERS: AuthUser[] = [
  {
    id: "user_demo_001",
    email: "demo@openscanai.com",
    name: "Demo User",
    avatarUrl: null,
    authMethod: "email",
    walletAddress: null,
    role: "admin",
    onboardingStatus: "complete",
    emailVerified: true,
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
];

async function mockLogin(credentials: LoginCredentials): Promise<AuthResult> {
  await new Promise((r) => setTimeout(r, 800));
  // Accept any email/password for easy testing
  const user = MOCK_USERS.find((u) => u.email === credentials.email) ?? {
    id: "user_" + Date.now(),
    email: credentials.email,
    name: credentials.email.split("@")[0],
    avatarUrl: null,
    authMethod: "email" as const,
    walletAddress: null,
    role: "admin",
    onboardingStatus: "complete",
    emailVerified: true,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };
  const updated = { ...user, lastLoginAt: new Date().toISOString() };
  return { success: true, user: updated };
}

async function mockOAuthLogin(provider: "google" | "github"): Promise<AuthResult> {
  await new Promise((r) => setTimeout(r, 1000));
  const user: AuthUser = {
    id: `user_oauth_${provider}_001`,
    email: `user@${provider}.com`,
    name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
    avatarUrl: null,
    authMethod: provider === "google" ? "oauth_google" : "oauth_github",
    walletAddress: null,
    role: "admin",
    onboardingStatus: "complete",
    emailVerified: true,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };
  return { success: true, user };
}

async function mockWalletLogin(address: string, _signature: string): Promise<AuthResult> {
  await new Promise((r) => setTimeout(r, 1200));
  const user: AuthUser = {
    id: `user_wallet_${address.slice(-8)}`,
    email: `${address.slice(0, 6)}...${address.slice(-4)}@wallet.local`,
    name: `Wallet ${address.slice(0, 6)}...${address.slice(-4)}`,
    avatarUrl: null,
    authMethod: "wallet",
    walletAddress: address,
    role: "admin",
    onboardingStatus: "complete",
    emailVerified: false,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };
  return { success: true, user };
}

async function mockRegister(input: RegisterInput): Promise<AuthResult> {
  await new Promise((r) => setTimeout(r, 1000));
  if (input.email === "demo@openscanai.com") {
    return { success: false, error: "An account with this email already exists" };
  }
  const user: AuthUser = {
    id: `user_${Date.now()}`,
    email: input.email,
    name: input.name,
    avatarUrl: null,
    authMethod: input.authMethod ?? "email",
    walletAddress: input.walletAddress ?? null,
    role: "owner",
    onboardingStatus: "complete",
    emailVerified: false,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };
  return { success: true, user };
}

// ─── Provider ───

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("unauthenticated");

  // Hydrate from storage on mount
  useEffect(() => {
    const stored = getStoredSession();
    if (stored?.user) {
      setUser(stored.user);
      setStatus("authenticated");
    } else {
      setStatus("unauthenticated");
    }
  }, []);

  const persistSession = useCallback((newUser: AuthUser | null) => {
    if (newUser) {
      const session: AuthSession = {
        user: newUser,
        status: "authenticated",
        accessToken: `mock_token_${Date.now()}`,
        refreshToken: `mock_refresh_${Date.now()}`,
        expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      };
      setStoredSession(session);
      setUser(newUser);
      setStatus("authenticated");
    } else {
      setStoredSession(null);
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResult> => {
      setStatus("authenticating");
      const result = await mockLogin(credentials);
      if (result.success && result.user) {
        persistSession(result.user);
      } else {
        setStatus("error");
      }
      return result;
    },
    [persistSession]
  );

  const loginWithOAuth = useCallback(
    async (provider: "google" | "github"): Promise<AuthResult> => {
      setStatus("authenticating");
      const result = await mockOAuthLogin(provider);
      if (result.success && result.user) {
        persistSession(result.user);
      } else {
        setStatus("error");
      }
      return result;
    },
    [persistSession]
  );

  const loginWithWallet = useCallback(
    async (address: string, signature: string): Promise<AuthResult> => {
      setStatus("authenticating");
      const result = await mockWalletLogin(address, signature);
      if (result.success && result.user) {
        persistSession(result.user);
      } else {
        setStatus("error");
      }
      return result;
    },
    [persistSession]
  );

  const register = useCallback(
    async (input: RegisterInput): Promise<AuthResult> => {
      setStatus("authenticating");
      const result = await mockRegister(input);
      if (result.success && result.user) {
        persistSession(result.user);
      } else {
        setStatus("error");
      }
      return result;
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    persistSession(null);
    router.push("/login");
  }, [persistSession, router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === "authenticated" && user !== null,
      isLoading: status === "authenticating",
      login,
      loginWithOAuth,
      loginWithWallet,
      register,
      logout,
    }),
    [user, status, login, loginWithOAuth, loginWithWallet, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
