import { Intent, TokenInfo } from "./quoter";
import { isAddress } from "viem";

function isValidAddress(address: string): boolean {
  return isAddress(address);
}

function validateTokenInfo(token: TokenInfo): boolean {
  if (!token) return false;
  if (!token.symbol || token.symbol.trim() === "") return false;
  if (!isValidAddress(token.address)) return false;
  return true;
}

export const validateIntent = (intent: Intent): boolean => {
  console.log("Validating intent:", intent);
  if (!intent) return false;
  if (intent.chainId <= 0) return false;
  if (!intent.platform || intent.platform.trim() === "") return false;
  if (intent.amountType !== "from" && intent.amountType !== "to") return false;

  if (!Array.isArray(intent.fromToken) || intent.fromToken.length === 0) return false;
  if (!intent.fromToken.every(validateTokenInfo)) return false;

  if (!validateTokenInfo(intent.toToken)) return false;

  return true;
};
