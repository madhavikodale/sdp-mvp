"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { useZodForm } from "@/lib/use-zod-form";
import type { DashboardWallet } from "@sdp-mvp/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { z } from "zod";
import { createApiKeyAction } from "./actions";

const createApiKeySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  role: z.enum(["api_admin", "api_developer", "api_readonly"]),
  walletScope: z.enum(["all", "selected"]),
  expiresAt: z.string().optional(),
});

type CreateApiKeyForm = z.infer<typeof createApiKeySchema>;

const ROLE_OPTIONS = [
  { value: "api_admin", label: "Admin — Full access" },
  { value: "api_developer", label: "Developer — Standard access" },
  { value: "api_readonly", label: "Read only — View only" },
];

interface CreateApiKeyModalProps {
  wallets: DashboardWallet[];
}

export function CreateApiKeyModal({ wallets }: CreateApiKeyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedWalletIds, setSelectedWalletIds] = useState<string[]>([]);
  const [defaultWalletId, setDefaultWalletId] = useState<string>("");

  const form = useZodForm(createApiKeySchema, {
    name: "",
    role: "api_developer",
    walletScope: "all",
    expiresAt: "",
  });

  const walletScope = form.values.walletScope;

  const selectedWallets = wallets.filter((w) => selectedWalletIds.includes(w.walletId));
  const canContinue =
    form.values.name.trim().length > 0 &&
    (walletScope === "all" || selectedWalletIds.length > 0);

  const close = () => {
    setIsOpen(false);
    setStep(1);
    form.reset();
    setSelectedWalletIds([]);
    setDefaultWalletId("");
  };

  const nextStep = () => {
    if (!canContinue) return;
    setStep(2);
  };

  const toggleWallet = (walletId: string) => {
    setSelectedWalletIds((prev) => {
      const alreadySelected = prev.includes(walletId);
      const next = alreadySelected ? prev.filter((id) => id !== walletId) : [...prev, walletId];
      setDefaultWalletId((current) => {
        if (next.includes(current)) return current;
        return next[0] ?? "";
      });
      return next;
    });
  };

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Create API key
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={close}
        title={step === 1 ? "Create API key" : "Review API key"}
        description={
          step === 1
            ? "Define key details and wallet access, then confirm."
            : "Review and confirm the request."
        }
        size="lg"
      >
        {step === 1 ? (
          <DetailsStep
            form={form}
            wallets={wallets}
            selectedWalletIds={selectedWalletIds}
            defaultWalletId={defaultWalletId}
            onToggleWallet={toggleWallet}
            onDefaultChange={setDefaultWalletId}
            onCancel={close}
            onContinue={nextStep}
            canContinue={canContinue}
          />
        ) : (
          <ReviewStep
            form={form}
            selectedWallets={selectedWallets}
            defaultWalletId={defaultWalletId}
            onBack={() => setStep(1)}
            onClose={close}
          />
        )}
      </Modal>
    </>
  );
}

function DetailsStep({
  form,
  wallets,
  selectedWalletIds,
  defaultWalletId,
  onToggleWallet,
  onDefaultChange,
  onCancel,
  onContinue,
  canContinue,
}: {
  form: ReturnType<typeof useZodForm<typeof createApiKeySchema>>;
  wallets: DashboardWallet[];
  selectedWalletIds: string[];
  defaultWalletId: string;
  onToggleWallet: (id: string) => void;
  onDefaultChange: (id: string) => void;
  onCancel: () => void;
  onContinue: () => void;
  canContinue: boolean;
}) {
  const selectedWallets = wallets.filter((w) => selectedWalletIds.includes(w.walletId));
  return (
    <div className="space-y-5">
      <Input
        label="Name"
        placeholder="Production backend key"
        value={form.values.name}
        onChange={(e) => form.setField("name", e.target.value)}
        error={form.errors.name}
      />

      <Select
        label="Role"
        options={ROLE_OPTIONS}
        value={form.values.role}
        onChange={(e) => form.setField("role", e.target.value as "api_admin" | "api_developer" | "api_readonly")}
      />

      <Input
        label="Expiration (optional)"
        type="datetime-local"
        value={form.values.expiresAt}
        onChange={(e) => form.setField("expiresAt", e.target.value)}
      />

      <div className="space-y-3">
        <p className="text-sm font-medium text-sdp-text-high">Wallet access</p>
        <label className="flex items-start gap-3 rounded-lg border border-sdp-border p-3 cursor-pointer hover:bg-sdp-bg transition-colors">
          <input
            type="radio"
            name="wallet-access"
            value="all"
            checked={form.values.walletScope === "all"}
            onChange={() => form.setField("walletScope", "all")}
            className="mt-1"
          />
          <div>
            <p className="text-sm font-medium text-sdp-text-high">All wallets</p>
            <p className="text-xs text-sdp-text-medium">This key can use every wallet available.</p>
          </div>
        </label>

        <label className="flex items-start gap-3 rounded-lg border border-sdp-border p-3 cursor-pointer hover:bg-sdp-bg transition-colors">
          <input
            type="radio"
            name="wallet-access"
            value="selected"
            checked={form.values.walletScope === "selected"}
            onChange={() => form.setField("walletScope", "selected")}
            className="mt-1"
          />
          <div>
            <p className="text-sm font-medium text-sdp-text-high">Selected wallets</p>
            <p className="text-xs text-sdp-text-medium">Restrict this key to specific wallets.</p>
          </div>
        </label>
      </div>

      {form.values.walletScope === "selected" && (
        <div className="rounded-lg border border-sdp-border bg-sdp-bg p-3 space-y-3">
          {wallets.length === 0 ? (
            <p className="text-sm text-sdp-text-medium">No active wallets available for binding.</p>
          ) : (
            <>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {wallets.map((wallet) => {
                  const checked = selectedWalletIds.includes(wallet.walletId);
                  return (
                    <label
                      key={wallet.walletId}
                      className="flex items-start gap-3 rounded-lg border border-sdp-border bg-white px-3 py-2 cursor-pointer hover:border-sdp-text-medium transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleWallet(wallet.walletId)}
                        className="mt-0.5"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-sdp-text-high truncate">
                          {wallet.label || wallet.walletId}
                        </p>
                        <p className="text-xs text-sdp-text-medium truncate">
                          {wallet.walletId} · {truncateAddress(wallet.publicKey)}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {selectedWalletIds.length > 1 && (
                <Select
                  label="Default signing wallet"
                  options={selectedWallets.map((w) => ({
                    value: w.walletId,
                    label: w.label || w.walletId,
                  }))}
                  value={defaultWalletId}
                  onChange={(e) => onDefaultChange(e.target.value)}
                />
              )}
            </>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="button" disabled={!canContinue} onClick={onContinue}>Continue</Button>
      </div>
    </div>
  );
}

function ReviewStep({
  form,
  selectedWallets,
  defaultWalletId,
  onBack,
  onClose,
}: {
  form: ReturnType<typeof useZodForm<typeof createApiKeySchema>>;
  selectedWallets: DashboardWallet[];
  defaultWalletId: string;
  onBack: () => void;
  onClose: () => void;
}) {
  const defaultWallet = selectedWallets.find((w) => w.walletId === defaultWalletId) || selectedWallets[0];

  return (
    <form action={createApiKeyAction} className="space-y-4">
      <input type="hidden" name="name" value={form.values.name} />
      <input type="hidden" name="role" value={form.values.role} />
      <input type="hidden" name="walletScope" value={form.values.walletScope} />
      <input type="hidden" name="expiresAt" value={form.values.expiresAt || ""} />

      {form.values.walletScope === "selected" &&
        selectedWallets.map((w) => (
          <input key={w.walletId} type="hidden" name="signingWalletIds" value={w.walletId} />
        ))}

      {form.values.walletScope === "selected" && defaultWalletId && (
        <input type="hidden" name="signingWalletId" value={defaultWalletId} />
      )}

      <div className="rounded-lg border border-sdp-border bg-sdp-bg p-4 space-y-2 text-sm">
        <ReviewRow label="Name" value={form.values.name} />
        <ReviewRow
          label="Role"
          value={ROLE_OPTIONS.find((r) => r.value === form.values.role)?.label || form.values.role}
        />
        <ReviewRow
          label="Environment"
          value="Sandbox"
        />
        <ReviewRow
          label="Expires"
          value={form.values.expiresAt ? new Date(form.values.expiresAt).toLocaleString() : "Never"}
        />
        <ReviewRow
          label="Wallet access"
          value={form.values.walletScope === "all" ? "All wallets" : "Selected wallets"}
        />

        {form.values.walletScope === "selected" && (
          <>
            <ReviewRow
              label="Selected wallets"
              value={selectedWallets.map((w) => w.label || w.walletId).join(", ")}
            />
            <ReviewRow
              label="Default signing wallet"
              value={defaultWallet ? defaultWallet.label || defaultWallet.walletId : "None"}
            />
          </>
        )}
      </div>

      <p className="text-xs text-sdp-text-medium">
        After creation, the full key will be shown once in a secure modal.
      </p>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onBack}>Back</Button>
        <SubmitButton onSuccess={onClose} />
      </div>
    </form>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-sdp-text-medium">{label}</span>
      <span className="font-medium text-sdp-text-high text-right">{value}</span>
    </div>
  );
}

function SubmitButton({ onSuccess }: { onSuccess: () => void }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} onClick={pending ? undefined : onSuccess}>
      {pending ? "Creating..." : "Create key"}
    </Button>
  );
}

function truncateAddress(value: string): string {
  if (value.length <= 14) return value;
  return `${value.slice(0, 6)}...${value.slice(-6)}`;
}
