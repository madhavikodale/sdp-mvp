import {
  Gauge,
  TrendingDown,
  TrendingUp,
  Zap,
  Clock,
  Activity,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { listGasPredictions, getGasStats } from "./actions";

function ActionBadge({ action }: { action: string }) {
  const config: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    execute_now: { color: "bg-emerald-500/10 text-emerald-400", icon: <Zap className="w-3 h-3" />, label: "Execute Now" },
    wait: { color: "bg-amber-500/10 text-amber-400", icon: <Clock className="w-3 h-3" />, label: "Wait" },
    speed_up: { color: "bg-sky-500/10 text-sky-400", icon: <TrendingUp className="w-3 h-3" />, label: "Speed Up" },
  };
  const c = config[action] || config.wait;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.color}`}>
      {c.icon}
      {c.label}
    </span>
  );
}

function MiniChart({ data }: { data: { timestamp: string; price: number }[] }) {
  const max = Math.max(...data.map((d) => d.price));
  const min = Math.min(...data.map((d) => d.price));
  const range = max - min || 1;

  return (
    <div className="flex items-end gap-1 h-10">
      {data.map((d, i) => {
        const h = ((d.price - min) / range) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <div
              className="w-full bg-sky-500/60 rounded-sm"
              style={{ height: `${Math.max(h, 10)}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default async function GasPage() {
  const [predictions, stats] = await Promise.all([
    listGasPredictions(),
    getGasStats(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Predictive Gas</h1>
          <p className="text-sm text-slate-400 mt-1">
            AI-powered gas price forecasting — save up to {stats.totalSavings}% on transactions
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Avg Confidence</p>
            <Gauge className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.avgConfidence}%</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Est. Savings</p>
            <TrendingDown className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{stats.totalSavings}%</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Chains</p>
            <Activity className="w-5 h-5 text-violet-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.chainsMonitored}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Wait Recs</p>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.waitRecommendations}</p>
        </div>
      </div>

      {/* Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {predictions.map((p) => (
          <div key={p.chainId} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white capitalize">
                  {p.chainId.replace("_mainnet", "")}
                </h3>
                <p className="text-xs text-slate-500">{p.chainId}</p>
              </div>
              <ActionBadge action={p.recommendedAction} />
            </div>

            <MiniChart data={p.historicalData} />

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-xs text-slate-500">Current</p>
                <p className="text-sm font-medium text-white">{p.currentGasPrice}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Predicted</p>
                <p className={`text-sm font-medium ${p.predictedGasPrice < p.currentGasPrice ? "text-emerald-400" : "text-red-400"}`}>
                  {p.predictedGasPrice}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Confidence</p>
                <p className="text-sm font-medium text-white">{Math.round(p.confidence * 100)}%</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Est. savings</p>
                <p className="text-sm font-medium text-emerald-400">{p.estimatedSavings}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Time to optimal</p>
                <p className="text-sm font-medium text-white">{p.timeToOptimal}m</p>
              </div>
              <div className="flex items-center gap-1 text-xs">
                {p.recommendedAction === "execute_now" ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Good time</span>
                  </>
                ) : p.recommendedAction === "wait" ? (
                  <>
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-400">Wait {p.timeToOptimal}m</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-sky-400">Speed up</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
