import { PageShell, Section, TableShell } from "@/components/page-shell";
import { KeyRound, Shield, Clock, AlertCircle } from "lucide-react";
import { CreateApiKeyModal } from "./create-api-key-modal";
import { DeactivateKeyModalWrapper } from "./deactivate-key-modal-wrapper";
import { GeneratedKeyModalWrapper } from "./generated-key-modal-wrapper";
import { listApiKeys } from "./actions";
import { getApiKeyFlash } from "./api-key-flash";
import type { ApiKeyListItem } from "@sdp-mvp/types";

export const metadata = {
  title: "API Keys",
  description: "Manage API keys for your workspace",
};

const MOCK_WALLETS = [
  { walletId: "w_001", label: "Primary Custody", publicKey: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", provider: "fireblocks", isDefault: true },
  { walletId: "w_002", label: "Secondary", publicKey: "GDfnQD6jjhpkjRQKoQVHMVgUzKvE5UfgEw4VGQPn1XYZ", provider: "privy", isDefault: false },
];

export default async function ApiKeysPage() {
  const keys = await listApiKeys();
  const flash = await getApiKeyFlash();

  return (
    <PageShell
      title="API Keys"
      description="Create and manage API keys for your applications"
      status="online"
      headerAction={<CreateApiKeyModal wallets={MOCK_WALLETS} />}
    >
      {flash?.level === "error" && (
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {flash.message}
          </div>
        </div>
      )}

      {flash?.level === "success" && flash.key && (
        <GeneratedKeyModalWrapper
          name={flash.message}
          secret={flash.key}
          prefix={flash.keyPrefix || ""}
        />
      )}

      {keys.length === 0 ? (
        <EmptyState />
      ) : (
        <TableShell>
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03]">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-white/40">Name</th>
                <th className="px-4 py-3 text-left font-medium text-white/40">Prefix</th>
                <th className="px-4 py-3 text-left font-medium text-white/40">Role</th>
                <th className="px-4 py-3 text-left font-medium text-white/40">Environment</th>
                <th className="px-4 py-3 text-left font-medium text-white/40">Status</th>
                <th className="px-4 py-3 text-left font-medium text-white/40">Last used</th>
                <th className="px-4 py-3 text-right font-medium text-white/40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {keys.map((key) => (
                <ApiKeyRow key={key.id} apiKey={key} />
              ))}
            </tbody>
          </table>
        </TableShell>
      )}
    </PageShell>
  );
}

function ApiKeyRow({ apiKey }: { apiKey: ApiKeyListItem }) {
  const isActive = apiKey.status === "active";

  return (
    <tr className="hover:bg-white/[0.03] transition-colors">
      <td className="px-4 py-3 font-medium text-white">{apiKey.name}</td>
      <td className="px-4 py-3 font-mono text-white/70">{apiKey.keyPrefix}</td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-xs font-medium text-white/70">
          <Shield className="h-3 w-3" />
          {apiKey.role}
        </span>
      </td>
      <td className="px-4 py-3 text-white/70 capitalize">{apiKey.environment}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            isActive
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-rose-500/20 text-rose-400"
          }`}
        >
          {isActive ? "Active" : "Deactivated"}
        </span>
      </td>
      <td className="px-4 py-3 text-white/70">
        {apiKey.lastUsedAt ? (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(apiKey.lastUsedAt).toLocaleDateString()}
          </span>
        ) : (
          "Never"
        )}
      </td>
      <td className="px-4 py-3 text-right">
        {isActive && (
          <DeactivateKeyModalWrapper keyId={apiKey.id} keyName={apiKey.name} />
        )}
      </td>
    </tr>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] py-16 text-center card-lift">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06]">
        <KeyRound className="h-6 w-6 text-white/50" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-white">No API keys yet</h3>
      <p className="mt-1 max-w-sm text-sm text-white/50">
        Create your first API key to start integrating with the platform.
      </p>
    </div>
  );
}
