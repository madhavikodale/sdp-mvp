"use server";

import type { ApiDocCategory, CodeLanguage } from "@sdp-mvp/types";

const MOCK_DOCS: ApiDocCategory[] = [
  {
    id: "rpc",
    name: "RPC Endpoints",
    description: "Multi-chain RPC infrastructure with automatic failover",
    endpoints: [
      {
        id: "rpc_send",
        method: "POST",
        path: "/v1/rpc/{chainId}",
        summary: "Send RPC request",
        description: "Send a JSON-RPC request to the specified chain. Supports all standard Ethereum and Solana RPC methods.",
        tags: ["rpc"],
        parameters: [
          { name: "chainId", in: "path", required: true, type: "string", description: "Chain identifier (e.g., eth_mainnet, sol_mainnet)", example: "eth_mainnet" },
          { name: "X-API-Key", in: "header", required: true, type: "string", description: "Your SDP API key", example: "sdp_live_abc123..." },
        ],
        requestBody: {
          contentType: "application/json",
          schema: { jsonrpc: "2.0", method: "eth_sendTransaction", params: [], id: 1 },
          example: { jsonrpc: "2.0", method: "eth_getBalance", params: ["0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", "latest"], id: 1 },
        },
        responses: [
          { status: 200, description: "Successful RPC response", example: { jsonrpc: "2.0", result: "0x1a055690d9db80000", id: 1 } },
          { status: 401, description: "Invalid or missing API key" },
          { status: 429, description: "Rate limit exceeded" },
        ],
        codeExamples: [
          {
            language: "curl",
            code: `curl -X POST https://api.sdp.io/v1/rpc/eth_mainnet \\\
  -H "X-API-Key: sdp_live_abc123..." \\\
  -H "Content-Type: application/json" \\\
  -d '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0x742d...\",\"latest\"],\"id\":1}'`,
          },
          {
            language: "javascript",
            code: `const response = await fetch('https://api.sdp.io/v1/rpc/eth_mainnet', {
  method: 'POST',
  headers: {
    'X-API-Key': 'sdp_live_abc123...',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_getBalance',
    params: ['0x742d...', 'latest'],
    id: 1,
  }),
});
const data = await response.json();
console.log(data.result);`,
          },
          {
            language: "python",
            code: `import requests

response = requests.post(
    'https://api.sdp.io/v1/rpc/eth_mainnet',
    headers={'X-API-Key': 'sdp_live_abc123...'},
    json={
        'jsonrpc': '2.0',
        'method': 'eth_getBalance',
        'params': ['0x742d...', 'latest'],
        'id': 1
    }
)
data = response.json()
print(data['result'])`,
          },
          {
            language: "rust",
            code: `use reqwest::Client;
use serde_json::json;

let client = Client::new();
let response = client
    .post("https://api.sdp.io/v1/rpc/eth_mainnet")
    .header("X-API-Key", "sdp_live_abc123...")
    .json(\u0026json!({
        "jsonrpc": "2.0",
        "method": "eth_getBalance",
        "params": ["0x742d...", "latest"],
        "id": 1
    }))
    .send()
    .await?;
let data: serde_json::Value = response.json().await?;
println!("{}", data["result"]);`,
          },
        ],
      },
      {
        id: "rpc_health",
        method: "GET",
        path: "/v1/rpc/health",
        summary: "Check RPC health",
        description: "Get the health status of all RPC endpoints across supported chains.",
        tags: ["rpc"],
        parameters: [
          { name: "X-API-Key", in: "header", required: true, type: "string", description: "Your SDP API key" },
        ],
        responses: [
          { status: 200, description: "Health status of all endpoints", example: { chains: [{ chainId: "eth_mainnet", status: "healthy", latencyMs: 45 }] } },
        ],
        codeExamples: [
          {
            language: "curl",
            code: `curl https://api.sdp.io/v1/rpc/health \\\
  -H "X-API-Key: sdp_live_abc123..."`,
          },
          {
            language: "javascript",
            code: `const response = await fetch('https://api.sdp.io/v1/rpc/health', {
  headers: { 'X-API-Key': 'sdp_live_abc123...' },
});
const health = await response.json();
console.log(health.chains);`,
          },
        ],
      },
    ],
  },
  {
    id: "gasless",
    name: "Gasless Transactions",
    description: "Paymaster sponsorship for gasless transactions",
    endpoints: [
      {
        id: "gasless_send",
        method: "POST",
        path: "/v1/gasless/send",
        summary: "Send gasless transaction",
        description: "Submit a transaction to be sponsored by a paymaster. The user does not need to hold gas tokens.",
        tags: ["gasless"],
        parameters: [
          { name: "X-API-Key", in: "header", required: true, type: "string", description: "Your SDP API key" },
        ],
        requestBody: {
          contentType: "application/json",
          schema: { userAddress: "string", targetContract: "string", method: "string", params: [] },
          example: { userAddress: "0x742d...", targetContract: "0xA0b86...", method: "transfer", params: ["0x1234...", "1000000000"] },
        },
        responses: [
          { status: 200, description: "Transaction sponsored successfully", example: { txHash: "0xabc...", status: "pending", sponsoredAt: "2026-06-12T10:35:00Z" } },
          { status: 400, description: "Invalid transaction parameters" },
          { status: 402, description: "Paymaster budget exhausted" },
        ],
        codeExamples: [
          {
            language: "curl",
            code: `curl -X POST https://api.sdp.io/v1/gasless/send \\\
  -H "X-API-Key: sdp_live_abc123..." \\\
  -H "Content-Type: application/json" \\\
  -d '{\"userAddress\":\"0x742d...\",\"targetContract\":\"0xA0b86...\",\"method\":\"transfer\",\"params\":[\"0x1234...\",\"1000000000\"]}'`,
          },
          {
            language: "javascript",
            code: `const response = await fetch('https://api.sdp.io/v1/gasless/send', {
  method: 'POST',
  headers: {
    'X-API-Key': 'sdp_live_abc123...',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userAddress: '0x742d...',
    targetContract: '0xA0b86...',
    method: 'transfer',
    params: ['0x1234...', '1000000000'],
  }),
});
const result = await response.json();
console.log(result.txHash);`,
          },
        ],
      },
    ],
  },
  {
    id: "bridge",
    name: "Cross-Chain Bridge",
    description: "Unified bridge orchestration across supported chains",
    endpoints: [
      {
        id: "bridge_quote",
        method: "POST",
        path: "/v1/bridge/quote",
        summary: "Get bridge quote",
        description: "Get a quote for bridging tokens between chains including fees, slippage, and estimated time.",
        tags: ["bridge"],
        parameters: [
          { name: "X-API-Key", in: "header", required: true, type: "string", description: "Your SDP API key" },
        ],
        requestBody: {
          contentType: "application/json",
          schema: { sourceChain: "string", targetChain: "string", token: "string", amount: "string" },
          example: { sourceChain: "eth_mainnet", targetChain: "sol_mainnet", token: "USDC", amount: "1000" },
        },
        responses: [
          { status: 200, description: "Bridge quote", example: { fee: 2.5, slippage: 0.1, estimatedTime: 900, amountOut: "997.5" } },
        ],
        codeExamples: [
          {
            language: "curl",
            code: `curl -X POST https://api.sdp.io/v1/bridge/quote \\\
  -H "X-API-Key: sdp_live_abc123..." \\\
  -H "Content-Type: application/json" \\\
  -d '{\"sourceChain\":\"eth_mainnet\",\"targetChain\":\"sol_mainnet\",\"token\":\"USDC\",\"amount\":\"1000\"}'`,
          },
        ],
      },
    ],
  },
  {
    id: "streams",
    name: "Streams & Webhooks",
    description: "Real-time blockchain data via webhooks, websockets, and gRPC",
    endpoints: [
      {
        id: "streams_create",
        method: "POST",
        path: "/v1/streams",
        summary: "Create stream",
        description: "Create a new stream to receive real-time blockchain events via webhook, websocket, or gRPC.",
        tags: ["streams"],
        parameters: [
          { name: "X-API-Key", in: "header", required: true, type: "string", description: "Your SDP API key" },
        ],
        requestBody: {
          contentType: "application/json",
          schema: { name: "string", chainId: "string", eventTypes: [], destination: {} },
          example: { name: "USDC Transfers", chainId: "eth_mainnet", eventTypes: ["token_transfer"], destination: { url: "https://your-app.com/webhook" } },
        },
        responses: [
          { status: 201, description: "Stream created", example: { id: "stream_123", status: "active", webhookUrl: "https://your-app.com/webhook" } },
        ],
        codeExamples: [
          {
            language: "curl",
            code: `curl -X POST https://api.sdp.io/v1/streams \\\
  -H "X-API-Key: sdp_live_abc123..." \\\
  -H "Content-Type: application/json" \\\
  -d '{\"name\":\"USDC Transfers\",\"chainId\":\"eth_mainnet\",\"eventTypes\":[\"token_transfer\"],\"destination\":{\"url\":\"https://your-app.com/webhook\"}}'`,
          },
        ],
      },
    ],
  },
  {
    id: "intents",
    name: "AI Intents",
    description: "Natural language transaction execution",
    endpoints: [
      {
        id: "intents_execute",
        method: "POST",
        path: "/v1/intents",
        summary: "Execute intent",
        description: "Submit a natural language intent to be parsed, simulated, and executed automatically.",
        tags: ["intents"],
        parameters: [
          { name: "X-API-Key", in: "header", required: true, type: "string", description: "Your SDP API key" },
        ],
        requestBody: {
          contentType: "application/json",
          schema: { intent: "string", walletId: "string" },
          example: { intent: "Send 50 USDC to alice.eth on Base", walletId: "wallet_123" },
        },
        responses: [
          { status: 200, description: "Intent executed", example: { id: "int_123", status: "executed", txHash: "0xabc...", parsedAction: "transfer" } },
        ],
        codeExamples: [
          {
            language: "curl",
            code: `curl -X POST https://api.sdp.io/v1/intents \\\
  -H "X-API-Key: sdp_live_abc123..." \\\
  -H "Content-Type: application/json" \\\
  -d '{\"intent\":\"Send 50 USDC to alice.eth on Base\",\"walletId\":\"wallet_123\"}'`,
          },
          {
            language: "javascript",
            code: `const response = await fetch('https://api.sdp.io/v1/intents', {
  method: 'POST',
  headers: {
    'X-API-Key': 'sdp_live_abc123...',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    intent: 'Send 50 USDC to alice.eth on Base',
    walletId: 'wallet_123',
  }),
});
const result = await response.json();
console.log(result.txHash);`,
          },
        ],
      },
    ],
  },
];

export async function listApiDocs(): Promise<ApiDocCategory[]> {
  return MOCK_DOCS;
}
