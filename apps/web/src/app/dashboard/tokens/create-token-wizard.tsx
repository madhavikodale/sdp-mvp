"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { WizardEngine, useWizard } from "@/components/wizard-engine";
import type { DashboardWallet } from "@sdp-mvp/types";
import { Coins, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { createTokenAction } from "./actions";

const STANDARD_OPTIONS = [
  { value: "spl", label: "SPL Token (Legacy)" },
  { value: "token-2022", label: "Token-2022 (Extensions)" },
];

const AUTHORITY_OPTIONS = [
  { value: "self", label: "Retain authority" },
  { value: "none", label: "Renounce authority" },
];

interface CreateTokenWizardProps {
  wallets: DashboardWallet[];
}

export function CreateTokenWizard({ wallets }: CreateTokenWizardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<{ success: boolean; signature?: string; error?: string } | null>(null);

  const close = () => {
    setIsOpen(false);
    setResult(null);
  };

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Create token
      </Button>
      <WizardEngine
        isOpen={isOpen}
        onClose={close}
        title="Create token"
        description="Issue a new SPL token on Solana."
        storageKey="create-token"
        allowSkipBack={true}
        steps={[
          {
            id: "basics",
            label: "Basics",
            component: <BasicsStep />,
          },
          {
            id: "supply",
            label: "Supply",
            component: <SupplyStep />,
          },
          {
            id: "authorities",
            label: "Authorities",
            component: <AuthoritiesStep wallets={wallets} />,
          },
          {
            id: "review",
            label: "Review",
            component: <ReviewStep wallets={wallets} />,
          },
          {
            id: "complete",
            label: "Complete",
            component: result ? (
              <CompleteStep result={result} onClose={close} />
            ) : (
              <SubmitStep onResult={setResult} />
            ),
          },
        ]}
        submitLabel="Create token"
      />
    </>
  );
}

// ─── Basics Step ───

function BasicsStep() {
  const { draft, setDraftValue, setCanProceed } = useWizard();
  const name = (draft["name"] as string) || "";
  const symbol = (draft["symbol"] as string) || "";
  const standard = (draft["standard"] as string) || "spl";

  useEffect(() => {
    const valid = name.trim().length >= 2 && symbol.trim().length >= 2 && symbol.trim().length <= 10;
    setCanProceed(valid);
  }, [name, symbol, setCanProceed]);

  return (
    <div className="space-y-4">
      <Input
        label="Token name"
        placeholder="e.g. Solana USD"
        value={name}
        onChange={(e) => setDraftValue("name", e.target.value)}
        autoFocus
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Symbol"
          placeholder="USDC"
          value={symbol}
          onChange={(e) => setDraftValue("symbol", e.target.value.toUpperCase())}
          maxLength={10}
        />
        <Select
          label="Standard"
          options={STANDARD_OPTIONS}
          value={standard}
          onChange={(e) => setDraftValue("standard", e.target.value)}
        />
      </div>
      <p className="text-xs text-sdp-text-medium">
        Token-2022 supports extensions like transfer fees, confidential transfers, and memo requirements.
      </p>
    </div>
  );
}

// ─── Supply Step ───

function SupplyStep() {
  const { draft, setDraftValue, setCanProceed } = useWizard();
  const initialSupply = (draft["initialSupply"] as string) || "";
  const decimals = (draft["decimals"] as string) || "9";

  useEffect(() => {
    const supply = BigInt(initialSupply || "0");
    const dec = Number(decimals);
    setCanProceed(supply >= BigInt(0) && dec >= 0 && dec <= 18);
  }, [initialSupply, decimals, setCanProceed]);

  return (
    <div className="space-y-4">
      <Input
        label="Initial supply"
        type="number"
        placeholder="1000000000"
        value={initialSupply}
        onChange={(e) => setDraftValue("initialSupply", e.target.value)}
        autoFocus
      />
      <Input
        label="Decimals"
        type="number"
        placeholder="9"
        value={decimals}
        onChange={(e) => setDraftValue("decimals", e.target.value)}
        min={0}
        max={18}
      />
      <div className="rounded-lg border border-sdp-border bg-sdp-bg p-3 text-xs text-sdp-text-medium space-y-1">
        <p><strong className="text-sdp-text-high">Total tokens:</strong> {initialSupply || "0"}</p>
        <p><strong className="text-sdp-text-high">Smallest unit:</strong> 1e-{decimals || "9"}</p>
      </div>
    </div>
  );
}

// ─── Authorities Step ───

function AuthoritiesStep({ wallets }: { wallets: DashboardWallet[] }) {
  const { draft, setDraftValue, setCanProceed } = useWizard();
  const mintAuthority = (draft["mintAuthority"] as string) || "self";
  const freezeAuthority = (draft["freezeAuthority"] as string) || "self";
  const walletId = (draft["walletId"] as string) || "";

  useEffect(() => {
    setCanProceed(!!walletId);
  }, [walletId, setCanProceed]);

  return (
    <div className="space-y-4">
      <Select
        label="Signing wallet"
        options={wallets.map((w) => ({ value: w.walletId, label: w.label || w.walletId }))}
        value={walletId}
        onChange={(e) => setDraftValue("walletId", e.target.value)}
      />

      <div className="rounded-lg border border-sdp-border bg-sdp-bg p-4 space-y-3">
        <p className="text-sm font-medium text-sdp-text-high">Authority configuration</p>
        <Select
          label="Mint authority"
          options={AUTHORITY_OPTIONS}
          value={mintAuthority}
          onChange={(e) => setDraftValue("mintAuthority", e.target.value)}
        />
        <Select
          label="Freeze authority"
          options={AUTHORITY_OPTIONS}
          value={freezeAuthority}
          onChange={(e) => setDraftValue("freezeAuthority", e.target.value)}
        />
      </div>

      <p className="text-xs text-sdp-text-medium">
        Renouncing authorities makes the token immutable. This cannot be undone.
      </p>
    </div>
  );
}

// ─── Review Step ───

function ReviewStep({ wallets }: { wallets: DashboardWallet[] }) {
  const { draft } = useWizard();
  const name = (draft["name"] as string) || "";
  const symbol = (draft["symbol"] as string) || "";
  const standard = (draft["standard"] as string) || "spl";
  const initialSupply = (draft["initialSupply"] as string) || "0";
  const decimals = (draft["decimals"] as string) || "9";
  const mintAuthority = (draft["mintAuthority"] as string) || "self";
  const freezeAuthority = (draft["freezeAuthority"] as string) || "self";
  const walletId = (draft["walletId"] as string) || "";

  const walletLabel = wallets.find((w) => w.walletId === walletId)?.label || walletId;
  const standardLabel = STANDARD_OPTIONS.find((s) => s.value === standard)?.label || standard;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-sdp-border bg-sdp-bg p-4 space-y-2 text-sm">
        <ReviewRow label="Name" value={name} />
        <ReviewRow label="Symbol" value={symbol} />
        <ReviewRow label="Standard" value={standardLabel} />
        <ReviewRow label="Initial supply" value={initialSupply} />
        <ReviewRow label="Decimals" value={decimals} />
        <ReviewRow label="Mint authority" value={mintAuthority === "self" ? "Retained" : "Renounced"} />
        <ReviewRow label="Freeze authority" value={freezeAuthority === "self" ? "Retained" : "Renounced"} />
        <ReviewRow label="Signing wallet" value={walletLabel} />
      </div>
      <p className="text-xs text-sdp-text-medium">
        Creating a token requires a small amount of SOL for rent exemption.
      </p>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-sdp-text-medium">{label}</span>
      <span className="font-medium text-sdp-text-high">{value}</span>
    </div>
  );
}

// ─── Submit Step ───

function SubmitStep({ onResult }: { onResult: (result: { success: boolean; signature?: string; error?: string }) => void }) {
  const { draft } = useWizard();

  return (
    <form
      action={async (formData) => {
        const result = await createTokenAction(formData);
        onResult(result);
      }}
      className="space-y-4"
    >
      <input type="hidden" name="name" value={String(draft["name"] || "")} />
      <input type="hidden" name="symbol" value={String(draft["symbol"] || "")} />
      <input type="hidden" name="decimals" value={String(draft["decimals"] || "9")} />
      <input type="hidden" name="standard" value={String(draft["standard"] || "spl")} />
      <input type="hidden" name="initialSupply" value={String(draft["initialSupply"] || "0")} />
      <input type="hidden" name="walletId" value={String(draft["walletId"] || "")} />
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} isLoading={pending} className="w-full">
      {pending ? "Creating token..." : "Confirm and create token"}
    </Button>
  );
}

// ─── Complete Step ───

function CompleteStep({
  result,
  onClose,
}: {
  result: { success: boolean; signature?: string; error?: string };
  onClose: () => void;
}) {
  return (
    <div className="space-y-4 text-center">
      <div className="flex justify-center">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            result.success ? "bg-sdp-success-bg text-sdp-success-text" : "bg-sdp-error-bg text-sdp-error-text"
          }`}
        >
          <Coins className="h-6 w-6" />
        </div>
      </div>
      <h3 className="text-lg font-medium text-sdp-text-high">
        {result.success ? "Token created" : "Creation failed"}
      </h3>
      {result.success && result.signature && (
        <div className="rounded-lg border border-sdp-border bg-sdp-bg p-3 text-sm text-left space-y-1">
          <p>
            <span className="text-sdp-text-medium">Signature:</span>{" "}
            <span className="font-mono text-sdp-text-high">{result.signature}</span>
          </p>
        </div>
      )}
      {!result.success && result.error && (
        <p className="text-sm text-sdp-error-text">{result.error}</p>
      )}
      <Button type="button" onClick={onClose}>
        {result.success ? "Done" : "Close"}
      </Button>
    </div>
  );
}
