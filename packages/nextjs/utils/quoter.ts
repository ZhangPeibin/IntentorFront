import { ZERO_ADDRESS } from "./scaffold-eth/common";
import { addSlippage } from "./slippage";
import { erc20Abi, parseUnits } from "viem";
import {
  getAccount,
  getBalance,
  getPublicClient,
  getToken,
  waitForTransactionReceipt,
  writeContract,
} from "wagmi/actions";
import { AIExecutorABI } from "~~/contracts/abi/AIExecutorABI";
import { FeeABI } from "~~/contracts/abi/FeeABI";
import { QUOTER_ABI } from "~~/contracts/abi/QuoterABI";
import { AIEXECUTOR_ADDRESS, FEE_CONTRACT_ADDRESS, QUOTER_ADDRESS } from "~~/contracts/contracts";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const publicClient = getPublicClient(wagmiConfig);

export interface TokenInfo {
  symbol: string;
  address: string;
  amount: string;
}

export interface Intent {
  chainId: number;
  platform: string;
  amountType: "from" | "to";
  fromToken: TokenInfo[];
  toToken: TokenInfo;
}

export const fetchTokenInfo = async (token: string) => {
  const tokenInfo = await getToken(wagmiConfig, {
    address: token,
    formatUnits: "ether",
  });
  return tokenInfo;
};

export const fetchFee = async (user: string, token: string, amount: number) => {
  console.log("Token:", token);
  console.log("Amount:", amount);
  const result = await publicClient.readContract({
    address: FEE_CONTRACT_ADDRESS,
    abi: FeeABI,
    functionName: "estimateFee",
    args: [user, token, amount],
  });
  console.log("Fee Result:", result);
  return result as bigint;
};

export const execute = async (
  intent: Intent,
  setStep: React.Dispatch<React.SetStateAction<string>>,
  setError: React.Dispatch<React.SetStateAction<string>>,
) => {
  setStep("Fetch tokens Infos");

  const publicClient = getPublicClient(wagmiConfig);
  const account = getAccount(wagmiConfig);
  const userAddress = account.address as any;

  const token0 = intent.fromToken[0].address;
  const token1 = intent.toToken.address;
  let functionName;
  let amount = 0n;
  let quoteInput;
  if (intent.amountType === "from") {
    functionName = "quoteExactInput";
    const tokenInfo = await fetchTokenInfo(intent.fromToken[0].address);
    const decimals = tokenInfo.decimals ?? 18;
    amount = intent.fromToken.reduce((acc, t) => acc + parseUnits(t.amount, decimals), 0n);
    const fee = await fetchFee(userAddress, token0, Number(amount));
    quoteInput = {
      tokenIn: token0,
      tokenOut: token1,
      amount: amount - fee,
      dex: 0,
    };
  } else {
    functionName = "quoteExactOutput";
    const tokenInfo = await fetchTokenInfo(intent.toToken.address);
    const decimals = tokenInfo.decimals ?? 18;
    amount = parseUnits(intent.toToken.amount, decimals ?? 18);
    quoteInput = {
      tokenIn: token0,
      tokenOut: token1,
      amount: amount,
      dex: 0,
    };
  }

  setStep("Fetch quote ");
  const quoterRes = (await publicClient.readContract({
    address: QUOTER_ADDRESS,
    abi: QUOTER_ABI,
    functionName: functionName,
    args: [quoteInput],
  })) as any;
  console.log("Quote Result:", quoterRes);

  let quoterAmount = 0n;
  if (intent.amountType === "from") {
    quoterAmount = quoterRes[0];
  } else {
    // to
    quoterAmount = quoterRes[0];
    const fee = await fetchFee(userAddress, token0, Number(quoterAmount));
    quoterAmount = quoterAmount + fee;
  }
  const poolFee = quoterRes[1];

  if (token0 !== ZERO_ADDRESS) {
    const balance = await getBalance(wagmiConfig, {
      address: userAddress,
      token: token0,
    });
    console.log("💰 token from  Address:", token0);
    console.log("💰 token from  Balance:", balance);
    if (intent.amountType === "from") {
      if (balance.value < amount) {
        setError("Insufficient_balance");
        setStep("");
        return;
      }
    } else {
      if (balance.value < quoterAmount) {
        setError("Insufficient_balance");
        setStep("");
        return;
      }
    }

    const allowance = await publicClient.readContract({
      address: token0,
      abi: erc20Abi,
      functionName: "allowance",
      args: [userAddress, AIEXECUTOR_ADDRESS],
    });
    console.log("💰 token from  Allowance:", allowance);
    if (allowance < balance.value) {
      setStep("Approving..");

      try {
        const result = await writeContract(wagmiConfig, {
          abi: erc20Abi,
          address: token0,
          functionName: "approve",
          args: [AIEXECUTOR_ADDRESS, balance.value],
        });

        console.log("✅ Approval sent:", result);

        // 等待上链确认（可选）
        const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
          hash: result,
        });
        console.log("🎯 Approval confirmed:", txReceipt);
      } catch (err: any) {
        if (err?.name === "UserRejectedRequestError") {
          console.warn("🚫 User rejected transaction");
          setError("User_rejected");
        } else {
          console.error("❌ Approval failed:", err);
          setError("Approval_failed");
        }
      }
    }

    setStep("Executing intent...");
    let swapParams = {};
    if (intent.amountType === "from") {
      swapParams = {
        amount: amount, // 1 USDT
        amountMinout: quoterAmount, // 最小输出金额
        fromToken: token0, // USDT
        toToken: token1,
        refundTo: userAddress,
        poolFee: poolFee,
        chainId: account.chainId, // BSC Chain ID
        exactInput: true,
        dex: 0,
      };
    } else {
      swapParams = {
        amount: addSlippage(quoterAmount), // 1 USDT
        amountMinout: amount,
        fromToken: token0,
        toToken: token1,
        refundTo: userAddress,
        poolFee: poolFee,
        chainId: account.chainId,
        exactInput: false,
        dex: 0,
      };
    }
    console.log("Swap Params:", swapParams);
    let txResult = null;
    try {
      // setStatus('⏳ Executing transaction...');
      txResult = await writeContract(wagmiConfig, {
        abi: AIExecutorABI,
        address: AIEXECUTOR_ADDRESS,
        functionName: "execute",
        args: [swapParams],
      });
      console.log("✅ Execute transaction sent:", txResult);
      // setStatus('✅ Transaction sent, waiting for confirmation...');

      // 等待上链确认
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: txResult,
      });
      console.log("🎉 Transaction confirmed:", receipt);
      // setStatus('🎉 Transaction confirmed!');
    } catch (err: any) {
      console.error("❌ Execute transaction failed or rejected:", err);
      if (err?.code === 4001) {
        // setStatus('🚫 Transaction rejected by user');
        setError("User_rejected");
      } else {
        setError("Transaction_failed");
        // setStatus(`❌ Transaction failed: ${err.message || err}`);
      }
    } finally {
      setStep("");
    }
  }
};
