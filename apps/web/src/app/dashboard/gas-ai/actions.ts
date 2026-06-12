"use server";

export async function getGasAiStats() {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return {
    avgSavings: 23.4,
    accuracy: 91.7,
    autoBids: 45231,
    annualSavings: 124500,
  };
}

export async function getPredictions() {
  return [
    { block: 312456789, predicted: 45000, actual: 42000, error: 7.1, action: "bid" as const },
    { block: 312456790, predicted: 38000, actual: 41000, error: -7.3, action: "bid" as const },
    { block: 312456791, predicted: 52000, actual: 48000, error: 8.3, action: "wait" as const },
    { block: 312456792, predicted: 35000, actual: 36000, error: -2.8, action: "bid" as const },
    { block: 312456793, predicted: 41000, actual: 39000, error: 5.1, action: "bid" as const },
    { block: 312456794, predicted: 68000, actual: 72000, error: -5.6, action: "wait" as const },
    { block: 312456795, predicted: 32000, actual: 31000, error: 3.2, action: "bid" as const },
    { block: 312456796, predicted: 29000, actual: 28000, error: 3.6, action: "bid" as const },
    { block: 312456797, predicted: 55000, actual: 58000, error: -5.2, action: "wait" as const },
    { block: 312456798, predicted: 42000, actual: 40000, error: 5.0, action: "bid" as const },
  ];
}

export async function getSavingsReport() {
  return {
    today: 450,
    thisWeek: 2890,
    thisMonth: 12450,
    cumulative: 89340,
    daily: [
      { label: "Jun 2", saved: 320 }, { label: "Jun 3", saved: 280 }, { label: "Jun 4", saved: 410 },
      { label: "Jun 5", saved: 350 }, { label: "Jun 6", saved: 290 }, { label: "Jun 7", saved: 380 },
      { label: "Jun 8", saved: 420 }, { label: "Jun 9", saved: 310 }, { label: "Jun 10", saved: 390 },
      { label: "Jun 11", saved: 450 },
    ],
  };
}
