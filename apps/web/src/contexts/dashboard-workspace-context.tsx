"use client";

import type { DashboardAccess, DashboardFeatureFlags, Project, SdpEnvironment } from "@sdp-mvp/types";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface DashboardWorkspaceContextValue {
  dashboardAccess: DashboardAccess;
  featureFlags: DashboardFeatureFlags;
  projects: Project[];
  sandboxProject: Project | null;
  productionProject: Project | null;
  selectedProjectId: string | null;
  sdpEnvironment: SdpEnvironment;
  isSidebarOpen: boolean;
  selectProject: (projectId: string | null) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const DashboardWorkspaceContext = createContext<DashboardWorkspaceContextValue | undefined>(
  undefined
);

interface DashboardWorkspaceProviderProps {
  children: ReactNode;
  dashboardAccess: DashboardAccess;
  featureFlags: DashboardFeatureFlags;
  projects: Project[];
  initialSelectedProjectId: string | null;
  initialSidebarOpen?: boolean;
}

export function DashboardWorkspaceProvider({
  children,
  dashboardAccess,
  featureFlags,
  projects,
  initialSelectedProjectId,
  initialSidebarOpen = true,
}: DashboardWorkspaceProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpenState] = useState(initialSidebarOpen);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    initialSelectedProjectId ?? projects.find((p) => p.environment === "sandbox")?.id ?? null
  );

  const sandboxProject = useMemo(
    () => projects.find((p) => p.environment === "sandbox") ?? null,
    [projects]
  );

  const productionProject = useMemo(
    () => projects.find((p) => p.environment === "production") ?? null,
    [projects]
  );

  const sdpEnvironment: SdpEnvironment =
    selectedProjectId && selectedProjectId === productionProject?.id ? "production" : "sandbox";

  const selectProject = useCallback(
    (projectId: string | null) => {
      setSelectedProjectId(projectId);
      // In real app: call server action to persist cookie
      router.refresh();
    },
    [router]
  );

  // Persist valid selection
  useEffect(() => {
    const selectionIsValid =
      selectedProjectId !== null && projects.some((p) => p.id === selectedProjectId);
    if (!selectionIsValid) {
      const target = sandboxProject?.id ?? productionProject?.id ?? null;
      if (target !== selectedProjectId) {
        setSelectedProjectId(target);
      }
    }
  }, [selectedProjectId, projects, sandboxProject, productionProject]);

  // Clear tab query param on navigation
  const [prevPathname, setPrevPathname] = useState(pathname);
  useEffect(() => {
    if (prevPathname !== pathname) {
      setPrevPathname(pathname);
    }
  }, [pathname, prevPathname]);

  const setSidebarOpen = useCallback((open: boolean) => {
    setSidebarOpenState(open);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpenState((current) => !current);
  }, []);

  const value = useMemo<DashboardWorkspaceContextValue>(
    () => ({
      dashboardAccess,
      featureFlags,
      projects,
      sandboxProject,
      productionProject,
      selectedProjectId,
      sdpEnvironment,
      isSidebarOpen,
      selectProject,
      setSidebarOpen,
      toggleSidebar,
    }),
    [
      dashboardAccess,
      featureFlags,
      projects,
      sandboxProject,
      productionProject,
      selectedProjectId,
      sdpEnvironment,
      isSidebarOpen,
      selectProject,
      setSidebarOpen,
      toggleSidebar,
    ]
  );

  return (
    <DashboardWorkspaceContext.Provider value={value}>
      {children}
    </DashboardWorkspaceContext.Provider>
  );
}

export function useDashboardWorkspace() {
  const context = useContext(DashboardWorkspaceContext);
  if (!context) {
    throw new Error("useDashboardWorkspace must be used within DashboardWorkspaceProvider");
  }
  return context;
}
