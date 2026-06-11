"use server";

import type { PaymasterConfig, GaslessTransaction } from "@sdp-mvp/types";

const MOCK_PAYMASTERS: PaymasterConfig[] = [
  {
    id: "pm_sol_1",
    name: "Solana DApp Sponsor",
    chainId: "sol_mainnet",
    chainName: "Solana",
    status: "active",
    sponsorshipType: "app",
    budget: { total: 5000, used: 2340.5, currency: "SOL" },
    limits: { maxPerTransaction: 0.01, maxPerUser: 0.5, maxPerDay: 100 },
    allowedContracts: ["JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4", "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"],
    allowedMethods: ["swap", "route", "stake"],
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-06-10T14:30:00Z",
  },
  {
    id: "pm_base_1",
    name: "Base Onboarding Fund",
    chainId: "base_mainnet",
    chainName: "Base",
    status: "active",
    sponsorshipType: "user",
    budget: { total: 25000, used: 18750, currency: "ETH" },
    limits: { maxPerTransaction: 0.001, maxPerUser: 0.01, maxPerDay: 50 },
    allowedContracts: ["0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", "0x4200000000000000000000000000000000000006"],
    allowedMethods: ["transfer", "approve", "mint"],
    createdAt: "2026-04-20T08:00:00Z",
    updatedAt: "2026-06-11T09:00:00Z",
  },
  {
    id: "pm_xdc_1",
    name: "XDC Trade Finance Sponsor",
    chainId: "xdc_mainnet",
    chainName: "XDC Network",
    status: "active",
    sponsorshipType: "hybrid",
    budget: { total: 100000, used: 45600, currency: "XDC" },
    limits: { maxPerTransaction: 10, maxPerUser: 100, maxPerDay: 500 },
    allowedContracts: ["xdc0000000000000000000000000000000000000000", "xdc1111111111111111111111111111111111111111"],
    allowedMethods: ["issueLC", "approveLC", "transferRWA"],
    createdAt: "2026-03-10T12:00:00Z",
    updatedAt: "2026-06-09T16:45:00Z",
  },
  {
    id: "pm_eth_1",
    name: "Ethereum Enterprise Pool",
    chainId: "eth_mainnet",
    chainName: "Ethereum",
    status: "paused",
    sponsorshipType: "app",
    budget: { total: 100, used: 89.2, currency: "ETH" },
    limits: { maxPerTransaction: 0.01, maxPerUser: 0.1, maxPerDay: 20 },
    allowedContracts: ["0xA0b86a33E6441E6C7D3D4B4f6c7E8f9a0B1c2D3e", "0xB1c2D3e4F5a6B7c8D9e0F1a2B3c4D5e6F7a8B9c0"],
    allowedMethods: ["execute", "propose", "vote"],
    createdAt: "2026-02-01T09:00:00Z",
    updatedAt: "2026-06-01T11:00:00Z",
  },
];

const MOCK_TRANSACTIONS: GaslessTransaction[] = [
  {
    id: "tx_1",
    paymasterId: "pm_sol_1",
    userAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    targetContract: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
    method: "swap",
    gasUsed: 45000,
    gasCost: 0.00045,
    status: "success",
    txHash: "5xK...9mN2",
    sponsoredAt: "2026-06-11T10:05:00Z",
  },
  {
    id: "tx_2",
    paymasterId: "pm_base_1",
    userAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    targetContract: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    method: "transfer",
    gasUsed: 21000,
    gasCost: 0.000021,
    status: "success",
    txHash: "0xabc...def",
    sponsoredAt: "2026-06-11T10:02:00Z",
  },
  {
    id: "tx_3",
    paymasterId: "pm_xdc_1",
    userAddress: "xdcA0b86a33E6441E6C7D3D4B4f6c7E8f9a0B1c2D3e",
    targetContract: "xdc0000000000000000000000000000000000000000",
    method: "issueLC",
    gasUsed: 120000,
    gasCost: 0.12,
    status: "pending",
    sponsoredAt: "2026-06-11T10:10:00Z",
  },
  {
    id: "tx_4",
    paymasterId: "pm_sol_1",
    userAddress: "8yLYuh2DW98e08UYKTEqcE6jCluFTrB94UAvKpthBtvV",
    targetContract: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
    method: "route",
    gasUsed: 68000,
    gasCost: 0.00068,
    status: "failed",
    sponsoredAt: "2026-06-11T09:55:00Z",
  },
  {
    id: "tx_5",
    paymasterId: "pm_base_1",
    userAddress: "0x82D8767FD8ab99B098efGc852C851C2C6g7E9080",
    targetContract: "0x4200000000000000000000000000000000000006",
    method: "approve",
    gasUsed: 46000,
    gasCost: 0.000046,
    status: "success",
    txHash: "0x123...456",
    sponsoredAt: "2026-06-11T09:50:00Z",
  },
];

export async function listPaymasters(): Promise<PaymasterConfig[]> {
  return MOCK_PAYMASTERS;
}

export async function listTransactions(): Promise<GaslessTransaction[]> {
  return MOCK_TRANSACTIONS;
}

export async function getPaymasterStats() {
  const totalBudget = MOCK_PAYMASTERS.reduce((s, p) => s + p.budget.total, 0);
  const totalUsed = MOCK_PAYMASTERS.reduce((s, p) => s + p.budget.used, 0);
  const activeCount = MOCK_PAYMASTERS.filter((p) => p.status === "active").length;
  const txCount = MOCK_TRANSACTIONS.length;
  const successCount = MOCK_TRANSACTIONS.filter((t) => t.status === "success").length;

  return {
    totalBudget,
    totalUsed,
    utilizationRate: Math.round((totalUsed / totalBudget) * 100),
    activePaymasters: activeCount,
    totalPaymasters: MOCK_PAYMASTERS.length,
    totalTransactions: txCount,
    successRate: txCount > 0 ? Math.round((successCount / txCount) * 100) : 0,
    totalGasSponsored: MOCK_TRANSACTIONS.reduce((s, t) => s + t.gasCost, 0),
  };
}
