import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Activity,
  UserCheck,
  FileText,
} from "lucide-react";
import { listRiskScores, listKycRecords, getComplianceStats } from "./actions";

function RiskBadge({ level }: { level: string }) {
  const config: Record<string, { color: string; icon: React.ReactNode }> = {
    low: { color: "bg-emerald-500/10 text-emerald-400", icon: <ShieldCheck className="w-3 h-3" /> },
    medium: { color: "bg-amber-500/10 text-amber-400", icon: <ShieldAlert className="w-3 h-3" /> },
    high: { color: "bg-red-500/10 text-red-400", icon: <ShieldX className="w-3 h-3" /> },
    critical: { color: "bg-red-600/10 text-red-500", icon: <AlertTriangle className="w-3 h-3" /> },
  };
  const c = config[level] || config.low;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.color}`}>
      {c.icon}
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}

function KycBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; icon: React.ReactNode }> = {
    verified: { color: "bg-emerald-500/10 text-emerald-400", icon: <CheckCircle2 className="w-3 h-3" /> },
    pending: { color: "bg-amber-500/10 text-amber-400", icon: <Clock className="w-3 h-3" /> },
    rejected: { color: "bg-red-500/10 text-red-400", icon: <XCircle className="w-3 h-3" /> },
    not_started: { color: "bg-slate-800 text-slate-400", icon: <FileText className="w-3 h-3" /> },
  };
  const c = config[status] || config.not_started;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.color}`}>
      {c.icon}
      {status.replace("_", " ")}
    </span>
  );
}

export default async function CompliancePage() {
  const [risks, kyc, stats] = await Promise.all([
    listRiskScores(),
    listKycRecords(),
    getComplianceStats(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Compliance & Risk</h1>
          <p className="text-sm text-slate-400 mt-1">
            On-chain KYC, risk scoring, and regulatory compliance
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Assessed</p>
            <Shield className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.totalAssessed}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Low Risk</p>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{stats.low}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">High Risk</p>
            <ShieldX className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400 mt-2">{stats.high + stats.critical}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">KYC Verified</p>
            <UserCheck className="w-5 h-5 text-violet-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.verified}</p>
        </div>
      </div>

      {/* Risk Scores */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Risk Scores</h2>
          <p className="text-sm text-slate-400 mt-0.5">On-chain address risk assessment</p>
        </div>
        <div className="divide-y divide-slate-800">
          {risks.map((r) => (
            <div key={r.address} className="px-6 py-5 hover:bg-slate-800/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <RiskBadge level={r.overallRisk} />
                    <span className="text-xs text-slate-500">Score: {r.score}/100</span>
                  </div>
                  <p className="text-sm font-mono text-slate-300 mt-2">{r.address}</p>
                  <div className="mt-3 space-y-2">
                    {r.factors.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          f.risk === "low" ? "bg-emerald-400" :
                          f.risk === "medium" ? "bg-amber-400" :
                          f.risk === "high" ? "bg-red-400" : "bg-red-500"
                        }`} />
                        <span className="text-slate-400">{f.category}:</span>
                        <span className="text-slate-300">{f.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-right ml-4 shrink-0">
                  <p className="text-xs text-slate-500">
                    {new Date(r.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KYC Records */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">KYC Records</h2>
          <p className="text-sm text-slate-400 mt-0.5">Identity verification status</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="text-left font-medium px-6 py-3">Status</th>
                <th className="text-left font-medium px-6 py-3">Wallet</th>
                <th className="text-left font-medium px-6 py-3">Provider</th>
                <th className="text-left font-medium px-6 py-3">Verified</th>
                <th className="text-left font-medium px-6 py-3">Expires</th>
                <th className="text-left font-medium px-6 py-3">Documents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {kyc.map((k) => (
                <tr key={k.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <KycBadge status={k.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-300 font-mono text-xs">{k.walletAddress.slice(0, 12)}...</td>
                  <td className="px-6 py-4 text-slate-300">{k.provider}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {k.verifiedAt ? new Date(k.verifiedAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {k.expiresAt ? new Date(k.expiresAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {k.documents.map((d, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">
                          {d}
                        </span>
                      ))}
                    </div>
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
