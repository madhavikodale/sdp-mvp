import { Button } from "@/components/ui/button";
import { Coins, Snowflake, Flame, Activity, CheckCircle2, AlertCircle } from "lucide-react";
import { listTokens, freezeTokenAction, unfreezeTokenAction, mintTokenAction } from "./actions";
import { CreateTokenWizard } from "./create-token-wizard";
import type { TokenListItem, TokenStatus } from "@sdp-mvp/types";

export const metadata = {
  title: "Tokens",
  description: "Manage SPL tokens",
};

const MOCK_WALLETS = [
  { walletId: "w_001", label: "Primary Custody", publicKey: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", provider: "fireblocks", isDefault: true },
  { walletId: "w_002", label: "Secondary", publicKey: "GDfnQD6jjhpkjRQKoQVHMVgUzKvE5UfgEw4VGQPn1XYZ", provider: "privy", isDefault: false },
];

const STATUS_CONFIG: Record<TokenStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  draft: { label: "Draft", bg: "bg-white/10", text: "text-slate-400", icon: <AlertCircle className="h-3 w-3" /> },
  pending: { label: "Pending", bg: "bg-amber-500/20", text: "text-amber-400", icon: <Activity className="h-3 w-3" /> },
  active: { label: "Active", bg: "bg-emerald-500/20", text: "text-emerald-400", icon: <CheckCircle2 className="h-3 w-3" /> },
  frozen: { label: "Frozen", bg: "bg-blue-500/20", text: "text-blue-400", icon: <Snowflake className="h-3 w-3" /> },
  deprecated: { label: "Deprecated", bg: "bg-red-500/20", text: "text-red-400", icon: <AlertCircle className="h-3 w-3" /> },
};

export default async function TokensPage() {
  const tokens = await listTokens();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-sdp-text-high">Tokens</h1>
          <p className="mt-1 text-sdp-text-medium">
            Create and manage SPL tokens on Solana.
          </p>
        </div>
        <CreateTokenWizard wallets={MOCK_WALLETS} />
      </div>

      {tokens.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tokens.map((token) => (
            <TokenCard key={token.id} token={token} />
          ))}
        </div>
      )}
    </div>
  );
}

function TokenCard({ token }: { token: TokenListItem }) {
  const status = STATUS_CONFIG[token.status];
  const canFreeze = token.status === "active" && token.freezeAuthority;
  const canUnfreeze = token.status === "frozen";
  const canMint = token.status === "active" && token.mintAuthority;

  return (
    <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-5 space-y-4 transition-all hover:border-white/20">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sdp-bg text-sdp-text-high">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-sdp-text-high">{token.name}</h3>
            <p className="text-xs text-sdp-text-medium">{token.symbol} · {token.standard}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}>
          {status.icon}
          {status.label}
        </span>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-sdp-text-medium">Total supply</span>
          <span className="font-mono font-medium text-sdp-text-high">
            {formatSupply(token.totalSupply, token.decimals)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sdp-text-medium">Decimals</span>
          <span className="font-medium text-sdp-text-high">{token.decimals}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sdp-text-medium">Created</span>
          <span className="text-sdp-text-medium">{new Date(token.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        {canMint && (
          <form action={mintTokenAction} className="flex-1">
            <input type="hidden" name="tokenId" value={token.id} />
            <input type="hidden" name="amount" value="1000000" />
            <Button type="submit" variant="secondary" size="sm" className="w-full gap-1">
              <Flame className="h-3.5 w-3.5" />
              Mint
            </Button>
          </form>
        )}
        {canFreeze && (
          <form action={freezeTokenAction} className="flex-1">
            <input type="hidden" name="tokenId" value={token.id} />
            <Button type="submit" variant="secondary" size="sm" className="w-full gap-1">
              <Snowflake className="h-3.5 w-3.5" />
              Freeze
            </Button>
          </form>
        )}
        {canUnfreeze && (
          <form action={unfreezeTokenAction} className="flex-1">
            <input type="hidden" name="tokenId" value={token.id} />
            <Button type="submit" variant="secondary" size="sm" className="w-full gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Unfreeze
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sdp-bg">
        <Coins className="h-6 w-6 text-sdp-text-medium" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-sdp-text-high">No tokens yet</h3>
      <p className="mt-1 max-w-sm text-sm text-sdp-text-medium">
        Create your first SPL token to start issuing assets on Solana.
      </p>
    </div>
  );
}

function formatSupply(raw: string, decimals: number): string {
  try {
    const val = BigInt(raw);
    if (val === BigInt(0)) return "0";
    const div = BigInt(10 ** decimals);
    const whole = val / div;
    const frac = val % div;
    if (frac === BigInt(0)) return whole.toLocaleString();
    const fracStr = frac.toString().padStart(decimals, "0").replace(/0+$/, "");
    return `${whole.toLocaleString()}.${fracStr}`;
  } catch {
    return raw;
  }
}
