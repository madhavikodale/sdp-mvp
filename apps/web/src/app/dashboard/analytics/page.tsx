"use client";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  DollarSign,
  Zap,
  Server,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  getUsageSummary,
  getChainUsage,
  getMethodUsage,
  getRequestTimeSeries,
  getLatencyTimeSeries,
  getApiKeyUsage,
  getRegionUsage,
  getSparklineData,
} from "./actions";
import { PageShell } from "@/components/page-shell";
import { StatusPulse } from "@/components/status-pulse";
import { AnalyticsStatCard } from "@/components/analytics-stat-card";
import { TimeRangeToggle } from "@/components/time-range-toggle";
import { EnhancedBarChart } from "@/components/enhanced-bar-chart";
import { EnhancedLineChart } from "@/components/enhanced-line-chart";
import { HealthRing, HealthBadge } from "@/components/health-ring";
import { RegionCard } from "@/components/region-card";
import { AnimatedCounter } from "@/components/animated-counter";
import type { TimeRange } from "./actions";
import type { ChainUsage, MethodUsage, ApiKeyUsage, RegionUsage } from "@sdp-mvp/types";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const [mounted, setMounted] = useState(false);

  // Data states
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof getUsageSummary>> | null>(null);
  const [chainUsage, setChainUsage] = useState<ChainUsage[]>([]);
  const [methodUsage, setMethodUsage] = useState<MethodUsage[]>([]);
  const [requestSeries, setRequestSeries] = useState<Awaited<ReturnType<typeof getRequestTimeSeries>> | null>(null);
  const [latencySeries, setLatencySeries] = useState<Awaited<ReturnType<typeof getLatencyTimeSeries>> | null>(null);
  const [keyUsage, setKeyUsage] = useState<ApiKeyUsage[]>([]);
  const [regionUsage, setRegionUsage] = useState<RegionUsage[]>([]);
  const [sparklines, setSparklines] = useState<Record<string, { label: string; value: number }[]>>({});

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  useEffect(() => {
    loadChartData();
  }, [timeRange]);

  async function loadData() {
    const [s, c, m, k, r] = await Promise.all([
      getUsageSummary(),
      getChainUsage(),
      getMethodUsage(),
      getApiKeyUsage(),
      getRegionUsage(),
    ]);
    setSummary(s);
    setChainUsage(c);
    setMethodUsage(m);
    setKeyUsage(k);
    setRegionUsage(r);

    // Load sparklines
    const [reqSpark, latSpark, errSpark, costSpark] = await Promise.all([
      getSparklineData("requests"),
      getSparklineData("latency"),
      getSparklineData("errors"),
      getSparklineData("cost"),
    ]);
    setSparklines({
      requests: reqSpark,
      latency: latSpark,
      errors: errSpark,
      cost: costSpark,
    });

    await loadChartData();
  }

  async function loadChartData() {
    const [req, lat] = await Promise.all([
      getRequestTimeSeries(timeRange),
      getLatencyTimeSeries(timeRange),
    ]);
    setRequestSeries(req);
    setLatencySeries(lat);
  }

  if (!summary || !requestSeries || !latencySeries) {
    return (
      <PageShell title="Analytics" description="Real-time usage metrics and performance monitoring">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-white/[0.03]" />
          ))}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Analytics"
      description="Real-time usage metrics and performance monitoring"
      status="online"
      statusLabel="Live"
    >
      {/* Stats Row */}
      <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <AnalyticsStatCard
          label="Total Requests"
          value={summary.totalRequests}
          icon={<Activity className="h-5 w-5" />}
          accent="blue"
          change={summary.totalRequestsChange}
          sparklineData={sparklines.requests}
        />
        <AnalyticsStatCard
          label="Avg Latency"
          value={summary.avgLatencyMs}
          suffix="ms"
          icon={<Clock className="h-5 w-5" />}
          accent="emerald"
          change={summary.avgLatencyChange}
          inverseChange
          sparklineData={sparklines.latency}
        />
        <AnalyticsStatCard
          label="Error Rate"
          value={summary.errorRate}
          suffix="%"
          decimals={2}
          icon={<Zap className="h-5 w-5" />}
          accent="amber"
          change={summary.errorRateChange}
          inverseChange
          sparklineData={sparklines.errors}
        />
        <AnalyticsStatCard
          label="Est. Cost"
          value={summary.estimatedCost}
          prefix="$"
          decimals={2}
          icon={<DollarSign className="h-5 w-5" />}
          accent="purple"
          change={summary.estimatedCostChange}
          sparklineData={sparklines.cost}
        />
      </div>

      {/* Charts with Time Range */}
      <div className={`transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Performance Trends</h2>
          <TimeRangeToggle value={timeRange} onChange={setTimeRange} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-5 card-lift">
            <div className="mb-4">
              <h3 className="font-medium text-white">Requests by Hour</h3>
              <p className="text-xs text-white/40">
                {timeRange === "24h" ? "Last 24 hours" : timeRange === "7d" ? "Last 7 days" : "Last 30 days"}
              </p>
            </div>
            <EnhancedBarChart data={requestSeries} />
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-5 card-lift">
            <div className="mb-4">
              <h3 className="font-medium text-white">Latency Percentiles</h3>
              <p className="text-xs text-white/40">
                {timeRange === "24h" ? "Last 24 hours" : timeRange === "7d" ? "Last 7 days" : "Last 30 days"}
              </p>
            </div>
            <EnhancedLineChart data={latencySeries} />
          </div>
        </div>
      </div>

      {/* Chain Usage with Health */}
      <div className={`space-y-4 transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Chain Health</h2>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Healthy</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" /> Degraded</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-400" /> Critical</span>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03]">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-white/40">Chain</th>
                <th className="px-4 py-3 text-center font-medium text-white/40">Health</th>
                <th className="px-4 py-3 text-right font-medium text-white/40">Requests</th>
                <th className="px-4 py-3 text-right font-medium text-white/40">Latency</th>
                <th className="px-4 py-3 text-right font-medium text-white/40">Error Rate</th>
                <th className="px-4 py-3 text-right font-medium text-white/40">Cost</th>
                <th className="px-4 py-3 text-left font-medium text-white/40">Distribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {chainUsage.map((chain) => (
                <ChainUsageRow key={chain.chainId} chain={chain} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column: Methods + API Keys */}
      <div className={`grid gap-4 sm:grid-cols-2 transition-all duration-500 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Top Methods</h2>
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.03]">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-white/40">Method</th>
                  <th className="px-4 py-3 text-right font-medium text-white/40">Count</th>
                  <th className="px-4 py-3 text-right font-medium text-white/40">Latency</th>
                  <th className="px-4 py-3 text-right font-medium text-white/40">Errors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {methodUsage.map((method) => (
                  <MethodRow key={method.method} method={method} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">API Key Usage</h2>
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.03]">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-white/40">Key</th>
                  <th className="px-4 py-3 text-right font-medium text-white/40">Requests</th>
                  <th className="px-4 py-3 text-right font-medium text-white/40">Last Used</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {keyUsage.map((key) => (
                  <ApiKeyRow key={key.keyId} apiKey={key} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Regional Performance */}
      <div className={`space-y-4 transition-all duration-500 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h2 className="text-lg font-semibold text-white">Regional Performance</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {regionUsage.map((region, i) => (
            <RegionCard key={region.region} region={region} index={i} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}

function ChainUsageRow({ chain }: { chain: ChainUsage }) {
  const healthScore = Math.max(0, 100 - chain.latencyMs / 3 - chain.errorRate * 100 - chain.cost / 20);

  return (
    <tr className="hover:bg-white/[0.03] transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-xs font-bold text-white/60">
            {chain.chainName.slice(0, 2).toUpperCase()}
          </div>
          <span className="font-medium text-white">{chain.chainName}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <HealthRing score={healthScore} size={36} strokeWidth={3} />
          <HealthBadge score={healthScore} />
        </div>
      </td>
      <td className="px-4 py-3 text-right text-white/70 tabular-nums">
        <AnimatedCounter value={chain.requests} duration={1000} />
      </td>
      <td className="px-4 py-3 text-right text-white/70 tabular-nums">{chain.latencyMs}ms</td>
      <td className="px-4 py-3 text-right">
        <span className={`text-xs ${chain.errorRate > 0.1 ? "text-rose-400" : "text-white/70"}`}>
          {chain.errorRate}%
        </span>
      </td>
      <td className="px-4 py-3 text-right text-white/70 tabular-nums">${chain.cost.toFixed(2)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-sdp-accent rounded-full transition-all duration-1000"
              style={{ width: `${chain.percentageOfTotal}%` }}
            />
          </div>
          <span className="text-xs text-white/40 w-10 tabular-nums">{chain.percentageOfTotal}%</span>
        </div>
      </td>
    </tr>
  );
}

function MethodRow({ method }: { method: MethodUsage }) {
  return (
    <tr className="hover:bg-white/[0.03] transition-colors">
      <td className="px-4 py-3 font-mono text-xs text-white">{method.method}</td>
      <td className="px-4 py-3 text-right text-white/70 tabular-nums">
        <AnimatedCounter value={method.count} duration={1000} />
      </td>
      <td className="px-4 py-3 text-right text-white/70 tabular-nums">{method.avgLatencyMs}ms</td>
      <td className="px-4 py-3 text-right">
        <span className={`text-xs ${method.errorRate > 0.05 ? "text-rose-400" : "text-white/70"}`}>
          {method.errorRate}%
        </span>
      </td>
    </tr>
  );
}

function ApiKeyRow({ apiKey }: { apiKey: ApiKeyUsage }) {
  const timeAgo = apiKey.lastUsedAt
    ? formatTimeAgo(new Date(apiKey.lastUsedAt))
    : "Never";

  return (
    <tr className="hover:bg-white/[0.03] transition-colors">
      <td className="px-4 py-3">
        <div className="font-medium text-white">{apiKey.keyName}</div>
        <div className="text-xs text-white/40">{apiKey.keyPrefix}</div>
      </td>
      <td className="px-4 py-3 text-right text-white/70 tabular-nums">
        <AnimatedCounter value={apiKey.requests} duration={1000} />
      </td>
      <td className="px-4 py-3 text-right text-white/70">{timeAgo}</td>
    </tr>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
