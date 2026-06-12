"use client";

import { ArrowRightLeft, Shield, CheckCircle2, XCircle, Clock, Activity, Globe, Lock, Unlock, TrendingUp, Zap, AlertTriangle } from "lucide-react";
import { PageShell, StatCard, Section, TableShell } from "@/components/page-shell";
import { MiniChart } from "@/components/mini-chart";
import { cn } from "@/lib/utils";
import { getAtomicStats, listActiveSwaps, getChainStatus, getSwapHistory } from "./actions";

export default async function AtomicPage() {
  const [stats, swaps, chains, history] = await Promise.all([
    getAtomicStats(),
    listActiveSwaps(),
    getChainStatus(),
    getSwapHistory(),
  ]);

  return (
    <PageShell
      title="Cross-Chain Atomic Swaps"
      description="Atomic cross-chain transactions with insurance escrow and automatic revert on failure"
      status="online"
      statusLabel="Atomic engine active"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Swaps Completed" value={stats.swapsCompleted.toLocaleString()} icon={<ArrowRightLeft className="h-5 w-5" />} accent="indigo" />
        <StatCard label="Escrow Value" value={`$${stats.escrowValue.toLocaleString()}`} icon={<Lock className="h-5 w-5" />} accent="amber" />
        <StatCard label="Success Rate" value={`${stats.successRate}%`} icon={<CheckCircle2 className="h-5 w-5" />} accent="emerald" />
        <StatCard label="Chains Connected" value={stats.chainsConnected} icon={<Globe className="h-5 w-5" />} accent="violet" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="New Atomic Swap">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-white/40 mb-1">From</p>
                <select className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white">
                  <option>Solana</option><option>Ethereum</option><option>Base</option><option>Arbitrum</option>
                </select>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">To</p>
                <select className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white">
                  <option>Ethereum</option><option>Solana</option><option>Base</option><option>Arbitrum</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-white/40 mb-1">Send</p>
                <div className="flex gap-2">
                  <input type="number" placeholder="0.00" className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/20" />
                  <select className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2 py-2 text-sm text-white">
                    <option>SOL</option><option>USDC</option><option>ETH</option>
                  </select>
                </div>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">Receive</p>
                <div className="flex gap-2">
                  <input type="number" placeholder="0.00" className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/20" />
                  <select className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2 py-2 text-sm text-white">
                    <option>ETH</option><option>SOL</option><option>USDC</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white/[0.02] p-3 border border-white/[0.04]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-white/40">Insurance coverage</span>
                <span className="text-xs text-emerald-400">95%</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-white/40">Premium</span>
                <span className="text-xs text-white">0.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40">Max loss</span>
                <span className="text-xs text-white">$125</span>
              </div>
            </div>
            <button className="w-full rounded-lg bg-sdp-accent py-2.5 text-sm font-medium text-white hover:bg-sdp-accent/90 transition-colors">
              Initiate Atomic Swap
            </button>
          </div>
        </Section>

        <Section title="Chain Health">
          <div className="space-y-2">
            {chains.map((chain) => (
              <div key={chain.name} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className={cn("h-2.5 w-2.5 rounded-full", chain.status === "healthy" ? "bg-emerald-400" : "bg-amber-400")} />
                  <div>
                    <p className="text-sm font-medium text-white">{chain.name}</p>
                    <p className="text-xs text-white/30">{chain.latency}ms latency</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40">Bridge</p>
                  <p className="text-sm text-white tabular-nums">${chain.bridgeBalance.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Section title="Active Swaps" action={<span className="text-xs text-white/30">{swaps.length} active</span>}>
            <TableShell>
              <table className="w-full text-sm">
                <thead className="bg-white/[0.03]">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-white/40">Route</th>
                    <th className="px-4 py-3 text-right font-medium text-white/40">Amount</th>
                    <th className="px-4 py-3 text-left font-medium text-white/40">Status</th>
                    <th className="px-4 py-3 text-right font-medium text-white/40">Escrow</th>
                    <th className="px-4 py-3 text-left font-medium text-white/40">Time</th>
                    <th className="px-4 py-3 text-right font-medium text-white/40">Insurance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {swaps.map((swap) => (
                    <tr key={swap.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm text-white">{swap.sourceChain} &rarr; {swap.destChain}</p>
                        <p className="text-xs text-white/30">{swap.sourceToken} &rarr; {swap.destToken}</p>
                      </td>
                      <td className="px-4 py-3 text-right text-white tabular-nums">{swap.amount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                          swap.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400" :
                          swap.status === "locked" ? "bg-amber-500/10 text-amber-400" :
                          swap.status === "pending" ? "bg-sky-500/10 text-sky-400" :
                          "bg-rose-500/10 text-rose-400"
                        )}>
                          {swap.status === "confirmed" ? <CheckCircle2 className="h-3 w-3" /> :
                           swap.status === "failed" ? <XCircle className="h-3 w-3" /> :
                           <Clock className="h-3 w-3" />}
                          {swap.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-white/50">{swap.escrow > 0 ? `${swap.escrow} ${swap.sourceToken}` : "—"}</td>
                      <td className="px-4 py-3 text-white/30 text-xs">{swap.timeRemaining}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={cn("text-xs", swap.insurance > 0 ? "text-emerald-400" : "text-white/20")}>
                          {swap.insurance > 0 ? `${swap.insurance}%` : "—"}
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
          <Section title="30-Day Volume">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-5">
              <MiniChart data={stats.dailySwaps.map((d: any) => ({ label: d.label, value: d.value }))} color="#6366f1" height={200} />
              <p className="text-xs text-white/30 mt-3 text-center">Daily atomic swap count</p>
            </div>
          </Section>
        </div>
      </div>

      <Section title="Swap History" action={<span className="text-xs text-white/30">{history.length} completed</span>}>
        <TableShell>
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03]">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-white/40">Route</th>
                <th className="px-4 py-3 text-right font-medium text-white/40">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-white/40">Source Tx</th>
                <th className="px-4 py-3 text-left font-medium text-white/40">Dest Tx</th>
                <th className="px-4 py-3 text-right font-medium text-white/40">Gas</th>
                <th className="px-4 py-3 text-right font-medium text-white/40">Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3 text-sm text-white">{h.route}</td>
                  <td className="px-4 py-3 text-right text-white tabular-nums">{h.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-xs text-sky-400">{h.sourceTx}</td>
                  <td className="px-4 py-3 font-mono text-xs text-sky-400">{h.destTx}</td>
                  <td className="px-4 py-3 text-right text-white/50">{h.gasCost} SOL</td>
                  <td className="px-4 py-3 text-right text-white/30 text-xs">{new Date(h.completedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      </Section>
    </PageShell>
  );
}
