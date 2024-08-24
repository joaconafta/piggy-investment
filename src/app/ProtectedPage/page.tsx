"use client";

import AuthenticationChecker from "@/components/AuthenticationChecker";
import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useSmartAccount } from "../hooks/SmartAccountContext";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { BalmyProvider } from "@/providers/balmy.provider";
import { getChainId } from "@/functions/chain/get.id";
import { USDC, WBTC } from "@/constants/tokens";
import { Chains, DCASwapInterval } from "@balmy/sdk";
import { polygon } from "viem/chains";
import { USDC_ADDRESSES } from "@/constants/addresses";

const ProtectedPage = () => {
  const { logout } = usePrivy();
  const { smartAccountAddress, eoa, smartAccountClient } = useSmartAccount();
  const [balance, setBalance] = useState<any>();
  const chainId = getChainId();

  useEffect(() => {
    if (!smartAccountAddress) return;
    const usdcAbi = [
      "function balanceOf(address owner) view returns (uint256)",
    ];

    async function doTransaction(
      account: string,
      chainId: number,
      swapInterval: DCASwapInterval,
      swapsAmount: string,
      totalAmount: string,
    ) {
      const balmy = new BalmyProvider(smartAccountClient);
      const doTransaction = await balmy.positionProvider.depositSafe({
        account,
        chainId,
        from: USDC(chainId),
        to: WBTC(chainId),
        swapInterval,
        swapsAmount,
        amount: totalAmount,
      });
      console.log(doTransaction);
    }

    async function getUSDCBalance(
      provider: ethers.ContractRunner | null | undefined,
      usdcContractAddress: string | ethers.Addressable,
    ) {
      try {
        // Crear instancia del contrato de USDC
        const usdcContract = new ethers.Contract(
          usdcContractAddress,
          usdcAbi,
          provider,
        );
        // Obtener el balance de USDC del Safe smart account
        const usdcBalance = await usdcContract.balanceOf(
          smartAccountAddress as `0x${string}`,
        );
        return usdcBalance;
      } catch (error) {
        console.error("Error al obtener el balance de USDC", error);
      }
    }
    const provider = new ethers.JsonRpcProvider(
      polygon.rpcUrls.default.http[0],
    );
    getUSDCBalance(provider, USDC_ADDRESSES[chainId]).then((balance) =>
      console.log("balance", balance),
    );

    if (smartAccountClient) {
      doTransaction(
        smartAccountAddress,
        chainId,
        DCASwapInterval.ONE_MINUTE,
        "1",
        "1",
      );
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
