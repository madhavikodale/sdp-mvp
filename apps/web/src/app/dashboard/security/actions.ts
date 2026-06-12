"use server";

export async function getSecurityStats() {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return {
    programsScanned: 1247,
    highRiskFound: 23,
    auditsCompleted: 89,
    avgRiskScore: 3.2,
  };
}

export async function scanProgram(programId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  // Mock scan result
  return {
    programId,
    name: programId === "JUP6LkbZbjS1jKKwapdHNy74zc3sXi4a4rBq3r8r1x1" ? "Jupiter Aggregator" : "Unknown Program",
    overallScore: programId === "JUP6LkbZbjS1jKKwapdHNy74zc3sXi4a4rBq3r8r1x1" ? 2.1 : 7.8,
    auditStatus: programId === "JUP6LkbZbjS1jKKwapdHNy74zc3sXi4a4rBq3r8r1x1" ? "audited" as const : "unaudited" as const,
    lastAuditDate: programId === "JUP6LkbZbjS1jKKwapdHNy74zc3sXi4a4rBq3r8r1x1" ? "2026-03-15" : null,
    knownVulnerabilities: programId === "JUP6LkbZbjS1jKKwapdHNy74zc3sXi4a4rBq3r8r1x1" ? 0 : 2,
    dependencyCount: programId === "JUP6LkbZbjS1jKKwapdHNy74zc3sXi4a4rBq3r8r1x1" ? 3 : 12,
    upgradeAuthority: programId === "JUP6LkbZbjS1jKKwapdHNy74zc3sXi4a4rBq3r8r1x1" ? "multisig" as const : "single" as const,
    cpiRisk: programId === "JUP6LkbZbjS1jKKwapdHNy74zc3sXi4a4rBq3r8r1x1" ? "low" as const : "high" as const,
    cveList: programId === "JUP6LkbZbjS1jKKwapdHNy74zc3sXi4a4rBq3r8r1x1" ? [] : [
      { id: "CVE-2025-11234", severity: "high" as const, description: "Re-entrancy in CPI calls" },
      { id: "CVE-2025-11235", severity: "medium" as const, description: "Missing signer validation" },
    ],
  };
}

export async function listPrograms() {
  return [
    { id: "p_001", name: "Jupiter Aggregator", programId: "JUP6LkbZbjS1jKKwapdHNy74zc3sXi4a4rBq3r8r1x1", riskScore: 2.1, auditStatus: "audited" as const, lastActivity: "2 min ago", transactions: 892341 },
    { id: "p_002", name: "Raydium AMM", programId: "675kPX9MHTjS2zt1qfr1NYHuzeLXbQFEBsFcUEg7KWQN", riskScore: 2.8, auditStatus: "audited" as const, lastActivity: "5 min ago", transactions: 534120 },
    { id: "p_003", name: "Orca Whirlpool", programId: "whirLbMiicvXQHgHM9bNFFDs3w4a7X6TK1z3dYof5x6", riskScore: 3.5, auditStatus: "audited" as const, lastActivity: "12 min ago", transactions: 312450 },
    { id: "p_004", name: "Meteora DLMM", programId: "LBUZKhRxPFbXvKf3ZGug8tBXejm5H4zWqV5wYAm5q3U", riskScore: 4.2, auditStatus: "pending" as const, lastActivity: "1 hour ago", transactions: 89200 },
    { id: "p_005", name: "Drift Protocol", programId: "dRiftyHA39MWEi3m9aUN5HdS8R2u5jfhJ7y1", riskScore: 3.9, auditStatus: "audited" as const, lastActivity: "30 min ago", transactions: 156700 },
    { id: "p_006", name: "MarginFi Lending", programId: "MFv2hWf31Z9kbWi7R7Vu7s9f9x7v7v7v7v7v7v7v7v7", riskScore: 6.7, auditStatus: "unaudited" as const, lastActivity: "3 hours ago", transactions: 23400 },
    { id: "p_007", name: "Flash Loan Pro", programId: "FL4SH1oAn9kbWi7R7Vu7s9f9x7v7v7v7v7v7v7v7v7", riskScore: 8.9, auditStatus: "unaudited" as const, lastActivity: "1 day ago", transactions: 5600 },
  ];
}

export async function getVulnerabilityFeed() {
  return [
    { id: "cve_001", cveId: "CVE-2025-11234", severity: "high" as const, description: "Re-entrancy vulnerability in CPI calls affecting lending protocols", affectedPrograms: ["MarginFi Lending", "Flash Loan Pro"], publishedAt: "2026-06-10" },
    { id: "cve_002", cveId: "CVE-2025-11235", severity: "medium" as const, description: "Missing signer validation in token transfer instructions", affectedPrograms: ["Flash Loan Pro"], publishedAt: "2026-06-08" },
    { id: "cve_003", cveId: "CVE-2025-11236", severity: "critical" as const, description: "Arithmetic overflow in reward calculation", affectedPrograms: ["Unknown DEX v3"], publishedAt: "2026-06-05" },
    { id: "cve_004", cveId: "CVE-2025-11237", severity: "low" as const, description: "Information disclosure in program logs", affectedPrograms: ["Generic SPL Token"], publishedAt: "2026-06-01" },
  ];
}
