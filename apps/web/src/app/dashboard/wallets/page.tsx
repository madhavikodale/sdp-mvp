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
import { PageShell, StatCard, Section, TableShell, GridShell } from "@/components/page-shell";

function WalletTypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    eoa: "EOA",
    smart_contract: "Smart Contract",
    multisig: "Multisig",
  };
  const colors: Record<string, string> = {
    eoa: "bg-white/[0.06] text-white/70",
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
    seed: <Sprout className="w-3.5 h-3.5 text-white/50" />,
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

export const metadata = {
  title: "Wallets",
  description: "Manage custody wallets and signing keys",
};

export default async function WalletsPage() {
  const [wallets, stats] = await Promise.all([listWallets(), getWalletStats()]);

  return (
    <PageShell
      title="Smart Wallets"
      description="Embedded wallets with passkeys, social login, and programmable ownership"
      status="online"
      headerAction={
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-sdp-accent px-4 py-2 text-sm font-medium text-white shadow-lg shadow-sdp-accent/25 transition-all hover:brightness-110">
          <Plus className="w-4 h-4" />
          Create Wallet
        </button>
      }
    >
      {/* Stats */}
      <GridShell cols={4}>
        <StatCard
          label="Total Wallets"
          value={stats.totalWallets}
          icon={<Wallet className="w-5 h-5" />}
          accent="blue"
        />
        <StatCard
          label="Total Value"
          value={`$${stats.totalValue.toLocaleString()}`}
          icon={<Activity className="w-5 h-5" />}
          accent="emerald"
        />
        <StatCard
          label="Passkey Enabled"
          value={stats.passkeyCount}
          icon={<Fingerprint className="w-5 h-5" />}
          accent="violet"
        />
        <StatCard
          label="Transactions"
          value={stats.totalTransactions.toLocaleString()}
          icon={<Shield className="w-5 h-5" />}
          accent="amber"
        />
      </GridShell>

      {/* Wallets Table */}
      <Section title="Your Wallets">
        <TableShell>
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03]">
              <tr>
                <th className="text-left font-medium px-6 py-3 text-white/40">Name</th>
                <th className="text-left font-medium px-6 py-3 text-white/40">Address</th>
                <th className="text-left font-medium px-6 py-3 text-white/40">Chain</th>
                <th className="text-left font-medium px-6 py-3 text-white/40">Type</th>
                <th className="text-left font-medium px-6 py-3 text-white/40">Auth</th>
                <th className="text-left font-medium px-6 py-3 text-white/40">Balance</th>
                <th className="text-left font-medium px-6 py-3 text-white/40">Value</th>
                <th className="text-left font-medium px-6 py-3 text-white/40">Tx Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {wallets.map((w) => (
                <tr key={w.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{w.name}</p>
                    {w.threshold && (
                      <p className="text-xs text-white/40 mt-0.5">
                        <Users className="w-3 h-3 inline mr-1" />
                        {w.threshold}/{w.owners.length} signatures
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white/70 font-mono text-xs">{w.address.slice(0, 10)}...{w.address.slice(-6)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/[0.06] text-white/70 text-xs">
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
                  <td className="px-6 py-4 text-white/70">{w.transactionCount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      </Section>

      {/* Passkey Promo */}
      <div className="rounded-xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-sky-500/10 p-6 card-lift">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-violet-500/10 rounded-lg">
            <Key className="w-6 h-6 text-violet-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">Passkey-First Security</h3>
            <p className="text-sm text-white/50 mt-1">
              All smart wallets support WebAuthn passkeys — no seed phrases, no phishing.
              Your users authenticate with Face ID, Touch ID, or hardware security keys.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Shield className="w-4 h-4 text-emerald-400" />
                Phishing-resistant
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Fingerprint className="w-4 h-4 text-sky-400" />
                Biometric auth
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Users className="w-4 h-4 text-violet-400" />
                Social recovery
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
