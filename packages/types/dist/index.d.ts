/**
 * @sdp-mvp/types - Core types for Solana Developer Platform MVP
 */
export declare const PERMISSIONS: readonly ["tokens:read", "tokens:write", "tokens:admin", "payments:read", "payments:write", "wallets:read", "wallets:write", "api-keys:read", "api-keys:write", "org:read", "org:write", "org:admin", "custody:read", "custody:admin", "*"];
export type Permission = (typeof PERMISSIONS)[number];
export declare const ORGANIZATION_ROLES: {
    readonly admin: {
        readonly description: "Full organization control";
        readonly permissions: Permission[];
    };
    readonly member: {
        readonly description: "Standard product access";
        readonly permissions: Permission[];
    };
};
export type OrganizationRole = keyof typeof ORGANIZATION_ROLES;
export declare function getPermissionsForOrgRole(role: OrganizationRole | string): Permission[];
export declare function hasPermission(userPermissions: Permission[], required: Permission): boolean;
export type ApiKeyRole = "api_admin" | "api_developer" | "api_readonly";
export type ApiKeyEnvironment = "sandbox" | "production";
export type ApiKeyStatus = "active" | "revoked" | "expired" | "deactivated";
export interface ApiKeyListItem {
    id: string;
    name: string;
    description: string | null;
    keyPrefix: string;
    role: ApiKeyRole;
    environment: ApiKeyEnvironment;
    status: ApiKeyStatus;
    lastUsedAt: string | null;
    expiresAt: string | null;
    createdAt: string;
}
export interface ApiKeyDetails extends ApiKeyListItem {
    projectId: string;
    allowedIps: string[] | null;
    permissions: Permission[] | null;
    signingWalletId: string | null;
    rotatedFrom: string | null;
    rotationDeadline: string | null;
}
export interface CreateApiKeyInput {
    name: string;
    role: ApiKeyRole;
    walletScope: "all" | "selected";
    signingWalletIds?: string[];
    signingWalletId?: string;
    expiresAt?: string | null;
}
export interface CreateApiKeyResult {
    id: string;
    name: string;
    key: string;
    keyPrefix: string;
    role: ApiKeyRole;
    environment: ApiKeyEnvironment;
    expiresAt: string | null;
    createdAt: string;
}
export type SdpEnvironment = "sandbox" | "production";
export interface Project {
    id: string;
    slug: string;
    name: string;
    environment: SdpEnvironment;
}
export interface DashboardWallet {
    walletId: string;
    label: string | null;
    publicKey: string;
    provider: string;
    isDefault: boolean;
}
export interface DashboardCapabilities {
    canManageApiKeys: boolean;
    canManageCustody: boolean;
    canManageOrgSettings: boolean;
    canManageTokenAdmin: boolean;
}
export interface DashboardAccess {
    role: OrganizationRole;
    permissions: Permission[];
    capabilities: DashboardCapabilities;
}
export declare function resolveDashboardAccess(role: string | null | undefined): DashboardAccess;
export interface DashboardFeatureFlags {
    paymentsV2: boolean;
}
export declare const DASHBOARD_FEATURE_FLAGS_DEFAULTS: DashboardFeatureFlags;
export type TokenStandard = "spl" | "token-2022";
export type TokenStatus = "draft" | "pending" | "active" | "frozen" | "deprecated";
export interface TokenListItem {
    id: string;
    name: string;
    symbol: string;
    decimals: number;
    standard: TokenStandard;
    status: TokenStatus;
    totalSupply: string;
    mintAuthority: string | null;
    freezeAuthority: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface TokenDetails extends TokenListItem {
    description: string | null;
    metadataUri: string | null;
    circulatingSupply: string;
    holders: number;
    transactions: number;
    walletId: string | null;
}
export interface CreateTokenInput {
    name: string;
    symbol: string;
    decimals: number;
    standard: TokenStandard;
    initialSupply: string;
    mintAuthority: "self" | "none";
    freezeAuthority: "self" | "none";
    walletId: string;
}
export interface TokenActionResult {
    success: boolean;
    signature?: string;
    error?: string;
}
export interface NavItem {
    id: string;
    label: string;
    href: string;
    icon?: string;
    requiredCapability?: keyof DashboardCapabilities;
    badge?: string;
}
export interface PageConfig {
    title: string;
    description: string;
    navItems?: NavItem[];
}
export type ChainCategory = "layer1" | "layer2" | "solana" | "evm" | "bitcoin" | "other";
export type ChainStatus = "active" | "beta" | "coming_soon" | "deprecated";
export type RpcEndpointType = "http" | "websocket" | "grpc";
export type EndpointStatus = "healthy" | "degraded" | "down" | "maintenance";
export type ChainFeature = "smart_contracts" | "evm_compatible" | "staking" | "governance" | "privacy" | "fast_finality" | "sharding" | "rollups";
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
export type MetricGranularity = "minute" | "hour" | "day" | "week" | "month";
export type MetricType = "requests" | "latency" | "errors" | "bandwidth" | "cost";
export interface UsageMetric {
    timestamp: string;
    value: number;
    chainId?: string;
    endpointId?: string;
    method?: string;
}
export interface UsageSummary {
    totalRequests: number;
    totalRequestsChange: number;
    avgLatencyMs: number;
    avgLatencyChange: number;
    errorRate: number;
    errorRateChange: number;
    estimatedCost: number;
    estimatedCostChange: number;
    activeEndpoints: number;
    activeEndpointsChange: number;
}
export interface ChainUsage {
    chainId: string;
    chainName: string;
    requests: number;
    latencyMs: number;
    errorRate: number;
    cost: number;
    percentageOfTotal: number;
}
export interface MethodUsage {
    method: string;
    count: number;
    avgLatencyMs: number;
    errorRate: number;
}
export interface TimeSeriesData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        color?: string;
    }[];
}
export interface ApiKeyUsage {
    keyId: string;
    keyName: string;
    keyPrefix: string;
    requests: number;
    lastUsedAt: string | null;
    status: string;
}
export interface RegionUsage {
    region: string;
    requests: number;
    latencyMs: number;
    uptime: number;
}
export type StreamType = "webhook" | "websocket" | "grpc" | "sse";
export type StreamStatus = "active" | "paused" | "error" | "stopped";
export type StreamEventType = "block" | "transaction" | "log" | "account" | "token_transfer" | "contract_event" | "mempool";
export interface StreamConfig {
    id: string;
    name: string;
    type: StreamType;
    status: StreamStatus;
    chainId: string;
    chainName: string;
    eventTypes: StreamEventType[];
    filters: StreamFilter[];
    destination: StreamDestination;
    createdAt: string;
    updatedAt: string;
    lastEventAt: string | null;
    totalEvents: number;
    errorCount: number;
}
export interface StreamFilter {
    field: string;
    operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "contains";
    value: string | number | string[];
}
export interface StreamDestination {
    url?: string;
    topic?: string;
    connectionString?: string;
}
export interface StreamEvent {
    id: string;
    streamId: string;
    type: StreamEventType;
    chainId: string;
    blockNumber: number;
    blockHash: string;
    transactionHash?: string;
    timestamp: string;
    data: Record<string, unknown>;
}
export interface WebhookDelivery {
    id: string;
    streamId: string;
    eventId: string;
    status: "delivered" | "failed" | "pending" | "retrying";
    httpStatus?: number;
    responseBody?: string;
    attempts: number;
    createdAt: string;
    deliveredAt: string | null;
}
export type TeamMemberRole = "owner" | "admin" | "developer" | "viewer";
export type TeamMemberStatus = "active" | "pending" | "suspended";
export interface TeamMember {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    role: TeamMemberRole;
    status: TeamMemberStatus;
    joinedAt: string;
    lastActiveAt: string | null;
    apiKeysCreated: number;
    totalRequests: number;
}
export interface TeamInvitation {
    id: string;
    email: string;
    role: TeamMemberRole;
    invitedBy: string;
    invitedAt: string;
    expiresAt: string;
    status: "pending" | "accepted" | "expired" | "revoked";
}
export interface TeamActivity {
    id: string;
    actorId: string;
    actorName: string;
    actorAvatar: string | null;
    action: string;
    target: string;
    targetType: string;
    metadata: Record<string, unknown>;
    createdAt: string;
}
export interface TeamSettings {
    name: string;
    slug: string;
    billingEmail: string;
    maxMembers: number;
    require2FA: boolean;
    allowedDomains: string[];
    defaultRole: TeamMemberRole;
}
export declare const SUPPORTED_CHAINS: Chain[];
export type PaymasterStatus = "active" | "paused" | "depleted";
export type SponsorshipType = "user" | "app" | "hybrid";
export interface PaymasterConfig {
    id: string;
    name: string;
    chainId: string;
    chainName: string;
    status: PaymasterStatus;
    sponsorshipType: SponsorshipType;
    budget: {
        total: number;
        used: number;
        currency: string;
    };
    limits: {
        maxPerTransaction: number;
        maxPerUser: number;
        maxPerDay: number;
    };
    allowedContracts: string[];
    allowedMethods: string[];
    createdAt: string;
    updatedAt: string;
}
export interface GaslessTransaction {
    id: string;
    paymasterId: string;
    userAddress: string;
    targetContract: string;
    method: string;
    gasUsed: number;
    gasCost: number;
    status: "pending" | "success" | "failed";
    txHash?: string;
    sponsoredAt: string;
}
export type WalletType = "eoa" | "smart_contract" | "multisig";
export type WalletAuth = "passkey" | "social" | "email" | "seed";
export interface SmartWallet {
    id: string;
    name: string;
    address: string;
    chainId: string;
    chainName: string;
    type: WalletType;
    authMethods: WalletAuth[];
    isPasskeyEnabled: boolean;
    owners: string[];
    threshold?: number;
    balance: string;
    usdValue: number;
    transactionCount: number;
    createdAt: string;
    lastUsedAt: string | null;
}
export type IntentStatus = "draft" | "parsed" | "simulated" | "approved" | "executed" | "failed";
export interface IntentRequest {
    id: string;
    naturalLanguage: string;
    parsedIntent: {
        action: string;
        chain: string;
        token?: string;
        amount?: string;
        recipient?: string;
        contract?: string;
    };
    status: IntentStatus;
    simulationResult?: {
        success: boolean;
        gasEstimate: number;
        expectedOutput?: string;
        warnings: string[];
    };
    txHash?: string;
    createdAt: string;
    executedAt?: string;
}
export type BridgeStatus = "pending" | "in_progress" | "completed" | "failed";
export interface BridgeRoute {
    id: string;
    sourceChain: string;
    targetChain: string;
    token: string;
    amount: string;
    bridgeProvider: string;
    estimatedTime: number;
    fee: number;
    slippage: number;
}
export interface BridgeTransaction {
    id: string;
    routeId: string;
    sourceTxHash: string;
    targetTxHash?: string;
    status: BridgeStatus;
    sender: string;
    recipient: string;
    amount: string;
    token: string;
    fee: number;
    startedAt: string;
    completedAt?: string;
}
export interface GasPrediction {
    chainId: string;
    currentGasPrice: number;
    predictedGasPrice: number;
    confidence: number;
    recommendedAction: "execute_now" | "wait" | "speed_up";
    estimatedSavings: number;
    timeToOptimal: number;
    historicalData: {
        timestamp: string;
        price: number;
    }[];
}
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type KycStatus = "not_started" | "pending" | "verified" | "rejected";
export interface RiskScore {
    address: string;
    overallRisk: RiskLevel;
    score: number;
    factors: {
        category: string;
        risk: RiskLevel;
        description: string;
    }[];
    lastUpdated: string;
}
export interface KycRecord {
    id: string;
    walletAddress: string;
    status: KycStatus;
    provider: string;
    verifiedAt?: string;
    expiresAt?: string;
    documents: string[];
}
export type RollupType = "optimistic" | "zk" | "sovereign";
export type RollupStatus = "draft" | "deploying" | "live" | "stopped";
export interface RollupConfig {
    id: string;
    name: string;
    type: RollupType;
    parentChain: string;
    status: RollupStatus;
    config: {
        blockTime: number;
        gasLimit: number;
        sequencerAddress: string;
        dataAvailability: "onchain" | "celestia" | "eigen";
    };
    metrics: {
        tps: number;
        totalTransactions: number;
        totalBlocks: number;
        avgBlockTime: number;
    };
    deployedAt?: string;
    rpcEndpoint?: string;
    explorerUrl?: string;
}
export type { Partner, PartnerTier, PartnerStatus, Tenant, TenantStatus, RevenueShare, PayoutStatus, PartnerAnalytics, WhiteLabelConfig, TenantRevenue } from "./partners";
export { PARTNER_TIERS } from "./partners";
export type { MevThreat, MevProtectionStatus, MevShieldConfig, MevThreatType, MevSeverity, MevThreatStatus, MevShieldMode } from "./mev";
export type { AlertRule, AlertNotification, AlertChannelConfig, AlertSeverity, AlertStatus, AlertCondition, AlertMetric, AlertChannel } from "./alerts";
export type { ApiEndpointDoc, ApiParameter, ApiRequestBody, ApiResponse, CodeExample, ApiDocCategory, CodeLanguage } from "./docs";
export type { ChainAccelerationConfig, AcceleratedTransaction, RelayNode, AccelerationStrategy, AccelerationStatus } from "./acceleration";
export type { AuthMethod, AuthStatus, OnboardingStatus, AuthUser, AuthSession, LoginCredentials, RegisterInput, AuthResult, OAuthProvider, WalletAuthOptions, WalletSignature, } from "./auth";
//# sourceMappingURL=index.d.ts.map