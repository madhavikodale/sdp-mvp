"use server";

export async function getMevAdvancedStats() {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return {
    sandwichesBlocked: 1847,
    refundsEarned: 42389,
    bundlesSubmitted: 5234,
    winRate: 94.2,
    dailyRefunds: [
      { label: "May 13", value: 1200 },
      { label: "May 14", value: 890 },
      { label: "May 15", value: 2100 },
      { label: "May 16", value: 1560 },
      { label: "May 17", value: 3200 },
      { label: "May 18", value: 1890 },
      { label: "May 19", value: 2450 },
      { label: "May 20", value: 1100 },
      { label: "May 21", value: 2780 },
      { label: "May 22", value: 1950 },
      { label: "May 23", value: 3100 },
      { label: "May 24", value: 2670 },
      { label: "May 25", value: 1450 },
      { label: "May 26", value: 2980 },
      { label: "May 27", value: 2340 },
      { label: "May 28", value: 1890 },
      { label: "May 29", value: 2560 },
      { label: "May 30", value: 3120 },
      { label: "May 31", value: 2780 },
      { label: "Jun 1", value: 1950 },
      { label: "Jun 2", value: 2670 },
      { label: "Jun 3", value: 2230 },
      { label: "Jun 4", value: 2890 },
      { label: "Jun 5", value: 3450 },
      { label: "Jun 6", value: 1980 },
      { label: "Jun 7", value: 2670 },
      { label: "Jun 8", value: 3120 },
      { label: "Jun 9", value: 2340 },
      { label: "Jun 10", value: 2890 },
      { label: "Jun 11", value: 3560 },
    ],
  };
}

export async function getMempoolMonitor() {
  return [
    { id: "tx_001", hash: "5xK9...aB2m", value: 12500, riskScore: 92, type: "sandwich" as const, timestamp: "2s ago" },
    { id: "tx_002", hash: "3mP7...cD4n", value: 45000, riskScore: 78, type: "frontrun" as const, timestamp: "5s ago" },
    { id: "tx_003", hash: "8nQ2...eF6g", value: 8900, riskScore: 45, type: "backrun" as const, timestamp: "8s ago" },
    { id: "tx_004", hash: "1rS4...gH8j", value: 234000, riskScore: 96, type: "sandwich" as const, timestamp: "12s ago" },
    { id: "tx_005", hash: "7tU1...iJ3k", value: 5600, riskScore: 23, type: "backrun" as const, timestamp: "15s ago" },
  ];
}

export async function getRefundHistory() {
  return [
    { id: "rf_001", date: "2026-06-11T14:23:00Z", attackType: "sandwich" as const, savedAmount: 2450, refundTx: "5xK9...aB2m" },
    { id: "rf_002", date: "2026-06-11T11:05:00Z", attackType: "frontrun" as const, savedAmount: 1890, refundTx: "3mP7...cD4n" },
    { id: "rf_003", date: "2026-06-10T09:34:00Z", attackType: "sandwich" as const, savedAmount: 3200, refundTx: "8nQ2...eF6g" },
    { id: "rf_004", date: "2026-06-10T07:12:00Z", attackType: "backrun" as const, savedAmount: 1200, refundTx: "1rS4...gH8j" },
    { id: "rf_005", date: "2026-06-09T22:45:00Z", attackType: "sandwich" as const, savedAmount: 4100, refundTx: "7tU1...iJ3k" },
    { id: "rf_006", date: "2026-06-09T18:30:00Z", attackType: "frontrun" as const, savedAmount: 890, refundTx: "4vW6...kL9m" },
    { id: "rf_007", date: "2026-06-09T15:20:00Z", attackType: "sandwich" as const, savedAmount: 2780, refundTx: "2yX8...mN0p" },
    { id: "rf_008", date: "2026-06-08T11:00:00Z", attackType: "backrun" as const, savedAmount: 1560, refundTx: "9zQ1...oP2r" },
  ];
}

export async function getProtectionConfig() {
  return {
    enabled: true,
    minTxValue: 500,
    maxTip: 0.01,
    bundleTimeout: 3000,
    tipStrategy: "dynamic" as const,
    whitelistedPrograms: [
      "JUP6LkbZbjS1jKKwapdHNy74zc3sXi4a4rBq3r8r1x1",
      "675kPX9MHTjS2zt1qfr1NYHuzeLXbQFEBsFcUEg7KWQN",
      "9W959DqEETiGZocYWCQPaJ6sBfUzRMrMai1kVQpG5dYx",
      "PhoeNiXZxJdGz9Z1qMMJm2mZ7x5z1qMMJm2mZ7x5z1q",
      "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
      "CURVGoZn8zycx6FXwwevgBTB2gV2fN1gV9wV1gV2fN1",
    ],
  };
}
