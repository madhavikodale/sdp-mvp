import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  KeyRound,
  Mail,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { listTenants } from "../actions";

export const metadata = {
  title: "Tenants",
  description: "Manage partner tenants",
};

export default async function TenantsPage() {
  const tenants = await listTenants();

  const activeCount = tenants.filter((t) => t.status === "active").length;
  const totalRequests = tenants.reduce((a, b) => a + b.monthlyRequests, 0);
  const totalSpend = tenants.reduce((a, b) => a + b.monthlySpend, 0);

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
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          Add Tenant
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Tenants
        </h1>
        <p className="mt-2 text-sm text-white/40">
          Manage customer tenants and their API access
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 text-indigo-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/40 uppercase tracking-wider">Total</p>
              <p className="text-xl font-bold text-white">{tenants.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/40 uppercase tracking-wider">Monthly Requests</p>
              <p className="text-xl font-bold text-white">{totalRequests.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-400">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/40 uppercase tracking-wider">Monthly Spend</p>
              <p className="text-xl font-bold text-white">${totalSpend.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <h2 className="font-medium text-white">All Tenants</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Tenant</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">API Keys</th>
              <th className="px-4 py-3 text-right font-medium">Requests</th>
              <th className="px-4 py-3 text-right font-medium">Spend</th>
              <th className="px-4 py-3 text-right font-medium">Last Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{tenant.name}</div>
                  <div className="text-xs text-white/30">{tenant.email}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    tenant.status === "active"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : tenant.status === "suspended"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-white/10 text-white/40"
                  }`}>
                    {tenant.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-white/60">{tenant.apiKeysCreated}</td>
                <td className="px-4 py-3 text-right text-white/60">{tenant.monthlyRequests.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-white/60">${tenant.monthlySpend.toFixed(2)}</td>
                <td className="px-4 py-3 text-right text-white/40">
                  {tenant.lastActiveAt ? formatTimeAgo(new Date(tenant.lastActiveAt)) : "Never"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
