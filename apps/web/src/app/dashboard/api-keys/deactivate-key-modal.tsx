"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { deactivateApiKeyAction } from "./actions";

interface DeactivateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  keyId: string;
  keyName: string;
}

export function DeactivateKeyModal({ isOpen, onClose, keyId, keyName }: DeactivateKeyModalProps) {
  const [confirmation, setConfirmation] = useState("");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Deactivate API key"
      description="This key will no longer be able to access the API. This action cannot be undone."
      size="md"
    >
      <form action={deactivateApiKeyAction} className="space-y-4">
        <input type="hidden" name="keyId" value={keyId} />
        <input type="hidden" name="keyName" value={keyName} />

        <div className="rounded-lg border border-sdp-error-border bg-sdp-error-bg px-4 py-3 text-sm text-sdp-error-text">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-medium">You are about to deactivate:</p>
              <p className="mt-1">{keyName}</p>
            </div>
          </div>
        </div>

        <Input
          label={`Type "${keyName}" to confirm`}
          name="confirmation"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          placeholder={keyName}
          autoComplete="off"
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <SubmitButton disabled={confirmation !== keyName} />
        </div>
      </form>
    </Modal>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="danger" disabled={disabled || pending}>
      {pending ? "Deactivating..." : "Deactivate key"}
    </Button>
  );
}
