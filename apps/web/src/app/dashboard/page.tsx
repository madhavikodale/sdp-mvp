import {
  Brain,
  Flame,
  Globe,
  KeyRound,
  Layers,
  LineChart,
  Radio,
  Shield,
  Users,
  Wallet,
  Zap,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Dashboard",
  description: "Overview of your workspace",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-white/40">
          Manage your multi-chain infrastructure from one place.
        </p>
      </div>

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

      {/* Phase 2 Features */}
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
    </div>
  );
}

function QuickActionCard({
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
    violet: "from-violet-500/20 to-violet-500/5 text-violet-400",
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-400",
    amber: "from-amber-500/20 to-amber-500/5 text-amber-400",
    sky: "from-sky-500/20 to-sky-500/5 text-sky-400",
    rose: "from-rose-500/20 to-rose-500/5 text-rose-400",
    yellow: "from-yellow-500/20 to-yellow-500/5 text-yellow-400",
    fuchsia: "from-fuchsia-500/20 to-fuchsia-500/5 text-fuchsia-400",
    cyan: "from-cyan-500/20 to-cyan-500/5 text-cyan-400",
    orange: "from-orange-500/20 to-orange-500/5 text-orange-400",
    teal: "from-teal-500/20 to-teal-500/5 text-teal-400",
    purple: "from-purple-500/20 to-purple-500/5 text-purple-400",
  };

  return (
    <div
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
      <div className="mt-4">
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          Manage
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
