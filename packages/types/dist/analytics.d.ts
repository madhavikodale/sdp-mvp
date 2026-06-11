/**
 * Analytics & Usage types for real-time monitoring
 */
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
//# sourceMappingURL=analytics.d.ts.map