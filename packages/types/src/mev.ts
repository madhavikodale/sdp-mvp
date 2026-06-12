export type MevThreatType = "sandwich" | "frontrun" | "backrun" | "liquidation";
export type MevSeverity = "low" | "medium" | "high" | "critical";
export type MevThreatStatus = "blocked" | "mitigated" | "detected";
export type MevShieldMode = "passive" | "standard" | "aggressive";

export interface MevThreat {
  id: string;
  type: MevThreatType;
  severity: MevSeverity;
  chainId: string;
  chainName: string;
  txHash: string;
  victimTx: string;
  attackerAddress: string;
  estimatedLoss: number;
  token: string;
  detectedAt: string;
  status: MevThreatStatus;
  blockNumber: number;
}

export interface MevProtectionStatus {
  enabled: boolean;
  mode: MevShieldMode;
  totalThreatsBlocked: number;
  totalThreatsMitigated: number;
  totalValueProtected: number;
  activeChains: number;
  lastScanAt: string;
  avgResponseTimeMs: number;
}

export interface MevShieldConfig {
  enabled: boolean;
  mode: MevShieldMode;
  privateMempool: boolean;
  flashbotsRelay: boolean;
  edenRelay: boolean;
  priorityFeeBoost: number;
  slippageTolerance: number;
  maxPriorityFee: number;
  protectedChains: string[];
}
