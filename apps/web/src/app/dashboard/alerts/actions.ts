"use server";

import type { AlertRule, AlertNotification, AlertChannelConfig } from "@sdp-mvp/types";

const MOCK_RULES: AlertRule[] = [
  {
    id: "alert_1",
    name: "High Error Rate",
    metric: "error_rate",
    condition: "above",
    threshold: 5,
    severity: "critical",
    channels: ["email", "slack"],
    status: "active",
    cooldownMinutes: 15,
    triggerCount: 3,
    lastTriggeredAt: "2026-06-12T10:15:00Z",
    createdAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "alert_2",
    name: "Latency Spike",
    metric: "latency",
    condition: "above",
    threshold: 500,
    severity: "warning",
    channels: ["email"],
    status: "active",
    cooldownMinutes: 10,
    triggerCount: 8,
    lastTriggeredAt: "2026-06-12T09:45:00Z",
    createdAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "alert_3",
    name: "Quota 80%",
    metric: "quota",
    condition: "above",
    threshold: 80,
    severity: "warning",
    channels: ["email", "webhook"],
    status: "active",
    cooldownMinutes: 60,
    triggerCount: 1,
    lastTriggeredAt: "2026-06-11T14:20:00Z",
    createdAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "alert_4",
    name: "MEV Threat Detected",
    metric: "mev_threat",
    condition: "above",
    threshold: 1,
    severity: "critical",
    channels: ["email", "slack", "pagerduty"],
    status: "active",
    cooldownMinutes: 5,
    triggerCount: 12,
    lastTriggeredAt: "2026-06-12T10:32:00Z",
    createdAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "alert_5",
    name: "Gas Price Surge",
    metric: "gas_price",
    condition: "above",
    threshold: 100,
    severity: "info",
    channels: ["email"],
    status: "muted",
    cooldownMinutes: 30,
    triggerCount: 0,
    createdAt: "2026-06-01T00:00:00Z",
  },
];

const MOCK_NOTIFICATIONS: AlertNotification[] = [
  {
    id: "notif_1",
    ruleId: "alert_4",
    ruleName: "MEV Threat Detected",
    severity: "critical",
    message: "Sandwich attack blocked on Ethereum mainnet. Estimated loss: $1,247.50",
    metric: "mev_threat",
    value: 1,
    threshold: 1,
    channels: ["email", "slack", "pagerduty"],
    status: "sent",
    sentAt: "2026-06-12T10:32:00Z",
  },
  {
    id: "notif_2",
    ruleId: "alert_1",
    ruleName: "High Error Rate",
    severity: "critical",
    message: "Error rate on Base RPC exceeded 5% threshold. Current: 7.2%",
    metric: "error_rate",
    value: 7.2,
    threshold: 5,
    channels: ["email", "slack"],
    status: "sent",
    sentAt: "2026-06-12T10:15:00Z",
  },
  {
    id: "notif_3",
    ruleId: "alert_2",
    ruleName: "Latency Spike",
    severity: "warning",
    message: "Average latency on Solana RPC reached 620ms. Threshold: 500ms",
    metric: "latency",
    value: 620,
    threshold: 500,
    channels: ["email"],
    status: "sent",
    sentAt: "2026-06-12T09:45:00Z",
  },
  {
    id: "notif_4",
    ruleId: "alert_3",
    ruleName: "Quota 80%",
    severity: "warning",
    message: "API quota usage reached 82%. Consider upgrading plan.",
    metric: "quota",
    value: 82,
    threshold: 80,
    channels: ["email", "webhook"],
    status: "sent",
    sentAt: "2026-06-11T14:20:00Z",
  },
  {
    id: "notif_5",
    ruleId: "alert_4",
    ruleName: "MEV Threat Detected",
    severity: "critical",
    message: "Frontrun attack mitigated on Base. Estimated loss: $89.25",
    metric: "mev_threat",
    value: 1,
    threshold: 1,
    channels: ["email", "slack"],
    status: "sent",
    sentAt: "2026-06-12T10:28:00Z",
  },
];

const MOCK_CHANNELS: AlertChannelConfig[] = [
  { channel: "email", enabled: true, config: { address: "alerts@company.com" }, verified: true },
  { channel: "slack", enabled: true, config: { webhook: "https://hooks.slack.com/..." }, verified: true },
  { channel: "webhook", enabled: true, config: { url: "https://your-app.com/webhook" }, verified: true },
  { channel: "telegram", enabled: false, config: { botToken: "", chatId: "" }, verified: false },
  { channel: "pagerduty", enabled: true, config: { serviceKey: "..." }, verified: true },
];

export async function listAlertRules(): Promise<AlertRule[]> {
  return MOCK_RULES;
}

export async function listNotifications(): Promise<AlertNotification[]> {
  return MOCK_NOTIFICATIONS;
}

export async function listChannels(): Promise<AlertChannelConfig[]> {
  return MOCK_CHANNELS;
}

export async function getAlertStats() {
  const active = MOCK_RULES.filter((r) => r.status === "active").length;
  const triggered = MOCK_NOTIFICATIONS.length;
  const critical = MOCK_NOTIFICATIONS.filter((n) => n.severity === "critical").length;

  return {
    totalRules: MOCK_RULES.length,
    activeRules: active,
    mutedRules: MOCK_RULES.filter((r) => r.status === "muted").length,
    totalNotifications: triggered,
    criticalNotifications: critical,
    warningNotifications: MOCK_NOTIFICATIONS.filter((n) => n.severity === "warning").length,
    infoNotifications: MOCK_NOTIFICATIONS.filter((n) => n.severity === "info").length,
    channelsConfigured: MOCK_CHANNELS.filter((c) => c.enabled).length,
  };
}
