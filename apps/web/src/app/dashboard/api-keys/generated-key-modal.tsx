"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface GeneratedKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeyName: string;
  apiKeySecret: string;
  keyPrefix: string;
}

export function GeneratedKeyModal({
  isOpen,
  onClose,
  apiKeyName,
  apiKeySecret,
  keyPrefix,
}: GeneratedKeyModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKeySecret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="API key created"
      description={`Save this key now. You will not be able to see it again. Key: ${apiKeyName}`}
      size="lg"
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-sdp-border bg-sdp-bg p-4">
          <div className="flex items-start justify-between gap-3">
            <code className="break-all text-sm font-mono text-sdp-text-high">
              {apiKeySecret}
            </code>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              className="shrink-0 gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-sdp-success-border bg-sdp-success-bg px-4 py-3 text-sm text-sdp-success-text">
          <p className="font-medium">This is the only time this key will be displayed.</p>
          <p className="mt-1 text-sdp-text-medium">
            Store it somewhere secure, like a password manager or secrets vault.
          </p>
        </div>

        <div className="text-sm text-sdp-text-medium">
          <p>
            <span className="font-medium text-sdp-text-high">Prefix:</span> {keyPrefix}
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="button" onClick={onClose}>
            I&apos;ve saved my key
          </Button>
        </div>
      </div>
    </Modal>
  );
}
