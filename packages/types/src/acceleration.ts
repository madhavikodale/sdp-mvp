export type AccelerationStrategy = "priority_fee" | "private_tx" | "bundle" | "relay";
export type AccelerationStatus = "queued" | "accelerating" | "confirmed" | "failed";

export interface ChainAccelerationConfig {
  id: string;
  chainId: string;
  chainName: string;
  enabled: boolean;
  strategies: AccelerationStrategy[];
  avgSpeedupPercent: number;
  totalTxAccelerated: number;
  totalTimeSavedMs: number;
  relayNodes: number;
  priorityFeeMultiplier: number;
}

export interface AcceleratedTransaction {
  id: string;
  chainId: string;
  chainName: string;
  txHash: string;
  status: AccelerationStatus;
  originalEtaMs: number;
  actualTimeMs: number;
  timeSavedMs: number;
  strategy: AccelerationStrategy;
  priorityFeeGwei: number;
  relayNode?: string;
  createdAt: string;
  confirmedAt?: string;
}

export interface RelayNode {
  id: string;
  region: string;
  latencyMs: number;
  uptime: number;
  txCount: number;
  status: "online" | "degraded" | "offline";
}
