import {
  Zap,
  TrendingUp,
  Wallet,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Pause,
  Play,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { listPaymasters, listTransactions, getPaymasterStats } from "./actions";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    paused: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    depleted: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  const icons: Record<string, React.ReactNode> = {
    active: <Play className="w-3 h-3" />,
    paused: <Pause className="w-3 h-3" />,
    depleted: <AlertTriangle className="w-3 h-3" />,
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
        styles[status] || styles.paused
      }`}
    >
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function TxStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    success: "bg-emerald-500/10 text-emerald-400",
    pending: "bg-amber-500/10 text-amber-400",
    failed: "bg-red-500/10 text-red-400",
  };
  const icons: Record<string, React.ReactNode> = {
    success: <CheckCircle2 className="w-3 h-3" />,
    pending: <Clock className="w-3 h-3" />,
    failed: <XCircle className="w-3 h-3" />,
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
        styles[status] || styles.pending
      }`}
    >
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default async function GaslessPage() {
  const [paymasters, transactions, stats] = await Promise.all([
    listPaymasters(),
    listTransactions(),
    getPaymasterStats(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gasless Transactions</h1>
          <p className="text-sm text-slate-400 mt-1">
            Paymaster sponsorship — let your users transact without holding gas tokens
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium rounded-lg transition-colors">
          <Zap className="w-4 h-4" />
          New Paymaster
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Active Paymasters</p>
            <Zap className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {stats.activePaymasters}
            <span className="text-sm font-normal text-slate-500">
              {" "}
              / {stats.totalPaymasters}
            </span>
          </p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Budget Utilization</p>
            <Wallet className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.utilizationRate}%</p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all"
              style={{ width: `${Math.min(stats.utilizationRate, 100)}%` }}
            />
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Total Sponsored Tx</p>
            <Activity className="w-5 h-5 text-violet-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.totalTransactions}</p>
          <div className="flex items-center gap-1 mt-1">
            {stats.successRate >= 90 ? (
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
            )}
            <span className={`text-xs ${stats.successRate >= 90 ? "text-emerald-400" : "text-red-400"}`}>
              {stats.successRate}% success
            </span>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Gas Sponsored</p>
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {stats.totalGasSponsored.toFixed(4)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Across all chains</p>
        </div>
      </div>

      {/* Paymasters Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Paymaster Configurations</h2>
          <p className="text-sm text-slate-400 mt-0.5">Sponsorship budgets and contract allowlists</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="text-left font-medium px-6 py-3">Name</th>
                <th className="text-left font-medium px-6 py-3">Chain</th>
                <th className="text-left font-medium px-6 py-3">Type</th>
                <th className="text-left font-medium px-6 py-3">Budget</th>
                <th className="text-left font-medium px-6 py-3">Limits</th>
                <th className="text-left font-medium px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {paymasters.map((pm) => (
                <tr key={pm.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{pm.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{pm.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs">
                      {pm.chainName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-slate-300">{pm.sponsorshipType}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-white">
                        {pm.budget.used.toLocaleString()} / {pm.budget.total.toLocaleString()} {pm.budget.currency}
                      </p>
                      <div className="w-24 bg-slate-800 rounded-full h-1">
                        <div
                          className="bg-sky-500 h-1 rounded-full"
                          style={{ width: `${Math.min((pm.budget.used / pm.budget.total) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-0.5 text-xs text-slate-400">
                      <p>Max/tx: {pm.limits.maxPerTransaction}</p>
                      <p>Max/user: {pm.limits.maxPerUser}</p>
                      <p>Max/day: {pm.limits.maxPerDay}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={pm.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Recent Sponsored Transactions</h2>
          <p className="text-sm text-slate-400 mt-0.5">Latest gasless transactions across all paymasters</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="text-left font-medium px-6 py-3">Status</th>
                <th className="text-left font-medium px-6 py-3">User</th>
                <th className="text-left font-medium px-6 py-3">Contract</th>
                <th className="text-left font-medium px-6 py-3">Method</th>
                <th className="text-left font-medium px-6 py-3">Gas Cost</th>
                <th className="text-left font-medium px-6 py-3">Tx Hash</th>
                <th className="text-left font-medium px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <TxStatusBadge status={tx.status} />
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-300 font-mono text-xs">{tx.userAddress.slice(0, 8)}...{tx.userAddress.slice(-4)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-300 font-mono text-xs">{tx.targetContract.slice(0, 8)}...{tx.targetContract.slice(-4)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs">
                      {tx.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white">{tx.gasCost}</td>
                  <td className="px-6 py-4">
                    {tx.txHash ? (
                      <span className="text-sky-400 font-mono text-xs">{tx.txHash}</span>
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {new Date(tx.sponsoredAt).toLocaleTimeString()}
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
