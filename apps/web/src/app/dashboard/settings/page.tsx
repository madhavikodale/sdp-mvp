import { Settings, Bell, Shield, Users } from "lucide-react";

export const metadata = {
  title: "Settings",
  description: "Workspace settings",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-sdp-text-high">Settings</h1>
        <p className="mt-1 text-sdp-text-medium">
          Manage your workspace preferences and configuration.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SettingsCard
          title="General"
          description="Workspace name, timezone, and defaults."
          icon={<Settings className="h-5 w-5" />}
        />
        <SettingsCard
          title="Security"
          description="2FA, session management, and audit logs."
          icon={<Shield className="h-5 w-5" />}
        />
        <SettingsCard
          title="Notifications"
          description="Email and webhook alert preferences."
          icon={<Bell className="h-5 w-5" />}
        />
        <SettingsCard
          title="Members"
          description="Invite and manage team access."
          icon={<Users className="h-5 w-5" />}
        />
      </div>
    </div>
  );
}

function SettingsCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-5 card-lift gradient-border">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sdp-bg text-sdp-text-high">
          {icon}
        </div>
        <h3 className="font-medium text-sdp-text-high">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-sdp-text-medium">{description}</p>
    </div>
  );
}
