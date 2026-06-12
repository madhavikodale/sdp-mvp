"use client";

import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Wallet,
  Zap,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Rocket,
  Globe,
  KeyRound,
} from "lucide-react";

export default function RegisterPage() {
  const { register, loginWithOAuth, loginWithWallet, isLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await register({ email, password, name });
    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } else {
      setError(result.error ?? "Registration failed");
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setError(null);
    const result = await loginWithOAuth(provider);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } else {
      setError(result.error ?? "OAuth signup failed");
    }
  };

  const handleWalletConnect = async () => {
    setError(null);
    setWalletConnecting(true);
    try {
      const ethereum = (window as unknown as { ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum;
      if (!ethereum) {
        setError("No wallet detected. Please install MetaMask or another Web3 wallet.");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" }) as string[];
      const address = accounts[0];
      const signature = "mock_signature_" + Date.now();
      const result = await loginWithWallet(address, signature);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        setError(result.error ?? "Wallet signup failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wallet connection failed");
    } finally {
      setWalletConnecting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-sdp-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/20 mb-6">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Account Created!</h1>
          <p className="text-white/50 mb-6">
            Your sandbox environment is ready. Redirecting to dashboard...
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-emerald-400">
            <Rocket className="h-4 w-4" />
            <span>Sandbox provisioned instantly</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sdp-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 mb-4">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="mt-1 text-sm text-white/50">
            Start building with instant sandbox access
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 space-y-6">
          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleOAuth("google")}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/[0.08] transition-colors disabled:opacity-50"
            >
              <Globe className="h-4 w-4" />
              Google
            </button>
            <button
              onClick={() => handleOAuth("github")}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/[0.08] transition-colors disabled:opacity-50"
            >
              <KeyRound className="h-4 w-4" />
              GitHub
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-sdp-bg px-3 text-white/30">or use your email</span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] pl-10 pr-10 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Wallet Connect */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-sdp-bg px-3 text-white/30">or</span>
            </div>
          </div>

          <button
            onClick={handleWalletConnect}
            disabled={walletConnecting || isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-400 hover:bg-amber-500/15 transition-colors disabled:opacity-50"
          >
            {walletConnecting ? (
              <div className="h-4 w-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            ) : (
              <>
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </>
            )}
          </button>

          {/* Sandbox note */}
          <div className="flex items-start gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs text-emerald-400">
            <Rocket className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>
              Instant sandbox access on signup. No credit card required.
            </span>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-white/40">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
