export type PartnerTier = "bronze" | "silver" | "gold" | "platinum";
export type PartnerStatus = "pending" | "active" | "suspended" | "terminated";
export type TenantStatus = "active" | "suspended" | "inactive";
export type PayoutStatus = "pending" | "processing" | "completed" | "failed";
export interface Partner {
    id: string;
    name: string;
    email: string;
    company: string;
    tier: PartnerTier;
    status: PartnerStatus;
    revenueShare: number;
    customDomain?: string;
    logoUrl?: string;
    primaryColor?: string;
    createdAt: string;
    totalTenants: number;
    totalRevenue: number;
    totalPayouts: number;
    pendingPayout: number;
    monthlyRequests: number;
}
export interface Tenant {
    id: string;
    partnerId: string;
    name: string;
    email: string;
    status: TenantStatus;
    apiKeysCreated: number;
    totalRequests: number;
    monthlyRequests: number;
    monthlySpend: number;
    createdAt: string;
    lastActiveAt?: string;
}
export interface RevenueShare {
    id: string;
    partnerId: string;
    period: string;
    totalRevenue: number;
    partnerShare: number;
    platformShare: number;
    tenantBreakdown: TenantRevenue[];
    status: PayoutStatus;
    paidAt?: string;
    transactionId?: string;
}
export interface TenantRevenue {
    tenantId: string;
    tenantName: string;
    revenue: number;
    partnerShare: number;
}
export interface PartnerAnalytics {
    partnerId: string;
    period: string;
    totalRequests: number;
    uniqueTenants: number;
    newTenants: number;
    churnedTenants: number;
    avgRevenuePerTenant: number;
    topMethods: {
        method: string;
        count: number;
    }[];
    dailyRequests: {
        date: string;
        requests: number;
    }[];
}
export interface WhiteLabelConfig {
    partnerId: string;
    customDomain: string;
    logoUrl: string;
    faviconUrl?: string;
    primaryColor: string;
    accentColor: string;
    darkMode: boolean;
    customCss?: string;
    emailTemplates: {
        welcome: boolean;
        invoice: boolean;
        alert: boolean;
    };
}
export declare const PARTNER_TIERS: Record<PartnerTier, {
    label: string;
    minRevenue: number;
    revenueShare: number;
    features: string[];
}>;
//# sourceMappingURL=partners.d.ts.map