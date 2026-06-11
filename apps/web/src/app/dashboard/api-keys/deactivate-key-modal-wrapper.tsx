"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DeactivateKeyModal } from "./deactivate-key-modal";

export function DeactivateKeyModalWrapper({ keyId, keyName }: { keyId: string; keyName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
        Deactivate
      </Button>
      <DeactivateKeyModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        keyId={keyId}
        keyName={keyName}
      />
    </>
  );
}
