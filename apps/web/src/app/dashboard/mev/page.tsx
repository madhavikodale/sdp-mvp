import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Activity,
  Clock,
  Zap,
  Lock,
  Eye,
  Radio,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { getMevStatus, listMevThreats, getMevShieldConfig } from "./actions";

function SeverityBadge({ severity }: { severity: string }) {
  const config: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    critical: { color: "bg-rose-500/10 text-rose-400 border-rose-500/20", icon: <ShieldX className="w-3 h-3" />, label: "Critical" },
    high: { color: "bg-red-500/10 text-red-400 border-red-500/20", icon: <ShieldAlert className="w-3 h-3" />, label: "High" },
    medium: { color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: <AlertTriangle className="w-3 h-3" />, label: "Medium" },
    low: { color: "bg-sky-500/10 text-sky-400 border-sky-500/20", icon: <Eye className="w-3 h-3" />, label: "Low" },
  };
  const c = config[severity] || config.low;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${c.color}`}>
      {c.icon}
      {c.label}
    </span>
  );
}

function ThreatTypeBadge({ type }: { type: string }) {
  const config: Record<string, string> = {
    sandwich: "bg-violet-500/10 text-violet-400",
    frontrun: "bg-pink-500/10 text-pink-400",
    backrun: "bg-cyan-500/10 text-cyan-400",
    liquidation: "bg-orange-500/10 text-orange-400",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium capitalize ${config[type] || "bg-slate-800 text-slate-300"}`}>
      {type}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; icon: React.ReactNode }> = {
    blocked: { color: "bg-emerald-500/10 text-emerald-400", icon: <CheckCircle2 className="w-3 h-3" /> },
    mitigated: { color: "bg-sky-500/10 text-sky-400", icon: <ShieldCheck className="w-3 h-3" /> },
    detected: { color: "bg-amber-500/10 text-amber-400", icon: <AlertTriangle className="w-3 h-3" /> },
  };
  const c = config[status] || config.detected;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.color}`}>
      {c.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default async function MevPage() {
  const [status, threats, shield] = await Promise.all([
    getMevStatus(),
    listMevThreats(),
    getMevShieldConfig(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">MEV Protection</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time sandwich attack detection and private mempool shielding
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-400">Shield Active</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Value Protected</p>
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">${status.totalValueProtected.toLocaleString()}</p>
          <p className="text-xs text-emerald-400 mt-1">All-time protection</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Threats Blocked</p>
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{status.totalThreatsBlocked}</p>
          <p className="text-xs text-slate-500 mt-1">{status.totalThreatsMitigated} mitigated</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Active Chains</p>
            <Radio className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{status.activeChains}</p>
          <p className="text-xs text-slate-500 mt-1">Monitoring</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Response Time</p>
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{status.avgResponseTimeMs}ms</p>
          <p className="text-xs text-slate-500 mt-1">Avg detection</p>
        </div>
      </div>

      {/* Shield Config */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Lock className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Shield Configuration</h2>
              <p className="text-xs text-slate-400">Active protection settings</p>
            </div>
          </div>
          <div className="space-y-3">
            <ConfigRow label="Protection Mode" value={shield.mode} active />
            <ConfigRow label="Private Mempool" value={shield.privateMempool ? "Enabled" : "Disabled"} active={shield.privateMempool} />
            <ConfigRow label="Flashbots Relay" value={shield.flashbotsRelay ? "Connected" : "Disconnected"} active={shield.flashbotsRelay} />
            <ConfigRow label="Eden Relay" value={shield.edenRelay ? "Connected" : "Disconnected"} active={shield.edenRelay} />
            <ConfigRow label="Priority Fee Boost" value={`+${shield.priorityFeeBoost}%`} active />
            <ConfigRow label="Slippage Tolerance" value={`${shield.slippageTolerance}%`} active />
            <ConfigRow label="Max Priority Fee" value={`${shield.maxPriorityFee} gwei`} active />
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-violet-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Protected Chains</h2>
              <p className="text-xs text-slate-400">Active monitoring coverage</p>
            </div>
          </div>
          <div className="space-y-3">
            {shield.protectedChains.map((chain) => (
              <div key={chain} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-sm text-white capitalize">{chain.replace("_mainnet", "")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-400">Protected</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Threats Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Recent Threats</h2>
          <p className="text-sm text-slate-400 mt-0.5">Detected and blocked MEV attacks</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="text-left font-medium px-6 py-3">Type</th>
                <th className="text-left font-medium px-6 py-3">Severity</th>
                <th className="text-left font-medium px-6 py-3">Chain</th>
                <th className="text-left font-medium px-6 py-3">Attacker</th>
                <th className="text-left font-medium px-6 py-3">Token</th>
                <th className="text-right font-medium px-6 py-3">Est. Loss</th>
                <th className="text-left font-medium px-6 py-3">Status</th>
                <th className="text-right font-medium px-6 py-3">Block</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {threats.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <ThreatTypeBadge type={t.type} />
                  </td>
                  <td className="px-6 py-4">
                    <SeverityBadge severity={t.severity} />
                  </td>
                  <td className="px-6 py-4 text-slate-300">{t.chainName}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-slate-400">{t.attackerAddress}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs">
                      {t.token}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-white font-medium">${t.estimatedLoss.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-6 py-4 text-right text-slate-400 font-mono text-xs">{t.blockNumber.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ConfigRow({ label, value, active }: { label: string; value: string; active?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
      <span className="text-sm text-slate-400">{label}</span>
      <div className="flex items-center gap-2">
        {active !== undefined && (
          <div className={`h-2 w-2 rounded-full ${active ? "bg-emerald-400" : "bg-slate-600"}`} />
        )}
        <span className={`text-sm font-medium ${active ? "text-white" : "text-slate-500"}`}>{value}</span>
      </div>
    </div>
  );
}
