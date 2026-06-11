import { Button } from "@/components/ui/button";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-sdp-text-high">Streams</h1>
          <p className="mt-1 text-sdp-text-medium">
            Real-time blockchain data via webhooks, websockets, and gRPC.
          </p>
        </div>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          New Stream
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Streams"
          value={activeCount}
          total={streams.length}
          icon={<Radio className="h-5 w-5" />}
          color="text-emerald-400"
          gradient="from-emerald-500/20 to-emerald-500/5"
        />
        <StatCard
          label="Total Events"
          value={totalEvents.toLocaleString()}
          icon={<Activity className="h-5 w-5" />}
          color="text-blue-400"
          gradient="from-blue-500/20 to-blue-500/5"
        />
        <StatCard
          label="Error Rate"
          value={`${((totalErrors / totalEvents) * 100).toFixed(3)}%`}
          icon={<AlertCircle className="h-5 w-5" />}
          color="text-amber-400"
          gradient="from-amber-500/20 to-amber-500/5"
        />
        <StatCard
          label="Delivery Rate"
          value={`${(
            ((deliveries.filter((d) => d.status === "delivered").length /
              deliveries.length) || 0) * 100
          ).toFixed(1)}%`}
          icon={<CheckCircle2 className="h-5 w-5" />}
          color="text-purple-400"
          gradient="from-purple-500/20 to-purple-500/5"
        />
      </div>

      {/* Streams Grid */}
      <div>
        <h2 className="text-lg font-medium text-sdp-text-high mb-4">Active Streams</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {streams.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      </div>

      {/* Recent Events */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <h2 className="font-medium text-sdp-text-high">Recent Events</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-sdp-bg text-sdp-text-medium">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Event</th>
              <th className="px-4 py-3 text-left font-medium">Chain</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-right font-medium">Block</th>
              <th className="px-4 py-3 text-right font-medium">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sdp-border">
            {events.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Delivery Log */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <h2 className="font-medium text-sdp-text-high">Delivery Log</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-sdp-bg text-sdp-text-medium">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Stream</th>
              <th className="px-4 py-3 text-right font-medium">HTTP</th>
              <th className="px-4 py-3 text-right font-medium">Attempts</th>
              <th className="px-4 py-3 text-right font-medium">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sdp-border">
            {deliveries.map((delivery) => (
              <DeliveryRow key={delivery.id} delivery={delivery} streams={streams} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  total,
  icon,
  color,
  gradient,
}: {
  label: string;
  value: string | number;
  total?: number;
  icon: React.ReactNode;
  color: string;
  gradient?: string;
}) {
  return (
    <div className={`rounded-xl border border-white/10 bg-gradient-to-br ${gradient || 'from-white/10 to-white/5'} backdrop-blur-md p-5`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-sdp-text-medium">{label}</p>
          <p className="text-xl font-semibold text-sdp-text-high">
            {value}
            {total !== undefined && (
              <span className="text-sm font-normal text-sdp-text-low"> / {total}</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function StreamCard({ stream }: { stream: StreamConfig }) {
  const statusConfig = {
    active: { icon: <Play className="h-3.5 w-3.5" />, color: "bg-emerald-500/20 text-emerald-400", label: "Active" },
    paused: { icon: <Pause className="h-3.5 w-3.5" />, color: "bg-amber-500/20 text-amber-400", label: "Paused" },
    error: { icon: <XCircle className="h-3.5 w-3.5" />, color: "bg-red-500/20 text-red-400", label: "Error" },
    stopped: { icon: <Signal className="h-3.5 w-3.5" />, color: "bg-white/10 text-sdp-text-medium", label: "Stopped" },
  };

  const typeIcon = {
    webhook: <Webhook className="h-4 w-4" />,
    websocket: <Wifi className="h-4 w-4" />,
    grpc: <Globe className="h-4 w-4" />,
    sse: <Radio className="h-4 w-4" />,
  };

  const status = statusConfig[stream.status];

  return (
    <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-5 transition-all hover:border-white/20">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sdp-bg text-sdp-text-high">
            {typeIcon[stream.type]}
          </div>
          <div>
            <h3 className="font-medium text-sdp-text-high">{stream.name}</h3>
            <p className="text-xs text-sdp-text-low">
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
          <p className="text-sdp-text-low">Events</p>
          <p className="font-medium text-sdp-text-high">{stream.totalEvents.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sdp-text-low">Errors</p>
          <p className={`font-medium ${stream.errorCount > 0 ? "text-red-600" : "text-sdp-text-high"}`}>
            {stream.errorCount}
          </p>
        </div>
        <div>
          <p className="text-sdp-text-low">Events</p>
          <p className="font-medium text-sdp-text-high">{stream.eventTypes.join(", ")}</p>
        </div>
        <div>
          <p className="text-sdp-text-low">Last Event</p>
          <p className="font-medium text-sdp-text-high">
            {stream.lastEventAt ? formatTimeAgo(new Date(stream.lastEventAt)) : "Never"}
          </p>
        </div>
      </div>

      {stream.filters.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {stream.filters.map((filter, i) => (
            <span key={i} className="inline-flex items-center rounded bg-sdp-bg px-2 py-0.5 text-xs text-sdp-text-low">
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
    <tr className="hover:bg-sdp-bg/50 transition-colors">
      <td className="px-4 py-3 font-mono text-xs text-sdp-text-high">{event.id}</td>
      <td className="px-4 py-3 text-sdp-text-medium">{event.chainId.split("_")[0].toUpperCase()}</td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center rounded-full bg-sdp-bg px-2 py-0.5 text-xs font-medium text-sdp-text-medium capitalize">
          {event.type}
        </span>
      </td>
      <td className="px-4 py-3 text-right font-mono text-xs text-sdp-text-medium">
        {event.blockNumber.toLocaleString()}
      </td>
      <td className="px-4 py-3 text-right text-sdp-text-medium">
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
    <tr className="hover:bg-sdp-bg/50 transition-colors">
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            delivery.status === "delivered"
              ? "bg-emerald-500/20 text-emerald-400"
              : delivery.status === "failed"
              ? "bg-red-500/20 text-red-400"
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
      <td className="px-4 py-3 text-sdp-text-medium">{stream?.name || delivery.streamId}</td>
      <td className="px-4 py-3 text-right text-sdp-text-medium">
        {delivery.httpStatus || "—"}
      </td>
      <td className="px-4 py-3 text-right text-sdp-text-medium">{delivery.attempts}</td>
      <td className="px-4 py-3 text-right text-sdp-text-medium">
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
