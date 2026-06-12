"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardWorkspaceProvider } from "@/contexts/dashboard-workspace-context";
import { useAuth } from "@/contexts/auth-context";
import { resolveDashboardAccess } from "@/lib/dashboard-access";
import { resolveDashboardFeatureFlags } from "@/lib/dashboard-feature-flags";
import type { DashboardAccess, DashboardFeatureFlags, Project } from "@sdp-mvp/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MOCK_PROJECTS: Project[] = [
  { id: "proj_sandbox", slug: "sandbox", name: "Sandbox", environment: "sandbox" },
  { id: "prod_001", slug: "production", name: "Production", environment: "production" },
];

const MOCK_FLAGS: DashboardFeatureFlags = resolveDashboardFeatureFlags(undefined);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sdp-bg flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const access: DashboardAccess = resolveDashboardAccess(user?.role ?? "member");

  return (
    <DashboardWorkspaceProvider
      dashboardAccess={access}
      featureFlags={MOCK_FLAGS}
      projects={MOCK_PROJECTS}
      initialSelectedProjectId={MOCK_PROJECTS[0]?.id ?? null}
      initialSidebarOpen={true}
    >
      <DashboardShell>{children}</DashboardShell>
    </DashboardWorkspaceProvider>
  );
}
