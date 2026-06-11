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
    color: string;
    chainId?: number;
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
export type ChainFeature = "smart_contracts" | "evm_compatible" | "staking" | "governance" | "privacy" | "fast_finality" | "sharding" | "rollups";
export declare const SUPPORTED_CHAINS: Chain[];
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
    uptimePercent: number;
}
//# sourceMappingURL=chains.d.ts.map