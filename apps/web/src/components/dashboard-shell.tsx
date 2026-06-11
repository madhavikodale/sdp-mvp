"use client";

import { PageTransition } from "@/components/page-transition";
import { CommandPalette } from "@/components/command-palette";
import { ThemeToggle } from "@/components/theme-toggle";
import { useDashboardWorkspace } from "@/contexts/dashboard-workspace-context";
import { cn } from "@/lib/utils";
import {
  Brain,
  ChevronLeft,
  ChevronRight,
  Coins,
  Flame,
  Globe,
  Handshake,
  Home,
  KeyRound,
  Layers,
  LayoutDashboard,
  LineChart,
  Radio,
  Settings,
  Shield,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  requiredCapability?: keyof ReturnType<typeof useDashboardWorkspace>["dashboardAccess"]["capabilities"];
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    id: "rpc",
    label: "RPC Endpoints",
    href: "/dashboard/rpc",
    icon: <Globe className="h-5 w-5" />,
    requiredCapability: "canManageApiKeys",
  },
  {
    id: "streams",
    label: "Streams",
    href: "/dashboard/streams",
    icon: <Radio className="h-5 w-5" />,
    requiredCapability: "canManageApiKeys",
  },
  {
    id: "analytics",
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: <LineChart className="h-5 w-5" />,
    requiredCapability: "canManageApiKeys",
  },
  {
    id: "api-keys",
    label: "API Keys",
    href: "/dashboard/api-keys",
    icon: <KeyRound className="h-5 w-5" />,
    requiredCapability: "canManageApiKeys",
  },
  {
    id: "tokens",
    label: "Tokens",
    href: "/dashboard/tokens",
    icon: <Coins className="h-5 w-5" />,
    requiredCapability: "canManageTokenAdmin",
  },
  {
    id: "wallets",
    label: "Wallets",
    href: "/dashboard/wallets",
    icon: <Wallet className="h-5 w-5" />,
    requiredCapability: "canManageCustody",
  },
  {
    id: "gasless",
    label: "Gasless",
    href: "/dashboard/gasless",
    icon: <Zap className="h-5 w-5" />,
    requiredCapability: "canManageCustody",
  },
  {
    id: "intents",
    label: "AI Intents",
    href: "/dashboard/intents",
    icon: <Brain className="h-5 w-5" />,
    requiredCapability: "canManageCustody",
  },
  {
    id: "bridge",
    label: "Bridge",
    href: "/dashboard/bridge",
    icon: <Globe className="h-5 w-5" />,
    requiredCapability: "canManageCustody",
  },
  {
    id: "gas",
    label: "Gas Optimizer",
    href: "/dashboard/gas",
    icon: <Flame className="h-5 w-5" />,
    requiredCapability: "canManageApiKeys",
  },
  {
    id: "compliance",
    label: "Compliance",
    href: "/dashboard/compliance",
    icon: <Shield className="h-5 w-5" />,
    requiredCapability: "canManageOrgSettings",
  },
  {
    id: "rollup",
    label: "Rollups",
    href: "/dashboard/rollup",
    icon: <Layers className="h-5 w-5" />,
    requiredCapability: "canManageOrgSettings",
  },
  {
    id: "partners",
    label: "Partners",
    href: "/dashboard/partners",
    icon: <Handshake className="h-5 w-5" />,
    requiredCapability: "canManageOrgSettings",
  },
  {
    id: "team",
    label: "Team",
    href: "/dashboard/team",
    icon: <Users className="h-5 w-5" />,
    requiredCapability: "canManageOrgSettings",
  },
  {
    id: "settings",
    label: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
    requiredCapability: "canManageOrgSettings",
  },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const { dashboardAccess, isSidebarOpen, toggleSidebar, selectedProjectId, projects, selectProject } =
    useDashboardWorkspace();
  const pathname = usePathname();

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (!item.requiredCapability) return true;
    return dashboardAccess.capabilities[item.requiredCapability];
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="ambient-bg" />
      <aside
        className={cn(
          "relative flex flex-col border-r border-white/[0.06] bg-sdp-sidebar-bg/95 backdrop-blur-xl transition-all duration-300 ease-in-out noise-overlay",
          isSidebarOpen ? "w-[260px]" : "w-[64px]"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-3 border-b border-white/[0.06] px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sdp-accent to-violet-500 text-white shadow-lg shadow-sdp-accent/25">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          {isSidebarOpen && (
            <span className="truncate text-sm font-bold text-white">SDP MVP</span>
          )}
        </div>

        {/* Project Switcher */}
        {isSidebarOpen && (
          <div className="border-b border-white/[0.06] p-3">
            <select
              value={selectedProjectId || ""}
              onChange={(e) => selectProject(e.target.value || null)}
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-sdp-accent/50 focus:outline-none focus:ring-1 focus:ring-sdp-accent/50 transition-colors"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} ({project.environment})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative",
                  isActive
                    ? "bg-gradient-to-r from-sdp-accent/20 to-transparent text-white"
                    : "text-sdp-text-medium hover:bg-white/5 hover:text-sdp-text-high",
                  !isSidebarOpen && "justify-center px-2"
                )}
                title={!isSidebarOpen ? item.label : undefined}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-sdp-accent shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                )}
                <span className={cn(isActive && "text-sdp-accent")}>{item.icon}</span>
                {isSidebarOpen && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t border-white/[0.06] p-2">
          <button
            onClick={toggleSidebar}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-white/40 hover:bg-white/5 hover:text-white/60 transition-all duration-200"
          >
            {isSidebarOpen ? (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>

      <main className="relative z-10 flex-1 overflow-auto bg-sdp-bg/50 noise-overlay">
        <div className="sticky top-0 z-40 -mx-6 flex items-center justify-end gap-3 border-b border-white/[0.06] bg-sdp-bg/80 px-6 py-3 backdrop-blur-xl">
          <CommandPalette />
          <ThemeToggle />
        </div>
        <div className="mx-auto max-w-6xl p-6 pt-4">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
    </div>
  );
}
