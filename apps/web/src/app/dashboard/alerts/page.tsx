import {
  Bell,
  BellRing,
  Mail,
  Globe,
  MessageCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Shield,
  Activity,
  TrendingUp,
  Gauge,
  Plus,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { listAlertRules, listNotifications, listChannels, getAlertStats } from "./actions";

function SeverityBadge({ severity }: { severity: string }) {
  const config: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    critical: { color: "bg-rose-500/10 text-rose-400 border-rose-500/20", icon: <AlertTriangle className="w-3 h-3" />, label: "Critical" },
    warning: { color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: <AlertTriangle className="w-3 h-3" />, label: "Warning" },
    info: { color: "bg-sky-500/10 text-sky-400 border-sky-500/20", icon: <Bell className="w-3 h-3" />, label: "Info" },
  };
  const c = config[severity] || config.info;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${c.color}`}>
      {c.icon}
      {c.label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; icon: React.ReactNode }> = {
    active: { color: "bg-emerald-500/10 text-emerald-400", icon: <CheckCircle2 className="w-3 h-3" /> },
    resolved: { color: "bg-sky-500/10 text-sky-400", icon: <CheckCircle2 className="w-3 h-3" /> },
    muted: { color: "bg-slate-800 text-slate-400", icon: <XCircle className="w-3 h-3" /> },
  };
  const c = config[status] || config.muted;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.color}`}>
      {c.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function ChannelIcon({ channel }: { channel: string }) {
  switch (channel) {
    case "email": return <Mail className="w-4 h-4" />;
    case "slack": return <Globe className="w-4 h-4" />;
    case "webhook": return <Globe className="w-4 h-4" />;
    case "telegram": return <MessageCircle className="w-4 h-4" />;
    case "pagerduty": return <Zap className="w-4 h-4" />;
    default: return <Bell className="w-4 h-4" />;
  }
}

function MetricIcon({ metric }: { metric: string }) {
  switch (metric) {
    case "error_rate": return <AlertTriangle className="w-4 h-4" />;
    case "latency": return <Clock className="w-4 h-4" />;
    case "quota": return <Gauge className="w-4 h-4" />;
    case "mev_threat": return <Shield className="w-4 h-4" />;
    case "gas_price": return <Zap className="w-4 h-4" />;
    default: return <Activity className="w-4 h-4" />;
  }
}

export default async function AlertsPage() {
  const [rules, notifications, channels, stats] = await Promise.all([
    listAlertRules(),
    listNotifications(),
    listChannels(),
    getAlertStats(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Alerts & Monitoring</h1>
          <p className="text-sm text-slate-400 mt-1">
            Custom alert rules, notification history, and channel configuration
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          New Alert Rule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Active Rules</p>
            <BellRing className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.activeRules}</p>
          <p className="text-xs text-slate-500 mt-1">{stats.totalRules} total</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Notifications</p>
            <Bell className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.totalNotifications}</p>
          <p className="text-xs text-slate-500 mt-1">{stats.criticalNotifications} critical</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Channels</p>
            <Globe className="w-5 h-5 text-violet-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.channelsConfigured}</p>
          <p className="text-xs text-slate-500 mt-1">Configured</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Trigger Rate</p>
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {stats.activeRules > 0 ? Math.round((stats.totalNotifications / stats.activeRules) * 10) : 0}/h
          </p>
          <p className="text-xs text-slate-500 mt-1">Avg per rule</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert Rules */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h2 className="text-lg font-semibold text-white">Alert Rules</h2>
            <p className="text-sm text-slate-400 mt-0.5">Configured monitoring thresholds</p>
          </div>
          <div className="divide-y divide-slate-800">
            {rules.map((rule) => (
              <div key={rule.id} className="px-6 py-4 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <SeverityBadge severity={rule.severity} />
                      <StatusBadge status={rule.status} />
                    </div>
                    <h3 className="text-sm font-medium text-white mt-2">{rule.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <MetricIcon metric={rule.metric} />
                      <span className="text-xs text-slate-400 capitalize">{rule.metric.replace("_", " ")}</span>
                      <span className="text-xs text-slate-500">{rule.condition} {rule.threshold}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {rule.channels.map((ch) => (
                        <span key={ch} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">
                          <ChannelIcon channel={ch} />
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xs text-slate-500">{rule.triggerCount} triggers</p>
                    {rule.lastTriggeredAt && (
                      <p className="text-xs text-slate-600 mt-0.5">
                        Last: {new Date(rule.lastTriggeredAt).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channels */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h2 className="text-lg font-semibold text-white">Notification Channels</h2>
            <p className="text-sm text-slate-400 mt-0.5">Alert delivery configuration</p>
          </div>
          <div className="divide-y divide-slate-800">
            {channels.map((ch) => (
              <div key={ch.channel} className="px-6 py-4 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${ch.enabled ? "bg-sky-500/10 text-sky-400" : "bg-slate-800 text-slate-500"}`}>
                      <ChannelIcon channel={ch.channel} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white capitalize">{ch.channel}</p>
                      <p className="text-xs text-slate-500">
                        {ch.verified ? "Verified" : "Not verified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {ch.enabled ? (
                      <>
                        <span className="text-xs text-emerald-400">Enabled</span>
                        <ToggleRight className="w-5 h-5 text-emerald-400" />
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-slate-500">Disabled</span>
                        <ToggleLeft className="w-5 h-5 text-slate-600" />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notification History */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Notification History</h2>
          <p className="text-sm text-slate-400 mt-0.5">Recent alert notifications and delivery status</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="text-left font-medium px-6 py-3">Severity</th>
                <th className="text-left font-medium px-6 py-3">Rule</th>
                <th className="text-left font-medium px-6 py-3">Message</th>
                <th className="text-right font-medium px-6 py-3">Value</th>
                <th className="text-left font-medium px-6 py-3">Channels</th>
                <th className="text-left font-medium px-6 py-3">Status</th>
                <th className="text-right font-medium px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {notifications.map((n) => (
                <tr key={n.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4"><SeverityBadge severity={n.severity} /></td>
                  <td className="px-6 py-4 text-white font-medium">{n.ruleName}</td>
                  <td className="px-6 py-4 text-slate-300 max-w-xs truncate">{n.message}</td>
                  <td className="px-6 py-4 text-right text-white">{n.value}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {n.channels.map((ch) => (
                        <span key={ch} className="text-slate-400"><ChannelIcon channel={ch} /></span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                      n.status === "sent" ? "bg-emerald-500/10 text-emerald-400" :
                      n.status === "failed" ? "bg-red-500/10 text-red-400" :
                      "bg-amber-500/10 text-amber-400"
                    }`}>
                      {n.status === "sent" ? <CheckCircle2 className="w-3 h-3" /> : n.status === "failed" ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {n.status.charAt(0).toUpperCase() + n.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-400 text-xs">
                    {new Date(n.sentAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
