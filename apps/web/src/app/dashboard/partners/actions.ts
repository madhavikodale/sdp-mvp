"use server";

import type { Partner, Tenant, RevenueShare, PartnerAnalytics, WhiteLabelConfig } from "@sdp-mvp/types";

const MOCK_PARTNER: Partner = {
  id: "p_001",
  name: "OpenScan AI",
  email: "partner@openscanai.com",
  company: "OpenScan AI Inc.",
  tier: "gold",
  status: "active",
  revenueShare: 25,
  customDomain: "rpc.openscanai.com",
  logoUrl: "https://via.placeholder.com/120x40/6366f1/ffffff?text=OpenScan",
  primaryColor: "#6366f1",
  createdAt: "2024-01-15T00:00:00Z",
  totalTenants: 12,
  totalRevenue: 48750.0,
  totalPayouts: 36562.5,
  pendingPayout: 12187.5,
  monthlyRequests: 2847291,
};

const MOCK_TENANTS: Tenant[] = [
  {
    id: "t_001",
    partnerId: "p_001",
    name: "DeFi Protocol Alpha",
    email: "admin@defialpha.io",
    status: "active",
    apiKeysCreated: 3,
    totalRequests: 1245678,
    monthlyRequests: 456789,
    monthlySpend: 2150.5,
    createdAt: "2024-02-01T00:00:00Z",
    lastActiveAt: "2024-06-11T10:30:00Z",
  },
  {
    id: "t_002",
    partnerId: "p_001",
    name: "NFT Marketplace Beta",
    email: "dev@nftbeta.com",
    status: "active",
    apiKeysCreated: 2,
    totalRequests: 987654,
    monthlyRequests: 234567,
    monthlySpend: 1890.25,
    createdAt: "2024-03-15T00:00:00Z",
    lastActiveAt: "2024-06-11T08:15:00Z",
  },
  {
    id: "t_003",
    partnerId: "p_001",
    name: "GameFi Studio Gamma",
    email: "ops@gamegamma.gg",
    status: "active",
    apiKeysCreated: 5,
    totalRequests: 876543,
    monthlyRequests: 198765,
    monthlySpend: 1650.75,
    createdAt: "2024-04-01T00:00:00Z",
    lastActiveAt: "2024-06-10T22:45:00Z",
  },
  {
    id: "t_004",
    partnerId: "p_001",
    name: "Enterprise Delta Corp",
    email: "blockchain@deltacorp.com",
    status: "suspended",
    apiKeysCreated: 1,
    totalRequests: 234567,
    monthlyRequests: 0,
    monthlySpend: 0,
    createdAt: "2024-01-20T00:00:00Z",
    lastActiveAt: "2024-05-28T14:20:00Z",
  },
  {
    id: "t_005",
    partnerId: "p_001",
    name: "Wallet App Epsilon",
    email: "api@wallepsilon.app",
    status: "active",
    apiKeysCreated: 2,
    totalRequests: 654321,
    monthlyRequests: 145678,
    monthlySpend: 1200.0,
    createdAt: "2024-05-01T00:00:00Z",
    lastActiveAt: "2024-06-11T09:00:00Z",
  },
];

const MOCK_REVENUE: RevenueShare[] = [
  {
    id: "rev_001",
    partnerId: "p_001",
    period: "2024-06",
    totalRevenue: 12187.5,
    partnerShare: 3046.88,
    platformShare: 9140.62,
    tenantBreakdown: [
      { tenantId: "t_001", tenantName: "DeFi Protocol Alpha", revenue: 5376.25, partnerShare: 1344.06 },
      { tenantId: "t_002", tenantName: "NFT Marketplace Beta", revenue: 4725.63, partnerShare: 1181.41 },
      { tenantId: "t_003", tenantName: "GameFi Studio Gamma", revenue: 4126.88, partnerShare: 1031.72 },
      { tenantId: "t_005", tenantName: "Wallet App Epsilon", revenue: 2958.74, partnerShare: 489.69 },
    ],
    status: "pending",
  },
  {
    id: "rev_002",
    partnerId: "p_001",
    period: "2024-05",
    totalRevenue: 11543.2,
    partnerShare: 2885.8,
    platformShare: 8657.4,
    tenantBreakdown: [
      { tenantId: "t_001", tenantName: "DeFi Protocol Alpha", revenue: 4987.5, partnerShare: 1246.88 },
      { tenantId: "t_002", tenantName: "NFT Marketplace Beta", revenue: 4321.0, partnerShare: 1080.25 },
      { tenantId: "t_003", tenantName: "GameFi Studio Gamma", revenue: 2234.7, partnerShare: 558.67 },
    ],
    status: "completed",
    paidAt: "2024-06-05T00:00:00Z",
    transactionId: "txn_stripe_8xK2mP9vLq",
  },
  {
    id: "rev_003",
    partnerId: "p_001",
    period: "2024-04",
    totalRevenue: 9876.45,
    partnerShare: 2469.11,
    platformShare: 7407.34,
    tenantBreakdown: [
      { tenantId: "t_001", tenantName: "DeFi Protocol Alpha", revenue: 4321.0, partnerShare: 1080.25 },
      { tenantId: "t_002", tenantName: "NFT Marketplace Beta", revenue: 3456.75, partnerShare: 864.19 },
      { tenantId: "t_003", tenantName: "GameFi Studio Gamma", revenue: 2098.7, partnerShare: 524.67 },
    ],
    status: "completed",
    paidAt: "2024-05-05T00:00:00Z",
    transactionId: "txn_stripe_3jN7pQ5wRt",
  },
];

const MOCK_ANALYTICS: PartnerAnalytics = {
  partnerId: "p_001",
  period: "2024-06",
  totalRequests: 2847291,
  uniqueTenants: 4,
  newTenants: 1,
  churnedTenants: 0,
  avgRevenuePerTenant: 3046.88,
  topMethods: [
    { method: "eth_getBalance", count: 456789 },
    { method: "eth_sendTransaction", count: 234567 },
    { method: "eth_call", count: 198432 },
    { method: "getAccountInfo", count: 187654 },
    { method: "getLatestBlockhash", count: 156789 },
  ],
  dailyRequests: [
    { date: "06-01", requests: 92345 },
    { date: "06-02", requests: 98765 },
    { date: "06-03", requests: 87654 },
    { date: "06-04", requests: 94567 },
    { date: "06-05", requests: 102345 },
    { date: "06-06", requests: 98765 },
    { date: "06-07", requests: 87654 },
    { date: "06-08", requests: 92345 },
    { date: "06-09", requests: 98765 },
    { date: "06-10", requests: 105432 },
    { date: "06-11", requests: 112345 },
  ],
};

const MOCK_WHITELABEL: WhiteLabelConfig = {
  partnerId: "p_001",
  customDomain: "rpc.openscanai.com",
  logoUrl: "https://via.placeholder.com/120x40/6366f1/ffffff?text=OpenScan",
  faviconUrl: "https://via.placeholder.com/32x32/6366f1/ffffff?text=OS",
  primaryColor: "#6366f1",
  accentColor: "#8b5cf6",
  darkMode: true,
  customCss: "",
  emailTemplates: {
    welcome: true,
    invoice: true,
    alert: false,
  },
};

export async function getPartner(): Promise<Partner> {
  return MOCK_PARTNER;
}

export async function listTenants(): Promise<Tenant[]> {
  return MOCK_TENANTS;
}

export async function listRevenue(): Promise<RevenueShare[]> {
  return MOCK_REVENUE;
}

export async function getPartnerAnalytics(): Promise<PartnerAnalytics> {
  return MOCK_ANALYTICS;
}

export async function getWhiteLabelConfig(): Promise<WhiteLabelConfig> {
  return MOCK_WHITELABEL;
}
