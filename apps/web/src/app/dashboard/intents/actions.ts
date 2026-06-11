"use server";

import type { IntentRequest } from "@sdp-mvp/types";

const MOCK_INTENTS: IntentRequest[] = [
  {
    id: "int_1",
    naturalLanguage: "Send 50 USDC to alice.eth on Base",
    parsedIntent: {
      action: "transfer",
      chain: "base_mainnet",
      token: "USDC",
      amount: "50",
      recipient: "alice.eth",
    },
    status: "executed",
    simulationResult: {
      success: true,
      gasEstimate: 65000,
      expectedOutput: "50 USDC",
      warnings: [],
    },
    txHash: "0xabc123def456",
    createdAt: "2026-06-11T09:30:00Z",
    executedAt: "2026-06-11T09:31:15Z",
  },
  {
    id: "int_2",
    naturalLanguage: "Swap 1 ETH for SOL using the best route",
    parsedIntent: {
      action: "swap",
      chain: "ethereum",
      token: "ETH",
      amount: "1",
      recipient: "self",
    },
    status: "simulated",
    simulationResult: {
      success: true,
      gasEstimate: 180000,
      expectedOutput: "~42.3 SOL",
      warnings: ["High slippage on low-liquidity pool"],
    },
    createdAt: "2026-06-11T10:00:00Z",
  },
  {
    id: "int_3",
    naturalLanguage: "Stake 1000 XDC for governance rewards",
    parsedIntent: {
      action: "stake",
      chain: "xdc_mainnet",
      token: "XDC",
      amount: "1000",
    },
    status: "parsed",
    createdAt: "2026-06-11T10:15:00Z",
  },
  {
    id: "int_4",
    naturalLanguage: "Bridge 500 USDC from Arbitrum to Solana",
    parsedIntent: {
      action: "bridge",
      chain: "arbitrum",
      token: "USDC",
      amount: "500",
      recipient: "7xKX...gAsU",
    },
    status: "approved",
    simulationResult: {
      success: true,
      gasEstimate: 250000,
      expectedOutput: "~498.5 USDC (after fees)",
      warnings: ["Bridge time: ~15 minutes"],
    },
    createdAt: "2026-06-11T09:45:00Z",
  },
  {
    id: "int_5",
    naturalLanguage: "Mint an NFT on Base with metadata from IPFS hash QmXyz...",
    parsedIntent: {
      action: "mint",
      chain: "base_mainnet",
      contract: "0xNFT...Contract",
    },
    status: "failed",
    simulationResult: {
      success: false,
      gasEstimate: 0,
      warnings: ["Contract not verified", "Insufficient funds for gas"],
    },
    createdAt: "2026-06-11T08:20:00Z",
  },
];

export async function listIntents(): Promise<IntentRequest[]> {
  return MOCK_INTENTS;
}

export async function getIntentStats() {
  const total = MOCK_INTENTS.length;
  const executed = MOCK_INTENTS.filter((i) => i.status === "executed").length;
  const simulated = MOCK_INTENTS.filter((i) => i.status === "simulated").length;
  const failed = MOCK_INTENTS.filter((i) => i.status === "failed").length;
  const pending = total - executed - failed;

  return {
    total,
    executed,
    simulated,
    failed,
    pending,
    successRate: total > 0 ? Math.round(((executed + simulated) / total) * 100) : 0,
  };
}
