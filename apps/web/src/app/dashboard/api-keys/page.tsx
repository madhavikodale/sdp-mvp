import { Button } from "@/components/ui/button";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-sdp-text-high">API Keys</h1>
          <p className="mt-1 text-sdp-text-medium">
            Create and manage API keys for your applications.
          </p>
        </div>
        <CreateApiKeyModal wallets={MOCK_WALLETS} />
      </div>

      {flash?.level === "error" && (
        <div className="rounded-lg border border-sdp-error-border bg-sdp-error-bg px-4 py-3 text-sm text-sdp-error-text">
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
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-sdp-bg text-sdp-text-medium">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Prefix</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium">Environment</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Last used</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sdp-border">
              {keys.map((key) => (
                <ApiKeyRow key={key.id} apiKey={key} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ApiKeyRow({ apiKey }: { apiKey: ApiKeyListItem }) {
  const isActive = apiKey.status === "active";

  return (
    <tr className="hover:bg-sdp-bg/50 transition-colors">
      <td className="px-4 py-3 font-medium text-sdp-text-high">{apiKey.name}</td>
      <td className="px-4 py-3 font-mono text-sdp-text-medium">{apiKey.keyPrefix}</td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-sdp-bg px-2 py-0.5 text-xs font-medium text-sdp-text-medium">
          <Shield className="h-3 w-3" />
          {apiKey.role}
        </span>
      </td>
      <td className="px-4 py-3 text-sdp-text-medium capitalize">{apiKey.environment}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            isActive
              ? "bg-sdp-success-bg text-sdp-success-text"
              : "bg-sdp-error-bg text-sdp-error-text"
          }`}
        >
          {isActive ? "Active" : "Deactivated"}
        </span>
      </td>
      <td className="px-4 py-3 text-sdp-text-medium">
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
    <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sdp-bg">
        <KeyRound className="h-6 w-6 text-sdp-text-medium" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-sdp-text-high">No API keys yet</h3>
      <p className="mt-1 max-w-sm text-sm text-sdp-text-medium">
        Create your first API key to start integrating with the platform.
      </p>
    </div>
  );
}
