"use server";

export async function getDashboardStats() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    totalRequests: 2_847_293,
    requestsChange: 23.5,
    avgLatency: 54,
    latencyChange: -12.3,
    errorRate: 0.08,
    errorRateChange: -0.03,
    estimatedCost: 1247.5,
    costChange: 18.2,
    activeChains: 8,
    activeChainsChange: 2,
    requestChart: [
      { label: "00:00", value: 45000 },
      { label: "02:00", value: 52000 },
      { label: "04:00", value: 48000 },
      { label: "06:00", value: 61000 },
      { label: "08:00", value: 78000 },
      { label: "10:00", value: 92000 },
      { label: "12:00", value: 88000 },
      { label: "14:00", value: 95000 },
      { label: "16:00", value: 87000 },
      { label: "18:00", value: 76000 },
      { label: "20:00", value: 68000 },
      { label: "22:00", value: 58000 },
    ],
    latencyChart: [
      { label: "00:00", value: 48 },
      { label: "02:00", value: 52 },
      { label: "04:00", value: 46 },
      { label: "06:00", value: 58 },
      { label: "08:00", value: 62 },
      { label: "10:00", value: 55 },
      { label: "12:00", value: 51 },
      { label: "14:00", value: 54 },
      { label: "16:00", value: 59 },
      { label: "18:00", value: 64 },
      { label: "20:00", value: 57 },
      { label: "22:00", value: 50 },
    ],
    recentActivity: [
      { id: "1", action: "New API key created", project: "Production", time: "2 min ago", type: "success" },
      { id: "2", action: "RPC endpoint health check", project: "Solana Mainnet", time: "5 min ago", type: "info" },
      { id: "3", action: "Gasless transaction batch", project: "Base", time: "12 min ago", type: "success" },
      { id: "4", action: "Team member invited", project: "Sandbox", time: "1 hour ago", type: "warning" },
      { id: "5", action: "Rollup deployment started", project: "GameFi L3", time: "2 hours ago", type: "info" },
    ],
  };
}
