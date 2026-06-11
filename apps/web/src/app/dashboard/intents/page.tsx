import {
  Brain,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
} from "lucide-react";
import { listIntents, getIntentStats } from "./actions";

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; icon: React.ReactNode }> = {
    draft: { color: "bg-slate-800 text-slate-300", icon: <Clock className="w-3 h-3" /> },
    parsed: { color: "bg-sky-500/10 text-sky-400", icon: <Sparkles className="w-3 h-3" /> },
    simulated: { color: "bg-violet-500/10 text-violet-400", icon: <Zap className="w-3 h-3" /> },
    approved: { color: "bg-amber-500/10 text-amber-400", icon: <Shield className="w-3 h-3" /> },
    executed: { color: "bg-emerald-500/10 text-emerald-400", icon: <CheckCircle2 className="w-3 h-3" /> },
    failed: { color: "bg-red-500/10 text-red-400", icon: <XCircle className="w-3 h-3" /> },
  };
  const c = config[status] || config.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.color}`}>
      {c.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default async function IntentsPage() {
  const [intents, stats] = await Promise.all([listIntents(), getIntentStats()]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Intent Execution</h1>
          <p className="text-sm text-slate-400 mt-1">
            Describe what you want in plain English — we parse, simulate, and execute
          </p>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-violet-500/10 rounded-lg">
            <Brain className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Natural Language Intent</h2>
            <p className="text-xs text-slate-400">Examples: "Send 100 USDC to bob.base", "Stake 500 XDC", "Bridge ETH to Solana"</p>
          </div>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="What do you want to do?"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
          />
          <button className="inline-flex items-center gap-2 px-5 py-3 bg-violet-500 hover:bg-violet-400 text-white text-sm font-medium rounded-lg transition-colors">
            <Send className="w-4 h-4" />
            Execute
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-400">Total Intents</p>
          <p className="text-2xl font-bold text-white mt-2">{stats.total}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-400">Executed</p>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{stats.executed}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-400">Simulated</p>
          <p className="text-2xl font-bold text-violet-400 mt-2">{stats.simulated}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-400">Pending</p>
          <p className="text-2xl font-bold text-amber-400 mt-2">{stats.pending}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-400">Success Rate</p>
          <p className="text-2xl font-bold text-white mt-2">{stats.successRate}%</p>
        </div>
      </div>

      {/* Intents List */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Recent Intents</h2>
          <p className="text-sm text-slate-400 mt-0.5">Parsed, simulated, and executed transactions</p>
        </div>
        <div className="divide-y divide-slate-800">
          {intents.map((intent) => (
            <div key={intent.id} className="px-6 py-5 hover:bg-slate-800/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={intent.status} />
                    <span className="text-xs text-slate-500">{intent.id}</span>
                  </div>
                  <p className="text-white mt-2 font-medium">{intent.naturalLanguage}</p>
                  
                  {/* Parsed Intent */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">
                      <ArrowRight className="w-3 h-3" />
                      {intent.parsedIntent.action}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">
                      {intent.parsedIntent.chain}
                    </span>
                    {intent.parsedIntent.token && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">
                        {intent.parsedIntent.amount} {intent.parsedIntent.token}
                      </span>
                    )}
                    {intent.parsedIntent.recipient && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">
                        → {intent.parsedIntent.recipient}
                      </span>
                    )}
                  </div>

                  {/* Simulation Result */}
                  {intent.simulationResult && (
                    <div className={`mt-3 p-3 rounded-lg border ${
                      intent.simulationResult.success
                        ? "bg-emerald-500/5 border-emerald-500/20"
                        : "bg-red-500/5 border-red-500/20"
                    }`}>
                      <div className="flex items-center gap-2">
                        {intent.simulationResult.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`text-sm font-medium ${intent.simulationResult.success ? "text-emerald-400" : "text-red-400"}`}>
                          {intent.simulationResult.success ? "Simulation Passed" : "Simulation Failed"}
                        </span>
                      </div>
                      {intent.simulationResult.gasEstimate > 0 && (
                        <p className="text-xs text-slate-400 mt-1">
                          Gas estimate: {intent.simulationResult.gasEstimate.toLocaleString()}
                        </p>
                      )}
                      {intent.simulationResult.expectedOutput && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          Expected: {intent.simulationResult.expectedOutput}
                        </p>
                      )}
                      {intent.simulationResult.warnings.map((w, i) => (
                        <p key={i} className="text-xs text-amber-400 mt-0.5 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {w}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Tx Hash */}
                  {intent.txHash && (
                    <p className="text-xs text-sky-400 mt-2 font-mono">
                      Tx: {intent.txHash}
                    </p>
                  )}
                </div>
                <div className="text-right ml-4 shrink-0">
                  <p className="text-xs text-slate-500">
                    {new Date(intent.createdAt).toLocaleTimeString()}
                  </p>
                  {intent.executedAt && (
                    <p className="text-xs text-slate-600 mt-0.5">
                      Exec: {new Date(intent.executedAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
