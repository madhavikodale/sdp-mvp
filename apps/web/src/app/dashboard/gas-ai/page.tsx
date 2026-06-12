"use client";

import { TrendingUp, TrendingDown, Brain, Zap, Gauge, Target, DollarSign, Activity, AlertTriangle, CheckCircle2, XCircle, Clock } from "lucide-react";
import { PageShell, StatCard, Section, TableShell } from "@/components/page-shell";
import { MiniChart } from "@/components/mini-chart";
import { AnimatedCounter } from "@/components/animated-counter";
import { cn } from "@/lib/utils";
import { getGasAiStats, getPredictions, getSavingsReport } from "./actions";

export default async function GasAiPage() {
  const [stats, predictions, savings] = await Promise.all([
    getGasAiStats(),
    getPredictions(),
    getSavingsReport(),
  ]);

  return (
    <PageShell
      title="AI Gas Prediction"
      description="Transformer-powered fee market forecasting with automatic priority fee bidding"
      status="online"
      statusLabel="Model active"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Avg Savings" value={`${stats.avgSavings}%`} icon={<TrendingDown className="h-5 w-5" />} accent="emerald" />
        <StatCard label="Prediction Accuracy" value={`${stats.accuracy}%`} icon={<Target className="h-5 w-5" />} accent="indigo" />
        <StatCard label="Auto-Bids Placed" value={stats.autoBids.toLocaleString()} icon={<Zap className="h-5 w-5" />} accent="violet" />
        <StatCard label="Est. Annual Savings" value={`$${stats.annualSavings.toLocaleString()}`} icon={<DollarSign className="h-5 w-5" />} accent="amber" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Section title="Live Fee Market Prediction" action={<span className="text-xs text-emerald-400 flex items-center gap-1"><Activity className="h-3 w-3 animate-pulse" /> Live</span>}>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-white">Next 10 blocks</p>
                  <p className="text-xs text-white/30">Predicted vs actual priority fees (micro-lamports)</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-sdp-accent" />
                    <span className="text-xs text-white/40">Predicted</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-white/40">Actual</span>
                  </div>
                </div>
              </div>
              <MiniChart data={predictions.map((p) => ({ label: `Block ${p.block}`, value: p.predicted }))} color="#6366f1" height={180} />
            </div>
          </Section>
        </div>
        <div>
          <Section title="Model Config">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60">Model type</span>
                <span className="text-sm font-medium text-white">Transformer</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60">Confidence threshold</span>
                <span className="text-sm font-medium text-white">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60">Update frequency</span>
                <span className="text-sm font-medium text-white">Every block</span>
              </div>
              <div className="pt-3 border-t border-white/[0.06]">
                <p className="text-xs text-white/40 mb-2">Auto-bid settings</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/40">Target percentile</span>
                    <span className="text-xs text-white">85th</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/40">Max fee</span>
                    <span className="text-xs text-white">0.005 SOL</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/40">Min savings</span>
                    <span className="text-xs text-white">5%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 px-3 py-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <p className="text-xs text-emerald-400">Auto-bidding enabled on Solana, Base</p>
              </div>
            </div>
          </Section>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Section title="Recent Predictions" action={<span className="text-xs text-white/30">{predictions.length} blocks</span>}>
            <TableShell>
              <table className="w-full text-sm">
                <thead className="bg-white/[0.03]">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-white/40">Block</th>
                    <th className="px-4 py-3 text-right font-medium text-white/40">Predicted</th>
                    <th className="px-4 py-3 text-right font-medium text-white/40">Actual</th>
                    <th className="px-4 py-3 text-right font-medium text-white/40">Error</th>
                    <th className="px-4 py-3 text-left font-medium text-white/40">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {predictions.map((p) => (
                    <tr key={p.block} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3 text-white/70">{p.block}</td>
                      <td className="px-4 py-3 text-right text-white tabular-nums">{p.predicted.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-white tabular-nums">{p.actual.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={cn("text-xs", Math.abs(p.error) < 5 ? "text-emerald-400" : Math.abs(p.error) < 15 ? "text-amber-400" : "text-rose-400")}>
                          {p.error > 0 ? "+" : ""}{p.error}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                          p.action === "bid" ? "bg-emerald-500/10 text-emerald-400" :
                          p.action === "wait" ? "bg-amber-500/10 text-amber-400" :
                          "bg-white/[0.03] text-white/30"
                        )}>
                          {p.action === "bid" ? <Zap className="h-3 w-3" /> : p.action === "wait" ? <Clock className="h-3 w-3" /> : <Activity className="h-3 w-3" />}
                          {p.action}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableShell>
          </Section>
        </div>
        <div>
          <Section title="Savings Report">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-5">
              <MiniChart data={savings.daily.map((d) => ({ label: d.label, value: d.saved }))} color="#10b981" height={160} />
              <p className="text-xs text-white/30 mt-3 text-center">Daily gas savings (USD)</p>
              <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/40">Today</span>
                  <span className="text-sm text-emerald-400 font-medium">${savings.today.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/40">This week</span>
                  <span className="text-sm text-white">${savings.thisWeek.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/40">This month</span>
                  <span className="text-sm text-white">${savings.thisMonth.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/40">Cumulative</span>
                  <span className="text-sm text-white font-medium">${savings.cumulative.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm p-4 flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-400">Fee market spike predicted</p>
          <p className="text-xs text-amber-400/60">Priority fees expected to rise 3x in next 3 blocks. Non-urgent transactions paused.</p>
        </div>
        <button className="ml-auto text-xs text-amber-400 hover:text-amber-300 transition-colors">Override</button>
      </div>
    </PageShell>
  );
}
