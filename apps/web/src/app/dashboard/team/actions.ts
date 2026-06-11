"use server";

import type { TeamMember, TeamInvitation, TeamActivity, TeamSettings } from "@sdp-mvp/types";

const mockMembers: TeamMember[] = [
  {
    id: "user_001",
    email: "admin@openscanai.com",
    name: "Admin User",
    avatarUrl: null,
    role: "owner",
    status: "active",
    joinedAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    lastActiveAt: new Date(Date.now() - 300000).toISOString(),
    apiKeysCreated: 12,
    totalRequests: 2_456_789,
  },
  {
    id: "user_002",
    email: "dev@openscanai.com",
    name: "Developer User",
    avatarUrl: null,
    role: "developer",
    status: "active",
    joinedAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    lastActiveAt: new Date(Date.now() - 3600000).toISOString(),
    apiKeysCreated: 4,
    totalRequests: 876_432,
  },
  {
    id: "user_003",
    email: "viewer@openscanai.com",
    name: "Viewer User",
    avatarUrl: null,
    role: "viewer",
    status: "active",
    joinedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    lastActiveAt: new Date(Date.now() - 86400000).toISOString(),
    apiKeysCreated: 0,
    totalRequests: 45_678,
  },
];

const mockInvitations: TeamInvitation[] = [
  {
    id: "inv_001",
    email: "newdev@openscanai.com",
    role: "developer",
    invitedBy: "Admin User",
    invitedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 5 * 86400000).toISOString(),
    status: "pending",
  },
];

const mockActivity: TeamActivity[] = [
  {
    id: "act_001",
    actorId: "user_001",
    actorName: "Admin User",
    actorAvatar: null,
    action: "created",
    target: "Production API Key",
    targetType: "api_key",
    metadata: { keyPrefix: "pk_live_abc" },
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "act_002",
    actorId: "user_002",
    actorName: "Developer User",
    actorAvatar: null,
    action: "deployed",
    target: "Solana Mainnet Endpoint",
    targetType: "endpoint",
    metadata: { region: "us-east-1" },
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: "act_003",
    actorId: "user_001",
    actorName: "Admin User",
    actorAvatar: null,
    action: "invited",
    target: "newdev@openscanai.com",
    targetType: "user",
    metadata: { role: "developer" },
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "act_004",
    actorId: "user_002",
    actorName: "Developer User",
    actorAvatar: null,
    action: "created",
    target: "Ethereum Logs Stream",
    targetType: "stream",
    metadata: { chain: "ethereum" },
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

const mockSettings: TeamSettings = {
  name: "OpenScanAI",
  slug: "openscanai",
  billingEmail: "billing@openscanai.com",
  maxMembers: 10,
  require2FA: false,
  allowedDomains: ["openscanai.com"],
  defaultRole: "developer",
};

export async function listTeamMembers(): Promise<TeamMember[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return [...mockMembers];
}

export async function listInvitations(): Promise<TeamInvitation[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return [...mockInvitations];
}

export async function listActivity(): Promise<TeamActivity[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return [...mockActivity];
}

export async function getTeamSettings(): Promise<TeamSettings> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return { ...mockSettings };
}
