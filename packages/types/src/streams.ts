/**
 * Real-time data streaming types
 */

export type StreamType = "webhook" | "websocket" | "grpc" | "sse";
export type StreamStatus = "active" | "paused" | "error" | "stopped";
export type StreamEventType =
  | "block"
  | "transaction"
  | "log"
  | "account"
  | "token_transfer"
  | "contract_event"
  | "mempool";

export interface StreamConfig {
  id: string;
  name: string;
  type: StreamType;
  status: StreamStatus;
  chainId: string;
  chainName: string;
  eventTypes: StreamEventType[];
  filters: StreamFilter[];
  destination: StreamDestination;
  createdAt: string;
  updatedAt: string;
  lastEventAt: string | null;
  totalEvents: number;
  errorCount: number;
}

export interface StreamFilter {
  field: string;
  operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "contains";
  value: string | number | string[];
}

export interface StreamDestination {
  url?: string; // webhook URL
  topic?: string; // pub/sub topic
  connectionString?: string; // websocket/grpc endpoint
}

export interface StreamEvent {
  id: string;
  streamId: string;
  type: StreamEventType;
  chainId: string;
  blockNumber: number;
  blockHash: string;
  transactionHash?: string;
  timestamp: string;
  data: Record<string, unknown>;
}

export interface WebhookDelivery {
  id: string;
  streamId: string;
  eventId: string;
  status: "delivered" | "failed" | "pending" | "retrying";
  httpStatus?: number;
  responseBody?: string;
  attempts: number;
  createdAt: string;
  deliveredAt: string | null;
}
