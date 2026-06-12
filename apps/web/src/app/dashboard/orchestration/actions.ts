"use server";

export async function getOrchestrationStats() {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return {
    activeWorkflows: 12,
    totalExecutions: 8_492,
    successRate: 97.3,
    gasSaved: 42_389,
    gasSavedChange: 18.5,
  };
}

export async function listWorkflows() {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return [
    {
      id: "wf_001",
      name: "Weekly Yield Harvest",
      trigger: "schedule" as const,
      triggerConfig: "0 9 * * MON",
      status: "active" as const,
      lastRun: "2026-06-09T09:00:00Z",
      nextRun: "2026-06-16T09:00:00Z",
      successRate: 98.5,
      gasSaved: 12400,
      steps: 5,
    },
    {
      id: "wf_002",
      name: "Auto-Rebalance Portfolio",
      trigger: "event" as const,
      triggerConfig: "price_deviation > 5%",
      status: "active" as const,
      lastRun: "2026-06-11T14:23:00Z",
      nextRun: "On event",
      successRate: 94.2,
      gasSaved: 8900,
      steps: 8,
    },
    {
      id: "wf_003",
      name: "Bridge & Distribute Payroll",
      trigger: "schedule" as const,
      triggerConfig: "0 0 1 * *",
      status: "active" as const,
      lastRun: "2026-06-01T00:00:00Z",
      nextRun: "2026-07-01T00:00:00Z",
      successRate: 100,
      gasSaved: 5600,
      steps: 6,
    },
    {
      id: "wf_004",
      name: "MEV Protection Sweep",
      trigger: "manual" as const,
      triggerConfig: "Manual trigger",
      status: "paused" as const,
      lastRun: "2026-06-05T11:00:00Z",
      nextRun: "—",
      successRate: 91.0,
      gasSaved: 3200,
      steps: 3,
    },
    {
      id: "wf_005",
      name: "APY Monitor & Alert",
      trigger: "event" as const,
      triggerConfig: "apy < 8%",
      status: "active" as const,
      lastRun: "2026-06-10T03:15:00Z",
      nextRun: "On event",
      successRate: 99.1,
      gasSaved: 0,
      steps: 2,
    },
  ];
}

export async function listExecutions() {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return [
    {
      id: "ex_001",
      workflowId: "wf_001",
      workflowName: "Weekly Yield Harvest",
      status: "success" as const,
      startedAt: "2026-06-09T09:00:00Z",
      completedAt: "2026-06-09T09:02:34Z",
      gasUsed: 124000,
      gasSaved: 4500,
      steps: [
        { name: "Harvest Jupiter yields", status: "success" as const, txHash: "5xK...9aB", gasUsed: 42000 },
        { name: "Swap 50% to USDC", status: "success" as const, txHash: "3mP...7cD", gasUsed: 38000 },
        { name: "Bridge to Base", status: "success" as const, txHash: "8nQ...2eF", gasUsed: 28000 },
        { name: "Send to payroll contract", status: "success" as const, txHash: "1rS...4gH", gasUsed: 16000 },
      ],
    },
    {
      id: "ex_002",
      workflowId: "wf_002",
      workflowName: "Auto-Rebalance Portfolio",
      status: "success" as const,
      startedAt: "2026-06-11T14:23:00Z",
      completedAt: "2026-06-11T14:25:12Z",
      gasUsed: 89000,
      gasSaved: 2300,
      steps: [
        { name: "Check price deviation", status: "success" as const, txHash: null, gasUsed: 0 },
        { name: "Sell SOL position", status: "success" as const, txHash: "7tU...1iJ", gasUsed: 32000 },
        { name: "Buy ETH position", status: "success" as const, txHash: "4vW...6kL", gasUsed: 35000 },
        { name: "Update rebalance log", status: "success" as const, txHash: null, gasUsed: 0 },
      ],
    },
    {
      id: "ex_003",
      workflowId: "wf_001",
      workflowName: "Weekly Yield Harvest",
      status: "failed" as const,
      startedAt: "2026-06-02T09:00:00Z",
      completedAt: "2026-06-02T09:01:05Z",
      gasUsed: 42000,
      gasSaved: 0,
      steps: [
        { name: "Harvest Jupiter yields", status: "success" as const, txHash: "2yX...8mN", gasUsed: 42000 },
        { name: "Swap 50% to USDC", status: "failed" as const, txHash: null, gasUsed: 0, error: "Slippage exceeded 2%" },
      ],
    },
  ];
}

export async function getStepTypes() {
  return [
    { id: "harvest", label: "Harvest Yields", icon: "Wheat", description: "Claim rewards from lending/AMM protocols" },
    { id: "swap", label: "Token Swap", icon: "ArrowLeftRight", description: "Swap tokens via Jupiter or Raydium" },
    { id: "bridge", label: "Cross-Chain Bridge", icon: "Bridge", description: "Bridge assets via Wormhole" },
    { id: "send", label: "Send Tokens", icon: "Send", description: "Transfer to wallet or contract" },
    { id: "condition", label: "Condition", icon: "GitBranch", description: "If/else logic based on on-chain data" },
    { id: "alert", label: "Alert", icon: "Bell", description: "Send notification via email/Slack/Telegram" },
    { id: "wait", label: "Wait", icon: "Timer", description: "Delay for N blocks or minutes" },
    { id: "stake", label: "Stake/Unstake", icon: "Lock", description: "Manage staking positions" },
  ];
}
