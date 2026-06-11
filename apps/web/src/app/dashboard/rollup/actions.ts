"use server";

import type { RollupConfig } from "@sdp-mvp/types";

const MOCK_ROLLUPS: RollupConfig[] = [
  {
    id: "rollup_1",
    name: "GameFi L3",
    type: "optimistic",
    parentChain: "Base",
    status: "live",
    config: {
      blockTime: 250,
      gasLimit: 30000000,
      sequencerAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      dataAvailability: "celestia",
    },
    metrics: {
      tps: 5000,
      totalTransactions: 2450000,
      totalBlocks: 89000,
      avgBlockTime: 248,
    },
    deployedAt: "2026-04-15T10:00:00Z",
    rpcEndpoint: "https://gamefi-l3.sdp.io/rpc",
    explorerUrl: "https://gamefi-l3.sdp.io/explorer",
  },
  {
    id: "rollup_2",
    name: "DeFi ZK-Rollup",
    type: "zk",
    parentChain: "Ethereum",
    status: "live",
    config: {
      blockTime: 120,
      gasLimit: 50000000,
      sequencerAddress: "0x82D8767FD8ab99B098efGc852C851C2C6g7E9080",
      dataAvailability: "eigen",
    },
    metrics: {
      tps: 12000,
      totalTransactions: 8900000,
      totalBlocks: 156000,
      avgBlockTime: 118,
    },
    deployedAt: "2026-03-01T08:00:00Z",
    rpcEndpoint: "https://defi-zk.sdp.io/rpc",
    explorerUrl: "https://defi-zk.sdp.io/explorer",
  },
  {
    id: "rollup_3",
    name: "Enterprise Chain",
    type: "sovereign",
    parentChain: "XDC Network",
    status: "deploying",
    config: {
      blockTime: 2000,
      gasLimit: 20000000,
      sequencerAddress: "xdcA0b86a33E6441E6C7D3D4B4f6c7E8f9a0B1c2D3e",
      dataAvailability: "onchain",
    },
    metrics: {
      tps: 2000,
      totalTransactions: 0,
      totalBlocks: 0,
      avgBlockTime: 0,
    },
    deployedAt: "2026-06-11T10:00:00Z",
  },
  {
    id: "rollup_4",
    name: "Social L3",
    type: "optimistic",
    parentChain: "Arbitrum",
    status: "draft",
    config: {
      blockTime: 500,
      gasLimit: 15000000,
      sequencerAddress: "0xB1c2D3e4F5a6B7c8D9e0F1a2B3c4D5e6F7a8B9c0",
      dataAvailability: "celestia",
    },
    metrics: {
      tps: 0,
      totalTransactions: 0,
      totalBlocks: 0,
      avgBlockTime: 0,
    },
  },
];

export async function listRollups(): Promise<RollupConfig[]> {
  return MOCK_ROLLUPS;
}

export async function getRollupStats() {
  const live = MOCK_ROLLUPS.filter((r) => r.status === "live").length;
  const deploying = MOCK_ROLLUPS.filter((r) => r.status === "deploying").length;
  const draft = MOCK_ROLLUPS.filter((r) => r.status === "draft").length;
  const totalTx = MOCK_ROLLUPS.reduce((s, r) => s + r.metrics.totalTransactions, 0);
  const totalBlocks = MOCK_ROLLUPS.reduce((s, r) => s + r.metrics.totalBlocks, 0);

  return {
    total: MOCK_ROLLUPS.length,
    live,
    deploying,
    draft,
    totalTransactions: totalTx,
    totalBlocks,
  };
}
