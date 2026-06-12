import {
  Brain,
  Flame,
  Globe,
  KeyRound,
  Layers,
  LineChart,
  Radio,
  Shield,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { QuickActionCard } from "@/components/quick-action-card";
import { AnimatedCounter } from "@/components/animated-counter";
import { MiniChart } from "@/components/mini-chart";
import { StatusPulse } from "@/components/status-pulse";
import { GlassHeader } from "@/components/glass-header";
import { WebSocketFeed } from "@/components/websocket-feed";
import { QuotaUsageWidget } from "@/components/quota-usage-widget";
import { RpcMethodsPanel } from "@/components/rpc-methods-panel";
import { getDashboardStats } from "./actions";

export const metadata = {
  title: "Dashboard",
  description: "Overview of your workspace",
};

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8 -mt-4">
      <GlassHeader
        title="Welcome back"
        description="Manage your multi-chain infrastructure from one place."
      >
        <StatusPulse status="online" label="All systems operational" />
      </GlassHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Requests"
          value={stats.totalRequests}
          change={stats.requestsChange}
          prefix=""
          chart={stats.requestChart}
          chartColor="#6366f1"
        />
        <StatCard
          label="Avg Latency"
          value={stats.avgLatency}
          change={stats.latencyChange}
          suffix="ms"
          chart={stats.latencyChart}
          chartColor="#10b981"
        />
        <StatCard
          label="Error Rate"
          value={stats.errorRate}
          change={stats.errorRateChange}
          suffix="%"
          decimals={2}
          invertChange
        />
        <StatCard
          label="Est. Cost"
          value={stats.estimatedCost}
          change={stats.costChange}
          prefix="$"
          decimals={2}
        />
      </div>

      {/* Quota + RPC Methods Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <QuotaUsageWidget
            used={stats.quota.used}
            limit={stats.quota.limit}
            unit={stats.quota.unit}
            tier={stats.quota.tier}
            billingCycle={stats.quota.billingCycle}
            burnRate={stats.quota.burnRate}
          />
        </div>
        <div className="lg:col-span-2">
          <RpcMethodsPanel
            data={stats.rpcMethods}
            totalRequests={stats.totalRequests}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">Core Features</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickActionCard
              title="RPC Endpoints"
              description="Manage multi-chain RPC infrastructure with failover."
              icon={<Globe className="h-5 w-5" />}
              href="/dashboard/rpc"
              accent="indigo"
            />
            <QuickActionCard
              title="Streams"
              description="Real-time blockchain data via webhooks and websockets."
              icon={<Radio className="h-5 w-5" />}
              href="/dashboard/streams"
              accent="violet"
            />
            <QuickActionCard
              title="Analytics"
              description="Monitor usage, latency, and costs across all chains."
              icon={<LineChart className="h-5 w-5" />}
              href="/dashboard/analytics"
              accent="emerald"
            />
            <QuickActionCard
              title="API Keys"
              description="Create and manage API keys for your applications."
              icon={<KeyRound className="h-5 w-5" />}
              href="/dashboard/api-keys"
              accent="amber"
            />
            <QuickActionCard
              title="Wallets"
              description="Configure custody providers and manage wallets."
              icon={<Wallet className="h-5 w-5" />}
              href="/dashboard/wallets"
              accent="sky"
            />
            <QuickActionCard
              title="Team"
              description="Manage team members and workspace access."
              icon={<Users className="h-5 w-5" />}
              href="/dashboard/team"
              accent="rose"
            />
          </div>
        </div>
        <WebSocketFeed />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Advanced Features</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickActionCard
            title="Gasless"
            description="Paymaster sponsorship for gasless transactions."
            icon={<Zap className="h-5 w-5" />}
            href="/dashboard/gasless"
            accent="yellow"
          />
          <QuickActionCard
            title="AI Intents"
            description="Natural language to blockchain transactions."
            icon={<Brain className="h-5 w-5" />}
            href="/dashboard/intents"
            accent="fuchsia"
          />
          <QuickActionCard
            title="Bridge"
            description="Cross-chain transfers and orchestration."
            icon={<Globe className="h-5 w-5" />}
            href="/dashboard/bridge"
            accent="cyan"
          />
          <QuickActionCard
            title="Gas Optimizer"
            description="AI-powered gas price forecasting."
            icon={<Flame className="h-5 w-5" />}
            href="/dashboard/gas"
            accent="orange"
          />
          <QuickActionCard
            title="Compliance"
            description="On-chain KYC and risk scoring."
            icon={<Shield className="h-5 w-5" />}
            href="/dashboard/compliance"
            accent="teal"
          />
          <QuickActionCard
            title="Rollups"
            description="One-click L2/L3 deployment."
            icon={<Layers className="h-5 w-5" />}
            href="/dashboard/rollup"
            accent="purple"
          />
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm overflow-hidden">
        <div className="border-b border-white/[0.06] px-5 py-4">
          <h2 className="font-semibold text-white">Recent Activity</h2>
        </div>
        <div className="divide-y divide-white/[0.06]">
          {stats.recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-2 w-2 rounded-full ${
                    activity.type === "success"
                      ? "bg-emerald-500"
                      : activity.type === "warning"
                      ? "bg-amber-500"
                      : "bg-sdp-accent"
                  }`}
                />
                <div>
                  <p className="text-sm text-white/80">{activity.action}</p>
                  <p className="text-xs text-white/40">{activity.project}</p>
                </div>
              </div>
              <span className="text-xs text-white/30">{activity.time}</span>
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
  change,
  prefix = "",
  suffix = "",
  decimals = 0,
  invertChange = false,
  chart,
  chartColor = "#6366f1",
}: {
  label: string;
  value: number;
  change: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  invertChange?: boolean;
  chart?: Array<{ label: string; value: number }>;
  chartColor?: string;
}) {
  const isPositive = invertChange ? change < 0 : change > 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.12] card-lift">
      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-wider text-white/40">
          {label}
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <AnimatedCounter
            value={value}
            prefix={prefix}
            suffix={suffix}
            decimals={decimals}
            className="text-2xl font-bold text-white"
          />
        </div>
        <div
          className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            isPositive
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          <Icon className="h-3 w-3" />
          {Math.abs(change)}%
        </div>
      </div>
      {chart && (
        <div className="mt-4 -mx-2 -mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
          <MiniChart data={chart} color={chartColor} height={70} />
        </div>
      )}
    </div>
  );
}
