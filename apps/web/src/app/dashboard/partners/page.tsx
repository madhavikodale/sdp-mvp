import {
  ArrowRight,
  BarChart3,
  DollarSign,
  Globe,
  Palette,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { getPartner, listTenants, listRevenue } from "./actions";
import { PARTNER_TIERS } from "@sdp-mvp/types";

export const metadata = {
  title: "Partners",
  description: "White-label partner platform",
};

export default async function PartnersPage() {
  const [partner, tenants, revenue] = await Promise.all([
    getPartner(),
    listTenants(),
    listRevenue(),
  ]);

  const tier = PARTNER_TIERS[partner.tier];
  const activeTenants = tenants.filter((t) => t.status === "active").length;
  const pendingPayout = revenue.find((r) => r.status === "pending");
  const lastPayout = revenue.find((r) => r.status === "completed");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Partner Portal
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-400">
              <Zap className="h-3 w-3" />
              {tier.label}
            </span>
          </div>
          <p className="mt-2 text-sm text-white/40">
            White-label platform with {partner.revenueShare}% revenue share ·{" "}
            {partner.customDomain}
          </p>
        </div>
        <Link
          href="/dashboard/partners/tenants"
          className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          Manage Tenants
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Tenants"
          value={partner.totalTenants}
          active={activeTenants}
          icon={<Users className="h-5 w-5" />}
          accent="indigo"
        />
        <StatCard
          label="Monthly Requests"
          value={partner.monthlyRequests.toLocaleString()}
          icon={<BarChart3 className="h-5 w-5" />}
          accent="emerald"
        />
        <StatCard
          label="Total Revenue"
          value={`$${partner.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          accent="amber"
        />
        <StatCard
          label="Pending Payout"
          value={`$${partner.pendingPayout.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          accent="purple"
        />
      </div>

      {/* Tier Progress */}
      <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 gradient-border">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Partner Tier</h2>
            <p className="mt-1 text-sm text-white/40">
              You are on the {tier.label} tier with {partner.revenueShare}% revenue share
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{tier.revenueShare}%</p>
            <p className="text-xs text-white/40">Revenue Share</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {Object.entries(PARTNER_TIERS).map(([key, t]) => {
            const isCurrent = key === partner.tier;
            const isUnlocked =
              partner.totalRevenue >= t.minRevenue;
            return (
              <div
                key={key}
                className={`flex items-center gap-4 rounded-lg border p-3 transition-colors ${
                  isCurrent
                    ? "border-amber-500/30 bg-amber-500/10"
                    : isUnlocked
                    ? "border-white/10 bg-white/5"
                    : "border-white/5 bg-white/[0.02] opacity-50"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    isCurrent
                      ? "bg-amber-500/20 text-amber-400"
                      : isUnlocked
                      ? "bg-white/10 text-white/60"
                      : "bg-white/5 text-white/30"
                  }`}
                >
                  {t.label[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {t.label}
                    </span>
                    {isCurrent && (
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-1">
                    {t.features.map((f) => (
                      <span
                        key={f}
                        className="text-xs text-white/30"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    {t.revenueShare}%
                  </p>
                  <p className="text-xs text-white/30">
                    ${t.minRevenue.toLocaleString()} min
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Partner Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ToolCard
            title="Tenants"
            description="Manage customer tenants and API access"
            icon={<Users className="h-5 w-5" />}
            href="/dashboard/partners/tenants"
            accent="indigo"
          />
          <ToolCard
            title="Billing"
            description="Revenue sharing and payout history"
            icon={<DollarSign className="h-5 w-5" />}
            href="/dashboard/partners/billing"
            accent="emerald"
          />
          <ToolCard
            title="Branding"
            description="White-label customization and domain"
            icon={<Palette className="h-5 w-5" />}
            href="/dashboard/partners/branding"
            accent="purple"
          />
          <ToolCard
            title="Analytics"
            description="Partner-specific usage insights"
            icon={<BarChart3 className="h-5 w-5" />}
            href="/dashboard/partners/analytics"
            accent="amber"
          />
        </div>
      </div>

      {/* Recent Tenants */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-medium text-white">Recent Tenants</h2>
          <Link
            href="/dashboard/partners/tenants"
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            View all
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Tenant</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Requests</th>
              <th className="px-4 py-3 text-right font-medium">Monthly Spend</th>
              <th className="px-4 py-3 text-right font-medium">Last Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tenants.slice(0, 5).map((tenant) => (
              <tr
                key={tenant.id}
                className="hover:bg-white/5 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{tenant.name}</div>
                  <div className="text-xs text-white/30">{tenant.email}</div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      tenant.status === "active"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : tenant.status === "suspended"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-white/10 text-white/40"
                    }`}
                  >
                    {tenant.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-white/60">
                  {tenant.monthlyRequests.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-white/60">
                  ${tenant.monthlySpend.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right text-white/40">
                  {tenant.lastActiveAt
                    ? formatTimeAgo(new Date(tenant.lastActiveAt))
                    : "Never"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payout History */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <h2 className="font-medium text-white">Payout History</h2>
        </div>
        <div className="divide-y divide-white/5">
          {revenue.map((rev) => (
            <div
              key={rev.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    rev.status === "completed"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  <DollarSign className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {rev.period}
                  </p>
                  <p className="text-xs text-white/30">
                    {rev.status === "completed"
                      ? `Paid ${formatTimeAgo(new Date(rev.paidAt!))}`
                      : "Pending payout"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">
                  ${rev.partnerShare.toFixed(2)}
                </p>
                <p className="text-xs text-white/30">
                  {rev.status === "completed" ? "Paid" : "Pending"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  active,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  active?: number;
  icon: React.ReactNode;
  accent: "indigo" | "emerald" | "amber" | "purple";
}) {
  const accentColors = {
    indigo: "from-indigo-500/20 to-indigo-500/5 text-indigo-400",
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-400",
    amber: "from-amber-500/20 to-amber-500/5 text-amber-400",
    purple: "from-purple-500/20 to-purple-500/5 text-purple-400",
  };

  return (
    <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-5 card-lift gradient-border">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${accentColors[accent]}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-xl font-bold text-white">
            {value}
            {active !== undefined && (
              <span className="text-sm font-normal text-white/30">
                {" "}
                / {active} active
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function ToolCard({
  title,
  description,
  icon,
  href,
  accent,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  accent: string;
}) {
  const accentGradients: Record<string, string> = {
    indigo: "from-indigo-500/20 to-indigo-500/5 text-indigo-400",
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-400",
    purple: "from-purple-500/20 to-purple-500/5 text-purple-400",
    amber: "from-amber-500/20 to-amber-500/5 text-amber-400",
  };

  return (
    <Link
      href={href}
      className="group rounded-xl border border-white/[0.06] p-5 transition-all duration-300 hover:border-white/[0.12] card-lift gradient-border"
      style={{
        background: "rgba(20, 20, 30, 0.6)",
        backdropFilter: "blur(20px) saturate(180%)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${accentGradients[accent] || accentGradients.indigo}`}
        >
          {icon}
        </div>
        <h3 className="font-medium text-white">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-white/40">{description}</p>
      <div className="mt-4 flex items-center gap-1 text-sm text-white/60 group-hover:text-white transition-colors">
        Open
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
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
  return `${days}d ago`;
}
