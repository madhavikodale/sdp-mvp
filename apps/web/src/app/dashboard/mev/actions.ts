"use server";

import type { MevProtectionStatus, MevThreat, MevShieldConfig } from "@sdp-mvp/types";

const MOCK_THREATS: MevThreat[] = [
  {
    id: "threat_1",
    type: "sandwich",
    severity: "high",
    chainId: "eth_mainnet",
    chainName: "Ethereum",
    txHash: "0x7a3f...e9d2",
    victimTx: "0x9b2c...f1a4",
    attackerAddress: "0xMEV...Bot1",
    estimatedLoss: 1247.50,
    token: "WETH",
    detectedAt: "2026-06-12T10:32:00Z",
    status: "blocked",
    blockNumber: 21894732,
  },
  {
    id: "threat_2",
    type: "frontrun",
    severity: "medium",
    chainId: "base_mainnet",
    chainName: "Base",
    txHash: "0x4d8e...c3b1",
    victimTx: "0x2f5a...d7e8",
    attackerAddress: "0xMEV...Bot2",
    estimatedLoss: 89.25,
    token: "USDC",
    detectedAt: "2026-06-12T10:28:00Z",
    status: "blocked",
    blockNumber: 24567890,
  },
  {
    id: "threat_3",
    type: "backrun",
    severity: "low",
    chainId: "arb_mainnet",
    chainName: "Arbitrum",
    txHash: "0x1c6b...a4f9",
    victimTx: "0x8e3d...b2c5",
    attackerAddress: "0xMEV...Bot3",
    estimatedLoss: 12.80,
    token: "ARB",
    detectedAt: "2026-06-12T10:15:00Z",
    status: "mitigated",
    blockNumber: 312456789,
  },
  {
    id: "threat_4",
    type: "sandwich",
    severity: "critical",
    chainId: "eth_mainnet",
    chainName: "Ethereum",
    txHash: "0x5f2a...d8e1",
    victimTx: "0x3c7b...a9f4",
    attackerAddress: "0xMEV...Bot4",
    estimatedLoss: 5234.00,
    token: "PEPE",
    detectedAt: "2026-06-12T09:55:00Z",
    status: "blocked",
    blockNumber: 21894698,
  },
  {
    id: "threat_5",
    type: "frontrun",
    severity: "medium",
    chainId: "sol_mainnet",
    chainName: "Solana",
    txHash: "0x9a4f...b2c8",
    victimTx: "0x6d1e...f3a7",
    attackerAddress: "0xMEV...Bot5",
    estimatedLoss: 456.75,
    token: "SOL",
    detectedAt: "2026-06-12T09:40:00Z",
    status: "mitigated",
    blockNumber: 345678901,
  },
];

const MOCK_SHIELD: MevShieldConfig = {
  enabled: true,
  mode: "aggressive",
  privateMempool: true,
  flashbotsRelay: true,
  edenRelay: true,
  priorityFeeBoost: 15,
  slippageTolerance: 0.5,
  maxPriorityFee: 50,
  protectedChains: ["eth_mainnet", "base_mainnet", "arb_mainnet", "sol_mainnet"],
};

export async function getMevStatus(): Promise<MevProtectionStatus> {
  const blocked = MOCK_THREATS.filter((t) => t.status === "blocked");
  const mitigated = MOCK_THREATS.filter((t) => t.status === "mitigated");
  const totalSaved = blocked.reduce((s, t) => s + t.estimatedLoss, 0) + mitigated.reduce((s, t) => s + t.estimatedLoss * 0.7, 0);

  return {
    enabled: true,
    mode: "aggressive",
    totalThreatsBlocked: blocked.length,
    totalThreatsMitigated: mitigated.length,
    totalValueProtected: totalSaved,
    activeChains: 4,
    lastScanAt: "2026-06-12T10:35:00Z",
    avgResponseTimeMs: 42,
  };
}

export async function listMevThreats(): Promise<MevThreat[]> {
  return MOCK_THREATS;
}

export async function getMevShieldConfig(): Promise<MevShieldConfig> {
  return MOCK_SHIELD;
}
