"use client";

import AuthenticationChecker from "@/components/AuthenticationChecker";
import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useSmartAccount } from "../hooks/SmartAccountContext";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getChainId } from "@/functions/chain/get.id";
import { DCASwapInterval } from "@balmy/sdk";
import { polygon } from "viem/chains";
import { USDC_ADDRESSES } from "@/constants/addresses";
import { usdcToWBTC } from "@/functions/dca/deposit_usdc";
import { getPositions } from "@/functions/dca/get_positions";
import { BalmyProvider } from "@/providers/balmy.provider";
import { terminatePosition } from "@/functions/dca/terminate_position";
import { withdrawPosition } from "@/functions/dca/withdraw_position";
import { Contract } from "ethers";
import { getUsdcBalance } from "@/functions/usdc/balance";

const ProtectedPage = () => {
  const { logout } = usePrivy();
  const { smartAccountAddress, eoa, smartAccountClient } = useSmartAccount();
  const [balance, setBalance] = useState<any>();
  const chainId = getChainId();

  const usdcAbi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function approve(address spender, uint256 amount) public returns (bool)",
  ];
  const provider = new ethers.JsonRpcProvider(polygon.rpcUrls.default.http[0]);
  const usdcContract = new ethers.Contract(
        USDC_ADDRESSES[chainId],
        usdcAbi,
        provider,
      );
  useEffect(() => {
    if (!smartAccountAddress) return;

    if (usdcContract) {
      getUsdcBalance(usdcContract, smartAccountAddress, setBalance);
    }

    console.log("smartAccountClient ", smartAccountClient);
    console.log("contract ", usdcContract);
    if (smartAccountClient && usdcContract) {
      (async () => {
        const balmy = new BalmyProvider(smartAccountClient, usdcContract);
        await usdcToWBTC(
          balmy,
          chainId,
          smartAccountAddress,
          DCASwapInterval.ONE_MINUTE,
          "1",
          "1",
        );
        const positions = await getPositions(balmy, smartAccountAddress);
        for (const position of positions[polygon.id]) {
          console.log(position);
          // const withdraw = await withdrawPosition(balmy, position);
          // const terminate = await terminatePosition(balmy, position);
        }
      })();
    }
  }, [smartAccountAddress, smartAccountClient]);

  // useEffect (() => {
  //     console.log("balance", balance)
  // }, [balance])

  return (
    <AuthenticationChecker>
      <div>
        <h1>Smart Account address: {smartAccountAddress}</h1>
        <p>balance: {balance && balance}</p>
        <button onClick={logout}>Logout</button>
      </div>
    </AuthenticationChecker>
  );
};

export default ProtectedPage;
