import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Globe,
  Pause,
  Play,
  Plus,
  Radio,
  Signal,
  Webhook,
  Wifi,
  XCircle,
} from "lucide-react";
import { listStreams, listEvents, listDeliveries } from "./actions";
import { PageShell, StatCard, Section, TableShell, GridShell } from "@/components/page-shell";
import { TiltCard } from "@/components/tilt-card";
import type { StreamConfig, StreamEvent, WebhookDelivery } from "@sdp-mvp/types";

export const metadata = {
  title: "Streams",
  description: "Real-time data streaming and webhooks",
};

export default async function StreamsPage() {
  const [streams, events, deliveries] = await Promise.all([
    listStreams(),
    listEvents(),
    listDeliveries(),
  ]);

  const activeCount = streams.filter((s) => s.status === "active").length;
  const totalEvents = streams.reduce((a, b) => a + b.totalEvents, 0);
  const totalErrors = streams.reduce((a, b) => a + b.errorCount, 0);

  return (
    <PageShell
      title="Streams"
      description="Real-time blockchain data via webhooks, websockets, and gRPC"
      status="online"
      statusLabel={`${activeCount} active`}
      headerAction={
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-sdp-accent px-4 py-2 text-sm font-medium text-white shadow-lg shadow-sdp-accent/25 transition-all hover:brightness-110">
          <Plus className="h-4 w-4" />
          New Stream
        </button>
      }
    >
      {/* Stats */}
      <GridShell cols={4}>
        <StatCard
          label="Active Streams"
          value={activeCount}
          total={streams.length}
          icon={<Radio className="h-5 w-5" />}
          accent="emerald"
        />
        <StatCard
          label="Total Events"
          value={totalEvents.toLocaleString()}
          icon={<Activity className="h-5 w-5" />}
          accent="blue"
        />
        <StatCard
          label="Error Rate"
          value={`${((totalErrors / totalEvents) * 100).toFixed(3)}%`}
          icon={<AlertCircle className="h-5 w-5" />}
          accent="amber"
        />
        <StatCard
          label="Delivery Rate"
          value={`${(
            ((deliveries.filter((d) => d.status === "delivered").length /
              deliveries.length) || 0) * 100
          ).toFixed(1)}%`}
          icon={<CheckCircle2 className="h-5 w-5" />}
          accent="purple"
        />
      </GridShell>

      {/* Streams Grid */}
      <Section title="Active Streams">
        <GridShell cols={2}>
          {streams.map((stream) => (
            <TiltCard key={stream.id}>
              <StreamCard stream={stream} />
            </TiltCard>
          ))}
        </GridShell>
      </Section>

      {/* Recent Events */}
      <Section title="Recent Events">
        <TableShell>
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03]">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-white/40">Event</th>
                <th className="px-4 py-3 text-left font-medium text-white/40">Chain</th>
                <th className="px-4 py-3 text-left font-medium text-white/40">Type</th>
                <th className="px-4 py-3 text-right font-medium text-white/40">Block</th>
                <th className="px-4 py-3 text-right font-medium text-white/40">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {events.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </tbody>
          </table>
        </TableShell>
      </Section>

      {/* Delivery Log */}
      <Section title="Delivery Log">
        <TableShell>
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03]">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-white/40">Status</th>
                <th className="px-4 py-3 text-left font-medium text-white/40">Stream</th>
                <th className="px-4 py-3 text-right font-medium text-white/40">HTTP</th>
                <th className="px-4 py-3 text-right font-medium text-white/40">Attempts</th>
                <th className="px-4 py-3 text-right font-medium text-white/40">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {deliveries.map((delivery) => (
                <DeliveryRow key={delivery.id} delivery={delivery} streams={streams} />
              ))}
            </tbody>
          </table>
        </TableShell>
      </Section>
    </PageShell>
  );
}

function StreamCard({ stream }: { stream: StreamConfig }) {
  const statusConfig = {
    active: { icon: <Play className="h-3.5 w-3.5" />, color: "bg-emerald-500/20 text-emerald-400", label: "Active" },
    paused: { icon: <Pause className="h-3.5 w-3.5" />, color: "bg-amber-500/20 text-amber-400", label: "Paused" },
    error: { icon: <XCircle className="h-3.5 w-3.5" />, color: "bg-rose-500/20 text-rose-400", label: "Error" },
    stopped: { icon: <Signal className="h-3.5 w-3.5" />, color: "bg-white/10 text-white/50", label: "Stopped" },
  };

  const typeIcon = {
    webhook: <Webhook className="h-4 w-4" />,
    websocket: <Wifi className="h-4 w-4" />,
    grpc: <Globe className="h-4 w-4" />,
    sse: <Radio className="h-4 w-4" />,
  };

  const status = statusConfig[stream.status];

  return (
    <div className="h-full rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm card-lift gradient-border">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.06] text-white">
            {typeIcon[stream.type]}
          </div>
          <div>
            <h3 className="font-medium text-white">{stream.name}</h3>
            <p className="text-xs text-white/40">
              {stream.chainName} · {stream.type.toUpperCase()}
            </p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>
          {status.icon}
          {status.label}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-white/40">Events</p>
          <p className="font-medium text-white">{stream.totalEvents.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-white/40">Errors</p>
          <p className={`font-medium ${stream.errorCount > 0 ? "text-rose-400" : "text-white"}`}>
            {stream.errorCount}
          </p>
        </div>
        <div>
          <p className="text-white/40">Types</p>
          <p className="font-medium text-white">{stream.eventTypes.join(", ")}</p>
        </div>
        <div>
          <p className="text-white/40">Last Event</p>
          <p className="font-medium text-white">
            {stream.lastEventAt ? formatTimeAgo(new Date(stream.lastEventAt)) : "Never"}
          </p>
        </div>
      </div>

      {stream.filters.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {stream.filters.map((filter, i) => (
            <span key={i} className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-xs text-white/50">
              {filter.field} {filter.operator} {Array.isArray(filter.value) ? filter.value.join(", ") : filter.value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function EventRow({ event }: { event: StreamEvent }) {
  return (
    <tr className="hover:bg-white/[0.03] transition-colors">
      <td className="px-4 py-3 font-mono text-xs text-white">{event.id}</td>
      <td className="px-4 py-3 text-white/70">{event.chainId.split("_")[0].toUpperCase()}</td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-xs font-medium text-white/70 capitalize">
          {event.type}
        </span>
      </td>
      <td className="px-4 py-3 text-right font-mono text-xs text-white/70">
        {event.blockNumber.toLocaleString()}
      </td>
      <td className="px-4 py-3 text-right text-white/70">
        {formatTimeAgo(new Date(event.timestamp))}
      </td>
    </tr>
  );
}

function DeliveryRow({
  delivery,
  streams,
}: {
  delivery: WebhookDelivery;
  streams: StreamConfig[];
}) {
  const stream = streams.find((s) => s.id === delivery.streamId);

  return (
    <tr className="hover:bg-white/[0.03] transition-colors">
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            delivery.status === "delivered"
              ? "bg-emerald-500/20 text-emerald-400"
              : delivery.status === "failed"
              ? "bg-rose-500/20 text-rose-400"
              : "bg-amber-500/20 text-amber-400"
          }`}
        >
          {delivery.status === "delivered" ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : delivery.status === "failed" ? (
            <XCircle className="h-3 w-3" />
          ) : (
            <Clock className="h-3 w-3" />
          )}
          {delivery.status}
        </span>
      </td>
      <td className="px-4 py-3 text-white/70">{stream?.name || delivery.streamId}</td>
      <td className="px-4 py-3 text-right text-white/70">
        {delivery.httpStatus || "—"}
      </td>
      <td className="px-4 py-3 text-right text-white/70">{delivery.attempts}</td>
      <td className="px-4 py-3 text-right text-white/70">
        {formatTimeAgo(new Date(delivery.createdAt))}
      </td>
    </tr>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  return `${hours}h ago`;
}
