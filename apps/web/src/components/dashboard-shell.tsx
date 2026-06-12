import { AdvancedSidebar } from "@/components/advanced-sidebar";
import { CommandCenter } from "@/components/command-center";
import { RouteProgressBar, CursorGlow } from "@/components/physics-animations";
import { PageTransition } from "@/components/page-transition";
import { ThemeToggle } from "@/components/theme-toggle";
import { useDashboardWorkspace } from "@/contexts/dashboard-workspace-context";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export function DashboardShell({ children }: { children: ReactNode }) {
  const { isSidebarOpen } = useDashboardWorkspace();

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="ambient-bg" />
      <CursorGlow />
      <RouteProgressBar />
      
      <AdvancedSidebar />
      
      <main className="relative z-10 flex-1 overflow-auto bg-sdp-bg/50 noise-overlay">
        <CommandCenter />
        <div className={cn(
          "mx-auto p-6 pt-4 transition-all duration-300",
          isSidebarOpen ? "max-w-6xl" : "max-w-7xl"
        )}>
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
    </div>
  );
}
