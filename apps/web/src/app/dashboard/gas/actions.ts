"use server";

import type { GasPrediction } from "@sdp-mvp/types";

const MOCK_PREDICTIONS: GasPrediction[] = [
  {
    chainId: "eth_mainnet",
    currentGasPrice: 28.5,
    predictedGasPrice: 18.2,
    confidence: 0.87,
    recommendedAction: "wait",
    estimatedSavings: 36.1,
    timeToOptimal: 45,
    historicalData: [
      { timestamp: "00:00", price: 32 },
      { timestamp: "04:00", price: 24 },
      { timestamp: "08:00", price: 45 },
      { timestamp: "12:00", price: 38 },
      { timestamp: "16:00", price: 28.5 },
      { timestamp: "20:00", price: 18.2 },
    ],
  },
  {
    chainId: "base_mainnet",
    currentGasPrice: 0.12,
    predictedGasPrice: 0.15,
    confidence: 0.72,
    recommendedAction: "execute_now",
    estimatedSavings: 0,
    timeToOptimal: 0,
    historicalData: [
      { timestamp: "00:00", price: 0.08 },
      { timestamp: "04:00", price: 0.06 },
      { timestamp: "08:00", price: 0.14 },
      { timestamp: "12:00", price: 0.11 },
      { timestamp: "16:00", price: 0.12 },
      { timestamp: "20:00", price: 0.15 },
    ],
  },
  {
    chainId: "arb_mainnet",
    currentGasPrice: 0.08,
    predictedGasPrice: 0.05,
    confidence: 0.91,
    recommendedAction: "wait",
    estimatedSavings: 37.5,
    timeToOptimal: 30,
    historicalData: [
      { timestamp: "00:00", price: 0.06 },
      { timestamp: "04:00", price: 0.04 },
      { timestamp: "08:00", price: 0.12 },
      { timestamp: "12:00", price: 0.09 },
      { timestamp: "16:00", price: 0.08 },
      { timestamp: "20:00", price: 0.05 },
    ],
  },
  {
    chainId: "sol_mainnet",
    currentGasPrice: 0.00005,
    predictedGasPrice: 0.000045,
    confidence: 0.78,
    recommendedAction: "speed_up",
    estimatedSavings: 10,
    timeToOptimal: 5,
    historicalData: [
      { timestamp: "00:00", price: 0.00004 },
      { timestamp: "04:00", price: 0.000035 },
      { timestamp: "08:00", price: 0.00007 },
      { timestamp: "12:00", price: 0.000055 },
      { timestamp: "16:00", price: 0.00005 },
      { timestamp: "20:00", price: 0.000045 },
    ],
  },
];

export async function listGasPredictions(): Promise<GasPrediction[]> {
  return MOCK_PREDICTIONS;
}

export async function getGasStats() {
  const avgConfidence =
    MOCK_PREDICTIONS.reduce((s, p) => s + p.confidence, 0) /
    MOCK_PREDICTIONS.length;
  const totalSavings = MOCK_PREDICTIONS.reduce(
    (s, p) => s + p.estimatedSavings,
    0
  );
  const waitCount = MOCK_PREDICTIONS.filter(
    (p) => p.recommendedAction === "wait"
  ).length;

  return {
    avgConfidence: Math.round(avgConfidence * 100),
    totalSavings: Math.round(totalSavings),
    chainsMonitored: MOCK_PREDICTIONS.length,
    waitRecommendations: waitCount,
  };
}
