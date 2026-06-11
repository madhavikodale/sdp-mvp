/**
 * Chain / Network definitions for multi-chain RPC support
 */

export type ChainCategory = "layer1" | "layer2" | "solana" | "evm" | "bitcoin" | "other";
export type ChainStatus = "active" | "beta" | "coming_soon" | "deprecated";
export type RpcEndpointType = "http" | "websocket" | "grpc";
export type EndpointStatus = "healthy" | "degraded" | "down" | "maintenance";

export interface Chain {
  id: string;
  name: string;
  slug: string;
  ticker: string;
  category: ChainCategory;
  status: ChainStatus;
  chainId?: number; // EVM chain ID
  logoUrl?: string;
  description: string;
  blockTimeMs: number;
  tps: number;
  isTestnet: boolean;
  nativeToken: {
    symbol: string;
    decimals: number;
  };
  features: ChainFeature[];
}

export type ChainFeature =
  | "smart_contracts"
  | "evm_compatible"
  | "staking"
  | "governance"
  | "privacy"
  | "fast_finality"
  | "sharding"
  | "rollups";

export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: "sol_mainnet",
    name: "Solana",
    slug: "solana",
    ticker: "SOL",
    category: "solana",
    status: "active",
    description: "High-performance blockchain optimized for fast, secure, and scalable dApps.",
    blockTimeMs: 400,
    tps: 65000,
    isTestnet: false,
    nativeToken: { symbol: "SOL", decimals: 9 },
    features: ["smart_contracts", "fast_finality", "staking", "governance"],
  },
  {
    id: "eth_mainnet",
    name: "Ethereum",
    slug: "ethereum",
    ticker: "ETH",
    category: "layer1",
    status: "active",
    chainId: 1,
    description: "The world's leading programmable blockchain.",
    blockTimeMs: 12000,
    tps: 30,
    isTestnet: false,
    nativeToken: { symbol: "ETH", decimals: 18 },
    features: ["smart_contracts", "evm_compatible", "staking", "governance", "rollups"],
  },
  {
    id: "base_mainnet",
    name: "Base",
    slug: "base",
    ticker: "ETH",
    category: "layer2",
    status: "active",
    chainId: 8453,
    description: "Secure, low-cost, builder-friendly Ethereum L2.",
    blockTimeMs: 2000,
    tps: 2000,
    isTestnet: false,
    nativeToken: { symbol: "ETH", decimals: 18 },
    features: ["smart_contracts", "evm_compatible", "fast_finality", "rollups"],
  },
  {
    id: "xdc_mainnet",
    name: "XDC Network",
    slug: "xdc",
    ticker: "XDC",
    category: "evm",
    status: "active",
    chainId: 50,
    description: "Enterprise-grade, EVM-compatible blockchain for trade finance and RWA.",
    blockTimeMs: 2000,
    tps: 2000,
    isTestnet: false,
    nativeToken: { symbol: "XDC", decimals: 18 },
    features: ["smart_contracts", "evm_compatible", "fast_finality", "staking", "governance"],
  },
  {
    id: "arb_mainnet",
    name: "Arbitrum One",
    slug: "arbitrum",
    ticker: "ETH",
    category: "layer2",
    status: "active",
    chainId: 42161,
    description: "Leading Ethereum L2 with optimistic rollup technology.",
    blockTimeMs: 250,
    tps: 40000,
    isTestnet: false,
    nativeToken: { symbol: "ETH", decimals: 18 },
    features: ["smart_contracts", "evm_compatible", "fast_finality", "rollups"],
  },
  {
    id: "avax_mainnet",
    name: "Avalanche C-Chain",
    slug: "avalanche",
    ticker: "AVAX",
    category: "layer1",
    status: "active",
    chainId: 43114,
    description: "High-throughput, low-latency platform for custom blockchain networks.",
    blockTimeMs: 2000,
    tps: 4500,
    isTestnet: false,
    nativeToken: { symbol: "AVAX", decimals: 18 },
    features: ["smart_contracts", "evm_compatible", "fast_finality", "staking", "governance"],
  },
  {
    id: "sui_mainnet",
    name: "Sui",
    slug: "sui",
    ticker: "SUI",
    category: "layer1",
    status: "beta",
    description: "Layer 1 blockchain designed for high-speed, low-latency asset ownership.",
    blockTimeMs: 300,
    tps: 100000,
    isTestnet: false,
    nativeToken: { symbol: "SUI", decimals: 9 },
    features: ["smart_contracts", "fast_finality", "staking", "governance"],
  },
  {
    id: "btc_mainnet",
    name: "Bitcoin",
    slug: "bitcoin",
    ticker: "BTC",
    category: "bitcoin",
    status: "active",
    description: "The original decentralized digital currency.",
    blockTimeMs: 600000,
    tps: 7,
    isTestnet: false,
    nativeToken: { symbol: "BTC", decimals: 8 },
    features: [],
  },
];

export interface RpcEndpoint {
  id: string;
  chainId: string;
  name: string;
  url: string;
  type: RpcEndpointType;
  status: EndpointStatus;
  latencyMs: number;
  region: string;
  isDefault: boolean;
  isArchive: boolean;
  features: string[];
  createdAt: string;
}

export interface EndpointHealth {
  endpointId: string;
  status: EndpointStatus;
  latencyMs: number;
  lastCheckedAt: string;
  blockHeight: number;
  syncStatus: "synced" | "syncing" | "behind";
  errorRate: number;
}
