"use server";

import type { UsageSummary, ChainUsage, MethodUsage, TimeSeriesData, ApiKeyUsage, RegionUsage } from "@sdp-mvp/types";

export async function getUsageSummary(): Promise<UsageSummary> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return {
    totalRequests: 2_847_293,
    totalRequestsChange: 23.5,
    avgLatencyMs: 54,
    avgLatencyChange: -12.3,
    errorRate: 0.08,
    errorRateChange: -0.03,
    estimatedCost: 1247.5,
    estimatedCostChange: 18.2,
    activeEndpoints: 8,
    activeEndpointsChange: 2,
  };
}

export async function getChainUsage(): Promise<ChainUsage[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return [
    { chainId: "sol_mainnet", chainName: "Solana", requests: 1_245_678, latencyMs: 45, errorRate: 0.05, cost: 546.2, percentageOfTotal: 43.7 },
    { chainId: "eth_mainnet", chainName: "Ethereum", requests: 876_432, latencyMs: 62, errorRate: 0.12, cost: 384.1, percentageOfTotal: 30.8 },
    { chainId: "base_mainnet", chainName: "Base", requests: 342_109, latencyMs: 38, errorRate: 0.03, cost: 149.9, percentageOfTotal: 12.0 },
    { chainId: "arb_mainnet", chainName: "Arbitrum", requests: 198_765, latencyMs: 52, errorRate: 0.06, cost: 87.1, percentageOfTotal: 7.0 },
    { chainId: "xdc_mainnet", chainName: "XDC Network", requests: 98_432, latencyMs: 245, errorRate: 0.45, cost: 43.1, percentageOfTotal: 3.5 },
    { chainId: "avax_mainnet", chainName: "Avalanche", requests: 45_678, latencyMs: 71, errorRate: 0.08, cost: 20.0, percentageOfTotal: 1.6 },
    { chainId: "sui_mainnet", chainName: "Sui", requests: 23_456, latencyMs: 89, errorRate: 0.15, cost: 10.3, percentageOfTotal: 0.8 },
    { chainId: "btc_mainnet", chainName: "Bitcoin", requests: 16_743, latencyMs: 120, errorRate: 0.02, cost: 7.3, percentageOfTotal: 0.6 },
  ];
}

export async function getMethodUsage(): Promise<MethodUsage[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return [
    { method: "eth_getBalance", count: 456_789, avgLatencyMs: 32, errorRate: 0.01 },
    { method: "eth_sendTransaction", count: 234_567, avgLatencyMs: 145, errorRate: 0.08 },
    { method: "eth_call", count: 198_432, avgLatencyMs: 28, errorRate: 0.02 },
    { method: "getAccountInfo", count: 187_654, avgLatencyMs: 22, errorRate: 0.01 },
    { method: "getLatestBlockhash", count: 156_789, avgLatencyMs: 18, errorRate: 0.01 },
    { method: "eth_getBlockByNumber", count: 134_567, avgLatencyMs: 65, errorRate: 0.03 },
    { method: "simulateTransaction", count: 98_765, avgLatencyMs: 89, errorRate: 0.05 },
    { method: "getTokenAccountsByOwner", count: 87_432, avgLatencyMs: 35, errorRate: 0.02 },
  ];
}

export async function getRequestTimeSeries(): Promise<TimeSeriesData> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  return {
    labels,
    datasets: [
      { label: "Solana", data: labels.map(() => Math.floor(Math.random() * 50000) + 30000), color: "#9945FF" },
      { label: "Ethereum", data: labels.map(() => Math.floor(Math.random() * 40000) + 20000), color: "#627EEA" },
      { label: "Base", data: labels.map(() => Math.floor(Math.random() * 20000) + 10000), color: "#0052FF" },
      { label: "Arbitrum", data: labels.map(() => Math.floor(Math.random() * 15000) + 5000), color: "#28A0F0" },
    ],
  };
}

export async function getLatencyTimeSeries(): Promise<TimeSeriesData> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  return {
    labels,
    datasets: [
      { label: "Avg Latency", data: labels.map(() => Math.floor(Math.random() * 60) + 20), color: "#10B981" },
      { label: "P95", data: labels.map(() => Math.floor(Math.random() * 120) + 60), color: "#F59E0B" },
      { label: "P99", data: labels.map(() => Math.floor(Math.random() * 200) + 100), color: "#EF4444" },
    ],
  };
}

export async function getApiKeyUsage(): Promise<ApiKeyUsage[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return [
    { keyId: "key_001", keyName: "Production API Key", keyPrefix: "pk_live_abc", requests: 1_456_789, lastUsedAt: new Date(Date.now() - 300000).toISOString(), status: "active" },
    { keyId: "key_002", keyName: "Sandbox Test Key", keyPrefix: "pk_test_xyz", requests: 876_432, lastUsedAt: new Date(Date.now() - 86400000).toISOString(), status: "active" },
    { keyId: "key_003", keyName: "Mobile App", keyPrefix: "pk_live_mob", requests: 342_109, lastUsedAt: new Date(Date.now() - 3600000).toISOString(), status: "active" },
    { keyId: "key_004", keyName: "Analytics Pipeline", keyPrefix: "pk_live_anl", requests: 172_963, lastUsedAt: new Date(Date.now() - 7200000).toISOString(), status: "active" },
  ];
}

export async function getRegionUsage(): Promise<RegionUsage[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return [
    { region: "us-east-1", requests: 1_456_789, latencyMs: 42, uptime: 99.99 },
    { region: "us-west-2", requests: 876_432, latencyMs: 58, uptime: 99.97 },
    { region: "eu-west-1", requests: 654_321, latencyMs: 76, uptime: 99.95 },
    { region: "ap-south-1", requests: 234_567, latencyMs: 145, uptime: 99.82 },
    { region: "ap-northeast-1", requests: 198_765, latencyMs: 112, uptime: 99.91 },
  ];
}
