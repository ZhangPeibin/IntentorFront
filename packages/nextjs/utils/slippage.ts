const SLIPPAGE_BPS = 100; // 1% = 100 basis points
const BPS_DENOMINATOR = 10000; // 100%

export function addSlippage(amount: bigint, slippageBps: number = SLIPPAGE_BPS): bigint {
  // amount * (1 + slippage)
  return (amount * BigInt(BPS_DENOMINATOR + slippageBps)) / BigInt(BPS_DENOMINATOR);
}
