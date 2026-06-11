"use server";

import { revalidatePath } from "next/cache";
import type { TokenActionResult, TokenListItem, TokenStatus } from "@sdp-mvp/types";

const TOKENS_PAGE_PATH = "/dashboard/tokens";

const mockTokens: TokenListItem[] = [
  {
    id: "tok_001",
    name: "USDC Test",
    symbol: "USDC",
    decimals: 6,
    standard: "spl",
    status: "active",
    totalSupply: "1000000000000",
    mintAuthority: "self",
    freezeAuthority: "self",
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "tok_002",
    name: "Reward Points",
    symbol: "RWD",
    decimals: 0,
    standard: "token-2022",
    status: "active",
    totalSupply: "1000000",
    mintAuthority: "self",
    freezeAuthority: null,
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "tok_003",
    name: "Governance Token",
    symbol: "GOV",
    decimals: 9,
    standard: "spl",
    status: "frozen",
    totalSupply: "500000000",
    mintAuthority: null,
    freezeAuthority: "self",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
];

export async function listTokens(): Promise<TokenListItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return [...mockTokens];
}

export async function createTokenAction(formData: FormData): Promise<TokenActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const symbol = String(formData.get("symbol") ?? "").trim().toUpperCase();
  const decimals = Number(formData.get("decimals") ?? "9");
  const standard = String(formData.get("standard") ?? "spl") as "spl" | "token-2022";
  const initialSupply = String(formData.get("initialSupply") ?? "0");
  const walletId = String(formData.get("walletId") ?? "").trim();

  if (!name || !symbol || !walletId) {
    return { success: false, error: "Name, symbol, and wallet are required." };
  }

  if (symbol.length < 2 || symbol.length > 10) {
    return { success: false, error: "Symbol must be 2-10 characters." };
  }

  const newToken: TokenListItem = {
    id: `tok_${Math.random().toString(36).slice(2)}`,
    name,
    symbol,
    decimals,
    standard,
    status: "active",
    totalSupply: initialSupply,
    mintAuthority: "self",
    freezeAuthority: "self",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockTokens.unshift(newToken);
  revalidatePath(TOKENS_PAGE_PATH, "page");
  return { success: true, signature: `sig_${Math.random().toString(36).slice(2)}` };
}

export async function mintTokenAction(formData: FormData): Promise<void> {
  const tokenId = String(formData.get("tokenId") ?? "").trim();
  const amount = String(formData.get("amount") ?? "0").trim();
  const index = mockTokens.findIndex((t) => t.id === tokenId);
  if (index === -1) return;

  const current = BigInt(mockTokens[index].totalSupply);
  const add = BigInt(amount);
  mockTokens[index] = {
    ...mockTokens[index],
    totalSupply: (current + add).toString(),
    updatedAt: new Date().toISOString(),
  };
  revalidatePath(TOKENS_PAGE_PATH, "page");
}

export async function freezeTokenAction(formData: FormData): Promise<void> {
  const tokenId = String(formData.get("tokenId") ?? "").trim();
  const index = mockTokens.findIndex((t) => t.id === tokenId);
  if (index === -1) return;

  mockTokens[index] = { ...mockTokens[index], status: "frozen" as TokenStatus, updatedAt: new Date().toISOString() };
  revalidatePath(TOKENS_PAGE_PATH, "page");
}

export async function unfreezeTokenAction(formData: FormData): Promise<void> {
  const tokenId = String(formData.get("tokenId") ?? "").trim();
  const index = mockTokens.findIndex((t) => t.id === tokenId);
  if (index === -1) return;

  mockTokens[index] = { ...mockTokens[index], status: "active" as TokenStatus, updatedAt: new Date().toISOString() };
  revalidatePath(TOKENS_PAGE_PATH, "page");
}
