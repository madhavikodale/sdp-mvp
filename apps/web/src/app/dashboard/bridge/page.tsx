import {
  ArrowLeftRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Wallet,
  Activity,
  Zap,
  Globe,
} from "lucide-react";
import { listRoutes, listBridgeTransactions, getBridgeStats } from "./actions";

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; icon: React.ReactNode }> = {
    completed: { color: "bg-emerald-500/10 text-emerald-400", icon: <CheckCircle2 className="w-3 h-3" /> },
    in_progress: { color: "bg-sky-500/10 text-sky-400", icon: <Zap className="w-3 h-3" /> },
    pending: { color: "bg-amber-500/10 text-amber-400", icon: <Clock className="w-3 h-3" /> },
    failed: { color: "bg-red-500/10 text-red-400", icon: <AlertTriangle className="w-3 h-3" /> },
  };
  const c = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.color}`}>
      {c.icon}
      {status.replace("_", " ")}
    </span>
  );
}

export default async function BridgePage() {
  const [routes, transactions, stats] = await Promise.all([
    listRoutes(),
    listBridgeTransactions(),
    getBridgeStats(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Cross-Chain Bridge</h1>
          <p className="text-sm text-slate-400 mt-1">
            Unified bridge orchestration across all supported chains
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium rounded-lg transition-colors">
          <ArrowLeftRight className="w-4 h-4" />
          New Bridge
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Total Volume</p>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.totalVolume.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Active Bridges</p>
            <Activity className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.inProgress + stats.pending}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Total Fees</p>
            <Wallet className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">${stats.totalFees.toFixed(2)}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Avg Time</p>
            <Globe className="w-5 h-5 text-violet-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.avgTime}m</p>
        </div>
      </div>

      {/* Routes */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Bridge Routes</h2>
          <p className="text-sm text-slate-400 mt-0.5">Available routes and providers</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="text-left font-medium px-6 py-3">Route</th>
                <th className="text-left font-medium px-6 py-3">Token</th>
                <th className="text-left font-medium px-6 py-3">Provider</th>
                <th className="text-left font-medium px-6 py-3">Est. Time</th>
                <th className="text-left font-medium px-6 py-3">Fee</th>
                <th className="text-left font-medium px-6 py-3">Slippage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {routes.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300">{r.sourceChain}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-300">{r.targetChain}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white">{r.token}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs">
                      {r.bridgeProvider}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{Math.round(r.estimatedTime / 60)}m</td>
                  <td className="px-6 py-4 text-white">${r.fee}</td>
                  <td className="px-6 py-4 text-slate-300">{r.slippage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Bridge Transactions</h2>
          <p className="text-sm text-slate-400 mt-0.5">Recent cross-chain transfers</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="text-left font-medium px-6 py-3">Status</th>
                <th className="text-left font-medium px-6 py-3">Amount</th>
                <th className="text-left font-medium px-6 py-3">Token</th>
                <th className="text-left font-medium px-6 py-3">Sender</th>
                <th className="text-left font-medium px-6 py-3">Recipient</th>
                <th className="text-left font-medium px-6 py-3">Fee</th>
                <th className="text-left font-medium px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="px-6 py-4 text-white">{tx.amount}</td>
                  <td className="px-6 py-4 text-slate-300">{tx.token}</td>
                  <td className="px-6 py-4 text-slate-300 font-mono text-xs">{tx.sender.slice(0, 10)}...</td>
                  <td className="px-6 py-4 text-slate-300 font-mono text-xs">{tx.recipient.slice(0, 10)}...</td>
                  <td className="px-6 py-4 text-white">${tx.fee}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {tx.completedAt
                      ? `${Math.round((new Date(tx.completedAt).getTime() - new Date(tx.startedAt).getTime()) / 60000)}m`
                      : "In progress"}
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
