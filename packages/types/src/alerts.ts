export type AlertSeverity = "info" | "warning" | "critical";
export type AlertStatus = "active" | "resolved" | "muted";
export type AlertCondition = "above" | "below" | "equals" | "changes";
export type AlertMetric = "requests" | "latency" | "error_rate" | "cost" | "quota" | "gas_price" | "mev_threat";
export type AlertChannel = "email" | "webhook" | "slack" | "telegram" | "pagerduty";

export interface AlertRule {
  id: string;
  name: string;
  metric: AlertMetric;
  condition: AlertCondition;
  threshold: number;
  severity: AlertSeverity;
  channels: AlertChannel[];
  status: AlertStatus;
  cooldownMinutes: number;
  lastTriggeredAt?: string;
  triggerCount: number;
  createdAt: string;
}

export interface AlertNotification {
  id: string;
  ruleId: string;
  ruleName: string;
  severity: AlertSeverity;
  message: string;
  metric: AlertMetric;
  value: number;
  threshold: number;
  channels: AlertChannel[];
  status: "sent" | "failed" | "pending";
  sentAt: string;
  resolvedAt?: string;
}

export interface AlertChannelConfig {
  channel: AlertChannel;
  enabled: boolean;
  config: Record<string, string>;
  verified: boolean;
}
