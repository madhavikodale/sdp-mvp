"use client";

import { cn } from "@/lib/utils";
import { useDashboardWorkspace } from "@/contexts/dashboard-workspace-context";
import { useAuth } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { type ReactNode, useState, useCallback, useEffect, useRef } from "react";
import {
  Home, Globe, Radio, LineChart, KeyRound, Coins, Wallet, Zap, Brain,
  GitBranch, ArrowRightLeft, Flame, Shield, Rocket, Lock, Bell, BookOpen,
  Settings, Users, Handshake, Layers, ChevronLeft, ChevronRight, LogOut,
  LayoutDashboard, Pin, History, ChevronDown, Sparkles, Command,
  Activity, TrendingUp, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  badge?: string;
  shortcut?: string;
  description?: string;
  stats?: { label: string; value: string };
}

interface NavSection {
  id: string;
  label: string;
  icon: ReactNode;
  items: NavItem[];
  defaultOpen?: boolean;
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: "main",
    label: "Platform",
    icon: <LayoutDashboard className="h-4 w-4" />,
    defaultOpen: true,
    items: [
      { id: "home", label: "Overview", href: "/dashboard", icon: <Home className="h-5 w-5" />, shortcut: "1", description: "Dashboard overview and key metrics" },
      { id: "rpc", label: "RPC Endpoints", href: "/dashboard/rpc", icon: <Globe className="h-5 w-5" />, shortcut: "2", description: "Manage blockchain RPC connections", stats: { label: "Active", value: "12" } },
      { id: "streams", label: "Streams", href: "/dashboard/streams", icon: <Radio className="h-5 w-5" />, shortcut: "3", description: "Real-time data streaming", stats: { label: "Live", value: "3" } },
      { id: "analytics", label: "Analytics", href: "/dashboard/analytics", icon: <LineChart className="h-5 w-5" />, shortcut: "4", description: "Performance analytics and insights" },
      { id: "api-keys", label: "API Keys", href: "/dashboard/api-keys", icon: <KeyRound className="h-5 w-5" />, shortcut: "5", description: "Manage API credentials", stats: { label: "Keys", value: "8" } },
    ],
  },
  {
    id: "assets",
    label: "Assets",
    icon: <Coins className="h-4 w-4" />,
    items: [
      { id: "tokens", label: "Tokens", href: "/dashboard/tokens", icon: <Coins className="h-5 w-5" />, description: "Token management and creation" },
      { id: "wallets", label: "Wallets", href: "/dashboard/wallets", icon: <Wallet className="h-5 w-5" />, description: "Wallet operations and custody", stats: { label: "Connected", value: "5" } },
      { id: "gasless", label: "Gasless", href: "/dashboard/gasless", icon: <Zap className="h-5 w-5" />, badge: "Pro", description: "Sponsored transaction relay" },
    ],
  },
  {
    id: "advanced",
    label: "Advanced",
    icon: <Sparkles className="h-4 w-4" />,
    items: [
      { id: "intents", label: "AI Intents", href: "/dashboard/intents", icon: <Brain className="h-5 w-5" />, badge: "Beta", description: "Natural language transaction intents" },
      { id: "orchestration", label: "Orchestration", href: "/dashboard/orchestration", icon: <GitBranch className="h-5 w-5" />, badge: "Pro", description: "Multi-step workflow automation" },
      { id: "bridge", label: "Bridge", href: "/dashboard/bridge", icon: <ArrowRightLeft className="h-5 w-5" />, description: "Cross-chain asset bridging" },
      { id: "atomic", label: "Atomic Swaps", href: "/dashboard/atomic", icon: <ArrowRightLeft className="h-5 w-5" />, badge: "Pro", description: "HTLC cross-chain exchanges", stats: { label: "Success", value: "99.7%" } },
    ],
  },
  {
    id: "optimization",
    label: "Optimization",
    icon: <TrendingUp className="h-4 w-4" />,
    items: [
      { id: "gas", label: "Gas Optimizer", href: "/dashboard/gas", icon: <Flame className="h-5 w-5" />, description: "Transaction fee optimization" },
      { id: "gas-ai", label: "AI Gas Prediction", href: "/dashboard/gas-ai", icon: <Brain className="h-5 w-5" />, badge: "AI", description: "ML-powered fee forecasting", stats: { label: "Accuracy", value: "91.7%" } },
      { id: "mev", label: "MEV Protection", href: "/dashboard/mev", icon: <Shield className="h-5 w-5" />, description: "Sandwich attack protection", stats: { label: "Blocked", value: "1.8K" } },
      { id: "mev-advanced", label: "MEV Advanced", href: "/dashboard/mev-advanced", icon: <Zap className="h-5 w-5" />, badge: "Pro", description: "Backrun arbitrage and refunds", stats: { label: "Refunds", value: "$42.4K" } },
      { id: "acceleration", label: "Acceleration", href: "/dashboard/acceleration", icon: <Rocket className="h-5 w-5" />, description: "Transaction acceleration" },
    ],
  },
  {
    id: "security",
    label: "Security",
    icon: <Lock className="h-4 w-4" />,
    items: [
      { id: "security", label: "Security Scan", href: "/dashboard/security", icon: <Lock className="h-5 w-5" />, description: "Program vulnerability analysis", stats: { label: "Scanned", value: "1.2K" } },
      { id: "alerts", label: "Alerts", href: "/dashboard/alerts", icon: <Bell className="h-5 w-5" />, description: "Real-time security alerts" },
      { id: "compliance", label: "Compliance", href: "/dashboard/compliance", icon: <Shield className="h-5 w-5" />, description: "Regulatory compliance tools" },
    ],
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    icon: <Layers className="h-4 w-4" />,
    items: [
      { id: "rollup", label: "Rollups", href: "/dashboard/rollup", icon: <Layers className="h-5 w-5" />, badge: "Pro", description: "App-chain deployment" },
      { id: "docs", label: "API Docs", href: "/dashboard/docs", icon: <BookOpen className="h-5 w-5" />, description: "Documentation and references" },
    ],
  },
  {
    id: "admin",
    label: "Admin",
    icon: <Settings className="h-4 w-4" />,
    items: [
      { id: "partners", label: "Partners", href: "/dashboard/partners", icon: <Handshake className="h-5 w-5" />, description: "Partner portal and management" },
      { id: "team", label: "Team", href: "/dashboard/team", icon: <Users className="h-5 w-5" />, description: "Team members and roles" },
      { id: "settings", label: "Settings", href: "/dashboard/settings", icon: <Settings className="h-5 w-5" />, description: "Organization settings" },
    ],
  },
];

function NavItemPreview({ item, isVisible }: { item: NavItem; isVisible: boolean }) {
  if (!isVisible) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -10, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute left-full top-0 ml-2 z-50 w-64 pointer-events-none"
    >
      <div className="glass-card rounded-xl p-4 border border-white/[0.08]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sdp-accent">{item.icon}</span>
          <span className="text-sm font-semibold text-white">{item.label}</span>
          {item.badge && (
            <span className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
              item.badge === "Pro" && "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30",
              item.badge === "Beta" && "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30",
              item.badge === "AI" && "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30"
            )}>
              {item.badge}
            </span>
          )}
        </div>
        <p className="text-xs text-white/50 mb-3">{item.description}</p>
        {item.stats && (
          <div className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2">
            <span className="text-[10px] text-white/40 uppercase tracking-wider">{item.stats.label}</span>
            <span className="text-sm font-bold text-sdp-accent">{item.stats.value}</span>
          </div>
        )}
        {item.shortcut && (
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-white/30">
            <Command className="h-3 w-3" />
            <span>+ {item.shortcut}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SidebarSection({
  section,
  isOpen,
  onToggle,
  pinnedItems,
  onPinToggle,
  recentItems,
  isCollapsed,
  activePath,
}: {
  section: NavSection;
  isOpen: boolean;
  onToggle: () => void;
  pinnedItems: Set<string>;
  onPinToggle: (id: string) => void;
  recentItems: string[];
  isCollapsed: boolean;
  activePath: string;
}) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const visibleItems = section.items.filter((item) => {
    // In real app, check capabilities here
    return true;
  });

  if (visibleItems.length === 0) return null;

  if (isCollapsed) {
    return (
      <div className="py-1">
        <div className="flex items-center justify-center py-2">
          <span className="text-white/20">{section.icon}</span>
        </div>
        <div className="space-y-0.5">
          {visibleItems.map((item) => {
            const isActive = activePath === item.href || activePath.startsWith(`${item.href}/`);
            return (
              <div key={item.id} className="relative">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-center py-2.5 mx-1 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-sdp-accent/20 to-transparent text-white"
                      : "text-white/40 hover:bg-white/5 hover:text-white/60"
                  )}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  title={item.label}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-sdp-accent shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                  )}
                  <span className={cn(isActive && "text-sdp-accent")}>{item.icon}</span>
                  {item.badge && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-sdp-accent" />
                  )}
                </Link>
                <AnimatePresence>
                  {hoveredItem === item.id && (
                    <NavItemPreview item={item} isVisible={true} />
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="py-1">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider hover:text-white/60 transition-colors"
      >
        <span className="text-white/30">{section.icon}</span>
        <span className="flex-1 text-left">{section.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 px-1">
              {visibleItems.map((item) => {
                const isActive = activePath === item.href || activePath.startsWith(`${item.href}/`);
                const isPinned = pinnedItems.has(item.id);
                const isRecent = recentItems.includes(item.id);
                
                return (
                  <div key={item.id} className="relative group">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative",
                        isActive
                          ? "bg-gradient-to-r from-sdp-accent/20 to-transparent text-white"
                          : "text-sdp-text-medium hover:bg-white/5 hover:text-sdp-text-high"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-sdp-accent shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                      )}
                      <span className={cn(isActive && "text-sdp-accent")}>{item.icon}</span>
                      <span className="truncate flex-1">{item.label}</span>
                      
                      {item.badge && (
                        <span className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0",
                          item.badge === "Pro" && "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30",
                          item.badge === "Beta" && "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30",
                          item.badge === "AI" && "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30"
                        )}>
                          {item.badge}
                        </span>
                      )}
                      
                      {isPinned && (
                        <Pin className="h-3 w-3 text-sdp-accent/60 shrink-0" />
                      )}
                      
                      {isRecent && !isPinned && (
                        <Clock className="h-3 w-3 text-white/20 shrink-0" />
                      )}
                      
                      {item.shortcut && (
                        <span className="text-[10px] text-white/20 font-mono shrink-0">
                          ⌘{item.shortcut}
                        </span>
                      )}
                    </Link>
                    
                    {/* Pin button on hover */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onPinToggle(item.id);
                      }}
                      className={cn(
                        "absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity",
                        "hover:bg-white/10 text-white/40 hover:text-white/70"
                      )}
                    >
                      <Pin className={cn("h-3 w-3", isPinned && "text-sdp-accent fill-sdp-accent")} />
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AdvancedSidebar() {
  const { isSidebarOpen, toggleSidebar, setSidebarOpen } = useDashboardWorkspace();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(NAV_SECTIONS.filter((s) => s.defaultOpen).map((s) => s.id))
  );
  const [pinnedItems, setPinnedItems] = useState<Set<string>>(() => new Set());
  const [recentItems, setRecentItems] = useState<string[]>([]);
  const [showActivityFeed, setShowActivityFeed] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Track recent items
  useEffect(() => {
    const currentItem = NAV_SECTIONS.flatMap((s) => s.items).find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
    );
    if (currentItem) {
      setRecentItems((prev) => {
        const filtered = prev.filter((id) => id !== currentItem.id);
        return [currentItem.id, ...filtered].slice(0, 5);
      });
    }
  }, [pathname]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        const shortcut = e.key;
        const item = NAV_SECTIONS.flatMap((s) => s.items).find((i) => i.shortcut === shortcut);
        if (item) {
          e.preventDefault();
          window.location.href = item.href;
        }
      }
      if (e.key === "Escape" && !isSidebarOpen) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen, setSidebarOpen]);

  const toggleSection = useCallback((sectionId: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  const togglePin = useCallback((itemId: string) => {
    setPinnedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const pinnedNavItems = NAV_SECTIONS.flatMap((s) => s.items).filter((item) => pinnedItems.has(item.id));

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "relative flex flex-col border-r border-white/[0.06] bg-sdp-sidebar-bg/95 backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] noise-overlay",
        isSidebarOpen ? "w-[280px]" : "w-[64px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-3 border-b border-white/[0.06] px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sdp-accent to-violet-500 text-white shadow-lg shadow-sdp-accent/25">
          <LayoutDashboard className="h-4 w-4" />
        </div>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="truncate text-sm font-bold text-white">SDP</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-sdp-accent/20 to-violet-500/20 text-sdp-accent border border-sdp-accent/30">
              MVP
            </span>
          </motion.div>
        )}
      </div>

      {/* Pinned Items */}
      {isSidebarOpen && pinnedNavItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-b border-white/[0.06] py-2"
        >
          <div className="px-3 pb-1 flex items-center gap-1.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">
            <Pin className="h-3 w-3" />
            Pinned
          </div>
          <div className="space-y-0.5 px-1">
            {pinnedNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-sdp-accent/20 to-transparent text-white"
                      : "text-sdp-text-medium hover:bg-white/5 hover:text-sdp-text-high"
                  )}
                >
                  <span className={cn(isActive && "text-sdp-accent")}>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto py-2 space-y-1 scrollbar-thin">
        {NAV_SECTIONS.map((section) => (
          <SidebarSection
            key={section.id}
            section={section}
            isOpen={openSections.has(section.id)}
            onToggle={() => toggleSection(section.id)}
            pinnedItems={pinnedItems}
            onPinToggle={togglePin}
            recentItems={recentItems}
            isCollapsed={!isSidebarOpen}
            activePath={pathname}
          />
        ))}
      </nav>

      {/* Activity Feed Toggle */}
      {isSidebarOpen && (
        <div className="border-t border-white/[0.06] px-3 py-2">
          <button
            onClick={() => setShowActivityFeed(!showActivityFeed)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/40 hover:bg-white/5 hover:text-white/60 transition-all"
          >
            <Activity className="h-3.5 w-3.5" />
            <span className="flex-1">Live Activity</span>
            <span className="h-2 w-2 rounded-full bg-sdp-success animate-pulse" />
            <motion.div animate={{ rotate: showActivityFeed ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-3 w-3" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {showActivityFeed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 space-y-2 px-2">
                  {[
                    { time: "2s ago", text: "API key generated", type: "success" },
                    { time: "15s ago", text: "MEV threat blocked", type: "warning" },
                    { time: "1m ago", text: "Gas prediction updated", type: "info" },
                    { time: "3m ago", text: "New swap completed", type: "success" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className={cn(
                        "h-1.5 w-1.5 rounded-full mt-1 shrink-0",
                        activity.type === "success" && "bg-sdp-success",
                        activity.type === "warning" && "bg-sdp-warning",
                        activity.type === "info" && "bg-sdp-info"
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white/50 truncate">{activity.text}</p>
                        <p className="text-white/25 text-[10px]">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="border-t border-white/[0.06] p-2">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-white/40 hover:bg-white/5 hover:text-white/60 transition-all duration-200"
        >
          {isSidebarOpen ? (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-xs">Collapse</span>
            </>
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* User / Logout */}
      <div className="border-t border-white/[0.06] p-2">
        {isSidebarOpen && user && (
          <div className="px-3 py-2 mb-1">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-sdp-accent to-violet-500 flex items-center justify-center text-[10px] font-bold text-white">
                {user.email?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/60 truncate">{user.email}</p>
                <p className="text-[10px] text-white/30 capitalize">{user.role}</p>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/40 uppercase">
                {user.role}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
