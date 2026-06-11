import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardWorkspaceProvider } from "@/contexts/dashboard-workspace-context";
import { resolveDashboardAccess } from "@/lib/dashboard-access";
import { resolveDashboardFeatureFlags } from "@/lib/dashboard-feature-flags";
import type { DashboardAccess, DashboardFeatureFlags, Project } from "@sdp-mvp/types";

// Mock data - replace with actual API calls
const MOCK_PROJECTS: Project[] = [
  { id: "proj_sandbox", slug: "sandbox", name: "Sandbox", environment: "sandbox" },
  { id: "prod_001", slug: "production", name: "Production", environment: "production" },
];

const MOCK_ACCESS: DashboardAccess = resolveDashboardAccess("admin");
const MOCK_FLAGS: DashboardFeatureFlags = resolveDashboardFeatureFlags(undefined);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardWorkspaceProvider
      dashboardAccess={MOCK_ACCESS}
      featureFlags={MOCK_FLAGS}
      projects={MOCK_PROJECTS}
      initialSelectedProjectId={MOCK_PROJECTS[0]?.id ?? null}
      initialSidebarOpen={true}
    >
      <div className="ambient-bg" />
      <DashboardShell>{children}</DashboardShell>
    </DashboardWorkspaceProvider>
  );
}
