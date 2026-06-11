"use server";

import type { RpcEndpoint, EndpointHealth, Chain } from "@sdp-mvp/types";
import { SUPPORTED_CHAINS } from "@sdp-mvp/types";

// Mock RPC endpoints
const mockEndpoints: RpcEndpoint[] = [
  {
    id: "ep_sol_main_1",
    chainId: "sol_mainnet",
    name: "Solana Mainnet - US East",
    url: "https://sol-mainnet.g.alchemy.com/v2/...",
    type: "http",
    status: "healthy",
    latencyMs: 45,
    region: "us-east-1",
    isDefault: true,
    isArchive: false,
    features: ["http", "websocket", "archive"],
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "ep_sol_main_2",
    chainId: "sol_mainnet",
    name: "Solana Mainnet - EU West",
    url: "https://sol-mainnet-eu.g.alchemy.com/v2/...",
    type: "http",
    status: "healthy",
    latencyMs: 78,
    region: "eu-west-1",
    isDefault: false,
    isArchive: true,
    features: ["http", "websocket", "archive", "grpc"],
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: "ep_eth_main_1",
    chainId: "eth_mainnet",
    name: "Ethereum Mainnet - US East",
    url: "https://eth-mainnet.g.alchemy.com/v2/...",
    type: "http",
    status: "healthy",
    latencyMs: 62,
    region: "us-east-1",
    isDefault: true,
    isArchive: false,
    features: ["http", "websocket"],
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "ep_eth_main_2",
    chainId: "eth_mainnet",
    name: "Ethereum Mainnet - Archive",
    url: "https://eth-mainnet-archive.g.alchemy.com/v2/...",
    type: "http",
    status: "healthy",
    latencyMs: 95,
    region: "us-west-2",
    isDefault: false,
    isArchive: true,
    features: ["http", "websocket", "archive"],
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: "ep_base_main_1",
    chainId: "base_mainnet",
    name: "Base Mainnet - US East",
    url: "https://base-mainnet.g.alchemy.com/v2/...",
    type: "http",
    status: "healthy",
    latencyMs: 38,
    region: "us-east-1",
    isDefault: true,
    isArchive: false,
    features: ["http", "websocket"],
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: "ep_xdc_main_1",
    chainId: "xdc_mainnet",
    name: "XDC Mainnet - Asia",
    url: "https://rpc.xinfin.network",
    type: "http",
    status: "degraded",
    latencyMs: 245,
    region: "ap-south-1",
    isDefault: true,
    isArchive: false,
    features: ["http"],
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "ep_arb_main_1",
    chainId: "arb_mainnet",
    name: "Arbitrum One - US East",
    url: "https://arb-mainnet.g.alchemy.com/v2/...",
    type: "http",
    status: "healthy",
    latencyMs: 52,
    region: "us-east-1",
    isDefault: true,
    isArchive: false,
    features: ["http", "websocket"],
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: "ep_avax_main_1",
    chainId: "avax_mainnet",
    name: "Avalanche C-Chain - US East",
    url: "https://avax-mainnet.g.alchemy.com/v2/...",
    type: "http",
    status: "healthy",
    latencyMs: 71,
    region: "us-east-1",
    isDefault: true,
    isArchive: false,
    features: ["http", "websocket"],
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
];

const mockHealth: EndpointHealth[] = [
  {
    endpointId: "ep_sol_main_1",
    status: "healthy",
    latencyMs: 45,
    lastCheckedAt: new Date().toISOString(),
    blockHeight: 285_432_891,
    syncStatus: "synced",
    errorRate: 0.001,
  },
  {
    endpointId: "ep_sol_main_2",
    status: "healthy",
    latencyMs: 78,
    lastCheckedAt: new Date().toISOString(),
    blockHeight: 285_432_890,
    syncStatus: "synced",
    errorRate: 0.002,
  },
  {
    endpointId: "ep_eth_main_1",
    status: "healthy",
    latencyMs: 62,
    lastCheckedAt: new Date().toISOString(),
    blockHeight: 19_842_105,
    syncStatus: "synced",
    errorRate: 0.001,
  },
  {
    endpointId: "ep_eth_main_2",
    status: "healthy",
    latencyMs: 95,
    lastCheckedAt: new Date().toISOString(),
    blockHeight: 19_842_105,
    syncStatus: "synced",
    errorRate: 0.003,
  },
  {
    endpointId: "ep_base_main_1",
    status: "healthy",
    latencyMs: 38,
    lastCheckedAt: new Date().toISOString(),
    blockHeight: 15_234_567,
    syncStatus: "synced",
    errorRate: 0.001,
  },
  {
    endpointId: "ep_xdc_main_1",
    status: "degraded",
    latencyMs: 245,
    lastCheckedAt: new Date().toISOString(),
    blockHeight: 68_234_109,
    syncStatus: "syncing",
    errorRate: 0.05,
  },
  {
    endpointId: "ep_arb_main_1",
    status: "healthy",
    latencyMs: 52,
    lastCheckedAt: new Date().toISOString(),
    blockHeight: 198_456_789,
    syncStatus: "synced",
    errorRate: 0.001,
  },
  {
    endpointId: "ep_avax_main_1",
    status: "healthy",
    latencyMs: 71,
    lastCheckedAt: new Date().toISOString(),
    blockHeight: 45_678_901,
    syncStatus: "synced",
    errorRate: 0.002,
  },
];

export async function listChains(): Promise<Chain[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return [...SUPPORTED_CHAINS];
}

export async function listEndpoints(): Promise<RpcEndpoint[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return [...mockEndpoints];
}

export async function getEndpointHealth(): Promise<EndpointHealth[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return [...mockHealth];
}

export async function createEndpoint(formData: FormData) {
  const chainId = String(formData.get("chainId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "http") as RpcEndpoint["type"];
  const region = String(formData.get("region") ?? "us-east-1").trim();
  const isArchive = formData.get("isArchive") === "on";

  if (!chainId || !name) {
    return { success: false, error: "Chain and name are required." };
  }

  const newEndpoint: RpcEndpoint = {
    id: `ep_${Math.random().toString(36).slice(2)}`,
    chainId,
    name,
    url: `https://${chainId}.sdp.io/v1/...`,
    type,
    status: "healthy",
    latencyMs: Math.floor(Math.random() * 100) + 20,
    region,
    isDefault: false,
    isArchive,
    features: [type, isArchive ? "archive" : ""].filter(Boolean),
    createdAt: new Date().toISOString(),
  };

  mockEndpoints.push(newEndpoint);
  return { success: true, endpoint: newEndpoint };
}
