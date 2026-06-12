import {
  Rocket,
  Zap,
  Clock,
  TrendingUp,
  Globe,
  CheckCircle2,
  XCircle,
  Activity,
  Radio,
  Gauge,
  ArrowUpRight,
} from "lucide-react";
import { listAccelerationConfigs, listAcceleratedTransactions, listRelayNodes, getAccelerationStats } from "./actions";

function StrategyBadge({ strategy }: { strategy: string }) {
  const config: Record<string, { color: string; label: string }> = {
    priority_fee: { color: "bg-sky-500/10 text-sky-400", label: "Priority Fee" },
    private_tx: { color: "bg-violet-500/10 text-violet-400", label: "Private TX" },
    bundle: { color: "bg-emerald-500/10 text-emerald-400", label: "Bundle" },
    relay: { color: "bg-amber-500/10 text-amber-400", label: "Relay" },
  };
  const c = config[strategy] || config.priority_fee;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${c.color}`}>
      {c.label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; icon: React.ReactNode }> = {
    confirmed: { color: "bg-emerald-500/10 text-emerald-400", icon: <CheckCircle2 className="w-3 h-3" /> },
    accelerating: { color: "bg-sky-500/10 text-sky-400", icon: <Zap className="w-3 h-3" /> },
    queued: { color: "bg-amber-500/10 text-amber-400", icon: <Clock className="w-3 h-3" /> },
    failed: { color: "bg-red-500/10 text-red-400", icon: <XCircle className="w-3 h-3" /> },
  };
  const c = config[status] || config.queued;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.color}`}>
      {c.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default async function AccelerationPage() {
  const [configs, transactions, relays, stats] = await Promise.all([
    listAccelerationConfigs(),
    listAcceleratedTransactions(),
    listRelayNodes(),
    getAccelerationStats(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Chain Acceleration</h1>
          <p className="text-sm text-slate-400 mt-1">
            Transaction pre-confirmation, priority fee boost, and relay network
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <Rocket className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-400">Acceleration Active</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Avg Speedup</p>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.avgSpeedupPercent}%</p>
          <p className="text-xs text-emerald-400 mt-1">Faster confirmation</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Time Saved</p>
            <Clock className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{Math.round(stats.totalTimeSavedMs / 1000)}s</p>
          <p className="text-xs text-slate-500 mt-1">Total across all tx</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Active Relays</p>
            <Radio className="w-5 h-5 text-violet-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.activeRelays}/{stats.totalRelays}</p>
          <p className="text-xs text-slate-500 mt-1">Relay nodes online</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Success Rate</p>
            <Gauge className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {stats.totalTx > 0 ? Math.round((stats.confirmed / stats.totalTx) * 100) : 0}%
          </p>
          <p className="text-xs text-slate-500 mt-1">{stats.confirmed} confirmed</p>
        </div>
      </div>

      {/* Chain Configs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {configs.map((config) => (
          <div key={config.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-500/10 rounded-lg">
                  <Globe className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{config.chainName}</h3>
                  <p className="text-xs text-slate-400">{config.strategies.length} strategies</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-400">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm font-medium">{config.avgSpeedupPercent}%</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-lg bg-slate-950/50 p-3">
                <p className="text-xs text-slate-500">Accelerated</p>
                <p className="text-lg font-bold text-white">{config.totalTxAccelerated.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-slate-950/50 p-3">
                <p className="text-xs text-slate-500">Time Saved</p>
                <p className="text-lg font-bold text-white">{Math.round(config.totalTimeSavedMs / 1000)}s</p>
              </div>
              <div className="rounded-lg bg-slate-950/50 p-3">
                <p className="text-xs text-slate-500">Relays</p>
                <p className="text-lg font-bold text-white">{config.relayNodes}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {config.strategies.map((s) => (
                <StrategyBadge key={s} strategy={s} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Recent Accelerated Transactions</h2>
          <p className="text-sm text-slate-400 mt-0.5">Live transaction acceleration log</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="text-left font-medium px-6 py-3">Status</th>
                <th className="text-left font-medium px-6 py-3">Chain</th>
                <th className="text-left font-medium px-6 py-3">Strategy</th>
                <th className="text-right font-medium px-6 py-3">Priority Fee</th>
                <th className="text-right font-medium px-6 py-3">Original ETA</th>
                <th className="text-right font-medium px-6 py-3">Actual</th>
                <th className="text-right font-medium px-6 py-3">Saved</th>
                <th className="text-left font-medium px-6 py-3">Relay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4"><StatusBadge status={tx.status} /></td>
                  <td className="px-6 py-4 text-slate-300">{tx.chainName}</td>
                  <td className="px-6 py-4"><StrategyBadge strategy={tx.strategy} /></td>
                  <td className="px-6 py-4 text-right text-white">{tx.priorityFeeGwei} gwei</td>
                  <td className="px-6 py-4 text-right text-slate-400">{tx.originalEtaMs}ms</td>
                  <td className="px-6 py-4 text-right text-white">{tx.actualTimeMs > 0 ? `${tx.actualTimeMs}ms` : "—"}</td>
                  <td className="px-6 py-4 text-right text-emerald-400">
                    {tx.timeSavedMs > 0 ? `${tx.timeSavedMs}ms` : "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">{tx.relayNode || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Relay Nodes */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Relay Network</h2>
          <p className="text-sm text-slate-400 mt-0.5">Global relay node status</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="text-left font-medium px-6 py-3">Region</th>
                <th className="text-right font-medium px-6 py-3">Latency</th>
                <th className="text-right font-medium px-6 py-3">Uptime</th>
                <th className="text-right font-medium px-6 py-3">Tx Count</th>
                <th className="text-left font-medium px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {relays.map((relay) => (
                <tr key={relay.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-white">{relay.region}</td>
                  <td className="px-6 py-4 text-right text-white">{relay.latencyMs}ms</td>
                  <td className="px-6 py-4 text-right text-white">{relay.uptime}%</td>
                  <td className="px-6 py-4 text-right text-white">{relay.txCount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      relay.status === "online" ? "bg-emerald-500/10 text-emerald-400" :
                      relay.status === "degraded" ? "bg-amber-500/10 text-amber-400" :
                      "bg-red-500/10 text-red-400"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        relay.status === "online" ? "bg-emerald-400" :
                        relay.status === "degraded" ? "bg-amber-400" :
                        "bg-red-400"
                      }`} />
                      {relay.status.charAt(0).toUpperCase() + relay.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
