"use client";

import { useState } from "react";
import { GeneratedKeyModal } from "./generated-key-modal";

export function GeneratedKeyModalWrapper({
  name,
  secret,
  prefix,
}: {
  name: string;
  secret: string;
  prefix: string;
}) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <GeneratedKeyModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      apiKeyName={name}
      apiKeySecret={secret}
      keyPrefix={prefix}
    />
  );
}
