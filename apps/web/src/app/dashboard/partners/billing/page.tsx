import { ArrowLeft, DollarSign, Download } from "lucide-react";
import Link from "next/link";
import { listRevenue } from "../actions";

export const metadata = {
  title: "Partner Billing",
  description: "Revenue sharing and payouts",
};

export default async function BillingPage() {
  const revenue = await listRevenue();

  const totalEarned = revenue
    .filter((r) => r.status === "completed")
    .reduce((a, b) => a + b.partnerShare, 0);
  const pendingAmount = revenue
    .filter((r) => r.status === "pending")
    .reduce((a, b) => a + b.partnerShare, 0);

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
        <h1 className="text-3xl font-bold text-white tracking-tight">Billing</h1>
        <p className="mt-2 text-sm text-white/40">
          Revenue sharing and payout history
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/40 uppercase tracking-wider">Total Earned</p>
              <p className="text-xl font-bold text-white">${totalEarned.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/40 uppercase tracking-wider">Pending</p>
              <p className="text-xl font-bold text-white">${pendingAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/5 text-purple-400">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/40 uppercase tracking-wider">Payouts</p>
              <p className="text-xl font-bold text-white">{revenue.filter((r) => r.status === "completed").length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <h2 className="font-medium text-white">Payout History</h2>
        </div>
        <div className="divide-y divide-white/5">
          {revenue.map((rev) => (
            <div key={rev.id} className="px-4 py-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    rev.status === "completed"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}>
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{rev.period}</p>
                    <p className="text-xs text-white/30">
                      {rev.status === "completed"
                        ? `Paid on ${new Date(rev.paidAt!).toLocaleDateString()}`
                        : "Pending payout"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">${rev.partnerShare.toFixed(2)}</p>
                  <p className="text-xs text-white/30">Your share</p>
                </div>
              </div>

              <div className="ml-11 space-y-2">
                {rev.tenantBreakdown.map((tb) => (
                  <div key={tb.tenantId} className="flex items-center justify-between text-sm">
                    <span className="text-white/60">{tb.tenantName}</span>
                    <span className="text-white/40">${tb.partnerShare.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
