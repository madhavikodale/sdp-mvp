"use server";

import type { SmartWallet } from "@sdp-mvp/types";

const MOCK_WALLETS: SmartWallet[] = [
  {
    id: "w_1",
    name: "Main Trading Wallet",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    chainId: "base_mainnet",
    chainName: "Base",
    type: "smart_contract",
    authMethods: ["passkey", "social"],
    isPasskeyEnabled: true,
    owners: ["0x71C7656EC7ab88b098defB751B7401B5f6d8976F"],
    balance: "4.25",
    usdValue: 12450.0,
    transactionCount: 342,
    createdAt: "2026-01-15T10:00:00Z",
    lastUsedAt: "2026-06-11T10:05:00Z",
  },
  {
    id: "w_2",
    name: "Team Treasury",
    address: "0x82D8767FD8ab99B098efGc852C851C2C6g7E9080",
    chainId: "eth_mainnet",
    chainName: "Ethereum",
    type: "multisig",
    authMethods: ["passkey", "email"],
    isPasskeyEnabled: true,
    owners: [
      "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      "0x93E9878GE9bc00C109fgHd963D962D3D7h8F0191",
      "0xA4F0989HF0cd11D210ghIe074E073E4E8i9G12a2",
    ],
    threshold: 2,
    balance: "12.8",
    usdValue: 38400.0,
    transactionCount: 89,
    createdAt: "2026-02-01T09:00:00Z",
    lastUsedAt: "2026-06-10T14:30:00Z",
  },
  {
    id: "w_3",
    name: "Solana DeFi Bot",
    address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    chainId: "sol_mainnet",
    chainName: "Solana",
    type: "smart_contract",
    authMethods: ["seed"],
    isPasskeyEnabled: false,
    owners: ["7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"],
    balance: "156.4",
    usdValue: 28152.0,
    transactionCount: 1204,
    createdAt: "2026-03-10T08:00:00Z",
    lastUsedAt: "2026-06-11T09:55:00Z",
  },
  {
    id: "w_4",
    name: "XDC Trade Account",
    address: "xdcA0b86a33E6441E6C7D3D4B4f6c7E8f9a0B1c2D3e",
    chainId: "xdc_mainnet",
    chainName: "XDC Network",
    type: "eoa",
    authMethods: ["email", "social"],
    isPasskeyEnabled: false,
    owners: ["xdcA0b86a33E6441E6C7D3D4B4f6c7E8f9a0B1c2D3e"],
    balance: "45000",
    usdValue: 2250.0,
    transactionCount: 56,
    createdAt: "2026-04-05T11:00:00Z",
    lastUsedAt: "2026-06-09T16:45:00Z",
  },
  {
    id: "w_5",
    name: "Arbitrum Gaming",
    address: "0xB1c2D3e4F5a6B7c8D9e0F1a2B3c4D5e6F7a8B9c0",
    chainId: "arb_mainnet",
    chainName: "Arbitrum One",
    type: "smart_contract",
    authMethods: ["passkey"],
    isPasskeyEnabled: true,
    owners: ["0xB1c2D3e4F5a6B7c8D9e0F1a2B3c4D5e6F7a8B9c0"],
    balance: "0.85",
    usdValue: 2550.0,
    transactionCount: 210,
    createdAt: "2026-05-20T13:00:00Z",
    lastUsedAt: "2026-06-11T08:20:00Z",
  },
];

export async function addWalletAction(formData: FormData): Promise<{ success: boolean; wallet?: { walletId: string; publicKey: string } }> {
  // Mock implementation
  return {
    success: true,
    wallet: {
      walletId: `w_${Math.random().toString(36).slice(2, 8)}`,
      publicKey: `pub_${Math.random().toString(36).slice(2, 12)}`,
    },
  };
}

export async function listWallets(): Promise<SmartWallet[]> {
  return MOCK_WALLETS;
}

export async function getWalletStats() {
  const totalValue = MOCK_WALLETS.reduce((s, w) => s + w.usdValue, 0);
  const passkeyCount = MOCK_WALLETS.filter((w) => w.isPasskeyEnabled).length;
  const smartContractCount = MOCK_WALLETS.filter((w) => w.type === "smart_contract").length;
  const multisigCount = MOCK_WALLETS.filter((w) => w.type === "multisig").length;
  const totalTx = MOCK_WALLETS.reduce((s, w) => s + w.transactionCount, 0);

  return {
    totalWallets: MOCK_WALLETS.length,
    totalValue,
    passkeyCount,
    smartContractCount,
    multisigCount,
    totalTransactions: totalTx,
  };
}
