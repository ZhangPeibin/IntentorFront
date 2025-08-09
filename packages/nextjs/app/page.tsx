"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { intentRequest } from "~~/services/lib/verify";
import { execute } from "~~/utils/quoter";
import { validateIntent } from "~~/utils/validate";

const Home: NextPage = () => {
  const { address, chainId } = useAccount();
  const [input, setInput] = useState("");
  const [intent, setIntent] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchQuote() {
      if (!intent) return;
      if (!intent || !intent.fromToken.length || !intent.toToken) {
        console.error("❌ Invalid intent:", intent);
        return;
      }

      try {
        await execute(intent, setStep, setError);
      } catch (error) {
        console.error("❌:", error);
      }
    }

    fetchQuote();
  }, [intent]);

  const handleIntent = async () => {
    if (!input.trim() || !address || !chainId) return;

    setLoading(true);
    setIntent(null);

    try {
      const data = await intentRequest(
        {
          message: input.trim(),
          wallet: address,
        },
        chainId,
      );
      console.log("Intent data:", data);
      if (validateIntent(data)) {
        setIntent(data);
      } else {
        setError("❌Analyze intent failed");
      }
    } catch (err: any) {
      setError("❌ Analyze intent failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setStep("Analyze intent");
      setError("");
      handleIntent();
    }
  };

  const showTips = () => {
    const stepExist = step.length !== 0;
    const errorExist = error.length !== 0;
    return stepExist || errorExist;
  };

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5 pt-20">
          <div>
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend"> What's your intent? </legend>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className=" w-full input "
                placeholder="Type here"
              />
            </fieldset>
            <div
              className={`flex items-center text-sm transition-opacity duration-300 ${
                showTips() ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {"-> "}
              <span className={`ml-2 mr-2 ${error.length !== 0 ? "text-red-600 font-semibold" : ""}`}>
                {error.length === 0 ? step : error}
              </span>

              {error.length == 0 && step.length > 0 && (
                <progress className="progress" style={{ width: "70%" }}></progress>
              )}
            </div>
          </div>

          <p className="text-center text-lg">The universal executor of on-chain intent.</p>
          <p className="text-center text-lg">Swap, transfer, stake, claim, and more — all triggered by what you say.</p>
        </div>
      </div>
    </>
  );
};

export default Home;
