"use server";

export async function getAtomicStats() {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return {
    swapsCompleted: 3421,
    escrowValue: 1284500,
    successRate: 99.7,
    chainsConnected: 6,
    dailySwaps: [
      { label: "May 13", value: 89 }, { label: "May 14", value: 102 }, { label: "May 15", value: 78 },
      { label: "May 16", value: 134 }, { label: "May 17", value: 156 }, { label: "May 18", value: 98 },
      { label: "May 19", value: 112 }, { label: "May 20", value: 145 }, { label: "May 21", value: 167 },
      { label: "May 22", value: 134 }, { label: "May 23", value: 189 }, { label: "May 24", value: 156 },
      { label: "May 25", value: 98 }, { label: "May 26", value: 178 }, { label: "May 27", value: 145 },
      { label: "May 28", value: 167 }, { label: "May 29", value: 198 }, { label: "May 30", value: 234 },
      { label: "May 31", value: 189 }, { label: "Jun 1", value: 156 }, { label: "Jun 2", value: 178 },
      { label: "Jun 3", value: 145 }, { label: "Jun 4", value: 167 }, { label: "Jun 5", value: 198 },
      { label: "Jun 6", value: 134 }, { label: "Jun 7", value: 189 }, { label: "Jun 8", value: 156 },
      { label: "Jun 9", value: 178 }, { label: "Jun 10", value: 212 }, { label: "Jun 11", value: 245 },
    ],
  };
}

export async function listActiveSwaps() {
  return [
    { id: "swap_001", sourceChain: "Solana", destChain: "Ethereum", sourceToken: "SOL", destToken: "ETH", amount: 500, status: "locked" as const, escrow: 500, timeRemaining: "14:32", insurance: 95 },
    { id: "swap_002", sourceChain: "Base", destChain: "Arbitrum", sourceToken: "USDC", destToken: "USDC", amount: 25000, status: "pending" as const, escrow: 0, timeRemaining: "45:00", insurance: 98 },
    { id: "swap_003", sourceChain: "Solana", destChain: "Base", sourceToken: "BONK", destToken: "ETH", amount: 5000000, status: "confirmed" as const, escrow: 0, timeRemaining: "—", insurance: 90 },
    { id: "swap_004", sourceChain: "Ethereum", destChain: "Solana", sourceToken: "USDT", destToken: "USDC", amount: 12000, status: "failed" as const, escrow: 0, timeRemaining: "—", insurance: 0 },
  ];
}

export async function getChainStatus() {
  return [
    { name: "Solana", status: "healthy" as const, latency: 45, bridgeBalance: 450000 },
    { name: "Ethereum", status: "healthy" as const, latency: 12000, bridgeBalance: 1280000 },
    { name: "Base", status: "healthy" as const, latency: 2000, bridgeBalance: 890000 },
    { name: "Arbitrum", status: "degraded" as const, latency: 8500, bridgeBalance: 560000 },
    { name: "Optimism", status: "healthy" as const, latency: 1800, bridgeBalance: 340000 },
    { name: "Polygon", status: "healthy" as const, latency: 3200, bridgeBalance: 210000 },
  ];
}

export async function getSwapHistory() {
  return [
    { id: "hist_001", route: "SOL → ETH", amount: 250, sourceTx: "5xK9...aB2m", destTx: "0x3f4a...b2c1", completedAt: "2026-06-11T14:23:00Z", gasCost: 0.002 },
    { id: "hist_002", route: "USDC → USDC", amount: 15000, sourceTx: "3mP7...cD4n", destTx: "0x8e9d...f3a2", completedAt: "2026-06-11T11:05:00Z", gasCost: 0.015 },
    { id: "hist_003", route: "BONK → ETH", amount: 2500000, sourceTx: "8nQ2...eF6g", destTx: "0x1a2b...c4d3", completedAt: "2026-06-10T09:34:00Z", gasCost: 0.008 },
  ];
}
