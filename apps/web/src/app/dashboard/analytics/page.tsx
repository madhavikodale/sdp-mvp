import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  DollarSign,
  Globe,
  KeyRound,
  Layers,
  Zap,
} from "lucide-react";
import {
  getUsageSummary,
  getChainUsage,
  getMethodUsage,
  getRequestTimeSeries,
  getLatencyTimeSeries,
  getApiKeyUsage,
  getRegionUsage,
} from "./actions";
import type { ChainUsage, MethodUsage, ApiKeyUsage, RegionUsage } from "@sdp-mvp/types";

export const metadata = {
  title: "Analytics",
  description: "Real-time usage analytics and monitoring",
};

export default async function AnalyticsPage() {
  const [summary, chainUsage, methodUsage, requestSeries, latencySeries, keyUsage, regionUsage] =
    await Promise.all([
      getUsageSummary(),
      getChainUsage(),
      getMethodUsage(),
      getRequestTimeSeries(),
      getLatencyTimeSeries(),
      getApiKeyUsage(),
      getRegionUsage(),
    ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-sdp-text-high">Analytics</h1>
          <p className="mt-1 text-sdp-text-medium">
            Real-time usage metrics and performance monitoring.
          </p>
        </div>
        <Button variant="secondary" size="sm">
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Total Requests"
          value={summary.totalRequests.toLocaleString()}
          change={summary.totalRequestsChange}
          icon={<Activity className="h-5 w-5" />}
          color="text-blue-400"
          gradient="from-blue-500/20 to-blue-500/5"
        />
        <SummaryCard
          label="Avg Latency"
          value={`${summary.avgLatencyMs}ms`}
          change={summary.avgLatencyChange}
          icon={<Clock className="h-5 w-5" />}
          color="text-emerald-400"
          gradient="from-emerald-500/20 to-emerald-500/5"
          isInverse
        />
        <SummaryCard
          label="Error Rate"
          value={`${summary.errorRate}%`}
          change={summary.errorRateChange}
          icon={<Zap className="h-5 w-5" />}
          color="text-amber-400"
          gradient="from-amber-500/20 to-amber-500/5"
          isInverse
        />
        <SummaryCard
          label="Est. Cost"
          value={`$${summary.estimatedCost.toFixed(2)}`}
          change={summary.estimatedCostChange}
          icon={<DollarSign className="h-5 w-5" />}
          color="text-purple-400"
          gradient="from-purple-500/20 to-purple-500/5"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Requests by Hour" subtitle="Last 24 hours">
          <BarChart data={requestSeries} />
        </ChartCard>
        <ChartCard title="Latency Percentiles" subtitle="Last 24 hours">
          <LineChart data={latencySeries} />
        </ChartCard>
      </div>

      {/* Chain Usage */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <h2 className="font-medium text-sdp-text-high">Chain Usage</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-sdp-bg text-sdp-text-medium">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Chain</th>
              <th className="px-4 py-3 text-right font-medium">Requests</th>
              <th className="px-4 py-3 text-right font-medium">Latency</th>
              <th className="px-4 py-3 text-right font-medium">Error Rate</th>
              <th className="px-4 py-3 text-right font-medium">Cost</th>
              <th className="px-4 py-3 text-left font-medium">Distribution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sdp-border">
            {chainUsage.map((chain) => (
              <ChainUsageRow key={chain.chainId} chain={chain} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Method Usage */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="font-medium text-sdp-text-high">Top Methods</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-sdp-bg text-sdp-text-medium">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Method</th>
                <th className="px-4 py-3 text-right font-medium">Count</th>
                <th className="px-4 py-3 text-right font-medium">Latency</th>
                <th className="px-4 py-3 text-right font-medium">Errors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sdp-border">
              {methodUsage.map((method) => (
                <MethodRow key={method.method} method={method} />
              ))}
            </tbody>
          </table>
        </div>

        {/* API Key Usage */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="font-medium text-sdp-text-high">API Key Usage</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-sdp-bg text-sdp-text-medium">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Key</th>
                <th className="px-4 py-3 text-right font-medium">Requests</th>
                <th className="px-4 py-3 text-right font-medium">Last Used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sdp-border">
              {keyUsage.map((key) => (
                <ApiKeyRow key={key.keyId} apiKey={key} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Region Usage */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <h2 className="font-medium text-sdp-text-high">Regional Performance</h2>
        </div>
        <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-5">
          {regionUsage.map((region) => (
            <RegionCard key={region.region} region={region} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  change,
  icon,
  color,
  gradient,
  isInverse,
}: {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
  gradient?: string;
  isInverse?: boolean;
}) {
  const isPositive = isInverse ? change < 0 : change > 0;
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <div className={`rounded-xl border border-white/10 bg-gradient-to-br ${gradient || 'from-white/10 to-white/5'} backdrop-blur-md p-5`}>
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 ${color}`}>
          {icon}
        </div>
        <span
          className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${
            isPositive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
          }`}
        >
          <Icon className="h-3 w-3" />
          {Math.abs(change)}%
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold text-sdp-text-high">{value}</p>
      <p className="text-sm text-sdp-text-medium">{label}</p>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-5">
      <div className="mb-4">
        <h3 className="font-medium text-sdp-text-high">{title}</h3>
        <p className="text-xs text-sdp-text-low">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function BarChart({ data }: { data: { labels: string[]; datasets: { label: string; data: number[]; color?: string }[] } }) {
  const maxValue = Math.max(...data.datasets.flatMap((d) => d.data));

  return (
    <div className="space-y-2">
      {data.labels.slice(-12).map((label, i) => {
        const idx = data.labels.length - 12 + i;
        const total = data.datasets.reduce((sum, d) => sum + d.data[idx], 0);
        return (
          <div key={label} className="flex items-center gap-2">
            <span className="w-8 text-xs text-sdp-text-low">{label}</span>
            <div className="flex-1 h-6 bg-sdp-bg rounded overflow-hidden flex">
              {data.datasets.map((dataset, di) => {
                const value = dataset.data[idx];
                const width = maxValue > 0 ? (value / maxValue) * 100 : 0;
                return (
                  <div
                    key={di}
                    className="h-full transition-all"
                    style={{
                      width: `${width}%`,
                      backgroundColor: dataset.color || "#1c1c1d",
                      opacity: 0.7 + di * 0.1,
                    }}
                    title={`${dataset.label}: ${value.toLocaleString()}`}
                  />
                );
              })}
            </div>
            <span className="w-16 text-xs text-sdp-text-medium text-right">
              {(total / 1000).toFixed(0)}k
            </span>
          </div>
        );
      })}
      <div className="flex gap-3 pt-2">
        {data.datasets.map((d) => (
          <div key={d.label} className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-sdp-text-medium">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineChart({ data }: { data: { labels: string[]; datasets: { label: string; data: number[]; color?: string }[] } }) {
  const maxValue = Math.max(...data.datasets.flatMap((d) => d.data));
  const minValue = Math.min(...data.datasets.flatMap((d) => d.data));
  const range = maxValue - minValue || 1;

  return (
    <div className="space-y-3">
      <svg viewBox="0 0 300 120" className="w-full h-32">
        {data.datasets.map((dataset, di) => {
          const points = dataset.data.map((value, i) => {
            const x = (i / (dataset.data.length - 1)) * 280 + 10;
            const y = 110 - ((value - minValue) / range) * 100;
            return `${x},${y}`;
          });

          return (
            <g key={di}>
              <polyline
                fill="none"
                stroke={dataset.color || "#1c1c1d"}
                strokeWidth="2"
                points={points.join(" ")}
                opacity={0.8}
              />
              {dataset.data.map((value, i) => {
                const x = (i / (dataset.data.length - 1)) * 280 + 10;
                const y = 110 - ((value - minValue) / range) * 100;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="2"
                    fill={dataset.color || "#1c1c1d"}
                    opacity={0.6}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>
      <div className="flex justify-between text-xs text-sdp-text-low">
        <span>{data.labels[0]}</span>
        <span>{data.labels[data.labels.length - 1]}</span>
      </div>
      <div className="flex gap-3">
        {data.datasets.map((d) => (
          <div key={d.label} className="flex items-center gap-1.5">
            <div className="h-0.5 w-4" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-sdp-text-medium">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChainUsageRow({ chain }: { chain: ChainUsage }) {
  return (
    <tr className="hover:bg-sdp-bg/50 transition-colors">
      <td className="px-4 py-3 font-medium text-sdp-text-high">{chain.chainName}</td>
      <td className="px-4 py-3 text-right text-sdp-text-medium">{chain.requests.toLocaleString()}</td>
      <td className="px-4 py-3 text-right text-sdp-text-medium">{chain.latencyMs}ms</td>
      <td className="px-4 py-3 text-right">
        <span className={`text-xs ${chain.errorRate > 0.1 ? "text-red-600" : "text-sdp-text-medium"}`}>
          {chain.errorRate}%
        </span>
      </td>
      <td className="px-4 py-3 text-right text-sdp-text-medium">${chain.cost.toFixed(2)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-sdp-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-sdp-accent rounded-full"
              style={{ width: `${chain.percentageOfTotal}%` }}
            />
          </div>
          <span className="text-xs text-sdp-text-low w-10">{chain.percentageOfTotal}%</span>
        </div>
      </td>
    </tr>
  );
}

function MethodRow({ method }: { method: MethodUsage }) {
  return (
    <tr className="hover:bg-sdp-bg/50 transition-colors">
      <td className="px-4 py-3 font-mono text-xs text-sdp-text-high">{method.method}</td>
      <td className="px-4 py-3 text-right text-sdp-text-medium">{method.count.toLocaleString()}</td>
      <td className="px-4 py-3 text-right text-sdp-text-medium">{method.avgLatencyMs}ms</td>
      <td className="px-4 py-3 text-right">
        <span className={`text-xs ${method.errorRate > 0.05 ? "text-red-600" : "text-sdp-text-medium"}`}>
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
    <tr className="hover:bg-sdp-bg/50 transition-colors">
      <td className="px-4 py-3">
        <div className="font-medium text-sdp-text-high">{apiKey.keyName}</div>
        <div className="text-xs text-sdp-text-low">{apiKey.keyPrefix}</div>
      </td>
      <td className="px-4 py-3 text-right text-sdp-text-medium">{apiKey.requests.toLocaleString()}</td>
      <td className="px-4 py-3 text-right text-sdp-text-medium">{timeAgo}</td>
    </tr>
  );
}

function RegionCard({ region }: { region: RegionUsage }) {
  return (
    <div className="rounded-lg border border-sdp-border bg-sdp-bg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Globe className="h-4 w-4 text-sdp-text-low" />
        <span className="text-sm font-medium text-sdp-text-high">{region.region}</span>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-sdp-text-low">Requests</span>
          <span className="text-sdp-text-high">{(region.requests / 1000).toFixed(0)}k</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sdp-text-low">Latency</span>
          <span className="text-sdp-text-high">{region.latencyMs}ms</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sdp-text-low">Uptime</span>
          <span className="text-green-600">{region.uptime}%</span>
        </div>
      </div>
    </div>
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
