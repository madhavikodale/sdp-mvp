"use server";

import type { BridgeRoute, BridgeTransaction } from "@sdp-mvp/types";

const MOCK_ROUTES: BridgeRoute[] = [
  {
    id: "route_1",
    sourceChain: "Ethereum",
    targetChain: "Solana",
    token: "USDC",
    amount: "1000",
    bridgeProvider: "Wormhole",
    estimatedTime: 900,
    fee: 2.5,
    slippage: 0.15,
  },
  {
    id: "route_2",
    sourceChain: "Base",
    targetChain: "Arbitrum",
    token: "ETH",
    amount: "5",
    bridgeProvider: "Across",
    estimatedTime: 180,
    fee: 0.8,
    slippage: 0.05,
  },
  {
    id: "route_3",
    sourceChain: "XDC Network",
    targetChain: "Ethereum",
    token: "XDC",
    amount: "50000",
    bridgeProvider: "Multichain",
    estimatedTime: 600,
    fee: 50,
    slippage: 0.3,
  },
  {
    id: "route_4",
    sourceChain: "Arbitrum",
    targetChain: "Base",
    token: "USDC",
    amount: "2500",
    bridgeProvider: "Stargate",
    estimatedTime: 300,
    fee: 1.2,
    slippage: 0.08,
  },
];

const MOCK_TRANSACTIONS: BridgeTransaction[] = [
  {
    id: "bt_1",
    routeId: "route_1",
    sourceTxHash: "0xabc123...def",
    targetTxHash: "5xK...9mN2",
    status: "completed",
    sender: "0x71C7...8976F",
    recipient: "7xKX...gAsU",
    amount: "1000",
    token: "USDC",
    fee: 2.5,
    startedAt: "2026-06-11T08:00:00Z",
    completedAt: "2026-06-11T08:18:00Z",
  },
  {
    id: "bt_2",
    routeId: "route_2",
    sourceTxHash: "0xdef456...abc",
    status: "in_progress",
    sender: "0x82D8...E9080",
    recipient: "0x93E9...F0191",
    amount: "5",
    token: "ETH",
    fee: 0.8,
    startedAt: "2026-06-11T09:30:00Z",
  },
  {
    id: "bt_3",
    routeId: "route_3",
    sourceTxHash: "xdcA0b8...c2D3e",
    targetTxHash: "0x789ghi...jkl",
    status: "completed",
    sender: "xdcA0b8...c2D3e",
    recipient: "0xB1c2...8B9c0",
    amount: "50000",
    token: "XDC",
    fee: 50,
    startedAt: "2026-06-10T14:00:00Z",
    completedAt: "2026-06-10T14:12:00Z",
  },
  {
    id: "bt_4",
    routeId: "route_4",
    sourceTxHash: "0x123abc...456",
    status: "pending",
    sender: "0x71C7...8976F",
    recipient: "0x82D8...E9080",
    amount: "2500",
    token: "USDC",
    fee: 1.2,
    startedAt: "2026-06-11T10:00:00Z",
  },
];

export async function listRoutes(): Promise<BridgeRoute[]> {
  return MOCK_ROUTES;
}

export async function listBridgeTransactions(): Promise<BridgeTransaction[]> {
  return MOCK_TRANSACTIONS;
}

export async function getBridgeStats() {
  const completed = MOCK_TRANSACTIONS.filter((t) => t.status === "completed").length;
  const inProgress = MOCK_TRANSACTIONS.filter((t) => t.status === "in_progress").length;
  const pending = MOCK_TRANSACTIONS.filter((t) => t.status === "pending").length;
  const totalVolume = MOCK_TRANSACTIONS.reduce((s, t) => s + parseFloat(t.amount), 0);
  const totalFees = MOCK_TRANSACTIONS.reduce((s, t) => s + t.fee, 0);

  return {
    totalTransactions: MOCK_TRANSACTIONS.length,
    completed,
    inProgress,
    pending,
    totalVolume,
    totalFees,
    avgTime: 12,
  };
}
