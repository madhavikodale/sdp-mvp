"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ApiKeyListItem, CreateApiKeyResult, ApiKeyEnvironment } from "@sdp-mvp/types";
import {
  API_KEYS_PAGE_PATH,
  setApiKeyFlash,
  type ApiKeyFlash,
} from "./api-key-flash";

// In-memory mock store (replace with real DB/API)
const mockApiKeys: ApiKeyListItem[] = [
  {
    id: "key_001",
    name: "Production API Key",
    description: "Used by production backend",
    keyPrefix: "pk_live_abc",
    role: "api_admin",
    environment: "production",
    status: "active",
    lastUsedAt: new Date(Date.now() - 86400000).toISOString(),
    expiresAt: null,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "key_002",
    name: "Sandbox Test Key",
    description: "Local development",
    keyPrefix: "pk_test_xyz",
    role: "api_developer",
    environment: "sandbox",
    status: "active",
    lastUsedAt: null,
    expiresAt: null,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export async function listApiKeys(): Promise<ApiKeyListItem[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  return [...mockApiKeys];
}

export async function createApiKeyAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "api_developer");
  const walletScope = String(formData.get("walletScope") ?? "").trim();
  const defaultWalletId = String(formData.get("signingWalletId") ?? "").trim();
  const signingWalletIds = formData
    .getAll("signingWalletIds")
    .map((value) => String(value).trim())
    .filter(Boolean);
  const expiresAtRaw = String(formData.get("expiresAt") ?? "").trim();

  if (!name) {
    await setApiKeyFlash({ level: "error", message: "API key name is required." });
    redirect(API_KEYS_PAGE_PATH);
  }

  if (walletScope !== "all" && walletScope !== "selected") {
    await setApiKeyFlash({
      level: "error",
      message: "Choose whether this key can access all wallets or selected wallets.",
    });
    redirect(API_KEYS_PAGE_PATH);
  }

  if (walletScope === "selected" && signingWalletIds.length === 0) {
    await setApiKeyFlash({
      level: "error",
      message: "Select at least one wallet for a wallet-scoped API key.",
    });
    redirect(API_KEYS_PAGE_PATH);
  }

  const validRole =
    role === "api_admin" || role === "api_readonly" || role === "api_developer"
      ? role
      : "api_developer";

  const environment: ApiKeyEnvironment = "sandbox";
  const prefix = "pk_test_";
  const randomSuffix = Math.random().toString(36).slice(2, 10);

  const newKey: CreateApiKeyResult = {
    id: `key_${Math.random().toString(36).slice(2)}`,
    name,
    key: `${prefix}${randomSuffix}_full_secret_key_show_once`,
    keyPrefix: `${prefix}${randomSuffix}`,
    role: validRole,
    environment,
    expiresAt: expiresAtRaw ? new Date(expiresAtRaw).toISOString() : null,
    createdAt: new Date().toISOString(),
  };

  mockApiKeys.unshift({
    id: newKey.id,
    name: newKey.name,
    description: null,
    keyPrefix: newKey.keyPrefix,
    role: newKey.role,
    environment: newKey.environment,
    status: "active",
    lastUsedAt: null,
    expiresAt: newKey.expiresAt,
    createdAt: newKey.createdAt,
  });

  await setApiKeyFlash({
    level: "success",
    message: `API key "${newKey.name}" created. Save it now; it will not be shown again.`,
    key: newKey.key,
    apiKeyId: newKey.id,
    keyPrefix: newKey.keyPrefix,
  });

  revalidatePath(API_KEYS_PAGE_PATH, "page");
  redirect(API_KEYS_PAGE_PATH);
}

export async function deactivateApiKeyAction(formData: FormData) {
  const keyId = String(formData.get("keyId") ?? "").trim();
  const keyName = String(formData.get("keyName") ?? "").trim();
  const confirmation = String(formData.get("confirmation") ?? "").trim();

  let flash: ApiKeyFlash;

  if (!keyId || !keyName || confirmation !== keyName) {
    flash = {
      level: "error",
      message: !keyId
        ? "Missing API key ID."
        : confirmation !== keyName
        ? "Confirmation did not match the key name."
        : "Missing confirmation.",
    };
  } else {
    const index = mockApiKeys.findIndex((k) => k.id === keyId);
    if (index === -1) {
      flash = { level: "error", message: "API key not found." };
    } else {
      mockApiKeys[index] = { ...mockApiKeys[index], status: "deactivated" };
      flash = {
        level: "success",
        message: `API key "${keyName}" has been deactivated.`,
      };
    }
  }

  await setApiKeyFlash(flash);
  revalidatePath(API_KEYS_PAGE_PATH, "page");
  redirect(API_KEYS_PAGE_PATH);
}
