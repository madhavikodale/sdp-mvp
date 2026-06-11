"use client";

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
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-sdp-border bg-sdp-sidebar-bg transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-[260px]" : "w-[64px]"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-3 border-b border-sdp-border px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sdp-accent text-sdp-accent-text">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          {isSidebarOpen && (
            <span className="truncate text-sm font-semibold text-sdp-text-high">SDP MVP</span>
          )}
        </div>

        {/* Project Switcher */}
        {isSidebarOpen && (
          <div className="border-b border-sdp-border p-3">
            <select
              value={selectedProjectId || ""}
              onChange={(e) => selectProject(e.target.value || null)}
              className="w-full rounded-lg border border-sdp-border bg-sdp-bg px-3 py-2 text-sm text-sdp-text-high"
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
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sdp-bg text-sdp-text-high"
                    : "text-sdp-text-medium hover:bg-sdp-bg hover:text-sdp-text-high",
                  !isSidebarOpen && "justify-center px-2"
                )}
                title={!isSidebarOpen ? item.label : undefined}
              >
                {item.icon}
                {isSidebarOpen && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t border-sdp-border p-2">
          <button
            onClick={toggleSidebar}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-sdp-text-low hover:bg-sdp-bg hover:text-sdp-text-medium transition-colors"
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

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-sdp-bg">
        <div className="mx-auto max-w-6xl p-6">{children}</div>
      </main>
    </div>
  );
}
