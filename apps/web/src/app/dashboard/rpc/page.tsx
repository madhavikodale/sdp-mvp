import {
  CheckCircle2,
  Globe,
  Layers,
  Plus,
  Server,
  Zap,
} from "lucide-react";
import { listChains, listEndpoints, getEndpointHealth } from "./actions";
import { GlassHeader } from "@/components/glass-header";
import { SortableTable } from "@/components/sortable-table";
import { TiltCard } from "@/components/tilt-card";
import { StatusPulse } from "@/components/status-pulse";
import type { Chain, RpcEndpoint, EndpointHealth } from "@sdp-mvp/types";

export const metadata = {
  title: "RPC Endpoints",
  description: "Manage multi-chain RPC endpoints",
};

export default async function RpcPage() {
  const [chains, endpoints, health] = await Promise.all([
    listChains(),
    listEndpoints(),
    getEndpointHealth(),
  ]);

  const healthMap = new Map(health.map((h) => [h.endpointId, h]));

  return (
    <div className="space-y-8 -mt-4">
      <GlassHeader
        title="RPC Endpoints"
        description="Multi-chain RPC infrastructure with automatic failover"
      >
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-sdp-accent px-4 py-2 text-sm font-medium text-white shadow-lg shadow-sdp-accent/25 transition-all hover:brightness-110">
          <Plus className="h-4 w-4" />
          Add Endpoint
        </button>
      </GlassHeader>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Chains"
          value={chains.filter((c) => c.status === "active").length}
          icon={<Globe className="h-5 w-5" />}
          accent="indigo"
        />
        <StatCard
          label="Healthy Endpoints"
          value={endpoints.filter((e) => e.status === "healthy").length}
          total={endpoints.length}
          icon={<CheckCircle2 className="h-5 w-5" />}
          accent="emerald"
        />
        <StatCard
          label="Avg Latency"
          value={`${Math.round(
            endpoints.reduce((a, b) => a + b.latencyMs, 0) / endpoints.length
          )}ms`}
          icon={<Zap className="h-5 w-5" />}
          accent="amber"
        />
        <StatCard
          label="Archive Nodes"
          value={endpoints.filter((e) => e.isArchive).length}
          icon={<Layers className="h-5 w-5" />}
          accent="violet"
        />
      </div>

      {/* Chain Grid */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Supported Chains</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {chains.map((chain) => {
            const chainEndpoints = endpoints.filter((e) => e.chainId === chain.id);
            const healthyCount = chainEndpoints.filter((e) => e.status === "healthy").length;
            return (
              <TiltCard key={chain.id}>
                <ChainCard
                  chain={chain}
                  endpoints={chainEndpoints}
                  healthyCount={healthyCount}
                  healthMap={healthMap}
                />
              </TiltCard>
            );
          })}
        </div>
      </div>

      {/* Endpoints Table */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">All Endpoints</h2>
        <SortableTable
          data={endpoints}
          keyExtractor={(e) => e.id}
          columns={[
            {
              key: "name",
              header: "Endpoint",
              cell: (e) => (
                <div>
                  <p className="font-medium text-white">{e.name}</p>
                  <p className="text-xs text-white/40">{e.url}</p>
                </div>
              ),
              sortable: true,
            },
            {
              key: "chainId",
              header: "Chain",
              cell: (e) => {
                const chain = chains.find((c) => c.id === e.chainId);
                return (
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: chain?.color || "#6366f1" }}
                    />
                    <span className="text-white/70">{chain?.name || e.chainId}</span>
                  </span>
                );
              },
              sortable: true,
            },
            {
              key: "status",
              header: "Status",
              cell: (e) => (
                <StatusPulse
                  status={e.status === "healthy" ? "online" : e.status === "degraded" ? "warning" : "offline"}
                  label={e.status}
                />
              ),
              sortable: true,
            },
            {
              key: "latencyMs",
              header: "Latency",
              cell: (e) => (
                <span className="text-white/70">{e.latencyMs}ms</span>
              ),
              sortable: true,
            },
            {
              key: "type",
              header: "Type",
              cell: (e) => (
                <span className="text-white/70">{e.type}</span>
              ),
              sortable: true,
            },
          ]}
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  total,
  icon,
  accent,
}: {
  label: string;
  value: number | string;
  total?: number;
  icon: React.ReactNode;
  accent: string;
}) {
  const accentColors: Record<string, string> = {
    indigo: "from-indigo-500/20 to-indigo-500/5 text-indigo-400",
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-400",
    amber: "from-amber-500/20 to-amber-500/5 text-amber-400",
    violet: "from-violet-500/20 to-violet-500/5 text-violet-400",
  };

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm card-lift">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${accentColors[accent]}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-white/40">{label}</p>
          <p className="text-xl font-bold text-white">
            {value}
            {total !== undefined && (
              <span className="text-sm font-normal text-white/30"> / {total}</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function ChainCard({
  chain,
  endpoints,
  healthyCount,
  healthMap,
}: {
  chain: Chain;
  endpoints: RpcEndpoint[];
  healthyCount: number;
  healthMap: Map<string, EndpointHealth>;
}) {
  const avgLatency = Math.round(
    endpoints.reduce((a, b) => a + b.latencyMs, 0) / (endpoints.length || 1)
  );
  const avgUptime =
    endpoints.reduce((a, b) => a + (healthMap.get(b.id)?.uptimePercent || 99.9), 0) /
    (endpoints.length || 1);

  return (
    <div className="h-full rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm card-lift gradient-border">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${chain.color}20`, color: chain.color }}
          >
            <Server className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-white">{chain.name}</h3>
            <p className="text-xs text-white/40">{chain.category}</p>
          </div>
        </div>
        <StatusPulse
          status={chain.status === "active" ? "online" : "offline"}
          size="sm"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-white/[0.03] p-3">
          <p className="text-xs text-white/40">Endpoints</p>
          <p className="text-lg font-semibold text-white">
            {healthyCount}/{endpoints.length}
          </p>
        </div>
        <div className="rounded-lg bg-white/[0.03] p-3">
          <p className="text-xs text-white/40">Latency</p>
          <p className="text-lg font-semibold text-white">{avgLatency}ms</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-white/40">Uptime</span>
          <span className="text-white/70">{avgUptime.toFixed(2)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${Math.min(avgUptime, 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1">
        {chain.features.slice(0, 3).map((feature) => (
          <span
            key={feature}
            className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/50"
          >
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
}
