"use strict";
/**
 * @sdp-mvp/types - Core types for Solana Developer Platform MVP
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PARTNER_TIERS = exports.SUPPORTED_CHAINS = exports.DASHBOARD_FEATURE_FLAGS_DEFAULTS = exports.ORGANIZATION_ROLES = exports.PERMISSIONS = void 0;
exports.getPermissionsForOrgRole = getPermissionsForOrgRole;
exports.hasPermission = hasPermission;
exports.resolveDashboardAccess = resolveDashboardAccess;
// ─────────────────────────────────────────────────────────────────────────────
// Permissions & Roles
// ─────────────────────────────────────────────────────────────────────────────
exports.PERMISSIONS = [
    "tokens:read",
    "tokens:write",
    "tokens:admin",
    "payments:read",
    "payments:write",
    "wallets:read",
    "wallets:write",
    "api-keys:read",
    "api-keys:write",
    "org:read",
    "org:write",
    "org:admin",
    "custody:read",
    "custody:admin",
    "*",
];
exports.ORGANIZATION_ROLES = {
    admin: {
        description: "Full organization control",
        permissions: [
            "org:read",
            "org:write",
            "org:admin",
            "tokens:read",
            "tokens:write",
            "tokens:admin",
            "payments:read",
            "payments:write",
            "wallets:read",
            "wallets:write",
            "api-keys:read",
            "api-keys:write",
            "custody:read",
            "custody:admin",
        ],
    },
    member: {
        description: "Standard product access",
        permissions: [
            "org:read",
            "api-keys:read",
            "tokens:read",
            "tokens:write",
            "payments:read",
            "payments:write",
            "wallets:read",
            "wallets:write",
        ],
    },
};
function getPermissionsForOrgRole(role) {
    const normalized = role === "admin" || role === "owner" ? "admin" : "member";
    return [...exports.ORGANIZATION_ROLES[normalized].permissions];
}
function hasPermission(userPermissions, required) {
    if (userPermissions.includes("*"))
        return true;
    return userPermissions.includes(required);
}
function resolveDashboardAccess(role) {
    const resolvedRole = role === "admin" || role === "owner" ? "admin" : "member";
    const permissions = getPermissionsForOrgRole(resolvedRole);
    return {
        role: resolvedRole,
        permissions,
        capabilities: {
            canManageApiKeys: hasPermission(permissions, "api-keys:write"),
            canManageCustody: hasPermission(permissions, "custody:admin"),
            canManageOrgSettings: hasPermission(permissions, "org:write"),
            canManageTokenAdmin: hasPermission(permissions, "tokens:admin"),
        },
    };
}
exports.DASHBOARD_FEATURE_FLAGS_DEFAULTS = {
    paymentsV2: false,
};
// ─────────────────────────────────────────────────────────────────────────────
// Chain Registry
// ─────────────────────────────────────────────────────────────────────────────
exports.SUPPORTED_CHAINS = [
    {
        id: "sol_mainnet",
        name: "Solana",
        slug: "solana",
        ticker: "SOL",
        category: "solana",
        status: "active",
        color: "#9945FF",
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
        color: "#627EEA",
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
        color: "#0052FF",
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
        color: "#F9A825",
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
        color: "#28A0F0",
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
        color: "#E84142",
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
        color: "#4DA2FF",
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
        color: "#F7931A",
        description: "The original decentralized digital currency.",
        blockTimeMs: 600000,
        tps: 7,
        isTestnet: false,
        nativeToken: { symbol: "BTC", decimals: 8 },
        features: [],
    },
];
var partners_1 = require("./partners");
Object.defineProperty(exports, "PARTNER_TIERS", { enumerable: true, get: function () { return partners_1.PARTNER_TIERS; } });
