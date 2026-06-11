import { ArrowLeft, BarChart3, DollarSign, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { getPartnerAnalytics } from "../actions";

export const metadata = {
  title: "Partner Analytics",
  description: "Partner-specific usage insights",
};

export default async function AnalyticsPage() {
  const analytics = await getPartnerAnalytics();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/partners"
            className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Partners
          </Link>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Analytics
        </h1>
        <p className="mt-2 text-sm text-white/40">
          Partner-specific usage and performance insights
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 text-indigo-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/40 uppercase tracking-wider">Total Requests</p>
              <p className="text-xl font-bold text-white">{analytics.totalRequests.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/40 uppercase tracking-wider">Active Tenants</p>
              <p className="text-xl font-bold text-white">{analytics.uniqueTenants}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/40 uppercase tracking-wider">New This Month</p>
              <p className="text-xl font-bold text-white">+{analytics.newTenants}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/5 text-purple-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/40 uppercase tracking-wider">Avg Revenue/Tenant</p>
              <p className="text-xl font-bold text-white">${analytics.avgRevenuePerTenant.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="font-medium text-white">Daily Requests</h2>
          </div>
          <div className="p-4">
            <div className="flex items-end gap-2 h-40">
              {analytics.dailyRequests.map((d) => {
                const max = Math.max(...analytics.dailyRequests.map((x) => x.requests));
                const height = (d.requests / max) * 100;
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-indigo-500/40 to-indigo-500/20 transition-all hover:from-indigo-500/60 hover:to-indigo-500/40"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-white/30">{d.date}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="font-medium text-white">Top Methods</h2>
          </div>
          <div className="divide-y divide-white/5">
            {analytics.topMethods.map((m, i) => (
              <div key={m.method} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/30 w-5">{i + 1}</span>
                  <span className="text-sm text-white">{m.method}</span>
                </div>
                <span className="text-sm text-white/60">{m.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
