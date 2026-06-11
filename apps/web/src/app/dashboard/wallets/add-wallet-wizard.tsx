"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { WizardEngine, useWizard } from "@/components/wizard-engine";
import { CheckCircle2, Plus, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { addWalletAction } from "./actions";

const PROVIDER_OPTIONS = [
  { value: "fireblocks", label: "Fireblocks" },
  { value: "privy", label: "Privy" },
  { value: "turnkey", label: "Turnkey" },
  { value: "local", label: "Local / Development" },
];

export function AddWalletWizard() {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<{ success: boolean; wallet?: { walletId: string; publicKey: string } } | null>(null);

  const close = () => {
    setIsOpen(false);
    setResult(null);
  };

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Add wallet
      </Button>
      <WizardEngine
        isOpen={isOpen}
        onClose={close}
        title="Add wallet"
        description="Connect a new custody provider wallet to your workspace."
        storageKey="add-wallet"
        allowSkipBack={true}
        steps={[
          {
            id: "details",
            label: "Details",
            component: <DetailsStep />,
          },
          {
            id: "configure",
            label: "Configure",
            component: <ConfigureStep />,
            hidden: false, // can be set dynamically based on draft
          },
          {
            id: "review",
            label: "Review",
            component: <ReviewStep />,
          },
          {
            id: "complete",
            label: "Complete",
            component: result ? <CompleteStep wallet={result.wallet} onClose={close} /> : <SubmitStep onResult={setResult} />,
          },
        ]}
        submitLabel="Add wallet"
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Details Step
// ─────────────────────────────────────────────────────────────────────────────

function DetailsStep() {
  const { draft, setDraftValue, setCanProceed } = useWizard();
  const label = (draft["label"] as string) || "";
  const provider = (draft["provider"] as string) || "fireblocks";

  useEffect(() => {
    setCanProceed(label.trim().length > 0 && provider.length > 0);
  }, [label, provider, setCanProceed]);

  return (
    <div className="space-y-4">
      <Input
        label="Wallet label"
        placeholder="e.g. Primary Custody"
        value={label}
        onChange={(e) => setDraftValue("label", e.target.value)}
        autoFocus
      />
      <Select
        label="Provider"
        options={PROVIDER_OPTIONS}
        value={provider}
        onChange={(e) => setDraftValue("provider", e.target.value)}
      />
      <p className="text-xs text-sdp-text-medium">
        The provider determines how transactions are signed and how keys are managed.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Configure Step
// ─────────────────────────────────────────────────────────────────────────────

function ConfigureStep() {
  const { draft, setDraftValue, setCanProceed } = useWizard();
  const requireApproval = (draft["requireApproval"] as boolean) || false;
  const dailyLimit = (draft["dailyLimit"] as string) || "";

  useEffect(() => {
    setCanProceed(true);
  }, [setCanProceed]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-sdp-border bg-sdp-bg p-4 space-y-3">
        <p className="text-sm font-medium text-sdp-text-high">Security settings</p>
        
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={requireApproval}
            onChange={(e) => setDraftValue("requireApproval", e.target.checked)}
            className="mt-0.5"
          />
          <div>
            <p className="text-sm font-medium text-sdp-text-high">Require multi-sig approval</p>
            <p className="text-xs text-sdp-text-medium">Transactions require additional signer approval</p>
          </div>
        </label>

        <Input
          label="Daily transaction limit (USD)"
          type="number"
          placeholder="100000"
          value={dailyLimit}
          onChange={(e) => setDraftValue("dailyLimit", e.target.value)}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Review Step
// ─────────────────────────────────────────────────────────────────────────────

function ReviewStep() {
  const { draft } = useWizard();
  const label = (draft["label"] as string) || "";
  const provider = (draft["provider"] as string) || "";
  const requireApproval = (draft["requireApproval"] as boolean) || false;
  const dailyLimit = (draft["dailyLimit"] as string) || "";

  const providerLabel = PROVIDER_OPTIONS.find((p) => p.value === provider)?.label || provider;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-sdp-border bg-sdp-bg p-4 space-y-2 text-sm">
        <ReviewRow label="Label" value={label} />
        <ReviewRow label="Provider" value={providerLabel} />
        <ReviewRow label="Multi-sig" value={requireApproval ? "Required" : "Not required"} />
        {dailyLimit && <ReviewRow label="Daily limit" value={`$${Number(dailyLimit).toLocaleString()}`} />}
      </div>
      <p className="text-xs text-sdp-text-medium">
        After creation, the wallet will be available for API key binding and transaction signing.
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

// ─────────────────────────────────────────────────────────────────────────────
// Submit Step (handles the actual form submission)
// ─────────────────────────────────────────────────────────────────────────────

function SubmitStep({ onResult }: { onResult: (result: { success: boolean; wallet?: { walletId: string; publicKey: string } }) => void }) {
  const { draft } = useWizard();
  const label = (draft["label"] as string) || "";
  const provider = (draft["provider"] as string) || "";

  return (
    <form
      action={async (formData) => {
        const result = await addWalletAction(formData);
        if (result.success && result.wallet) {
          onResult({ success: true, wallet: result.wallet });
        } else {
          onResult({ success: false });
        }
      }}
      className="space-y-4"
    >
      <input type="hidden" name="label" value={label} />
      <input type="hidden" name="provider" value={provider} />
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} isLoading={pending} className="w-full">
      {pending ? "Adding wallet..." : "Confirm and add wallet"}
    </Button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Complete Step
// ─────────────────────────────────────────────────────────────────────────────

function CompleteStep({
  wallet,
  onClose,
}: {
  wallet?: { walletId: string; publicKey: string };
  onClose: () => void;
}) {
  return (
    <div className="space-y-4 text-center">
      <div className="flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sdp-success-bg text-sdp-success-text">
          <CheckCircle2 className="h-6 w-6" />
        </div>
      </div>
      <h3 className="text-lg font-medium text-sdp-text-high">Wallet added successfully</h3>
      {wallet && (
        <div className="rounded-lg border border-sdp-border bg-sdp-bg p-3 text-sm text-left space-y-1">
          <p>
            <span className="text-sdp-text-medium">ID:</span>{" "}
            <span className="font-mono text-sdp-text-high">{wallet.walletId}</span>
          </p>
          <p>
            <span className="text-sdp-text-medium">Public key:</span>{" "}
            <span className="font-mono text-sdp-text-high">{wallet.publicKey}</span>
          </p>
        </div>
      )}
      <Button type="button" onClick={onClose}>
        Done
      </Button>
    </div>
  );
}
