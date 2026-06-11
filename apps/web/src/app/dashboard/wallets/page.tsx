import {
  Wallet,
  Shield,
  Key,
  Users,
  Activity,
  Fingerprint,
  Mail,
  Globe,
  Sprout,
  Plus,
} from "lucide-react";
import { listWallets, getWalletStats } from "./actions";

function WalletTypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    eoa: "EOA",
    smart_contract: "Smart Contract",
    multisig: "Multisig",
  };
  const colors: Record<string, string> = {
    eoa: "bg-slate-800 text-slate-300",
    smart_contract: "bg-sky-500/10 text-sky-400",
    multisig: "bg-violet-500/10 text-violet-400",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${colors[type] || colors.eoa}`}>
      {labels[type] || type}
    </span>
  );
}

function AuthIcons({ methods }: { methods: string[] }) {
  const iconMap: Record<string, React.ReactNode> = {
    passkey: <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />,
    social: <Globe className="w-3.5 h-3.5 text-sky-400" />,
    email: <Mail className="w-3.5 h-3.5 text-amber-400" />,
    seed: <Sprout className="w-3.5 h-3.5 text-slate-400" />,
  };
  const labelMap: Record<string, string> = {
    passkey: "Passkey",
    social: "Social",
    email: "Email",
    seed: "Seed Phrase",
  };
  return (
    <div className="flex items-center gap-1">
      {methods.map((m) => (
        <span key={m} title={labelMap[m]}>{iconMap[m]}</span>
      ))}
    </div>
  );
}

export default async function WalletsPage() {
  const [wallets, stats] = await Promise.all([listWallets(), getWalletStats()]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Smart Wallets</h1>
          <p className="text-sm text-slate-400 mt-1">
            Embedded wallets with passkeys, social login, and programmable ownership
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Create Wallet
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Total Wallets</p>
            <Wallet className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.totalWallets}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Total Value</p>
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">${stats.totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Passkey Enabled</p>
            <Fingerprint className="w-5 h-5 text-violet-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.passkeyCount}</p>
          <p className="text-xs text-slate-500 mt-1">{Math.round((stats.passkeyCount / stats.totalWallets) * 100)}% of wallets</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Total Transactions</p>
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.totalTransactions.toLocaleString()}</p>
        </div>
      </div>

      {/* Wallets Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Your Wallets</h2>
          <p className="text-sm text-slate-400 mt-0.5">Smart contract, multisig, and EOA wallets across chains</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="text-left font-medium px-6 py-3">Name</th>
                <th className="text-left font-medium px-6 py-3">Address</th>
                <th className="text-left font-medium px-6 py-3">Chain</th>
                <th className="text-left font-medium px-6 py-3">Type</th>
                <th className="text-left font-medium px-6 py-3">Auth</th>
                <th className="text-left font-medium px-6 py-3">Balance</th>
                <th className="text-left font-medium px-6 py-3">Value</th>
                <th className="text-left font-medium px-6 py-3">Tx Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {wallets.map((w) => (
                <tr key={w.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{w.name}</p>
                    {w.threshold && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        <Users className="w-3 h-3 inline mr-1" />
                        {w.threshold}/{w.owners.length} signatures
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-300 font-mono text-xs">{w.address.slice(0, 10)}...{w.address.slice(-6)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs">
                      {w.chainName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <WalletTypeBadge type={w.type} />
                  </td>
                  <td className="px-6 py-4">
                    <AuthIcons methods={w.authMethods} />
                  </td>
                  <td className="px-6 py-4 text-white">
                    {w.balance} {w.chainId === "sol_mainnet" ? "SOL" : w.chainId === "xdc_mainnet" ? "XDC" : "ETH"}
                  </td>
                  <td className="px-6 py-4 text-emerald-400">${w.usdValue.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-300">{w.transactionCount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Passkey Promo */}
      <div className="bg-gradient-to-r from-violet-500/10 to-sky-500/10 border border-violet-500/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-violet-500/10 rounded-lg">
            <Key className="w-6 h-6 text-violet-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">Passkey-First Security</h3>
            <p className="text-sm text-slate-400 mt-1">
              All smart wallets support WebAuthn passkeys — no seed phrases, no phishing. 
              Your users authenticate with Face ID, Touch ID, or hardware security keys.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Shield className="w-4 h-4 text-emerald-400" />
                Phishing-resistant
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Fingerprint className="w-4 h-4 text-sky-400" />
                Biometric auth
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Users className="w-4 h-4 text-violet-400" />
                Social recovery
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
