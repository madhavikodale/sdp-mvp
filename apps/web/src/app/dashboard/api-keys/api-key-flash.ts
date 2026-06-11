/**
 * Flash-once secret state for API keys.
 * Server Action writes an httpOnly cookie; the client page reads it,
 * shows a toast/alert, and clears it.
 */

import { cookies } from "next/headers";

export const API_KEY_FLASH_COOKIE = "sdp_api_key_flash";
export const API_KEYS_PAGE_PATH = "/dashboard/api-keys";

export type ApiKeyFlashLevel = "success" | "error";

export interface ApiKeyFlash {
  level: ApiKeyFlashLevel;
  message: string;
  key?: string;
  apiKeyId?: string;
  keyPrefix?: string;
}

export async function getApiKeyFlash(): Promise<ApiKeyFlash | null> {
  const jar = await cookies();
  const raw = jar.get(API_KEY_FLASH_COOKIE)?.value;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as ApiKeyFlash;
    // Clear immediately after reading
    jar.delete(API_KEY_FLASH_COOKIE);
    return parsed;
  } catch {
    jar.delete(API_KEY_FLASH_COOKIE);
    return null;
  }
}

export async function setApiKeyFlash(flash: ApiKeyFlash) {
  const jar = await cookies();
  jar.set(API_KEY_FLASH_COOKIE, JSON.stringify(flash), {
    httpOnly: true,
    sameSite: "lax",
    path: API_KEYS_PAGE_PATH,
    maxAge: 60 * 5,
  });
}
