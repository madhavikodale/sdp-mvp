"use client";

import { Shield, Zap, TrendingUp, DollarSign, Activity, AlertTriangle, CheckCircle2, XCircle, ToggleLeft, ToggleRight, Clock } from "lucide-react";
import { PageShell, StatCard, Section, TableShell } from "@/components/page-shell";
import { MiniChart } from "@/components/mini-chart";
import { AnimatedCounter } from "@/components/animated-counter";
import { cn } from "@/lib/utils";
import { getMevAdvancedStats, getMempoolMonitor, getRefundHistory, getProtectionConfig } from "./actions";

export default async function MevAdvancedPage() {
  const [stats, mempool, refunds, config] = await Promise.all([
    getMevAdvancedStats(),
    getMempoolMonitor(),
    getRefundHistory(),
    getProtectionConfig(),
  ]);

  return (
    <PageShell
      title="MEV Backrun Protection"
      description="Jito bundle-powered sandwich detection, arbitrage capture, and automatic refunds"
      status="online"
      statusLabel="Protection active"
    >
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Sandwiches Blocked" value={stats.sandwichesBlocked.toLocaleString()} icon={<Shield className="h-5 w-5" />} accent="emerald" />
        <StatCard label="Refunds Earned" value={`$${stats.refundsEarned.toLocaleString()}`} icon={<DollarSign className="h-5 w-5" />} accent="amber" />
        <StatCard label="Bundles Submitted" value={stats.bundlesSubmitted.toLocaleString()} icon={<Zap className="h-5 w-5" />} accent="violet" />
        <StatCard label="Win Rate" value={`${stats.winRate}%`} icon={<TrendingUp className="h-5 w-5" />} accent="indigo" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Mempool Monitor */}
        <Section title="Live Mempool Monitor" action={<span className="text-xs text-emerald-400 flex items-center gap-1"><Activity className="h-3 w-3 animate-pulse" /> Live</span>}>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm overflow-hidden">
            <div className="divide-y divide-white/[0.06]">
              {mempool.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <RiskBadge score={tx.riskScore} />
                    <div>
                      <p className="text-xs font-mono text-white/70">{tx.hash}</p>
                      <p className="text-xs text-white/30">{tx.type} · {tx.timestamp}</p>
                    </div>
                  </div>
                  <span className="text-sm text-white tabular-nums">${tx.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/[0.06] px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-white/30">Auto-protect</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400">Enabled</span>
                <ToggleRight className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
          </div>
        </Section>

        {/* Protection Rules */}
        <Section title="Protection Rules">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Min TX value to protect</span>
              <span className="text-sm font-medium text-white">${config.minTxValue}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Max tip per bundle</span>
              <span className="text-sm font-medium text-white">{config.maxTip} SOL</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Bundle timeout</span>
              <span className="text-sm font-medium text-white">{config.bundleTimeout}ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Tip strategy</span>
              <span className="text-sm font-medium text-white capitalize">{config.tipStrategy}</span>
            </div>
            <div className="pt-3 border-t border-white/[0.06]">
              <p className="text-xs text-white/40 mb-2">Whitelisted programs</p>
              <div className="flex flex-wrap gap-2">
                {config.whitelistedPrograms.map((p, i) => (
                  <span key={i} className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                    {p.slice(0, 6)}...{p.slice(-4)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* Refund History + Chart */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Section title="Refund History" action={<span className="text-xs text-white/30">{refunds.length} records</span>}>
            <TableShell>
              <table className="w-full text-sm">
                <thead className="bg-white/[0.03]">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-white/40">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-white/40">Attack Type</th>
                    <th className="px-4 py-3 text-right font-medium text-white/40">Saved</th>
                    <th className="px-4 py-3 text-left font-medium text-white/40">Refund Tx</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {refunds.map((rf) => (
                    <tr key={rf.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3 text-white/70">{new Date(rf.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <AttackBadge type={rf.attackType} />
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-400 font-medium">${rf.savedAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono text-xs text-sky-400">{rf.refundTx}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableShell>
          </Section>
        </div>
        <div>
          <Section title="30-Day Refunds">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-5">
              <MiniChart data={stats.dailyRefunds.map(d => ({ label: d.label, value: d.value }))} color="#10b981" height={200} />
              <p className="text-xs text-white/30 mt-3 text-center">Daily refund amounts in USD</p>
            </div>
          </Section>
        </div>
      </div>
    </PageShell>
  );
}

function RiskBadge({ score }: { score: number }) {
  const config = score >= 80 ? { label: "Critical", className: "bg-rose-500/10 text-rose-400" } : score >= 60 ? { label: "High", className: "bg-amber-500/10 text-amber-400" } : score >= 40 ? { label: "Medium", className: "bg-yellow-500/10 text-yellow-400" } : { label: "Low", className: "bg-emerald-500/10 text-emerald-400" };
  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium", config.className)}>{config.label}</span>;
}

function AttackBadge({ type }: { type: string }) {
  const config = type === "sandwich" ? { className: "bg-rose-500/10 text-rose-400", icon: <AlertTriangle className="h-3 w-3" /> } : type === "frontrun" ? { className: "bg-amber-500/10 text-amber-400", icon: <Zap className="h-3 w-3" /> } : { className: "bg-blue-500/10 text-blue-400", icon: <Activity className="h-3 w-3" /> };
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", config.className)}>{config.icon} {type}</span>;
}
