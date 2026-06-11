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
  revenueShare: number; // percentage
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
  period: string; // "2024-06"
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
  topMethods: { method: string; count: number }[];
  dailyRequests: { date: string; requests: number }[];
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

export const PARTNER_TIERS: Record<PartnerTier, { label: string; minRevenue: number; revenueShare: number; features: string[] }> = {
  bronze: {
    label: "Bronze",
    minRevenue: 0,
    revenueShare: 15,
    features: ["White-label subdomain", "Basic analytics", "Email support"],
  },
  silver: {
    label: "Silver",
    minRevenue: 5000,
    revenueShare: 20,
    features: ["Custom domain", "Advanced analytics", "Priority support", "Tenant API"],
  },
  gold: {
    label: "Gold",
    minRevenue: 25000,
    revenueShare: 25,
    features: ["Custom branding", "Real-time analytics", "Dedicated manager", "SLA guarantee"],
  },
  platinum: {
    label: "Platinum",
    minRevenue: 100000,
    revenueShare: 30,
    features: ["Full white-label", "AI insights", "Custom contracts", "Co-marketing"],
  },
};
