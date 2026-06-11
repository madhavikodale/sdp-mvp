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
} from "lucide-react";
import { QuickActionCard } from "@/components/quick-action-card";

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
