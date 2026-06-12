"use server";

import type { ChainAccelerationConfig, AcceleratedTransaction, RelayNode } from "@sdp-mvp/types";

const MOCK_CONFIGS: ChainAccelerationConfig[] = [
  {
    id: "acc_eth",
    chainId: "eth_mainnet",
    chainName: "Ethereum",
    enabled: true,
    strategies: ["priority_fee", "private_tx", "bundle"],
    avgSpeedupPercent: 68,
    totalTxAccelerated: 12453,
    totalTimeSavedMs: 892000,
    relayNodes: 12,
    priorityFeeMultiplier: 2.5,
  },
  {
    id: "acc_base",
    chainId: "base_mainnet",
    chainName: "Base",
    enabled: true,
    strategies: ["priority_fee", "relay"],
    avgSpeedupPercent: 45,
    totalTxAccelerated: 8934,
    totalTimeSavedMs: 312000,
    relayNodes: 8,
    priorityFeeMultiplier: 1.8,
  },
  {
    id: "acc_arb",
    chainId: "arb_mainnet",
    chainName: "Arbitrum",
    enabled: true,
    strategies: ["priority_fee", "bundle", "relay"],
    avgSpeedupPercent: 52,
    totalTxAccelerated: 6789,
    totalTimeSavedMs: 445000,
    relayNodes: 6,
    priorityFeeMultiplier: 2.0,
  },
  {
    id: "acc_sol",
    chainId: "sol_mainnet",
    chainName: "Solana",
    enabled: true,
    strategies: ["priority_fee", "relay"],
    avgSpeedupPercent: 78,
    totalTxAccelerated: 23456,
    totalTimeSavedMs: 1200000,
    relayNodes: 15,
    priorityFeeMultiplier: 3.0,
  },
];

const MOCK_TRANSACTIONS: AcceleratedTransaction[] = [
  {
    id: "tx_1",
    chainId: "eth_mainnet",
    chainName: "Ethereum",
    txHash: "0x3a7f...e9d2",
    status: "confirmed",
    originalEtaMs: 12000,
    actualTimeMs: 3200,
    timeSavedMs: 8800,
    strategy: "bundle",
    priorityFeeGwei: 45,
    relayNode: "us-east-1",
    createdAt: "2026-06-12T10:35:00Z",
    confirmedAt: "2026-06-12T10:35:03Z",
  },
  {
    id: "tx_2",
    chainId: "sol_mainnet",
    chainName: "Solana",
    txHash: "0x8b4c...f1a9",
    status: "confirmed",
    originalEtaMs: 800,
    actualTimeMs: 180,
    timeSavedMs: 620,
    strategy: "priority_fee",
    priorityFeeGwei: 0.0001,
    relayNode: "eu-west-1",
    createdAt: "2026-06-12T10:34:00Z",
    confirmedAt: "2026-06-12T10:34:00Z",
  },
  {
    id: "tx_3",
    chainId: "base_mainnet",
    chainName: "Base",
    txHash: "0x2d5e...c3b8",
    status: "accelerating",
    originalEtaMs: 2000,
    actualTimeMs: 0,
    timeSavedMs: 0,
    strategy: "relay",
    priorityFeeGwei: 0.5,
    relayNode: "ap-south-1",
    createdAt: "2026-06-12T10:36:00Z",
  },
  {
    id: "tx_4",
    chainId: "arb_mainnet",
    chainName: "Arbitrum",
    txHash: "0x6c1b...a4f7",
    status: "confirmed",
    originalEtaMs: 1500,
    actualTimeMs: 420,
    timeSavedMs: 1080,
    strategy: "priority_fee",
    priorityFeeGwei: 0.3,
    relayNode: "us-west-2",
    createdAt: "2026-06-12T10:33:00Z",
    confirmedAt: "2026-06-12T10:33:00Z",
  },
  {
    id: "tx_5",
    chainId: "eth_mainnet",
    chainName: "Ethereum",
    txHash: "0x9f3a...d8e1",
    status: "failed",
    originalEtaMs: 12000,
    actualTimeMs: 0,
    timeSavedMs: 0,
    strategy: "private_tx",
    priorityFeeGwei: 60,
    relayNode: "us-east-1",
    createdAt: "2026-06-12T10:30:00Z",
  },
];

const MOCK_RELAYS: RelayNode[] = [
  { id: "relay_1", region: "US East (N. Virginia)", latencyMs: 12, uptime: 99.98, txCount: 45678, status: "online" },
  { id: "relay_2", region: "US West (Oregon)", latencyMs: 28, uptime: 99.95, txCount: 34234, status: "online" },
  { id: "relay_3", region: "EU West (Ireland)", latencyMs: 45, uptime: 99.92, txCount: 28901, status: "online" },
  { id: "relay_4", region: "EU Central (Frankfurt)", latencyMs: 52, uptime: 99.89, txCount: 23456, status: "online" },
  { id: "relay_5", region: "AP South (Mumbai)", latencyMs: 89, uptime: 99.75, txCount: 18765, status: "degraded" },
  { id: "relay_6", region: "AP Northeast (Tokyo)", latencyMs: 72, uptime: 99.85, txCount: 21345, status: "online" },
];

export async function listAccelerationConfigs(): Promise<ChainAccelerationConfig[]> {
  return MOCK_CONFIGS;
}

export async function listAcceleratedTransactions(): Promise<AcceleratedTransaction[]> {
  return MOCK_TRANSACTIONS;
}

export async function listRelayNodes(): Promise<RelayNode[]> {
  return MOCK_RELAYS;
}

export async function getAccelerationStats() {
  const totalTx = MOCK_TRANSACTIONS.length;
  const confirmed = MOCK_TRANSACTIONS.filter((t) => t.status === "confirmed").length;
  const totalSaved = MOCK_TRANSACTIONS.reduce((s, t) => s + t.timeSavedMs, 0);
  const avgSpeedup = MOCK_CONFIGS.reduce((s, c) => s + c.avgSpeedupPercent, 0) / MOCK_CONFIGS.length;

  return {
    totalTx,
    confirmed,
    failed: MOCK_TRANSACTIONS.filter((t) => t.status === "failed").length,
    pending: MOCK_TRANSACTIONS.filter((t) => t.status === "accelerating").length,
    totalTimeSavedMs: totalSaved,
    avgSpeedupPercent: Math.round(avgSpeedup),
    activeRelays: MOCK_RELAYS.filter((r) => r.status === "online").length,
    totalRelays: MOCK_RELAYS.length,
  };
}
