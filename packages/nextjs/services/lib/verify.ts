// lib/verify.ts
import apiClient from "./apiClient";

export type IntentInfo = {
  message: string;
  wallet: string;
};

export async function getSignInfo(address: string, chainId: number) {
  const res = await apiClient.get("/api/verify/signInfo", {
    params: { address, chainId },
  });
  return res.data;
}

export async function verifySignature(message: string, signature: string, address: string, chainId: number) {
  const res = await apiClient.post("/api/verify", { message, signature, address, chainId });
  return res.data; // { token }
}

export async function intentRequest(intent: IntentInfo, chainId: number) {
  const res = await apiClient.post("/api/intent", {
    ...intent,
    address: intent.wallet,
    chainId: chainId,
  });

  return res.data;
}
