"use client";

import {
  CheckCircle2,
  Globe,
  Layers,
  Plus,
  Server,
  Zap,
} from "lucide-react";
import { GlassHeader } from "@/components/glass-header";
import { TiltCard } from "@/components/tilt-card";
import { StatusPulse } from "@/components/status-pulse";
import { PageShell, StatCard, Section, GridShell } from "@/components/page-shell";
import { useState, useEffect } from "react";
import type { Chain, RpcEndpoint, EndpointHealth } from "@sdp-mvp/types";

export default function RpcPage() {
  const [chains, setChains] = useState<Chain[]>([]);
  const [endpoints, setEndpoints] = useState<RpcEndpoint[]>([]);
  const [health, setHealth] = useState<EndpointHealth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const mod = await import("./actions");
      const [c, e, h] = await Promise.all([
        mod.listChains(),
        mod.listEndpoints(),
        mod.getEndpointHealth(),
      ]);
      setChains(c);
      setEndpoints(e);
      setHealth(h);
      setLoading(false);
    }
    fetchData();
  }, []);

  const healthMap = new Map(health.map((h) => [h.endpointId, h]));

  if (loading) {
    return (
      <PageShell title="RPC Endpoints" description="Loading..." loading>
        <div />
      </PageShell>
    );
  }

  return (
    <PageShell
      title="RPC Endpoints"
      description="Multi-chain RPC infrastructure with automatic failover"
      status="online"
      statusLabel="All systems operational"
      headerAction={
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-sdp-accent px-4 py-2 text-sm font-medium text-white shadow-lg shadow-sdp-accent/25 transition-all hover:brightness-110">
          <Plus className="h-4 w-4" />
          Add Endpoint
        </button>
      }
    >
      {/* Stats */}
      <GridShell cols={4}>
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
      </GridShell>

      {/* Chain Grid */}
      <Section title="Supported Chains">
        <GridShell cols={3}>
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
        </GridShell>
      </Section>

      {/* Endpoints Table */}
      <Section title="All Endpoints">
        <EndpointsTable
          endpoints={endpoints}
          chains={chains}
          healthMap={healthMap}
        />
      </Section>
    </PageShell>
  );
}

function EndpointsTable({
  endpoints,
  chains,
  healthMap,
}: {
  endpoints: RpcEndpoint[];
  chains: Chain[];
  healthMap: Map<string, EndpointHealth>;
}) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const sortedData = [...endpoints].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;

    const aVal = ((a as unknown) as Record<string, string | number>)[sortColumn];
    const bVal = ((b as unknown) as Record<string, string | number>)[sortColumn];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });

  const columns = [
    { key: "name", header: "Endpoint", sortable: true },
    { key: "chainId", header: "Chain", sortable: true },
    { key: "status", header: "Status", sortable: true },
    { key: "latencyMs", header: "Latency", sortable: true },
    { key: "type", header: "Type", sortable: true },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
      <table className="w-full text-sm">
        <thead className="bg-white/[0.03]">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => column.sortable && handleSort(column.key)}
                className={`px-4 py-3 text-left font-medium text-white/40 ${
                  column.sortable
                    ? "cursor-pointer select-none hover:text-white/70 transition-colors"
                    : ""
                }`}
              >
                <div className="flex items-center gap-1">
                  {column.header}
                  {column.sortable && (
                    <span className="text-xs">
                      {sortColumn === column.key
                        ? sortDirection === "asc"
                          ? " ↑"
                          : " ↓"
                        : " ↕"}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06]">
          {sortedData.map((e) => {
            const chain = chains.find((c) => c.id === e.chainId);
            return (
              <tr
                key={e.id}
                className="group hover:bg-white/[0.03] transition-colors"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-white">{e.name}</p>
                    <p className="text-xs text-white/40">{e.url}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: chain?.color || "#6366f1" }}
                    />
                    <span className="text-white/70">{chain?.name || e.chainId}</span>
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusPulse
                    status={
                      e.status === "healthy"
                        ? "online"
                        : e.status === "degraded"
                        ? "warning"
                        : "offline"
                    }
                    label={e.status}
                  />
                </td>
                <td className="px-4 py-3">
                  <span className="text-white/70">{e.latencyMs}ms</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-white/70">{e.type}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
