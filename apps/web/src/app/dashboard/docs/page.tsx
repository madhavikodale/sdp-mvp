"use client";

import {
  BookOpen,
  Code,
  Copy,
  Check,
  ChevronRight,
  Terminal,
  Globe,
  Zap,
  Radio,
  Brain,
  ArrowRightLeft,
  Flame,
  Shield,
  Rocket,
  Bell,
} from "lucide-react";
import { useState } from "react";
import type { ApiDocCategory, CodeLanguage, ApiEndpointDoc } from "@sdp-mvp/types";

const LANGUAGE_CONFIG: Record<CodeLanguage, { label: string; icon: React.ReactNode; color: string }> = {
  curl: { label: "cURL", icon: <Terminal className="w-4 h-4" />, color: "text-slate-300" },
  javascript: { label: "JavaScript", icon: <Code className="w-4 h-4" />, color: "text-yellow-400" },
  python: { label: "Python", icon: <Code className="w-4 h-4" />, color: "text-blue-400" },
  rust: { label: "Rust", icon: <Code className="w-4 h-4" />, color: "text-orange-400" },
  go: { label: "Go", icon: <Code className="w-4 h-4" />, color: "text-cyan-400" },
  ruby: { label: "Ruby", icon: <Code className="w-4 h-4" />, color: "text-red-400" },
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  rpc: <Globe className="w-5 h-5" />,
  gasless: <Flame className="w-5 h-5" />,
  bridge: <ArrowRightLeft className="w-5 h-5" />,
  streams: <Radio className="w-5 h-5" />,
  intents: <Brain className="w-5 h-5" />,
  mev: <Shield className="w-5 h-5" />,
  acceleration: <Rocket className="w-5 h-5" />,
  alerts: <Bell className="w-5 h-5" />,
};

export default function DocsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("rpc");
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<CodeLanguage>("curl");
  const [copied, setCopied] = useState(false);

  // Inline mock data to avoid async in client component
  const categories: ApiDocCategory[] = [
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
            { name: "chainId", in: "path", required: true, type: "string", description: "Chain identifier", example: "eth_mainnet" },
            { name: "X-API-Key", in: "header", required: true, type: "string", description: "Your SDP API key", example: "sdp_live_abc123..." },
          ],
          requestBody: {
            contentType: "application/json",
            schema: {},
            example: { jsonrpc: "2.0", method: "eth_getBalance", params: ["0x742d...", "latest"], id: 1 },
          },
          responses: [
            { status: 200, description: "Successful RPC response", example: { jsonrpc: "2.0", result: "0x1a055690d9db80000", id: 1 } },
            { status: 401, description: "Invalid or missing API key" },
            { status: 429, description: "Rate limit exceeded" },
          ],
          codeExamples: [
            {
              language: "curl",
              code: `curl -X POST https://api.sdp.io/v1/rpc/eth_mainnet \\\n  -H "X-API-Key: sdp_live_abc123..." \\\n  -H "Content-Type: application/json" \\\n  -d '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x742d...","latest"],"id":1}'`,
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
              code: `let client = reqwest::Client::new();
let response = client
    .post("https://api.sdp.io/v1/rpc/eth_mainnet")
    .header("X-API-Key", "sdp_live_abc123...")
    .json(&json!({
        "jsonrpc": "2.0",
        "method": "eth_getBalance",
        "params": ["0x742d...", "latest"],
        "id": 1
    }))
    .send()
    .await?;`,
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
            { status: 200, description: "Health status", example: { chains: [{ chainId: "eth_mainnet", status: "healthy", latencyMs: 45 }] } },
          ],
          codeExamples: [
            {
              language: "curl",
              code: `curl https://api.sdp.io/v1/rpc/health \\\n  -H "X-API-Key: sdp_live_abc123..."`,
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
          description: "Submit a transaction to be sponsored by a paymaster.",
          tags: ["gasless"],
          parameters: [
            { name: "X-API-Key", in: "header", required: true, type: "string", description: "Your SDP API key" },
          ],
          requestBody: {
            contentType: "application/json",
            schema: {},
            example: { userAddress: "0x742d...", targetContract: "0xA0b86...", method: "transfer", params: ["0x1234...", "1000000000"] },
          },
          responses: [
            { status: 200, description: "Transaction sponsored", example: { txHash: "0xabc...", status: "pending" } },
            { status: 402, description: "Paymaster budget exhausted" },
          ],
          codeExamples: [
            {
              language: "curl",
              code: `curl -X POST https://api.sdp.io/v1/gasless/send \\\n  -H "X-API-Key: sdp_live_abc123..." \\\n  -H "Content-Type: application/json" \\\n  -d '{"userAddress":"0x742d...","targetContract":"0xA0b86...","method":"transfer","params":["0x1234...","1000000000"]}'`,
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
});`,
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
          description: "Get a quote for bridging tokens between chains.",
          tags: ["bridge"],
          parameters: [
            { name: "X-API-Key", in: "header", required: true, type: "string", description: "Your SDP API key" },
          ],
          requestBody: {
            contentType: "application/json",
            schema: {},
            example: { sourceChain: "eth_mainnet", targetChain: "sol_mainnet", token: "USDC", amount: "1000" },
          },
          responses: [
            { status: 200, description: "Bridge quote", example: { fee: 2.5, slippage: 0.1, estimatedTime: 900, amountOut: "997.5" } },
          ],
          codeExamples: [
            {
              language: "curl",
              code: `curl -X POST https://api.sdp.io/v1/bridge/quote \\\n  -H "X-API-Key: sdp_live_abc123..." \\\n  -H "Content-Type: application/json" \\\n  -d '{"sourceChain":"eth_mainnet","targetChain":"sol_mainnet","token":"USDC","amount":"1000"}'`,
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
          description: "Create a new stream to receive real-time blockchain events.",
          tags: ["streams"],
          parameters: [
            { name: "X-API-Key", in: "header", required: true, type: "string", description: "Your SDP API key" },
          ],
          requestBody: {
            contentType: "application/json",
            schema: {},
            example: { name: "USDC Transfers", chainId: "eth_mainnet", eventTypes: ["token_transfer"], destination: { url: "https://your-app.com/webhook" } },
          },
          responses: [
            { status: 201, description: "Stream created", example: { id: "stream_123", status: "active" } },
          ],
          codeExamples: [
            {
              language: "curl",
              code: `curl -X POST https://api.sdp.io/v1/streams \\\n  -H "X-API-Key: sdp_live_abc123..." \\\n  -H "Content-Type: application/json" \\\n  -d '{"name":"USDC Transfers","chainId":"eth_mainnet","eventTypes":["token_transfer"],"destination":{"url":"https://your-app.com/webhook"}}'`,
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
          description: "Submit a natural language intent to be parsed, simulated, and executed.",
          tags: ["intents"],
          parameters: [
            { name: "X-API-Key", in: "header", required: true, type: "string", description: "Your SDP API key" },
          ],
          requestBody: {
            contentType: "application/json",
            schema: {},
            example: { intent: "Send 50 USDC to alice.eth on Base", walletId: "wallet_123" },
          },
          responses: [
            { status: 200, description: "Intent executed", example: { id: "int_123", status: "executed", txHash: "0xabc..." } },
          ],
          codeExamples: [
            {
              language: "curl",
              code: `curl -X POST https://api.sdp.io/v1/intents \\\n  -H "X-API-Key: sdp_live_abc123..." \\\n  -H "Content-Type: application/json" \\\n  -d '{"intent":"Send 50 USDC to alice.eth on Base","walletId":"wallet_123"}'`,
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

  const activeCategory = categories.find((c) => c.id === selectedCategory);
  const activeEndpoint = activeCategory?.endpoints.find((e) => e.id === selectedEndpoint);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">API Documentation</h1>
          <p className="text-sm text-slate-400 mt-1">
            Interactive API reference with code examples in multiple languages
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedEndpoint(null);
              }}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedCategory === cat.id
                  ? "bg-sky-500/10 border-sky-500/30"
                  : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`${selectedCategory === cat.id ? "text-sky-400" : "text-slate-400"}`}>
                  {CATEGORY_ICONS[cat.id] || <BookOpen className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className={`text-sm font-medium ${selectedCategory === cat.id ? "text-white" : "text-slate-300"}`}>
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.endpoints.length} endpoints</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeCategory && (
            <>
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <div className="text-sky-400">{CATEGORY_ICONS[activeCategory.id] || <BookOpen className="w-6 h-6" />}</div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{activeCategory.name}</h2>
                    <p className="text-sm text-slate-400">{activeCategory.description}</p>
                  </div>
                </div>
              </div>

              {/* Endpoints List */}
              <div className="space-y-4">
                {activeCategory.endpoints.map((endpoint) => (
                  <div
                    key={endpoint.id}
                    className={`bg-slate-900/50 border rounded-xl overflow-hidden transition-all ${
                      selectedEndpoint === endpoint.id ? "border-sky-500/30" : "border-slate-800"
                    }`}
                  >
                    <button
                      onClick={() => setSelectedEndpoint(selectedEndpoint === endpoint.id ? null : endpoint.id)}
                      className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                          endpoint.method === "GET" ? "bg-emerald-500/10 text-emerald-400" :
                          endpoint.method === "POST" ? "bg-sky-500/10 text-sky-400" :
                          endpoint.method === "PUT" ? "bg-amber-500/10 text-amber-400" :
                          "bg-red-500/10 text-red-400"
                        }`}>
                          {endpoint.method}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-white">{endpoint.summary}</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{endpoint.path}</p>
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-slate-500 transition-transform ${selectedEndpoint === endpoint.id ? "rotate-90" : ""}`} />
                    </button>

                    {selectedEndpoint === endpoint.id && (
                      <div className="px-6 pb-6 border-t border-slate-800">
                        <p className="text-sm text-slate-400 mt-4">{endpoint.description}</p>

                        {/* Parameters */}
                        {endpoint.parameters.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold text-white mb-2">Parameters</h4>
                            <div className="space-y-2">
                              {endpoint.parameters.map((param) => (
                                <div key={param.name} className="flex items-start gap-3 p-3 bg-slate-950/50 rounded-lg">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-mono text-sky-400">{param.name}</span>
                                      {param.required && <span className="text-xs text-red-400">required</span>}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">{param.description}</p>
                                    {param.example && (
                                      <p className="text-xs text-slate-600 mt-0.5">Example: {param.example}</p>
                                    )}
                                  </div>
                                  <span className="ml-auto text-xs text-slate-500 capitalize">{param.in}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Request Body */}
                        {endpoint.requestBody && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold text-white mb-2">Request Body</h4>
                            <pre className="bg-slate-950 rounded-lg p-3 overflow-x-auto">
                              <code className="text-xs text-slate-300 font-mono">
                                {JSON.stringify(endpoint.requestBody.example, null, 2)}
                              </code>
                            </pre>
                          </div>
                        )}

                        {/* Responses */}
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-white mb-2">Responses</h4>
                          <div className="space-y-2">
                            {endpoint.responses.map((resp) => (
                              <div key={resp.status} className="flex items-start gap-3 p-3 bg-slate-950/50 rounded-lg">
                                <span className={`text-sm font-bold ${
                                  resp.status < 300 ? "text-emerald-400" :
                                  resp.status < 400 ? "text-amber-400" :
                                  "text-red-400"
                                }`}>
                                  {resp.status}
                                </span>
                                <div>
                                  <p className="text-sm text-slate-300">{resp.description}</p>
                                  {resp.example && (
                                    <pre className="mt-2 bg-slate-950 rounded p-2 overflow-x-auto">
                                      <code className="text-xs text-slate-400 font-mono">
                                        {JSON.stringify(resp.example, null, 2)}
                                      </code>
                                    </pre>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Code Examples */}
                        <div className="mt-6">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-white">Code Examples</h4>
                            <div className="flex items-center gap-1">
                              {endpoint.codeExamples.map((ex) => (
                                <button
                                  key={ex.language}
                                  onClick={() => setSelectedLang(ex.language)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                    selectedLang === ex.language
                                      ? "bg-sky-500/20 text-sky-400"
                                      : "text-slate-500 hover:text-slate-300"
                                  }`}
                                >
                                  {LANGUAGE_CONFIG[ex.language]?.label || ex.language}
                                </button>
                              ))}
                            </div>
                          </div>
                          {endpoint.codeExamples
                            .filter((ex) => ex.language === selectedLang)
                            .map((ex) => (
                              <div key={ex.language} className="relative">
                                <button
                                  onClick={() => handleCopy(ex.code)}
                                  className="absolute top-3 right-3 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                                >
                                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                                </button>
                                <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-x-auto">
                                  <code className="text-xs text-slate-300 font-mono whitespace-pre">{ex.code}</code>
                                </pre>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
