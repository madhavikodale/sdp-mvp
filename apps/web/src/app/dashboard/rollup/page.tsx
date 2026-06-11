import {
  Layers,
  Rocket,
  CheckCircle2,
  Clock,
  FileText,
  Activity,
  Zap,
  Globe,
  ExternalLink,
  Plus,
  Server,
  Database,
} from "lucide-react";
import { listRollups, getRollupStats } from "./actions";

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; icon: React.ReactNode }> = {
    live: { color: "bg-emerald-500/10 text-emerald-400", icon: <CheckCircle2 className="w-3 h-3" /> },
    deploying: { color: "bg-sky-500/10 text-sky-400", icon: <Clock className="w-3 h-3" /> },
    draft: { color: "bg-slate-800 text-slate-400", icon: <FileText className="w-3 h-3" /> },
    stopped: { color: "bg-red-500/10 text-red-400", icon: <Zap className="w-3 h-3" /> },
  };
  const c = config[status] || config.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.color}`}>
      {c.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    optimistic: "Optimistic",
    zk: "ZK Rollup",
    sovereign: "Sovereign",
  };
  const colors: Record<string, string> = {
    optimistic: "bg-violet-500/10 text-violet-400",
    zk: "bg-sky-500/10 text-sky-400",
    sovereign: "bg-amber-500/10 text-amber-400",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${colors[type] || colors.optimistic}`}>
      {labels[type] || type}
    </span>
  );
}

export default async function RollupPage() {
  const [rollups, stats] = await Promise.all([listRollups(), getRollupStats()]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Rollup Deployer</h1>
          <p className="text-sm text-slate-400 mt-1">
            One-click L2/L3 deployment with custom config and DA layers
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Deploy Rollup
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Total Rollups</p>
            <Layers className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.total}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Live</p>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{stats.live}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Total Tx</p>
            <Activity className="w-5 h-5 text-violet-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.totalTransactions.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Total Blocks</p>
            <Database className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.totalBlocks.toLocaleString()}</p>
        </div>
      </div>

      {/* Rollups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rollups.map((r) => (
          <div key={r.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white">{r.name}</h3>
                  <StatusBadge status={r.status} />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <TypeBadge type={r.type} />
                  <span className="text-xs text-slate-500">on {r.parentChain}</span>
                </div>
              </div>
              <div className="p-2 bg-slate-800 rounded-lg">
                <Rocket className="w-5 h-5 text-sky-400" />
              </div>
            </div>

            {r.status !== "draft" && (
              <>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-slate-500">Block Time</p>
                    <p className="text-sm font-medium text-white">{r.config.blockTime}ms</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Gas Limit</p>
                    <p className="text-sm font-medium text-white">{r.config.gasLimit.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">DA Layer</p>
                    <p className="text-sm font-medium text-white capitalize">{r.config.dataAvailability}</p>
                  </div>
                </div>

                {r.status === "live" && (
                  <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-800">
                    <div>
                      <p className="text-xs text-slate-500">TPS</p>
                      <p className="text-sm font-medium text-emerald-400">{r.metrics.tps.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Transactions</p>
                      <p className="text-sm font-medium text-white">{r.metrics.totalTransactions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Blocks</p>
                      <p className="text-sm font-medium text-white">{r.metrics.totalBlocks.toLocaleString()}</p>
                    </div>
                  </div>
                )}

                {r.rpcEndpoint && (
                  <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-4">
                    <a
                      href={r.rpcEndpoint}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300"
                    >
                      <Server className="w-3.5 h-3.5" />
                      RPC Endpoint
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    {r.explorerUrl && (
                      <a
                        href={r.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        Explorer
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </>
            )}

            {r.status === "draft" && (
              <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400">
                  Draft configuration ready. Review and deploy to activate.
                </p>
                <button className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-medium rounded transition-colors">
                  <Rocket className="w-3 h-3" />
                  Deploy Now
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
