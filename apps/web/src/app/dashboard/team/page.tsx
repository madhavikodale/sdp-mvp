import { Button } from "@/components/ui/button";
import {
  Crown,
  Mail,
  Plus,
  Shield,
  User,
  UserCog,
  Users,
  Clock,
  KeyRound,
  Activity,
} from "lucide-react";
import { listTeamMembers, listInvitations, listActivity, getTeamSettings } from "./actions";
import type { TeamMember, TeamInvitation, TeamActivity } from "@sdp-mvp/types";

export const metadata = {
  title: "Team",
  description: "Manage team members and invitations",
};

export default async function TeamPage() {
  const [members, invitations, activity, settings] = await Promise.all([
    listTeamMembers(),
    listInvitations(),
    listActivity(),
    getTeamSettings(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-sdp-text-high">Team</h1>
          <p className="mt-1 text-sdp-text-medium">
            Manage team members, roles, and workspace access.
          </p>
        </div>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          Invite Member
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Members"
          value={members.length}
          icon={<Users className="h-5 w-5" />}
          color="text-blue-400"
          gradient="from-blue-500/20 to-blue-500/5"
        />
        <StatCard
          label="Active"
          value={members.filter((m) => m.status === "active" && m.lastActiveAt && new Date(m.lastActiveAt) > new Date(Date.now() - 86400000)).length}
          icon={<Activity className="h-5 w-5" />}
          color="text-emerald-400"
          gradient="from-emerald-500/20 to-emerald-500/5"
        />
        <StatCard
          label="API Keys"
          value={members.reduce((a, b) => a + b.apiKeysCreated, 0)}
          icon={<KeyRound className="h-5 w-5" />}
          color="text-purple-400"
          gradient="from-purple-500/20 to-purple-500/5"
        />
        <StatCard
          label="Pending Invites"
          value={invitations.filter((i) => i.status === "pending").length}
          icon={<Mail className="h-5 w-5" />}
          color="text-amber-400"
          gradient="from-amber-500/20 to-amber-500/5"
        />
      </div>

      {/* Members Table */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <h2 className="font-medium text-sdp-text-high">Members</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-sdp-bg text-sdp-text-medium">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Role</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">API Keys</th>
              <th className="px-4 py-3 text-right font-medium">Requests</th>
              <th className="px-4 py-3 text-right font-medium">Last Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sdp-border">
            {members.map((member) => (
              <MemberRow key={member.id} member={member} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Invitations */}
      {invitations.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="font-medium text-sdp-text-high">Pending Invitations</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-sdp-bg text-sdp-text-medium">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium">Invited By</th>
                <th className="px-4 py-3 text-right font-medium">Expires</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sdp-border">
              {invitations.map((inv) => (
                <InvitationRow key={inv.id} invitation={inv} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Activity Feed */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <h2 className="font-medium text-sdp-text-high">Recent Activity</h2>
        </div>
        <div className="divide-y divide-sdp-border">
          {activity.map((act) => (
            <ActivityItem key={act.id} activity={act} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  gradient,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  gradient?: string;
}) {
  return (
    <div className={`rounded-xl border border-white/10 bg-gradient-to-br ${gradient || 'from-white/10 to-white/5'} backdrop-blur-md p-5 card-lift`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-sdp-text-medium">{label}</p>
          <p className="text-xl font-semibold text-sdp-text-high">{value}</p>
        </div>
      </div>
    </div>
  );
}

function MemberRow({ member }: { member: TeamMember }) {
  const roleConfig = {
    owner: { icon: <Crown className="h-3.5 w-3.5" />, color: "bg-amber-500/20 text-amber-400" },
    admin: { icon: <Shield className="h-3.5 w-3.5" />, color: "bg-purple-500/20 text-purple-400" },
    developer: { icon: <UserCog className="h-3.5 w-3.5" />, color: "bg-blue-500/20 text-blue-400" },
    viewer: { icon: <User className="h-3.5 w-3.5" />, color: "bg-white/10 text-sdp-text-medium" },
  };

  const role = roleConfig[member.role];

  return (
    <tr className="hover:bg-sdp-bg/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sdp-bg text-sm font-medium text-sdp-text-high">
            {member.name.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-sdp-text-high">{member.name}</div>
            <div className="text-xs text-sdp-text-low">{member.email}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${role.color}`}>
          {role.icon}
          {member.role}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
          member.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-sdp-text-medium"
        }`}>
          {member.status}
        </span>
      </td>
      <td className="px-4 py-3 text-right text-sdp-text-medium">{member.apiKeysCreated}</td>
      <td className="px-4 py-3 text-right text-sdp-text-medium">{member.totalRequests.toLocaleString()}</td>
      <td className="px-4 py-3 text-right text-sdp-text-medium">
        {member.lastActiveAt ? formatTimeAgo(new Date(member.lastActiveAt)) : "Never"}
      </td>
    </tr>
  );
}

function InvitationRow({ invitation }: { invitation: TeamInvitation }) {
  return (
    <tr className="hover:bg-sdp-bg/50 transition-colors">
      <td className="px-4 py-3 font-medium text-sdp-text-high">{invitation.email}</td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center rounded-full bg-sdp-bg px-2 py-0.5 text-xs font-medium text-sdp-text-medium capitalize">
          {invitation.role}
        </span>
      </td>
      <td className="px-4 py-3 text-sdp-text-medium">{invitation.invitedBy}</td>
      <td className="px-4 py-3 text-right text-sdp-text-medium">
        {formatTimeAgo(new Date(invitation.expiresAt))}
      </td>
      <td className="px-4 py-3 text-right">
        <Button variant="secondary" size="sm">Resend</Button>
      </td>
    </tr>
  );
}

function ActivityItem({ activity }: { activity: TeamActivity }) {
  const actionColors: Record<string, string> = {
    created: "bg-emerald-500/20 text-emerald-400",
    deployed: "bg-blue-500/20 text-blue-400",
    invited: "bg-purple-500/20 text-purple-400",
    deleted: "bg-red-500/20 text-red-400",
    updated: "bg-amber-500/20 text-amber-400",
  };

  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${actionColors[activity.action] || "bg-sdp-bg text-sdp-text-medium"}`}>
        <User className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-sdp-text-high">
          <span className="font-medium">{activity.actorName}</span>{" "}
          <span className="text-sdp-text-medium">{activity.action}</span>{" "}
          <span className="font-medium">{activity.target}</span>
        </p>
        <p className="text-xs text-sdp-text-low mt-0.5">
          {formatTimeAgo(new Date(activity.createdAt))}
        </p>
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}
