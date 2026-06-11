import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  DollarSign,
  Globe,
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
import { PageShell, StatCard, Section, TableShell, GridShell } from "@/components/page-shell";
import { StatusPulse } from "@/components/status-pulse";
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
    <PageShell
      title="Analytics"
      description="Real-time usage metrics and performance monitoring"
      status="online"
      statusLabel="Live"
    >
      {/* Stats */}
      <GridShell cols={4}>
        <StatCard
          label="Total Requests"
          value={summary.totalRequests.toLocaleString()}
          icon={<Activity className="h-5 w-5" />}
          accent="blue"
        />
        <StatCard
          label="Avg Latency"
          value={`${summary.avgLatencyMs}ms`}
          icon={<Clock className="h-5 w-5" />}
          accent="emerald"
        />
        <StatCard
          label="Error Rate"
          value={`${summary.errorRate}%`}
          icon={<Zap className="h-5 w-5" />}
          accent="amber"
        />
        <StatCard
          label="Est. Cost"
          value={`$${summary.estimatedCost.toFixed(2)}`}
          icon={<DollarSign className="h-5 w-5" />}
          accent="purple"
        />
      </GridShell>

      {/* Charts */}
      <GridShell cols={2}>
        <ChartCard title="Requests by Hour" subtitle="Last 24 hours">
          <BarChart data={requestSeries} />
        </ChartCard>
        <ChartCard title="Latency Percentiles" subtitle="Last 24 hours">
          <LineChart data={latencySeries} />
        </ChartCard>
      </GridShell>

      {/* Chain Usage */}
      <Section title="Chain Usage">
        <TableShell>
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03]">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-white/40">Chain</th>
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
        </TableShell>
      </Section>

      {/* Two Column */}
      <GridShell cols={2}>
        <Section title="Top Methods">
          <TableShell>
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
          </TableShell>
        </Section>

        <Section title="API Key Usage">
          <TableShell>
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
          </TableShell>
        </Section>
      </GridShell>

      {/* Region Usage */}
      <Section title="Regional Performance">
        <GridShell cols={5}>
          {regionUsage.map((region) => (
            <RegionCard key={region.region} region={region} />
          ))}
        </GridShell>
      </Section>
    </PageShell>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-5 card-lift">
      <div className="mb-4">
        <h3 className="font-medium text-white">{title}</h3>
        <p className="text-xs text-white/40">{subtitle}</p>
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
            <span className="w-8 text-xs text-white/40">{label}</span>
            <div className="flex-1 h-6 bg-white/[0.03] rounded overflow-hidden flex">
              {data.datasets.map((dataset, di) => {
                const value = dataset.data[idx];
                const width = maxValue > 0 ? (value / maxValue) * 100 : 0;
                return (
                  <div
                    key={di}
                    className="h-full transition-all"
                    style={{
                      width: `${width}%`,
                      backgroundColor: dataset.color || "#6366f1",
                      opacity: 0.7 + di * 0.1,
                    }}
                    title={`${dataset.label}: ${value.toLocaleString()}`}
                  />
                );
              })}
            </div>
            <span className="w-16 text-xs text-white/50 text-right">
              {(total / 1000).toFixed(0)}k
            </span>
          </div>
        );
      })}
      <div className="flex gap-3 pt-2">
        {data.datasets.map((d) => (
          <div key={d.label} className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-white/50">{d.label}</span>
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
                stroke={dataset.color || "#6366f1"}
                strokeWidth="2"
                points={points.join(" ")}
                opacity={0.8}
              />
            </g>
          );
        })}
      </svg>
      <div className="flex justify-between text-xs text-white/40">
        <span>{data.labels[0]}</span>
        <span>{data.labels[data.labels.length - 1]}</span>
      </div>
      <div className="flex gap-3">
        {data.datasets.map((d) => (
          <div key={d.label} className="flex items-center gap-1.5">
            <div className="h-0.5 w-4" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-white/50">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChainUsageRow({ chain }: { chain: ChainUsage }) {
  return (
    <tr className="hover:bg-white/[0.03] transition-colors">
      <td className="px-4 py-3 font-medium text-white">{chain.chainName}</td>
      <td className="px-4 py-3 text-right text-white/70">{chain.requests.toLocaleString()}</td>
      <td className="px-4 py-3 text-right text-white/70">{chain.latencyMs}ms</td>
      <td className="px-4 py-3 text-right">
        <span className={`text-xs ${chain.errorRate > 0.1 ? "text-rose-400" : "text-white/70"}`}>
          {chain.errorRate}%
        </span>
      </td>
      <td className="px-4 py-3 text-right text-white/70">${chain.cost.toFixed(2)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-sdp-accent rounded-full"
              style={{ width: `${chain.percentageOfTotal}%` }}
            />
          </div>
          <span className="text-xs text-white/40 w-10">{chain.percentageOfTotal}%</span>
        </div>
      </td>
    </tr>
  );
}

function MethodRow({ method }: { method: MethodUsage }) {
  return (
    <tr className="hover:bg-white/[0.03] transition-colors">
      <td className="px-4 py-3 font-mono text-xs text-white">{method.method}</td>
      <td className="px-4 py-3 text-right text-white/70">{method.count.toLocaleString()}</td>
      <td className="px-4 py-3 text-right text-white/70">{method.avgLatencyMs}ms</td>
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
      <td className="px-4 py-3 text-right text-white/70">{apiKey.requests.toLocaleString()}</td>
      <td className="px-4 py-3 text-right text-white/70">{timeAgo}</td>
    </tr>
  );
}

function RegionCard({ region }: { region: RegionUsage }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-sm card-lift">
      <div className="flex items-center gap-2 mb-2">
        <Globe className="h-4 w-4 text-white/40" />
        <span className="text-sm font-medium text-white">{region.region}</span>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-white/40">Requests</span>
          <span className="text-white">{(region.requests / 1000).toFixed(0)}k</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">Latency</span>
          <span className="text-white">{region.latencyMs}ms</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">Uptime</span>
          <span className="text-emerald-400">{region.uptime}%</span>
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
