"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PARTNER_TIERS = void 0;
exports.PARTNER_TIERS = {
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
