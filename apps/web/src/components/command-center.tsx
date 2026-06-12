"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useDashboardWorkspace } from "@/contexts/dashboard-workspace-context";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, Bell, Plus, Command, X, ChevronRight, Activity,
  Settings, LogOut, User, Check, Trash2, Wifi, WifiOff,
  ArrowUpRight, Zap, Shield, KeyRound, Wallet, Coins
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface SearchResult {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  category: string;
  shortcut?: string;
}

const SEARCH_ITEMS: SearchResult[] = [
  { id: "overview", label: "Overview", href: "/dashboard", icon: <Activity className="h-4 w-4" />, category: "Platform", shortcut: "⌘1" },
  { id: "rpc", label: "RPC Endpoints", href: "/dashboard/rpc", icon: <Wifi className="h-4 w-4" />, category: "Platform", shortcut: "⌘2" },
  { id: "analytics", label: "Analytics", href: "/dashboard/analytics", icon: <ArrowUpRight className="h-4 w-4" />, category: "Platform", shortcut: "⌘4" },
  { id: "api-keys", label: "API Keys", href: "/dashboard/api-keys", icon: <KeyRound className="h-4 w-4" />, category: "Platform", shortcut: "⌘5" },
  { id: "tokens", label: "Tokens", href: "/dashboard/tokens", icon: <Coins className="h-4 w-4" />, category: "Assets" },
  { id: "wallets", label: "Wallets", href: "/dashboard/wallets", icon: <Wallet className="h-4 w-4" />, category: "Assets" },
  { id: "intents", label: "AI Intents", href: "/dashboard/intents", icon: <Zap className="h-4 w-4" />, category: "Advanced" },
  { id: "atomic", label: "Atomic Swaps", href: "/dashboard/atomic", icon: <ArrowUpRight className="h-4 w-4" />, category: "Advanced" },
  { id: "gas-ai", label: "AI Gas Prediction", href: "/dashboard/gas-ai", icon: <Zap className="h-4 w-4" />, category: "Optimization" },
  { id: "mev", label: "MEV Protection", href: "/dashboard/mev", icon: <Shield className="h-4 w-4" />, category: "Optimization" },
  { id: "security", label: "Security Scan", href: "/dashboard/security", icon: <Shield className="h-4 w-4" />, category: "Security" },
  { id: "settings", label: "Settings", href: "/dashboard/settings", icon: <Settings className="h-4 w-4" />, category: "Admin" },
];

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "security" | "performance" | "billing" | "system";
  timestamp: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "MEV Attack Blocked", message: "Sandwich attack on WETH/USDC blocked, refund: $124.50", type: "security", timestamp: "2 min ago", read: false },
  { id: "n2", title: "High Gas Alert", message: "Ethereum gas spiked to 85 gwei, AI switched to batch mode", type: "performance", timestamp: "15 min ago", read: false },
  { id: "n3", title: "API Key Expiring", message: "Production key 'backend-prod' expires in 3 days", type: "billing", timestamp: "1 hour ago", read: true },
  { id: "n4", title: "Security Scan Complete", message: "7 programs scanned, 1 high-risk finding in Flash Loan Pro", type: "security", timestamp: "3 hours ago", read: true },
];

const NETWORK_STATUS = {
  solana: { status: "healthy" as const, latency: 45, tps: 4320 },
  ethereum: { status: "healthy" as const, latency: 12000, tps: 15 },
  base: { status: "healthy" as const, latency: 2000, tps: 24 },
  arbitrum: { status: "degraded" as const, latency: 8500, tps: 8 },
};

export function CommandCenter() {
  const { user, logout } = useAuth();
  const { isSidebarOpen, setSidebarOpen } = useDashboardWorkspace();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [profileOpen, setProfileOpen] = useState(false);
  const [networkTooltip, setNetworkTooltip] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredResults = SEARCH_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedResults = filteredResults.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  // Keyboard shortcut: Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
        setCreateMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const handleKeyNavigation = useCallback((e: React.KeyboardEvent) => {
    const flatResults = Object.values(groupedResults).flat();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % flatResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatResults.length) % flatResults.length);
    } else if (e.key === "Enter" && flatResults[selectedIndex]) {
      window.location.href = flatResults[selectedIndex].href;
      setSearchOpen(false);
    }
  }, [groupedResults, selectedIndex]);

  const networkHealthy = Object.values(NETWORK_STATUS).every((n) => n.status === "healthy");

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b border-white/[0.06] bg-sdp-bg/80 px-4 backdrop-blur-xl">
        {/* Left: Breadcrumb / Sidebar toggle hint */}
        <div className="flex items-center gap-3">
          {!isSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70 transition-all"
            >
              <Command className="h-4 w-4" />
            </button>
          )}
          <div className="flex items-center gap-2 text-xs text-white/30">
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-white/40">⌘K</span>
            <span>Search</span>
          </div>
        </div>

        {/* Center: Search Bar */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex flex-1 max-w-md items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-white/30 hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-white/50 transition-all"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">Search anything...</span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-white/30">⌘K</span>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Global Create Button */}
          <div className="relative">
            <button
              onClick={() => setCreateMenuOpen(!createMenuOpen)}
              className="flex h-8 items-center gap-1.5 rounded-lg bg-gradient-to-r from-sdp-accent to-violet-500 px-3 text-xs font-semibold text-white shadow-lg shadow-sdp-accent/25 hover:shadow-sdp-accent/40 transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Create</span>
            </button>
            <AnimatePresence>
              {createMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setCreateMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 z-50 w-56 glass-card rounded-xl border border-white/[0.08] overflow-hidden"
                  >
                    <div className="p-2 space-y-0.5">
                      {[
                        { label: "API Key", href: "/dashboard/api-keys", icon: <KeyRound className="h-4 w-4" />, desc: "New API credential" },
                        { label: "Wallet", href: "/dashboard/wallets", icon: <Wallet className="h-4 w-4" />, desc: "Add wallet address" },
                        { label: "Token", href: "/dashboard/tokens", icon: <Coins className="h-4 w-4" />, desc: "Create SPL token" },
                        { label: "Intent", href: "/dashboard/intents", icon: <Zap className="h-4 w-4" />, desc: "Natural language tx" },
                      ].map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setCreateMenuOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-white/5 transition-colors"
                        >
                          <span className="text-sdp-accent">{item.icon}</span>
                          <div className="flex-1">
                            <p className="text-white/80 font-medium">{item.label}</p>
                            <p className="text-[10px] text-white/30">{item.desc}</p>
                          </div>
                          <ChevronRight className="h-3 w-3 text-white/20" />
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Network Status */}
          <div className="relative">
            <button
              onMouseEnter={() => setNetworkTooltip(true)}
              onMouseLeave={() => setNetworkTooltip(false)}
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-all",
                networkHealthy
                  ? "bg-sdp-success/10 text-sdp-success border border-sdp-success/20"
                  : "bg-sdp-warning/10 text-sdp-warning border border-sdp-warning/20"
              )}
            >
              {networkHealthy ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{networkHealthy ? "Healthy" : "Degraded"}</span>
            </button>
            <AnimatePresence>
              {networkTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute right-0 top-full mt-2 z-50 w-64 glass-card rounded-xl border border-white/[0.08] p-3"
                >
                  <p className="text-xs font-semibold text-white/60 mb-2">Network Status</p>
                  <div className="space-y-2">
                    {Object.entries(NETWORK_STATUS).map(([chain, status]) => (
                      <div key={chain} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "h-2 w-2 rounded-full",
                            status.status === "healthy" ? "bg-sdp-success" : "bg-sdp-warning"
                          )} />
                          <span className="text-white/50 capitalize">{chain}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-white/40">{status.latency}ms</span>
                          <span className="text-white/20 ml-2">{status.tps} TPS</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70 transition-all"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-sdp-danger text-[9px] font-bold text-white flex items-center justify-center border-2 border-sdp-bg">
                  {unreadCount}
                </span>
              )}
            </button>
            <AnimatePresence>
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 z-50 w-80 glass-card rounded-xl border border-white/[0.08] overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-3 border-b border-white/[0.06]">
                      <p className="text-sm font-semibold text-white">Notifications</p>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={markAllRead}
                          className="p-1 rounded hover:bg-white/5 text-white/30 hover:text-white/60 transition-all"
                          title="Mark all read"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell className="h-8 w-8 text-white/10 mx-auto mb-2" />
                          <p className="text-sm text-white/30">No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={cn(
                              "group relative p-3 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors",
                              !notification.read && "bg-white/[0.02]"
                            )}
                          >
                            <div className="flex items-start gap-2.5">
                              <span className={cn(
                                "h-2 w-2 rounded-full mt-1 shrink-0",
                                notification.type === "security" && "bg-sdp-danger",
                                notification.type === "performance" && "bg-sdp-warning",
                                notification.type === "billing" && "bg-sdp-accent",
                                notification.type === "system" && "bg-sdp-success"
                              )} />
                              <div className="flex-1 min-w-0">
                                <p className={cn("text-sm", !notification.read ? "text-white/80 font-medium" : "text-white/50")}>
                                  {notification.title}
                                </p>
                                <p className="text-xs text-white/30 mt-0.5">{notification.message}</p>
                                <p className="text-[10px] text-white/20 mt-1">{notification.timestamp}</p>
                              </div>
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/5 text-white/20 hover:text-white/50 transition-all"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                            {!notification.read && (
                              <span className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-sdp-accent" />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex h-8 items-center gap-2 rounded-lg bg-white/5 px-2 hover:bg-white/10 transition-all"
            >
              <div className="h-5 w-5 rounded-full bg-gradient-to-br from-sdp-accent to-violet-500 flex items-center justify-center text-[9px] font-bold text-white">
                {user?.email?.[0]?.toUpperCase() ?? "U"}
              </div>
              <span className="hidden sm:inline text-xs text-white/60">{user?.email?.split("@")[0]}</span>
            </button>
            <AnimatePresence>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 z-50 w-64 glass-card rounded-xl border border-white/[0.08] overflow-hidden"
                  >
                    <div className="p-3 border-b border-white/[0.06]">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sdp-accent to-violet-500 flex items-center justify-center text-sm font-bold text-white">
                          {user?.email?.[0]?.toUpperCase() ?? "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                          <p className="text-xs text-white/40 capitalize">{user?.role}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 space-y-0.5">
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white/80 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <Link
                        href="/dashboard/team"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white/80 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        Team
                      </Link>
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Search Modal Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
            onClick={() => setSearchOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              ref={searchContainerRef}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="relative w-full max-w-lg glass-card rounded-xl border border-white/[0.08] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleKeyNavigation}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
                <Search className="h-5 w-5 text-white/30" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setSelectedIndex(0); }}
                  placeholder="Search pages, features, actions..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded hover:bg-white/5 text-white/30 hover:text-white/60 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto py-2">
                {filteredResults.length === 0 ? (
                  <div className="p-8 text-center">
                    <Search className="h-8 w-8 text-white/10 mx-auto mb-2" />
                    <p className="text-sm text-white/30">No results found</p>
                  </div>
                ) : (
                  Object.entries(groupedResults).map(([category, items]) => (
                    <div key={category}>
                      <p className="px-4 py-1.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                        {category}
                      </p>
                      <div className="space-y-0.5 px-2">
                        {items.map((item, idx) => {
                          const flatIndex = Object.values(groupedResults)
                            .flat()
                            .findIndex((r) => r.id === item.id);
                          const isSelected = flatIndex === selectedIndex;
                          return (
                            <Link
                              key={item.id}
                              href={item.href}
                              onClick={() => setSearchOpen(false)}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                                isSelected
                                  ? "bg-sdp-accent/20 text-white"
                                  : "text-white/60 hover:bg-white/5 hover:text-white/80"
                              )}
                            >
                              <span className={cn(isSelected ? "text-sdp-accent" : "text-white/30")}>
                                {item.icon}
                              </span>
                              <span className="flex-1">{item.label}</span>
                              {item.shortcut && (
                                <span className="font-mono text-[10px] text-white/20">{item.shortcut}</span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 px-4 py-2 border-t border-white/[0.06] text-[10px] text-white/20">
                <span className="flex items-center gap-1">
                  <span className="font-mono px-1 rounded bg-white/[0.05]">↑↓</span> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-mono px-1 rounded bg-white/[0.05]">↵</span> Select
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-mono px-1 rounded bg-white/[0.05]">esc</span> Close
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
