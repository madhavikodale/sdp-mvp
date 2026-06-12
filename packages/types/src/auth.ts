// ─────────────────────────────────────────────────────────────────────────────
// Authentication & Session
// ─────────────────────────────────────────────────────────────────────────────

export type AuthMethod = "email" | "oauth_google" | "oauth_github" | "wallet";
export type AuthStatus = "unauthenticated" | "authenticating" | "authenticated" | "error";
export type OnboardingStatus = "pending" | "complete" | "needs_verification";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  authMethod: AuthMethod;
  walletAddress?: string | null;
  role: "admin" | "member" | "owner";
  onboardingStatus: OnboardingStatus;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthSession {
  user: AuthUser | null;
  status: AuthStatus;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  authMethod?: AuthMethod;
  walletAddress?: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
  requiresVerification?: boolean;
}

export interface OAuthProvider {
  id: string;
  name: string;
  icon: string;
  authUrl: string;
}

export interface WalletAuthOptions {
  chainId?: number;
  message?: string;
}

export interface WalletSignature {
  address: string;
  signature: string;
  message: string;
}
