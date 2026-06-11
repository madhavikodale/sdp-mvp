import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Layers,
  Plus,
  Server,
  Signal,
  Zap,
} from "lucide-react";
import { listChains, listEndpoints, getEndpointHealth } from "./actions";
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
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header flex items-end justify-between">
        <div>
          <h1>RPC Endpoints</h1>
          <p>Multi-chain RPC infrastructure with automatic failover</p>
        </div>
        <button className="btn-primary">
          <Plus className="h-4 w-4" />
          Add Endpoint
        </button>
      </div>

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
              <ChainCard
                key={chain.id}
                chain={chain}
                endpoints={chainEndpoints}
                healthyCount={healthyCount}
                healthMap={healthMap}
              />
            );
          })}
        </div>
      </div>

      {/* Endpoints Table */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">All Endpoints</h2>
        <div className="glass-card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Chain</th>
                <th>Type</th>
                <th>Region</th>
                <th>Status</th>
                <th>Latency</th>
                <th>Block Height</th>
                <th>Features</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((ep) => {
                const h = healthMap.get(ep.id);
                return <EndpointRow key={ep.id} endpoint={ep} health={h} />;
              })}
            </tbody>
          </table>
        </div>
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
  value: string | number;
  total?: number;
  icon: React.ReactNode;
  accent: "indigo" | "emerald" | "amber" | "violet";
}) {
  const accentColors = {
    indigo: "from-indigo-500/20 to-indigo-500/5 text-indigo-400",
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-400",
    amber: "from-amber-500/20 to-amber-500/5 text-amber-400",
    violet: "from-violet-500/20 to-violet-500/5 text-violet-400",
  };

  return (
    <div className="glass-card p-5 group card-lift gradient-border">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${accentColors[accent]}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider">{label}</p>
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
  const isHealthy = healthyCount === endpoints.length && endpoints.length > 0;
  const hasDegraded = endpoints.some((e) => e.status === "degraded");

  return (
    <div className="glass-card p-5 group card-lift gradient-border">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-lg font-bold text-white">
            {chain.ticker.slice(0, 2)}
          </div>
          <div>
            <h3 className="font-medium text-white">{chain.name}</h3>
            <p className="text-xs text-white/30">{chain.category.toUpperCase()}</p>
          </div>
        </div>
        <span
          className={`badge ${
            isHealthy
              ? "badge-success"
              : hasDegraded
              ? "badge-warning"
              : "badge-danger"
          }`}
        >
          {isHealthy ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : hasDegraded ? (
            <AlertTriangle className="h-3 w-3" />
          ) : (
            <Signal className="h-3 w-3" />
          )}
          {isHealthy ? "Healthy" : hasDegraded ? "Degraded" : "Down"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-white/30 text-xs">TPS</p>
          <p className="font-medium text-white">{chain.tps.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-white/30 text-xs">Block Time</p>
          <p className="font-medium text-white">
            {chain.blockTimeMs >= 1000
              ? `${(chain.blockTimeMs / 1000).toFixed(1)}s`
              : `${chain.blockTimeMs}ms`}
          </p>
        </div>
        <div>
          <p className="text-white/30 text-xs">Endpoints</p>
          <p className="font-medium text-white">{endpoints.length}</p>
        </div>
        <div>
          <p className="text-white/30 text-xs">Latency</p>
          <p className="font-medium text-white">
            {endpoints.length > 0
              ? `${Math.round(
                  endpoints.reduce((a, b) => a + b.latencyMs, 0) / endpoints.length
                )}ms`
              : "N/A"}
          </p>
        </div>
      </div>

      {endpoints.length > 0 && (
        <div className="mt-4 space-y-1">
          {endpoints.slice(0, 2).map((ep) => (
            <div key={ep.id} className="flex items-center justify-between text-xs">
              <span className="text-white/40 truncate">{ep.name}</span>
              <span className="text-white/30">{ep.latencyMs}ms</span>
            </div>
          ))}
          {endpoints.length > 2 && (
            <p className="text-xs text-white/20">+{endpoints.length - 2} more</p>
          )}
        </div>
      )}
    </div>
  );
}

function EndpointRow({
  endpoint,
  health,
}: {
  endpoint: RpcEndpoint;
  health?: EndpointHealth;
}) {
  const statusColors = {
    healthy: "badge-success",
    degraded: "badge-warning",
    down: "badge-danger",
    maintenance: "badge-neutral",
  };

  return (
    <tr>
      <td>
        <div className="font-medium text-white">{endpoint.name}</div>
        {endpoint.isDefault && (
          <span className="inline-flex items-center rounded bg-white/5 px-1.5 py-0.5 text-xs text-white/30">
            Default
          </span>
        )}
      </td>
      <td className="text-white/40">
        <span className="inline-flex items-center gap-1">
          <Server className="h-3.5 w-3.5" />
          {endpoint.chainId.split("_")[0].toUpperCase()}
        </span>
      </td>
      <td>
        <span className="badge badge-neutral capitalize">
          {endpoint.type}
        </span>
      </td>
      <td className="text-white/40">{endpoint.region}</td>
      <td>
        <span className={`badge ${statusColors[endpoint.status]}`}>
          {endpoint.status === "healthy" ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : endpoint.status === "degraded" ? (
            <AlertTriangle className="h-3 w-3" />
          ) : (
            <Activity className="h-3 w-3" />
          )}
          {endpoint.status}
        </span>
      </td>
      <td className="font-mono text-white/40">{endpoint.latencyMs}ms</td>
      <td className="font-mono text-white/40">
        {health ? health.blockHeight.toLocaleString() : "—"}
      </td>
      <td>
        <div className="flex gap-1">
          {endpoint.features.map((f) => (
            <span
              key={f}
              className="inline-flex items-center rounded bg-white/5 px-1.5 py-0.5 text-xs text-white/30 capitalize"
            >
              {f}
            </span>
          ))}
        </div>
      </td>
    </tr>
  );
}
