"use server";

import type { RiskScore, KycRecord } from "@sdp-mvp/types";

const MOCK_RISKS: RiskScore[] = [
  {
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    overallRisk: "low",
    score: 12,
    factors: [
      { category: "Transaction Pattern", risk: "low", description: "Regular, predictable transaction volumes" },
      { category: "Counterparties", risk: "low", description: "All known, verified addresses" },
      { category: "Geography", risk: "low", description: "Non-sanctioned jurisdictions" },
    ],
    lastUpdated: "2026-06-11T08:00:00Z",
  },
  {
    address: "0x82D8767FD8ab99B098efGc852C851C2C6g7E9080",
    overallRisk: "medium",
    score: 45,
    factors: [
      { category: "Transaction Pattern", risk: "medium", description: "Occasional high-value transfers" },
      { category: "Counterparties", risk: "low", description: "Mostly verified addresses" },
      { category: "Geography", risk: "medium", description: "Mixed jurisdictions" },
    ],
    lastUpdated: "2026-06-10T14:00:00Z",
  },
  {
    address: "xdcA0b86a33E6441E6C7D3D4B4f6c7E8f9a0B1c2D3e",
    overallRisk: "high",
    score: 78,
    factors: [
      { category: "Transaction Pattern", risk: "high", description: "Rapid, high-frequency transactions" },
      { category: "Counterparties", risk: "high", description: "Interactions with flagged addresses" },
      { category: "Geography", risk: "medium", description: "High-risk jurisdiction exposure" },
    ],
    lastUpdated: "2026-06-09T10:00:00Z",
  },
];

const MOCK_KYC: KycRecord[] = [
  {
    id: "kyc_1",
    walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    status: "verified",
    provider: "Onfido",
    verifiedAt: "2026-01-15T10:00:00Z",
    expiresAt: "2027-01-15T10:00:00Z",
    documents: ["passport", "proof_of_address"],
  },
  {
    id: "kyc_2",
    walletAddress: "0x82D8767FD8ab99B098efGc852C851C2C6g7E9080",
    status: "pending",
    provider: "Jumio",
    documents: ["id_card"],
  },
  {
    id: "kyc_3",
    walletAddress: "xdcA0b86a33E6441E6C7D3D4B4f6c7E8f9a0B1c2D3e",
    status: "rejected",
    provider: "Onfido",
    verifiedAt: "2026-03-01T09:00:00Z",
    documents: ["passport"],
  },
];

export async function listRiskScores(): Promise<RiskScore[]> {
  return MOCK_RISKS;
}

export async function listKycRecords(): Promise<KycRecord[]> {
  return MOCK_KYC;
}

export async function getComplianceStats() {
  const low = MOCK_RISKS.filter((r) => r.overallRisk === "low").length;
  const medium = MOCK_RISKS.filter((r) => r.overallRisk === "medium").length;
  const high = MOCK_RISKS.filter((r) => r.overallRisk === "high").length;
  const critical = MOCK_RISKS.filter((r) => r.overallRisk === "critical").length;

  const verified = MOCK_KYC.filter((k) => k.status === "verified").length;
  const pending = MOCK_KYC.filter((k) => k.status === "pending").length;
  const rejected = MOCK_KYC.filter((k) => k.status === "rejected").length;

  return {
    totalAssessed: MOCK_RISKS.length,
    low,
    medium,
    high,
    critical,
    totalKyc: MOCK_KYC.length,
    verified,
    pending,
    rejected,
  };
}
