import { useCallback, useState } from "react";
import { getSignInfo, verifySignature } from "~~/services/lib/verify";
import { useAuthStore } from "~~/store/useAuthStore";

type UseVerifyParams = {
  user: {
    address: string;
    signMessage: (msg: string) => Promise<string>;
  };
  chainId: number;
};

export function useVerify() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setToken = useAuthStore(state => state.setToken);
  const verify = useCallback(async ({ user, chainId }: UseVerifyParams) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getSignInfo(user.address, chainId);
      const { nonce, siwe } = data;
      console.log("🌀 Nonce:", nonce);
      console.log("📜 SIWE message:", siwe);
      if (!nonce || !siwe) {
        const errorMessage = data.error || "获取签名信息失败";
        setError(errorMessage);
        return;
      }

      const signature = await user.signMessage(siwe);
      console.log("✍️ Signature:", signature);

      const { token } = await verifySignature(siwe, signature, user.address, chainId);
      console.log("✅ JWT Token:", token);

      setToken(token);
      return { token };
    } catch (err: any) {
      console.error("❌ Verification failed:", err);
      setError(err?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = () => setError(null); // ✅ 添加此方法

  return {
    verify,
    loading,
    error,
    clearError,
  };
}
