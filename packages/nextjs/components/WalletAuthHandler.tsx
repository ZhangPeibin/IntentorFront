"use client";

import { useEffect } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { useVerify } from "~~/hooks/useVerify";

export const WalletAuthHandler = () => {
  const { isConnected, address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { verify, error, clearError } = useVerify();

  useEffect(() => {
    const login = async () => {
      if (isConnected && address && chainId) {
        try {
          await verify({
            user: {
              address,
              signMessage: async msg => await signMessageAsync({ message: msg }),
            },
            chainId,
          });
        } catch (error) {
          console.error("Verification failed:", error);
        }
      }
    };

    login();
  }, [isConnected, address, chainId]);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        clearError();
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [error, clearError]);

  return error ? (
    <div className="toast toast-center toast-end">
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    </div>
  ) : null;
};
