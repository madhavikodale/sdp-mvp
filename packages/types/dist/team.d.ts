/**
 * Team collaboration types
 */
export type TeamMemberRole = "owner" | "admin" | "developer" | "viewer";
export type TeamMemberStatus = "active" | "pending" | "suspended";
export interface TeamMember {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    role: TeamMemberRole;
    status: TeamMemberStatus;
    joinedAt: string;
    lastActiveAt: string | null;
    apiKeysCreated: number;
    totalRequests: number;
}
export interface TeamInvitation {
    id: string;
    email: string;
    role: TeamMemberRole;
    invitedBy: string;
    invitedAt: string;
    expiresAt: string;
    status: "pending" | "accepted" | "expired" | "revoked";
}
export interface TeamActivity {
    id: string;
    actorId: string;
    actorName: string;
    actorAvatar: string | null;
    action: string;
    target: string;
    targetType: string;
    metadata: Record<string, unknown>;
    createdAt: string;
}
export interface TeamSettings {
    name: string;
    slug: string;
    billingEmail: string;
    maxMembers: number;
    require2FA: boolean;
    allowedDomains: string[];
    defaultRole: TeamMemberRole;
}
//# sourceMappingURL=team.d.ts.map