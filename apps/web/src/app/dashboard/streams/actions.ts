"use server";

import type { StreamConfig, StreamEvent, WebhookDelivery } from "@sdp-mvp/types";

const mockStreams: StreamConfig[] = [
  {
    id: "stream_001",
    name: "Solana Transactions",
    type: "webhook",
    status: "active",
    chainId: "sol_mainnet",
    chainName: "Solana",
    eventTypes: ["transaction", "account"],
    filters: [{ field: "programId", operator: "eq", value: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" }],
    destination: { url: "https://api.myapp.com/webhooks/solana" },
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    lastEventAt: new Date(Date.now() - 30000).toISOString(),
    totalEvents: 2_456_789,
    errorCount: 12,
  },
  {
    id: "stream_002",
    name: "Ethereum Logs",
    type: "websocket",
    status: "active",
    chainId: "eth_mainnet",
    chainName: "Ethereum",
    eventTypes: ["log", "block"],
    filters: [{ field: "address", operator: "in", value: ["0xA0b86a33E6441e6C7D3D4B4f6c7E8F9a0B1c2D3e"] }],
    destination: { connectionString: "wss://streams.sdp.io/eth/logs" },
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    lastEventAt: new Date(Date.now() - 15000).toISOString(),
    totalEvents: 1_234_567,
    errorCount: 3,
  },
  {
    id: "stream_003",
    name: "Base Mempool",
    type: "grpc",
    status: "paused",
    chainId: "base_mainnet",
    chainName: "Base",
    eventTypes: ["mempool", "transaction"],
    filters: [],
    destination: { connectionString: "grpc://streams.sdp.io:50051/base/mempool" },
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    lastEventAt: new Date(Date.now() - 86400000).toISOString(),
    totalEvents: 567_890,
    errorCount: 0,
  },
  {
    id: "stream_004",
    name: "XDC Trade Finance",
    type: "webhook",
    status: "error",
    chainId: "xdc_mainnet",
    chainName: "XDC Network",
    eventTypes: ["contract_event", "token_transfer"],
    filters: [{ field: "event", operator: "contains", value: "Trade" }],
    destination: { url: "https://api.tradefi.com/webhooks/xdc" },
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    lastEventAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    totalEvents: 45_678,
    errorCount: 156,
  },
];

const mockEvents: StreamEvent[] = [
  {
    id: "evt_001",
    streamId: "stream_001",
    type: "transaction",
    chainId: "sol_mainnet",
    blockNumber: 285_432_891,
    blockHash: "4xK...9mN2",
    transactionHash: "5yL...8oP3",
    timestamp: new Date(Date.now() - 30000).toISOString(),
    data: { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA", amount: "1000000000" },
  },
  {
    id: "evt_002",
    streamId: "stream_001",
    type: "account",
    chainId: "sol_mainnet",
    blockNumber: 285_432_890,
    blockHash: "3wJ...7lM1",
    timestamp: new Date(Date.now() - 60000).toISOString(),
    data: { account: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", lamports: 5000000 },
  },
  {
    id: "evt_003",
    streamId: "stream_002",
    type: "log",
    chainId: "eth_mainnet",
    blockNumber: 19_842_105,
    blockHash: "0xabc...def",
    transactionHash: "0x123...456",
    timestamp: new Date(Date.now() - 15000).toISOString(),
    data: { address: "0xA0b86a33E6441e6C7D3D4B4f6c7E8F9a0B1c2D3e", topic: "Transfer" },
  },
];

const mockDeliveries: WebhookDelivery[] = [
  {
    id: "del_001",
    streamId: "stream_001",
    eventId: "evt_001",
    status: "delivered",
    httpStatus: 200,
    responseBody: "{\"status\":\"ok\"}",
    attempts: 1,
    createdAt: new Date(Date.now() - 30000).toISOString(),
    deliveredAt: new Date(Date.now() - 29900).toISOString(),
  },
  {
    id: "del_002",
    streamId: "stream_001",
    eventId: "evt_002",
    status: "delivered",
    httpStatus: 200,
    attempts: 1,
    createdAt: new Date(Date.now() - 60000).toISOString(),
    deliveredAt: new Date(Date.now() - 59900).toISOString(),
  },
  {
    id: "del_003",
    streamId: "stream_004",
    eventId: "evt_004",
    status: "failed",
    httpStatus: 503,
    responseBody: "Service Unavailable",
    attempts: 3,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    deliveredAt: null,
  },
];

export async function listStreams(): Promise<StreamConfig[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return [...mockStreams];
}

export async function listEvents(streamId?: string): Promise<StreamEvent[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (streamId) {
    return mockEvents.filter((e) => e.streamId === streamId);
  }
  return [...mockEvents];
}

export async function listDeliveries(streamId?: string): Promise<WebhookDelivery[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (streamId) {
    return mockDeliveries.filter((d) => d.streamId === streamId);
  }
  return [...mockDeliveries];
}
