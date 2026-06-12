"use client";

import { useState } from "react";
import { Shield, Search, AlertTriangle, CheckCircle2, XCircle, Lock, Unlock, Activity, ExternalLink, GitBranch, Clock } from "lucide-react";
import { PageShell, StatCard, Section, TableShell } from "@/components/page-shell";
import { AnimatedCounter } from "@/components/animated-counter";
import { cn } from "@/lib/utils";
import { getSecurityStats, scanProgram, listPrograms, getVulnerabilityFeed } from "./actions";

export default async function SecurityPage() {
  const [stats, programs, cves] = await Promise.all([
    getSecurityStats(),
    listPrograms(),
    getVulnerabilityFeed(),
  ]);

  return (
    <PageShell
      title="Program Security Scoring"
      description="On-chain program risk analysis, audit status, and vulnerability monitoring"
      status="online"
      statusLabel="Scanner active"
    >
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Programs Scanned" value={stats.programsScanned.toLocaleString()} icon={<Shield className="h-5 w-5" />} accent="indigo" />
        <StatCard label="High Risk Found" value={stats.highRiskFound} icon={<AlertTriangle className="h-5 w-5" />} accent="rose" />
        <StatCard label="Audits Completed" value={stats.auditsCompleted} icon={<CheckCircle2 className="h-5 w-5" />} accent="emerald" />
        <StatCard label="Avg Risk Score" value={stats.avgRiskScore} icon={<Activity className="h-5 w-5" />} accent="amber" />
      </div>

      {/* Scanner + Risk Report */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Program Scanner">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-5">
            <p className="text-sm text-white/60 mb-3">Enter a Solana program ID to get an instant security report</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Program ID (e.g., JUP6LkbZ...)"
                className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/20 focus:border-sdp-accent/50 focus:outline-none"
              />
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-sdp-accent px-3 py-2 text-sm font-medium text-white hover:bg-sdp-accent/90 transition-colors">
                <Search className="h-4 w-4" />
                Scan
              </button>
            </div>
            <div className="mt-3 rounded-lg bg-white/[0.02] p-3 border border-white/[0.04]">
              <p className="text-xs text-white/30">Example: JUP6LkbZbjS1jKKwapdHNy74zc3sXi4a4rBq3r8r1x1</p>
            </div>
          </div>
        </Section>

        <Section title="Risk Report Preview">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Jupiter Aggregator</p>
                <p className="text-xs text-white/30 font-mono">JUP6L...r1x1</p>
              </div>
              <ScoreRing score={2.1} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/[0.02] p-2.5">
                <p className="text-xs text-white/30">Audit Status</p>
                <p className="text-sm text-emerald-400 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Audited</p>
              </div>
              <div className="rounded-lg bg-white/[0.02] p-2.5">
                <p className="text-xs text-white/30">Last Audit</p>
                <p className="text-sm text-white">Mar 15, 2026</p>
              </div>
              <div className="rounded-lg bg-white/[0.02] p-2.5">
                <p className="text-xs text-white/30">Dependencies</p>
                <p className="text-sm text-white">3 programs</p>
              </div>
              <div className="rounded-lg bg-white/[0.02] p-2.5">
                <p className="text-xs text-white/30">Upgrade Auth</p>
                <p className="text-sm text-emerald-400 flex items-center gap-1"><Lock className="h-3 w-3" /> Multisig</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 px-3 py-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <p className="text-xs text-emerald-400">No known vulnerabilities. CPI risk: Low.</p>
            </div>
          </div>
        </Section>
      </div>

      {/* Program List + Vulnerability Feed */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Program Risk Registry" action={<span className="text-xs text-white/30">{programs.length} programs</span>}>
          <TableShell>
            <table className="w-full text-sm">
              <thead className="bg-white/[0.03]">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-white/40">Program</th>
                  <th className="px-4 py-3 text-left font-medium text-white/40">Risk</th>
                  <th className="px-4 py-3 text-left font-medium text-white/40">Audit</th>
                  <th className="px-4 py-3 text-right font-medium text-white/40">Txs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {programs.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-white">{p.name}</p>
                      <p className="text-xs text-white/30 font-mono">{p.programId.slice(0, 8)}...{p.programId.slice(-4)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <ScoreBadge score={p.riskScore} />
                    </td>
                    <td className="px-4 py-3">
                      <AuditBadge status={p.auditStatus} />
                    </td>
                    <td className="px-4 py-3 text-right text-white/50 tabular-nums">{p.transactions.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableShell>
        </Section>

        <Section title="Vulnerability Feed" action={<span className="text-xs text-white/30">{cves.length} recent</span>}>
          <div className="space-y-3">
            {cves.map((cve) => (
              <div key={cve.id} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <SeverityBadge severity={cve.severity} />
                  <span className="text-xs font-mono text-white/40">{cve.cveId}</span>
                  <span className="text-xs text-white/20">{cve.publishedAt}</span>
                </div>
                <p className="text-sm text-white/70">{cve.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-white/30">Affected:</span>
                  {cve.affectedPrograms.map((ap, i) => (
                    <span key={i} className="text-xs text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">{ap}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </PageShell>
  );
}

function ScoreRing({ score }: { score: number }) {
  const color = score <= 3 ? "#10b981" : score <= 6 ? "#f59e0b" : "#ef4444";
  const size = 56;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circ = radius * 2 * Math.PI;
  const offset = circ - ((10 - score) / 10) * circ;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} className="transition-all duration-1000" />
      </svg>
      <span className="absolute text-xs font-bold" style={{ color }}>{score}</span>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const config = score <= 3 ? { className: "bg-emerald-500/10 text-emerald-400", label: "Low" } : score <= 6 ? { className: "bg-amber-500/10 text-amber-400", label: "Medium" } : { className: "bg-rose-500/10 text-rose-400", label: "High" };
  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", config.className)}>{config.label} · {score}</span>;
}

function AuditBadge({ status }: { status: string }) {
  const config = status === "audited" ? { className: "bg-emerald-500/10 text-emerald-400", icon: <CheckCircle2 className="h-3 w-3" /> } : status === "pending" ? { className: "bg-amber-500/10 text-amber-400", icon: <Clock className="h-3 w-3" /> } : { className: "bg-rose-500/10 text-rose-400", icon: <XCircle className="h-3 w-3" /> };
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", config.className)}>{config.icon} {status}</span>;
}

function SeverityBadge({ severity }: { severity: string }) {
  const config = severity === "critical" ? { className: "bg-rose-500/10 text-rose-400" } : severity === "high" ? { className: "bg-amber-500/10 text-amber-400" } : { className: "bg-sky-500/10 text-sky-400" };
  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase", config.className)}>{severity}</span>;
}
